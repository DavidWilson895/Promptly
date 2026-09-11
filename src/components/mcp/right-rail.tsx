"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  MCP_SERVERS,
  avatarOf,
  formatCompact,
  metricsOf,
  timeAgo,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

function handleOf(org: string): string {
  return `@${org.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}

export function RightRail({
  query,
  onQuery,
  onCategory,
  followedOrgs,
  onToggleFollow,
}: {
  query: string;
  onQuery: (q: string) => void;
  onCategory: (c: string) => void;
  followedOrgs: Set<string>;
  onToggleFollow: (org: string) => void;
}) {
  const [newsVisible, setNewsVisible] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const topRated = useMemo(
    () =>
      [...MCP_SERVERS]
        .sort((a, b) => metricsOf(b).rating - metricsOf(a).rating)
        .slice(0, 5),
    []
  );

  const trendingTags = useMemo(() => {
    const map = new Map<string, { count: number; cats: Map<string, number> }>();
    for (const s of MCP_SERVERS) {
      for (const t of s.tags) {
        const e = map.get(t) ?? { count: 0, cats: new Map<string, number>() };
        e.count += 1;
        e.cats.set(s.category, (e.cats.get(s.category) ?? 0) + 1);
        map.set(t, e);
      }
    }
    return [...map.entries()]
      .map(([tag, v]) => ({
        tag,
        count: v.count,
        topCat: [...v.cats.entries()].sort((a, b) => b[1] - a[1])[0][0],
      }))
      .sort((a, b) => b.count - a.count);
  }, []);
  const visibleTags = tagsExpanded ? trendingTags : trendingTags.slice(0, 4);

  const topOrgs = useMemo(() => {
    const map = new Map<
      string,
      { servers: number; upvotes: number; sample: McpServer }
    >();
    for (const s of MCP_SERVERS) {
      const e = map.get(s.org) ?? {
        servers: 0,
        upvotes: 0,
        sample: s,
      };
      e.servers += 1;
      e.upvotes += metricsOf(s).upvotes;
      map.set(s.org, e);
    }
    return [...map.entries()]
      .map(([org, v]) => ({ org, ...v }))
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, []);

  return (
    <div className="flex flex-col gap-4 pb-8">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-full border border-transparent bg-muted px-4 transition-colors focus-within:border-sky-500 focus-within:bg-background">
        <Search
          className="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search servers"
          aria-label="Search servers"
          className="h-11 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQuery("")}
            aria-label="Clear search"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>

      {/* Top rated */}
      {newsVisible ? (
        <section className="overflow-hidden rounded-2xl bg-muted" aria-label="Top rated servers">
          <div className="flex items-center justify-between px-4 pt-3">
            <h2 className="text-xl font-extrabold">Top rated</h2>
            <button
              type="button"
              onClick={() => setNewsVisible(false)}
              aria-label="Dismiss top rated"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-1 flex flex-col pb-2">
            {topRated.map((s) => {
              const m = metricsOf(s);
              const av = avatarOf(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onCategory(s.category)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-black/[0.04]"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                      av.gradient
                    )}
                    aria-hidden="true"
                  >
                    {av.letter}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-bold leading-snug">
                      {s.name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {timeAgo(s)} · {s.category} ·{" "}
                      {formatCompact(m.reviews)} reviews
                    </span>
                  </span>
                  <span className="shrink-0 text-base font-bold tabular-nums">
                    {m.rating.toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Trending tags */}
      <section className="overflow-hidden rounded-2xl bg-muted" aria-label="Trending tags">
        <h2 className="px-4 pt-3 text-xl font-extrabold">Trending tags</h2>
        <div className="mt-1 flex flex-col pb-1">
          {visibleTags.map((t) => (
            <button
              key={t.tag}
              type="button"
              onClick={() => onCategory(t.topCat)}
              className="w-full px-4 py-2.5 text-left transition-colors hover:bg-black/[0.04]"
            >
              <span className="block text-sm text-muted-foreground">
                Trending in {t.topCat}
              </span>
              <span className="block text-base font-bold">#{t.tag}</span>
              <span className="block text-sm tabular-nums text-muted-foreground">
                {t.count} servers
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTagsExpanded(!tagsExpanded)}
          className="w-full px-4 py-3 text-left text-base text-sky-600 transition-colors hover:bg-black/[0.04]"
        >
          {tagsExpanded ? "Show less" : "Show more"}
        </button>
      </section>

      {/* Top publishers */}
      <section className="overflow-hidden rounded-2xl bg-muted" aria-label="Top publishers">
        <h2 className="px-4 pt-3 text-xl font-extrabold">Top publishers</h2>
        <div className="mt-1 flex flex-col pb-2">
          {topOrgs.map(({ org, servers, sample }) => {
            const av = avatarOf(sample);
            const following = followedOrgs.has(org);
            return (
              <div
                key={org}
                className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-black/[0.04]"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-white",
                    av.gradient
                  )}
                  aria-hidden="true"
                >
                  {org.trim().charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-bold leading-tight">
                    {org}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {handleOf(org)} · {servers} server{servers === 1 ? "" : "s"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onToggleFollow(org)}
                  aria-pressed={following}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                    following
                      ? "border border-border bg-background text-foreground hover:border-foreground/40"
                      : "bg-foreground text-background hover:opacity-90"
                  )}
                >
                  {following ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <p className="px-4 text-sm leading-relaxed text-muted-foreground">
        MCP Server Marketplace · browse, upvote and stack the servers you love.
      </p>
    </div>
  );
}
