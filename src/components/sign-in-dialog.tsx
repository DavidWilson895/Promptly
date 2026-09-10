"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EyeFollowButton } from "@/components/eye-follow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignInDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);

  const isSignUp = mode === "signup";

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
  }

  function switchMode(next: "signin" | "signup") {
    setMode(next);
  }

  // Always show sign-in when opened from the header Sign in button
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setMode("signin");
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        onClick={() => setMode("signin")}
        render={children as React.ReactElement}
      />
      <DialogContent className="sm:max-w-[440px] p-6">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold">
            {isSignUp ? "Create your account" : "Sign in to Promptly"}
          </DialogTitle>
          <DialogDescription className="text-[16px]">
            {isSignUp
              ? "Join Promptly — save, collect and reuse prompts worth keeping."
              : "Collect prompts worth keeping — save and reuse your favorites."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-4">
          {isSignUp ? (
            <div className="grid gap-2">
              <Label htmlFor="signup-name" className="text-[16px]">
                Name
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-[16px]"
              />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="signin-email" className="text-[16px]">
              Email
            </Label>
            <Input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-[16px]"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="signin-password" className="text-[16px]">
                Password
              </Label>
              {!isSignUp ? (
                <Link href="#" className="text-[14px] text-muted-foreground hover:text-foreground">
                  Forgot?
                </Link>
              ) : null}
            </div>
            <Input
              id="signin-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPwFocused(true)}
              onBlur={() => setPwFocused(false)}
              required
              className="text-[16px]"
            />
            {isSignUp ? (
              <p className="text-[13px] text-muted-foreground">
                At least 8 characters, including a number.
              </p>
            ) : null}
          </div>
          <EyeFollowButton
            type="submit"
            className="mt-1"
            isPasswordFocused={pwFocused}
            passwordLength={password.length}
          >
            {isSignUp ? "Create account" : "Sign in"}
          </EyeFollowButton>
        </form>

        <div className="relative my-1 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[14px] text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <div className="grid gap-2">
          <Button
            variant="outline"
            className="w-full gap-2 rounded-full text-[16px]"
            onClick={() => setOpen(false)}
          >
            <span className="flex size-5 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.12-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.42 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
            </span>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-[14px] text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="font-medium text-foreground hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-medium text-foreground hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
