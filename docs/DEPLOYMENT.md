# Deployment

Deploying GemReserve.io to a Linux production server.

**Stack:** Next.js 16.3.1 App Router, React 19, TypeScript. All 46 pages are statically prerendered.

---

## Choose a deployment model

Every page is static. One API route (`/api/forms`) is dynamic. That gives two options:

|                           | **A — Node server** (recommended) | **B — Static files**                         |
| ------------------------- | --------------------------------- | -------------------------------------------- |
| Serves                    | `next start` behind Nginx         | Nginx serves the build output directly       |
| Lead forms                | Can be enabled                    | **Not possible** — no server to receive them |
| Security headers          | From `next.config.ts`             | From Nginx only                              |
| Process manager           | systemd required                  | None                                         |
| Future backend, auth, KYC | Ready                             | Requires migrating to A                      |

**Take model A** unless there is a specific reason not to. It costs one systemd unit and keeps every forward path open. The rest of this document assumes A; §8 covers B.

---

## 1. Server prerequisites

- Ubuntu 22.04 LTS or Debian 12
- **Node.js ≥ 20.9.0** (`engines` in `package.json`); Node 22 LTS recommended
- Nginx
- A non-root user, e.g. `gemreserve`
- Certbot for TLS

```bash
sudo adduser --system --group --home /srv/gemreserve gemreserve
sudo apt install -y nginx
```

---

## 2. Get the code

```bash
sudo -u gemreserve -H bash
cd /srv/gemreserve
# --depth 1 matters here. The repository tracks ~448 MB of source artwork and
# QA screenshots, and full history is ~1.1 GB; a shallow clone pulls only the
# tip. Use --depth 1 again on each deploy, or fetch a specific tag.
git clone --depth 1 https://github.com/lonadonia/GemReserve.git app
cd app
```

> The build needs `assets/masters/` only if images are being regenerated
> (`npm run assets`). A routine deploy does not regenerate them — the derivatives
> in `public/images/` are already committed.

---

## 3. Environment

```bash
cp .env.example .env.local
$EDITOR .env.local
chmod 600 .env.local     # contains secrets once forms are enabled
```

For a first deployment, setting `NEXT_PUBLIC_SITE_URL` is sufficient. See `ENVIRONMENT.md`.

> **Staging hosts must set `NEXT_PUBLIC_ALLOW_INDEXING=false`.**

---

## 4. Install and build

```bash
npm ci                # exact lockfile install; do not use `npm install`
npm run typecheck
npm run build
```

`npm ci` deletes `node_modules` and installs from `package-lock.json`, so the build is reproducible.

> `NEXT_PUBLIC_*` values are **compiled in at build time**. Changing one requires a rebuild, not just a restart.

### Verify locally before exposing it

```bash
npm run start          # http://127.0.0.1:3000
curl -I http://127.0.0.1:3000/                      # expect 200 + headers
curl -o /dev/null -s -w "%{http_code}\n" http://127.0.0.1:3000/no-such-page   # expect 404
```

---

## 5. systemd

`/etc/systemd/system/gemreserve.service`:

```ini
[Unit]
Description=GemReserve.io
After=network.target

[Service]
Type=simple
User=gemreserve
Group=gemreserve
WorkingDirectory=/srv/gemreserve/app
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
EnvironmentFile=/srv/gemreserve/app/.env.local
ExecStart=/usr/bin/node ./node_modules/next/dist/bin/next start
Restart=on-failure
RestartSec=5

# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/gemreserve/app/.next
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictSUIDSGID=true

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gemreserve
sudo systemctl status gemreserve
```

`HOSTNAME=127.0.0.1` binds to loopback only — the app is reachable solely through Nginx.

---

## 6. Nginx

`/etc/nginx/sites-available/gemreserve`:

```nginx
limit_req_zone $binary_remote_addr zone=forms:10m rate=10r/m;

server {
    listen 80;
    listen [::]:80;
    server_name gemreserve.io www.gemreserve.io;
    return 301 https://gemreserve.io$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.gemreserve.io;
    ssl_certificate     /etc/letsencrypt/live/gemreserve.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gemreserve.io/privkey.pem;
    return 301 https://gemreserve.io$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name gemreserve.io;

    ssl_certificate     /etc/letsencrypt/live/gemreserve.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gemreserve.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    # Next already sets these; Nginx repeats them so a misconfiguration
    # upstream cannot silently drop them. Keep in step with next.config.ts.
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;
    # Prefer precompressed Brotli if the module is available.
    # brotli on;
    # brotli_types text/plain text/css application/javascript application/json image/svg+xml;

    client_max_body_size 1m;

    # Fingerprinted build output — immutable.
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
    }

    # The real rate limit for the form endpoint. The in-process limiter in the
    # route handler is a per-instance floor, not a substitute for this.
    location /api/forms {
        limit_req zone=forms burst=5 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/gemreserve /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d gemreserve.io -d www.gemreserve.io
```

> `X-Forwarded-For` must be set: the API route reads it for rate limiting. Without it every visitor shares one bucket.

**HSTS preload** is _not_ enabled above. Add `; preload` and submit to hstspreload.org only once HTTPS is confirmed working on the apex and every subdomain — it is difficult to reverse.

---

## 7. Redeploy

```bash
cd /srv/gemreserve/app
git fetch origin
git checkout <tag-or-sha>
npm ci
npm run typecheck && npm run build
sudo systemctl restart gemreserve
```

Build first, restart second: the running instance keeps serving until the new build is ready.

---

## 8. Static-only alternative (model B)

Add `output: "export"` to `next.config.ts` and `npm run build` writes `out/`. Then:

- `/api/forms` **stops existing** — forms permanently stay in preview state
- `next.config.ts` `headers()` **stops applying** — Nginx must carry every header from §6 _plus_ the full `Content-Security-Policy`
- `next/image` optimisation must be disabled

Serve `out/` with `try_files $uri $uri.html $uri/index.html /404.html;`.

---

## 9. Rollback

Tag every release:

```bash
git tag -a v1.0.0 -m "Production release" && git push origin v1.0.0
```

Roll back:

```bash
cd /srv/gemreserve/app
git checkout v0.9.0
npm ci && npm run build
sudo systemctl restart gemreserve
```

Keeping the previous build in a sibling directory and swapping a symlink makes rollback near-instant; the commands above are the minimum that always works.

---

## 10. Logs and health

```bash
sudo journalctl -u gemreserve -f          # application
sudo tail -f /var/log/nginx/error.log     # proxy
```

Post-deploy checks:

```bash
curl -I https://gemreserve.io                       # 200 + headers
curl -s -o /dev/null -w "%{http_code}\n" \
     https://gemreserve.io/no-such-page              # 404
curl -s https://gemreserve.io/robots.txt            # correct host, no Disallow: /
curl -s https://gemreserve.io/sitemap.xml | head    # correct origin
```

Then in a browser: load `/`, hard-refresh a deep route such as `/natural-rough-emerald`, use Back and Forward, and confirm the console is clean.

There is no `/api/health` endpoint — the site is static, so a `200` on `/` is a sufficient liveness check for an uptime monitor.
