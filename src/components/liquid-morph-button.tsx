"use client";

import * as React from "react";

export function LiquidMorphButton({
  label = "Sign in",
  onClick,
  className,
  style,
  padding = "8px 16px",
  radius = "999px",
  backgroundColor = "#0A0A0A",
  textColor = "#FFFFFF",
  blobColor = "#FFFFFF",
  hoverTextColor = "#0A0A0A",
  shadow = "none",
  blobSize = 22,
  blobSpacing = 32,
  blobBottomOffset = 28,
  blobRise = 180,
  blobScale = 3.2,
  hoverDelayStep = 45,
  transitionDuration = 480,
  blobTransitionDuration = 620,
}: {
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  padding?: string;
  radius?: string;
  backgroundColor?: string;
  textColor?: string;
  blobColor?: string;
  hoverTextColor?: string;
  shadow?: string;
  blobSize?: number;
  blobSpacing?: number;
  blobBottomOffset?: number;
  blobRise?: number;
  blobScale?: number;
  hoverDelayStep?: number;
  transitionDuration?: number;
  blobTransitionDuration?: number;
}) {
  const id = React.useId().replace(/:/g, "");
  const rootClass = `lmb_${id}`;
  const filterId = `goo_${id}`;

  const css = `
.${rootClass} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${padding};
  border-radius: ${radius};
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  user-select: none;
  background: ${backgroundColor};
  color: ${textColor};
  box-shadow: ${shadow};
  transition: color ${transitionDuration}ms cubic-bezier(0.23, 1, 0.32, 1);
  border: 0;
  outline: none;
}
.${rootClass}:focus-visible { box-shadow: 0 0 0 3px rgba(0,0,0,0.18), ${shadow}; }
.${rootClass} .lmb_label { position: relative; z-index: 2; transition: color ${transitionDuration}ms cubic-bezier(0.23, 1, 0.32, 1); font-size: 14px; font-weight: 500; letter-spacing: -0.01em; }
.${rootClass} .lmb_bg { position: absolute; inset: 0; z-index: 1; filter: url(#${filterId}); pointer-events: none; }
.${rootClass} .lmb_blob { position: absolute; width: ${blobSize}px; height: ${blobSize}px; border-radius: 999px; background: ${blobColor}; bottom: ${-Math.abs(blobBottomOffset)}px; transform: translateY(0) scale(0); transition: transform ${blobTransitionDuration}ms cubic-bezier(0.23, 1, 0.32, 1); will-change: transform; }
.${rootClass} .lmb_blob:nth-child(1) { left: calc(50% - ${blobSpacing}px); transition-delay: 0ms; transform: translateX(-50%) translateY(0) scale(0); }
.${rootClass} .lmb_blob:nth-child(2) { left: 50%; transition-delay: ${hoverDelayStep}ms; transform: translateX(-50%) translateY(0) scale(0); }
.${rootClass} .lmb_blob:nth-child(3) { left: calc(50% + ${blobSpacing}px); transition-delay: ${hoverDelayStep * 2}ms; transform: translateX(-50%) translateY(0) scale(0); }
.${rootClass}:hover { color: ${hoverTextColor}; }
.${rootClass}:hover .lmb_blob { transform: translateX(-50%) translateY(-${blobRise}%) scale(${blobScale}); }
@media (prefers-reduced-motion: reduce) { .${rootClass}, .${rootClass} .lmb_label, .${rootClass} .lmb_blob { transition: none !important; } }
`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={rootClass + (className ? ` ${className}` : "")}
      style={{ position: "relative", overflow: "hidden", isolation: "isolate", ...style }}
    >
      <style>{css}</style>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <span className="lmb_bg" aria-hidden="true">
        <span className="lmb_blob" />
        <span className="lmb_blob" />
        <span className="lmb_blob" />
      </span>
      <span className="lmb_label">{label}</span>
    </button>
  );
}
