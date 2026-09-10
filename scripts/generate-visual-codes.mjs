import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";

const MD = process.argv[2];
const OUT = join(process.cwd(), "src", "lib", "visual-codes.ts");
const REFS = process.argv[3]; // optional folder of reference images

const text = readFileSync(MD, "utf8");
const lines = text.split(/\r?\n/);

const groups = [];
let current = null;

for (const raw of lines) {
  const line = raw.trim();
  const groupMatch = line.match(/^###\s+\d+\.\s+(.+)$/);
  const itemMatch = line.match(/^-\s*`?\s*(\/.*?\/rebuild)\s*`?\s*$/);
  if (groupMatch) {
    current = { title: groupMatch[1].trim(), codes: [] };
    groups.push(current);
  } else if (itemMatch && current) {
    current.codes.push(itemMatch[1].trim());
  }
}

const declared = groups.reduce((n, g) => n + g.codes.length, 0);
console.log(`Parsed ${groups.length} groups, ${declared} codes`);

const entries = [];
let num = 0;
for (const g of groups) {
  for (const code of g.codes) {
    num += 1;
    entries.push({
      id: String(num).padStart(3, "0"),
      group: g.title,
      code,
      title: code.replace(/^\/|\s\/rebuild$/g, ""),
      image: "",
      images: [],
    });
  }
}

let copied = 0;
if (REFS) {
  const destDir = join(process.cwd(), "public", "uploads", "visual-code");
  mkdirSync(destDir, { recursive: true });
  const files = readdirSync(REFS).filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(parse(f).ext.toLowerCase())
  );
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  for (const e of entries) {
    const titleWords = norm(e.title);
    const matches = files
      .filter((f) => {
        const base = norm(parse(f).name.replace(/\s*\d+\s*$/, ""));
        return base.includes(titleWords) || titleWords.includes(base.split(" ").slice(0, 3).join(" "));
      })
      .sort();
    const paths = [];
    for (const m of matches) {
      const ext = parse(m).ext.toLowerCase();
      const slug = `${e.id}-${norm(e.title).replace(/\s+/g, "-")}${paths.length > 0 ? "-" + (paths.length + 1) : ""}${ext}`;
      copyFileSync(join(REFS, m), join(destDir, slug));
      paths.push(`/uploads/visual-code/${slug}`);
    }
    if (paths.length > 0) {
      e.images = paths;
      e.image = paths[0];
      copied += paths.length;
    }
  }
}

console.log(`Matched ${copied} reference images`);

const linesOut = entries.map(
  (e) => `  {
    id: "${e.id}",
    group: ${JSON.stringify(e.group)},
    code: ${JSON.stringify(e.code)},
    title: ${JSON.stringify(e.title)},
    image: ${JSON.stringify(e.image)},
    images: ${JSON.stringify(e.images)},
  }`
);

const output = `export type VisualCode = {
  id: string;
  group: string;
  code: string;
  title: string;
  image: string;
  images: string[];
};

export const VISUAL_CODES: VisualCode[] = [
${linesOut.join(",\n")}
];
`;

writeFileSync(OUT, output, "utf8");
console.log(`Wrote ${entries.length} visual codes -> ${OUT}`);