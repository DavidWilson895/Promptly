"use client";

import { useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Bookmark, Search, X } from "lucide-react";
import { FeedCard } from "@/components/mcp/feed-card";
import { MagneticGrid } from "@/components/mcp/magnetic-grid";
import { ShopSidebar } from "@/components/mcp/shop-sidebar";
import { CartPanel } from "@/components/mcp/cart-panel";
import {
  MCP_SERVERS,
  metricsOf,
  sortServers,
  type SortKey,
} from "@/lib/mcp-servers";
import { useStack } from "@/lib/use-stack";
import { cn } from "@/lib/utils";

const TABS: { key: SortKey; label: string }[] = [
  { key: "hot", label: "Hot" },
  { key: "new", label: "New" },
  { key: "top", label: "Top" },
];

export default function McpServerPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("hot");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const { stack, toggle: toggleStack } = useStack();
  const [cartOpen, setCartOpen] = useState(false);
  const feedTopRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = MCP_SERVERS.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (verifiedOnly && !s.verified) return false;
      if (priceFilter !== "All" && metricsOf(s).priceTier !== priceFilter)
        return false;
      if (savedOnly && !bookmarked.has(s.id)) return false;
      if (
        q &&
        !`${s.name} ${s.org} ${s.description} ${s.category} ${s.tags.join(" ")} ${s.tools.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
    return sortServers(matched, sort);
  }, [query, category, verifiedOnly, priceFilter, savedOnly, bookmarked, sort]);

  const hasActiveFilters =
    category !== "All" ||
    priceFilter !== "All" ||
    verifiedOnly ||
    savedOnly;

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setVerifiedOnly(false);
    setPriceFilter("All");
    setSavedOnly(false);
  }

  function toggle(
    setter: Dispatch<SetStateAction<Set<string>>>,
    id: string
  ) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function copyInstall(id: string) {
    const server = MCP_SERVERS.find((s) => s.id === id);
    if (!server) return;
    try {
      void navigator.clipboard.writeText(server.install);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = server.install;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  function copyAll() {
    const text = MCP_SERVERS.filter((s) => stack.has(s.id))
      .map((s) => s.install)
      .join("\n");
    try {
      void navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
    setCopiedId("__all__");
    setTimeout(() => setCopiedId(null), 1600);
  }

  function scrollFeedTop() {
    feedTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-14">
      <div className="mx-auto flex w-full items-start justify-center px-6 md:px-8 lg:px-10">
        {/* Left rail */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto px-2 pb-2 pt-10 md:block lg:w-72 xl:w-80">
          <ShopSidebar
            category={category}
            onCategory={(c) => {
              setCategory(c);
              scrollFeedTop();
            }}
            verifiedOnly={verifiedOnly}
            onVerifiedOnly={setVerifiedOnly}
            priceFilter={priceFilter}
            onPriceFilter={setPriceFilter}
            savedOnly={savedOnly}
            onSavedOnly={setSavedOnly}
            savedCount={bookmarked.size}
            onQuery={(q) => {
              setQuery(q);
              scrollFeedTop();
            }}
          />
        </aside>

        {/* Center feed */}
        <section className="min-h-screen w-full min-w-0 flex-1">
          <div ref={feedTopRef} className="scroll-mt-16" />

          {/* Sort tabs */}
          <div
            className="sticky top-14 z-30 border-b border-slate-200/80 bg-[#F8FAFC]/85 backdrop-blur-md"
            role="tablist"
            aria-label="Sort servers"
          >
            <div className="flex items-center justify-between gap-2 pl-2 pr-4">
              <div className="flex min-w-0 items-center gap-1">
              {TABS.map((t) => {
                const active = sort === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSort(t.key);
                      scrollFeedTop();
                    }}
                    className={cn(
                      "px-3 py-3 text-[15px] transition-colors",
                      active
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative pb-1.5">
                      {t.label}
                      {active ? (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-foreground" />
                      ) : null}
                    </span>
                  </button>
                );
              })}
              </div>
              <div className="relative w-40 shrink-0 sm:w-56 md:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search servers…"
                  aria-label="Search servers"
                  className="h-9 w-full rounded-full border border-border bg-muted/60 pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground focus:border-sky-500 focus:bg-background"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters || query ? (
            <div className="border-b border-border px-4 py-3">
              <div className="flex flex-wrap items-center gap-1.5 px-1">
                {query ? (
                  <FilterChip
                    label={`“${query}”`}
                    onClear={() => setQuery("")}
                  />
                ) : null}                  {category !== "All" ? (
                    <FilterChip
                      label={category}
                      onClear={() => setCategory("All")}
                    />
                  ) : null}
                  {priceFilter !== "All" ? (
                    <FilterChip
                      label={priceFilter}
                      onClear={() => setPriceFilter("All")}
                    />
                  ) : null}
                  {verifiedOnly ? (
                    <FilterChip
                      icon
                      label="Verified"
                      onClear={() => setVerifiedOnly(false)}
                    />
                  ) : null}
                  {savedOnly ? (
                    <FilterChip
                      icon
                      label="Saved"
                      onClear={() => setSavedOnly(false)}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="ml-auto text-sm font-medium text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Clear all
                  </button>
              </div>
            </div>
          ) : null}

          {/* Feed */}
          {filtered.length > 0 ? (
            <div className="relative">
              <MagneticGrid />
              <div className="relative grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 min-[1500px]:grid-cols-4">
              {filtered.map((server) => (
                <FeedCard
                  key={server.id}
                  server={server}
                  bookmarked={bookmarked.has(server.id)}
                  shared={copiedId === server.id}
                  onBookmark={() => toggle(setBookmarked, server.id)}
                  onShare={() => copyInstall(server.id)}
                  onOpen={() => router.push(`/mcp-server/${server.id}`)}
                />
              ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
              <p className="text-xl font-bold">Nothing in stock</p>
              <p className="max-w-sm text-pretty text-base text-muted-foreground">
                {savedOnly && bookmarked.size === 0
                  ? "You haven't saved any servers yet. Tap the bookmark on any server to keep it here."
                  : "Try a different search, category, or filter."}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-1 rounded-full bg-foreground px-5 py-2 text-base font-bold text-background hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </div>

      <CartPanel
        stackIds={stack}
        open={cartOpen}
        onOpenChange={setCartOpen}
        copiedAll={copiedId === "__all__"}
        onCopyAll={copyAll}
        onRemove={toggleStack}
      />
    </div>
  );
}

function FilterChip({
  label,
  onClear,
  icon,
}: {
  label: string;
  onClear: () => void;
  icon?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground py-1 pl-3 pr-1.5 text-sm font-medium text-background">
      {icon === true && label === "Verified" ? (
        <BadgeCheck className="size-3.5" aria-hidden="true" />
      ) : null}
      {icon === true && label === "Saved" ? (
        <Bookmark className="size-3.5" aria-hidden="true" />
      ) : null}
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
        className="rounded-full p-0.5 hover:bg-background/20"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}
