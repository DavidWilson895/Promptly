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

function ChipRow({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: readonly string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={selected === null} onClick={() => onSelect(null)}>
          All
        </Chip>
        {values.map((value) => (
          <Chip
            key={value}
            active={selected === value}
            onClick={() => onSelect(selected === value ? null : value)}
          >
            {value}
          </Chip>
        ))}
      </div>
    </div>
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

      <div className="flex flex-col gap-2">
        <ChipRow
          label="Model"
          values={MODELS}
          selected={model}
          onSelect={(v) => onModel(v as Model | null)}
        />
        <ChipRow
          label="Category"
          values={CATEGORIES}
          selected={category}
          onSelect={(v) => onCategory(v as Category | null)}
        />
        <ChipRow
          label="Style"
          values={STYLES}
          selected={style}
          onSelect={(v) => onStyle(v as Style | null)}
        />
      </div>

      <p className="text-xs text-muted-foreground tabular-nums">
        {resultCount} {resultCount === 1 ? "prompt" : "prompts"}
      </p>
    </div>
  );
}