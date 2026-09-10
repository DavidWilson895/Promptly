"use client";

import { Image as ImageIcon, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "image" | "code";

const MODES = [
  { key: "image", label: "Image prompt", icon: ImageIcon },
  { key: "code", label: "Visual code", icon: FileCode2 },
] as const;

export function ModeSwitch({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div className="relative inline-flex items-center rounded-full border border-border/60 bg-card p-0.5">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = value === mode.key;
        return (
          <button
            key={mode.key}
            type="button"
            onClick={() => onChange(mode.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-pressed={isActive}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}