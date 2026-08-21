import Image from "next/image";
import type { CSSProperties } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface LifecycleStage {
  readonly id: string;
  readonly order: number;
  readonly title: string;
  readonly description: string;
}

const lifecycleIcons: Record<string, IconName> = {
  source: "source",
  verify: "search",
  vault: "vault",
  tokenize: "token",
  trade: "chart",
  redeem: "redeem",
};

export function LifecycleDiagram({
  stages,
}: {
  readonly stages: readonly LifecycleStage[];
}) {
  return (
    <div className="lifecycle-diagram">
      <div className="lifecycle-desktop" aria-hidden="true">
        <svg
          className="lifecycle-connectors"
          viewBox="0 0 600 600"
          role="presentation"
        >
          <defs>
            <marker
              id="lifecycle-arrow"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="5"
              refY="3"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="currentColor" />
            </marker>
          </defs>
          <circle
            cx="300"
            cy="300"
            r="212"
            fill="none"
            stroke="currentColor"
            strokeDasharray="200 16"
            strokeWidth="2"
            markerEnd="url(#lifecycle-arrow)"
          />
        </svg>
        <Image
          src="/brand/gemreserve-shield-512.png"
          alt=""
          width={512}
          height={624}
          className="lifecycle-crest"
        />
      </div>
      <ol>
        {stages.map((stage, index) => (
          <li
            key={stage.id}
            style={{ "--stage-index": index } as CSSProperties}
          >
            <span>
              <LineIcon
                name={lifecycleIcons[stage.id] ?? "diamond"}
                size={28}
              />
            </span>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
