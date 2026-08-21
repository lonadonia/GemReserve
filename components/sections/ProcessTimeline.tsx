import Image from "next/image";
import type { CSSProperties } from "react";

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

/**
 * Maps a step onto its plate. Both processes describe the same journey, so the
 * nine How It Works steps reuse the eight Home plates; only the closing
 * transparency step has no counterpart and takes the brand crest instead.
 */
function plateForStep(id: string): { src: string; alt: string } {
  if (id.includes("source")) {
    return { src: "source", alt: "A faceted blue gemstone" };
  }
  if (id.includes("verify") || id.includes("gemological")) {
    return { src: "verify", alt: "A laboratory microscope" };
  }
  if (id.includes("appraise") || id.includes("passport")) {
    return { src: "appraise", alt: "A sealed certificate of appraisal" };
  }
  if (id.includes("custody") || id.includes("vault")) {
    return { src: "custody", alt: "A closed steel vault door" };
  }
  if (id.includes("token")) {
    return { src: "tokenize", alt: "A gold GemReserve token" };
  }
  if (id.includes("own") || id.includes("marketplace")) {
    return { src: "own", alt: "A phone showing the GemReserve crest" };
  }
  if (id.includes("trade") || id.includes("growth")) {
    return { src: "trade", alt: "A rising gold bar chart" };
  }
  if (id.includes("redeem") || id.includes("liquidity")) {
    return { src: "redeem", alt: "An open case of gemstones" };
  }
  if (id.includes("transparency")) {
    return { src: "transparency", alt: "The GemReserve crest" };
  }
  return { src: "source", alt: "A faceted blue gemstone" };
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
          <Image
            className="process-plate"
            src={`/images/process/${plateForStep(item.id).src}.webp`}
            alt={plateForStep(item.id).alt}
            width={400}
            height={400}
            sizes="(max-width: 760px) 74px, (max-width: 1240px) 100px, 116px"
          />
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
