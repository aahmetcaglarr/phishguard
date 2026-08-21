import type { Scenario, Verdict } from "@/lib/types";
import { VERDICT_LABELS } from "@/lib/game";
import { TACTICS } from "@/lib/tactics";
import {
  AlertIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  BoltIcon,
} from "./Icons";

export function FeedbackPanel({
  scenario,
  guess,
  correct,
  points,
  isLast,
  onNext,
}: {
  scenario: Scenario;
  guess: Verdict;
  correct: boolean;
  points: number;
  isLast: boolean;
  onNext: () => void;
}) {
  const truth = scenario.verdict;
  return (
    <div className="animate-scale-in space-y-5">
      {/* Sonuç bandı */}
      <div
        className={`flex items-center gap-4 rounded-xl2 border p-5 ${
          correct
            ? "border-brand/40 bg-brand/10"
            : "border-danger/40 bg-danger/10"
        }`}
      >
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
            correct ? "bg-brand/20 text-brand" : "bg-danger/20 text-danger"
          }`}
        >
          {correct ? (
            <CheckIcon width={26} height={26} />
          ) : (
            <XIcon width={26} height={26} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-display text-xl font-semibold ${
                correct ? "text-brand-dark" : "text-danger"
              }`}
            >
              {correct ? "Doğru!" : "Yanıldın"}
            </span>
            {correct && points > 0 && (
              <span className="chip tag-safe">
                <BoltIcon width={13} height={13} />+{points} puan
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-ink-soft">
            Bu içerik{" "}
            <b className={truth === "phishing" ? "text-danger" : "text-brand"}>
              {VERDICT_LABELS[truth]}
            </b>{" "}
            idi. Senin tahminin:{" "}
            <b className="text-ink">{VERDICT_LABELS[guess]}</b>.
          </p>
        </div>
      </div>

      {/* Kırmızı bayraklar / güven işaretleri */}
      <div className="card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <AlertIcon width={16} height={16} className="text-warn" />
          İşaretler
        </div>
        <ul className="space-y-2.5">
          {scenario.flags.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] ${
                  f.kind === "danger"
                    ? "bg-danger/20 text-danger"
                    : "bg-brand/20 text-brand"
                }`}
              >
                {f.kind === "danger" ? "!" : "✓"}
              </span>
              <div>
                <span className="text-sm font-medium text-ink">{f.label}</span>
                <span className="text-sm text-ink-soft"> — {f.detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Açıklama + ders */}
      <div className="card p-5">
        <p className="text-sm leading-relaxed text-ink-soft">
          {scenario.explanation}
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 p-3.5">
          <span className="mt-0.5 text-info">
            <BoltIcon width={18} height={18} />
          </span>
          <p className="text-sm font-medium leading-relaxed text-ink">
            {scenario.takeaway}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {scenario.tactics.map((t) => (
            <span key={t} className="chip tag-neutral">
              {TACTICS[t].short}
            </span>
          ))}
        </div>
      </div>

      <button onClick={onNext} className="btn-primary w-full">
        {isLast ? "Sonuçları Gör" : "Sıradaki Senaryo"}
        <ArrowRightIcon width={18} height={18} />
      </button>
    </div>
  );
}
