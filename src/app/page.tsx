"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterBar, type SortKey } from "@/components/filter-bar";
import { PromptCard } from "@/components/prompt-card";
import { PromptOverlay } from "@/components/prompt-overlay";
import {
  PROMPTS,
  type Category,
  type Model,
  type Prompt,
  type Style,
} from "@/lib/data";

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
  const [search, setSearch] = useState("");
  const [model, setModel] = useState<Model | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [sort, setSort] = useState<SortKey>("trending");
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = PROMPTS.filter((prompt) => {
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

  function openPrompt(prompt: Prompt) {
    setSelected(prompt);
    setOverlayOpen(true);
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

  function copyPrompt(prompt: Prompt) {
    navigator.clipboard
      .writeText(prompt.prompt)
      .then(() => toast.success(`Copied`))
      .catch(() => toast.error("Couldn't copy prompt"));
  }

  return (
    <div className="bg-muted/30">
      <section className="w-full px-4 pt-10 pb-8 md:px-6 lg:px-8 md:pt-12 md:pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Prompt library · {PROMPTS.length} curated examples · Daily updates
          </p>
          <h1 className="mx-auto mt-3 max-w-2xl font-heading text-[2.2rem] font-normal leading-[0.95] tracking-tight text-balance md:text-5xl">
            Collect prompts
            <br />
            <span className="font-heading italic font-normal">worth keeping.</span>
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-foreground/15" aria-hidden="true" />
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-pretty leading-relaxed text-muted-foreground">
            Each card pairs an image with the exact prompt that made it — tagged by
            model and style so you can find what fits your tool and remix it in one click.
          </p>
        </div>
      </section>

      <main className="w-full px-4 pb-16 md:px-6 lg:px-8">
        <div className="sticky top-14 z-30 border-b bg-card -mx-4 px-4 py-3 shadow-sm md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <FilterBar
            search={search}
            onSearch={setSearch}
            model={model}
            onModel={setModel}
            category={category}
            onCategory={setCategory}
            style={style}
            onStyle={setStyle}
            sort={sort}
            onSort={setSort}
            resultCount={filtered.length}
          />
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 pt-6 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {filtered.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onOpen={openPrompt}
                onCopy={copyPrompt}
              />
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
        )}
      </main>

      <PromptOverlay
        prompt={selected}
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
      />
    </div>
  );
}
