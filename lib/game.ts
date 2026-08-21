import type {
  Answer,
  Channel,
  Difficulty,
  GameConfig,
  GameMode,
  Scenario,
  Verdict,
} from "./types";
import { SCENARIOS } from "./scenarios";

export const GAME_MODES: Record<
  GameMode,
  {
    id: GameMode;
    label: string;
    tagline: string;
    count: number;
    timedSeconds: number | null;
    accent: "brand" | "info" | "warn" | "danger";
  }
> = {
  hizli: {
    id: "hizli",
    label: "Hızlı Tur",
    tagline: "5 senaryo · süreli · ısınma",
    count: 5,
    timedSeconds: 20,
    accent: "info",
  },
  standart: {
    id: "standart",
    label: "Standart",
    tagline: "10 senaryo · süreli · dengeli",
    count: 10,
    timedSeconds: 30,
    accent: "brand",
  },
  maraton: {
    id: "maraton",
    label: "Maraton",
    tagline: "Tüm senaryolar · süresiz · ustalık",
    count: 999,
    timedSeconds: null,
    accent: "warn",
  },
  odakli: {
    id: "odakli",
    label: "Odaklı Antrenman",
    tagline: "Seçtiğin kanal · süresiz · pratik",
    count: 8,
    timedSeconds: null,
    accent: "danger",
  },
};

const BASE_POINTS = 100;
const DIFFICULTY_BONUS: Record<Difficulty, number> = {
  kolay: 0,
  orta: 25,
  zor: 60,
};

export function scoreAnswer(params: {
  correct: boolean;
  difficulty: Difficulty;
  msTaken: number;
  timedSeconds: number | null;
  streak: number;
}): number {
  const { correct, difficulty, msTaken, timedSeconds, streak } = params;
  if (!correct) return 0;

  let pts = BASE_POINTS + DIFFICULTY_BONUS[difficulty];

  if (timedSeconds) {
    const ratioLeft = Math.max(0, 1 - msTaken / (timedSeconds * 1000));
    pts += Math.round(ratioLeft * 50);
  }

  const comboMult = 1 + Math.min(streak, 10) * 0.1;
  return Math.round(pts * comboMult);
}

export const LEVELS = [
  { level: 1, title: "Acemi", minXp: 0 },
  { level: 2, title: "Gözlemci", minXp: 300 },
  { level: 3, title: "Şüpheci", minXp: 800 },
  { level: 4, title: "Analist", minXp: 1600 },
  { level: 5, title: "Avcı", minXp: 2800 },
  { level: 6, title: "Uzman", minXp: 4500 },
  { level: 7, title: "Muhafız", minXp: 7000 },
  { level: 8, title: "Efsane", minXp: 10500 },
];

export function levelForXp(xp: number) {
  let current = LEVELS[0];
  for (const lv of LEVELS) {
    if (xp >= lv.minXp) current = lv;
  }
  const next = LEVELS.find((l) => l.minXp > xp) ?? null;
  const spanStart = current.minXp;
  const spanEnd = next ? next.minXp : current.minXp;
  const progress =
    next && spanEnd > spanStart ? (xp - spanStart) / (spanEnd - spanStart) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}

export function xpFromScore(score: number): number {
  return Math.round(score * 0.1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildConfig(
  mode: GameMode,
  opts?: { channels?: Channel[]; difficulties?: Difficulty[] }
): GameConfig {
  const m = GAME_MODES[mode];
  return {
    mode,
    channels: opts?.channels ?? ["email", "sms", "voice"],
    difficulties: opts?.difficulties ?? ["kolay", "orta", "zor"],
    count: m.count,
    timedSeconds: m.timedSeconds,
  };
}

export function pickScenarios(config: GameConfig): Scenario[] {
  const pool = SCENARIOS.filter(
    (s) =>
      config.channels.includes(s.channel) &&
      config.difficulties.includes(s.difficulty)
  );
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(config.count, shuffled.length));
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  phishing: "Zararlı",
  legit: "Güvenli",
};

export function makeAnswer(
  scenario: Scenario,
  guess: Verdict,
  msTaken: number,
  pointsEarned: number
): Answer {
  return {
    scenarioId: scenario.id,
    channel: scenario.channel,
    tactics: scenario.tactics,
    verdict: scenario.verdict,
    guess,
    correct: guess === scenario.verdict,
    msTaken,
    pointsEarned,
  };
}
