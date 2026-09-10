import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "uploads", "real");
const files = readdirSync(dir).filter(f => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".png") || f.toLowerCase().endsWith(".webp") || f.toLowerCase().endsWith(".jpeg"));
files.sort();

const MODELS = ["GPT Image","Nano Banana","Midjourney","Seedance","Kling","Gemini Omni","Grok","MiniMax"];
const CATEGORIES = ["Ads & Product","Posters & Visuals","Illustration","Characters","Fashion","Scenes","Portraits"];
const STYLES = ["Realistic","Filmic","Editorial","Illustration","3D","Anime","Graphic","Retro","Minimal","Vintage","Cinematic","Surreal","Storybook"];

function titleFromFilename(name) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  // Remove numeric-only titles, give generic
  if (/^\d+$/.test(base.replace(/\s/g, "")) || base.length < 3) {
    return "Untitled capture";
  }
  // Title case, truncate
  let t = base.split(" ").slice(0, 8).join(" ");
  if (t.length > 60) t = t.slice(0, 60);
  return t.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function promptFromTitle(title, filename) {
  if (title === "Untitled capture") {
    return `High-quality AI generated image - ${filename}. Detailed prompt not yet added. Describe the subject, lighting, style, and composition in detail for the best results.`;
  }
  return `${title}. High-resolution, detailed, professional composition with careful lighting, texture, and color. Commercial-grade image prompt.`;
}

const prompts = files.map((file, i) => {
  const title = titleFromFilename(file);
  const prompt = promptFromTitle(title, file);
  const model = MODELS[i % MODELS.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const style = STYLES[i % STYLES.length];
  const likes = 200 + Math.floor(Math.random() * 1800);
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
  // sanitize id
  const id = `real-${String(i+1).padStart(2,"0")}`;
  return `  {
    id: "${id}",
    image: "/uploads/real/${file}",
    model: "${model}",
    category: "${category}",
    style: "${style}",
    title: ${JSON.stringify(title)},
    prompt: ${JSON.stringify(prompt)},
    likes: ${likes},
    createdAt: "${date}",
  }`;
});

const output = `import type { Prompt } from "./data";

export const REAL_PROMPTS: Prompt[] = [
${prompts.join(",\n")}
];
`;

writeFileSync(join(process.cwd(), "src", "lib", "data-real.ts"), output, "utf8");
console.log(`Generated ${files.length} real prompts -> src/lib/data-real.ts`);
