"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { ShieldIcon, BoltIcon, AlertIcon } from "./Icons";

/** Firebase hata kodlarını okunur Türkçeye çevirir. */
function friendlyError(e: unknown): string {
  const code =
    typeof e === "object" && e && "code" in e ? String((e as any).code) : "";
  const map: Record<string, string> = {
    "auth/invalid-email": "Geçersiz e-posta adresi.",
    "auth/user-not-found": "Bu e-postayla bir hesap bulunamadı.",
    "auth/wrong-password": "Hatalı parola.",
    "auth/invalid-credential": "E-posta veya parola hatalı.",
    "auth/email-already-in-use": "Bu e-posta zaten kayıtlı.",
    "auth/weak-password": "Parola en az 6 karakter olmalı.",
    "auth/popup-closed-by-user": "Google penceresi kapatıldı.",
    "auth/operation-not-allowed":
      "Bu giriş yöntemi Firebase konsolunda etkin değil.",
  };
  return map[code] || "Bir hata oluştu. Lütfen tekrar deneyin.";
}

export function AuthPanel({ compact = false }: { compact?: boolean }) {
  const {
    cloud,
    signInEmail,
    signUpEmail,
    signInGuest,
    signInDemo,
    demoAvailable,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  // İnceleme/demo için tek tıkla eğitmen girişi (hoca hiçbir şey yazmaz)
  const demoBox = demoAvailable ? (
    <div className="mb-5 rounded-xl border border-accent/30 bg-accent/5 p-4">
      <div className="text-sm font-semibold text-ink">İnceleme / demo</div>
      <p className="mt-0.5 text-xs text-ink-soft">
        Giriş yapmadan, tek tıkla eğitmen panelini ve tüm özellikleri gör.
      </p>
      <button
        onClick={() => run(signInDemo)}
        disabled={busy}
        className="btn-primary mt-3 w-full"
      >
        <BoltIcon width={18} height={18} />
        Demo eğitmen olarak gir
      </button>
    </div>
  ) : null;

  // ---------------- YEREL MOD ----------------
  if (!cloud) {
    return (
      <div className={`card p-6 ${compact ? "" : "mx-auto max-w-md"}`}>
        {demoBox}
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-elevated text-ink">
            <ShieldIcon width={22} height={22} />
          </span>
          <div>
            <h2 className="font-display text-xl font-medium text-ink">
              Misafir olarak başla
            </h2>
            <p className="text-xs text-ink-faint">
              Yerel mod — ilerlemen bu cihazda saklanır.
            </p>
          </div>
        </div>
        <label className="mb-1.5 block text-sm text-ink-soft" htmlFor="guestname">
          Görünen adın (opsiyonel)
        </label>
        <input
          id="guestname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn. Ayşe"
          className="input"
        />
        <button
          onClick={() =>
            run(async () => {
              await signInGuest(name);
            })
          }
          disabled={busy}
          className="btn-primary mt-4 w-full"
        >
          <BoltIcon width={18} height={18} />
          Simülasyona Başla
        </button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Bulut kaydı ve eğitmen paneli için Firebase yapılandırması gerekir.
        </p>
      </div>
    );
  }

  // ---------------- BULUT MODU ----------------
  const submit = () =>
    run(async () => {
      if (mode === "register") await signUpEmail(name, email, password);
      else await signInEmail(email, password);
    });

  return (
    <div className={`card p-6 ${compact ? "" : "mx-auto max-w-md"}`}>
      {demoBox}
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-bg-elevated text-ink">
          <ShieldIcon width={22} height={22} />
        </span>
        <div>
          <h2 className="font-display text-xl font-medium text-ink">
            {mode === "login" ? "Giriş yap" : "Hesap oluştur"}
          </h2>
          <p className="text-xs text-ink-faint">
            İlerlemen buluta kaydedilir, her cihazdan erişebilirsin.
          </p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-bg-elevated/60 p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              mode === m
                ? "bg-bg-card text-ink shadow-card"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "login" ? "Giriş" : "Kayıt"}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-3"
      >
        {mode === "register" && (
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft" htmlFor="name">
              Ad Soyad
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adın"
              className="input"
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft" htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            className="input"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-soft" htmlFor="pw">
            Parola
          </label>
          <input
            id="pw"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 6 karakter"
            className="input"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy
            ? "Lütfen bekle…"
            : mode === "login"
            ? "Giriş Yap"
            : "Hesap Oluştur"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-ink-faint">
        <span className="h-px flex-1 bg-line" />
        veya
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        onClick={() => run(signInGuest)}
        disabled={busy}
        className="btn-ghost w-full"
      >
        Misafir olarak dene
      </button>
    </div>
  );
}
