import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "reference/**",
    "qa/**",
    "assets/masters/**",
    // Deployment packages are copies of already-linted source. Linting them
    // reports every finding twice and, worse, keeps reporting a stale copy of a
    // file that has since been fixed.
    "dist/**",
  ]),
]);
