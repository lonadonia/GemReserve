import Image from "next/image";

/**
 * A cut-out plate standing in for the line icon a section used to carry.
 *
 * The four sections that use these — the KYC process, the enterprise process,
 * the investor executive overview and the governance principles — all draw the
 * plate at the head of a card, so the sizing and the hover lift live here rather
 * than being restated in four stylesheets.
 */
export function SectionPlate({
  name,
  alt,
  className = "",
  sizes = "(max-width: 760px) 76px, (max-width: 1240px) 62px, 76px",
}: {
  readonly name: string;
  readonly alt: string;
  readonly className?: string;
  readonly sizes?: string;
}) {
  return (
    <Image
      className={`section-plate ${className}`.trim()}
      src={`/images/plates/${name}.webp`}
      alt={alt}
      width={300}
      height={300}
      sizes={sizes}
    />
  );
}
