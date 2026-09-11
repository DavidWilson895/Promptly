"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Check,
  Copy,
  Heart,
  MessageCircle,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Terminal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MCP_SERVERS,
  MCP_CATEGORIES,
  metricsOf,
  sortServers,
  type McpServer,
  type SortKey,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

const PRICE_STYLES: Record<string, string> = {
  Free: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Freemium: "border-amber-200 bg-amber-50 text-amber-700",
  Paid: "border-sky-200 bg-sky-50 text-sky-700",
};

export default function McpServerPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("hot");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [loved, setLoved] = useState<Set<string>>(new Set());
  const [stack, setStack] = useState<Set<string>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = MCP_SERVERS.filter((s) => {
      if (category !== "All" && s.category !== category) return false;
      if (
        q &&
        !`${s.name} ${s.org} ${s.description} ${s.category} ${s.tags.join(" ")} ${s.tools.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
    return sortServers(matched, sort);
  }, [query, category, sort]);

  const stackItems = useMemo(
    () => MCP_SERVERS.filter((s) => stack.has(s.id)),
    [stack]
  );

  async function copyInstall(server: McpServer) {
    try {
      await navigator.clipboard.writeText(server.install);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = server.install;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedId(server.id);
    setTimeout(() => setCopiedId(null), 1600);
  }

  async function copyAll() {
    const text = stackItems.map((s) => s.install).join("\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* noop */
    }
    setCopiedId("__all__");
    setTimeout(() => setCopiedId(null), 1600);
  }

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-24 pb-28 md:px-8 lg:px-10 md:py-28">
      {/* Hero — shopping banner */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-background">
            <Sparkles className="size-3.5" aria-hidden="true" />
            MCP Server Marketplace
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-3 py-1 text-muted-foreground">
            <ShoppingCart className="size-3.5" aria-hidden="true" />
            {MCP_SERVERS.length} servers in stock
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card px-3 py-1 text-muted-foreground">
            <Star className="size-3.5 fill-foreground/60 text-foreground/60" aria-hidden="true" />
            community rated
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
              Shop the servers.{" "}
              <span className="font-sans italic font-semibold">
                Upvote the good ones.
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
              Hand-curated MCP servers rated by the community. Add the ones you
              like to your stack, then copy all the install commands at once.
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-xl">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search servers, tools, tags…"
            className="h-11 w-full rounded-full border border-border/60 bg-white pl-11 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-3 outline-none"
            aria-label="Search MCP servers"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Sticky filter + sort bar */}
      <div className="sticky top-14 z-30 -mx-6 border-b bg-card px-6 py-2.5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2.5">
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {MCP_CATEGORIES.map((c) => {
              const count =
                c === "All"
                  ? MCP_SERVERS.length
                  : MCP_SERVERS.filter((s) => s.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[15px] font-medium transition-colors",
                    category === c
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  )}
                >
                  {c}
                  <span className="text-xs tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-1.5">
            {(
              [
                ["hot", "Hot"],
                ["new", "New"],
                ["top", "Top"],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[15px] transition-colors",
                  sort === key
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={sort === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-2 text-xs tabular-nums text-muted-foreground">
          {filtered.length} results
          {query ? <> for "{query}"</> : null}
        </div>
      </div>

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((server) => {
            const m = metricsOf(server);
            const upped = upvoted.has(server.id);
            const lovedServer = loved.has(server.id);
            const inStack = stack.has(server.id);
            return (
              <article
                key={server.id}
                className="group flex gap-3 overflow-hidden rounded-xl border bg-card p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Upvote rail */}
                <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setUpvoted((prev) => {
                        const next = new Set(prev);
                        if (next.has(server.id)) next.delete(server.id);
                        else next.add(server.id);
                        return next;
                      })
                    }
                    aria-label="Upvote"
                    aria-pressed={upped}
                    className={cn(
                      "flex size-7 items-center justify-center rounded-lg transition-colors",
                      upped
                        ? "text-orange-600"
                        : "text-muted-foreground hover:bg-orange-50 hover:text-orange-600"
                    )}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      upped ? "text-orange-600" : "text-muted-foreground"
                    )}
                  >
                    {(m.upvotes + (upped ? 1 : 0)).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    aria-label="Downvote"
                    className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted text-lg"
                        aria-hidden="true"
                      >
                        {server.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h2 className="truncate text-[15px] font-semibold leading-tight">
                            {server.name}
                          </h2>
                          {server.verified ? (
                            <BadgeCheck
                              className="size-4 shrink-0 text-emerald-500"
                              aria-label="Verified"
                            />
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.author} · {m.community}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                          PRICE_STYLES[m.priceTier]
                        )}
                      >
                        {m.priceTier}
                      </span>
                      <span className="flex items-center gap-1 text-xs tabular-nums text-foreground">
                        <Star className="size-3.5 fill-foreground/70 text-foreground/70" aria-hidden="true" />
                        {m.rating.toFixed(1)}
                        <span className="text-muted-foreground">
                          ({m.reviews.toLocaleString()})
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-pretty leading-relaxed text-muted-foreground">
                    {server.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/60 text-xs font-normal"
                    >
                      {server.category}
                    </Badge>
                    {server.tags.slice(0, 3).map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="rounded-full text-xs font-normal"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      <span className="text-xs tabular-nums">
                        {m.comments.toLocaleString()}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {m.postedDays === 0 ? "today" : `${m.postedDays}d ago`}
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <code className="hidden max-w-[12rem] truncate font-mono text-[10px] text-muted-foreground lg:inline">
                        {server.install}
                      </code>
                      <button
                        type="button"
                        onClick={() => void copyInstall(server)}
                        aria-label="Copy install command"
                        className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {copiedId === server.id ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLoved((prev) => {
                            const next = new Set(prev);
                            if (next.has(server.id)) next.delete(server.id);
                            else next.add(server.id);
                            return next;
                          })
                        }
                        aria-label="Save server"
                        aria-pressed={lovedServer}
                        className={cn(
                          "flex size-7 items-center justify-center rounded-lg transition-colors",
                          lovedServer
                            ? "text-rose-500"
                            : "text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
                        )}
                      >
                        <Heart
                          className={cn("size-3.5", lovedServer && "fill-rose-500")}
                        />
                      </button>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border/40 pt-3">
                    <Button
                      variant={inStack ? "secondary" : "default"}
                      size="sm"
                      className="flex-1 gap-1.5 rounded-full"
                      onClick={() =>
                        setStack((prev) => {
                          const next = new Set(prev);
                          if (next.has(server.id)) next.delete(server.id);
                          else next.add(server.id);
                          return next;
                        })
                      }
                    >
                      <ShoppingCart className="size-3.5" aria-hidden="true" />
                      {inStack ? "In your stack ✓" : "Add to stack"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => void copyInstall(server)}
                    >
                      <Terminal className="size-3.5" aria-hidden="true" />
                      {copiedId === server.id ? "Copied" : "Install"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="text-base font-medium">No servers found</p>
          <p className="max-w-sm text-sm text-pretty text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      )}

      {/* Floating cart */}
      {stack.size > 0 ? (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
          {cartOpen ? (
            <div className="w-80 overflow-hidden rounded-2xl border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h3 className="text-sm font-semibold">Your AI stack</h3>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Close stack"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto p-3">
                <ul className="flex flex-col gap-2">
                  {stackItems.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2"
                    >
                      <span className="text-lg" aria-hidden="true">
                        {s.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium">{s.name}</p>
                        <code className="block truncate font-mono text-[10px] text-muted-foreground">
                          {s.install}
                        </code>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${s.name}`}
                        onClick={() =>
                          setStack((prev) => {
                            const next = new Set(prev);
                            next.delete(s.id);
                            return next;
                          })
                        }
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2 border-t p-3">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 rounded-full"
                  onClick={() => void copyAll()}
                >
                  {copiedId === "__all__" ? (
                    <Check className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copiedId === "__all__" ? "Copied!" : "Copy all installs"}
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {stackItems.length}
                </span>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setCartOpen((v) => !v)}
            className="relative flex items-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background shadow-lg transition-transform hover:scale-105"
            aria-label="Open your stack"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Stack
            <span className="flex size-5 items-center justify-center rounded-full bg-background text-xs font-bold text-foreground">
              {stack.size}
            </span>
          </button>
        </div>
      ) : null}
    </main>
  );
}