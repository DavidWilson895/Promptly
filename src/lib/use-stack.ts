"use client";

import { useCallback, useState } from "react";

const KEY = "promptly:mcp-stack";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set<string>();
    const arr: unknown = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((v) => typeof v === "string") : []);
  } catch {
    return new Set<string>();
  }
}

/** Stack shared between the marketplace feed and server detail pages. */
export function useStack(): {
  stack: Set<string>;
  toggle: (id: string) => void;
} {
  const [stack, setStack] = useState<Set<string>>(read);

  const toggle = useCallback((id: string) => {
    setStack((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  return { stack, toggle };
}
