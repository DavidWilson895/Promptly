import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2] || join(process.cwd(), "public", "image");
const DEST = join(process.cwd(), "public", "uploads", "added");
const OUT = join(process.cwd(), "src", "lib", "data-upload.ts");

mkdirSync(DEST, { recursive: true });

const existing = new Set(readdirSync(DEST).map((f) => f.toLowerCase()));

const files = readdirSync(SRC)
  .filter((f) => {
    const l = f.toLowerCase();
    return (
      l.endsWith(".jpg") ||
      l.endsWith(".jpeg") ||
      l.endsWith(".png") ||
      l.endsWith(".webp") ||
      !/\.[a-z0-9]{1,5}$/i.test(l)
    );
  })
  .sort();

function titleFromName(base) {
  const noExt = base.replace(/\.[^.]+$/, "");
  const ascii = noExt
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!ascii || /^\d+$/.test(ascii.replace(/\s/g, "")) || ascii.length < 3) {
    return "Untitled capture";
  }
  let t = ascii.split(" ").slice(0, 8).join(" ");
  if (t.length > 60) t = t.slice(0, 60);
  return t.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function slugFor(base) {
  const slug = base
    .replace(/\.[^.]+$/, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return slug.length >= 2 ? slug : "image";
}

const used = new Map();
const entries = [];

files.forEach((file, i) => {
  const base = file.replace(/[^0-9A-Za-z\x20-\x7E]/g, "").trim();
  const baseName = base || file;
  const title = titleFromName(baseName);
  const slug = slugFor(baseName);
  let name = slug;
  let n = 1;
  while (used.has(name) || existing.has(`${name}.jpg`)) {
    n += 1;
    name = `${slug}-${n}`;
  }
  used.set(name, true);
  const destName = `${name}.jpg`;
  copyFileSync(join(SRC, file), join(DEST, destName));

  const prompt = title === "Untitled capture"
    ? `High-quality AI generated image - ${file}. Detailed prompt not yet added. Describe the subject, lighting, style, and composition in detail for the best results.`
    : `${title}. High-resolution, detailed, professional composition with careful lighting, texture, and color. Commercial-grade image prompt.`;

  const id = `upl-${String(i + 1).padStart(2, "0")}`;
  const models = ["GPT Image","Nano Banana","Midjourney","Seedance","Kling","Gemini Omni","Grok","MiniMax"];
  const categories = ["Ads & Product","Posters & Visuals","Illustration","Characters","Fashion","Scenes","Portraits"];
  const styles = ["Realistic","Filmic","Editorial","Illustration","3D","Anime","Graphic","Retro","Minimal","Vintage","Cinematic","Surreal","Storybook"];
  const daysAgo = (i * 3) % 28;
  entries.push({
    slug: destName,
    id,
    title,
    prompt,
    model: models[i % models.length],
    category: categories[i % categories.length],
    style: styles[i % styles.length],
    likes: 1200 + ((i * 137) % 1700),
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    file,
  });
});

const lines = entries.map((e) => `  {
    id: "${e.id}",
    image: "/uploads/added/${e.slug}",
    model: "${e.model}",
    category: "${e.category}",
    style: "${e.style}",
    title: ${JSON.stringify(e.title)},
    prompt: ${JSON.stringify(e.prompt)},
    likes: ${e.likes},
    createdAt: "${e.createdAt}",
  }`);

const output = `import type { Prompt } from "./data";

export const UPLOADED_PROMPTS: Prompt[] = [
${lines.join(",\n")}
];
`;

writeFileSync(OUT, output, "utf8");
console.log(`Copied ${entries.length} files -> ${DEST}`);
console.log(`Wrote ${entries.length} prompts -> ${OUT}`);