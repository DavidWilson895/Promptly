"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Dot = {
  bx: number;
  by: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/**
 * Magnetic dot-grid background (Framer "Magnetic Grid BG" behavior):
 * dots within the influence radius are pushed away from the cursor on
 * springs, tint toward the active color, and scale up. Static on mobile
 * and for reduced-motion users.
 */
export function MagneticGrid({
  className,
  dotColor = "#94A3B8",
  activeColor = "#0EA5E9",
  dotSize = 3.5,
  dotSpacing = 24,
  dotOpacity = 0.7,
  influenceRadius = 130,
  attract = false,
  maxDisplace = 10,
  stiffness = 250,
  damping = 22,
}: {
  className?: string;
  dotColor?: string;
  activeColor?: string;
  dotSize?: number;
  dotSpacing?: number;
  dotOpacity?: number;
  influenceRadius?: number;
  attract?: boolean;
  maxDisplace?: number;
  stiffness?: number;
  damping?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optsRef = useRef({
    dotColor,
    activeColor,
    dotSize,
    dotSpacing,
    dotOpacity,
    influenceRadius,
    attract,
    maxDisplace,
    stiffness,
    damping,
  });
  optsRef.current = {
    dotColor,
    activeColor,
    dotSize,
    dotSpacing,
    dotOpacity,
    influenceRadius,
    attract,
    maxDisplace,
    stiffness,
    damping,
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const interactive = !reduced && !mobile;

    const [dr, dg, db] = hexToRgb(optsRef.current.dotColor);
    const [ar, ag, ab] = hexToRgb(optsRef.current.activeColor);

    let dots: Dot[] = [];
    let spacing = optsRef.current.dotSpacing;
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    const cursor = { x: -9999, y: -9999 };
    // Mouse events bubble up from content above (this layer is click-through).
    const host = wrap.parentElement ?? wrap;

    function paintStatic() {
      const o = optsRef.current;
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = `rgba(${dr},${dg},${db},${o.dotOpacity})`;
      for (const d of dots) {
        ctx!.beginPath();
        ctx!.arc(d.bx, d.by, o.dotSize / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function layout() {
      const w = wrap!.offsetWidth;
      const h = wrap!.offsetHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = w;
      H = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const o = optsRef.current;
      const raw = Math.ceil(w / o.dotSpacing) * Math.ceil(h / o.dotSpacing);
      spacing = raw > 900 ? Math.ceil(Math.sqrt((w * h) / 900)) : o.dotSpacing;
      const cols = Math.floor(w / spacing);
      const rows = Math.floor(h / spacing);
      const ox = (w - cols * spacing) / 2;
      const oy = (h - rows * spacing) / 2;
      dots = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          dots.push({
            bx: ox + c * spacing,
            by: oy + r * spacing,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
      paintStatic();
    }

    function frame(now: number) {
      const o = optsRef.current;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      ctx!.clearRect(0, 0, W, H);
      let settled = true;
      for (const d of dots) {
        const dx = d.bx - cursor.x;
        const dy = d.by - cursor.y;
        const dist = Math.hypot(dx, dy);
        const prox = dist > 0 ? Math.max(0, 1 - dist / o.influenceRadius) : 0;
        let tx = 0;
        let ty = 0;
        if (prox > 0 && dist > 0.001) {
          const dir = o.attract ? -1 : 1;
          tx = dir * (dx / dist) * prox * o.maxDisplace;
          ty = dir * (dy / dist) * prox * o.maxDisplace;
        }
        d.vx += ((tx - d.x) * o.stiffness - d.vx * o.damping) * dt;
        d.vy += ((ty - d.y) * o.stiffness - d.vy * o.damping) * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (
          Math.abs(d.x - tx) > 0.05 ||
          Math.abs(d.y - ty) > 0.05 ||
          Math.abs(d.vx) > 0.05 ||
          Math.abs(d.vy) > 0.05
        ) {
          settled = false;
        }
        const rr = Math.round(dr + (ar - dr) * prox);
        const gg = Math.round(dg + (ag - dg) * prox);
        const bb = Math.round(db + (ab - db) * prox);
        ctx!.fillStyle = `rgba(${rr},${gg},${bb},${o.dotOpacity})`;
        ctx!.beginPath();
        ctx!.arc(
          d.bx + d.x,
          d.by + d.y,
          (o.dotSize / 2) * (1 + prox),
          0,
          Math.PI * 2
        );
        ctx!.fill();
      }
      if (!settled || cursor.x > -9998) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    function kick() {
      if (!running && interactive) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }

    function onMove(e: MouseEvent) {
      const rect = wrap!.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      kick();
    }

    function onLeave() {
      cursor.x = -9999;
      cursor.y = -9999;
      kick();
    }

    function onHide() {
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        running = false;
      }
    }

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    if (interactive) {
      host.addEventListener("mousemove", onMove);
      host.addEventListener("mouseleave", onLeave);
      document.addEventListener("visibilitychange", onHide);
    }
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
