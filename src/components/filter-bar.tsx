"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import {
  CATEGORIES,
  MODELS,
  STYLES,
  type Category,
  type Model,
  type Style,
} from "@/lib/data";
import { cn } from "@/lib/utils";

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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-sm whitespace-nowrap",
        "transition-colors duration-150",
        active
          ? "border-transparent bg-foreground text-background"
          : "text-muted-foreground hover:border-border hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function FilterBar({
  search,
  onSearch,
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
  search: string;
  onSearch: (value: string) => void;
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search prompts…"
            className="pl-9 pr-8"
            aria-label="Search prompts"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <Select
          value={sort}
          onValueChange={(value) => {
            if (value) onSort(value as SortKey);
          }}
        >
          <SelectTrigger className="w-full sm:w-40" aria-label="Sort prompts">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popular">Most liked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category stays as chips */}
      <div className="flex items-center gap-3">
        <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
          Category
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip active={category === null} onClick={() => onCategory(null)}>
            All
          </Chip>
          {CATEGORIES.map((value) => (
            <Chip
              key={value}
              active={category === value}
              onClick={() => onCategory(category === value ? null : (value as Category))}
            >
              {value}
            </Chip>
          ))}
        </div>
      </div>

      {/* Model + Style as dropdowns */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Model</span>
          <Select
            value={model ?? "All models"}
            onValueChange={(v) => onModel(v === "All models" ? null : (v as Model))}
          >
            <SelectTrigger className="h-8 gap-2 rounded-full pl-2.5 pr-2 text-sm" aria-label="Filter by model">
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Style</span>
          <Select
            value={style ?? "All styles"}
            onValueChange={(v) => onStyle(v === "All styles" ? null : (v as Style))}
          >
            <SelectTrigger className="h-8 rounded-full pl-2.5 pr-2 text-sm" aria-label="Filter by style">
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

      <p className="text-xs text-muted-foreground tabular-nums">
        {resultCount} {resultCount === 1 ? "prompt" : "prompts"}
      </p>
    </div>
  );
}
