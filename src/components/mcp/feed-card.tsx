"use client";

import {
  BadgeCheck,
  Bookmark,
  Check,
  Share,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ServerMark } from "@/components/mcp/server-mark";
import {
  formatCompact,
  metricsOf,
  timeAgo,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const PRICE_STYLES: Record<string, string> = {
  Free: "border border-emerald-200/60 bg-emerald-50/80 text-emerald-700",
  Freemium: "border border-amber-200/60 bg-amber-50/80 text-amber-700",
  Paid: "border border-slate-200/60 bg-slate-100 text-slate-700",
};

export function FeedCard({
  server,
  bookmarked,
  shared,
  onBookmark,
  onShare,
  onOpen,
}: {
  server: McpServer;
  bookmarked: boolean;
  shared: boolean;
  onBookmark: () => void;
  onShare: () => void;
  onOpen: () => void;
}) {
  const m = metricsOf(server);
  const handle = `@${server.org.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${server.name} details`}
      className="flex cursor-pointer flex-col rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all duration-200 hover:-translate-y-[2px] hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <ServerMark
          server={server}
          className="size-8 bg-slate-100/80"
          roundedClass="rounded-lg border border-slate-200/50"
          letterClassName="text-xs"
        />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-slate-900">
              {server.name}
            </span>
            {server.verified ? (
              <BadgeCheck
                className="size-4 shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
            ) : null}
          </p>
          <p className="truncate font-mono text-[11px] text-slate-400">
            {handle} · {timeAgo(server)}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold",
            PRICE_STYLES[m.priceTier]
          )}
        >
          {m.priceTier}
        </span>
      </div>

      {/* Category + short description */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge
          variant="outline"
          className="rounded-full border-border/60 font-mono text-xs font-medium"
        >
          {server.category}
        </Badge>
        {server.tags.slice(0, 2).map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="rounded-full font-mono text-xs font-medium"
          >
            {t}
          </Badge>
        ))}
        {server.tags.length > 2 ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            +{server.tags.length - 2}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
        {server.description}
      </p>

      {/* Stars · Save · Share */}
      <div className="mt-3 flex items-center gap-1 border-t border-border pt-2.5">
        <span
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          title={`${server.stars.toLocaleString()} GitHub stars`}
        >
          <Star
            className="size-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          {formatCompact(server.stars)}
        </span>
        <span className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            aria-label={bookmarked ? "Unsave" : "Save"}
            aria-pressed={bookmarked}
            className={cn(
              "rounded-full p-2 text-muted-foreground transition-colors",
              bookmarked
                ? "text-sky-600"
                : "hover:bg-sky-100 hover:text-sky-600"
            )}
          >
            <Bookmark
              className={cn("size-5", bookmarked && "fill-sky-600")}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            aria-label={shared ? "Copied" : "Share install command"}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-sky-100 hover:text-sky-600"
          >
            {shared ? (
              <Check className="size-5 text-emerald-600" aria-hidden="true" />
            ) : (
              <Share className="size-5" aria-hidden="true" />
            )}
          </button>
        </span>
      </div>
    </article>
  );
}

