// Dad Joke Showdown — Agen997 entry.
// main.ts (Node 22, stdlib only) scores a shortlist of original dad jokes
// against the judge's five criteria (in the brief's own order) and writes
// the winner to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// The gate: UTF-8 text, 1-200 chars, not only whitespace.
// Every candidate below is original work written for this entry.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type Candidate = {
  text: string;
  // Scores 0-5 per judge criterion, most important first:
  // 1. is a dad joke a father would tell (within 200 chars)
  // 2. pun lands cleanly, understood on first read
  // 3. fresh, not a thousand-times-told joke, inside the tradition
  // 4. tight, every word earns its place, punchline at the end
  // 5. reads naturally aloud, dinner-table rhythm
  scores: [number, number, number, number, number];
};

// Weights follow the brief: criterion 1 first, then 2, then 3, then 4, then 5.
const WEIGHTS = [5, 4, 3, 2, 1];

const CANDIDATES: Candidate[] = [
  {
    // Double turn: "cut it out" (stop that / mow it) + "short" (grass height).
    // Tightened from "I was going to mow it" to "I'd mow it": same joke, fewer words.
    text: "I told the lawn I'd mow it. It said, 'Cut it out — I'm already short.'",
    scores: [5, 5, 4, 5, 5],
  },
  {
    // "Hinged on you": a door that depends on its hinges, and on you.
    text: "I told the door I was leaving. It said, 'Don't slam me — I'm already hinged on you.'",
    scores: [5, 4, 4, 4, 4],
  },
  {
    // Out of ink / couldn't express itself: a printer that cannot say how it feels.
    text: "I asked the printer why it was crying. It said it was out of ink — it just couldn't express itself.",
    scores: [5, 4, 3, 4, 4],
  },
  {
    // Tap into my potential, and the potential leaks too.
    text: "My wife asked me to fix the leaky tap. I said I'd tap into my potential — turns out my potential is leaking too.",
    scores: [4, 4, 4, 3, 4],
  },
  {
    // The moon works the night shift and never gets a day off.
    text: "I told my daughter the moon looks tired because it works the night shift — and it never gets a day off.",
    scores: [5, 3, 4, 4, 5],
  },
  {
    // A cover story: the umbrella is always there when it rains.
    text: "I asked the umbrella why it was so popular. It said, 'I'm always there when it rains — call me a cover story.'",
    scores: [4, 3, 4, 3, 4],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function valid(text: string): boolean {
  return text.length >= 1 && text.length <= 200 && text.trim().length > 0;
}

const ranked = CANDIDATES.filter((c) => valid(c.text))
  .map((c) => ({ c, total: total(c) }))
  .sort((a, b) => b.total - a.total || a.c.text.length - b.c.text.length);

if (ranked.length === 0) throw new Error("no valid candidate");

const winner = ranked[0].c.text;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), winner, "utf8");
console.log(`winner (${winner.length} chars): ${winner}`);
