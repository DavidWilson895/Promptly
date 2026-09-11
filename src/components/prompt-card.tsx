import { Heart } from "lucide-react";
import type { Prompt } from "@/lib/data";
import { PixelImage } from "@/components/pixel-image";

export function PromptCard({
  prompt,
  onOpen,
  index,
}: {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
  index?: number;
}) {
  return (
    <article className="group break-inside-avoid overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/10">
      <button
        type="button"
        onClick={() => onOpen(prompt)}
        className="relative block w-full overflow-hidden bg-muted text-left"
        aria-label={`View prompt: ${prompt.title}`}
      >
        <PixelImage
          src={prompt.image}
          alt=""
          index={index}
          imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
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
    </article>
  );
}
