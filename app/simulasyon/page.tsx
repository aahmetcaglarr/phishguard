import type { Metadata } from "next";
import { GameClient } from "@/components/GameClient";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Simülasyon — PhishGuard",
  description:
    "E-posta, SMS ve sesli arama senaryolarını inceleyip zararlı olup olmadığını tahmin et.",
};

export default function SimulasyonPage() {
  return (
    <AuthGate
      title="Simülasyona başlamadan önce"
      subtitle="İlerlemeni kaydetmek için giriş yap ya da misafir olarak dene."
    >
      <GameClient />
    </AuthGate>
  );
}
