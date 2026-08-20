import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface Pillar {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

const iconMap: Record<string, IconName> = {
  "physically-backed": "diamond",
  independent: "shield-check",
  institutional: "lock",
  global: "globe",
  transparent: "chart",
  redeemable: "refresh",
  "real-assets": "diamond",
  "trust-security": "shield-check",
  transparency: "eye",
  "global-access": "globe",
  "liquid-efficient": "refresh",
  "built-for-generations": "users",
  backed: "diamond",
  verified: "shield-check",
  borderless: "globe",
};

export function TrustPillars({
  items,
  className = "",
}: {
  readonly items: readonly Pillar[];
  readonly className?: string;
}) {
  return (
    <ul className={`trust-pillars ${className}`.trim()}>
      {items.map((item) => (
        <li key={item.id}>
          <LineIcon name={iconMap[item.id] ?? "diamond"} size={38} />
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
