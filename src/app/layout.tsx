import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Outfit } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { SearchProvider } from "@/lib/search-context";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Promptly — AI Image Prompt Library",
    template: "%s | Promptly",
  },
  description:
    "A curated library of AI image prompts filtered by real results. Browse by model, copy any prompt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SearchProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </SearchProvider>
      </body>
    </html>
  );
}
