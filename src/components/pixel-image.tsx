"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Fit = "cover" | "contain";

const SEEN_KEY = "promptly:seen-images";

let seenCache: Set<string> | null = null;

function getSeen(): Set<string> {
  if (seenCache) return seenCache;
  seenCache = new Set<string>();
  try {
    if (typeof window !== "undefined") {
      const raw = window.sessionStorage.getItem(SEEN_KEY);
      if (raw) {
        const arr: unknown = JSON.parse(raw);
        if (Array.isArray(arr)) {
          for (const v of arr) if (typeof v === "string") seenCache.add(v);
        }
      }
    }
  } catch {
    /* storage unavailable */
  }
  return seenCache;
}

function hasSeen(src: string): boolean {
  try {
    return getSeen().has(src);
  } catch {
    return false;
  }
}

function markSeen(src: string): void {
  try {
    const seen = getSeen();
    if (seen.has(src)) return;
    seen.add(src);
    window.sessionStorage.setItem(
      SEEN_KEY,
      JSON.stringify([...seen].slice(-300))
    );
  } catch {
    /* storage unavailable */
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Smoothstep easing — matches the Framer loader's "smooth" ease. */
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

function drawPixelatedImage(
  canvas: HTMLCanvasElement,
  source: HTMLImageElement,
  pixelSize: number,
  fit: Fit
): void {
  const context = canvas.getContext("2d");
  if (!context || !source.naturalWidth || !source.naturalHeight) return;
  const cssWidth = Math.max(1, canvas.clientWidth || canvas.width);
  const cssHeight = Math.max(1, canvas.clientHeight || canvas.height);
  const blockSize = clamp(pixelSize, 1, Math.max(cssWidth, cssHeight));
  const tinyWidth = Math.max(1, Math.round(cssWidth / blockSize));
  const tinyHeight = Math.max(1, Math.round(cssHeight / blockSize));
  const buffer = document.createElement("canvas");
  const bufferContext = buffer.getContext("2d");
  if (!bufferContext) return;
  buffer.width = tinyWidth;
  buffer.height = tinyHeight;

  const natW = source.naturalWidth;
  const natH = source.naturalHeight;
  if (fit === "cover") {
    const sourceRatio = natW / natH;
    const targetRatio = cssWidth / cssHeight;
    let cropX = 0;
    let cropY = 0;
    let cropWidth = natW;
    let cropHeight = natH;
    if (sourceRatio > targetRatio) {
      cropWidth = natH * targetRatio;
      cropX = (natW - cropWidth) / 2;
    } else {
      cropHeight = natW / targetRatio;
      cropY = (natH - cropHeight) / 2;
    }
    bufferContext.drawImage(
      source,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      tinyWidth,
      tinyHeight
    );
  } else {
    const imageRatio = natW / natH;
    const bufferRatio = tinyWidth / tinyHeight;
    let rw: number;
    let rh: number;
    if (imageRatio > bufferRatio) {
      rw = tinyWidth;
      rh = tinyWidth / imageRatio;
    } else {
      rh = tinyHeight;
      rw = tinyHeight * imageRatio;
    }
    bufferContext.drawImage(source, (tinyWidth - rw) / 2, (tinyHeight - rh) / 2, rw, rh);
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    buffer,
    0,
    0,
    tinyWidth,
    tinyHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

export function PixelImage({
  src,
  alt = "",
  fit = "cover",
  duration = 1.1,
  delay = 0.1,
  pixelSize = 26,
  replayOnHover = true,
  eager = false,
  fill = false,
  index,
  className,
  imgClassName,
}: {
  src: string;
  alt?: string;
  fit?: Fit;
  /** Seconds for the pixelation to resolve. */
  duration?: number;
  /** Seconds to wait before starting. */
  delay?: number;
  /** Starting pixel block size in px. */
  pixelSize?: number;
  /** Replay the resolve animation on hover. */
  replayOnHover?: boolean;
  /** Use eager instead of lazy loading. */
  eager?: boolean;
  /** Fill the frame (frame must have its own size). */
  fill?: boolean;
  /** Grid position — staggers the load so images don't all fire at once. */
  index?: number;
  className?: string;
  imgClassName?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number | null>(null);
  const assignTimeRef = useRef(0);
  const srcRef = useRef(src);
  srcRef.current = src;
  const optsRef = useRef({ duration, delay, pixelSize, fit });
  optsRef.current = { duration, delay, pixelSize, fit };
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // Only start fetching once the frame is near the viewport, staggered by
  // grid position so a full page of images doesn't all fire at once.
  const [inView, setInView] = useState(false);
  const [loadSrc, setLoadSrc] = useState<string | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    // Images already seen this session load instantly — no stagger, no replay.
    const wait =
      index === undefined || hasSeen(src) ? 0 : Math.min(index * 60, 900);
    if (wait === 0) {
      assignTimeRef.current = performance.now();
      setLoadSrc(src);
      return;
    }
    const t = setTimeout(() => {
      assignTimeRef.current = performance.now();
      setLoadSrc(src);
    }, wait);
    return () => clearTimeout(t);
  }, [inView, src, index]);

  const markReady = useCallback(() => {
    const img = imgRef.current;
    if (img && img.naturalWidth > 0) setReady(true);
  }, []);

  // Reset when the source changes.
  useEffect(() => {
    setReady(false);
    setFailed(false);
    const img = imgRef.current;
    if (img) {
      img.style.opacity = "0";
      img.style.filter = "blur(0px)";
      if (loadSrc && img.complete && img.naturalWidth > 0) setReady(true);
    }
  }, [loadSrc]);

  // Track frame size for the canvas.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setFrameSize({ width, height });
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.naturalWidth) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    // Already seen this session, or served instantly from cache (e.g. page
    // refresh) — show sharp immediately instead of replaying the animation.
    const srcKey = srcRef.current;
    const loadedFast = performance.now() - assignTimeRef.current < 200;
    if (srcKey && (hasSeen(srcKey) || loadedFast)) {
      markSeen(srcKey);
      img.style.opacity = "1";
      img.style.filter = "blur(0px)";
      return;
    }

    const pixelRatio =
      typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    const frameW = Math.max(1, canvas.clientWidth || 1);
    const frameH = Math.max(1, canvas.clientHeight || 1);
    canvas.width = Math.max(1, Math.round(frameW * pixelRatio));
    canvas.height = Math.max(1, Math.round(frameH * pixelRatio));

    const { duration, delay, pixelSize, fit } = optsRef.current;
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      drawPixelatedImage(canvas, img, 1, fit);
      img.style.opacity = "1";
      img.style.filter = "blur(0px)";
      if (srcKey) markSeen(srcKey);
      return;
    }

    const from = clamp(pixelSize, 2, 140);
    const to = 1.6;
    const fadeStart = 0.43;
    const maxBlur = 3;
    const durationMs = Math.max(0.1, duration) * 1000;
    const delayMs = Math.max(0, delay) * 1000;

    img.style.opacity = "0";
    img.style.filter = `blur(${maxBlur}px)`;
    drawPixelatedImage(canvas, img, from, fit);

    let startTime: number | null = null;
    const tick = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsedMs = time - startTime;
      if (elapsedMs < delayMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const progress = clamp((elapsedMs - delayMs) / durationMs, 0, 1);
      const eased = smooth(progress);
      drawPixelatedImage(canvas, img, from + (to - from) * eased, fit);
      const opacity = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
      img.style.opacity = String(opacity);
      img.style.filter = `blur(${maxBlur * (1 - opacity)}px)`;
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      markSeen(srcRef.current);
      img.style.opacity = "1";
      img.style.filter = "blur(0px)";
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!ready || failed) return;
    start();
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, failed, frameSize.width, frameSize.height, start]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      onMouseEnter={() => {
        if (replayOnHover && ready && !failed) start();
      }}
      className={cn("relative block w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={loadSrc ?? undefined}
          alt={alt}
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={markReady}
          onError={() => setFailed(true)}
          className={cn(
            fill
              ? "absolute inset-0 h-full w-full"
              : "relative h-auto w-full",
            fit === "cover" ? "object-cover" : "object-contain",
            imgClassName
          )}
          style={{ opacity: 0 }}
        />
      ) : null}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-muted p-3 text-muted-foreground">
          <ImageOff className="size-5" aria-hidden="true" />
          <span className="text-[11px]">Image unavailable</span>
        </div>
      ) : null}
    </div>
  );
}
