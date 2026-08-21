import type { Metadata } from "next";
import { ReportClient } from "@/components/ReportClient";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Raporlarım — PhishGuard",
  description:
    "Oturum geçmişin, doğruluk oranların ve zayıf yönlerinin detaylı analizi.",
};

export default function RaporPage() {
  return (
    <AuthGate
      title="Raporların için giriş yap"
      subtitle="Kişisel performans analizini görmek için oturum aç."
    >
      <ReportClient />
    </AuthGate>
  );
}
