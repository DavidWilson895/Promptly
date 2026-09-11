"use client";

import { useMemo } from "react";

import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bookmark,
  Database,
  FlaskConical,
  Globe,
  House,
  MessagesSquare,
  Palette,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import {
  MCP_SERVERS,
  MCP_CATEGORIES,
  metricsOf,
} from "@/lib/mcp-servers";
import { ServerMark } from "@/components/mcp/server-mark";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Developer Tools": FlaskConical,
  Productivity: Rocket,
  Database,
  Monitoring: Activity,
  "Browser & Automation": Globe,
  Design: Palette,
  "Data & Analytics": BarChart3,
  Communication: MessagesSquare,
};

export function ShopSidebar({
  category,
  onCategory,
  verifiedOnly,
  onVerifiedOnly,
  priceFilter,
  onPriceFilter,
  savedOnly,
  onSavedOnly,
  savedCount,
  onQuery,
}: {
  category: string;
  onCategory: (c: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnly: (v: boolean) => void;
  priceFilter: string;
  onPriceFilter: (p: string) => void;
  savedOnly: boolean;
  onSavedOnly: (v: boolean) => void;
  savedCount: number;
  onQuery: (q: string) => void;
}) {
  const prices = ["All", "Free", "Freemium", "Paid"] as const;
  const verifiedCount = MCP_SERVERS.filter((s) => s.verified).length;

  const topRated = useMemo(
    () =>
      [...MCP_SERVERS]
        .sort((a, b) => metricsOf(b).rating - metricsOf(a).rating)
        .slice(0, 5),
    []
  );

  const trendingTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of MCP_SERVERS) {
      for (const t of s.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="px-3 pb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Browse
      </p>
      <div className="flex flex-col" aria-label="Categories">
        <button
          type="button"
          onClick={() => onCategory("All")}
            className={cn(
              "flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-lg transition-colors hover:bg-muted",
              category === "All" && "bg-muted"
            )}
            aria-pressed={category === "All"}
        >
          <House className="size-6 shrink-0 text-muted-foreground" />
          <span
            className={cn(
              "flex-1 truncate",
              category === "All" ? "font-bold" : "text-muted-foreground"
            )}
          >
            All servers
          </span>
          <span className="text-sm tabular-nums text-muted-foreground">
            {MCP_SERVERS.length}
          </span>
        </button>
        {MCP_CATEGORIES.filter((c) => c !== "All").map((c) => {
          const Icon = CATEGORY_ICONS[c] ?? FlaskConical;
          const count = MCP_SERVERS.filter((s) => s.category === c).length;
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onCategory(c)}
              className={cn(
                "flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-lg transition-colors hover:bg-muted",
                active && "bg-muted"
              )}
              aria-pressed={active}
            >
              <Icon className="size-6 shrink-0 text-muted-foreground" />
              <span
                className={cn(
                  "flex-1 truncate",
                  active ? "font-bold" : "text-muted-foreground"
                )}
              >
                {c}
              </span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 pt-3">
        <button
          type="button"
          onClick={() => onSavedOnly(!savedOnly)}
          aria-pressed={savedOnly}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-sm font-bold transition-colors",
            savedOnly
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          <Bookmark
            className={cn("size-4", savedOnly && "fill-current")}
            aria-hidden="true"
          />
          Saved
          {savedCount > 0 ? (
            <span
              className={cn(
                "rounded-full px-1.5 text-xs font-bold tabular-nums",
                savedOnly ? "bg-background/20" : "bg-sky-500 text-white"
              )}
            >
              {savedCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onVerifiedOnly(!verifiedOnly)}
          aria-pressed={verifiedOnly}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-full border px-2 py-1.5 text-sm font-bold transition-colors",
            verifiedOnly
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          )}
        >
          <BadgeCheck className="size-4" aria-hidden="true" />
          Verified
          <span
            className={cn(
              "rounded-full px-1.5 text-xs font-bold tabular-nums",
              verifiedOnly ? "bg-background/20" : "bg-sky-500 text-white"
            )}
          >
            {verifiedCount}
          </span>
        </button>
      </div>

      <p className="px-3 pb-2 pt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Price
      </p>
      <div className="px-3">
        <div
          className="flex w-fit divide-x divide-border overflow-hidden rounded-full border border-border"
          role="group"
          aria-label="Filter by price"
        >
          {prices.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPriceFilter(p)}
              aria-pressed={priceFilter === p}
              className={cn(
                "px-3 py-1 text-sm font-bold transition-colors",
                priceFilter === p
                  ? "bg-gradient-to-b from-black to-neutral-800 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <p className="px-3 pb-1 pt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Top rated
      </p>
      <div className="flex flex-col" aria-label="Top rated">
        {topRated.map((s) => {
          const m = metricsOf(s);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onCategory(s.category)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-muted"
            >
              <ServerMark
                server={s}
                className="size-6"
                letterClassName="text-[11px]"
              />
              <span className="min-w-0 flex-1 truncate text-base">
                {s.name}
              </span>
              <span className="shrink-0 font-mono text-sm font-bold tabular-nums">
                {m.rating.toFixed(1)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="px-3 pb-1 pt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Trending tags
      </p>
      <div className="flex flex-col pb-4" aria-label="Trending tags">
        {trendingTags.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => onQuery(t.tag)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-muted"
          >
            <span className="min-w-0 flex-1 truncate text-base">
              <span className="font-medium">#{t.tag}</span>
            </span>
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {t.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
