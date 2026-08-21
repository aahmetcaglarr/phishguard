"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

const BASE_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/simulasyon", label: "Simülasyon" },
  { href: "/rapor", label: "Raporlarım" },
  { href: "/rehber", label: "Rehber" },
];

function Wordmark() {
  return (
    <Link href="/" className="group flex items-baseline gap-0.5">
      <span className="font-display text-2xl font-semibold tracking-tight text-ink">
        PhishGuard
      </span>
      <span className="text-2xl leading-none text-accent">.</span>
    </Link>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const { user, cloud, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const links =
    user?.role === "admin"
      ? [...BASE_LINKS, { href: "/yonetici", label: "Yönetici" }]
      : BASE_LINKS;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="container-page flex h-[68px] items-center justify-between">
        <Wordmark />

        {/* Masaüstü */}
        <div className="hidden items-center gap-7 md:flex">
          <div className="flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative py-1 text-sm transition-colors ${
                  isActive(l.href)
                    ? "font-medium text-ink"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
                {isActive(l.href) && (
                  <span className="absolute -bottom-px left-0 h-0.5 w-full bg-accent" />
                )}
              </Link>
            ))}
          </div>

          <span className="h-5 w-px bg-line" />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="max-w-[11rem] truncate text-sm text-ink-soft">
                {user.role === "admin" && (
                  <span className="mr-1 text-accent">◆</span>
                )}
                {user.displayName}
              </span>
              <button
                onClick={signOutUser}
                className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link href="/simulasyon" className="btn-primary !px-4 !py-2 text-sm">
              {cloud ? "Giriş" : "Başla"}
            </Link>
          )}
        </div>

        {/* Mobil hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-lg border border-ink/20 text-ink md:hidden"
        >
          <svg
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobil menü */}
      {open && (
        <div className="border-t border-line bg-bg-soft px-5 py-4 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`border-b border-line/60 py-3 text-sm last:border-0 ${
                  isActive(l.href)
                    ? "font-medium text-accent"
                    : "text-ink-soft"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">
                  {user.role === "admin" && (
                    <span className="mr-1 text-accent">◆</span>
                  )}
                  {user.displayName}
                </span>
                <button
                  onClick={signOutUser}
                  className="btn-ghost !px-3 !py-1.5 text-sm"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link href="/simulasyon" className="btn-primary w-full">
                {cloud ? "Giriş yap" : "Başla"}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
