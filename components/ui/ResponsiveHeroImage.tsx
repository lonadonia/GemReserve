interface ResponsiveHeroImageProps {
  readonly desktopBase: string;
  readonly mobileBase: string;
  readonly className?: string;
  /**
   * Intrinsic size of the desktop export. Heroes are cut at the ratio of the box
   * they sit in, so the Assets hero is taller than the other two and has to
   * declare its own size to avoid a layout shift.
   */
  readonly width?: number;
  readonly height?: number;
}

export function ResponsiveHeroImage({
  desktopBase,
  mobileBase,
  className = "",
  width = 1920,
  height = 960,
}: ResponsiveHeroImageProps) {
  return (
    <picture className="hero__picture">
      <source
        media="(max-width: 760px)"
        type="image/avif"
        srcSet={`${mobileBase}.avif`}
      />
      <source
        media="(max-width: 760px)"
        type="image/webp"
        srcSet={`${mobileBase}.webp`}
      />
      <source type="image/avif" srcSet={`${desktopBase}.avif`} />
      <source type="image/webp" srcSet={`${desktopBase}.webp`} />
      <img
        className={`hero__image ${className}`.trim()}
        src={`${desktopBase}.webp`}
        alt=""
        width={width}
        height={height}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
