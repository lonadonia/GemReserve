import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { readonly compact?: boolean }) {
  return (
    <Link
      className={`brand-logo${compact ? " brand-logo--compact" : ""}`}
      href="/"
    >
      <Image
        src="/brand/gemreserve-horizontal-1200.png"
        alt="GemReserve.io — Own. Trade. Redeem."
        width={2078}
        height={599}
        priority
        sizes="(max-width: 720px) 180px, 232px"
      />
    </Link>
  );
}
