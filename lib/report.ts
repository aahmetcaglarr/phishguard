import type { Answer, Channel, SessionRecord, Tactic } from "./types";
import { TACTICS, CHANNEL_META } from "./tactics";

export interface Breakdown {
  key: string;
  label: string;
  total: number;
  correct: number;
  accuracy: number; // 0..1
}

function accuracy(correct: number, total: number): number {
  return total === 0 ? 0 : correct / total;
}

/** Kanal (e-posta/SMS/sesli) bazında doğruluk dökümü. */
export function channelBreakdown(answers: Answer[]): Breakdown[] {
  const channels: Channel[] = ["email", "sms", "voice"];
  return channels
    .map((ch) => {
      const rel = answers.filter((a) => a.channel === ch);
      const correct = rel.filter((a) => a.correct).length;
      return {
        key: ch,
        label: CHANNEL_META[ch].label,
        total: rel.length,
        correct,
        accuracy: accuracy(correct, rel.length),
      };
    })
    .filter((b) => b.total > 0);
}

/** Taktik türü bazında doğruluk dökümü (zayıf alan analizi). */
export function tacticBreakdown(answers: Answer[]): Breakdown[] {
  const map = new Map<Tactic, { total: number; correct: number }>();
  for (const a of answers) {
    for (const t of a.tactics) {
      const entry = map.get(t) ?? { total: 0, correct: 0 };
      entry.total += 1;
      if (a.correct) entry.correct += 1;
      map.set(t, entry);
    }
  }
  return Array.from(map.entries())
    .map(([t, v]) => ({
      key: t,
      label: TACTICS[t].label,
      total: v.total,
      correct: v.correct,
      accuracy: accuracy(v.correct, v.total),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

/** En zayıf (en çok hata yapılan) taktikler. */
export function weakestTactics(answers: Answer[], limit = 3): Breakdown[] {
  return tacticBreakdown(answers)
    .filter((b) => b.total >= 1 && b.accuracy < 1)
    .slice(0, limit);
}

/**
 * Kritik hata türü: kullanıcının bir tehdidi "Güvenli" sandığı durumlar
 * (false negative) en tehlikelisidir.
 */
export function missedThreats(answers: Answer[]): Answer[] {
  return answers.filter((a) => a.verdict === "phishing" && !a.correct);
}

export function falseAlarms(answers: Answer[]): Answer[] {
  return answers.filter((a) => a.verdict === "legit" && !a.correct);
}

export interface AggregateStats {
  totalAnswers: number;
  totalCorrect: number;
  accuracy: number;
  channels: Breakdown[];
  tactics: Breakdown[];
  missed: number;
  falseAlarm: number;
}

/** Tüm geçmiş oturumlar üzerinden birleşik istatistik. */
export function aggregate(history: SessionRecord[]): AggregateStats {
  const answers = history.flatMap((h) => h.answers);
  const totalCorrect = answers.filter((a) => a.correct).length;
  return {
    totalAnswers: answers.length,
    totalCorrect,
    accuracy: accuracy(totalCorrect, answers.length),
    channels: channelBreakdown(answers),
    tactics: tacticBreakdown(answers),
    missed: missedThreats(answers).length,
    falseAlarm: falseAlarms(answers).length,
  };
}

/** Doğruluğa göre performans etiketi. */
export function performanceLabel(acc: number): {
  label: string;
  tone: "brand" | "info" | "warn" | "danger";
} {
  if (acc >= 0.9) return { label: "Mükemmel", tone: "brand" };
  if (acc >= 0.75) return { label: "İyi", tone: "info" };
  if (acc >= 0.5) return { label: "Gelişmeli", tone: "warn" };
  return { label: "Riskli", tone: "danger" };
}

/** Sonuç ekranı için kişiselleştirilmiş öneriler üretir. */
export function recommendations(answers: Answer[]): string[] {
  const recs: string[] = [];
  const missed = missedThreats(answers);
  const weak = weakestTactics(answers, 2);

  if (missed.length > 0) {
    recs.push(
      `${missed.length} tehdidi gözden kaçırdın. Bir mesajdan emin değilsen "güvenli" varsaymak yerine bağımsız bir kanaldan doğrula.`
    );
  }
  for (const w of weak) {
    recs.push(
      `"${w.label}" taktiğinde doğruluğun %${Math.round(
        w.accuracy * 100
      )}. Bu türdeki işaretlere odaklanarak tekrar dene.`
    );
  }
  const fa = falseAlarms(answers);
  if (fa.length >= 2) {
    recs.push(
      "Bazı meşru mesajları da tehdit sandın. Resmî alan adı + baskı olmaması + beklenen bağlam varsa mesaj genelde güvenlidir."
    );
  }
  if (recs.length === 0) {
    recs.push(
      "Harika bir performans! Farklı kanal ve zorluklarda pratiğe devam ederek refleksini koru."
    );
  }
  return recs;
}
