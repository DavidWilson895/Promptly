# Promptly

Promptly is an AI image prompt library — browse real AI-generated images, copy the exact prompts that made them, and rebuild any image in 200 different visual styles.

## Features

- **Explore** — a gallery of 113 real AI images, filterable by model, category, and style, with search and trending/latest/popular sorting.
- **Visual codes** — 200 event-poster rebuild codes across 20 style categories (Modernist Systems, Print Imperfections, Nightlife Neon, Zine Underground, and more). Each code has reference images and is one click to copy.
- **My Library** — save prompts you want to keep.
- **Sign-in popup** — with an animated eye-following button and liquid-morph sign-in button.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React, TypeScript
- Tailwind CSS v4
- Base UI
- lucide-react

## Getting Started

Requires **Node.js 20.9+** (or any current LTS).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production build

```bash
npm run build
npm start
```

## Scripts

Reusable generators live in `scripts/`:

```bash
# Regenerate visual codes from the source markdown + reference image folder
node scripts/generate-visual-codes.mjs "path/to/200_event_poster_design_codes.md" "path/to/reference/images"

# Copy a folder of images into the gallery and register them as prompts
node scripts/add-uploaded.mjs "path/to/image/folder"
```

## Project structure

```
public/uploads/        gallery images (added/, real/, visual-code/)
src/app/               routes (home, my-library, visual-code)
src/components/        header, footer, cards, dialogs, sign-in, animated buttons
src/lib/               data: prompts (data.ts, data-real.ts, data-upload.ts) + visual codes
scripts/               code/image generation helpers
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.