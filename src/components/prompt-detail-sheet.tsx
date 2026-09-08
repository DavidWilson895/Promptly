"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Check, Copy, Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";

export function PromptDetailSheet({
  prompt,
  open,
  onOpenChange,
}: {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;
  const item = prompt;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(item.prompt);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = item.prompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full p-0 sm:max-w-[440px]"
        aria-describedby={undefined}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={`Preview of ${item.title}`}
              className="size-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <SheetHeader className="p-0 text-left">
              <SheetTitle className="text-base leading-snug text-balance">
                {item.title}
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="outline" className="rounded-full">
                {item.model}
              </Badge>
              <Badge variant="secondary" className="rounded-full font-normal">
                {item.category}
              </Badge>
              <Badge variant="secondary" className="rounded-full font-normal">
                {item.style}
              </Badge>
              <span className="inline-flex items-center gap-1 pl-1 text-xs text-muted-foreground tabular-nums">
                <Heart className="size-3" aria-hidden="true" />
                {item.likes.toLocaleString()}
              </span>
            </div>

            <div className="rounded-xl border bg-muted/40 p-4">
              <p className="whitespace-pre-wrap text-sm text-pretty leading-relaxed">
                {item.prompt}
              </p>
            </div>
          </div>

          <div className="border-t p-4">
            <Button onClick={copyPrompt} className="w-full gap-2">
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy prompt"}
            </Button>
            <p className="pt-2 text-center text-xs text-muted-foreground">
              Paste into Midjourney, GPT Image, or any generator
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
