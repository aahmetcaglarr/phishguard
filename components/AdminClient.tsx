"use client";

import { useEffect, useState } from "react";
import type { ClassOverview } from "@/lib/types";
import { loadClassOverview } from "@/lib/db";
import { GAME_MODES } from "@/lib/game";
import { useAuth } from "./AuthProvider";
import { MeterBar, StatTile } from "./ui";
import {
  ChartIcon,
  TargetIcon,
  AlertIcon,
  TrophyIcon,
  RefreshIcon,
  EyeIcon,
} from "./Icons";

export function AdminClient() {
  const { user } = useAuth();
  const [data, setData] = useState<ClassOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) return;
    setLoading(true);
    loadClassOverview(user)
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  if (loading || !data) {
    return (
      <div className="container-page grid min-h-[40vh] place-items-center text-ink-faint">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
          Sınıf verileri yükleniyor…
        </div>
      </div>
    );
  }

  const weakest = data.tactics[0]; // en düşük doğruluk (report sıralı geliyor)

  return (
    <div className="container-page max-w-5xl py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow">Eğitmen Paneli</span>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink">
            Sınıf genel görünümü
          </h1>
          <p className="mt-2 text-ink-soft">
            {user?.cloud
              ? "Tüm öğrencilerin birleşik performansı."
              : "Yerel mod: yalnızca bu cihazdaki veriler gösteriliyor."}
          </p>
        </div>
        <button onClick={load} className="btn-ghost self-start text-sm sm:self-auto">
          <RefreshIcon width={16} height={16} />
          Yenile
        </button>
      </div>

      {data.totalSessions === 0 ? (
        <div className="mt-10 card p-10 text-center text-ink-soft">
          Henüz tamamlanmış oturum yok. Öğrenciler simülasyonu oynadıkça veriler
          burada birikecek.
        </div>
      ) : (
        <>
          {/* Özet metrikler */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile
              label="Öğrenci"
              value={data.totalStudents}
              icon={<EyeIcon width={16} height={16} />}
              tone="info"
            />
            <StatTile
              label="Oturum"
              value={data.totalSessions}
              icon={<ChartIcon width={16} height={16} />}
              tone="brand"
            />
            <StatTile
              label="Sınıf Doğruluğu"
              value={`%${Math.round(data.accuracy * 100)}`}
              hint={`${data.totalCorrect}/${data.totalAnswers} yanıt`}
              icon={<TargetIcon width={16} height={16} />}
              tone="brand"
            />
            <StatTile
              label="Kaçırılan Tehdit"
              value={data.missedThreats}
              hint="tehdit 'güvenli' sanıldı"
              icon={<AlertIcon width={16} height={16} />}
              tone="danger"
            />
          </div>

          {/* En kritik zayıflık */}
          {weakest && weakest.accuracy < 1 && (
            <div className="mt-6 flex items-start gap-3 rounded-xl2 border border-warn/40 bg-warn/5 p-5">
              <AlertIcon
                width={20}
                height={20}
                className="mt-0.5 shrink-0 text-warn"
              />
              <div className="text-sm">
                <span className="font-semibold text-warn">
                  En zayıf alan: {weakest.label} (%
                  {Math.round(weakest.accuracy * 100)} doğruluk).
                </span>{" "}
                <span className="text-ink-soft">
                  Sınıf en çok bu saldırı türünde hata yapıyor. Eğitimde bu
                  taktiğe ağırlık vermeniz önerilir.
                </span>
              </div>
            </div>
          )}

          {/* Dökümler */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <div className="mb-4 flex items-center gap-2 font-semibold">
                <ChartIcon width={18} height={18} className="text-info" />
                Kanal Bazında Başarı
              </div>
              <div className="space-y-4">
                {data.channels.map((c) => (
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
                Taktik Bazında Başarı{" "}
                <span className="text-xs font-normal text-ink-faint">
                  (zayıftan güçlüye)
                </span>
              </div>
              <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
                {data.tactics.map((t) => (
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

          {/* Öğrenci sıralaması */}
          <div className="mt-6 card p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <TrophyIcon width={18} height={18} className="text-brand" />
              Öğrenci Sıralaması
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                    <th className="py-2 pr-4 font-medium">#</th>
                    <th className="py-2 pr-4 font-medium">Öğrenci</th>
                    <th className="py-2 pr-4 font-medium">XP</th>
                    <th className="py-2 pr-4 font-medium">En Yüksek Puan</th>
                    <th className="py-2 font-medium">Oturum</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topStudents.map((s, i) => (
                    <tr
                      key={i}
                      className="border-b border-line/50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-ink-faint">{i + 1}</td>
                      <td className="py-2.5 pr-4 font-medium text-ink">
                        {i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : ""}
                        {s.displayName}
                      </td>
                      <td className="py-2.5 pr-4 font-semibold text-brand">
                        {s.totalXp.toLocaleString("tr-TR")}
                      </td>
                      <td className="py-2.5 pr-4 text-ink-soft">
                        {s.bestScore.toLocaleString("tr-TR")}
                      </td>
                      <td className="py-2.5 text-ink-soft">{s.sessionsPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Son oturumlar */}
          <div className="mt-6 card p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <RefreshIcon width={18} height={18} className="text-info" />
              Son Oturumlar
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                    <th className="py-2 pr-4 font-medium">Öğrenci</th>
                    <th className="py-2 pr-4 font-medium">Mod</th>
                    <th className="py-2 pr-4 font-medium">Doğruluk</th>
                    <th className="py-2 pr-4 font-medium">Puan</th>
                    <th className="py-2 font-medium">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSessions.map((s, i) => (
                    <tr
                      key={i}
                      className="border-b border-line/50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 font-medium text-ink">
                        {s.displayName}
                      </td>
                      <td className="py-2.5 pr-4">
                        <span className="chip tag-neutral">
                          {GAME_MODES[s.mode].label}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-ink">
                        %{Math.round(s.accuracy * 100)}
                      </td>
                      <td className="py-2.5 pr-4 font-semibold text-brand">
                        {s.score.toLocaleString("tr-TR")}
                      </td>
                      <td className="py-2.5 text-ink-soft">
                        {new Date(s.at).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
