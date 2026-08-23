interface Tier {
  readonly id: string;
  readonly label: string;
  readonly members?: string;
  readonly tone: "dark" | "gold";
}

const VIEWBOX_WIDTH = 420;
const VIEWBOX_HEIGHT = 300;
const APEX_INSET = 0.5;

/**
 * The governance board draws its four tiers as a stacked pyramid. Each band is a
 * trapezoid cut from the same triangle, so the widths are derived from where the
 * band sits rather than hand-tuned: a band that runs from depth `a` to depth `b`
 * spans that fraction of the base at each edge. Four equal bands therefore stack
 * into an exact triangle at any size.
 *
 * The labels are real text in the flow of the SVG rather than baked artwork, so
 * they stay selectable, translatable and legible when the diagram scales down.
 */
function bandPoints(index: number, count: number) {
  const top = index / count;
  const bottom = (index + 1) / count;
  const half = VIEWBOX_WIDTH / 2;
  // The apex is clipped slightly so the top band reads as a band, not a spike.
  const width = (depth: number) =>
    half * (APEX_INSET + (1 - APEX_INSET) * depth);
  const y1 = top * VIEWBOX_HEIGHT;
  const y2 = bottom * VIEWBOX_HEIGHT;
  const w1 = width(top === 0 ? 0.34 : top);
  const w2 = width(bottom);
  return {
    points: `${half - w1},${y1} ${half + w1},${y1} ${half + w2},${y2} ${half - w2},${y2}`,
    centreY: (y1 + y2) / 2,
  };
}

export function GovernancePyramid({
  tiers,
  title,
}: {
  readonly tiers: readonly Tier[];
  readonly title: string;
}) {
  return (
    <svg
      className="governance-pyramid"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={`${title}: ${tiers.map((tier) => tier.label).join(", from the top down to ")}`}
    >
      <defs>
        <linearGradient id="governance-band" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0c76c" />
          <stop offset="55%" stopColor="#d89a27" />
          <stop offset="100%" stopColor="#a97418" />
        </linearGradient>
      </defs>

      {tiers.map((tier, index) => {
        const { points, centreY } = bandPoints(index, tiers.length);
        const gold = tier.tone === "gold";
        return (
          <g key={tier.id}>
            <polygon
              points={points}
              fill={gold ? "url(#governance-band)" : "#0b161d"}
              stroke={gold ? "rgb(255 236 190 / 45%)" : "rgb(216 154 39 / 55%)"}
              strokeWidth="1"
            />
            <text
              className={
                gold
                  ? "governance-pyramid__label governance-pyramid__label--on-gold"
                  : "governance-pyramid__label"
              }
              x={VIEWBOX_WIDTH / 2}
              y={tier.members ? centreY - 4 : centreY + 4}
              textAnchor="middle"
            >
              {tier.label}
            </text>
            {tier.members ? (
              <text
                className={
                  gold
                    ? "governance-pyramid__members governance-pyramid__members--on-gold"
                    : "governance-pyramid__members"
                }
                x={VIEWBOX_WIDTH / 2}
                y={centreY + 14}
                textAnchor="middle"
              >
                {tier.members}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
