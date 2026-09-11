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

function CardAction({
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
        "flex items-center text-sm tabular-nums text-muted-foreground transition-colors",
        textClass
      )}
    >
      <span className={cn("rounded-full p-1.5 transition-colors", bgClass)}>
        <Icon className={cn("size-[18px]", iconClass)} aria-hidden="true" />
      </span>
      {count ? <span>{count}</span> : null}
    </button>
  );
}

export function FeedCard({
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
    <article className="flex flex-col rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
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

      {/* Body */}
      <p className="mt-2 line-clamp-3 text-base leading-snug text-foreground">
        {server.description}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
      </div>

      {/* Shop box */}
      <div className="mt-3 rounded-xl border border-border p-3">
        <p className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
          <Star
            className="size-4 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span className="font-semibold text-foreground">
            {m.rating.toFixed(1)}
          </span>
          ({formatCompact(m.reviews)} reviews)
          <span className="ml-auto text-lg" aria-hidden="true">
            {server.icon}
          </span>
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted/60 px-2.5 py-2">
          <code className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            {server.install}
          </code>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy install command"
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={onStack}
          aria-pressed={inStack}
          className={cn(
            "mt-2 w-full rounded-full py-1.5 text-sm font-bold transition-colors",
            inStack
              ? "border border-border text-foreground hover:border-foreground/40"
              : "bg-foreground text-background hover:opacity-90"
          )}
        >
          {inStack ? "Added to stack" : "Add to stack"}
        </button>
      </div>

      {/* Actions */}
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <CardAction
          label="Upvote"
          count={formatCompact(m.upvotes + (upvoted ? 1 : 0))}
          onClick={onUpvote}
          pressed={upvoted}
          icon={ArrowBigUp}
          iconClass={upvoted ? "fill-orange-600" : undefined}
          textClass={upvoted ? "text-orange-600" : "hover:text-orange-600"}
          bgClass="hover:bg-orange-100"
        />
        <CardAction
          label="Replies"
          count={formatCompact(m.comments)}
          icon={MessageCircle}
          textClass="hover:text-sky-600"
          bgClass="hover:bg-sky-100"
        />
        <CardAction
          label="Like"
          count={formatCompact(Math.floor(m.upvotes / 2))}
          onClick={onLove}
          pressed={loved}
          icon={Heart}
          iconClass={loved ? "fill-rose-500" : undefined}
          textClass={loved ? "text-rose-500" : "hover:text-rose-500"}
          bgClass="hover:bg-rose-100"
        />
        <CardAction
          label="Bookmark"
          onClick={onBookmark}
          pressed={bookmarked}
          icon={Bookmark}
          iconClass={bookmarked ? "fill-sky-600" : undefined}
          textClass={bookmarked ? "text-sky-600" : "hover:text-sky-600"}
          bgClass="hover:bg-sky-100"
        />
        <CardAction
          label={copied ? "Copied" : "Share install command"}
          onClick={onCopy}
          icon={copied ? Check : Share}
          textClass="hover:text-sky-600"
          bgClass="hover:bg-sky-100"
        />
      </div>
    </article>
  );
}
