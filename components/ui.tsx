import type { Channel, Difficulty } from "@/lib/types";
import { CHANNEL_META } from "@/lib/tactics";
import { MailIcon, MessageIcon, PhoneIcon } from "./Icons";

const CHANNEL_ICON = {
  email: MailIcon,
  sms: MessageIcon,
  voice: PhoneIcon,
} as const;

export function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon = CHANNEL_ICON[channel];
  return (
    <span className="chip tag-neutral">
      <Icon width={14} height={14} />
      {CHANNEL_META[channel].label}
    </span>
  );
}

const DIFF_STYLE: Record<Difficulty, string> = {
  kolay: "border-brand/30 bg-brand/10 text-brand-dark",
  orta: "border-info/30 bg-info/10 text-info",
  zor: "border-warn/30 bg-warn/10 text-warn",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`chip ${DIFF_STYLE[difficulty]}`}>
      <span className="capitalize">{difficulty}</span>
    </span>
  );
}

/** Dairesel ilerleme halkası (0..1). */
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  tone = "brand",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "brand" | "info" | "warn" | "danger";
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  const color = {
    brand: "#1E7A52",
    info: "#33618E",
    warn: "#B07B1E",
    danger: "#BE3520",
  }[tone];
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E1D8C6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children}
      </div>
    </div>
  );
}

/** Yatay doğruluk çubuğu (rapor bileşeni). */
export function MeterBar({
  value,
  label,
  right,
}: {
  value: number; // 0..1
  label: string;
  right?: string;
}) {
  const pct = Math.round(value * 100);
  const tone =
    pct >= 80 ? "#1E7A52" : pct >= 50 ? "#33618E" : pct >= 30 ? "#B07B1E" : "#BE3520";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className="font-semibold text-ink">{right ?? `%${pct}`}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-bg-elevated">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: tone,
            transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "brand" | "info" | "warn" | "danger";
}) {
  const ring = {
    brand: "text-brand ring-brand/25 bg-brand/10",
    info: "text-info ring-info/25 bg-info/10",
    warn: "text-warn ring-warn/25 bg-warn/10",
    danger: "text-danger ring-danger/25 bg-danger/10",
  }[tone];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
          {label}
        </span>
        {icon && (
          <span className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${ring}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-ink-faint">{hint}</div>}
    </div>
  );
}
