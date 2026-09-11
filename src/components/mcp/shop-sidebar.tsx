"use client";

import {
  FlaskConical,
  Rocket,
  Database,
  Activity,
  Globe,
  Palette,
  BarChart3,
  MessagesSquare,
  BadgeCheck,
  ShoppingCart,
  Tag,
} from "lucide-react";
import {
  MCP_SERVERS,
  MCP_CATEGORIES,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, typeof FlaskConical> = {
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
  stack,
  onOpenCart,
}: {
  category: string;
  onCategory: (c: string) => void;
  verifiedOnly: boolean;
  onVerifiedOnly: (v: boolean) => void;
  priceFilter: string;
  onPriceFilter: (p: string) => void;
  stack: Set<string>;
  onOpenCart: () => void;
}) {
  const prices = ["All", "Free", "Freemium", "Paid"] as const;
  const verifiedCount = MCP_SERVERS.filter((s) => s.verified).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Storefront menu */}
      <div>
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Tag className="size-3.5" aria-hidden="true" />
          Browse
        </p>
        <nav className="mt-2 flex flex-col gap-0.5" aria-label="Categories">
          <button
            type="button"
            onClick={() => onCategory("All")}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
              category === "All"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <FlaskConical
              className={cn(
                "size-4",
                category === "All" ? "text-background" : "text-foreground/70"
              )}
            />
            All servers
            <span
              className={cn(
                "ml-auto text-xs tabular-nums",
                category === "All" ? "text-background/70" : "text-muted-foreground/70"
              )}
            >
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
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-background" : "text-foreground/70"
                  )}
                />
                {c}
                <span
                  className={cn(
                    "ml-auto text-xs tabular-nums",
                    active ? "text-background/70" : "text-muted-foreground/70"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Activity className="size-3.5" aria-hidden="true" />
          Filters
        </p>
        <button
          type="button"
          onClick={() => onVerifiedOnly(!verifiedOnly)}
          aria-pressed={verifiedOnly}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
            verifiedOnly
              ? "bg-emerald-50 text-emerald-700"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <BadgeCheck className="size-4" aria-hidden="true" />
          Verified only
          <span
            className={cn(
              "ml-auto text-xs tabular-nums",
              verifiedOnly ? "text-emerald-600/70" : "text-muted-foreground/70"
            )}
          >
            {verifiedCount}
          </span>
        </button>
        <div className="flex flex-wrap gap-1.5 px-1">
          {prices.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPriceFilter(p)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                priceFilter === p
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Featured promo */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
          Featured
        </p>
        <p className="mt-1 text-sm font-semibold text-orange-950">
          GitHub · the most installed server
        </p>
        <p className="mt-1 text-xs leading-relaxed text-orange-800/80">
          Repos, issues, PRs and code search — 39.5k stars and rising.
        </p>
      </div>

      {/* Your stack */}
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ShoppingCart className="size-3.5" aria-hidden="true" />
          Your stack
        </p>
        {stack.size > 0 ? (
          <>
            <ul className="mt-3 flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1">
              {Array.from(stack).map((id) => {
                const s = MCP_SERVERS.find((x) => x.id === id) as McpServer;
                return (
                  <li key={id} className="flex items-center gap-2 text-sm">
                    <span className="text-base" aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="truncate font-medium">{s.name}</span>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={onOpenCart}
              className="mt-3 w-full rounded-full bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              View cart ({stack.size})
            </button>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Your stack is empty. Add servers while you shop.
          </p>
        )}
      </div>
    </div>
  );
}