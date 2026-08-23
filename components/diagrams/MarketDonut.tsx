const SIZE = 220;
const STROKE = 30;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * The market figure the investor board draws: a thick ring with the headline
 * value at its centre, an accent arc sweeping anticlockwise from twelve
 * o'clock and the remainder in slate.
 *
 * The arc is drawn with a negative dash offset on a rotated circle rather than
 * an arc path, so the sweep is a single number rather than trigonometry, and it
 * cannot round its way into a gap at the seam.
 */
export function MarketDonut({
  value,
  label,
  accentPercent,
}: {
  readonly value: string;
  readonly label: string;
  readonly accentPercent: number;
}) {
  const accent =
    (Math.min(100, Math.max(0, accentPercent)) / 100) * CIRCUMFERENCE;

  return (
    <figure className="market-donut">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${value} ${label}`}
      >
        {/* The full ring is laid down first, so the accent only has to cover
            its own share and the two never leave a hairline between them. */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#22333c"
          strokeWidth={STROKE}
        />
        <circle
          className="market-donut__accent"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#3aa38f"
          strokeWidth={STROKE}
          strokeDasharray={`${accent} ${CIRCUMFERENCE - accent}`}
          /* -90 puts the start at twelve o'clock; the negative scale flips the
             sweep anticlockwise, which is the direction the board draws. */
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2}) scale(1 -1) translate(0 ${-SIZE})`}
        />
      </svg>

      <figcaption>
        <span className="market-donut__value">{value}</span>
        <span className="market-donut__label">{label}</span>
      </figcaption>
    </figure>
  );
}
