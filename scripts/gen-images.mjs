import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const W = 640;
const H = 800;

const PALETTES = [
  ["oklch(0.28 0.06 30)", "oklch(0.55 0.12 25)", "oklch(0.75 0.09 40)", "oklch(0.92 0.05 70)"],
  ["oklch(0.22 0.08 250)", "oklch(0.38 0.12 255)", "oklch(0.58 0.1 240)", "oklch(0.82 0.05 200)"],
  ["oklch(0.2 0.02 90)", "oklch(0.32 0.03 190)", "oklch(0.5 0.02 150)", "oklch(0.86 0.03 120)"],
  ["oklch(0.35 0.1 320)", "oklch(0.5 0.14 340)", "oklch(0.68 0.1 20)", "oklch(0.9 0.04 60)"],
  ["oklch(0.24 0.09 60)", "oklch(0.42 0.13 45)", "oklch(0.62 0.12 60)", "oklch(0.88 0.06 80)"],
  ["oklch(0.3 0.12 290)", "oklch(0.45 0.15 305)", "oklch(0.6 0.12 330)", "oklch(0.85 0.05 350)"],
  ["oklch(0.2 0.05 220)", "oklch(0.33 0.09 225)", "oklch(0.52 0.1 210)", "oklch(0.8 0.05 190)"],
  ["oklch(0.26 0.05 15)", "oklch(0.4 0.08 10)", "oklch(0.6 0.08 30)", "oklch(0.88 0.04 50)"],
  ["oklch(0.25 0.1 0)", "oklch(0.4 0.14 355)", "oklch(0.6 0.1 350)", "oklch(0.88 0.04 40)"],
  ["oklch(0.18 0.04 250)", "oklch(0.3 0.07 265)", "oklch(0.48 0.08 280)", "oklch(0.78 0.05 300)"],
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function generate(index, palette) {
  const [c1, c2, c3, c4] = palette;
  const shapes = [];

  const seed = "img" + index + Math.random().toString(36).slice(2, 6);

  const shapeCount = 4 + Math.floor(Math.random() * 4);
  const colors = [c2, c3, c4, c1, c3, c2];
  for (let i = 0; i < shapeCount; i++) {
    const kind = i % 3;
    const cx = rand(W * 0.15, W * 0.85);
    const cy = rand(H * 0.15, H * 0.85);
    const r = rand(40, 190);
    const color = colors[i % colors.length];
    if (kind === 0) {
      shapes.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" opacity="0.85"/>`);
    } else if (kind === 1) {
      shapes.push(
        `<rect x="${(cx - r).toFixed(1)}" y="${(cy - r * 1.25).toFixed(1)}" width="${(r * 2).toFixed(1)}" height="${(r * 2.5).toFixed(1)}" fill="${color}" rx="${(r * 0.6).toFixed(1)}" opacity="0.8"/>`
      );
    } else {
      const h = rand(H * 0.4, H * 0.9);
      const w = rand(W * 0.4, W * 0.9);
      const x = rand(0, W - w);
      const y = rand(0, H - h);
      shapes.push(`<path d="M${x.toFixed(1)} ${(y + h).toFixed(1)} C ${(x + w * 0.2).toFixed(1)} ${(y - h * 0.35).toFixed(1)}, ${(x + w * 0.8).toFixed(1)} ${(y - h * 0.35).toFixed(1)}, ${(x + w).toFixed(1)} ${(y + h).toFixed(1)} Z" fill="${color}" opacity="0.75"/>`);
    }
  }

  const largeArc = [
    `<path d="M0 ${H * 0.78} Q ${W * 0.3} ${H * 0.62} ${W * 0.55} ${H * 0.82} T ${W} ${H * 0.7} V ${H} H 0 Z" fill="${c3}" opacity="0.55"/>`,
    `<circle cx="${W * 0.78}" cy="${H * 0.22}" r="70" fill="${c4}" opacity="0.9"/>`,
    `<circle cx="${W * 0.12}" cy="${H * 0.2}" r="26" fill="${c4}" opacity="0.7"/>`,
  ];
  if (index % 2 === 0) shapes.push(...largeArc.slice(0, 2));
  else shapes.push(largeArc[0], largeArc[2]);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="g${seed}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.5"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="${c1}"/>
  <g>
    ${shapes.join("\n    ")}
  </g>
  <g filter="url(#g${seed})" opacity="0.35">
    ${shapes.slice(0, 2).join("\n    ")}
  </g>
</svg>`;
  return svg;
}

const outDir = join(process.cwd(), "public", "gallery");
mkdirSync(outDir, { recursive: true });

const count = 24;
for (let i = 0; i < count; i++) {
  const palette = PALETTES[i % PALETTES.length];
  const svg = generate(i, palette);
  writeFileSync(join(outDir, `img-${String(i + 1).padStart(2, "0")}.svg`), svg, "utf8");
}

console.log(`Generated ${count} images in ${outDir}`);