"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Copy, Check, Search, Star, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MCP_SERVERS,
  MCP_CATEGORIES,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

export default function McpServerPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MCP_SERVERS.filter((s) => {
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
  }, [query, category]);

  const shownCounts = useMemo(() => {
    if (category !== "All") return 0;
    return MCP_SERVERS.length;
  }, [category]);

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

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-24 pb-16 md:px-8 lg:px-10 md:py-28">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
            <Terminal className="size-3.5" aria-hidden="true" />
            MCP Server Marketplace
          </span>
        </div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
          Plug your AI into everything.
        </h1>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {MCP_SERVERS.length} Model Context Protocol servers — tools your AI can
          call directly to reach databases, browsers, design files, and APIs.
          Pick one, add it to your client, and give your assistant superpowers.
        </p>
        <div className="relative mt-2 w-full max-w-xl">
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

      <div className="sticky top-14 z-30 -mx-6 border-b bg-card px-6 py-2.5 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
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
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((server) => (
            <article
              key={server.id}
              className="group flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl border bg-muted text-xl"
                    aria-hidden="true"
                  >
                    {server.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="truncate text-base font-semibold leading-tight">
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
                      {server.org}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                  <Star className="size-3.5 fill-foreground/70 text-foreground/70" aria-hidden="true" />
                  {(server.stars / 1000).toFixed(1)}k
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

              <div className="flex flex-wrap gap-1">
                {server.tools.slice(0, 4).map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md bg-muted/70 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {tool}
                  </span>
                ))}
                {server.tools.length > 4 ? (
                  <span className="rounded-md px-1 py-0.5 text-[11px] text-muted-foreground">
                    +{server.tools.length - 4} more
                  </span>
                ) : null}
              </div>

              <div className="mt-auto flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
                <Terminal className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
                  {server.install}
                </code>
                <Button
                  variant="outline"
                  size="icon-xs"
                  onClick={() => void copyInstall(server)}
                  aria-label="Copy install command"
                  className="shrink-0 rounded-md"
                >
                  {copiedId === server.id ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="text-base font-medium">No servers found</p>
          <p className="max-w-sm text-sm text-pretty text-muted-foreground">
            Try a different search or category.
          </p>
        </div>
      )}

      <footer className="border-t border-border/40 pt-6 text-center">
        <p className="text-xs text-muted-foreground">
          A marketplace of {shownCounts || MCP_SERVERS.length} community and official MCP servers.
          All servers listed here follow the{" "}
          <span className="font-medium text-foreground">Model Context Protocol</span>.
        </p>
      </footer>
    </main>
  );
}