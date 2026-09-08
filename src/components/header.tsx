"use client";

import Link from "next/link";
import { Bookmark, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/lib/search-context";
import { cn } from "@/lib/utils";

const navLink = cn(
  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground",
  "transition-colors duration-150 hover:text-foreground"
);

export function Header() {
  const { search, setSearch } = useSearch();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "border-transparent bg-transparent backdrop-blur-none"
      )}
    >
      <div className="relative flex h-14 w-full items-center gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-medium tracking-tight"
            aria-label="Promptly home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={38} height={22} className="h-6 w-auto" />
            Promptly
          </Link>

          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
            <Link href="/" className={navLink}>
              Explore
            </Link>
            <Link href="/my-library" className={navLink}>
              My Library
            </Link>
          </nav>
        </div>

        <div
          className={cn(
            "absolute left-1/2 top-1/2 hidden w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-4 transition-all duration-300 md:flex",
            scrolled ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="relative w-full">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, models, styles…"
              className="h-11 rounded-full border-border/60 bg-white pl-11 pr-10 text-sm shadow-sm placeholder:text-muted-foreground/70"
              aria-label="Search prompts"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/my-library" className={cn(navLink, "sm:hidden")}>
            <Bookmark className="size-4" aria-hidden="true" />
            <span className="sr-only">My Library</span>
          </Link>
          <Link
            href="/auth/sign-in"
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-colors duration-150 hover:opacity-90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}