"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { loadProfile, resetProfile } from "@/lib/db";
import { useAuth } from "./AuthProvider";
import { aggregate, performanceLabel } from "@/lib/report";
import { levelForXp, GAME_MODES } from "@/lib/game";
import { ProgressRing, MeterBar, StatTile } from "./ui";
import {
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ChartIcon,
  TargetIcon,
  AlertIcon,
  RefreshIcon,
  ShieldIcon,
} from "./Icons";

export function ReportClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let alive = true;
    if (!user) return;
    loadProfile(user).then((p) => {
      if (alive) setProfile(p);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  if (!profile) {
    return (
      <div className="container-page py-20 text-center text-ink-faint">
        Yükleniyor…
      </div>
    );
  }

  if (profile.sessionsPlayed === 0) {
    return <EmptyState />;
  }

  const stats = aggregate(profile.history);
  const lvl = levelForXp(profile.totalXp);
  const perf = performanceLabel(stats.accuracy);

  const doReset = async () => {
    if (!user) return;
    const msg = user.cloud
      ? "Yerel görünümün sıfırlanacak. (Bulut geçmişi denetim için sunucuda korunur.)"
      : "Tüm ilerlemen (XP, geçmiş, rekorlar) kalıcı olarak silinecek. Emin misin?";
    if (window.confirm(msg)) {
      setProfile(await resetProfile(user));
    }
  };

  return (
    <div className="container-page max-w-5xl py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Kişisel Panel</span>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">
            Raporlarım
          </h1>
          <p className="mt-2 text-ink-soft">
            Toplam {stats.totalAnswers} yanıt üzerinden performans analizin.
          </p>
        </div>
        <button onClick={doReset} className="btn-ghost self-start text-sm sm:self-auto">
          <RefreshIcon width={16} height={16} />
          İlerlemeyi Sıfırla
        </button>
      </div>

      {/* Seviye kartı */}
      <div className="mt-8 card flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
        <ProgressRing value={lvl.progress} size={128} tone="brand">
          <div className="text-center">
            <div className="font-display text-4xl font-semibold text-ink">
              {lvl.current.level}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              seviye
            </div>
          </div>
        </ProgressRing>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <TrophyIcon width={20} height={20} className="text-brand" />
            <span className="font-display text-2xl font-medium text-ink">
              {lvl.current.title}
            </span>
          </div>
          <div className="mt-1 text-sm text-ink-soft">
            {profile.totalXp.toLocaleString("tr-TR")} XP kazandın.
          </div>
          {lvl.next ? (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-ink-faint">
                <span>Sonraki: {lvl.next.title}</span>
                <span>
                  {profile.totalXp} / {lvl.next.minXp} XP
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg-elevated">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${lvl.progress * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-3 chip tag-safe">
              <ShieldIcon width={13} height={13} />
              En yüksek seviyeye ulaştın!
            </div>
          )}
        </div>
      </div>

      {/* Özet metrikler */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Genel Doğruluk"
          value={`%${Math.round(stats.accuracy * 100)}`}
          hint={`${perf.label}`}
          icon={<TargetIcon width={16} height={16} />}
          tone={perf.tone}
        />
        <StatTile
          label="En Yüksek Puan"
          value={profile.bestScore.toLocaleString("tr-TR")}
          icon={<BoltIcon width={16} height={16} />}
          tone="brand"
        />
        <StatTile
          label="En Uzun Seri"
          value={profile.bestStreak}
          icon={<FireIcon width={16} height={16} />}
          tone="warn"
        />
        <StatTile
          label="Oturum"
          value={profile.sessionsPlayed}
          icon={<ChartIcon width={16} height={16} />}
          tone="info"
        />
      </div>

      {/* Kritik hata uyarısı */}
      {stats.missed > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl2 border border-danger/40 bg-danger/5 p-5">
          <AlertIcon width={20} height={20} className="mt-0.5 shrink-0 text-danger" />
          <div className="text-sm">
            <span className="font-semibold text-danger">
              {stats.missed} tehdidi gözden kaçırdın.
            </span>{" "}
            <span className="text-ink-soft">
              Bir tehdidi &quot;güvenli&quot; sanmak, gerçek hayatta en pahalı
              hatadır. Emin olmadığında her zaman bağımsız bir kanaldan doğrula.
            </span>
          </div>
        </div>
      )}

      {/* Dökümler */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2 font-semibold">
            <ChartIcon width={18} height={18} className="text-info" />
            Kanal Bazında Doğruluk
          </div>
          <div className="space-y-4">
            {stats.channels.map((c) => (
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
            Taktik Bazında Doğruluk
          </div>
          <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {stats.tactics.map((t) => (
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

      {/* Oturum geçmişi */}
      <div className="mt-6 card p-6">
        <div className="mb-4 flex items-center gap-2 font-semibold">
          <RefreshIcon width={18} height={18} className="text-brand" />
          Son Oturumlar
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="py-2 pr-4 font-medium">Tarih</th>
                <th className="py-2 pr-4 font-medium">Mod</th>
                <th className="py-2 pr-4 font-medium">Doğruluk</th>
                <th className="py-2 pr-4 font-medium">Puan</th>
                <th className="py-2 font-medium">Seri</th>
              </tr>
            </thead>
            <tbody>
              {profile.history.slice(0, 12).map((h) => (
                <tr key={h.id} className="border-b border-line/50 last:border-0">
                  <td className="py-2.5 pr-4 text-ink-soft">
                    {new Date(h.startedAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="chip tag-neutral">
                      {GAME_MODES[h.mode].label}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-ink">
                    %{Math.round(h.accuracy * 100)}
                  </td>
                  <td className="py-2.5 pr-4 font-semibold text-brand">
                    {h.score.toLocaleString("tr-TR")}
                  </td>
                  <td className="py-2.5 text-ink-soft">{h.maxStreak}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/simulasyon" className="btn-primary px-7 py-3.5">
          <BoltIcon width={18} height={18} />
          Yeni Tur Başlat
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="container-page max-w-xl py-20 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25">
        <ChartIcon width={30} height={30} />
      </span>
      <h1 className="mt-5 font-display text-3xl font-medium text-ink">
        Henüz veri yok
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-ink-soft">
        İlk simülasyonunu tamamladığında doğruluk oranların, zayıf yönlerin ve
        oturum geçmişin burada görünecek.
      </p>
      <Link href="/simulasyon" className="btn-primary mx-auto mt-6 px-7 py-3.5">
        <BoltIcon width={18} height={18} />
        İlk Turunu Oyna
      </Link>
    </div>
  );
}
