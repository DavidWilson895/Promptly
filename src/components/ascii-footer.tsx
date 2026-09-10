"use client";

import * as React from "react";

export function AsciiFooter({ className }: { className?: string }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const hiddenRef = React.useRef<HTMLCanvasElement>(null);
  const visibleRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rafRef = React.useRef<number | null>(null);

  // same defaults as the Framer component
  const charSet = " .:-=+*#%@";
  const chars = React.useMemo(() => charSet.split(""), []);
  const contrast: number = 1.8;
  const backgroundColor = "#0a0a0a";
  const textColor = "#00FF66";
  const useCustomTextColor = true;
  const resolutionWidth = 140;
  const resolutionHeight = 48;
  const fitMode: "cover" | "contain" = "cover";

  const colorCache = React.useMemo(() => {
    const cache = new Array(256);
    for (let i = 0; i < 256; i++) cache[i] = `rgb(${i},${i},${i})`;
    return cache;
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    const hiddenCanvas = hiddenRef.current;
    const visibleCanvas = visibleRef.current;
    const container = containerRef.current;
    if (!video || !hiddenCanvas || !visibleCanvas || !container) return;

    const hCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
    const vCtx = visibleCanvas.getContext("2d");
    if (!hCtx || !vCtx) return;

    hiddenCanvas.width = resolutionWidth;
    hiddenCanvas.height = resolutionHeight;

    const resizeVisible = () => {
      const rect = container.getBoundingClientRect();
      visibleCanvas.width = Math.floor(rect.width);
      visibleCanvas.height = Math.floor(rect.height);
    };
    resizeVisible();
    const ro = new ResizeObserver(resizeVisible);
    ro.observe(container);

    const render = () => {
      if (video.paused || video.ended) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }
      const vWidth = video.videoWidth || resolutionWidth;
      const vHeight = video.videoHeight || resolutionHeight;

      vCtx.fillStyle = backgroundColor;
      vCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);

      let renderWidth = visibleCanvas.width;
      let renderHeight = visibleCanvas.height;
      let renderX = 0;
      let renderY = 0;
      const containerRatio = visibleCanvas.width / visibleCanvas.height;
      const videoRatio = vWidth / vHeight;
      if (fitMode === "cover") {
        if (videoRatio > containerRatio) {
          renderWidth = visibleCanvas.height * videoRatio;
          renderX = (visibleCanvas.width - renderWidth) / 2;
        } else {
          renderHeight = visibleCanvas.width / videoRatio;
          renderY = (visibleCanvas.height - renderHeight) / 2;
        }
      }

      hCtx.drawImage(video, 0, 0, resolutionWidth, resolutionHeight);
      try {
        const imgData = hCtx.getImageData(0, 0, resolutionWidth, resolutionHeight);
        const data = imgData.data;
        const cellWidth = renderWidth / resolutionWidth;
        const cellHeight = renderHeight / resolutionHeight;
        const fontSize = Math.min(cellWidth * 1.4, cellHeight * 1.4);
        vCtx.font = `bold ${fontSize}px 'Courier New', Courier, monospace`;
        vCtx.textAlign = "center";
        vCtx.textBaseline = "middle";
        const charsLenMinusOne = chars.length - 1;
        for (let y = 0; y < resolutionHeight; y++) {
          const posY = renderY + y * cellHeight + cellHeight / 2;
          if (posY < 0 || posY > visibleCanvas.height) continue;
          const rowOffset = y * resolutionWidth;
          for (let x = 0; x < resolutionWidth; x++) {
            const posX = renderX + x * cellWidth + cellWidth / 2;
            if (posX < 0 || posX > visibleCanvas.width) continue;
            const idx = (rowOffset + x) * 4;
            let brightness: number = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
            if (contrast !== 1) {
              brightness = ((brightness / 255 - 0.5) * contrast + 0.5) * 255;
              if (brightness < 0) brightness = 0;
              if (brightness > 255) brightness = 255;
            }
            const charIdx = ((brightness / 255) * charsLenMinusOne) | 0;
            const char = chars[charIdx] || " ";
            vCtx.fillStyle = useCustomTextColor ? textColor : colorCache[brightness | 0];
            vCtx.fillText(char, posX, posY);
          }
        }
      } catch {}
      rafRef.current = requestAnimationFrame(render);
    };

    const handlePlay = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    };

    video.addEventListener("play", handlePlay);
    // autoplay fallback
    if (!video.paused) handlePlay();
    // try to play (muted autoplay allowed)
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("play", handlePlay);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [chars, colorCache]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className ?? "h-[180px] bg-[#0a0a0a]"}`}
    >
      {/* hidden video source - sample with CORS */}
      <video
        ref={videoRef}
        src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        muted
        loop
        autoPlay
        playsInline
        crossOrigin="anonymous"
        className="pointer-events-none absolute h-px w-px opacity-0"
      />
      <canvas ref={hiddenRef} className="pointer-events-none absolute h-px w-px opacity-0" />
      <canvas ref={visibleRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3">
        <p className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/70 backdrop-blur">
          ASCII Video Effect — live canvas
        </p>
      </div>
    </div>
  );
}
