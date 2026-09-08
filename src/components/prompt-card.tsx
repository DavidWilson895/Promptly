import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";

export function PromptCard({
  prompt,
  onOpen,
  onCopy,
}: {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
  onCopy: (prompt: Prompt) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:border-foreground/10">
      <button
        type="button"
        onClick={() => onOpen(prompt)}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-muted text-left"
        aria-label={`View prompt: ${prompt.title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={prompt.image}
          alt=""
          className="size-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="rounded-full border bg-white/95 px-2 py-0.5 text-xs font-medium text-foreground shadow-sm">
            {prompt.model}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 text-xs font-medium tabular-nums text-white backdrop-blur">
          <Heart className="size-3 fill-white" aria-hidden="true" />
          {prompt.likes.toLocaleString()}
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <button
          type="button"
          onClick={() => onOpen(prompt)}
          className="text-left text-sm font-medium text-balance leading-snug hover:underline"
        >
          {prompt.title}
        </button>
        <p className="line-clamp-2 text-xs text-pretty leading-relaxed text-muted-foreground">
          {prompt.prompt}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <Badge
            variant="secondary"
            className="rounded-full px-2 py-0 text-xs font-normal"
          >
            {prompt.category}
          </Badge>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-7 shrink-0 rounded-full"
            onClick={() => onCopy(prompt)}
            aria-label={`Copy prompt: ${prompt.title}`}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}
