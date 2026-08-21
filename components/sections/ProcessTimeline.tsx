import type { CSSProperties } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface TimelineStep {
  readonly id: string;
  readonly step?: number;
  readonly order?: number;
  readonly title: string;
  readonly description: string;
}

/**
 * An optional grouping drawn above the steps. GemReserve's process is really two
 * halves — the stone is secured in the physical world, then represented in the
 * digital one — and labelling that split is what makes the row read as a story
 * rather than eight equal boxes.
 */
export interface TimelinePhase {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  /** How many steps this phase covers. */
  readonly span: number;
}

function iconForStep(id: string): IconName {
  if (id.includes("source")) return "hand-gem";
  if (id.includes("verify") || id.includes("gemological")) return "search";
  if (id.includes("appraise")) return "certificate";
  if (id.includes("custody") || id.includes("vault")) return "vault";
  if (id.includes("passport")) return "passport";
  if (id.includes("token")) return "cubes";
  if (id.includes("own")) return "phone";
  if (id.includes("trade") || id.includes("marketplace")) return "chart";
  if (id.includes("growth")) return "trade";
  if (id.includes("liquidity") || id.includes("redeem")) return "refresh";
  if (id.includes("transparency")) return "shield-check";
  return "diamond";
}

/** Maps each step index onto the phase that covers it. */
function phaseForIndex(phases: readonly TimelinePhase[], index: number) {
  let cursor = 0;
  for (const phase of phases) {
    cursor += phase.span;
    if (index < cursor) return phase;
  }
  return phases.at(-1);
}

export function ProcessTimeline({
  steps,
  dense = false,
  phases,
}: {
  readonly steps: readonly TimelineStep[];
  readonly dense?: boolean;
  readonly phases?: readonly TimelinePhase[];
}) {
  const list = (
    <ol
      className={`process-timeline${dense ? " process-timeline--dense" : ""}`}
    >
      {steps.map((item, index) => (
        <li
          key={item.id}
          data-phase={phases ? phaseForIndex(phases, index)?.id : undefined}
        >
          <div className="process-number">{item.step ?? item.order}</div>
          <LineIcon name={iconForStep(item.id)} size={dense ? 34 : 42} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );

  if (!phases) return list;

  return (
    <div className="process-flow">
      <div className="process-phases">
        {phases.map((phase) => (
          <div
            className="process-phase"
            data-phase={phase.id}
            key={phase.id}
            style={{ "--phase-span": phase.span } as CSSProperties}
          >
            <span className="process-phase__label">{phase.label}</span>
            <span className="process-phase__caption">{phase.caption}</span>
          </div>
        ))}
      </div>
      {list}
    </div>
  );
}
