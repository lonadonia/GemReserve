interface ResponsiveHeroImageProps {
  readonly desktopBase: string;
  readonly mobileBase: string;
  readonly className?: string;
}

export function ResponsiveHeroImage({
  desktopBase,
  mobileBase,
  className = "",
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
        width={1920}
        height={1080}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
