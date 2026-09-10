"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { CATEGORIES, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CategoryTabs({
  value,
  onChange,
}: {
  value: Category | null;
  onChange: (value: Category | null) => void;
}) {
  const current = value ?? "__all__";

  return (
    <>
      {/* Mobile: native select */}
      <div className="md:hidden">
        <label className="sr-only">Filter by category</label>
        <select
          value={current}
          onChange={(e) =>
            onChange(e.target.value === "__all__" ? null : (e.target.value as Category))
          }
          className="h-8 w-full max-w-60 rounded-lg border border-border/60 bg-card px-2 text-sm outline-none focus-visible:border-ring"
        >
          <option value="__all__">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: tabs */}
      <TabsPrimitive.Root
        value={current}
        onValueChange={(v) => onChange(v === "__all__" ? null : (v as Category))}
        className="hidden min-w-0 flex-1 md:block"
      >
        <TabsPrimitive.List aria-label="Filter by category" className="flex min-w-0 items-center gap-1 overflow-visible">
          <CategoryTab value="__all__">All</CategoryTab>
          {CATEGORIES.map((c) => (
            <CategoryTab key={c} value={c}>
              {c}
            </CategoryTab>
          ))}
        </TabsPrimitive.List>
      </TabsPrimitive.Root>
    </>
  );
}

function CategoryTab(props: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex shrink-0 cursor-pointer select-none items-center rounded-full border px-3 py-1 text-[15px] whitespace-nowrap transition-all duration-150",
        "data-active:border-transparent data-active:bg-foreground data-active:text-background data-active:shadow-sm",
        "data-inactive:border-border/60 data-inactive:bg-card data-inactive:text-muted-foreground",
        "hover:-translate-y-0.5 hover:data-active:shadow-md hover:data-inactive:border-foreground/20 hover:data-inactive:bg-muted hover:data-inactive:shadow-sm hover:data-inactive:text-foreground",
        "active:translate-y-0 active:scale-[0.98]"
      )}
      {...props}
    />
  );
}
