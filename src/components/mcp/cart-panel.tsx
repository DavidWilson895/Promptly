"use client";

import { Check, Copy, ShoppingCart, Terminal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MCP_SERVERS,
  type McpServer,
} from "@/lib/mcp-servers";

export function CartPanel({
  stackIds,
  open,
  onOpenChange,
  copiedAll,
  onCopyAll,
  onRemove,
}: {
  stackIds: Set<string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copiedAll: boolean;
  onCopyAll: () => void;
  onRemove: (id: string) => void;
}) {
  if (stackIds.size === 0) return null;
  const items = MCP_SERVERS.filter((s) => stackIds.has(s.id));

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-80 overflow-hidden rounded-2xl border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="inline-flex items-center gap-1.5 text-base font-semibold">
              <ShoppingCart className="size-4" aria-hidden="true" />
              Your stack
            </h3>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              aria-label="Close stack"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto p-3">
            <ul className="flex flex-col gap-2">
              {items.map((s) => (
                <CartItem key={s.id} server={s} onRemove={() => onRemove(s.id)} />
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 border-t p-3">
            <Button
              size="sm"
              className="flex-1 gap-1.5 rounded-full"
              onClick={onCopyAll}
            >
              {copiedAll ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copiedAll ? "Copied!" : "Copy all installs"}
            </Button>
            <span className="text-sm tabular-nums text-muted-foreground">
              {items.length}
            </span>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="relative flex items-center gap-2 rounded-full bg-foreground px-4 py-3 text-base font-medium text-background shadow-lg transition-transform hover:scale-105"
        aria-label="Open your stack"
      >
        <ShoppingCart className="size-4" aria-hidden="true" />
        Stack
        <span className="flex size-6 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground">
          {items.length}
        </span>
      </button>
    </div>
  );
}

function CartItem({
  server,
  onRemove,
}: {
  server: McpServer;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2">
      <span className="text-lg" aria-hidden="true">
        {server.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{server.name}</p>
        <code className="flex items-center gap-1 truncate font-mono text-xs text-muted-foreground">
          <Terminal className="size-3 shrink-0" aria-hidden="true" />
          {server.install}
        </code>
      </div>
      <button
        type="button"
        aria-label={`Remove ${server.name}`}
        onClick={onRemove}
        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </li>
  );
}