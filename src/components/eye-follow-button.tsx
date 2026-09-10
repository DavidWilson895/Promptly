"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function EyeFollowButton({
  children,
  className,
  eyeSize = 24,
  pupilSize = 9,
  eyeGap = 4,
  eyeColor = "#FFFFFF",
  pupilColor = "#000000",
  speed = 420,
  range = 85,
  isPasswordFocused = false,
  passwordLength = 0,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  eyeSize?: number;
  pupilSize?: number;
  eyeGap?: number;
  eyeColor?: string;
  pupilColor?: string;
  speed?: number;
  range?: number;
  isPasswordFocused?: boolean;
  passwordLength?: number;
}) {
  const containerRef = React.useRef<HTMLButtonElement>(null);
  const eyesRef = React.useRef<HTMLDivElement>(null);
  const [leftPos, setLeftPos] = React.useState({ x: 0, y: 0 });
  const [rightPos, setRightPos] = React.useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = React.useState(false);

  const maxDist = React.useMemo(
    () => ((eyeSize - pupilSize) / 2) * (range / 100),
    [eyeSize, pupilSize, range]
  );

  // follow mouse when not shy
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (isPasswordFocused) return;
      if (!eyesRef.current) return;
      const rect = eyesRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const halfGap = eyeGap / 2;
      const calc = (offsetX: number) => {
        const rx = mouseX - offsetX;
        const ry = mouseY;
        const dist = Math.hypot(rx, ry);
        if (dist === 0) return { x: 0, y: 0 };
        const clamped = Math.min(dist, maxDist);
        const angle = Math.atan2(ry, rx);
        return { x: Math.cos(angle) * clamped, y: Math.sin(angle) * clamped };
      };

      setLeftPos(calc(-halfGap));
      setRightPos(calc(halfGap));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [eyeGap, maxDist, isPasswordFocused]);

  // look away when password focused
  React.useEffect(() => {
    if (!isPasswordFocused) return;
    const away = { x: -maxDist * 0.6, y: maxDist * 0.55 };
    setLeftPos(away);
    setRightPos(away);
  }, [isPasswordFocused, maxDist]);

  // natural human-like blink every 2.5-4.5s
  React.useEffect(() => {
    let timeout = 0;
    const schedule = () => {
      const delay = 2500 + Math.random() * 2000;
      timeout = window.setTimeout(() => {
        setIsBlinking(true);
        window.setTimeout(() => setIsBlinking(false), 110);
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, []);

  const pupilStyle = (pos: { x: number; y: number }) =>
    ({
      width: pupilSize,
      height: pupilSize,
      borderRadius: "50%",
      backgroundColor: pupilColor,
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      transition: `transform 0.09s ease-out`,
    }) as React.CSSProperties;

  return (
    <button
      ref={containerRef}
      className={cn(
        "relative inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-[16px] font-medium text-background shadow-sm transition-colors hover:bg-foreground/90 active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <span className="mx-auto">{children}</span>
      <span
        ref={eyesRef}
        className="absolute left-3 inline-flex items-center justify-center"
        style={{ gap: eyeGap, width: eyeSize * 2 + eyeGap, height: eyeSize }}
        aria-hidden="true"
      >
        {[leftPos, rightPos].map((pos, i) => (
          <span
            key={i}
            className="relative flex items-center justify-center overflow-hidden rounded-full"
            style={{
              width: eyeSize,
              height: eyeSize,
              backgroundColor: eyeColor,
            }}
          >
            <span
              style={{
                ...pupilStyle(pos),
                opacity: isBlinking ? 0 : 1,
                transition: isBlinking
                  ? "opacity 70ms ease, transform 70ms ease"
                  : "opacity 120ms ease, transform 0.09s ease-out",
              }}
            />
            {/* realistic upper lid */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 bg-foreground"
              style={{
                height: isBlinking ? "100%" : "0%",
                transition: isBlinking
                  ? "height 80ms cubic-bezier(0.6,0,0.8,1)"
                  : "height 110ms cubic-bezier(0.2,0,0.4,1)",
                borderRadius: isBlinking ? "50%" : "0",
              }}
            />
          </span>
        ))}
      </span>
    </button>
  );
}
