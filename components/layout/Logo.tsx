import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { readonly compact?: boolean }) {
  return (
    <Link
      className={`brand-logo${compact ? " brand-logo--compact" : ""}`}
      href="/"
    >
      <Image
        src="/brand/gemreserve-horizontal.svg"
        alt="GemReserve.io — Own. Trade. Redeem."
        width={392}
        height={112}
        priority
      />
    </Link>
  );
}
