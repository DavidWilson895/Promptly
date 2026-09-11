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
  dotSize = 4,
  dotSpacing = 20,
  dotOpacity = 0.8,
  influenceRadius = 130,
  attract = false,
  maxDisplace = 10,
  stiffness = 250,
  damping = 22,
  alignRef,
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
  /** Ref of the content grid — dots snap to its real gutters. */
  alignRef?: { current: HTMLDivElement | null };
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const alignMirror = useRef(alignRef);
  alignMirror.current = alignRef;
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

    type CardRect = { l: number; r: number; t: number; b: number };

    function cardRects(): CardRect[] | null {
      const grid = alignMirror.current?.current;
      if (!grid || !wrap) return null;
      const wrect = wrap.getBoundingClientRect();
      const out: CardRect[] = [];
      for (const el of Array.from(grid.children)) {
        if (!(el instanceof HTMLElement)) continue;
        const r = el.getBoundingClientRect();
        out.push({
          l: r.left - wrect.left,
          r: r.right - wrect.left,
          t: r.top - wrect.top,
          b: r.bottom - wrect.top,
        });
      }
      return out.length > 0 ? out : null;
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
      spacing = raw > 9000 ? Math.ceil(Math.sqrt((w * h) / 9000)) : o.dotSpacing;
      const mk = (bx: number, by: number): Dot => ({
        bx,
        by,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });

      const rects = cardRects();
      if (!rects) {
        // No content to align to — plain centered lattice.
        const cols = Math.floor(w / spacing);
        const rowsN = Math.floor(h / spacing);
        const ox = (w - cols * spacing) / 2;
        const oy = (h - rowsN * spacing) / 2;
        dots = [];
        for (let r = 0; r <= rowsN; r++) {
          for (let c = 0; c <= cols; c++) {
            dots.push(mk(ox + c * spacing, oy + r * spacing));
          }
        }
        paintStatic();
        return;
      }

      // Group cards into rows by top edge.
      const rows: { t: number; cards: CardRect[] }[] = [];
      for (const r of rects) {
        let row = rows.find((q) => Math.abs(q.t - r.t) < 6);
        if (!row) {
          row = { t: r.t, cards: [] };
          rows.push(row);
        }
        row.cards.push(r);
      }
      rows.sort((a, b) => a.t - b.t);

      // Vertical gutter centers, deduped across rows.
      const vset = new Set<number>();
      for (const row of rows) {
        const sorted = [...row.cards].sort((a, b) => a.l - b.l);
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i + 1].l - sorted[i].r > 6) {
            vset.add(Math.round((sorted[i].r + sorted[i + 1].l) / 2));
          }
        }
      }
      // Horizontal gutter centers between consecutive rows.
      const hset = new Set<number>();
      for (let i = 0; i < rows.length - 1; i++) {
        const bottom = Math.max(...rows[i].cards.map((c) => c.b));
        const top = Math.min(...rows[i + 1].cards.map((c) => c.t));
        if (top - bottom > 6) hset.add(Math.round((bottom + top) / 2));
      }
      const vcenters = [...vset];
      const hcenters = [...hset];
      // Edge padding strips get one centered line each, just like gutters.
      const vpad = W > 48 ? [12, W - 12] : [];
      const hpad = H > 48 ? [12, H - 12] : [];
      const allV = [...vcenters, ...vpad];
      const allH = [...hcenters, ...hpad];

      const insideCard = (x: number, y: number) =>
        rects.some((r) => x > r.l && x < r.r && y > r.t && y < r.b);
      // Half a gutter wide: anything this close to a line belongs to it,
      // so no parallel clusters can survive inside a strip.
      const nearLine = (x: number, y: number) =>
        allV.some((gx) => Math.abs(x - gx) < 14) ||
        allH.some((gy) => Math.abs(y - gy) < 14);

      dots = [];
      // One centered file of dots per vertical line.
      for (const gx of allV) {
        for (let y = spacing / 2; y < H; y += spacing) {
          if (!insideCard(gx, y)) dots.push(mk(gx, y));
        }
      }
      // One centered file of dots per horizontal line.
      for (const gy of allH) {
        for (let x = spacing / 2; x < W; x += spacing) {
          if (!insideCard(x, gy)) dots.push(mk(x, gy));
        }
      }
      // Fill large open areas with the lattice, skipping cards and lines.
      const cols = Math.floor(w / spacing);
      const rowsN = Math.floor(h / spacing);
      const ox = (w - cols * spacing) / 2;
      const oy = (h - rowsN * spacing) / 2;
      for (let r = 0; r <= rowsN; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = ox + c * spacing;
          const y = oy + r * spacing;
          if (insideCard(x, y) || nearLine(x, y)) continue;
          dots.push(mk(x, y));
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
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => layout()).catch(() => {});
    }
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
