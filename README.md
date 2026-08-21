# 🛡️ PhishGuard — Oltalama (Phishing/Vishing) Farkındalık Simülasyonu

Öğrencilerin ve son kullanıcıların siber güvenlik okuryazarlığını test eden,
**oyunlaştırılmış** bir web platformu. Ekrana sırayla sahte/gerçek e-postalar,
SMS'ler ve sesli arama dökümleri gelir; kullanıcı bunların zararlı olup
olmadığına karar verir. Sistem, hangi saldırı türlerinde daha çok hata
yapıldığını hem bireysel hem de **sınıf geneli (eğitmen paneli)** raporlar.

> Tüm senaryolar **kurgusaldır** ve yalnızca eğitim amaçlıdır. Gerçek kurum,
> kişi veya numara temsil etmez. Simülasyondaki tüm bağlantılar devre dışıdır.

---

## ✨ Öne Çıkan Özellikler

- **3 saldırı kanalı** — gerçekçi arayüzlerle E-posta, SMS ve Sesli Arama (vishing).
- **42 senaryo** — banka, kargo, e-Devlet, GİB, CEO dolandırıcılığı, sahte
  savcı, teknik destek, kripto/airdrop, hesap ele geçirme, ödül tuzağı ve daha
  fazlası. Meşru örnekler de içerir (yanlış alarmı ölçmek için).
- **Kimlik doğrulama & roller** — E-posta/Şifre, Google ve Anonim (misafir)
  girişi. Öğrenci ve **eğitmen (admin)** rolleri.
- **Eğitmen paneli** (`/yonetici`) — sınıf geneli doğruluk, **en çok hata
  yapılan saldırı türü**, kaçırılan tehditler, öğrenci sıralaması ve son oturumlar.
- **Oyunlaştırma** — puan, hız bonusu, seri (combo) çarpanı, XP ve 8 kademeli
  seviye sistemi. 4 oyun modu (Hızlı, Standart, Maraton, Odaklı).
- **Anlık öğretici geri bildirim** — her senaryodan sonra "kırmızı bayraklar"
  ve güven veren işaretler gerekçeleriyle listelenir.
- **Bireysel analitik** — kanal ve taktik bazında doğruluk, gözden kaçan
  tehditler (false negative) ve kişiye özel öneriler.
- **Erişilebilirlik** — klavye ile oynama (`1`/`2` yanıt, `Enter` ilerle),
  "içeriğe geç" bağlantısı, görünür odak halkaları, `prefers-reduced-motion`
  desteği, ARIA etiketleri ve tam responsive (mobil hamburger menü) tasarım.
- **Marka** — özel favicon ve dinamik Open Graph (sosyal paylaşım) görseli.

---

## 🧠 Mimari Kararı: İki Modlu Veri Katmanı

Veri katmanı (`lib/db.ts`) **soyutlanmıştır** ve iki modu şeffaf destekler:

- **Bulut modu** — Firebase ortam değişkenleri tanımlıysa: Firebase Auth +
  Firestore. İlerleme buluta kaydolur, her cihazdan erişilir, eğitmen paneli
  gerçek sınıf verisini toplar.
- **Yerel mod** — anahtarlar yoksa: otomatik olarak `localStorage`.

Bu sayede uygulama **Firebase yapılandırılmadan da eksiksiz çalışır** ve
production'a sorunsuz deploy edilebilir. Kod tarafı hangi modda olduğunu bilmez;
yalnızca `loadProfile` / `commitSession` / `loadClassOverview` çağırır.

---

## 🧱 Teknoloji Yığını

| Katman        | Teknoloji                              |
| ------------- | -------------------------------------- |
| Framework     | **Next.js 14** (App Router)            |
| Dil           | **TypeScript** (strict)                |
| Stil          | **Tailwind CSS**                       |
| Auth & DB     | **Firebase** (Auth + Firestore)        |
| Fallback      | `localStorage` (soyut veri katmanı)    |
| Grafikler     | Bağımlılıksız özel SVG bileşenleri     |

---

## 🚀 Hızlı Başlangıç

```bash
npm install
npm run dev          # http://localhost:3000  (yerel mod, kurulumsuz çalışır)
```

Gerçek veritabanı + eğitmen paneli için Firebase’i yapılandır:

```bash
cp .env.example .env.local   # Firebase anahtarlarını doldur
```

Ayrıntılı adımlar (Firebase + Vercel deploy) → **[DEPLOYMENT.md](DEPLOYMENT.md)**.

Diğer komutlar:

```bash
npm run build        # production derlemesi
npm start            # production sunucusu
npm run typecheck    # TypeScript kontrolü
npm run lint         # ESLint
```

---

## 📁 Proje Yapısı

```
app/
  layout.tsx            # Kök layout + Providers + meta + OG
  page.tsx              # Ana sayfa (landing)
  simulasyon/           # Oyun akışı (AuthGate ile korumalı)
  rapor/                # Kişisel analitik panel (korumalı)
  yonetici/             # Eğitmen paneli (admin korumalı)
  rehber/               # Güvenlik rehberi
  icon.svg              # Favicon
  opengraph-image.tsx   # Dinamik OG görseli
components/
  AuthProvider.tsx      # Kimlik doğrulama context'i (bulut + yerel)
  AuthPanel.tsx         # Giriş/kayıt/misafir arayüzü
  AuthGate.tsx          # Korumalı sayfa sarmalayıcı (admin desteği)
  GameClient.tsx        # Oyun motoru (kurulum → oynama → sonuç) + klavye
  ScenarioViewer.tsx    # E-posta / SMS / Arama görünümleri
  FeedbackPanel.tsx     # Cevap sonrası öğretici geri bildirim
  ResultsScreen.tsx     # Oturum sonu analiz ekranı
  ReportClient.tsx      # Kişisel kalıcı rapor paneli
  AdminClient.tsx       # Sınıf geneli eğitmen paneli
  SiteNav / SiteFooter  # Auth-farkında, responsive gezinme
  ui.tsx / Icons.tsx    # Paylaşılan UI bileşenleri ve ikonlar
lib/
  types.ts              # Alan modeli (senaryo, oturum, kullanıcı, sınıf)
  scenarios.ts          # 42 senaryoluk veri seti (içeriğin kalbi)
  tactics.ts            # Taktik & kanal meta verisi
  game.ts               # Puanlama, seviye, senaryo seçimi
  report.ts             # Bireysel analitik / öneri motoru
  firebase.ts           # Firebase başlatma (config guard)
  db.ts                 # Birleşik veri katmanı (bulut + yerel)
firestore.rules         # Firestore güvenlik kuralları
firestore.indexes.json  # Bileşik dizin tanımı
```

---

## 🔐 Roller

Bir kullanıcı, e-postası `NEXT_PUBLIC_ADMIN_EMAILS` listesindeyse **eğitmen
(admin)** olur; aksi halde **öğrenci**. Eğitmenler `/yonetici` panelini görür.
Güvenlik kuralları da aynı e-posta listesini kullanır (bkz. `firestore.rules`).

---

## 🧩 Yeni Senaryo Eklemek

`lib/scenarios.ts` içindeki `SCENARIOS` dizisine yeni bir `Scenario` nesnesi
ekle. Kanala göre `email` / `sms` / `voice` alanını doldur; `verdict`,
`tactics`, `flags`, `explanation`, `takeaway` alanlarını belirt. Senaryo otomatik
olarak modlara, seçim havuzuna ve tüm analitiğe dahil olur.

---

## 📜 Sorumluluk Reddi

Eğitim amaçlı bir demodur. İçerikteki tüm marka, kurum ve senaryolar kurgusaldır.
