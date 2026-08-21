"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Answer,
  Channel,
  GameConfig,
  GameMode,
  Scenario,
  SessionRecord,
  Verdict,
} from "@/lib/types";
import {
  GAME_MODES,
  VERDICT_LABELS,
  buildConfig,
  makeAnswer,
  pickScenarios,
  scoreAnswer,
  xpFromScore,
} from "@/lib/game";
import { CHANNEL_META } from "@/lib/tactics";
import { commitSession, loadProfile } from "@/lib/db";
import { useAuth } from "./AuthProvider";
import { ScenarioViewer } from "./ScenarioViewer";
import { FeedbackPanel } from "./FeedbackPanel";
import { ResultsScreen } from "./ResultsScreen";
import { ChannelBadge, DifficultyBadge } from "./ui";
import {
  AlertIcon,
  CheckIcon,
  FireIcon,
  BoltIcon,
  ClockIcon,
  MailIcon,
  MessageIcon,
  PhoneIcon,
} from "./Icons";

type Phase = "setup" | "playing" | "results";

const CHANNEL_ICON = { email: MailIcon, sms: MessageIcon, voice: PhoneIcon };

export function GameClient() {
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [saving, setSaving] = useState(false);

  const [pending, setPending] = useState<{
    guess: Verdict;
    correct: boolean;
    points: number;
  } | null>(null);

  const startTimeRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);

  const current = scenarios[index];
  const isLast = index >= scenarios.length - 1;

  const start = useCallback(
    (mode: GameMode, channels: Channel[]) => {
      const cfg = buildConfig(mode, { channels });
      const picked = pickScenarios(cfg);
      setConfig(cfg);
      setScenarios(picked);
      setIndex(0);
      setAnswers([]);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setPending(null);
      startedAtRef.current = Date.now();
      startTimeRef.current = Date.now();
      setPhase("playing");
    },
    []
  );

  const submit = useCallback(
    (guess: Verdict) => {
      if (!current || pending) return;
      const msTaken = Date.now() - startTimeRef.current;
      const correct = guess === current.verdict;
      const pts = scoreAnswer({
        correct,
        difficulty: current.difficulty,
        msTaken,
        timedSeconds: config?.timedSeconds ?? null,
        streak,
      });
      const answer = makeAnswer(current, guess, msTaken, pts);
      setAnswers((prev) => [...prev, answer]);
      setScore((s) => s + pts);
      setStreak((st) => {
        const next = correct ? st + 1 : 0;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });
      setPending({ guess, correct, points: pts });
    },
    [current, pending, config, streak]
  );

  const next = useCallback(async () => {
    if (isLast) {
      const record: SessionRecord = {
        id: `s-${startedAtRef.current}`,
        startedAt: startedAtRef.current,
        finishedAt: Date.now(),
        mode: config!.mode,
        answers,
        score,
        maxStreak,
        accuracy:
          answers.length > 0
            ? answers.filter((a) => a.correct).length / answers.length
            : 0,
        xpEarned: xpFromScore(score),
      };
      setSession(record);
      setPhase("results");
      if (user) {
        setSaving(true);
        try {
          const profile = await commitSession(user, record);
          setTotalXp(profile.totalXp);
        } catch (e) {
          console.error("Oturum kaydedilemedi:", e);
        } finally {
          setSaving(false);
        }
      }
      return;
    }
    setIndex((i) => i + 1);
    setPending(null);
    startTimeRef.current = Date.now();
  }, [isLast, config, answers, score, maxStreak, user]);

  const retry = useCallback(() => {
    setPhase("setup");
    setSession(null);
  }, []);

  if (phase === "setup") return <SetupScreen onStart={start} />;

  if (phase === "results" && session)
    return (
      <ResultsScreen
        session={session}
        totalXp={totalXp}
        saving={saving}
        onRetry={retry}
      />
    );

  if (phase === "playing" && current)
    return (
      <PlayScreen
        scenario={current}
        index={index}
        total={scenarios.length}
        score={score}
        streak={streak}
        timedSeconds={config?.timedSeconds ?? null}
        pending={pending}
        onSubmit={submit}
        onNext={next}
        onTimeout={() =>
          submit(current.verdict === "phishing" ? "legit" : "phishing")
        }
      />
    );

  return null;
}

