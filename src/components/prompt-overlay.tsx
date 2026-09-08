"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Check,
  Copy,
  Download,
  Eye,
  Heart,
  Share2,
  X,
} from "lucide-react";
import { PROMPTS, type Prompt } from "@/lib/data";
import { REAL_PROMPTS } from "@/lib/data-real";
import { cn } from "@/lib/utils";

const ALL_FOR_RELATED: Prompt[] = [...REAL_PROMPTS, ...PROMPTS];

export function PromptOverlay({
  prompt,
  open,
  onOpenChange,
}: {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  if (!open || !prompt) return null;
  const item = prompt;

  const related = ALL_FOR_RELATED.filter((p) => p.id !== item.id).slice(0, 6);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(item.prompt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = item.prompt;
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
      <div className="relative flex flex-1 items-center justify-center bg-[#f6f6f4] p-4 md:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[56vh] w-auto max-w-full object-contain shadow-sm md:max-h-[88vh]"
        />
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute left-4 top-4 hidden size-8 items-center justify-center rounded-full border bg-white text-muted-foreground shadow-sm hover:text-foreground md:inline-flex"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Right panel */}
      <div className="flex w-full shrink-0 flex-col border-t bg-white md:w-[460px] md:border-l md:border-t-0">
        {/* Top icon row */}
        <div className="flex items-center justify-end gap-1.5 border-b px-3 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full border"
            onClick={() => setBookmarked((v) => !v)}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark
              className={cn("size-3.5", bookmarked && "fill-foreground")}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full border"
            aria-label="Download"
            onClick={() => {
              const a = document.createElement("a");
              a.href = item.image;
              const ext = item.image.split(".").pop() || "jpg";
              a.download = `${item.id}.${ext}`;
              a.click();
            }}
          >
            <Download className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full border"
            aria-label="Share"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
              } catch {
                /* noop */
              }
            }}
          >
            <Share2 className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 rounded-full border"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">
          {/* Author row - placeholder */}
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
              T
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-none">Taaruk</p>
              <p className="text-xs text-muted-foreground">@taaruk_</p>
            </div>
            <span className="text-xs text-muted-foreground">5mo ago</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Heart className="size-3.5" aria-hidden="true" />
              {item.likes.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Eye className="size-3.5" aria-hidden="true" />
              2.7k
            </span>
          </div>

          {/* Model + Copy */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className="gap-1 rounded-full px-2.5 py-1 text-xs font-normal"
            >
              <span className="size-2 rounded-full bg-foreground" aria-hidden="true" />
              {item.model}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full text-xs"
              onClick={copyPrompt}
            >
              {copied ? (
                <Check className="size-3" aria-hidden="true" />
              ) : (
                <Copy className="size-3" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy Prompt"}
            </Button>
          </div>

          {/* Prompt */}
          <div className="rounded-lg border bg-muted/20 p-3.5">
            <p className="whitespace-pre-wrap text-sm text-pretty leading-relaxed">
              {item.prompt}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-normal"
            >
              {item.category}
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full text-xs font-normal"
            >
              {item.style}
            </Badge>
          </div>

          {/* More Inspiration */}
          <div>
            <h3 className="text-sm font-medium">More Inspiration</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {related.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    // Swap to clicked inspiration without closing overlay
                    // Parent will handle via prompt prop change - we need to bubble
                    // For now, just show toast; parent sheet manages selected
                    // To keep simple, dispatch a custom event the page listens to
                    window.dispatchEvent(
                      new CustomEvent("prompt:select", { detail: r })
                    );
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-muted text-left"
                  aria-label={`View ${r.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt=""
                    className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex gap-2 border-t p-3">
          <Button className="flex-1 gap-1.5 rounded-full" onClick={copyPrompt}>
            <Copy className="size-3.5" aria-hidden="true" />
            Use this prompt
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-1.5 rounded-full"
            onClick={copyPrompt}
          >
            Use as reference
          </Button>
        </div>
      </div>
    </div>
  );
}
