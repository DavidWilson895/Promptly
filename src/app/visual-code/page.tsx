"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

import { VisualCodeCard } from "@/components/visual-code-card";
import { VisualCodeOverlay } from "@/components/visual-code-overlay";
import { ModeSwitch } from "@/components/mode-switch";
import {
  VISUAL_CATEGORIES,
  VISUAL_CODES,
  categoryOf,
  type VisualCode,
} from "@/lib/visual-codes";
import { cn } from "@/lib/utils";

const CATEGORIES = VISUAL_CATEGORIES.map((title) => ({
  title,
  codes: VISUAL_CODES.filter((c) => categoryOf(c) === title),
}));

export default function VisualCodePage() {
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<VisualCode | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const filtered = useMemo(() => {
    if (active === "All") return VISUAL_CODES;
    return CATEGORIES.find((c) => c.title === active)?.codes ?? [];
  }, [active]);

  function openCode(code: VisualCode) {
    setSelected(code);
    setOverlayOpen(true);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<VisualCode>).detail;
      if (detail) setSelected(detail);
    };
    window.addEventListener("visual-code:select", handler as EventListener);
    return () =>
      window.removeEventListener("visual-code:select", handler as EventListener);
  }, []);

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-24 pb-16 md:px-8 lg:px-10 md:py-28">
      <div className="flex flex-col gap-3">
        <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
          Event poster design codes
        </h1>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {VISUAL_CODES.length} rebuild codes across {VISUAL_CATEGORIES.length} categories. Pick a
          category, copy a line, attach your reference poster, and rebuild it in that visual language.
        </p>
      </div>

      <div className="sticky top-14 z-30 -mx-6 border-b bg-card px-6 py-2.5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
          <ModeSwitch />
          <span className="text-xs tabular-nums text-muted-foreground">
            {filtered.length} of {VISUAL_CODES.length} codes
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Tab active={active} name="All" count={VISUAL_CODES.length} onSelect={setActive} />
          {CATEGORIES.map((g) => (
            <Tab key={g.title} active={active} name={g.title} count={g.codes.length} onSelect={setActive} />
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="columns-2 gap-3 space-y-3 pt-4 sm:gap-4 sm:space-y-4 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
          {filtered.map((code) => (
            <VisualCodeCard key={code.id} code={code} onOpen={openCode} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">No codes in this category.</p>
      )}

      <VisualCodeOverlay
        code={selected}
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
      />
    </main>
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