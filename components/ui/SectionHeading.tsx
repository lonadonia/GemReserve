interface SectionHeadingProps {
  readonly title: string;
  readonly id?: string;
  readonly eyebrow?: string;
  readonly align?: "left" | "center";
}

export function SectionHeading({
  title,
  id,
  eyebrow,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="section-heading-line" aria-hidden="true" />
      <h2 id={id}>{title}</h2>
      <div className="section-heading-line" aria-hidden="true" />
    </div>
  );
}
