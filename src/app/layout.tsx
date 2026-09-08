import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <footer className="border-t">
          <div className="flex w-full items-center justify-between px-4 py-6 text-sm text-muted-foreground md:px-6 lg:px-8">
            <span>Promptly © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline">
              Curated AI image prompts
            </span>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}