const WIDTH = 460;
const HEIGHT = 250;
// The left pad clears both the tick labels and the half of the first year
// label that sits left of the axis origin.
const PAD = { top: 14, right: 22, bottom: 34, left: 42 };

/**
 * The market figure the Emerald board draws: a rising line over six years with
 * the last point marked projected, its area shaded beneath.
 *
 * The board's y-axis label is illegible in the reference and no unit is readable
 * anywhere on it, so the axis is drawn as an unlabelled index and the caption
 * beneath says so. Reproducing the shape is faithful; inventing a market size in
 * dollars would not be.
 */
export function MarketTrend({
  points,
  projectedFrom,
  caption,
  label,
}: {
  readonly points: readonly { readonly year: string; readonly value: number }[];
  readonly projectedFrom: string;
  readonly caption: string;
  /** Names the figure for anyone who cannot see it. */
  readonly label: string;
}) {
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  // The axis runs to the next whole step above the highest point, so the line
  // never touches the top of the box.
  const max = Math.ceil(Math.max(...points.map((p) => p.value)) / 2) * 2;
  const ticks = Array.from({ length: max / 2 + 1 }, (_, i) => i * 2);

  const x = (index: number) =>
    PAD.left + (index / (points.length - 1)) * plotWidth;
  const y = (value: number) => PAD.top + (1 - value / max) * plotHeight;

  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  const area = `${PAD.left},${PAD.top + plotHeight} ${line} ${PAD.left + plotWidth},${PAD.top + plotHeight}`;

  return (
    <figure className="market-trend">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="market-trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2fbd84" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#2fbd84" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotWidth}
              y1={y(tick)}
              y2={y(tick)}
              className="market-trend__grid"
            />
            <text
              x={PAD.left - 9}
              y={y(tick)}
              className="market-trend__tick"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {tick}
            </text>
          </g>
        ))}

        <polygon points={area} fill="url(#market-trend-fill)" />
        <polyline points={line} className="market-trend__line" />

        {points.map((point, index) => (
          <g key={point.year}>
            <circle
              cx={x(index)}
              cy={y(point.value)}
              r={4}
              className="market-trend__dot"
            />
            <text
              x={x(index)}
              y={HEIGHT - 12}
              className="market-trend__year"
              textAnchor="middle"
            >
              {point.year}
              {point.year === projectedFrom ? "*" : ""}
            </text>
          </g>
        ))}
      </svg>

      <figcaption>{caption}</figcaption>
    </figure>
  );
}
