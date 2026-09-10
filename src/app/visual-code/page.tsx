import { Code2 } from "lucide-react";

import { VisualCodeGroup } from "@/components/visual-code-group";
import { VISUAL_CODES, type VisualCode } from "@/lib/visual-codes";

export const metadata = {
  title: "Visual code",
};

const GROUPS = VISUAL_CODES.reduce<{ title: string; codes: VisualCode[] }[]>(
  (acc, code) => {
    const last = acc[acc.length - 1];
    if (last && last.title === code.group) {
      last.codes.push(code);
    } else {
      acc.push({ title: code.group, codes: [code] });
    }
    return acc;
  },
  []
);

export default function VisualCodePage() {
  return (
    <main className="flex w-full flex-col gap-10 px-6 py-24 pb-16 md:px-8 lg:px-10 md:py-28">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium">
          <Code2 className="size-3.5" /> Visual code
        </span>
        <h1 className="font-sans text-3xl font-semibold tracking-tight md:text-4xl">
          Event poster design codes
        </h1>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {VISUAL_CODES.length} rebuild codes across {GROUPS.length} style categories. Copy one line,
          attach your reference poster, and rebuild it in that visual language.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {GROUPS.map((group) => (
          <VisualCodeGroup key={group.title} group={group.title} codes={group.codes} />
        ))}
      </div>
    </main>
  );
}