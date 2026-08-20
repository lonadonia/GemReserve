import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface TimelineStep {
  readonly id: string;
  readonly step?: number;
  readonly order?: number;
  readonly title: string;
  readonly description: string;
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

export function ProcessTimeline({
  steps,
  dense = false,
}: {
  readonly steps: readonly TimelineStep[];
  readonly dense?: boolean;
}) {
  return (
    <ol
      className={`process-timeline${dense ? " process-timeline--dense" : ""}`}
    >
      {steps.map((item) => (
        <li key={item.id}>
          <div className="process-number">{item.step ?? item.order}</div>
          <LineIcon name={iconForStep(item.id)} size={dense ? 34 : 42} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
