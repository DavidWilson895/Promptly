"use client";

import { useState } from "react";
import {
  avatarOf,
  logoUrl,
  type McpServer,
} from "@/lib/mcp-servers";
import { cn } from "@/lib/utils";

/** Crisp brand SVG in a neutral tile, falling back to a muted initial. */
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
  const [failed, setFailed] = useState(false);
  const url = logoUrl(server);
  const av = avatarOf(server);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden bg-neutral-100",
        roundedClass ?? "rounded-full",
        className
      )}
      aria-hidden="true"
    >
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="size-[62%]"
        />
      ) : (
        <span className={cn("font-bold text-neutral-500", letterClassName)}>
          {av.letter}
        </span>
      )}
    </span>
  );
}
