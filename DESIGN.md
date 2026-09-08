---
version: alpha
name: Promptly
description: Editorial prompt library for image makers
colors:
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  muted: oklch(0.97 0 0)
  border: oklch(0.922 0 0)
  accent: oklch(0.205 0 0)
typography:
  display:
    fontFamily: Instrument Serif
    fontWeight: 400
    letterSpacing: -0.02em
  body:
    fontFamily: Outfit
    fontWeight: 400
  mono:
    fontFamily: JetBrains Mono
rounded:
  base: 0.625rem
spacing:
  base: 0.25rem
---

## Overview
Promptly is an editorial image prompt library. Pairs precise typography (Instrument Serif display, Outfit body) with a restrained neutral palette and a single warm accent derived from the mark. The experience prioritizes scanning: full-bleed grid, sticky filtering, and a split overlay for focus.

## Colors
- Base is neutral stone (oklch 0.145/0.97) on white cards. One accent (foreground) per view. No large gradients; the mark's gradient is reserved for the logo only.
- Surfaces are white cards on muted/30, with thin stone borders and soft shadows.

## Typography
- Display: Instrument Serif 400, tight tracking, text-balance for headings. Used for hero and overlay titles only.
- Body: Outfit 400/500, relaxed leading, text-pretty for descriptions and prompts.
- Mono: JetBrains Mono for code-like prompt blocks.

## Layout
- Full-bleed (edge-to-edge px-4/6/8) with a 6-column grid on desktop. Hero is left-aligned editorial with generous whitespace. Filter bar is sticky below header.
- Cards use 4:5 image, rounded-xl, with a reserved bottom meta bar.

## Components
- Pills for categories (active: foreground fill), dropdown pills for Model/Style, subtle card elevation on hover.
