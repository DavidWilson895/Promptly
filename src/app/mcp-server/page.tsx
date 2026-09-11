"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Search, Sparkles, Star, TrendingUp, Trophy, X } from "lucide-react";
import { FeedPost } from "@/components/mcp/feed-post";
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

export default function McpServerPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("hot");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [loved, setLoved] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [stack, setStack] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = MCP_SERVERS.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (verifiedOnly && !s.verified) return false;
      if (priceFilter !== "All" && metricsOf(s).priceTier !== priceFilter)
        return false;
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
  }, [query, category, verifiedOnly, priceFilter, sort]);

  const topOfFeed = useMemo(
    () => sortServers(MCP_SERVERS, "top").slice(0, 3),
    []
  );
  const trendingCount = Math.max(
    1,
    MCP_SERVERS.reduce((n, s) => n + (metricsOf(s).postedDays < 14 ? 1 : 0), 0)
  );

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

  return (
    <div className="bg-muted/30">
      <main className="w-full px-4 pb-28 md:px-6 lg:px-8">
        {/* Slim storefront header */}
        <header className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-4 pt-20 md:pt-24">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-background">
              <Sparkles className="size-3.5" aria-hidden="true" />
              MCP Server Marketplace
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-3 py-1 text-muted-foreground">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              {trendingCount} new this month
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-3 py-1 text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              community rated
            </span>
          </div>
          <div>
            <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
              Shop the servers.{" "}
              <span className="font-sans italic font-semibold">
                Upvote the good ones.
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              A storefront of community-voted MCP servers. Browse the aisles,
              upvote your favourites, and add what you need to your stack.
            </p>
          </div>
          <div className="relative w-full max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the store: servers, tools, tags…"
              className="h-11 w-full rounded-full border border-border/60 bg-white pl-11 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-3 outline-none"
              aria-label="Search MCP servers"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </header>

        {/* Three-column storefront + feed */}
        <div className="mx-auto mt-8 flex w-full max-w-[1600px] items-start gap-6 xl:gap-8">
          {/* Left rail */}
          <aside className="sticky top-24 hidden w-56 shrink-0 md:block lg:w-64">
            <ShopSidebar
              category={category}
              onCategory={setCategory}
              verifiedOnly={verifiedOnly}
              onVerifiedOnly={setVerifiedOnly}
              priceFilter={priceFilter}
              onPriceFilter={setPriceFilter}
              stack={stack}
              onOpenCart={() => setCartOpen(true)}
            />
          </aside>

          {/* Center feed */}
          <section className="min-w-0 flex-1">
            {/* Feed controls */}
            <div className="sticky top-14 z-30 -mx-4 border-b bg-card px-4 py-2.5 md:-mx-6 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1">
                  {(
                    [
                      ["hot", "Hot"],
                      ["new", "New"],
                      ["top", "Top"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSort(key)}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[15px] transition-colors",
                        sort === key
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-pressed={sort === key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {filtered.length} results
                </span>
              </div>
            </div>

            {/* Feed rows */}
            {filtered.length > 0 ? (
              <div className="divide-y divide-border/60 bg-card">
                {filtered.map((server, i) => (
                  <FeedPost
                    key={server.id}
                    server={server}
                    sortedIndex={i}
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
              <div className="flex flex-col items-center gap-3 pt-16 text-center">
                <p className="text-base font-medium">Nothing in stock</p>
                <p className="max-w-sm text-sm text-pretty text-muted-foreground">
                  Try a different search, category, or filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                    setVerifiedOnly(false);
                    setPriceFilter("All");
                  }}
                  className="mt-1 rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:opacity-90"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Top of the feed strip */}
            {filtered.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-border/60 bg-card p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Trophy className="size-3.5" aria-hidden="true" />
                  Top of the feed this week
                </p>
                <ul className="mt-3 flex flex-col divide-y divide-border/40">
                  {topOfFeed.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 py-2 text-sm">
                      <span className="text-base" aria-hidden="true">
                        {s.icon}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {s.name}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {metricsOf(s).upvotes.toLocaleString()} ▲
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(setStack, s.id)}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                          stack.has(s.id)
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        )}
                      >
                        {stack.has(s.id) ? "Added" : "Add"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {/* Right rail */}
          <aside className="sticky top-24 hidden w-64 shrink-0 lg:block xl:w-72">
            <RightRail onCategory={setCategory} />
          </aside>
        </div>
      </main>

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