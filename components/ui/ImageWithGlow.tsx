import Image from "next/image";

export function ImageWithGlow({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  narrowSrc,
}: {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly priority?: boolean;
  readonly sizes?: string;
  /**
   * Served below 760px, where the frame is far squarer than the wide plate.
   * Supplying one swaps to a plain <picture>, because next/image cannot carry
   * an art-directed source and these plates are already optimised on disk.
   */
  readonly narrowSrc?: string;
}) {
  return (
    <div className={`image-with-glow ${className}`.trim()}>
      {narrowSrc ? (
        <picture>
          <source
            media="(max-width: 760px)"
            type="image/avif"
            srcSet={narrowSrc.replace(/\.webp$/, ".avif")}
          />
          <source media="(max-width: 760px)" srcSet={narrowSrc} />
          <source type="image/avif" srcSet={src.replace(/\.webp$/, ".avif")} />
          <img src={src} alt={alt} decoding="async" loading="lazy" />
        </picture>
      ) : (
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} />
      )}
      <span className="image-glint" aria-hidden="true" />
    </div>
  );
}
