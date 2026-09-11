"use client";

import { avatarOf, type McpServer } from "@/lib/mcp-servers";
import { logoSvg } from "@/lib/mcp-logos";
import { cn } from "@/lib/utils";

/** Crisp official brand mark in a neutral tile, falling back to an initial. */
export function ServerMark({
  server,
  className,
  roundedClass,
  letterClassName,
}: {
  server: McpServer;
  className?: string;
  roundedClass?: string;
  letterClassName?: string;
}) {
  const svg = logoSvg(server.id);
  const av = avatarOf(server);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-neutral-100 text-neutral-700",
        roundedClass ?? "rounded-full",
        className
      )}
      aria-hidden="true"
    >
      {svg ? (
        <span
          className="block size-[62%] [&>svg]:size-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <span className={cn("font-bold", letterClassName)}>{av.letter}</span>
      )}
    </span>
  );
}
