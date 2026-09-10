"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

import { VisualCodeCard } from "@/components/visual-code-card";
import type { VisualCode } from "@/lib/visual-codes";

export function VisualCodeGroup({
  group,
  codes,
}: {
  group: string;
  codes: VisualCode[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? codes : codes.slice(0, 5);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4 border-b pb-2">
        <h2 className="font-sans text-lg font-semibold tracking-tight">{group}</h2>
        <span className="text-xs tabular-nums text-muted-foreground">
          {codes[0].id}–{codes[codes.length - 1].id}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {visible.map((code) => (
          <VisualCodeCard key={code.id} code={code} />
        ))}
        {codes.length > 5 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex min-h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 p-3 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {expanded ? (
              <>
                <ChevronDown className="size-5 rotate-180 transition-transform" />
                <span className="text-sm font-medium">Show less</span>
              </>
            ) : (
              <>
                <Plus className="size-5 transition-transform" />
                <span className="text-sm font-medium">See more</span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </section>
  );
}