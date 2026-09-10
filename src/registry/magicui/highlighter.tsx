"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Action = "highlight" | "underline" | "box" | "circle" | "strike-through";

export function Highlighter({
  children,
  action = "highlight",
  color,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  action?: Action;
  color?: string;
  className?: string;
  delay?: number;
}) {
  const resolvedColor =
    color ?? (action === "underline" ? "var(--highlight-underline)" : "var(--highlight-highlight)");
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setActive(true), delay);
          obs.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const isHighlight = action === "highlight";
  const isUnderline = action === "underline";

  return (
    <span ref={ref} className={cn("relative inline", className)}>
      <span className="relative z-10">{children}</span>
      {isHighlight ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 h-[0.9em] rounded-sm"
          style={{
            backgroundColor: resolvedColor,
            opacity: 0.45,
            transform: active ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      ) : null}
      {isUnderline ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full rounded-full"
          style={{
            backgroundColor: resolvedColor,
            transform: active ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1) 120ms",
          }}
        />
      ) : null}
      {action !== "highlight" && action !== "underline" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 rounded-sm border-2"
          style={{
            borderColor: resolvedColor,
            opacity: active ? 1 : 0,
            transition: "opacity 500ms ease",
          }}
        />
      ) : null}
    </span>
  );
}
