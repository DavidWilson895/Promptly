"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Copy,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  MCP_SERVERS,
  avatarOf,
  formatCompact,
  metricsOf,
  timeAgo,
} from "@/lib/mcp-servers";
import type { McpServer } from "@/lib/mcp-servers";
import { useStack } from "@/lib/use-stack";
import { cn } from "@/lib/utils";

const PRICE_STYLES: Record<string, string> = {
  Free: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Freemium: "border-amber-200 bg-amber-50 text-amber-700",
  Paid: "border-sky-200 bg-sky-50 text-sky-700",
};

function humanize(tool: string): string {
  return tool
    .split(/[_-]+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function configJson(server: McpServer): string {
  const tokens = server.install
    .replace(/^docker:\s*/, "docker ")
    .split(/\s+/)
    .filter(Boolean);
  const [command = "npx", ...args] = tokens;
  return JSON.stringify(
    { mcpServers: { [server.id]: { command, args } } },
    null,
    2
  );
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function CodeBlock({
  code,
  language,
  copied,
  onCopy,
}: {
  code: string;
  language: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-600" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-muted/30 p-4 font-mono text-[13px] leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export default function McpServerDetailPage() {
  const params = useParams();
  const raw = params.id;
  const id = Array.isArray(raw) ? raw[0] : raw ?? "";
  const server = MCP_SERVERS.find((s) => s.id === id) ?? null;
  const { stack, toggle } = useStack();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!server) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 pt-14 text-center">
        <p className="text-xl font-bold">Server not found</p>
        <p className="text-base text-muted-foreground">
          This MCP server doesn&apos;t exist or was removed.
        </p>
        <Link
          href="/mcp-server"
          className="mt-1 rounded-full bg-foreground px-5 py-2 text-base font-bold text-background hover:opacity-90"
        >
          Back to marketplace
        </Link>
      </div>
    );
  }

  const m = metricsOf(server);
  const av = avatarOf(server);
  const handle = `@${server.org.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const inStack = stack.has(server.id);

  function doCopy(text: string, key: string) {
    void copyText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  }

  let related = MCP_SERVERS.filter(
    (s) => s.category === server.category && s.id !== server.id
  );
  if (related.length === 0) {
    related = [...MCP_SERVERS]
      .filter((s) => s.id !== server.id)
      .sort((a, b) => metricsOf(b).upvotes - metricsOf(a).upvotes);
  }
  related = related.slice(0, 5);

  const skills = related
    .flatMap((s) => s.tools.slice(0, 2).map((tool) => ({ tool, source: s })))
    .filter(
      ({ tool }, i, arr) => arr.findIndex((x) => x.tool === tool) === i
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background pt-14">
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        <Link
          href="/mcp-server"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All servers
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold text-white",
                  av.gradient
                )}
                aria-hidden="true"
              >
                {av.letter}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-3xl font-bold tracking-tight">
                  {server.name}
                </h1>
                <p className="mt-0.5 flex items-center gap-1 text-base text-muted-foreground">
                  by {server.org}
                  {server.verified ? (
                    <BadgeCheck
                      className="size-4 fill-sky-500 text-white"
                      aria-label="Verified publisher"
                    />
                  ) : null}
                  <span className="truncate">
                    · {handle} · {timeAgo(server)}
                  </span>
                </p>
              </div>
            </div>

            <p className="mt-4 text-lg leading-relaxed text-foreground">
              {server.description}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5">
              <code className="min-w-0 flex-1 truncate font-mono text-sm">
                {server.install}
              </code>
              <button
                type="button"
                onClick={() => doCopy(server.install, "install")}
                aria-label="Copy install command"
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copiedKey === "install" ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggle(server.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-5 py-2 text-base font-bold transition-colors",
                  inStack
                    ? "border border-border text-foreground hover:border-foreground/40"
                    : "bg-foreground text-background hover:opacity-90"
                )}
                aria-pressed={inStack}
              >
                {inStack ? (
                  <>
                    <Check className="size-4" /> In your stack
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" /> Add to stack
                  </>
                )}
              </button>
              <span
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-base font-semibold tabular-nums"
                title={`${server.stars.toLocaleString()} GitHub stars`}
              >
                <Star
                  className="size-4 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                {formatCompact(server.stars)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-4 py-2 text-base font-semibold",
                  PRICE_STYLES[m.priceTier]
                )}
              >
                {m.priceTier}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className="rounded-full border-border/60 text-sm font-medium"
              >
                {server.category}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full font-mono text-sm font-medium"
              >
                {server.runtime}
              </Badge>
              {server.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="rounded-full text-sm font-medium"
                >
                  {t}
                </Badge>
              ))}
            </div>

            {/* README */}
            <div className="mt-6 rounded-xl border border-border p-5 sm:p-6">
              <h2 className="font-mono text-lg font-bold">{server.id}</h2>
              <p className="mt-2 leading-relaxed text-foreground">
                {server.description} Connect it once and your assistant can{" "}
                {server.tools
                  .slice(0, 3)
                  .map((t) => humanize(t).toLowerCase())
                  .join(", ")}
                {server.tools.length > 3
                  ? `, and ${server.tools.length - 3} more`
                  : ""}{" "}
                without leaving the chat.
              </p>

              <h3 className="mt-6 text-xl font-bold">Start here</h3>
              <p className="mt-2 leading-relaxed text-foreground">
                Install the server, paste the configuration below into your
                client, and restart. Your assistant picks up{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                  {server.tools.length} tools
                </code>{" "}
                automatically — no API keys to wire up beyond what{" "}
                {server.org} already requires.
              </p>

              <h3 className="mt-6 text-xl font-bold">Installation</h3>
              <div className="mt-2">
                <CodeBlock
                  code={server.install}
                  language="bash"
                  copied={copiedKey === "readme-install"}
                  onCopy={() => doCopy(server.install, "readme-install")}
                />
              </div>

              <h3 className="mt-6 text-xl font-bold">Configuration</h3>
              <p className="mb-2 mt-2 leading-relaxed text-foreground">
                Add this to your client config (e.g.{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                  claude_desktop_config.json
                </code>
                ):
              </p>
              <CodeBlock
                code={configJson(server)}
                language="json"
                copied={copiedKey === "config"}
                onCopy={() => doCopy(configJson(server), "config")}
              />

              <h3 className="mt-6 text-xl font-bold">Available tools</h3>
              <div className="mt-2 flex flex-col gap-2">
                {server.tools.map((tool) => (
                  <div
                    key={tool}
                    className="rounded-lg bg-muted/60 px-3 py-2 font-mono text-sm"
                  >
                    {tool}
                    <span className="ml-3 font-sans text-muted-foreground">
                      — {humanize(tool)}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 text-xl font-bold">
                Why {server.name.toLowerCase()}
              </h3>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 leading-relaxed">
                <li>
                  Native {server.runtime} package — installs with one command.
                </li>
                <li>
                  Built for {server.category} workflows
                  {server.tags.length > 0
                    ? `: ${server.tags.join(", ")}.`
                    : "."}
                </li>
                <li>
                  {server.verified
                    ? `Verified publisher — maintained by ${server.org}.`
                    : `Community favorite with ${formatCompact(m.upvotes)} upvotes.`}
                </li>
                <li>
                  {formatCompact(server.stars)} GitHub stars and a{" "}
                  {m.rating.toFixed(1)}★ community rating.
                </li>
              </ul>
            </div>
          </div>

          {/* Related sidebar */}
          <aside className="min-w-0">
            <div className="flex flex-col gap-4 lg:sticky lg:top-20">
              {/* House ad */}
              <div>
                <div className="overflow-hidden rounded-2xl border border-border bg-card text-center shadow-sm">
                  <div className="flex flex-col items-center px-5 pb-5 pt-6">
                    <Image
                      src="/logo.svg"
                      alt="Promptly"
                      width={40}
                      height={40}
                      className="h-10 w-auto rounded-lg"
                    />
                    <p className="mt-3 text-xl font-bold leading-snug tracking-tight">
                      Your stack,
                      <br />
                      everywhere.
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Save MCP servers once,
                      <br />
                      install them anywhere.
                    </p>
                    <Link
                      href="/my-library"
                      className="mt-4 rounded-full border border-border px-4 py-1.5 text-sm font-bold transition-colors hover:border-foreground/40"
                    >
                      OPEN MY LIBRARY
                    </Link>
                  </div>
                </div>
                <p className="mt-1.5 text-center text-xs text-muted-foreground">
                  Advertisement
                </p>
              </div>

              {/* Related MCPs */}
              <section
                className="rounded-2xl bg-muted p-4"
                aria-label="Related MCPs"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Related MCPs</h2>
                  <Link
                    href="/mcp-server"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    View more
                  </Link>
                </div>
                <div className="mt-2 flex flex-col">
                  {related.map((s) => {
                    const rav = avatarOf(s);
                    return (
                      <Link
                        key={s.id}
                        href={`/mcp-server/${s.id}`}
                        className="flex w-full items-start gap-2.5 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-black/[0.04]"
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white",
                            rav.gradient
                          )}
                          aria-hidden="true"
                        >
                          {rav.letter}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-base font-bold leading-tight">
                            {s.name}
                          </span>
                          <span className="block line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {s.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Related Skills */}
              <section
                className="rounded-2xl bg-muted p-4"
                aria-label="Related Skills"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Related Skills</h2>
                  <Link
                    href="/mcp-server"
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="mt-2 flex flex-col">
                  {skills.map(({ tool, source }) => (
                    <Link
                      key={tool}
                      href={`/mcp-server/${source.id}`}
                      className="flex w-full items-start gap-2.5 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-black/[0.04]"
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-base"
                        aria-hidden="true"
                      >
                        {source.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-base font-bold leading-tight">
                          {humanize(tool)}
                        </span>
                        <span className="block line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Run {tool} via the {source.name} server —{" "}
                          {source.category.toLowerCase()} automation.
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
