import Link from "next/link";
import { Mail } from "lucide-react";
import { DiaFooter } from "@/components/dia-footer";

const browse = [
  { label: "All prompts", href: "/" },
  { label: "Trending", href: "/?sort=trending" },
  { label: "Latest", href: "/?sort=latest" },
  { label: "Most liked", href: "/?sort=popular" },
] as const;

const categories = [
  { label: "Ads & Product", href: "/?category=Ads%20%26%20Product" },
  { label: "Posters & Visuals", href: "/?category=Posters%20%26%20Visuals" },
  { label: "Illustration", href: "/?category=Illustration" },
  { label: "Characters", href: "/?category=Characters" },
  { label: "Fashion", href: "/?category=Fashion" },
  { label: "Scenes", href: "/?category=Scenes" },
  { label: "Portraits", href: "/?category=Portraits" },
] as const;

const company = [
  { label: "My Library", href: "/my-library" },
  { label: "About", href: "#" },
  { label: "Contact", href: "mailto:hello@promptly.so" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="relative isolate mt-auto overflow-hidden border-t bg-card">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]">
        <DiaFooter className="h-full w-full" />
      </div>
      <div className="relative w-full px-4 py-12 md:px-6 lg:px-8 md:py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-12 md:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Promptly home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Promptly" width={28} height={28} className="h-7 w-auto rounded-md" />
              <span className="text-[15px] font-semibold tracking-tight">Promptly</span>
            </Link>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Collect prompts worth keeping. Each card pairs an image with the exact prompt that
              made it — tagged by model and style.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-8 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                GH
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="inline-flex size-8 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                𝕏
              </a>
              <a
                href="mailto:hello@promptly.so"
                aria-label="Email"
                className="inline-flex size-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div className="md:col-span-2">
            <h3 className="text-[15px] font-semibold">Browse</h3>
            <ul className="mt-3 space-y-2">
              {browse.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h3 className="text-[15px] font-semibold">Categories</h3>
            <ul className="mt-3 space-y-2">
              {categories.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h3 className="text-[15px] font-semibold">Company</h3>
            <ul className="mt-3 space-y-2">
              {company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[15px] text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-[15px] text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>Promptly © {new Date().getFullYear()} — Curated AI image prompts.</p>
          <p className="text-[15px]">
            Built for makers who collect prompts worth keeping.
          </p>
        </div>
      </div>
    </footer>
  );
}
