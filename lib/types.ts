// Alan modeli — Oltalama Farkındalık Simülasyonu
// Bu tipler hem içerik veri setini hem de oyun/rapor durumunu tanımlar.

/** Saldırının geldiği kanal */
export type Channel = "email" | "sms" | "voice";

/** İçerik gerçekten zararlı mı, yoksa meşru mu? */
export type Verdict = "phishing" | "legit";

/** Zorluk seviyesi */
export type Difficulty = "kolay" | "orta" | "zor";

/**
 * Saldırı taktiği kategorisi. Rapor motoru, kullanıcının hangi
 * taktik türlerinde daha çok hata yaptığını bu alana göre çıkarır.
 */
export type Tactic =
  | "kimlik-avi" // credential harvesting
  | "aciliyet" // urgency / scarcity
  | "sahte-gonderen" // spoofed sender / display name
  | "odul-tuzagi" // prize / lottery bait
  | "kurum-taklidi" // brand / institution impersonation
  | "kotu-baglanti" // malicious link / lookalike domain
  | "ek-dosya" // malicious attachment
  | "otorite-baskisi" // authority pressure (CEO fraud, police, tax)
  | "para-transferi" // payment / wire fraud
  | "veri-sizintisi"; // data exfiltration / info gathering

export interface TacticMeta {
  id: Tactic;
  label: string;
  short: string;
  description: string;
}

/** Bir e-posta senaryosunun görsel alanları */
export interface EmailPayload {
  fromName: string;
  fromAddress: string;
  to: string;
  subject: string;
  date: string;
  bodyHtml: string; // güvenli, kontrollü statik içerik (dangerouslySetInnerHTML)
  hasAttachment?: boolean;
  attachmentName?: string;
}

/** Bir SMS senaryosunun alanları */
export interface SmsPayload {
  sender: string; // gönderen başlığı / numara
  timestamp: string;
  message: string;
}

/** Bir sesli arama (vishing) döküm senaryosu */
export interface VoicePayload {
  callerId: string;
  callerLabel: string;
  duration: string;
  transcript: { speaker: "arayan" | "siz"; text: string }[];
}

/** Bir "kırmızı bayrak" — bir senaryodaki şüpheli/güven veren ipucu */
export interface Flag {
  kind: "danger" | "safe";
  label: string;
  detail: string;
}

/** Tek bir simülasyon senaryosu */
export interface Scenario {
  id: string;
  channel: Channel;
  verdict: Verdict;
  difficulty: Difficulty;
  tactics: Tactic[];
  title: string; // rapor/liste için kısa etiket
  email?: EmailPayload;
  sms?: SmsPayload;
  voice?: VoicePayload;
  /** Cevap sonrası gösterilen açıklama */
  explanation: string;
  flags: Flag[];
  /** Kullanıcıya öğretici tek cümlelik ders */
  takeaway: string;
}

/** Kullanıcının tek bir senaryoya verdiği yanıt */
export interface Answer {
  scenarioId: string;
  channel: Channel;
  tactics: Tactic[];
  verdict: Verdict; // doğru cevap
  guess: Verdict; // kullanıcının tahmini
  correct: boolean;
  msTaken: number; // yanıt süresi
  pointsEarned: number;
}

/** Bir tamamlanmış oturumun kaydı */
export interface SessionRecord {
  id: string;
  startedAt: number;
  finishedAt: number;
  mode: GameMode;
  answers: Answer[];
  score: number;
  maxStreak: number;
  accuracy: number; // 0..1
  xpEarned: number;
}

export type GameMode = "hizli" | "standart" | "maraton" | "odakli";

export interface GameConfig {
  mode: GameMode;
  channels: Channel[];
  difficulties: Difficulty[];
  count: number;
  timedSeconds: number | null; // her soru için süre (null = süresiz)
}

/** localStorage veya Firestore'da tutulan kalıcı profil */
export interface Profile {
  totalXp: number;
  sessionsPlayed: number;
  bestScore: number;
  bestStreak: number;
  history: SessionRecord[];
}

// ---------------------------------------------------------------------------
// Kimlik doğrulama & yetkilendirme
// ---------------------------------------------------------------------------
export type Role = "student" | "admin";

export interface AppUser {
  uid: string;
  displayName: string;
  email: string | null;
  isAnonymous: boolean;
  role: Role;
  /** true ise Firebase; false ise yerel (localStorage) mod */
  cloud: boolean;
}

// ---------------------------------------------------------------------------
// Eğitmen paneli — sınıf geneli istatistikler
// ---------------------------------------------------------------------------
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
