import { VoiceCommand, voiceCommandRegistry, VOICE_WAKE_WORD } from "./commandRegistry";
import { normalizeArabicText, stripCommandNoise } from "./normalizeArabicText";

export interface VoiceMatch {
  command: VoiceCommand;
  score: number;
}

/** Levenshtein similarity in 0..1 */
const similarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return 1 - dp[m][n] / Math.max(m, n);
};

const WAKE = normalizeArabicText(VOICE_WAKE_WORD);

/** Detects the wake word and returns any command text that followed it. */
export const detectWakeWord = (
  transcript: string,
): { detected: boolean; rest: string } => {
  const norm = normalizeArabicText(transcript);
  const words = norm.split(" ");
  const idx = words.findIndex((w) => w === WAKE || similarity(w, WAKE) >= 0.75);
  if (idx === -1) return { detected: false, rest: "" };
  return { detected: true, rest: words.slice(idx + 1).join(" ").trim() };
};

const MIN_SCORE = 0.62;

export const matchVoiceCommand = (
  phrase: string,
  registry: VoiceCommand[] = voiceCommandRegistry,
): VoiceMatch | null => {
  const cleaned = stripCommandNoise(normalizeArabicText(phrase));
  if (!cleaned) return null;

  let best: VoiceMatch | null = null;

  for (const command of registry) {
    const candidates = [command.name, ...command.aliases].map((c) =>
      stripCommandNoise(normalizeArabicText(c)),
    );
    for (const candidate of candidates) {
      if (!candidate) continue;
      let score = similarity(cleaned, candidate);
      // keyword containment boosts confidence for longer sentences
      if (cleaned.includes(candidate) || candidate.includes(cleaned)) {
        score = Math.max(score, 0.9);
      }
      if (!best || score > best.score) best = { command, score };
    }
  }

  return best && best.score >= MIN_SCORE ? best : null;
};
