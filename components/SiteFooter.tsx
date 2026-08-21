import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-soft/50">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="font-display text-xl font-semibold text-ink">
              PhishGuard
            </span>
            <span className="text-xl leading-none text-accent">.</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Oltalama farkındalık simülasyonu. Tüm senaryolar kurgusaldır ve
            yalnızca eğitim amaçlıdır; gerçek kurum, kişi veya numara temsil
            etmez.
          </p>
        </div>

        <nav className="flex flex-col gap-2.5 text-sm">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Gezinti
          </span>
          <Link href="/simulasyon" className="text-ink-soft hover:text-ink">
            Simülasyon
          </Link>
          <Link href="/rapor" className="text-ink-soft hover:text-ink">
            Raporlarım
          </Link>
          <Link href="/rehber" className="text-ink-soft hover:text-ink">
            Güvenlik Rehberi
          </Link>
        </nav>
      </div>
    </footer>
  );
}
