"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, ExternalLink, Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";

export function PromptDetailDialog({
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
        <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-auto sm:h-full sm:max-h-[512px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={prompt.image}
            alt={`Preview of prompt: ${prompt.title}`}
            className="size-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle className="text-lg text-balance">
              {prompt.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{prompt.model}</Badge>
            <Badge variant="secondary">{prompt.category}</Badge>
            <Badge variant="secondary">{prompt.style}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Heart className="size-3.5" aria-hidden="true" />
              {prompt.likes.toLocaleString()} likes
            </span>
          </div>

          <div className="rounded-md border bg-muted/50 p-4">
            <p className="whitespace-pre-wrap text-sm text-pretty leading-relaxed">
              {prompt.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button onClick={copyPrompt} className="gap-2">
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy prompt"}
            </Button>
            {prompt.source ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                render={
                  <a
                    href={prompt.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                Source
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}