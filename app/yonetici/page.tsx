import type { Metadata } from "next";
import { AdminClient } from "@/components/AdminClient";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Yönetici Paneli — PhishGuard",
  description:
    "Eğitmen paneli: sınıf geneli başarı, en çok hata yapılan saldırı türleri ve öğrenci sıralaması.",
};

export default function YoneticiPage() {
  return (
    <AuthGate requireAdmin title="Yönetici paneli">
      <AdminClient />
    </AuthGate>
  );
}
