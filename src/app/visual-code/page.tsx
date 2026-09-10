"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";

import { VisualCodeCard } from "@/components/visual-code-card";
import { VISUAL_CODES, type VisualCode } from "@/lib/visual-codes";
import { cn } from "@/lib/utils";

const GROUPS = VISUAL_CODES.reduce<{ title: string; codes: VisualCode[] }[]>(
  (acc, code) => {
    const last = acc[acc.length - 1];
    if (last && last.title === code.group) {
      last.codes.push(code);
    } else {
      acc.push({ title: code.group, codes: [code] });
    }
    return acc;
  },
  []
);

export default function VisualCodePage() {
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(() => {
    if (active === "All") return { codes: VISUAL_CODES, groups: GROUPS };
    const groups = GROUPS.filter((g) => g.title === active);
    return { codes: groups.flatMap((g) => g.codes), groups };
  }, [active]);

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-24 pb-16 md:px-8 lg:px-10 md:py-28">
      <div className="flex flex-col gap-3">
        <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
          Event poster design codes
        </h1>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {VISUAL_CODES.length} rebuild codes across {GROUPS.length} style categories. Pick a category,
          copy a line, attach your reference poster, and rebuild it in that visual language.
        </p>
      </div>

      <div className="sticky top-14 z-30 -mx-6 border-b bg-card px-6 py-2.5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Tab active={active} name="All" count={VISUAL_CODES.length} onSelect={setActive} />
          {GROUPS.map((g) => (
            <Tab key={g.title} active={active} name={g.title} count={g.codes.length} onSelect={setActive} />
          ))}
        </div>
      </div>

      {filtered.codes.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.codes.map((code) => (
            <VisualCodeCard key={code.id} code={code} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-muted-foreground">No codes in this category.</p>
      )}
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