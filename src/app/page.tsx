"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { FilterBar, type SortKey } from "@/components/filter-bar";
import { useSearch } from "@/lib/search-context";
import { PromptCard } from "@/components/prompt-card";
import { PromptOverlay } from "@/components/prompt-overlay";
import { VisualCodeCard } from "@/components/visual-code-card";
import { VisualCodeOverlay } from "@/components/visual-code-overlay";
import { Highlighter } from "@/registry/magicui/highlighter";
import { type Category, type Model, type Prompt, type Style } from "@/lib/data";
import { REAL_PROMPTS } from "@/lib/data-real";
import { UPLOADED_PROMPTS } from "@/lib/data-upload";
import {
  VISUAL_CODES,
  categoryOf,
  type VisualCode,
} from "@/lib/visual-codes";
import type { ViewMode } from "@/components/mode-switch";

const ALL_PROMPTS: Prompt[] = [...UPLOADED_PROMPTS, ...REAL_PROMPTS];

function sortPrompts(prompts: Prompt[], sort: SortKey): Prompt[] {
  const now = Date.now();
  const sorted = [...prompts];
  switch (sort) {
    case "latest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "popular":
      return sorted.sort((a, b) => b.likes - a.likes);
    case "trending":
    default:
      return sorted.sort((a, b) => {
        const score = (p: Prompt) =>
          p.likes / ((now - new Date(p.createdAt).getTime()) / 86_400_000 + 2);
        return score(b) - score(a);
      });
  }
}

export default function HomePage() {
  const { search, setSearch } = useSearch();
  const [model, setModel] = useState<Model | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [sort, setSort] = useState<SortKey>("trending");
  const [mode, setMode] = useState<ViewMode>("image");
  const [codeCat, setCodeCat] = useState("All");
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [codeSelected, setCodeSelected] = useState<VisualCode | null>(null);
  const [codeOverlayOpen, setCodeOverlayOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = ALL_PROMPTS.filter((prompt) => {
      if (model && prompt.model !== model) return false;
      if (category && prompt.category !== category) return false;
      if (style && prompt.style !== style) return false;
      if (
        query &&
        !`${prompt.title} ${prompt.prompt} ${prompt.model} ${prompt.category} ${prompt.style}`
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    });
    return sortPrompts(matches, sort);
  }, [search, model, category, style, sort]);

  const filteredCodes = useMemo(() => {
    if (codeCat === "All") return VISUAL_CODES;
    return VISUAL_CODES.filter((c) => categoryOf(c) === codeCat);
  }, [codeCat]);

  function openPrompt(prompt: Prompt) {
    setSelected(prompt);
    setOverlayOpen(true);
  }

  function openCode(code: VisualCode) {
    setCodeSelected(code);
    setCodeOverlayOpen(true);
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Prompt>).detail;
      if (detail) setSelected(detail);
    };
    window.addEventListener("prompt:select", handler as EventListener);
    return () =>
      window.removeEventListener("prompt:select", handler as EventListener);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<VisualCode>).detail;
      if (detail) setCodeSelected(detail);
    };
    window.addEventListener("visual-code:select", handler as EventListener);
    return () =>
      window.removeEventListener("visual-code:select", handler as EventListener);
  }, []);

  useEffect(() => {
    let effect: { destroy: () => void } | null = null;
    let cancelled = false;
    const load = async () => {
      if (typeof window === "undefined") return;
      const loadScript = (src: string) =>
        new Promise<void>((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) return resolve();
          const s = document.createElement("script");
          s.src = src;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.body.appendChild(s);
        });
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.fog.min.js");
        if (cancelled) return;
        const w = window as unknown as {
          VANTA?: { FOG: (opts: Record<string, unknown>) => { destroy: () => void } };
        };
        if (w.VANTA?.FOG) {
          effect = w.VANTA.FOG({
            el: "#hero",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
          });
        }
      } catch {
        // Vanta failed to load - hero stays with plain background
      }
    };
    load();
    return () => {
      cancelled = true;
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div className="bg-muted/30">
      <section
        id="hero"
        className="relative w-full overflow-hidden px-4 pt-[88px] pb-12 md:px-6 lg:px-8 md:pt-[104px] md:pb-12 bg-gradient-to-b from-orange-100 via-sky-100 to-transparent"
      >
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="mx-auto mt-3 max-w-2xl font-sans text-[2.7rem] font-semibold leading-[1.05] tracking-tight whitespace-normal text-balance break-words md:text-[3.4rem]">
            Collect prompts{" "}
            <span className="font-sans italic font-semibold">worth keeping.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-pretty leading-relaxed text-muted-foreground">
            Each card pairs an image with the{" "}
            <Highlighter action="underline">exact prompt</Highlighter> that made
            it — tagged by{" "}
            <Highlighter action="highlight">model and style</Highlighter>.
          </p>
          <div className="relative mx-auto mt-6 w-full max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, models, styles…"
              className="h-11 rounded-full border-border/60 bg-white pl-11 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-3"
              aria-label="Search prompts"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <main className="w-full px-6 pb-16 md:px-8 lg:px-10">
        <div className="sticky top-14 z-30 border-b bg-card -mx-6 px-6 py-2.5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
          <FilterBar
            mode={mode}
            onMode={setMode}
            model={model}
            onModel={setModel}
            category={category}
            onCategory={setCategory}
            style={style}
            onStyle={setStyle}
            sort={sort}
            onSort={setSort}
            codeCat={codeCat}
            onCodeCat={setCodeCat}
            codeResultCount={filteredCodes.length}
            totalCodeCount={VISUAL_CODES.length}
          />
        </div>

        {mode === "image" ? (
          filtered.length > 0 ? (
            <div className="columns-2 gap-3 space-y-3 pt-4 sm:gap-4 sm:space-y-4 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
              {filtered.map((prompt, i) => (
                <PromptCard key={prompt.id} prompt={prompt} onOpen={openPrompt} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 pt-16 text-center">
              <p className="text-base font-medium">No prompts found</p>
              <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                Try removing a filter or searching for something else.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setModel(null);
                  setCategory(null);
                  setStyle(null);
                }}
                className="mt-1 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          )
        ) : filteredCodes.length > 0 ? (
          <div className="columns-2 gap-3 space-y-3 pt-4 sm:gap-4 sm:space-y-4 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
            {filteredCodes.map((code, i) => (
              <VisualCodeCard key={code.id} code={code} onOpen={openCode} index={i} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No codes in this category.
          </p>
        )}
      </main>

      {mode === "image" && (
        <PromptOverlay
          prompt={selected}
          open={overlayOpen}
          onOpenChange={setOverlayOpen}
        />
      )}
      {mode === "code" && (
        <VisualCodeOverlay
          code={codeSelected}
          open={codeOverlayOpen}
          onOpenChange={setCodeOverlayOpen}
        />
      )}
    </div>
  );
}