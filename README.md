# PhishGuard

Oltalama (phishing), SMS dolandırıcılığı (smishing) ve telefon dolandırıcılığı
(vishing) saldırılarına karşı farkındalığı ölçen ve geliştiren, oyunlaştırılmış
bir web uygulaması. Kullanıcıya sırayla gerçekçi e-posta, SMS ve arama dökümü
senaryoları sunulur; kullanıcı her birinin zararlı mı yoksa güvenli mi olduğuna
karar verir. Sistem, hangi saldırı türlerinde daha çok hata yapıldığını hem
bireysel hem de sınıf düzeyinde raporlar.

## Özellikler

- Üç kanal: e-posta, SMS ve sesli arama senaryoları
- 42 senaryo; her biri zorluk, taktik ve gerekçelendirilmiş uyarı işaretleriyle
- Anlık geri bildirim: doğru cevap, kırmızı bayraklar ve kısa açıklama
- Puan, seri, deneyim puanı ve seviye sistemi
- Bireysel rapor: kanal ve taktik bazında doğruluk, zayıf yönler, öneriler
- Eğitmen paneli: sınıf geneli başarı ve en çok hata yapılan saldırı türü
- E-posta/parola, misafir ve rol bazlı kimlik doğrulama
- Klavye ile oynanabilirlik ve responsive arayüz

## Teknolojiler

- Next.js 14 (App Router), React, TypeScript
- Tailwind CSS
- Firebase Authentication ve Firestore (yapılandırılmadığında `localStorage`
  ile yerel moda geçer)

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır. Firebase
yapılandırmadan da çalışır; bulut kaydı ve eğitmen paneli için `.env.example`
dosyasını `.env.local` olarak kopyalayıp Firebase değerlerini girin. Ayrıntılı
kurulum ve yayınlama adımları için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın.

Diğer komutlar:

```bash
npm run build      # üretim derlemesi
npm run typecheck  # tip kontrolü
npm run lint
```

## Proje yapısı

```
app/          Sayfalar (ana sayfa, simülasyon, rapor, eğitmen paneli, rehber)
components/   Arayüz bileşenleri ve oyun akışı
lib/          Veri modeli, senaryolar, puanlama, analitik ve veri katmanı
```

## Veri katmanı

Depolama katmanı (`lib/db.ts`) soyutlanmıştır. Firebase ortam değişkenleri
tanımlıysa veriler Firestore'a, tanımlı değilse tarayıcının yerel deposuna
yazılır. Uygulamanın geri kalanı yalnızca `loadProfile`, `commitSession` ve
`loadClassOverview` fonksiyonlarını kullanır; bu sayede depolama teknolojisi
uygulamanın geri kalanından bağımsızdır.

## Not

Uygulamadaki tüm senaryolar kurgusaldır ve yalnızca eğitim amaçlıdır; gerçek
kurum, kişi veya numaraları temsil etmez. Senaryolardaki bağlantılar devre
dışıdır.
