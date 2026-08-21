import type { ProceedsSlice } from "@/content/investors";

/**
 * Use-of-proceeds ring. Part-to-whole over five slices, every slice directly
 * labelled beside the ring, so identity never rests on colour alone.
 *
 * The palette is ordered so the blue and the purple are not adjacent — as
 * neighbours they fail deuteranopia separation. In this order the whole set
 * clears the lightness band, the chroma floor, CVD separation, the
 * normal-vision floor and 3:1 contrast against the panel behind it.
 */
const SLICE_COLORS = [
  "#12a894",
  "#b98c26",
  "#a05cd8",
  "#d4574a",
  "#2f86b8",
] as const;

const SIZE = 168;
const STROKE = 30;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** A hair of surface between segments so neighbouring fills never touch. */
const GAP = 2;

export function ProceedsDonut({
  slices,
}: {
  readonly slices: readonly ProceedsSlice[];
}) {
  // Each segment starts where the previous one ended, so the running total is
  // resolved up front rather than accumulated while rendering.
  const segments = slices.map((slice, index) => {
    const length = (slice.percent / 100) * CIRCUMFERENCE;
    const start = slices
      .slice(0, index)
      .reduce(
        (total, prior) => total + (prior.percent / 100) * CIRCUMFERENCE,
        0,
      );
    const drawn = Math.max(0, length - GAP);
    return {
      id: slice.id,
      color: SLICE_COLORS[index % SLICE_COLORS.length],
      dash: `${drawn} ${CIRCUMFERENCE - drawn}`,
      offset: -start,
    };
  });

  return (
    <figure className="proceeds">
      <svg
        className="proceeds__ring"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        role="img"
        aria-label="Use of proceeds by share"
      >
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {segments.map((segment) => (
            <circle
              key={segment.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE}
              strokeDasharray={segment.dash}
              strokeDashoffset={segment.offset}
            />
          ))}
        </g>
      </svg>

      <figcaption>
        <ul className="proceeds__legend">
          {slices.map((slice, index) => (
            <li key={slice.id}>
              <span
                className="proceeds__swatch"
                style={{
                  background: SLICE_COLORS[index % SLICE_COLORS.length],
                }}
                aria-hidden="true"
              />
              <span className="proceeds__label">{slice.label}</span>
              <span className="proceeds__value">{slice.percent}%</span>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
