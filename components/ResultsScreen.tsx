import Link from "next/link";
import type { SessionRecord } from "@/lib/types";
import {
  channelBreakdown,
  tacticBreakdown,
  missedThreats,
  recommendations,
  performanceLabel,
} from "@/lib/report";
import { getScenarioById } from "@/lib/scenarios";
import { levelForXp } from "@/lib/game";
import { ProgressRing, MeterBar, StatTile } from "./ui";
import {
  TrophyIcon,
  FireIcon,
  BoltIcon,
  TargetIcon,
  RefreshIcon,
  ChartIcon,
  AlertIcon,
} from "./Icons";

export function ResultsScreen({
  session,
  totalXp,
  saving = false,
  onRetry,
}: {
  session: SessionRecord;
  totalXp: number;
  saving?: boolean;
  onRetry: () => void;
}) {
  const { answers, score, accuracy, maxStreak, xpEarned } = session;
  const perf = performanceLabel(accuracy);
  const channels = channelBreakdown(answers);
  const tactics = tacticBreakdown(answers);
  const missed = missedThreats(answers);
  const recs = recommendations(answers);
  const lvl = levelForXp(totalXp);
  const correct = answers.filter((a) => a.correct).length;

  return (
    <div className="container-page max-w-4xl py-10">
      {/* Başlık kartı */}
      <div className="card p-8 text-center animate-fade-up">
        <div className="flex flex-col items-center">
          <ProgressRing value={accuracy} size={148} tone={perf.tone}>
            <div>
              <div className="font-display text-4xl font-semibold text-ink">
                %{Math.round(accuracy * 100)}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                doğruluk
              </div>
            </div>
          </ProgressRing>
          <div className={`mt-4 chip tag-${perf.tone === "brand" ? "safe" : "neutral"}`}>
            <TrophyIcon width={14} height={14} />
            {perf.label} performans
          </div>
          <h1 className="mt-4 font-display text-3xl font-medium text-ink">
            Simülasyon tamamlandı
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {answers.length} senaryodan {correct} tanesini doğru bildin.
          </p>
          {saving && (
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-faint">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-brand" />
              Sonuç buluta kaydediliyor…
            </div>
          )}
        </div>
      </div>

      {/* Özet istatistikler */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Puan"
          value={score.toLocaleString("tr-TR")}
          icon={<BoltIcon width={16} height={16} />}
          tone="brand"
        />
        <StatTile
          label="En Uzun Seri"
          value={maxStreak}
          icon={<FireIcon width={16} height={16} />}
          tone="warn"
        />
        <StatTile
          label="Kazanılan XP"
          value={`+${xpEarned}`}
          icon={<TargetIcon width={16} height={16} />}
          tone="info"
        />
        <StatTile
          label="Seviye"
          value={lvl.current.level}
          hint={lvl.current.title}
          icon={<TrophyIcon width={16} height={16} />}
          tone="brand"
        />
      </div>

      {/* Kanal ve taktik dökümü */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <ChartIcon width={18} height={18} className="text-info" />
            Kanal Bazında
          </div>
          <div className="space-y-4">
            {channels.map((c) => (
              <MeterBar
                key={c.key}
                label={c.label}
                value={c.accuracy}
                right={`${c.correct}/${c.total}`}
              />
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <TargetIcon width={18} height={18} className="text-warn" />
            Taktik Bazında
          </div>
          <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
            {tactics.length === 0 && (
              <p className="text-sm text-ink-faint">
                Bu turdaki senaryolarda taktik verisi yok.
              </p>
            )}
            {tactics.map((t) => (
              <MeterBar
                key={t.key}
                label={t.label}
                value={t.accuracy}
                right={`${t.correct}/${t.total}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Gözden kaçan tehditler */}
      {missed.length > 0 && (
        <div className="mt-6 rounded-xl2 border border-danger/40 bg-danger/5 p-6">
          <div className="mb-3 flex items-center gap-2 font-semibold text-danger">
            <AlertIcon width={18} height={18} />
            Gözden Kaçan Tehditler ({missed.length})
          </div>
          <p className="mb-3 text-sm text-ink-soft">
            Aşağıdaki tehditleri &quot;Güvenli&quot; sandın — gerçek hayatta en
            riskli hata türü budur.
          </p>
          <ul className="space-y-2">
            {missed.map((a) => {
              const sc = getScenarioById(a.scenarioId);
              return (
                <li
                  key={a.scenarioId}
                  className="flex items-start gap-2 rounded-lg bg-bg-card px-3 py-2 text-sm"
                >
                  <span className="mt-0.5 text-danger">✕</span>
                  <div>
                    <span className="font-medium text-ink">{sc?.title}</span>
                    {sc && (
                      <span className="text-ink-soft"> — {sc.takeaway}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Öneriler */}
      <div className="mt-6 card p-6">
        <div className="mb-3 flex items-center gap-2 font-semibold">
          <BoltIcon width={18} height={18} className="text-brand" />
          Sana Özel Öneriler
        </div>
        <ul className="space-y-2.5">
          {recs.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-ink-soft">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Aksiyonlar */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={onRetry} className="btn-primary flex-1">
          <RefreshIcon width={18} height={18} />
          Tekrar Oyna
        </button>
        <Link href="/rapor" className="btn-ghost flex-1">
          <ChartIcon width={18} height={18} />
          Tüm Raporlarım
        </Link>
        <Link href="/rehber" className="btn-ghost flex-1">
          Güvenlik Rehberi
        </Link>
      </div>
    </div>
  );
}
