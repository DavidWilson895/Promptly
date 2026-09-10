"use client";

import { useEffect, useState } from "react";
import { Bookmark, Copy, Download, Heart, ImagePlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VISUAL_CODES, type VisualCode } from "@/lib/visual-codes";
import { cn } from "@/lib/utils";

export function VisualCodeOverlay({
  code,
  open,
  onOpenChange,
}: {
  code: VisualCode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loved, setLoved] = useState(false);
  const [pop, setPop] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  function toggleLove() {
    setLoved((v) => !v);
    setPop(true);
    setTimeout(() => setPop(false), 320);
  }

  if (!open || !code) return null;
  const item = code;

  const images = item.images.length > 0 ? item.images : item.image ? [item.image] : [];
  const related = VISUAL_CODES.filter(
    (c) => c.id !== item.id && c.group === item.group
  ).slice(0, 6);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(item.code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = item.code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:flex-row">
      {/* Image area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto bg-[#f6f6f4]">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full border border-black/10 bg-white shadow-sm transition-all hover:scale-105 hover:bg-muted hover:shadow-md active:scale-95"
            onClick={() => setBookmarked((v) => !v)}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark className={cn("size-5", bookmarked && "fill-foreground")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full border border-black/10 bg-white shadow-sm transition-all hover:scale-105 hover:bg-muted hover:shadow-md active:scale-95"
            aria-label="Download"
            onClick={() => {
              const a = document.createElement("a");
              a.href = images[active] ?? code.image;
              const ext = (images[active] ?? code.image).split(".").pop() || "jpg";
              a.download = `${code.id}.${ext}`;
              a.click();
            }}
          >
            <Download className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLove}
            className={cn(
              "size-11 rounded-full border shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95",
              loved
                ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100"
                : "border-black/10 bg-white hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600"
            )}
            aria-label={loved ? "Unlike" : "Love this"}
            aria-pressed={loved}
          >
            <Heart
              className={cn(
                "size-5 transition-all duration-300",
                loved && "fill-pink-500 text-pink-500",
                pop && "animate-[ping_320ms_cubic-bezier(0,0,0.2,1)] scale-125"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full border border-black/10 bg-white shadow-sm transition-all hover:scale-105 hover:bg-muted hover:shadow-md active:scale-95"
            onClick={() => onOpenChange(false)}
            aria-label="Close (Esc)"
          >
            <X className="size-5" />
          </Button>
        </div>

        {images.length > 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 p-4 md:p-8">
            <img
              src={images[active]}
              alt={item.title}
              className="max-h-[56vh] w-auto max-w-full rounded-lg object-contain shadow-sm md:max-h-[70vh]"
            />
            {images.length > 1 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActive(i)}
                    className={cn(
                      "h-14 w-12 overflow-hidden rounded-md border bg-muted transition-all",
                      i === active
                        ? "border-foreground/60 ring-1 ring-foreground/40"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                    aria-label={`Reference ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="size-10" />
            <span className="text-sm">No reference image for this code</span>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="flex w-full shrink-0 flex-col border-t bg-white md:w-[520px] md:border-l md:border-t-0">
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {code.group.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-none">{code.group}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">#{code.id}</p>
              </div>
            </div>
            <h2 className="mt-4 font-sans text-xl font-semibold tracking-tight">
              {code.title}
            </h2>
          </div>

          {/* Copy code */}
          <Button
            onClick={() => void copyCode()}
            className="h-9 w-full gap-1.5 rounded-full text-sm"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy code"}
          </Button>

          {/* Code block */}
          <div className="rounded-lg border bg-muted/20 p-3.5">
            <p className="font-mono text-sm leading-relaxed">{code.code}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="rounded-full text-xs font-normal">
              {code.group}
            </Badge>
            <Badge variant="secondary" className="rounded-full text-xs font-normal">
              #{code.id}
            </Badge>
          </div>

          {/* More in this style */}
          {related.length > 0 ? (
            <div>
              <h3 className="text-sm font-medium">More in {code.group}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {related.map((r) => {
                  const rimgs = r.images.length > 0 ? r.images : r.image ? [r.image] : [];
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("visual-code:select", { detail: r })
                        );
                      }}
                      className="group relative flex aspect-square flex-col overflow-hidden rounded-lg border bg-muted text-left"
                      aria-label={`View ${r.title}`}
                    >
                      {rimgs[0] ? (
                        <img
                          src={rimgs[0]}
                          alt=""
                          className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                          {r.title}
                        </span>
                      )}
                      <span className="absolute bottom-0 inset-x-0 truncate bg-background/80 px-1.5 py-0.5 text-[11px] font-medium backdrop-blur">
                        #{r.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom actions */}
        <div className="flex gap-2 border-t p-3">
          <Button
            onClick={() => void copyCode()}
            className="flex-1 gap-1.5 rounded-full"
          >
            <Copy className="size-3.5" aria-hidden="true" />
            {copied ? "Copied" : "Use this code"}
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            Open in style guide
          </Button>
        </div>
      </div>
    </div>
  );
}