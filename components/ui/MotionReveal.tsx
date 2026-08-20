"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function MotionReveal({
  children,
  className = "",
  delay = 0,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0.1 },
    );
    let observeFrame = 0;
    const setupFrame = requestAnimationFrame(() => {
      element.dataset.motionReady = "true";
      element.classList.remove("is-visible");
      observeFrame = requestAnimationFrame(() => observer.observe(element));
    });

    return () => {
      cancelAnimationFrame(setupFrame);
      cancelAnimationFrame(observeFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-reveal is-visible ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
