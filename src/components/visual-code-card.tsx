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
    <article className="group break-inside-avoid overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10">
      <button
        type="button"
        onClick={() => onOpen(code)}
        className="relative block w-full overflow-hidden bg-muted text-left"
        aria-label={`View code: ${code.title}`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            loading="lazy"
            className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
            <ImagePlus className="size-6" />
            <span className="text-xs">Ref image pending</span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-black/10" aria-hidden="true" />
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="rounded-full border bg-white/95 px-2 py-1 text-[11px] font-medium tracking-wide text-foreground shadow-sm backdrop-blur">
            #{code.id}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/5 group-hover:opacity-100" aria-hidden="true">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
            View code
          </span>
        </div>
      </button>
      <div className="px-3 py-2.5">
        <p className="text-[11px] text-muted-foreground">{categoryOf(code)}</p>
        <p className="mt-0.5 truncate text-sm font-medium leading-snug">{code.title}</p>
      </div>
    </article>
  );
}