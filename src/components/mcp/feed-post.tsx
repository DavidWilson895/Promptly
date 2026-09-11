"use client";

import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Bookmark,
  Check,
  Copy,
  Heart,
  MessageCircle,
  Repeat2,
  ShoppingCart,
  Star,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  avatarOf,
  metricsOf,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const PRICE_STYLES: Record<string, string> = {
  Free: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Freemium: "border-amber-200 bg-amber-50 text-amber-700",
  Paid: "border-sky-200 bg-sky-50 text-sky-700",
};

export function FeedPost({
  server,
  sortedIndex,
  upvoted,
  loved,
  bookmarked,
  inStack,
  copied,
  onUpvote,
  onLove,
  onBookmark,
  onStack,
  onCopy,
}: {
  server: McpServer;
  sortedIndex: number;
  upvoted: boolean;
  loved: boolean;
  bookmarked: boolean;
  inStack: boolean;
  copied: boolean;
  onUpvote: () => void;
  onLove: () => void;
  onBookmark: () => void;
  onStack: () => void;
  onCopy: () => void;
}) {
  const m = metricsOf(server);
  const av = avatarOf(server);

  return (
    <div className="flex gap-3 px-4 py-5 sm:gap-4 sm:px-6">
      {/* Reddit upvote rail */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <button
          type="button"
          onClick={onUpvote}
          aria-label="Upvote"
          aria-pressed={upvoted}
          className={cn(
            "flex size-8 items-center justify-center rounded-full transition-colors",
            upvoted
              ? "bg-orange-100 text-orange-600"
              : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600"
          )}
        >
          <ArrowUp className="size-5" />
        </button>
        <span
          className={cn(
            "min-w-[2.75rem] text-center text-base font-bold tabular-nums",
            upvoted ? "text-orange-600" : "text-muted-foreground"
          )}
        >
          {(m.upvotes + (upvoted ? 1 : 0)).toLocaleString()}
        </span>
        <button
          type="button"
          aria-label="Downvote"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-blue-50 hover:text-blue-600"
        >
          <ArrowDown className="size-5" />
        </button>
        <span className="mt-1 hidden text-xs font-semibold tabular-nums text-muted-foreground/70 sm:block">
          #{sortedIndex + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        {/* Twitter-style header */}
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
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-lg font-bold leading-tight">
              {server.name}
            </span>
            {server.verified ? (
              <BadgeCheck
                className="size-4 shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
            ) : null}
          </div>
          <span className="hidden truncate text-base text-muted-foreground sm:inline">
            @{server.org.toLowerCase().replace(/[^a-z0-9]/g, "")} · {m.community}
          </span>
          <span className="ml-auto shrink-0 text-base text-muted-foreground">
            {m.postedDays === 0 ? "now" : `${m.postedDays}d`}
          </span>
        </div>

        {/* Price + rating (shopping) */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-sm font-semibold",
              PRICE_STYLES[m.priceTier]
            )}
          >
            {m.priceTier}
          </span>
          <span className="flex items-center gap-1.5 text-base tabular-nums">
            <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-semibold">{m.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({m.reviews.toLocaleString()})
            </span>
          </span>
        </div>

        {/* Description */}
        <p className="text-lg leading-relaxed text-foreground">
          {server.description}
        </p>

        {/* Tags + tools */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className="rounded-full border-border/60 text-sm font-medium"
          >
            {server.category}
          </Badge>
          {server.tags.slice(0, 3).map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="rounded-full text-sm font-medium"
            >
              {t}
            </Badge>
          ))}
          <span className="hidden min-w-0 flex-1 sm:block" />
          <code className="hidden max-w-[20rem] truncate font-mono text-xs text-muted-foreground lg:inline">
            {server.install}
          </code>
        </div>

        {/* Tools */}
        <div className="mt-1 flex flex-wrap gap-1">
          {server.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground"
            >
              {tool}
            </span>
          ))}
          {server.tools.length > 4 ? (
            <span className="px-1 py-0.5 text-sm text-muted-foreground">
              +{server.tools.length - 4} more
            </span>
          ) : null}
        </div>

        {/* Twitter action bar */}
        <div className="mt-1 flex items-center gap-1 border-t border-border/40 pt-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-emerald-600">
            <MessageCircle className="size-4" aria-hidden="true" />
            <span className="tabular-nums">{m.comments.toLocaleString()}</span>
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-emerald-600"
          >
            <Repeat2 className="size-4" aria-hidden="true" />
            <span className="tabular-nums">
              {Math.floor(m.upvotes / 3).toLocaleString()}
            </span>
          </button>
          <button
            type="button"
            onClick={onLove}
            aria-label="Like"
            aria-pressed={loved}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-base transition-colors",
              loved
                ? "text-rose-500"
                : "text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
            )}
          >
            <Heart
              className={cn("size-4", loved && "fill-rose-500")}
              aria-hidden="true"
            />
            <span className="tabular-nums">
              {Math.floor(m.upvotes / 2).toLocaleString()}
            </span>
          </button>
          <button
            type="button"
            onClick={onBookmark}
            aria-label="Bookmark"
            aria-pressed={bookmarked}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-base transition-colors",
              bookmarked
                ? "text-sky-600"
                : "text-muted-foreground hover:bg-sky-50 hover:text-sky-600"
            )}
          >
            <Bookmark
              className={cn("size-4", bookmarked && "fill-sky-600")}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy install"
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          <span className="ml-auto">
            <Button
              variant={inStack ? "secondary" : "default"}
              size="sm"
              className="gap-1.5 rounded-full"
              onClick={onStack}
            >
              <ShoppingCart className="size-4" aria-hidden="true" />
              {inStack ? "In stack" : "Add to stack"}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
}