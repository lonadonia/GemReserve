"use client";

import { useEffect, useRef, useState } from "react";

import { LineIcon, type IconName } from "@/components/icons/LineIcon";

interface Metric {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly detail?: string;
}

// A value with no digit in it is a status word, not a figure: "Listed",
// "Pending". The figure type is 2.17rem and white-space: nowrap, which a word
// overflows in a six-column strip, so those cards are marked for the smaller,
// wrapping treatment in globals.css. Nothing else about the card changes —
// same icon, same position, same panel.
const metricIcons: readonly IconName[] = [
  "diamond",
  "certificate",
  "token",
  "vault",
  "globe",
  "refresh",
];

function AnimatedValue({ value }: { readonly value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!match) return;
    const target = Number(match[2].replaceAll(",", ""));
    if (!Number.isFinite(target)) return;
    const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const started = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - started) / 1100);
        const eased = 1 - (1 - progress) ** 3;
        const current = target * eased;
        setDisplay(
          `${match[1]}${current.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${match[3]}`,
        );
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

export function MetricStrip({
  metrics,
  className = "",
}: {
  readonly metrics: readonly Metric[];
  readonly className?: string;
}) {
  return (
    <dl className={`metric-strip ${className}`.trim()}>
      {metrics.map((metric, index) => (
        <div
          className={
            /\d/.test(metric.value)
              ? "metric-item"
              : "metric-item metric-item--textual"
          }
          key={metric.id}
        >
          <LineIcon name={metricIcons[index % metricIcons.length]} size={34} />
          <div>
            <dt>
              <AnimatedValue value={metric.value} />
            </dt>
            <dd>
              {metric.label}
              {metric.detail ? <small>{metric.detail}</small> : null}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
