"use client";

import { Flame, Trophy, UserPlus } from "lucide-react";
import {
  MCP_SERVERS,
  metricsOf,
  avatarOf,
  sortServers,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

export function RightRail({
  onCategory,
}: {
  onCategory: (c: string) => void;
}) {
  const topRated = [...MCP_SERVERS]
    .sort((a, b) => metricsOf(b).rating - metricsOf(a).rating)
    .slice(0, 5);
  const trending = sortServers(MCP_SERVERS, "hot").slice(0, 4);

  return (
    <div className="flex flex-col gap-5">
      {/* Top rated this week */}
      <div>
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Trophy className="size-3.5" aria-hidden="true" />
          Top rated
        </p>
        <ol className="mt-2 flex flex-col">
          {topRated.map((s, i) => {
            const m = metricsOf(s);
            const av = avatarOf(s);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onCategory(s.category)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                >
                  <span className="flex w-5 shrink-0 justify-center text-xs font-bold tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                      av.gradient
                    )}
                    aria-hidden="true"
                  >
                    {av.letter}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {s.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums font-semibold text-foreground">
                    {m.rating.toFixed(1)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Trending */}
      <div className="border-t border-border/40 pt-4">
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Flame className="size-3.5" aria-hidden="true" />
          Trending now
        </p>
        <ul className="mt-2 flex flex-col">
          {trending.map((s) => {
            const m = metricsOf(s);
            const av = avatarOf(s);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onCategory(s.category)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
                      av.gradient
                    )}
                    aria-hidden="true"
                  >
                    {av.letter}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {s.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {m.comments.toLocaleString()}💬
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Follow card */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-100 p-4">
        <p className="font-semibold text-indigo-950">Follow the marketplace</p>
        <p className="mt-1 text-xs leading-relaxed text-indigo-900/70">
          New servers land daily. Get the feed delivered, upvote-first.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <UserPlus className="size-3.5" aria-hidden="true" />
          Follow
        </button>
      </div>
    </div>
  );
}