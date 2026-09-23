/** Arabic text normalization utilities for voice command matching. */

const DIACRITICS = /[\u064B-\u0652\u0670\u0640]/g;

/** Common command verbs / filler words removed before matching. */
const FILLER_WORDS = [
  "افتح",
  "افتحي",
  "روح",
  "روحي",
  "اذهب",
  "اذهبي",
  "اعرض",
  "اعرضي",
  "هات",
  "هاتي",
  "وريني",
  "ودني",
  "خدني",
  "شغل",
  "شغلي",
  "من",
  "فضلك",
  "على",
  "علي",
  "الى",
  "لل",
  "في",
  "يا",
  "صفحة",
  "شاشة",
  "اسكرين",
  "open",
  "go",
  "to",
  "show",
  "page",
  "screen",
];

export const normalizeArabicText = (input: string): string => {
  if (!input) return "";
  let t = input.toLowerCase().trim();
  t = t.replace(DIACRITICS, "");
  t = t.replace(/[أإآٱ]/g, "ا");
  t = t.replace(/ى/g, "ي");
  t = t.replace(/ؤ/g, "و");
  t = t.replace(/ئ/g, "ي");
  t = t.replace(/ة/g, "ه");
  t = t.replace(/[^\p{L}\p{N}\s]/gu, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t;
};

/** Removes leading "ال" and common verbs so "افتح التحاليل" ≈ "تحاليل". */
export const stripCommandNoise = (normalized: string): string =>
  normalized
    .split(" ")
    .filter((w) => w && !FILLER_WORDS.includes(w))
    .map((w) => (w.length > 3 && w.startsWith("ال") ? w.slice(2) : w))
    .join(" ")
    .trim();
