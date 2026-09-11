"use client";

import {
  BadgeCheck,
  Bookmark,
  Check,
  Share,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  avatarOf,
  formatCompact,
  metricsOf,
  timeAgo,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const PRICE_STYLES: Record<string, string> = {
  Free: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Freemium: "border-amber-200 bg-amber-50 text-amber-700",
  Paid: "border-sky-200 bg-sky-50 text-sky-700",
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
  const av = avatarOf(server);
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
      className="flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-4 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base font-bold text-white",
            av.gradient
          )}
          aria-hidden="true"
        >
          {av.letter}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1">
            <span className="truncate text-lg font-bold leading-tight">
              {server.name}
            </span>
            {server.verified ? (
              <BadgeCheck
                className="size-4 shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
            ) : null}
          </p>
          <p className="truncate text-sm text-muted-foreground">
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
          className="rounded-full border-border/60 text-xs font-medium"
        >
          {server.category}
        </Badge>
        {server.tags.slice(0, 2).map((t) => (
          <Badge
            key={t}
            variant="secondary"
            className="rounded-full text-xs font-medium"
          >
            {t}
          </Badge>
        ))}
        {server.tags.length > 2 ? (
          <span className="text-xs tabular-nums text-muted-foreground">
            +{server.tags.length - 2}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 line-clamp-2 text-base leading-snug text-foreground">
        {server.description}
      </p>

      {/* Stars · Save · Share */}
      <div className="mt-3 flex items-center gap-1 border-t border-border pt-2.5">
        <span
          className="flex items-center gap-1.5 text-sm tabular-nums text-muted-foreground"
          title={`${server.stars.toLocaleString()} GitHub stars`}
        >
          <Star
            className="size-[18px] fill-amber-400 text-amber-400"
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

