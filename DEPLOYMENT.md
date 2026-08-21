# 🚀 PhishGuard — Kurulum ve Yayınlama (Deploy) Rehberi

Bu rehber, projeyi **Firebase (veritabanı + kimlik doğrulama)** ile canlıya
almanı ve **Vercel** üzerinde yayınlamanı adım adım anlatır.

> Hatırlatma: Firebase yapılandırmazsan uygulama yine de **yerel modda**
> (localStorage) sorunsuz çalışır. Aşağıdaki adımlar, staj sunumu için
> gerçek bir bulut backend + eğitmen paneli isteyenler içindir.

---

## 1) Firebase Projesi Oluştur

1. [console.firebase.google.com](https://console.firebase.google.com) → **Proje ekle**.
2. Proje adı: örn. `phishguard`. (Google Analytics opsiyonel, kapatabilirsin.)
3. Proje açıldıktan sonra sol üstte **</> (Web)** simgesine tıkla, uygulamaya
   bir takma ad ver (örn. `phishguard-web`) ve kaydet.
4. Firebase sana bir **yapılandırma nesnesi** verir:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "phishguard-xxxx.firebaseapp.com",
     projectId: "phishguard-xxxx",
     storageBucket: "phishguard-xxxx.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123",
   };
   ```
   Bu değerleri birazdan `.env.local` dosyasına gireceksin.

---

## 2) Authentication (Kimlik Doğrulama) Aç

Firebase Console → **Build > Authentication > Get started**. Ardından
**Sign-in method** sekmesinden şu sağlayıcıları **etkinleştir**:

- ✅ **E-posta/Şifre** (Email/Password)
- ✅ **Anonim** (Anonymous) — “Misafir olarak dene” için
- ✅ **Google** (opsiyonel ama önerilir)

---

## 3) Firestore Veritabanı Oluştur

1. **Build > Firestore Database > Create database**.
2. Konum seç (örn. `eur3` veya sana yakın bir bölge).
3. Başlangıçta **production mode** seç (kuralları biz vereceğiz).

### Güvenlik kurallarını yükle

`firestore.rules` dosyasının içeriğini Firestore **Rules** sekmesine yapıştır.
**Önemli:** Dosyadaki `isAdmin()` fonksiyonundaki e-posta listesine kendi
eğitmen e-postanı ekle (küçük harf):

```
request.auth.token.email.lower() in [
  'senin-eposta@ornek.com'
]
```

Sonra **Publish**.

### Dizin (index) oluştur

`firestore.indexes.json` bir bileşik dizin tanımlar (sessions: uid + finishedAt).
İki yol:

- **Kolay yol:** Uygulamayı çalıştır, bir oturum tamamla; Firestore ilk sorguda
  konsola bir “create index” bağlantısı yazar, ona tıkla.
- **CLI ile:** `firebase deploy --only firestore:indexes`

---

## 4) Ortam Değişkenlerini Ayarla (Yerel)

```bash
cp .env.example .env.local
```

`.env.local` dosyasını 1. adımdaki değerlerle doldur:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phishguard-xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phishguard-xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phishguard-xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
NEXT_PUBLIC_ADMIN_EMAILS=senin-eposta@ornek.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Test et:

```bash
npm run dev
```

Artık giriş ekranında e-posta/Google seçenekleri görünmeli ve verilerin
Firestore’a yazılmalı. Admin e-postanla girince menüde **Yönetici** sekmesi çıkar.

---

## 5) Vercel’de Yayınla

1. Projeyi bir GitHub deposuna gönder:
   ```bash
   git init && git add -A && git commit -m "PhishGuard"
   # GitHub'da boş bir repo açıp:
   git remote add origin https://github.com/KULLANICI/phishguard.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New > Project** → GitHub deponu içe aktar.
3. Framework otomatik **Next.js** algılanır. **Environment Variables** bölümüne
   `.env.local`’daki tüm `NEXT_PUBLIC_*` değişkenlerini ekle.
   - `NEXT_PUBLIC_SITE_URL` değerini Vercel’in vereceği adrese güncelle
     (örn. `https://phishguard.vercel.app`).
4. **Deploy**. Birkaç dakika içinde canlı linkin hazır.

### Deploy sonrası: Firebase’e alan adını ekle

Firebase Console → **Authentication > Settings > Authorized domains** →
Vercel alan adını (`phishguard.vercel.app`) **ekle**. Aksi halde Google girişi
canlıda çalışmaz.

---

## 6) Kendini Yönetici (Eğitmen) Yap

Admin, e-posta allowlist’i ile belirlenir:

1. `NEXT_PUBLIC_ADMIN_EMAILS` (Vercel env) → e-postanı ekle.
2. `firestore.rules` içindeki `isAdmin()` listesine **aynı e-postayı** ekle ve
   yeniden yayınla (Firestore’un admin okumalarına izin vermesi için).

Bu e-postayla giriş yapınca **/yonetici** paneli açılır.

## 7) İncelemeci (Hoca) İçin Tek Tıkla Demo Eğitmen Girişi

İnceleyen kişinin (ör. hoca) e-posta/parola ile uğraşmaması için giriş
ekranında **“Demo eğitmen olarak gir”** butonu vardır. Kurulumu:

1. Firebase Console → **Authentication > Users > Add user** ile bir demo hesabı
   oluştur (ör. e-posta `demo-egitmen@phishguard.app`, güçlü bir parola).
2. Vercel ortam değişkenlerine ekle:
   - `NEXT_PUBLIC_DEMO_EMAIL` = demo hesabının e-postası
   - `NEXT_PUBLIC_DEMO_PASSWORD` = demo hesabının parolası
3. Bu demo e-postasını **hem** `NEXT_PUBLIC_ADMIN_EMAILS`’e **hem de**
   `firestore.rules` içindeki `isAdmin()` listesine ekle, kuralları yeniden
   yayınla. Redeploy et.

Artık incelemeci linke girip **tek tıkla** eğitmen panelini görür; hiçbir şey
yazmaz. (Bu, yalnızca demo verisi gören düşük yetkili bir hesaptır; parolanın
istemci paketinde görünmesi demo için kabul edilebilir.) Panelin dolu görünmesi
için deploy sonrası birkaç tur **Misafir olarak** oynayın — bu oturumlar gerçek
Firestore’a yazılır ve eğitmen panelinde toplanır.

---

## Sık Karşılaşılan Sorunlar

| Belirti | Çözüm |
| --- | --- |
| Giriş ekranı hâlâ “yerel mod” diyor | `.env.local` eksik/yanlış; sunucuyu yeniden başlat. |
| Google girişi canlıda hata veriyor | Vercel alan adını Firebase **Authorized domains**’e ekle. |
| Yönetici paneli boş / izin hatası | Admin e-postan `firestore.rules`’ta yok; ekleyip Publish et. |
| “The query requires an index” | Konsoldaki bağlantıya tıkla veya `firebase deploy --only firestore:indexes`. |

---

## Alternatif: MongoDB

Firebase yerine MongoDB tercih edersen, veri katmanı soyut olduğu için yalnızca
`lib/db.ts` içindeki `cloud*` fonksiyonlarını Next.js Route Handler’ları
(`app/api/.../route.ts`) + MongoDB istemcisiyle değiştirmen yeterlidir.
Auth için `next-auth` kullanılabilir. Tip sözleşmesi (`Profile`, `SessionRecord`,
`ClassOverview`) aynı kalır; arayüzde değişiklik gerekmez.
