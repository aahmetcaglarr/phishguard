"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { AuthPanel } from "./AuthPanel";
import { ShieldIcon, AlertIcon } from "./Icons";

export function AuthGate({
  children,
  requireAdmin = false,
  title = "Bu bölüm için giriş gerekli",
  subtitle,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
  title?: string;
  subtitle?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container-page grid min-h-[50vh] place-items-center">
        <div className="flex items-center gap-3 text-ink-faint">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" />
          Yükleniyor…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page max-w-md py-14">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25">
            <ShieldIcon width={26} height={26} />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
        </div>
        <AuthPanel />
      </div>
    );
  }

  if (requireAdmin && user.role !== "admin") {
    return (
      <div className="container-page max-w-lg py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-danger ring-1 ring-danger/25">
          <AlertIcon width={26} height={26} />
        </span>
        <h1 className="mt-4 text-2xl font-bold">Erişim yetkisi yok</h1>
        <p className="mx-auto mt-2 max-w-sm text-ink-soft">
          Bu panel yalnızca eğitmen (yönetici) hesaplarına açıktır. Hesabın:{" "}
          <span className="font-medium text-ink">{user.displayName}</span>.
        </p>
        <Link href="/simulasyon" className="btn-primary mx-auto mt-6">
          Simülasyona Dön
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
