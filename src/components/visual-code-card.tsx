"use client";

import { ImagePlus } from "lucide-react";

import { categoryOf, type VisualCode } from "@/lib/visual-codes";

export function VisualCodeCard({
  code,
  onOpen,
}: {
  code: VisualCode;
  onOpen: (code: VisualCode) => void;
}) {
  const images = code.images.length > 0 ? code.images : code.image ? [code.image] : [];
  const src = images[0] ?? "";

  return (
    <div
      className="group relative flex flex-col gap-2.5 rounded-xl border bg-card p-2.5 transition-colors hover:border-foreground/30 hover:bg-muted/40"
      onClick={() => onOpen(code)}
    >
      <div className="relative w-full overflow-hidden rounded-lg bg-muted">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={code.title}
            loading="lazy"
            className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-6" />
            <span className="text-xs">Ref image pending</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-background/85 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
          #{code.id}
        </span>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{categoryOf(code)}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug">{code.title}</p>
      </div>
    </div>
  );
}