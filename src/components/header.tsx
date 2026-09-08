import Link from "next/link";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const navLink = cn(
  "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground",
  "transition-colors duration-150 hover:text-foreground"
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-medium tracking-tight"
            aria-label="Promptly home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt=""
              width={38}
              height={22}
              className="h-6 w-auto"
            />
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

        <div className="flex items-center gap-2">
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