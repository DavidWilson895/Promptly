"use client";

import {
  ArrowBigUp,
  BadgeCheck,
  Bookmark,
  Check,
  Copy,
  Heart,
  MessageCircle,
  Share,
  Star,
  type LucideIcon,
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

function FeedAction({
  label,
  count,
  onClick,
  pressed,
  icon: Icon,
  iconClass,
  textClass,
  bgClass,
}: {
  label: string;
  count?: string;
  onClick?: () => void;
  pressed?: boolean;
  icon: LucideIcon;
  iconClass?: string;
  textClass: string;
  bgClass: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "flex items-center text-base tabular-nums text-muted-foreground transition-colors",
        textClass
      )}
    >
      <span className={cn("rounded-full p-2 transition-colors", bgClass)}>
        <Icon className={cn("size-5", iconClass)} aria-hidden="true" />
      </span>
      {count ? <span className="-ml-1 pr-2">{count}</span> : null}
    </button>
  );
}

export function FeedPost({
  server,
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
  const handle = `@${server.org.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

  return (
    <article className="border-b border-border px-4 py-4 transition-colors hover:bg-muted/40">
      <div className="flex gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white",
            av.gradient
          )}
          aria-hidden="true"
        >
          {av.letter}
        </span>

        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center gap-1.5">
            <span className="truncate text-lg font-bold leading-tight">
              {server.name}
            </span>
            {server.verified ? (
              <BadgeCheck
                className="size-5 shrink-0 fill-sky-500 text-white"
                aria-label="Verified"
              />
            ) : null}
            <span className="truncate text-base text-muted-foreground">
              {handle} · {timeAgo(server)}
            </span>
            <span
              className={cn(
                "ml-auto shrink-0 rounded-full border px-2.5 py-0.5 text-sm font-semibold",
                PRICE_STYLES[m.priceTier]
              )}
            >
              {m.priceTier}
            </span>
          </div>

          {/* Body with inline hashtag tags */}
          <p className="mt-0.5 text-lg leading-snug text-foreground">
            {server.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
          </div>

          {/* Shop attachment card */}
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl" aria-hidden="true">
                {server.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold">{server.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
                  <Star
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-foreground">
                    {m.rating.toFixed(1)}
                  </span>
                  ({formatCompact(m.reviews)} reviews)
                </p>
              </div>
              <button
                type="button"
                onClick={onStack}
                aria-pressed={inStack}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                  inStack
                    ? "border border-border text-foreground hover:border-foreground/40"
                    : "bg-foreground text-background hover:opacity-90"
                )}
              >
                {inStack ? "Added" : "Add"}
              </button>
            </div>
            <div className="flex items-center gap-2 border-t border-border bg-muted/60 px-4 py-2.5">
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground">
                {server.install}
              </code>
              <button
                type="button"
                onClick={onCopy}
                aria-label="Copy install command"
                className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {server.tools.slice(0, 5).map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
              {server.tools.length > 5 ? (
                <span className="px-1 py-0.5 text-sm text-muted-foreground">
                  +{server.tools.length - 5}
                </span>
              ) : null}
            </div>
          </div>

          {/* X action bar */}
          <div className="-ml-2 mt-1 flex items-center justify-between">
            <FeedAction
              label="Upvote"
              count={formatCompact(m.upvotes + (upvoted ? 1 : 0))}
              onClick={onUpvote}
              pressed={upvoted}
              icon={ArrowBigUp}
              iconClass={upvoted ? "fill-orange-600" : undefined}
              textClass={upvoted ? "text-orange-600" : "hover:text-orange-600"}
              bgClass="hover:bg-orange-100"
            />
            <FeedAction
              label="Replies"
              count={formatCompact(m.comments)}
              icon={MessageCircle}
              textClass="hover:text-sky-600"
              bgClass="hover:bg-sky-100"
            />
            <FeedAction
              label="Like"
              count={formatCompact(Math.floor(m.upvotes / 2))}
              onClick={onLove}
              pressed={loved}
              icon={Heart}
              iconClass={loved ? "fill-rose-500" : undefined}
              textClass={loved ? "text-rose-500" : "hover:text-rose-500"}
              bgClass="hover:bg-rose-100"
            />
            <span className="flex items-center">
              <FeedAction
                label="Bookmark"
                onClick={onBookmark}
                pressed={bookmarked}
                icon={Bookmark}
                iconClass={bookmarked ? "fill-sky-600" : undefined}
                textClass={
                  bookmarked ? "text-sky-600" : "hover:text-sky-600"
                }
                bgClass="hover:bg-sky-100"
              />
              <FeedAction
                label={copied ? "Copied" : "Share install command"}
                onClick={onCopy}
                icon={copied ? Check : Share}
                textClass="hover:text-sky-600"
                bgClass="hover:bg-sky-100"
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
