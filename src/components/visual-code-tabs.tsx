"use client";

import { Check } from "lucide-react";

import {
  VISUAL_CATEGORIES,
  VISUAL_CODES,
  categoryOf,
} from "@/lib/visual-codes";
import { cn } from "@/lib/utils";

const CATEGORIES = VISUAL_CATEGORIES.map((title) => ({
  title,
  codes: VISUAL_CODES.filter((c) => categoryOf(c) === title),
}));

export function VisualCodeTabs({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Tab active={active} name="All" count={VISUAL_CODES.length} onSelect={onSelect} />
      {CATEGORIES.map((g) => (
        <Tab
          key={g.title}
          active={active}
          name={g.title}
          count={g.codes.length}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function Tab({
  active,
  name,
  count,
  onSelect,
}: {
  active: string;
  name: string;
  count: number;
  onSelect: (name: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[15px] font-medium transition-colors",
        active === name
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      )}
    >
      {active === name ? <Check className="size-3.5" /> : null}
      {name}
      <span className="text-xs tabular-nums opacity-70">{count}</span>
    </button>
  );
}