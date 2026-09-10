"use client";

import * as React from "react";

const DEFAULT_STOPS = [
  { offset: 0, color: "#340B05" },
  { offset: 0.1827, color: "#0358F7" },
  { offset: 0.2837, color: "#5092C7" },
  { offset: 0.4135, color: "#E1ECFE" },
  { offset: 0.5866, color: "#FFD400" },
  { offset: 0.6827, color: "#FA3D1D" },
  { offset: 0.8029, color: "#FD02F5" },
  { offset: 1, color: "rgba(255, 192, 253, 0)" },
];

const VBW = 1271;
const VBH = 599;

function bellHeights(n: number, peak: number, valley: number) {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid;
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

export function DiaFooter({ className }: { className?: string }) {
  const rawId = React.useId();
  const safeId = rawId.replace(/:/g, "-");
  const gradId = `karim-grad-${safeId}`;
  const blurId = `karim-blur-${safeId}`;
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = React.useState(0);

  const [breathing, setBreathing] = React.useState(false);
  const [phase, setPhase] = React.useState(0);

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setScaleY(1);
      return;
    }
    let a = 0;
    let b = 0;
    setScaleY(0);
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => {
        setScaleY(1);
        setTimeout(() => setBreathing(true), 1200);
      });
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);

  // continuous wave phase
  React.useEffect(() => {
    if (!breathing) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let raf = 0;
    let p = 0;
    const loop = () => {
      p += 0.025;
      setPhase(p);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [breathing]);

  // Signature preset values
  const activeBars = 9;
  const activeOverlap = 23;
  const activeBlur = 15;
  const activePeak = 0.98;
  const activeValley = 0.55;
  const activeSpread = 1;
  const activeOpacity = 1;

  const safeBarCount = Math.max(3, Math.min(25, activeBars));
  const baseHeights = bellHeights(safeBarCount, activePeak, activeValley);
  // wave: 6% amplitude, phase steps per bar to create horizontal travelling wave
  const heights = breathing
    ? baseHeights.map((h, i) => h * (1 + 0.07 * Math.sin(phase + i * 0.85)))
    : baseHeights;
  const colW = (VBW * activeSpread) / safeBarCount;
  const startOffsetX = (VBW - VBW * activeSpread) / 2;
  const overlapMultiplier = 1 + activeOverlap / 100;

  return (
    <>
      <style>{`@keyframes diaBreath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.04)}}`}</style>
      <div
        ref={wrapRef}
        className={className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          opacity: activeOpacity,
          transformOrigin: "bottom",
          transform: `scaleY(${scaleY})`,
          transition: breathing ? undefined : "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
          animation: breathing ? "diaBreath 4.5s ease-in-out infinite" : undefined,
          willChange: "transform",
        }}
        aria-hidden
      >
      <svg
        style={{ width: "100%", height: "100%" }}
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            {DEFAULT_STOPS.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
          <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={activeBlur} />
          </filter>
        </defs>
        {heights.map((h, i) => (
          <g key={i} filter={`url(#${blurId})`}>
            <rect
              x={startOffsetX + i * colW}
              y={VBH - h}
              width={colW * overlapMultiplier}
              height={h}
              fill={`url(#${gradId})`}
            />
          </g>
        ))}
      </svg>
      </div>
    </>
  );
}
