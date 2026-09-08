export const MODELS = [
  "GPT Image",
  "Midjourney",
  "Grok",
  "Nano Banana",
  "Seedance",
  "Gemini Omni",
  "Kling",
  "MiniMax",
] as const;

export const CATEGORIES = [
  "Ads & Product",
  "Posters & Visuals",
  "Illustration",
  "Characters",
  "Fashion",
  "Scenes",
  "Portraits",
] as const;

export const STYLES = [
  "Editorial",
  "Minimal",
  "Vintage",
  "Realistic",
  "Anime",
  "3D",
  "Cinematic",
  "Surreal",
  "Storybook",
] as const;

export type Model = (typeof MODELS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Style = (typeof STYLES)[number];

export type Prompt = {
  id: string;
  image: string;
  model: Model;
  category: Category;
  style: Style;
  title: string;
  prompt: string;
  likes: number;
  createdAt: string;
  source?: string;
};

export const PROMPTS: Prompt[] = [
  {
    id: "p01",
    image: "/gallery/img-01.svg",
    model: "GPT Image",
    category: "Ads & Product",
    style: "Minimal",
    title: "Ultra-premium organic juice campaign",
    prompt:
      "Create an ultra-premium 2x2 four-panel natural fruit-juice glass bottle commercial campaign. Panel one: hero shot on a wet stone pedestal in a dark studio, backlit with soft amber rim light, condensation droplets on glass. Panel two: ingredient flat-lay with citrus slices and fresh mint on matte black. Panel three: extreme close-up squeeze splash frozen mid-air. Panel four: lifestyle shot in a sunlit kitchen with linen. Consistent color grade: deep greens, warm amber highlights, hyper-detailed product rendering, 8k commercial photography.",
    likes: 1240,
    createdAt: "2026-09-02T10:00:00Z",
  },
  {
    id: "p02",
    image: "/gallery/img-02.svg",
    model: "Nano Banana",
    category: "Fashion",
    style: "Editorial",
    title: "Retro studio fashion photoshoot",
    prompt:
      "A retro-inspired studio photoshoot featuring a young woman in a cream ribbed-knit turtleneck and pleated brown skirt, standing against a soft seafoam backdrop. Hard-edged studio key light with visible shadow falloff, kodak portra color science, medium format film grain, 1998 Vogue editorial mood, full-body, natural relaxed pose, warm skin tones, vibrant yet muted palette.",
    likes: 986,
    createdAt: "2026-09-03T09:30:00Z",
  },
  {
    id: "p03",
    image: "/gallery/img-03.svg",
    model: "GPT Image",
    category: "Illustration",
    style: "Storybook",
    title: "Simple character storybook illustration",
    prompt:
      "A simple illustration of a [subject] in [outfit], [doing action], in a cozy [setting]. Thick clean linework, flat cel shading, muted storybook palette of sage green, cream, and terracotta, soft vignette, hand-painted texture on watercolor paper, children's picture-book energy, no text, centered composition.",
    likes: 1520,
    createdAt: "2026-09-03T14:00:00Z",
  },
  {
    id: "p04",
    image: "/gallery/img-04.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Minimal",
    title: "Minimalist travel poster",
    prompt:
      "Create a minimalist ultra-detailed travel poster of [CITY / PLACE]. Bold geometric composition, restricted palette of three colors, generous negative space, mid-century swiss style typography-free layout, subtle paper grain, iconic landmarks reduced to simple shapes, 4:5 poster ratio, professional print quality.",
    likes: 1870,
    createdAt: "2026-09-04T08:00:00Z",
  },
  {
    id: "p05",
    image: "/gallery/img-05.svg",
    model: "Seedance",
    category: "Scenes",
    style: "Cinematic",
    title: "Day-in-the-life cat vlog",
    prompt:
      "Create a 60-second realistic day-in-the-life cat vlog, following a ginger tabby from sunrise window naps to dusk explorations of a bohemian apartment. Handheld documentary style, natural window lighting, shallow depth of field at 85mm, gentle ambient audio cues like purring and soft jazz, warm filmic color grade, shot on 35mm, 24fps.",
    likes: 743,
    createdAt: "2026-09-04T18:00:00Z",
  },
  {
    id: "p06",
    image: "/gallery/img-06.svg",
    model: "GPT Image",
    category: "Fashion",
    style: "Editorial",
    title: "Luxury menswear editorial",
    prompt:
      "Luxury editorial campaign. Main subject: male model wearing a double-breasted camel overcoat over a black turtleneck. Set: brutalist concrete gallery with a single shaft of golden-hour light. Pose: three-quarter profile, hands in pockets, looking away. Camera: Hasselblad 6x7, shallow focus on the lapels, cinematic shadows, muted earthy grade, high-end fashion magazine cover.",
    likes: 1103,
    createdAt: "2026-09-05T11:00:00Z",
  },
  {
    id: "p07",
    image: "/gallery/img-07.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Editorial",
    title: "Anime fashion magazine cover",
    prompt:
      "Luxury anime fashion magazine cover inspired by Vogue and haute couture. An elegant female anime character in a dramatic structured gown, editorial lighting with chromatic accents, sophisticated typography-free layout, fine digital painting with painterly cloth detail, high-fashion color palette of deep burgundy, rose gold and ivory, 4-color print aesthetic.",
    likes: 1345,
    createdAt: "2026-09-05T15:30:00Z",
  },
  {
    id: "p08",
    image: "/gallery/img-08.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Editorial",
    title: "TV cast editorial poster",
    prompt:
      "Anime editorial poster of the cast of [TV SHOW]. The main characters arranged in a layered diagonal composition, each in their signature outfit, confident poses, bold flat colors with a single accent color for the background, swiss grid layout, fashion-magazine styling, clean vector-like finish, no text.",
    likes: 891,
    createdAt: "2026-09-06T09:00:00Z",
  },
  {
    id: "p09",
    image: "/gallery/img-09.svg",
    model: "Gemini Omni",
    category: "Ads & Product",
    style: "Minimal",
    title: "Premium bottle on stone podium",
    prompt:
      "Premium green glass bottle placed on a stone podium, surrounded by misted water droplets. Dark olive and charcoal backdrop with a single soft spotlight from above. Micro-detail on the glass texture and label embossing, floating botanical sprigs at the base, luxurious spa atmosphere, hyperreal product photography, 8k.",
    likes: 1020,
    createdAt: "2026-09-06T12:00:00Z",
  },
  {
    id: "p10",
    image: "/gallery/img-10.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Surreal",
    title: "Surreal 3D composition",
    prompt:
      "3D surreal composition of [subject], fully 3D rendered, dreamlike scale play with oversized everyday objects, soft studio lighting, pastel color grading, high-gloss plastic materials with matte accents, floating elements, octane render aesthetic, centered composition on a gradient studio background.",
    likes: 1420,
    createdAt: "2026-09-07T07:30:00Z",
  },
  {
    id: "p11",
    image: "/gallery/img-11.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Vintage",
    title: "Premium vintage travel poster",
    prompt:
      "Create a premium minimalist vintage travel poster of [LOCATION]. Art-deco framed border, sun-ray backdrop, reduced palette of indigo, sand, and rust, iconic architecture silhouetted at the base, textured screen-print grain, embossed feel, generous margins, 4:5 print poster quality.",
    likes: 978,
    createdAt: "2026-09-07T16:00:00Z",
  },
  {
    id: "p12",
    image: "/gallery/img-12.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Vintage",
    title: "Risography travel poster",
    prompt:
      "Create a stylish modern travel poster inspired by risography printing. Overlapping two-color halftone textures, playful misregistration offset on text-free landmarks, palette of coral red and azure against warm paper, subtle grain overlay, bold geometric sky, hand-drawn lines, 4:5.",
    likes: 764,
    createdAt: "2026-09-08T10:00:00Z",
  },
  {
    id: "p13",
    image: "/gallery/img-13.svg",
    model: "GPT Image",
    category: "Ads & Product",
    style: "Editorial",
    title: "Automotive advertising art direction",
    prompt:
      "ACT AS: A senior automotive advertising art director and high-end CGI artist. Brief: flagship electric sedan, night shoot in a mirrored obsidian showroom, rain-slicked floor doubling the headlights. Emotion: silent power and futurism. Technique: 35mm anamorphic, chrome reflections, dramatic rim light, deep blacks with cyan accents, photoreal, no text.",
    likes: 1680,
    createdAt: "2026-09-08T13:00:00Z",
  },
  {
    id: "p14",
    image: "/gallery/img-14.svg",
    model: "Seedance",
    category: "Scenes",
    style: "Cinematic",
    title: "Car chase one-take",
    prompt:
      "A highly realistic cinematic shot filmed from inside a moving rally car as it tears through an autumn forest road. One continuous take, dust and leaves kicked up behind, lens flare through the canopy, 200 fps slow-motion segments, engine noise design, anamorphic 2.39:1, moody amber grade, gritty film grain.",
    likes: 642,
    createdAt: "2026-09-09T08:30:00Z",
  },
  {
    id: "p15",
    image: "/gallery/img-15.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Minimal",
    title: "Minimal hand-drawn style transfer",
    prompt:
      "Transform the photo into a delicate minimalist hand-drawn charcoal study. Ignore background detail, focus on the contour of the subject, heavy smudged shadows, sharp white highlights on a textured cotton paper, artist's signature in corner, monochrome, elegant negative space.",
    likes: 835,
    createdAt: "2026-09-09T15:00:00Z",
  },
  {
    id: "p16",
    image: "/gallery/img-16.svg",
    model: "GPT Image",
    category: "Posters & Visuals",
    style: "Editorial",
    title: "Avant-garde graphic design page",
    prompt:
      "Avant-garde graphic design poster page, elegant editorial layout with asymmetric typography placeholders as abstract shapes, oversized serif accents, stark black and ivory palette with a single cobalt accent, halftone gradients, collage textures, museum-gallery print quality, no real text.",
    likes: 1156,
    createdAt: "2026-09-10T11:00:00Z",
  },
  {
    id: "p17",
    image: "/gallery/img-17.svg",
    model: "GPT Image",
    category: "Illustration",
    style: "Editorial",
    title: "Wildlife collector encyclopedia",
    prompt:
      "WILDLIFE TREASURY — COLLECTOR ENCYCLOPEDIA CARD SYSTEM. Premium scientific illustration of [creature] with exploded habitat diagram, specimen notes rendered as elegant rules and labels (no legible text), thick frame border, aged paper texture, sepia and moss-green palette, museum archival aesthetic, 4:5.",
    likes: 905,
    createdAt: "2026-09-10T17:00:00Z",
  },
  {
    id: "p18",
    image: "/gallery/img-18.svg",
    model: "Midjourney",
    category: "Characters",
    style: "Surreal",
    title: "Spider woman concepts",
    prompt:
      "Some spider woman concepts. Midjourney v8.2 --sref 3626095 --ar 4:5. Elegant hybrid creature with glossy black chitin and flowing silver hair, eight articulated limbs, ornate gothic jewelry, dramatic chiaroscuro lighting, character-sheet presentation with three-turn rotation, painterly concept art.",
    likes: 1497,
    createdAt: "2026-09-11T09:00:00Z",
  },
  {
    id: "p19",
    image: "/gallery/img-19.svg",
    model: "GPT Image",
    category: "Illustration",
    style: "Editorial",
    title: "Y2K editorial illustration",
    prompt:
      "Ultra-detailed editorial digital illustration of a stylish young character in 2000s techwear. Metallic fabrics, translucent holographic panels, chrome accessories, soft studio gradient background, dynamic confident pose, magazine-spread composition, muted gradient palette with one neon accent, clean vector-line finish.",
    likes: 987,
    createdAt: "2026-09-11T14:30:00Z",
  },
  {
    id: "p20",
    image: "/gallery/img-20.svg",
    model: "GPT Image",
    category: "Fashion",
    style: "Editorial",
    title: "Elite fashion magazine cover",
    prompt:
      "An ultra-luxury high fashion magazine cover for an elite couture house. A statuesque model in sculptural architectural garments, swathed in dramatic monochrome studio light, stark ivory background with razor-sharp shadows, minimal masthead space, high-gloss print polish, dignified composition, only elegant abstract shapes as placeholder text.",
    likes: 1776,
    createdAt: "2026-09-12T10:00:00Z",
  },
  {
    id: "p21",
    image: "/gallery/img-21.svg",
    model: "GPT Image",
    category: "Portraits",
    style: "Realistic",
    title: "Hollywood-inspired studio portraits",
    prompt:
      "The SAME handsome Hollywood-inspired male model photographed across three takes: tight crop, half-body, and full-body. Consistent identity, strong bone structure, tailored charcoal suit, seamless warm-grey backdrop, classic three-light setup with a visible key-light catch, filmic skin grading, 120mm portrait lens.",
    likes: 1290,
    createdAt: "2026-09-12T16:00:00Z",
  },
  {
    id: "p22",
    image: "/gallery/img-22.svg",
    model: "GPT Image",
    category: "Ads & Product",
    style: "Minimal",
    title: "Café product poster",
    prompt:
      "Create a minimalist 4:5 café product poster with a pure white ceramic cup of flat white on a warm oak counter. Single window-side light raking across rising steam, flat-brew coffee in a striped cup nestled beside a fold of newspaper, generous negative space, warm neutral palette, specialty-coffee branding energy, loud premium typography placeholder shapes only.",
    likes: 721,
    createdAt: "2026-09-13T08:00:00Z",
  },
  {
    id: "p23",
    image: "/gallery/img-23.svg",
    model: "Seedance",
    category: "Scenes",
    style: "Cinematic",
    title: "Hair serum commercial",
    prompt:
      "A luxury cosmetic commercial for hair serum, shot on 35mm lens. A model's glossy hair arcing in slow-motion under a softbox, serum droplets refracting lens light, backlit silhouette against ivory silk, product reveal in the final two seconds, warm gold and pearl grade, aspirational soundtrack swell, 24fps cinema.",
    likes: 856,
    createdAt: "2026-09-13T13:00:00Z",
  },
  {
    id: "p24",
    image: "/gallery/img-24.svg",
    model: "GPT Image",
    category: "Portraits",
    style: "Realistic",
    title: "Golden-hour street portrait",
    prompt:
      "Natural golden-hour street portrait of an elderly man with silver beard and weathered hands, leaning on a vine-covered wall in southern Italy. Long warm shadows, cinematic bokeh from string lights, authentic candid emotion, 35mm documentary lens with shallow depth, film grain, rich warm highlights against deep teal shadows.",
    likes: 1134,
    createdAt: "2026-09-14T09:00:00Z",
  },
];

export function getStyleTag(model: Model): string {
  return model.replace(/\s+/g, "-").toLowerCase();
}