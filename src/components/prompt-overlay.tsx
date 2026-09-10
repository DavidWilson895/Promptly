"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bookmark,
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  FileCode2,
  Heart,
  LayoutTemplate,
  Link2,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { type Prompt } from "@/lib/data";
import { REAL_PROMPTS } from "@/lib/data-real";
import { UPLOADED_PROMPTS } from "@/lib/data-upload";
import { cn } from "@/lib/utils";

const ALL_FOR_RELATED: Prompt[] = [...UPLOADED_PROMPTS, ...REAL_PROMPTS];

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
  const [loved, setLoved] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (!open) return;
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

  if (!open || !prompt) return null;
  const item = prompt;

  const related = ALL_FOR_RELATED.filter((p) => p.id !== item.id).slice(0, 6);

  async function copyPrompt(text = item.prompt) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
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

  const copyMarkdown = () => copyPrompt(`**${item.title}**\n\n${item.prompt}`);

  const openWith = (url: string) => {
    void copyPrompt();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:flex-row">
      {/* Image area */}
      <div className="relative flex flex-1 items-center justify-center bg-[#f6f6f4] p-4 md:p-8">
        <div className="absolute right-4 top-4 flex items-center gap-2">
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
              a.href = item.image;
              const ext = item.image.split(".").pop() || "jpg";
              a.download = `${item.id}.${ext}`;
              a.click();
            }}
          >
            <Download className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 rounded-full border border-black/10 bg-white shadow-sm transition-all hover:scale-105 hover:bg-muted hover:shadow-md active:scale-95"
            aria-label="Share"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
              } catch {
                /* noop */
              }
            }}
          >
            <Share2 className="size-5" />
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
                pop && "animate-[ping_320ms_cubic-bezier(0,0,0.2,1)] scale-125",
                !loved && "group-hover:fill-pink-200"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="max-h-[56vh] w-auto max-w-full object-contain shadow-sm md:max-h-[88vh]"
        />
      </div>

      {/* Right panel */}
      <div className="flex w-full shrink-0 flex-col border-t bg-white md:w-[520px] md:border-l md:border-t-0">
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 rounded-full text-xs"
                  >
                    {copied ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    {copied ? "Copied" : "Copy Prompt"}
                    <ChevronDown className="size-3 opacity-60" aria-hidden="true" />
                  </Button>
                }
              >
                Copy prompt
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={6} className="w-56">
                <DropdownMenuItem onClick={() => copyMarkdown()}>
                  <Eye className="size-4" aria-hidden="true" />
                  View as markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyMarkdown()}>
                  <FileCode2 className="size-4" aria-hidden="true" />
                  Copy as markdown
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => openWith("https://v0.dev")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in v0
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://claude.ai")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Claude
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://bolt.new")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Bolt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://lovable.dev")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Lovable
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://cursor.com")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Cursor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://chatgpt.com")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in ChatGPT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://www.perplexity.ai")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Perplexity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://gemini.google.com")}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Open in Gemini
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => openWith("https://figma.com")}>
                  <LayoutTemplate className="size-4" aria-hidden="true" />
                  Open in Figma
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openWith("https://gist.github.com")}>
                  <Link2 className="size-4" aria-hidden="true" />
                  Create GitHub Gist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button className="flex-1 gap-1.5 rounded-full">
                  <Copy className="size-3.5" aria-hidden="true" />
                  Use this prompt
                  <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
                </Button>
              }
            >
              Use this prompt
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="w-56">
              <DropdownMenuItem onClick={() => copyPrompt()}>
                <Copy className="size-4" aria-hidden="true" />
                Copy prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyMarkdown()}>
                <FileCode2 className="size-4" aria-hidden="true" />
                Copy as markdown
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => openWith("https://claude.ai")}>
                <Sparkles className="size-4" aria-hidden="true" />
                Open in Claude
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openWith("https://chatgpt.com")}>
                <Sparkles className="size-4" aria-hidden="true" />
                Open in ChatGPT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openWith("https://gemini.google.com")}>
                <Sparkles className="size-4" aria-hidden="true" />
                Open in Gemini
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="flex-1 gap-1.5 rounded-full"
            onClick={() => copyMarkdown()}
          >
            Use as reference
          </Button>
        </div>
      </div>
    </div>
  );
}
