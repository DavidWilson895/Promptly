"use client";

import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bookmark,
  Database,
  FlaskConical,
  Globe,
  MessagesSquare,
  Palette,
  Rocket,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import {
  MCP_SERVERS,
  MCP_CATEGORIES,
} from "@/lib/mcp-servers";
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

function NavRow({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex w-fit items-center gap-4 rounded-full p-3 text-xl transition-colors hover:bg-muted"
    >
      <Icon className="size-7 shrink-0" aria-hidden="true" />
      <span className={cn("truncate", active ? "font-extrabold" : undefined)}>
        {label}
      </span>
      {badge !== undefined && badge > 0 ? (
        <span className="rounded-full bg-sky-500 px-2 py-0.5 text-sm font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

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
  stack,
  onOpenCart,
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
  stack: Set<string>;
  onOpenCart: () => void;
}) {
  const prices = ["All", "Free", "Freemium", "Paid"] as const;
  const verifiedCount = MCP_SERVERS.filter((s) => s.verified).length;

  return (
    <div className="flex flex-col gap-1 py-2">
      <nav className="flex flex-col" aria-label="Marketplace">
        <NavRow
          icon={Bookmark}
          label="Saved"
          active={savedOnly}
          onClick={() => onSavedOnly(!savedOnly)}
          badge={savedCount}
        />
        <NavRow
          icon={BadgeCheck}
          label="Verified"
          active={verifiedOnly}
          onClick={() => onVerifiedOnly(!verifiedOnly)}
          badge={verifiedCount}
        />
      </nav>

      <p className="px-3 pb-1 pt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Browse
      </p>
      <div className="flex flex-col" aria-label="Categories">
        <button
          type="button"
          onClick={() => onCategory("All")}
          className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-lg transition-colors hover:bg-muted"
          aria-pressed={category === "All"}
        >
          <FlaskConical className="size-6 shrink-0 text-muted-foreground" />
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
              className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-left text-lg transition-colors hover:bg-muted"
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

      <p className="px-3 pb-2 pt-5 text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Price
      </p>
      <div className="flex flex-wrap gap-2 px-3">
        {prices.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPriceFilter(p)}
            aria-pressed={priceFilter === p}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-bold transition-colors",
              priceFilter === p
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenCart}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-lg font-bold text-background transition-opacity hover:opacity-90"
      >
        <ShoppingCart className="size-5" aria-hidden="true" />
        Your Stack{stack.size > 0 ? ` (${stack.size})` : ""}
      </button>
    </div>
  );
}
