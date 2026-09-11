"use client";

import { useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BadgeCheck, Bookmark, Search, X } from "lucide-react";
import { FeedCard } from "@/components/mcp/feed-card";
import { ShopSidebar } from "@/components/mcp/shop-sidebar";
import { RightRail } from "@/components/mcp/right-rail";
import { CartPanel } from "@/components/mcp/cart-panel";
import {
  MCP_SERVERS,
  metricsOf,
  sortServers,
  type SortKey,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const TABS: { key: SortKey; label: string }[] = [
  { key: "hot", label: "Hot" },
  { key: "new", label: "New" },
  { key: "top", label: "Top" },
];

export default function McpServerPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("hot");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [loved, setLoved] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [followedOrgs, setFollowedOrgs] = useState<Set<string>>(new Set());
  const [stack, setStack] = useState<Set<string>>(new Set());
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
    <div className="min-h-screen bg-background pt-14">
      <div className="mx-auto flex w-full max-w-[1500px] items-start justify-center">
        {/* Left rail */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto px-2 py-2 md:block lg:w-72">
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
            stack={stack}
            onOpenCart={() => setCartOpen(true)}
          />
        </aside>

        {/* Center feed */}
        <section className="min-h-screen w-full min-w-0 flex-1 border-x border-border">
          <div ref={feedTopRef} className="scroll-mt-16" />

          {/* Sort tabs */}
          <div
            className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md"
            role="tablist"
            aria-label="Sort servers"
          >
            <div className="flex items-center">
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
                      "relative flex-1 py-4 text-lg transition-colors hover:bg-muted/60",
                      active
                        ? "font-bold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t.label}
                    {active ? (
                      <span className="absolute inset-x-16 bottom-0 h-1 rounded-full bg-sky-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + active filters */}
          <div className="border-b border-border px-4 py-3">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search servers, tools, tags…"
                aria-label="Search servers"
                className="h-12 w-full rounded-full border border-border bg-muted/60 pl-11 pr-10 text-base outline-none placeholder:text-muted-foreground focus:border-sky-500 focus:bg-background"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
              {hasActiveFilters ? (
                <>
                  {category !== "All" ? (
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
                </>
              ) : (
                <span className="text-sm tabular-nums text-muted-foreground">
                  {filtered.length} servers · sorted by {sort}
                </span>
              )}
            </div>
          </div>

          {/* Feed */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((server) => (
                <FeedCard
                  key={server.id}
                  server={server}
                  upvoted={upvoted.has(server.id)}
                  loved={loved.has(server.id)}
                  bookmarked={bookmarked.has(server.id)}
                  inStack={stack.has(server.id)}
                  copied={copiedId === server.id}
                  onUpvote={() => toggle(setUpvoted, server.id)}
                  onLove={() => toggle(setLoved, server.id)}
                  onBookmark={() => toggle(setBookmarked, server.id)}
                  onStack={() => toggle(setStack, server.id)}
                  onCopy={() => copyInstall(server.id)}
                />
              ))}
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

        {/* Right rail */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[350px] shrink-0 overflow-y-auto px-7 py-3 2xl:block">
          <RightRail
            query={query}
            onQuery={setQuery}
            onCategory={(c) => {
              setCategory(c);
              scrollFeedTop();
            }}
            followedOrgs={followedOrgs}
            onToggleFollow={(org) => toggle(setFollowedOrgs, org)}
          />
        </aside>
      </div>

      <CartPanel
        stackIds={stack}
        open={cartOpen}
        onOpenChange={setCartOpen}
        copiedAll={copiedId === "__all__"}
        onCopyAll={copyAll}
        onRemove={(id) => toggle(setStack, id)}
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
