"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MODELS,
  STYLES,
  type Category,
  type Model,
  type Style,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { CategoryTabs } from "@/components/category-tabs";
import { ModeSwitch } from "@/components/mode-switch";

export type SortKey = "trending" | "latest" | "popular";

const MODEL_LOGOS: Record<string, string> = {
  "GPT Image": "/brand-logo/openai.svg",
  Midjourney: "/brand-logo/midjourney.svg",
  Grok: "/brand-logo/grok.svg",
  "Nano Banana": "/brand-logo/nano-banana.svg",
  Seedance: "/brand-logo/seedance.svg",
  "Gemini Omni": "/brand-logo/gemini.svg",
  Kling: "/brand-logo/kling.svg",
  MiniMax: "/brand-logo/minimax.svg",
};

function ModelIcon({ model, className }: { model: string; className?: string }) {
  const src = MODEL_LOGOS[model];
  if (!src) return null;
  // Midjourney needs currentColor for visibility on light bg
  const isMonochrome = model === "Midjourney" || model === "Grok";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn("size-4 shrink-0 object-contain", isMonochrome && "text-foreground", className)}
    />
  );
}

export function FilterBar({
  model,
  onModel,
  category,
  onCategory,
  style,
  onStyle,
  sort,
  onSort,
  resultCount,
}: {
  model: Model | null;
  onModel: (value: Model | null) => void;
  category: Category | null;
  onCategory: (value: Category | null) => void;
  style: Style | null;
  onStyle: (value: Style | null) => void;
  sort: SortKey;
  onSort: (value: SortKey) => void;
  resultCount: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      {/* Categories */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryTabs value={category} onChange={onCategory} />
      </div>

      {/* Model + Style + count */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <ModeSwitch />

          <div className="flex items-center gap-1.5">
            <Select
              value={model ?? "All models"}
              onValueChange={(v) => onModel(v === "All models" ? null : (v as Model))}
            >
              <SelectTrigger className="h-7 gap-1.5 rounded-full border-border/60 bg-card px-2.5 text-[15px] hover:bg-muted/50" aria-label="Filter by model">
                <span className="inline-flex items-center gap-1.5">
                  {model ? <ModelIcon model={model} /> : null}
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All models">All models</SelectItem>
                {MODELS.map((m) => (
                  <SelectItem key={m} value={m}>
                    <span className="inline-flex items-center gap-2">
                      <ModelIcon model={m} />
                      {m}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <Select
              value={style ?? "All styles"}
              onValueChange={(v) => onStyle(v === "All styles" ? null : (v as Style))}
            >
              <SelectTrigger className="h-7 rounded-full border-border/60 bg-card px-2.5 text-[15px] hover:bg-muted/50" aria-label="Filter by style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All styles">All styles</SelectItem>
                {STYLES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSort("trending")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[15px] transition-colors",
              sort === "trending" ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={sort === "trending"}
          >
            Trending
          </button>
          <button
            type="button"
            onClick={() => onSort("latest")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[15px] transition-colors",
              sort === "latest" ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={sort === "latest"}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => onSort("popular")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[15px] transition-colors",
              sort === "popular" ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={sort === "popular"}
          >
            Popular
          </button>
        </div>
      </div>
    </div>
  );
}
