export type Channel = "email" | "sms" | "voice";
export type Verdict = "phishing" | "legit";
export type Difficulty = "kolay" | "orta" | "zor";

export type Tactic =
  | "kimlik-avi"
  | "aciliyet"
  | "sahte-gonderen"
  | "odul-tuzagi"
  | "kurum-taklidi"
  | "kotu-baglanti"
  | "ek-dosya"
  | "otorite-baskisi"
  | "para-transferi"
  | "veri-sizintisi";

export interface TacticMeta {
  id: Tactic;
  label: string;
  short: string;
  description: string;
}

export interface EmailPayload {
  fromName: string;
  fromAddress: string;
  to: string;
  subject: string;
  date: string;
  bodyHtml: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface SmsPayload {
  sender: string;
  timestamp: string;
  message: string;
}

export interface VoicePayload {
  callerId: string;
  callerLabel: string;
  duration: string;
  transcript: { speaker: "arayan" | "siz"; text: string }[];
}

export interface Flag {
  kind: "danger" | "safe";
  label: string;
  detail: string;
}

export interface Scenario {
  id: string;
  channel: Channel;
  verdict: Verdict;
  difficulty: Difficulty;
  tactics: Tactic[];
  title: string;
  email?: EmailPayload;
  sms?: SmsPayload;
  voice?: VoicePayload;
  explanation: string;
  flags: Flag[];
  takeaway: string;
}

export interface Answer {
  scenarioId: string;
  channel: Channel;
  tactics: Tactic[];
  verdict: Verdict;
  guess: Verdict;
  correct: boolean;
  msTaken: number;
  pointsEarned: number;
}

export interface SessionRecord {
  id: string;
  startedAt: number;
  finishedAt: number;
  mode: GameMode;
  answers: Answer[];
  score: number;
  maxStreak: number;
  accuracy: number;
  xpEarned: number;
}

export type GameMode = "hizli" | "standart" | "maraton" | "odakli";

export interface GameConfig {
  mode: GameMode;
  channels: Channel[];
  difficulties: Difficulty[];
  count: number;
  timedSeconds: number | null;
}

export interface Profile {
  totalXp: number;
  sessionsPlayed: number;
  bestScore: number;
  bestStreak: number;
  history: SessionRecord[];
}

export type Role = "student" | "admin";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string | null;
  isAnonymous: boolean;
  role: Role;
  cloud: boolean;
}

export interface ClassBreakdown {
  key: string;
  label: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface ClassOverview {
  totalStudents: number;
  totalSessions: number;
  totalAnswers: number;
  totalCorrect: number;
  accuracy: number;
  missedThreats: number;
  channels: ClassBreakdown[];
  tactics: ClassBreakdown[];
  recentSessions: {
    displayName: string;
    mode: GameMode;
    accuracy: number;
    score: number;
    at: number;
  }[];
  topStudents: {
    displayName: string;
    totalXp: number;
    bestScore: number;
    sessionsPlayed: number;
  }[];
}
