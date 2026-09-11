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
  Free: "border border-neutral-300 bg-white text-black",
  Freemium: "border border-red-200 bg-white text-red-600",
  Paid: "border border-black bg-gradient-to-b from-black to-neutral-800 text-white",
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
      className="flex cursor-pointer flex-col rounded-xl border border-transparent bg-neutral-100 p-4 outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-[2px] hover:border-neutral-100 hover:bg-[linear-gradient(180deg,#FFFFFF_39%,#A3FFBF_100%)] hover:shadow-[0px_0.6px_1px_-1.4px_rgba(0,0,0,0.36),0px_2.3px_4.1px_-2.8px_rgba(0,0,0,0.31),0px_10px_18px_-4.25px_rgba(0,0,0,0.07)] focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2.5">
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

