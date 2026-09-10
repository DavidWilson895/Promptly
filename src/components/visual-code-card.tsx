"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VisualCode } from "@/lib/visual-codes";

export function VisualCodeCard({ code }: { code: VisualCode }) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);

  const images = code.images.length > 0 ? code.images : code.image ? [code.image] : [];
  const src = images[active] ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard unavailable - ignore
    }
  }

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30 hover:bg-muted/40"
      onClick={() => void copy()}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={code.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-6" />
            <span className="text-xs">Ref image pending</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
          #{code.id}
        </span>
        {copied ? (
          <span className="absolute right-2 top-2 rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-medium text-background">
            Copied
          </span>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium leading-snug">{code.title}</p>
        {images.length > 1 ? (
          <div className="mt-2 flex items-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                className={cn(
                  "h-9 w-7 overflow-hidden rounded-md border transition-all",
                  i === active
                    ? "border-foreground/60 ring-1 ring-foreground/40"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
                title={`Reference ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
            <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
              {active + 1}/{images.length}
            </span>
          </div>
        ) : null}
        <p className="mt-1 truncate font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
          {code.code}
        </p>
      </div>
    </div>
  );
}