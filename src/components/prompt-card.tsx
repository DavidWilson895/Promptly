import { Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";

export function PromptCard({
  prompt,
  onOpen,
}: {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10">
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
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-black/10" aria-hidden="true" />
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          <span className="rounded-full border bg-white/95 px-2.5 py-1 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur">
            {prompt.model}
          </span>
        </div>
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium tabular-nums text-white shadow-sm backdrop-blur">
          <Heart className="size-3 fill-white" aria-hidden="true" />
          {prompt.likes.toLocaleString()}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/5 group-hover:opacity-100" aria-hidden="true">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
            View prompt
          </span>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3.5 pb-4">
        <button
          type="button"
          onClick={() => onOpen(prompt)}
          className="text-left font-heading text-sm font-medium text-balance leading-snug hover:underline"
        >
          {prompt.title}
        </button>
        <p className="line-clamp-2 text-xs text-pretty leading-relaxed text-muted-foreground">
          {prompt.prompt}
        </p>
      </div>
    </article>
  );
}
