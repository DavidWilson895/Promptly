"use client";

import { usePathname, useRouter } from "next/navigation";
import { Image as ImageIcon, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { key: "/", label: "Image prompt", icon: ImageIcon },
  { key: "/visual-code", label: "Visual code", icon: FileCode2 },
] as const;

export function ModeSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathname === "/visual-code" ? "/visual-code" : "/";

  return (
    <div className="relative inline-flex items-center rounded-full border border-border/60 bg-card p-0.5">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = active === mode.key;
        return (
          <button
            key={mode.key}
            type="button"
            onClick={() => router.push(mode.key)}
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