function SetupScreen({
  onStart,
}: {
  onStart: (mode: GameMode, channels: Channel[]) => void;
}) {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([
    "email",
    "sms",
    "voice",
  ]);
  const [best, setBest] = useState<{ score: number; sessions: number } | null>(
    null
  );

  useEffect(() => {
    let alive = true;
    if (!user) return;
    loadProfile(user).then((p) => {
      if (alive) setBest({ score: p.bestScore, sessions: p.sessionsPlayed });
    });
    return () => {
      alive = false;
    };
  }, [user]);

  const toggleChannel = (c: Channel) => {
    setChannels((prev) =>
      prev.includes(c)
        ? prev.length > 1
          ? prev.filter((x) => x !== c)
          : prev
        : [...prev, c]
    );
  };

  const modeList = Object.values(GAME_MODES);

  return (
    <div className="container-page max-w-4xl py-10">
      <div className="animate-fade-up text-center">
        <span className="eyebrow justify-center">Simülasyon Kurulumu</span>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Bir mod seç, refleksini test et
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Her senaryoyu inceleyip &quot;Zararlı mı, Güvenli mi?&quot; diye karar
          ver. Hızlı ve doğru cevaplar daha çok puan kazandırır.
        </p>
        {best && best.sessions > 0 && (
          <p className="mt-3 text-sm text-ink-faint">
            En yüksek puanın:{" "}
            <span className="font-semibold text-ink">
              {best.score.toLocaleString("tr-TR")}
            </span>{" "}
            · {best.sessions} oturum
          </p>
        )}
      </div>

      {/* Kanal seçimi */}
      <div className="mt-8 card p-6">
        <div className="mb-3 text-sm font-semibold text-ink">
          Kanalları seç{" "}
          <span className="font-normal text-ink-faint">
            (Odaklı ve diğer modlar bu seçime göre filtrelenir)
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["email", "sms", "voice"] as Channel[]).map((c) => {
            const Icon = CHANNEL_ICON[c];
            const on = channels.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleChannel(c)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                  on
                    ? "border-brand/50 bg-brand/10"
                    : "border-line bg-bg-elevated/30 opacity-60 hover:opacity-100"
                }`}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-lg ${
                    on ? "bg-brand/20 text-brand" : "bg-bg-elevated text-ink-faint"
                  }`}
                >
                  <Icon width={20} height={20} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {CHANNEL_META[c].label}
                  </div>
                  <div className="text-xs text-ink-faint">
                    {on ? "Dahil" : "Hariç"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mod kartları */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {modeList.map((m) => (
          <button
            key={m.id}
            onClick={() => onStart(m.id, channels)}
            className="group card p-6 text-left transition-all hover:border-ink/40 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-medium text-ink">
                {m.label}
              </span>
              <span
                className={`chip ${
                  m.accent === "brand"
                    ? "tag-safe"
                    : m.accent === "danger"
                    ? "tag-danger"
                    : "tag-neutral"
                }`}
              >
                {m.timedSeconds ? (
                  <>
                    <ClockIcon width={12} height={12} />
                    {m.timedSeconds}sn
                  </>
                ) : (
                  "süresiz"
                )}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{m.tagline}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Başlat →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayScreen({
  scenario,
  index,
  total,
  score,
  streak,
  timedSeconds,
  pending,
  onSubmit,
  onNext,
  onTimeout,
}: {
  scenario: Scenario;
  index: number;
  total: number;
  score: number;
  streak: number;
  timedSeconds: number | null;
  pending: { guess: Verdict; correct: boolean; points: number } | null;
  onSubmit: (g: Verdict) => void;
  onNext: () => void;
  onTimeout: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(timedSeconds ?? 0);
  const progress = ((index + (pending ? 1 : 0)) / total) * 100;

  useEffect(() => {
    if (!timedSeconds || pending) return;
    setTimeLeft(timedSeconds);
    const started = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      const left = Math.max(0, timedSeconds - elapsed);
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(id);
        onTimeout();
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id, pending, timedSeconds]);

  // Klavye kısayolları: 1 = Zararlı, 2 = Güvenli, Enter/Boşluk = ilerle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (pending) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNext();
        }
        return;
      }
      if (e.key === "1" || e.key === "ArrowLeft") onSubmit("phishing");
      else if (e.key === "2" || e.key === "ArrowRight") onSubmit("legit");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, onSubmit, onNext]);

  const timeRatio = timedSeconds ? timeLeft / timedSeconds : 1;
  const timeTone =
    timeRatio > 0.5 ? "#00e5a0" : timeRatio > 0.25 ? "#ffb545" : "#ff5470";

  return (
    <div className="container-page max-w-3xl py-8">
      {/* Üst durum çubuğu */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold text-ink">
            {index + 1}
            <span className="text-ink-faint"> / {total}</span>
          </span>
          <span className="chip tag-neutral">
            <BoltIcon width={13} height={13} className="text-brand" />
            {score.toLocaleString("tr-TR")}
          </span>
          {streak >= 2 && (
            <span className="chip tag-danger animate-scale-in">
              <FireIcon width={13} height={13} />
              {streak}x seri
            </span>
          )}
        </div>
        {timedSeconds && !pending && (
          <span
            className="flex items-center gap-1.5 font-mono text-sm font-semibold"
            style={{ color: timeTone }}
          >
            <ClockIcon width={15} height={15} />
            {Math.ceil(timeLeft)}sn
          </span>
        )}
      </div>

      {/* İlerleme çubuğu */}
      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Süre çubuğu */}
      {timedSeconds && !pending && (
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-bg-elevated/60">
          <div
            className="h-full rounded-full"
            style={{
              width: `${timeRatio * 100}%`,
              backgroundColor: timeTone,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      )}

      {/* Senaryo meta */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <ChannelBadge channel={scenario.channel} />
        <DifficultyBadge difficulty={scenario.difficulty} />
      </div>

      {/* Senaryo görünümü */}
      <div key={scenario.id} className="animate-slide-in">
        <ScenarioViewer scenario={scenario} />
      </div>

      {/* Karar / Geri bildirim */}
      <div className="mt-6">
        {pending ? (
          <FeedbackPanel
            scenario={scenario}
            guess={pending.guess}
            correct={pending.correct}
            points={pending.points}
            isLast={index >= total - 1}
            onNext={onNext}
          />
        ) : (
          <div>
            <p className="mb-3 text-center text-sm text-ink-soft">
              Bu içerik zararlı mı, güvenli mi?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSubmit("phishing")}
                className="btn-danger py-4 text-base"
              >
                <AlertIcon width={20} height={20} />
                {VERDICT_LABELS.phishing}
                <span className="kbd ml-1 !border-white/40 !bg-white/15 !text-white">
                  1
                </span>
              </button>
              <button
                onClick={() => onSubmit("legit")}
                className="btn-safe py-4 text-base"
              >
                <CheckIcon width={20} height={20} />
                {VERDICT_LABELS.legit}
                <span className="kbd ml-1 !border-white/40 !bg-white/15 !text-white">
                  2
                </span>
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-ink-faint">
              Klavye: <span className="kbd">1</span> /{" "}
              <span className="kbd">2</span> ile yanıtla,{" "}
              <span className="kbd">Enter</span> ile ilerle
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
