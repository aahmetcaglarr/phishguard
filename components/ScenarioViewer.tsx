import type { Scenario } from "@/lib/types";
import { PaperclipIcon } from "./Icons";

export function ScenarioViewer({ scenario }: { scenario: Scenario }) {
  if (scenario.channel === "email" && scenario.email)
    return <EmailView s={scenario} />;
  if (scenario.channel === "sms" && scenario.sms)
    return <SmsView s={scenario} />;
  if (scenario.channel === "voice" && scenario.voice)
    return <VoiceView s={scenario} />;
  return null;
}

function Slug({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
      {children}
    </span>
  );
}

function EmailView({ s }: { s: Scenario }) {
  const e = s.email!;
  const initials = e.fromName.trim().slice(0, 1).toUpperCase();
  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-bg-soft/70 px-5 py-3">
        <Slug>Gelen Kutusu — E-posta</Slug>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </span>
      </div>

      <div className="px-6 py-5">
        <h3 className="font-display text-xl font-medium leading-snug text-ink">
          {e.subject}
        </h3>

        <div className="mt-4 flex items-start gap-3 border-b border-line pb-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bg-elevated text-sm font-semibold text-ink-soft">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium text-ink">{e.fromName}</span>
              <span className="truncate font-mono text-xs text-ink-soft">
                &lt;{e.fromAddress}&gt;
              </span>
            </div>
            <div className="mt-0.5 font-mono text-xs text-ink-faint">
              Alıcı: {e.to} · {e.date}
            </div>
          </div>
        </div>

        <div
          className="mail-body mt-4 text-sm text-ink-soft"
          dangerouslySetInnerHTML={{ __html: e.bodyHtml }}
        />

        {e.hasAttachment && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line bg-bg-soft/70 px-3 py-2 text-sm">
            <PaperclipIcon width={16} height={16} className="text-ink-faint" />
            <span className="font-mono text-ink">{e.attachmentName}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SmsView({ s }: { s: Scenario }) {
  const m = s.sms!;
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-xl2 border border-line bg-bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-bg-soft/70 px-5 py-3">
        <Slug>Mesajlar — SMS</Slug>
      </div>
      <div className="px-5 py-6">
        <div className="text-center">
          <div className="text-sm font-medium text-ink">{m.sender}</div>
          <div className="mt-0.5 font-mono text-[11px] text-ink-faint">
            {m.timestamp}
          </div>
        </div>
        <div className="mt-5 max-w-[88%] rounded-2xl rounded-tl-md border border-line bg-bg-elevated px-4 py-3 text-sm leading-relaxed text-ink">
          {m.message}
        </div>
      </div>
    </div>
  );
}

function VoiceView({ s }: { s: Scenario }) {
  const v = s.voice!;
  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-line bg-bg-soft/70 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-bg-elevated text-ink-soft">
            <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 5c0 8 7 15 15 15l2.5-2.5-4-3-2 1.5A12 12 0 0 1 9 9L10.5 7l-3-4L5 5.5C4.3 5 4 5 4 5z" />
            </svg>
          </span>
          <div>
            <div className="text-sm font-medium text-ink">{v.callerLabel}</div>
            <div className="font-mono text-xs text-ink-faint">{v.callerId}</div>
          </div>
        </div>
        <Slug>Süre {v.duration}</Slug>
      </div>

      <div className="space-y-3 px-5 py-5">
        <Slug>Arama Dökümü</Slug>
        <div className="space-y-3 pt-1">
          {v.transcript.map((t, i) => {
            const isCaller = t.speaker === "arayan";
            return (
              <div
                key={i}
                className={`flex ${isCaller ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl border px-4 py-2.5 text-sm leading-relaxed ${
                    isCaller
                      ? "rounded-tl-md border-line bg-bg-elevated text-ink"
                      : "rounded-tr-md border-info/25 bg-info/10 text-ink"
                  }`}
                >
                  <div
                    className={`mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      isCaller ? "text-ink-faint" : "text-info"
                    }`}
                  >
                    {isCaller ? "Arayan" : "Siz"}
                  </div>
                  {t.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
