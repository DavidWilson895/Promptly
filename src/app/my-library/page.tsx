import { Bookmark } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "My Library",
};

export default function MyLibraryPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center md:px-6">
      <span className="flex size-12 items-center justify-center rounded-full border bg-card">
        <Bookmark className="size-5 text-muted-foreground" aria-hidden="true" />
      </span>
      <h1 className="text-3xl font-medium text-balance tracking-tight">
        Your library is empty
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        Sign in to like and save prompts, then find them here to remix and
        reuse.
      </p>
      <Link
        href="/auth/sign-in"
        className="mt-1 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Sign in
      </Link>
    </main>
  );
}