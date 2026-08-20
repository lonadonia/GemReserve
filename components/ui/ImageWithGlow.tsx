import Image from "next/image";

export function ImageWithGlow({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly priority?: boolean;
  readonly sizes?: string;
}) {
  return (
    <div className={`image-with-glow ${className}`.trim()}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} />
      <span className="image-glint" aria-hidden="true" />
    </div>
  );
}
