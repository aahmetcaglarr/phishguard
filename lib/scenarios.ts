import type { Scenario } from "./types";

// Kurgusal senaryolar; gerçek kurum, kişi veya numara temsil etmez.

export const SCENARIOS: Scenario[] = [
  // E-posta
  {
    id: "eml-01",
    channel: "email",
    verdict: "phishing",
    difficulty: "kolay",
    tactics: ["kurum-taklidi", "aciliyet", "kimlik-avi", "kotu-baglanti"],
    title: "Banka: Hesabınız askıya alındı",
    email: {
      fromName: "Garanti BBVA Güvenlik",
      fromAddress: "guvenlik@garanti-bbva-tr.info",
      to: "siz@ornek.com",
      subject: "ACİL: Hesabınız 24 saat içinde kapatılacaktır!",
      date: "Bugün 03:14",
      bodyHtml: `
        <p>Değerli Müşterimiz,</p>
        <p>Hesabınızda <b>olağandışı bir hareket</b> tespit edilmiştir. Güvenliğiniz için hesabınız geçici olarak askıya alınmıştır.</p>
        <p><b>24 saat</b> içinde kimliğinizi doğrulamazsanız hesabınız kalıcı olarak kapatılacaktır.</p>
        <p><a href="#">▶ Hesabımı Şimdi Doğrula</a></p>
        <p>Saygılarımızla,<br/>Garanti Güvenlik Ekibi</p>`,
    },
    explanation:
      "Bankalar hesabınızı e-postadaki bir bağlantıdan ‘doğrulamanızı’ istemez. Gönderen adresi resmî alan adı (garantibbva.com.tr) değil, taklit bir ‘garanti-bbva-tr.info’ adresidir.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘garanti-bbva-tr.info’ resmî bir banka alan adı değildir.",
      },
      {
        kind: "danger",
        label: "Yapay aciliyet",
        detail: "‘24 saat içinde kapatılacak’ ifadesi panik yaratmak içindir.",
      },
      {
        kind: "danger",
        label: "Gece saatinde gönderim",
        detail: "03:14 gibi bir saatte gelen ‘resmî’ bildirim şüphelidir.",
      },
      {
        kind: "danger",
        label: "Genel hitap",
        detail: "Bankanız adınızı bilir; ‘Değerli Müşterimiz’ jenerik bir tuzaktır.",
      },
    ],
    takeaway:
      "Banka bildirimlerini her zaman resmî uygulama veya doğrudan yazdığınız web adresinden kontrol edin, e-postadaki linke asla tıklamayın.",
  },
  {
    id: "eml-02",
    channel: "email",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "GitHub: Yeni cihaz girişi",
    email: {
      fromName: "GitHub",
      fromAddress: "noreply@github.com",
      to: "siz@ornek.com",
      subject: "[GitHub] A new device signed in to your account",
      date: "Bugün 10:22",
      bodyHtml: `
        <p>Hey there,</p>
        <p>Your GitHub account was just signed in to from a new device. We're letting you know just in case.</p>
        <ul>
          <li><b>Cihaz:</b> Chrome, Windows</li>
          <li><b>Konum:</b> Istanbul, TR (yaklaşık)</li>
          <li><b>Zaman:</b> 28 Tem 2026 10:21 (+03)</li>
        </ul>
        <p>If this was you, you can ignore this email. If this wasn't you, review your security settings from github.com.</p>
        <p>Thanks,<br/>The GitHub Team</p>`,
    },
    explanation:
      "Meşru bir güvenlik bildirimi. Gönderen resmî ‘noreply@github.com’ adresidir, sizi bir linke tıklayıp parola girmeye zorlamaz — aksine kendi başınıza github.com’a gidip kontrol etmenizi söyler.",
    flags: [
      {
        kind: "safe",
        label: "Resmî alan adı",
        detail: "‘@github.com’ doğrulanabilir gerçek gönderendir.",
      },
      {
        kind: "safe",
        label: "Baskı yok",
        detail: "Aciliyet veya tehdit içermez; ‘bu sizseniz görmezden gelin’ der.",
      },
      {
        kind: "safe",
        label: "Kendi kanalına yönlendirir",
        detail: "Linke tıklatmak yerine ‘github.com üzerinden kontrol et’ der.",
      },
    ],
    takeaway:
      "Meşru bildirimler sizden bilgi istemez; yalnızca haber verir ve kendi resmî kanalınızdan kontrol etmenizi önerir.",
  },
  {
    id: "eml-03",
    channel: "email",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["otorite-baskisi", "para-transferi", "sahte-gonderen"],
    title: "CEO: Acil ödeme talebi",
    email: {
      fromName: "Ahmet Yılmaz (Genel Müdür)",
      fromAddress: "ahmet.yilmaz@sirket-tr.com",
      to: "muhasebe@ornek.com",
      subject: "Acil - gizli işlem",
      date: "Bugün 16:45",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>Şu an bir toplantıdayım, telefonla ulaşamayacağım. Bir tedarikçiye acil ödeme yapmamız gerekiyor ve bu işi bugün kapatmam lazım.</p>
        <p>Aşağıdaki IBAN'a <b>48.500 TL</b> gönderebilir misin? Dekontu bana ilet, detayları sonra açıklarım. Lütfen bu konuyu şimdilik kimseyle paylaşma.</p>
        <p>IBAN: TR55 0006 2000 0000 0123 4567 89</p>
        <p>Teşekkürler,<br/>Ahmet</p>`,
    },
    explanation:
      "Klasik CEO (yönetici) dolandırıcılığı. Şirketinizin gerçek alan adı ‘@ornek.com’ iken gönderen ‘@sirket-tr.com’ benzeri sahte bir adres. Gizlilik ve aciliyet vurgusu, çalışanı doğrulama yapmadan para göndermeye iter.",
    flags: [
      {
        kind: "danger",
        label: "Uyuşmayan alan adı",
        detail: "Şirket alanı ‘@ornek.com’ değil ‘@sirket-tr.com’ — taklit.",
      },
      {
        kind: "danger",
        label: "Gizlilik isteği",
        detail: "‘Kimseyle paylaşma’ ifadesi doğrulamayı engellemek içindir.",
      },
      {
        kind: "danger",
        label: "Ulaşılamazlık bahanesi",
        detail: "‘Toplantıdayım, arayamam’ diyerek sesli teyidi engeller.",
      },
      {
        kind: "danger",
        label: "Acil para transferi",
        detail: "Yeni bir IBAN'a acil, yüksek tutarlı ödeme talebi.",
      },
    ],
    takeaway:
      "Para transferi taleplerini her zaman ikinci bir kanaldan (telefonla arayarak) teyit edin; ‘gizli tut’ diyen her istek şüphelidir.",
  },
  {
    id: "eml-04",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "ek-dosya", "kotu-baglanti"],
    title: "Kargo: Teslimat başarısız",
    email: {
      fromName: "Yurtiçi Kargo",
      fromAddress: "bilgi@yurtici-kargo-takip.com",
      to: "siz@ornek.com",
      subject: "Paketiniz teslim edilemedi — adres güncellemesi gerekli",
      date: "Dün 14:03",
      bodyHtml: `
        <p>Sayın Müşterimiz,</p>
        <p>2 kez teslimat denememiz başarısız oldu. Paketiniz depoya geri dönmüştür.</p>
        <p>Teslimatı yeniden planlamak için ekteki formu doldurun veya bağlantıya tıklayın:</p>
        <p><a href="#">Teslimatı Yeniden Planla</a></p>
        <p>Not: 0,99 TL kargo yeniden gönderim ücreti alınacaktır.</p>`,
      hasAttachment: true,
      attachmentName: "Teslimat_Formu.html",
    },
    explanation:
      "Kargo temalı oltalama çok yaygındır. ‘.html’ uzantılı ek genelde sahte bir giriş/kart formu içerir. Küçük bir ücret (0,99 TL) istemek, kart bilgilerinizi girdirmek içindir.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘yurtici-kargo-takip.com’ resmî ‘yurticikargo.com’ değildir.",
      },
      {
        kind: "danger",
        label: "Şüpheli HTML eki",
        detail: ".html ekleri tarayıcıda açılan sahte formlar barındırır.",
      },
      {
        kind: "danger",
        label: "Küçük ücret bahanesi",
        detail: "‘0,99 TL’ ödeme, kart bilgisi toplamak için bir tuzaktır.",
      },
    ],
    takeaway:
      "Kargo takibini yalnızca firmanın resmî uygulaması veya sitesindeki takip numarasıyla yapın; e-postadaki ekleri açmayın.",
  },
  {
    id: "eml-05",
    channel: "email",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "e-Devlet: Randevu hatırlatma",
    email: {
      fromName: "e-Devlet Kapısı",
      fromAddress: "bilgilendirme@turkiye.gov.tr",
      to: "siz@ornek.com",
      subject: "Randevu Hatırlatması: Nüfus Müdürlüğü",
      date: "Bugün 09:00",
      bodyHtml: `
        <p>Sayın vatandaşımız,</p>
        <p>29 Temmuz 2026 tarihinde saat 11:30'da almış olduğunuz randevuyu hatırlatmak isteriz.</p>
        <p>Randevu detaylarınızı ve iptal seçeneğini e-Devlet Kapısı'na (turkiye.gov.tr) giriş yaparak görüntüleyebilirsiniz.</p>
        <p>Bu bir bilgilendirme mesajıdır, yanıtlamayınız.</p>`,
    },
    explanation:
      "Meşru bir hatırlatma. Resmî ‘@turkiye.gov.tr’ alan adından gelir, hiçbir parola/link ile giriş istemez ve işlemi kendiniz e-Devlet’e girerek yapmanızı söyler.",
    flags: [
      {
        kind: "safe",
        label: "Resmî devlet alan adı",
        detail: "‘@turkiye.gov.tr’ doğrulanabilir resmî adrestir.",
      },
      {
        kind: "safe",
        label: "Bilgi istemez",
        detail: "TC kimlik, parola veya kart bilgisi talep etmez.",
      },
      {
        kind: "safe",
        label: "Kendi kanalına yönlendirir",
        detail: "Doğrudan turkiye.gov.tr’ye girmenizi söyler, link vermez.",
      },
    ],
    takeaway:
      "Resmî bildirimler genelde işlem için ‘kendiniz siteye girin’ der; içine gömülü bir giriş bağlantısı ısrarla dayatmaz.",
  },
  {
    id: "eml-06",
    channel: "email",
    verdict: "phishing",
    difficulty: "kolay",
    tactics: ["odul-tuzagi", "kotu-baglanti", "veri-sizintisi"],
    title: "iPhone kazandınız!",
    email: {
      fromName: "Apple Ödül Merkezi",
      fromAddress: "reward@apple-cekilis2026.net",
      to: "siz@ornek.com",
      subject: "🎉 Tebrikler! iPhone 16 Pro kazandınız",
      date: "Bugün 12:31",
      bodyHtml: `
        <p>TEBRİKLER!</p>
        <p>E-posta adresiniz aylık çekilişimizde <b>iPhone 16 Pro</b> kazanan olarak seçildi!</p>
        <p>Ödülünüzü almak için bilgilerinizi doğrulayın: ad, adres, TC kimlik ve kart bilgisi (kargo için).</p>
        <p><a href="#">Ödülümü Talep Et →</a></p>
        <p>Bu fırsat yalnızca 2 saat geçerlidir!</p>`,
    },
    explanation:
      "Klasik ödül tuzağı. Katılmadığınız bir çekilişi kazanamazsınız. ‘Kargo için kart bilgisi’ istemek doğrudan dolandırıcılıktır; meşru hiçbir hediye kart numaranızı gerektirmez.",
    flags: [
      {
        kind: "danger",
        label: "Katılmadığınız çekiliş",
        detail: "Girmediğiniz bir yarışmayı kazanmanız mümkün değildir.",
      },
      {
        kind: "danger",
        label: "Kart bilgisi talebi",
        detail: "‘Kargo için’ kart numarası istemek dolandırıcılıktır.",
      },
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘apple-cekilis2026.net’ Apple ile ilgisizdir.",
      },
    ],
    takeaway:
      "Bir ödül için kart bilgisi veya TC kimlik isteniyorsa, bu %100 dolandırıcılıktır — hediyeler ödeme gerektirmez.",
  },
  {
    id: "eml-07",
    channel: "email",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["kurum-taklidi", "kimlik-avi", "kotu-baglanti"],
    title: "Microsoft 365: Parola süresi doldu",
    email: {
      fromName: "Microsoft 365",
      fromAddress: "account-security@microsoftonline-secure.com",
      to: "siz@ornek.com",
      subject: "Parolanızın süresi bugün doluyor",
      date: "Bugün 08:12",
      bodyHtml: `
        <p>Merhaba siz@ornek.com,</p>
        <p>Kuruluş politikası gereği parolanızın süresi <b>bugün</b> doluyor. Aynı parolayı korumak için aşağıdaki bağlantıdan oturumunuzu doğrulayın.</p>
        <p><a href="#">Parolamı Koru (aynı parolayı sakla)</a></p>
        <p>Doğrulama yapılmazsa hesabınıza erişim askıya alınır.</p>
        <p>Microsoft 365 Yönetim</p>`,
    },
    explanation:
      "İkna edici ama sahte. ‘microsoftonline-secure.com’ resmî ‘microsoftonline.com’ değildir — sona eklenen kelimeyle güven verilmeye çalışılır. ‘Aynı parolayı korumak için giriş yap’ mantığı, parolanızı bir sahte sayfaya girdirmek içindir.",
    flags: [
      {
        kind: "danger",
        label: "Benzer (typosquatting) alan adı",
        detail: "‘microsoftonline-secure.com’ resmî değildir, güven kelimesi eklenmiş.",
      },
      {
        kind: "danger",
        label: "Mantıksız istek",
        detail: "‘Aynı parolayı korumak için giriş yap’ diye bir işlem yoktur.",
      },
      {
        kind: "danger",
        label: "Askıya alma tehdidi",
        detail: "Erişim kesme tehdidiyle aciliyet oluşturur.",
      },
    ],
    takeaway:
      "Alan adının sonuna ‘-secure’, ‘-login’, ‘-verify’ gibi kelimeler eklenmesi klasik bir taklit yöntemidir; adresin tamamını dikkatle okuyun.",
  },
  {
    id: "eml-08",
    channel: "email",
    verdict: "legit",
    difficulty: "zor",
    tactics: [],
    title: "LinkedIn: Fatura makbuzu",
    email: {
      fromName: "LinkedIn",
      fromAddress: "billing@linkedin.com",
      to: "siz@ornek.com",
      subject: "Your LinkedIn Premium receipt",
      date: "Dün 18:40",
      bodyHtml: `
        <p>Hi,</p>
        <p>Thanks for your LinkedIn Premium Career subscription. Here is your receipt for this month.</p>
        <ul>
          <li>Plan: Premium Career</li>
          <li>Amount: $39.99</li>
          <li>Payment method: Visa ****4021</li>
        </ul>
        <p>You can view invoices anytime under Settings &gt; Subscriptions on linkedin.com.</p>
        <p>The LinkedIn Team</p>`,
    },
    explanation:
      "Meşru bir makbuz. Bir aboneliğiniz varsa bu beklenen bir e-postadır. Gönderen resmî ‘@linkedin.com’, hiçbir bağlantıya tıklama zorunluluğu yok ve son 4 hane dışında kart bilgisi göstermez.",
    flags: [
      {
        kind: "safe",
        label: "Resmî alan adı",
        detail: "‘@linkedin.com’ gerçek gönderendir.",
      },
      {
        kind: "safe",
        label: "Yalnızca son 4 hane",
        detail: "Kartın tam numarasını istemez/göstermez — güvenli uygulama.",
      },
      {
        kind: "safe",
        label: "Beklenen işlem",
        detail: "Var olan bir aboneliğin makbuzu, aciliyet/tehdit yok.",
      },
    ],
    takeaway:
      "Bir makbuz sizden yeni bilgi istemiyor, yalnızca zaten yaptığınız bir işlemi özetliyorsa büyük olasılıkla meşrudur.",
  },
  {
    id: "eml-09",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "kimlik-avi", "aciliyet"],
    title: "GİB: Vergi iadesi hazır",
    email: {
      fromName: "Gelir İdaresi Başkanlığı",
      fromAddress: "iade@gib-vergi-iade.org",
      to: "siz@ornek.com",
      subject: "1.240 TL vergi iadeniz onaylandı",
      date: "Bugün 11:15",
      bodyHtml: `
        <p>Sayın mükellef,</p>
        <p>2025 yılına ait <b>1.240,00 TL</b> vergi iadeniz onaylanmıştır. İadeyi hesabınıza aktarmak için banka bilgilerinizi doğrulayın.</p>
        <p><a href="#">İademi Al</a></p>
        <p>İşlem 48 saat içinde tamamlanmazsa iade iptal edilir.</p>`,
    },
    explanation:
      "GİB iade işlemlerini e-posta üzerinden banka bilgisi doğrulatarak yapmaz. Alan adı ‘gib-vergi-iade.org’ resmî ‘gib.gov.tr’ değildir. ‘Para vereceğiz ama önce bilgini doğrula’ kalıbı klasik bir tuzaktır.",
    flags: [
      {
        kind: "danger",
        label: "Sahte kurum adresi",
        detail: "Resmî GİB adresi ‘gib.gov.tr’dir, ‘.org’ değil.",
      },
      {
        kind: "danger",
        label: "Banka bilgisi doğrulama",
        detail: "Para iadesi için banka/kart bilgisi ‘doğrulatma’ tuzaktır.",
      },
      {
        kind: "danger",
        label: "İptal tehdidiyle aciliyet",
        detail: "‘48 saat’ süresi acele ettirmek içindir.",
      },
    ],
    takeaway:
      "Devlet kurumları para iadesini e-Devlet üzerinden yürütür; e-postayla banka bilgisi ‘doğrulatan’ her mesaj sahtedir.",
  },
  {
    id: "eml-10",
    channel: "email",
    verdict: "legit",
    difficulty: "kolay",
    tactics: [],
    title: "Şirket İK: Yıllık izin onayı",
    email: {
      fromName: "İnsan Kaynakları",
      fromAddress: "ik@ornek.com",
      to: "siz@ornek.com",
      subject: "İzin talebiniz onaylandı",
      date: "Bugün 15:20",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>4–8 Ağustos tarihleri arasındaki yıllık izin talebiniz yöneticiniz tarafından onaylanmıştır.</p>
        <p>Detayları İK portalındaki (ornek.com/ik) hesabınızdan görebilirsiniz. Herhangi bir sorunuz olursa bu e-postayı yanıtlayabilirsiniz.</p>
        <p>İyi çalışmalar,<br/>İK Ekibi</p>`,
    },
    explanation:
      "Meşru bir iç yazışma. Gönderen sizin şirketinizin gerçek alan adı ‘@ornek.com’, içerik beklenen bir işleme (izin talebi) yanıt ve hiçbir gizli/aciliyet baskısı yok.",
    flags: [
      {
        kind: "safe",
        label: "Kendi şirket alan adı",
        detail: "Gönderen gerçek iç alan adınız ‘@ornek.com’.",
      },
      {
        kind: "safe",
        label: "Beklenen bağlam",
        detail: "Sizin başlattığınız bir izin talebine yanıt.",
      },
      {
        kind: "safe",
        label: "Baskı yok",
        detail: "Aciliyet, tehdit veya bilgi talebi içermez.",
      },
    ],
    takeaway:
      "Gönderen adresi tam olarak kurumunuzun alan adıyla eşleşiyor ve içerik beklediğiniz bir işlemse, güven düzeyi yüksektir — yine de ekleri dikkatli açın.",
  },
  {
    id: "eml-11",
    channel: "email",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["sahte-gonderen", "ek-dosya", "kotu-baglanti"],
    title: "Fatura: Ödenmemiş bakiye",
    email: {
      fromName: "Muhasebe - Tedarik A.Ş.",
      fromAddress: "muhasebe@tedarik-as.com",
      to: "siz@ornek.com",
      subject: "RE: RE: Ödenmemiş Fatura #INV-90233",
      date: "Bugün 13:47",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>Aşağıdaki yazışmamıza istinaden vadesi geçen faturanızı ekte bulabilirsiniz. Lütfen ivedilikle ödeme yapınız.</p>
        <p>Ekli belgeyi açmak için makroları etkinleştirmeniz gerekebilir.</p>
        <hr/>
        <p style="color:#888">&gt; 12 Tem: Sayın yetkili, ödemeniz beklenmektedir...</p>`,
      hasAttachment: true,
      attachmentName: "Fatura_INV-90233.docm",
    },
    explanation:
      "‘RE: RE:’ ile eski bir yazışma gibi gösterilmiş sahte bir konu. ‘.docm’ makro içeren bir Word dosyasıdır ve ‘makroları etkinleştir’ talebi, zararlı yazılım çalıştırmanızı ister. Meşru faturalar makro etkinleştirme gerektirmez.",
    flags: [
      {
        kind: "danger",
        label: "Makro etkinleştirme isteği",
        detail: "‘Makroları etkinleştir’ = zararlı kod çalıştırma tuzağı.",
      },
      {
        kind: "danger",
        label: ".docm eki",
        detail: "Makro içerebilen dosya türü; faturalar için gereksiz.",
      },
      {
        kind: "danger",
        label: "Sahte yazışma zinciri",
        detail: "‘RE: RE:’ ile tanıdık görünüm oluşturulmuş.",
      },
    ],
    takeaway:
      "Hiçbir meşru belge sizden ‘makroları etkinleştirmenizi’ istemez; bu istek görüldüğü an dosyayı kapatın.",
  },
  {
    id: "eml-12",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "kimlik-avi", "kotu-baglanti"],
    title: "Netflix: Ödeme reddedildi",
    email: {
      fromName: "Netflix",
      fromAddress: "info@netflix-odeme-guncelle.com",
      to: "siz@ornek.com",
      subject: "Ödeme bilginizi güncelleyin - üyeliğiniz duraklatıldı",
      date: "Dün 21:10",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>Son ödemeniz alınamadı ve üyeliğiniz duraklatıldı. Yayına devam etmek için ödeme yönteminizi güncelleyin.</p>
        <p><a href="#">Ödeme Bilgimi Güncelle</a></p>
        <p>Görüşmek üzere,<br/>Netflix Ekibi</p>`,
    },
    explanation:
      "Netflix bildirimleri ‘netflix.com’dan gelir. ‘netflix-odeme-guncelle.com’ sahtedir. Ödeme sorunlarını her zaman uygulamaya/siteye kendiniz giriş yaparak kontrol edin, e-postadaki butona tıklamayın.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘netflix-odeme-guncelle.com’ resmî Netflix değildir.",
      },
      {
        kind: "danger",
        label: "Ödeme güncelleme linki",
        detail: "Kart bilgilerinizi sahte sayfada toplamayı hedefler.",
      },
      {
        kind: "danger",
        label: "Hesap duraklatma",
        detail: "Hizmet kesme tehdidiyle acele ettirir.",
      },
    ],
    takeaway:
      "Abonelik ödeme sorunlarını yalnızca resmî uygulama/siteye kendiniz giriş yaparak çözün.",
  },

  // SMS
  {
    id: "sms-01",
    channel: "sms",
    verdict: "phishing",
    difficulty: "kolay",
    tactics: ["kurum-taklidi", "kotu-baglanti", "aciliyet"],
    title: "Kargo gümrük ücreti",
    sms: {
      sender: "+90 555 012 34 56",
      timestamp: "Bugün 10:03",
      message:
        "PTT: Paketiniz gümrükte bekliyor. 27,50 TL işlem ücreti ödenmezse iade edilecektir. Ödeme: ptt-kargo-odeme.xyz/tr",
    },
    explanation:
      "Resmî kurumlar SMS’i normal bir cep telefonu numarasından değil, kısa isim başlığından (örn. ‘PTT’) gönderir. Bağlantı ‘ptt-kargo-odeme.xyz’ resmî değildir ve küçük bir ücretle kart bilgisi toplamayı hedefler.",
    flags: [
      {
        kind: "danger",
        label: "Kişisel numaradan gönderim",
        detail: "Kurumlar SMS başlığı kullanır, +90 5XX numarasından yazmaz.",
      },
      {
        kind: "danger",
        label: "Şüpheli alan adı",
        detail: "‘.xyz’ uzantılı ‘ptt-kargo-odeme’ sitesi sahtedir.",
      },
      {
        kind: "danger",
        label: "Küçük ücret + iade tehdidi",
        detail: "Düşük ücret, kart girdirmek için bahanedir.",
      },
    ],
    takeaway:
      "Beklemediğiniz bir gümrük/kargo ücreti SMS’ine asla tıklamayın; takibi firmanın resmî uygulamasından yapın.",
  },
  {
    id: "sms-02",
    channel: "sms",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "kimlik-avi", "aciliyet"],
    title: "Banka OTP uyarısı",
    sms: {
      sender: "BANKA",
      timestamp: "Bugün 19:22",
      message:
        "Hesabinizdan 4.750 TL harcama denemesi yapildi. Siz yapmadiysaniz iptal icin: guvenli-bankam.com/iptal veya gelen SMS kodunu 0850 xxx numarasina iletin.",
    },
    explanation:
      "‘SMS kodunu birine iletin’ diyen HER mesaj dolandırıcılıktır. OTP/doğrulama kodları asla paylaşılmaz. Başlık ‘BANKA’ olsa da başlıklar taklit edilebilir; link ve kod paylaşma isteği kesin tuzaktır.",
    flags: [
      {
        kind: "danger",
        label: "OTP kodu isteme",
        detail: "Doğrulama kodunu iletmenizi isteyen her mesaj sahtedir.",
      },
      {
        kind: "danger",
        label: "Sahte iptal linki",
        detail: "‘guvenli-bankam.com’ gerçek banka alan adı değildir.",
      },
      {
        kind: "danger",
        label: "Korku + aciliyet",
        detail: "‘4.750 TL harcama’ paniğiyle hızlı hareket ettirir.",
      },
    ],
    takeaway:
      "Bankanız dahil hiç kimse SMS doğrulama kodunuzu isteyemez; kodu paylaşmak hesabınızı doğrudan ele geçirtir.",
  },
  {
    id: "sms-03",
    channel: "sms",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "Banka: Harcama bildirimi",
    sms: {
      sender: "AKBANK",
      timestamp: "Bugün 13:14",
      message:
        "Kredi kartinizla MIGROS'ta 342,80 TL harcama yapilmistir. Bilginiz disindaysa 444 25 25'i arayin. Islem no: 5521",
    },
    explanation:
      "Meşru bir harcama bildirimi. Sizden hiçbir bilgi/kod istemez, bir linke tıklatmaz. Sorun varsa kartın arkasındaki resmî numarayı aramanızı söyler. Bilgilendirme amaçlıdır.",
    flags: [
      {
        kind: "safe",
        label: "Bilgi/kod istemez",
        detail: "Yalnızca haber verir; parola veya OTP talebi yok.",
      },
      {
        kind: "safe",
        label: "Link yok",
        detail: "Tıklanacak şüpheli bir bağlantı içermez.",
      },
      {
        kind: "safe",
        label: "Resmî çağrı merkezi",
        detail: "Bilinen bankanın resmî numarasına yönlendirir.",
      },
    ],
    takeaway:
      "Gerçek bildirimler sizi bilgilendirir ve gerekirse resmî çağrı merkezini aramanızı söyler; kod/parola istemez.",
  },
  {
    id: "sms-04",
    channel: "sms",
    verdict: "phishing",
    difficulty: "kolay",
    tactics: ["odul-tuzagi", "kotu-baglanti"],
    title: "Operatör hediye internet",
    sms: {
      sender: "+90 543 998 77 11",
      timestamp: "Dün 16:45",
      message:
        "Tebrikler! Sadakat odulunuz 50 GB internet hazir. Tanimlamak icin: bedava-gb-hediye.com adresine TC kimlik ile giris yapin. Son gun bugun!",
    },
    explanation:
      "Operatörler hediyeleri kendi resmî uygulamalarından tanımlatır, TC kimliğinizi bir web sitesine girdirmez. ‘Son gün bugün’ aciliyeti ve şüpheli alan adı klasik tuzak işaretleridir.",
    flags: [
      {
        kind: "danger",
        label: "TC kimlik talebi",
        detail: "Bir siteye TC kimlik girmek kimlik hırsızlığına yol açar.",
      },
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘bedava-gb-hediye.com’ operatörle ilgisizdir.",
      },
      {
        kind: "danger",
        label: "Aciliyet + ödül",
        detail: "‘Son gün’ + ‘hediye’ birlikte kullanılıyor.",
      },
    ],
    takeaway:
      "Operatör hediyelerini yalnızca resmî uygulamadan tanımlayın; hiçbir kampanya TC kimliğinizi web sitesine girmenizi gerektirmez.",
  },
  {
    id: "sms-05",
    channel: "sms",
    verdict: "legit",
    difficulty: "kolay",
    tactics: [],
    title: "Doktor randevu hatırlatma",
    sms: {
      sender: "MHRS",
      timestamp: "Bugün 08:30",
      message:
        "Randevu hatirlatma: 29.07.2026 14:00 Ic Hastaliklari, Merkez Devlet Hastanesi. Iptal icin mhrs.gov.tr veya ALO 182.",
    },
    explanation:
      "Meşru bir MHRS hatırlatması. Bilgi istemez, yalnızca resmî ‘mhrs.gov.tr’ ve ALO 182’ye yönlendirir. Aciliyet veya tıklama baskısı yoktur.",
    flags: [
      {
        kind: "safe",
        label: "Resmî kısa numara/site",
        detail: "‘mhrs.gov.tr’ ve ‘ALO 182’ bilinen resmî kanallardır.",
      },
      {
        kind: "safe",
        label: "Bilgi talebi yok",
        detail: "TC kimlik, kod veya kart bilgisi istemez.",
      },
      {
        kind: "safe",
        label: "Beklenen bilgi",
        detail: "Sizin aldığınız bir randevunun hatırlatması.",
      },
    ],
    takeaway:
      "Kısa mesaj yalnızca bilgilendiriyor ve resmî ‘.gov.tr’ kanalına yönlendiriyorsa güvenilirdir.",
  },
  {
    id: "sms-06",
    channel: "sms",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["kurum-taklidi", "kimlik-avi", "kotu-baglanti"],
    title: "e-Devlet güvenlik doğrulaması",
    sms: {
      sender: "e-Devlet",
      timestamp: "Bugün 11:58",
      message:
        "e-Devlet: Hesabinizda supheli giris tespit edildi. Dogrulama yapilmazsa hesabiniz kilitlenecek: turkiye-gov-dogrulama.com",
    },
    explanation:
      "Başlık ‘e-Devlet’ olsa da başlıklar taklit edilebilir. Resmî adres ‘turkiye.gov.tr’dir; ‘turkiye-gov-dogrulama.com’ tire ve ek kelimelerle kamufle edilmiş sahte bir sitedir. e-Devlet güvenlik işlemleri SMS linkiyle yapılmaz.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "Resmî adres ‘turkiye.gov.tr’dir; buradaki adres taklittir.",
      },
      {
        kind: "danger",
        label: "Kilitleme tehdidi",
        detail: "‘Hesabınız kilitlenecek’ ile korku yaratır.",
      },
      {
        kind: "danger",
        label: "Taklit edilebilir başlık",
        detail: "SMS başlığı gerçekliği kanıtlamaz; içerik ele verir.",
      },
    ],
    takeaway:
      "SMS başlığı ‘e-Devlet’ bile olsa, linkin alan adının tam olarak ‘turkiye.gov.tr’ olduğunu doğrulamadan tıklamayın.",
  },
  {
    id: "sms-07",
    channel: "sms",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["para-transferi", "sahte-gonderen"],
    title: "Tanıdıktan acil para",
    sms: {
      sender: "+90 501 223 44 55",
      timestamp: "Bugün 20:12",
      message:
        "Selam benim numaram degisti bunu kaydet. Acil bir durum oldu, hemen 3.000 TL gonderebilir misin? Kart sorunum var, iban yollayayim. Kimseye soyleme simdilik.",
    },
    explanation:
      "‘Numaram değişti + acil para + kimseye söyleme’ üçlüsü klasik bir tanıdık taklidi dolandırıcılığıdır. Bilinmeyen numaradan gelen para isteğini mutlaka kişinin bilinen eski numarasından arayarak teyit edin.",
    flags: [
      {
        kind: "danger",
        label: "‘Numaram değişti’ bahanesi",
        detail: "Kimlik doğrulamasını atlatmak için kullanılır.",
      },
      {
        kind: "danger",
        label: "Acil para + gizlilik",
        detail: "‘Kimseye söyleme’ teyidi engellemek içindir.",
      },
      {
        kind: "danger",
        label: "Bilinmeyen numara",
        detail: "Tanıdığınız kişinin kayıtlı numarası değil.",
      },
    ],
    takeaway:
      "Bilinmeyen numaradan gelen acil para isteklerini, kişinin bildiğiniz numarasından sesli arayarak teyit etmeden asla karşılamayın.",
  },
  {
    id: "sms-08",
    channel: "sms",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "İki adımlı doğrulama kodu",
    sms: {
      sender: "Google",
      timestamp: "Bugün 09:47",
      message:
        "G-483920 Google dogrulama kodunuz. Bu kodu kimseyle paylasmayin. Girisi siz yapmadiysaniz parolanizi degistirin.",
    },
    explanation:
      "Meşru bir 2FA kodu. Google bu kodu, giriş yapmayı siz talep ettiğinizde gönderir. Mesajın kendisi güvenlidir; tehlike yalnızca kodu başkasıyla paylaşırsanız oluşur — mesaj da bunu açıkça uyarır.",
    flags: [
      {
        kind: "safe",
        label: "Kodu isteyen yok",
        detail: "Mesaj kodu size verir; sizden bir yere girmenizi istemez.",
      },
      {
        kind: "safe",
        label: "Paylaşmama uyarısı",
        detail: "‘Kimseyle paylaşmayın’ meşru güvenlik uyarısıdır.",
      },
      {
        kind: "safe",
        label: "Beklenen kod",
        detail: "Siz giriş yaptığınızda gelen doğrulama kodu.",
      },
    ],
    takeaway:
      "2FA kodu almak güvenlidir; tehlike yalnızca birinin bu kodu sizden istemesi ve sizin paylaşmanızla başlar.",
  },

  // Sesli arama (vishing)
  {
    id: "vce-01",
    channel: "voice",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["otorite-baskisi", "kurum-taklidi", "veri-sizintisi", "para-transferi"],
    title: "Sahte savcılık araması",
    voice: {
      callerId: "+90 212 000 00 00",
      callerLabel: "Bilinmeyen (Ankara)",
      duration: "02:41",
      transcript: [
        {
          speaker: "arayan",
          text: "İyi günler, İstanbul Cumhuriyet Başsavcılığı’ndan arıyorum. Adınıza kayıtlı bir hat terör örgütü soruşturmasında kullanılmış.",
        },
        { speaker: "siz", text: "Nasıl yani? Benim böyle bir şeyle ilgim yok." },
        {
          speaker: "arayan",
          text: "Panik yapmayın ama gizlilik kararı var, kimseyle konuşamazsınız. Kimliğinizi doğrulamam için TC kimlik ve hesap bilgilerinizi almam gerekiyor.",
        },
        {
          speaker: "arayan",
          text: "Paranızın güvende olması için onu geçici olarak devlet güvence hesabına aktarmanız gerekiyor. Şimdi size bir IBAN vereceğim.",
        },
      ],
    },
    explanation:
      "Klasik ‘sahte savcı/polis’ dolandırıcılığı. Gerçek adli makamlar sizi telefonla arayıp para transferi veya hesap bilgisi istemez, ‘gizlilik kararı, kimseye söyleme’ demez. ‘Devlet güvence hesabı’ diye bir şey yoktur.",
    flags: [
      {
        kind: "danger",
        label: "‘Devlet güvence hesabı’",
        detail: "Böyle bir hesap yoktur; paranızı çalmak için uydurmadır.",
      },
      {
        kind: "danger",
        label: "Gizlilik baskısı",
        detail: "‘Kimseyle konuşamazsınız’ teyidi engellemek içindir.",
      },
      {
        kind: "danger",
        label: "Korku + otorite",
        detail: "Terör soruşturması söylemiyle panik ve itaat yaratır.",
      },
      {
        kind: "danger",
        label: "Bilgi + para talebi",
        detail: "TC kimlik, hesap bilgisi ve para transferi istiyor.",
      },
    ],
    takeaway:
      "Hiçbir savcı/polis sizi arayıp para aktarmanızı veya banka bilgisi vermenizi istemez; böyle bir aramada telefonu kapatıp 155’i kendiniz arayın.",
  },
  {
    id: "vce-02",
    channel: "voice",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["kurum-taklidi", "otorite-baskisi", "kimlik-avi"],
    title: "Sahte banka güvenlik ekibi",
    voice: {
      callerId: "444 00 00",
      callerLabel: "Bankanız gibi görünüyor",
      duration: "03:12",
      transcript: [
        {
          speaker: "arayan",
          text: "Merhaba, bankanızın güvenlik biriminden arıyorum. Kartınızla yurt dışında şüpheli bir işlem denemesi oldu.",
        },
        { speaker: "siz", text: "Ben böyle bir işlem yapmadım." },
        {
          speaker: "arayan",
          text: "Anladım, işlemi hemen iptal edelim. Kimliğinizi doğrulamam için size gelen SMS kodunu okur musunuz? Bir de kart şifrenizi.",
        },
        {
          speaker: "arayan",
          text: "Acele etmeliyiz, işlem 2 dakika içinde onaylanacak, kodu hemen söyleyin.",
        },
      ],
    },
    explanation:
      "Arayan numara bankanınki gibi görünse de (numara sahteciliği/spoofing mümkündür), asıl ele veren şey SMS kodu ve kart şifresi istemesidir. Bankanız bu bilgileri ASLA telefonda istemez.",
    flags: [
      {
        kind: "danger",
        label: "SMS kodu isteme",
        detail: "Banka doğrulama kodunu telefonda asla istemez.",
      },
      {
        kind: "danger",
        label: "Kart şifresi isteme",
        detail: "Şifrenizi hiçbir banka çalışanı sormaz.",
      },
      {
        kind: "danger",
        label: "Zaman baskısı",
        detail: "‘2 dakika’ deyip düşünmenizi engeller.",
      },
      {
        kind: "danger",
        label: "Numara güveni yanıltıcı",
        detail: "Görünen numara taklit edilebilir; kanıt değildir.",
      },
    ],
    takeaway:
      "Telefonda SMS kodu veya kart şifresi isteyen herkes dolandırıcıdır — kapatın ve kartınızın arkasındaki numarayı kendiniz arayın.",
  },
  {
    id: "vce-03",
    channel: "voice",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "Kargo teslimat teyidi",
    voice: {
      callerId: "+90 216 555 12 34",
      callerLabel: "Kurye",
      duration: "00:48",
      transcript: [
        {
          speaker: "arayan",
          text: "Merhaba, Aras Kargo kuryesiyim. Adınıza bir paket var, 15 dakikaya kapınızdayım. Evde misiniz?",
        },
        { speaker: "siz", text: "Evet, evdeyim." },
        {
          speaker: "arayan",
          text: "Harika. Kapı numaranızı teyit edebilir miyim, 12 mi 21 mi? Zili çalınca alırsınız, ödeme yok, gönderici ödemeli.",
        },
        { speaker: "siz", text: "Daire 12, teşekkürler." },
      ],
    },
    explanation:
      "Meşru bir kurye araması. Yalnızca teslimat için gerekli olan kapı numarasını teyit ediyor; hiçbir kart bilgisi, kod, TC kimlik veya ödeme linki istemiyor. Beklediğiniz bir kargo bağlamında olağandır.",
    flags: [
      {
        kind: "safe",
        label: "Yalnızca teslimat bilgisi",
        detail: "Sadece adres/kapı numarası teyidi istiyor.",
      },
      {
        kind: "safe",
        label: "Hassas bilgi istemiyor",
        detail: "Kart, kod veya TC kimlik talebi yok.",
      },
      {
        kind: "safe",
        label: "Ödeme baskısı yok",
        detail: "‘Gönderici ödemeli’ diyor, para istemiyor.",
      },
    ],
    takeaway:
      "Bir arama yalnızca teslimat için gereken minimum bilgiyi istiyor ve hassas veri/ödeme talep etmiyorsa genelde meşrudur.",
  },
  {
    id: "vce-04",
    channel: "voice",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "kimlik-avi", "veri-sizintisi"],
    title: "Sahte teknik destek",
    voice: {
      callerId: "+1 000 555 0199",
      callerLabel: "Yurt dışı numara",
      duration: "04:05",
      transcript: [
        {
          speaker: "arayan",
          text: "Hello, I'm calling from Microsoft technical support. We detected a serious virus on your computer.",
        },
        { speaker: "siz", text: "Bir sorun mu var?" },
        {
          speaker: "arayan",
          text: "Yes, very serious. Please install this remote access tool so I can fix it, and confirm your Windows license and card details.",
        },
        {
          speaker: "arayan",
          text: "If you don't act now, all your files will be deleted permanently.",
        },
      ],
    },
    explanation:
      "Microsoft/Apple sizi arayıp bilgisayarınızda virüs olduğunu söylemez. ‘Uzaktan erişim aracı kur + kart bilgisi ver’ talebi, hem cihazınızı ele geçirir hem paranızı çalar. Yurt dışı numara ve dosya silme tehdidi ek uyarı işaretleridir.",
    flags: [
      {
        kind: "danger",
        label: "İstenmeyen ‘destek’ araması",
        detail: "Microsoft sizi arayıp virüs bildirmez.",
      },
      {
        kind: "danger",
        label: "Uzaktan erişim talebi",
        detail: "Cihazınızın kontrolünü ele geçirmeyi hedefler.",
      },
      {
        kind: "danger",
        label: "Kart bilgisi + tehdit",
        detail: "Ödeme ister ve dosya silmekle korkutur.",
      },
    ],
    takeaway:
      "Sizi arayıp ‘bilgisayarınızda virüs var’ diyen teknik destek her zaman sahtedir; asla uzaktan erişim kurdurmayın.",
  },
  {
    id: "vce-05",
    channel: "voice",
    verdict: "legit",
    difficulty: "zor",
    tactics: [],
    title: "Banka gerçek doğrulama",
    voice: {
      callerId: "444 25 25",
      callerLabel: "Akbank Çağrı Merkezi",
      duration: "01:30",
      transcript: [
        {
          speaker: "arayan",
          text: "İyi günler, Akbank’tan arıyorum. Kartınızla ilgili bir işlemi teyit için aradım. Güvenliğiniz için sizden hiçbir şifre veya SMS kodu istemeyeceğim.",
        },
        { speaker: "siz", text: "Peki, dinliyorum." },
        {
          speaker: "arayan",
          text: "Bugün saat 13:14’te Migros’ta 342 TL’lik bir işlem yaptınız mı? Sadece evet/hayır demeniz yeterli.",
        },
        { speaker: "siz", text: "Evet, ben yaptım." },
        {
          speaker: "arayan",
          text: "Teşekkürler, işlem onaylandı. İyi günler dilerim.",
        },
      ],
    },
    explanation:
      "Meşru bir doğrulama araması. Banka çağrı merkezi işlemi ‘evet/hayır’ ile teyit ediyor, açıkça ‘şifre/SMS kodu istemeyeceğim’ diyor ve hiçbir hassas bilgi talep etmiyor. Emin değilseniz yine de kapatıp resmî numarayı kendiniz arayabilirsiniz.",
    flags: [
      {
        kind: "safe",
        label: "Kod/şifre istemiyor",
        detail: "Açıkça hassas bilgi istemeyeceğini belirtiyor.",
      },
      {
        kind: "safe",
        label: "Sadece evet/hayır",
        detail: "İşlemi basit teyit ile onaylatıyor.",
      },
      {
        kind: "safe",
        label: "Baskı/tehdit yok",
        detail: "Aciliyet, korku veya para talebi içermiyor.",
      },
    ],
    takeaway:
      "Meşru banka aramaları hassas bilgi istemez; yine de tereddüt ederseniz kapatıp resmî numarayı kendiniz aramak en güvenli yoldur.",
  },
  {
    id: "vce-06",
    channel: "voice",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["odul-tuzagi", "para-transferi", "veri-sizintisi"],
    title: "Çekilişten büyük ikramiye",
    voice: {
      callerId: "+90 850 000 00 00",
      callerLabel: "Bilinmeyen",
      duration: "02:20",
      transcript: [
        {
          speaker: "arayan",
          text: "Tebrikler! Bankanızın çekilişinde 250.000 TL kazandınız! Ödülü hesabınıza aktaracağız.",
        },
        { speaker: "siz", text: "Gerçekten mi? Nasıl alacağım?" },
        {
          speaker: "arayan",
          text: "Sadece küçük bir vergi ve işlem masrafı var, 1.500 TL. Bunu yatırırsanız ikramiyeyi hemen gönderiyoruz. Kart bilgilerinizi alabilir miyim?",
        },
      ],
    },
    explanation:
      "‘Önce küçük ödeme yap, büyük ikramiyeyi al’ klasik avans dolandırıcılığıdır. Meşru hiçbir ikramiye, ödemenizi almak için sizden önden para veya kart bilgisi istemez. Kazanmak için para ödemek çelişkinin ta kendisidir.",
    flags: [
      {
        kind: "danger",
        label: "Önden ödeme talebi",
        detail: "İkramiye için ‘vergi/masraf’ istemek dolandırıcılıktır.",
      },
      {
        kind: "danger",
        label: "Katılmadığınız çekiliş",
        detail: "Girmediğiniz bir çekilişi kazanamazsınız.",
      },
      {
        kind: "danger",
        label: "Kart bilgisi isteme",
        detail: "Para almak için kart bilgisi gerekmez.",
      },
    ],
    takeaway:
      "Bir ödülü almak için önce para ödemeniz isteniyorsa, bu kesinlikle dolandırıcılıktır.",
  },

  {
    id: "eml-13",
    channel: "email",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["kurum-taklidi", "aciliyet", "kimlik-avi", "kotu-baglanti"],
    title: "Instagram: Telif hakkı ihlali",
    email: {
      fromName: "Instagram Support",
      fromAddress: "copyright@instagram-appeals.com",
      to: "siz@ornek.com",
      subject: "Hesabınız telif hakkı ihlali nedeniyle devre dışı bırakılacak",
      date: "Bugün 02:47",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>Hesabınızda telif hakkıyla korunan bir içerik paylaştığınız bildirildi. İtiraz etmezseniz hesabınız <b>24 saat içinde</b> kalıcı olarak silinecektir.</p>
        <p><a href="#">İtiraz Formunu Doldur</a></p>
        <p>Instagram Destek Ekibi</p>`,
    },
    explanation:
      "Meta/Instagram bildirimleri uygulama içinden gelir; itiraz da uygulamadan yapılır. ‘instagram-appeals.com’ sahte bir alan adıdır ve form, giriş bilgilerinizi çalmak için tasarlanmıştır.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘instagram-appeals.com’ resmî Instagram/Meta adresi değildir.",
      },
      {
        kind: "danger",
        label: "Hesap silme tehdidi",
        detail: "‘24 saat içinde silinecek’ paniği tıklatmak içindir.",
      },
      {
        kind: "danger",
        label: "Gece gönderimi",
        detail: "02:47 gibi bir saatte gelen ‘resmî’ uyarı şüphelidir.",
      },
    ],
    takeaway:
      "Sosyal medya itirazlarını yalnızca uygulamanın kendi içindeki ayarlar/yardım bölümünden yapın, e-postadaki forma değil.",
  },
  {
    id: "eml-14",
    channel: "email",
    verdict: "legit",
    difficulty: "kolay",
    tactics: [],
    title: "Trendyol: Siparişin kargoda",
    email: {
      fromName: "Trendyol",
      fromAddress: "siparis@trendyol.com",
      to: "siz@ornek.com",
      subject: "Siparişin kargoya verildi 🚚",
      date: "Bugün 12:10",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>2 ürünlü siparişin (No: 5581203945) kargoya verildi. Tahmini teslimat: 30 Temmuz.</p>
        <p>Siparişini uygulamadan veya trendyol.com hesabından takip edebilirsin. Kargo takibi için ödeme ya da bilgi girmen gerekmez.</p>
        <p>İyi alışverişler!</p>`,
    },
    explanation:
      "Meşru bir sipariş bildirimi. Resmî ‘@trendyol.com’ adresinden gelir, beklediğin bir siparişe aittir, hiçbir ödeme/bilgi istemez ve takibi kendi hesabından yapmanı söyler.",
    flags: [
      {
        kind: "safe",
        label: "Resmî alan adı",
        detail: "‘@trendyol.com’ gerçek gönderendir.",
      },
      {
        kind: "safe",
        label: "Beklenen bağlam",
        detail: "Senin verdiğin bir siparişin durum güncellemesi.",
      },
      {
        kind: "safe",
        label: "Bilgi/ödeme istemez",
        detail: "Takip için kart veya kişisel bilgi talep etmez.",
      },
    ],
    takeaway:
      "Sipariş bildirimleri sipariş numarasıyla gelir ve seni kendi hesabına yönlendirir; ek ödeme isterlerse şüphelen.",
  },
  {
    id: "eml-15",
    channel: "email",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["sahte-gonderen", "kotu-baglanti", "kimlik-avi"],
    title: "Paylaşılan Google Dokümanı",
    email: {
      fromName: "Mehmet Demir (üzerinden)",
      fromAddress: "no-reply@docs-google-share.com",
      to: "siz@ornek.com",
      subject: "Mehmet Demir seninle bir doküman paylaştı: ‘Bütçe 2026’",
      date: "Bugün 09:33",
      bodyHtml: `
        <p>Mehmet Demir seninle bir Google Dokümanı paylaştı.</p>
        <p><b>Bütçe 2026 (Gizli)</b></p>
        <p><a href="#">Dokümanı Aç</a></p>
        <p>Dokümanı görüntülemek için Google hesabınla oturum açman gerekebilir.</p>`,
    },
    explanation:
      "Gerçek Google paylaşımları ‘@google.com’ / ‘drive.google.com’ üzerinden gelir. ‘docs-google-share.com’ sahtedir. ‘Görüntülemek için Google hesabınla oturum aç’ ifadesi, seni sahte bir Google giriş sayfasına düşürerek parolanı çalmayı hedefler.",
    flags: [
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘docs-google-share.com’ Google’a ait değildir.",
      },
      {
        kind: "danger",
        label: "Zorunlu ‘yeniden giriş’",
        detail: "Zaten girişliysen tekrar parola istenmesi klasik tuzaktır.",
      },
      {
        kind: "danger",
        label: "Merak uyandıran başlık",
        detail: "‘Bütçe (Gizli)’ merakla tıklatmaya çalışır.",
      },
    ],
    takeaway:
      "Paylaşım e-postalarında ‘yeniden oturum aç’ isteniyorsa, önce adres çubuğunda gerçekten google.com’da olduğunu doğrula.",
  },
  {
    id: "eml-16",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "kimlik-avi", "aciliyet"],
    title: "IT: Posta kutunuz doldu",
    email: {
      fromName: "IT Destek",
      fromAddress: "it-support@ornek-destek.com",
      to: "siz@ornek.com",
      subject: "Uyarı: Posta kutunuz %98 dolu — e-postalar gecikiyor",
      date: "Bugün 08:05",
      bodyHtml: `
        <p>Sayın kullanıcı,</p>
        <p>Posta kutunuz dolmak üzere. Yeni e-postaları almaya devam etmek için hesabınızı doğrulayıp kotanızı artırın.</p>
        <p><a href="#">Kotayı Artır (giriş gerekli)</a></p>
        <p>Doğrulama yapılmazsa gelen e-postalar reddedilecektir.</p>`,
    },
    explanation:
      "Şirket içi taklit. Gerçek IT departmanınız kurumsal alan adınızdan (@ornek.com) yazar; burada ‘@ornek-destek.com’ kullanılmış. ‘Kotayı artırmak için giriş yap’ akışı kurumsal parolanı sahte sayfada toplar.",
    flags: [
      {
        kind: "danger",
        label: "Uyuşmayan alan adı",
        detail: "Kurumsal alan ‘@ornek.com’ değil ‘@ornek-destek.com’.",
      },
      {
        kind: "danger",
        label: "Giriş isteyen ‘kota’ akışı",
        detail: "Posta kotası parola girerek artırılmaz.",
      },
      {
        kind: "danger",
        label: "Hizmet kesme tehdidi",
        detail: "‘E-postalar reddedilecek’ ile aciliyet yaratır.",
      },
    ],
    takeaway:
      "‘IT’ imzalı bir e-postada bile gönderenin tam kurumsal alan adını doğrula; şüphede IT’ye ayrı bir kanaldan sor.",
  },
  {
    id: "eml-17",
    channel: "email",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "Üniversite: Ders kayıt hatırlatma",
    email: {
      fromName: "Öğrenci İşleri",
      fromAddress: "ogrenciisleri@universite.edu.tr",
      to: "siz@ornek.com",
      subject: "Güz dönemi ders kayıtları 1 Eylül'de başlıyor",
      date: "Dün 16:00",
      bodyHtml: `
        <p>Sayın öğrencimiz,</p>
        <p>2026-2027 Güz dönemi ders kayıtları 1–5 Eylül tarihleri arasında yapılacaktır. İşlemlerinizi öğrenci bilgi sistemi (obs.universite.edu.tr) üzerinden gerçekleştirebilirsiniz.</p>
        <p>Danışmanınızla görüşmeyi unutmayın. İyi çalışmalar dileriz.</p>`,
    },
    explanation:
      "Meşru bir duyuru. Resmî ‘.edu.tr’ alan adından gelir, bilgi/parola istemez ve işlemleri her zamanki resmî öğrenci sistemi üzerinden yapmanızı söyler. Aciliyet baskısı yoktur.",
    flags: [
      {
        kind: "safe",
        label: "Resmî ‘.edu.tr’ adresi",
        detail: "Üniversitenin bilinen kurumsal alan adı.",
      },
      {
        kind: "safe",
        label: "Bilgi istemez",
        detail: "Parola veya kişisel veri talebi yok.",
      },
      {
        kind: "safe",
        label: "Bilinen sisteme yönlendirir",
        detail: "İşlemi resmî öğrenci bilgi sisteminden yapmanızı söyler.",
      },
    ],
    takeaway:
      "Kurumsal duyurular tanıdık resmî alan adından gelir ve seni her zaman kullandığın sisteme yönlendirir.",
  },
  {
    id: "eml-18",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["odul-tuzagi", "kotu-baglanti", "para-transferi"],
    title: "Kripto: Airdrop ödülünüz hazır",
    email: {
      fromName: "CoinRewards",
      fromAddress: "airdrop@coin-rewards-claim.net",
      to: "siz@ornek.com",
      subject: "0.5 ETH airdrop ödülünüzü talep edin (son 6 saat)",
      date: "Bugün 13:20",
      bodyHtml: `
        <p>Tebrikler! Cüzdanınız airdrop için seçildi.</p>
        <p><b>0.5 ETH</b> ödülünüzü talep etmek için cüzdanınızı bağlayın ve doğrulama için ‘seed phrase’ (kurtarma ifadenizi) girin.</p>
        <p><a href="#">Ödülü Talep Et</a> — son 6 saat!</p>`,
    },
    explanation:
      "Kurtarma ifadesi (seed phrase) cüzdanınızın ana anahtarıdır ve HİÇBİR meşru servis bunu istemez. İsteyen herkes cüzdanınızı boşaltmak ister. Aciliyet ve bedava kripto vaadi klasik tuzaktır.",
    flags: [
      {
        kind: "danger",
        label: "Seed phrase talebi",
        detail: "Kurtarma ifadesini isteyen her yer dolandırıcıdır.",
      },
      {
        kind: "danger",
        label: "Bedava kripto + aciliyet",
        detail: "‘0.5 ETH’ + ‘son 6 saat’ birlikte kullanılmış.",
      },
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘coin-rewards-claim.net’ güvenilir bir servis değildir.",
      },
    ],
    takeaway:
      "Cüzdan kurtarma ifadeni (seed phrase) hiçbir zaman, hiçbir siteye girme; onu isteyen her istek dolandırıcılıktır.",
  },
  {
    id: "eml-19",
    channel: "email",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["para-transferi", "veri-sizintisi", "odul-tuzagi"],
    title: "Uzaktan iş: Günlük 2.500 TL",
    email: {
      fromName: "Kariyer Fırsatı",
      fromAddress: "hr@easy-income-jobs.com",
      to: "siz@ornek.com",
      subject: "Evden çalış, günde 2.500 TL kazan — hemen başla",
      date: "Bugün 11:02",
      bodyHtml: `
        <p>Merhaba,</p>
        <p>Profilin seçildi! Sadece ürün değerlendirmesi yaparak günde 2.500 TL kazanabilirsin. Başlamak için küçük bir ‘üyelik aktivasyon’ ücreti ve banka bilgilerin gerekiyor.</p>
        <p><a href="#">Hemen Başvur</a></p>`,
    },
    explanation:
      "Klasik sahte iş / ‘task scam’ dolandırıcılığı. Gerçek işverenler işe başlamak için senden para (aktivasyon ücreti) istemez. Yüksek kazanç vaadi + önden ödeme + banka bilgisi kesin uyarı işaretleridir.",
    flags: [
      {
        kind: "danger",
        label: "Önden ‘aktivasyon’ ücreti",
        detail: "İşe başlamak için para istemek dolandırıcılıktır.",
      },
      {
        kind: "danger",
        label: "Gerçekçi olmayan kazanç",
        detail: "‘Günde 2.500 TL’ kolay para vaadi tuzaktır.",
      },
      {
        kind: "danger",
        label: "Banka bilgisi talebi",
        detail: "Başvuru aşamasında banka bilgisi istenmez.",
      },
    ],
    takeaway:
      "Gerçek bir iş sana para kazandırır; işe başlamak için senden ücret veya banka bilgisi isteyen her teklif sahtedir.",
  },

  {
    id: "sms-09",
    channel: "sms",
    verdict: "phishing",
    difficulty: "kolay",
    tactics: ["kurum-taklidi", "kotu-baglanti", "aciliyet"],
    title: "HGS geçiş borcu",
    sms: {
      sender: "+90 542 771 22 33",
      timestamp: "Bugün 15:40",
      message:
        "HGS: Odenmemis 3 gecis ucretiniz var. 4 kat cezayi onlemek icin bugun odeyin: hgs-ptt-odeme.online/borc",
    },
    explanation:
      "HGS/OGS bildirimleri PTT/bankanın resmî kısa mesaj başlığından gelir, kişisel numaradan değil. ‘hgs-ptt-odeme.online’ sahte bir alan adıdır ve ceza tehdidiyle kart bilgisi girmene çalışır.",
    flags: [
      {
        kind: "danger",
        label: "Kişisel numaradan gönderim",
        detail: "Resmî HGS bildirimi 5XX’li cepten gelmez.",
      },
      {
        kind: "danger",
        label: "Şüpheli ‘.online’ adresi",
        detail: "‘hgs-ptt-odeme.online’ resmî değildir.",
      },
      {
        kind: "danger",
        label: "Ceza tehdidiyle aciliyet",
        detail: "‘4 kat ceza, bugün öde’ acele ettirir.",
      },
    ],
    takeaway:
      "HGS/OGS borcunu yalnızca PTT’nin veya bankanın resmî uygulaması/sitesinden sorgula ve öde.",
  },
  {
    id: "sms-10",
    channel: "sms",
    verdict: "legit",
    difficulty: "orta",
    tactics: [],
    title: "Kurye teslim kodu",
    sms: {
      sender: "GETIR",
      timestamp: "Bugün 19:05",
      message:
        "Siparisin yola cikti! Kuryeye teslimatta soyleyecegin kod: 7431. Kurye disinda kimseyle paylasma. Afiyet olsun!",
    },
    explanation:
      "Meşru bir teslimat kodu. Sen sipariş verdiğin için beklenen bir mesajdır; bir linke tıklatmaz, ödeme/kişisel bilgi istemez. Kodu yalnızca kapıdaki kuryeye söylemen istenir — bu güvenli bir uygulamadır.",
    flags: [
      {
        kind: "safe",
        label: "Beklenen sipariş",
        detail: "Senin verdiğin siparişe ait teslim kodu.",
      },
      {
        kind: "safe",
        label: "Link/ödeme yok",
        detail: "Tıklanacak bağlantı veya ödeme talebi içermez.",
      },
      {
        kind: "safe",
        label: "Doğru kullanım uyarısı",
        detail: "Kodu yalnızca kuryeye söylemeni ister.",
      },
    ],
    takeaway:
      "Teslimat kodları güvenlidir; yeter ki kodu telefonda/mesajla değil, yalnızca kapıdaki gerçek kuryeye söyle.",
  },
  {
    id: "sms-11",
    channel: "sms",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "odul-tuzagi", "para-transferi", "veri-sizintisi"],
    title: "Devlet destek ödemesi",
    sms: {
      sender: "e-Devlet",
      timestamp: "Bugün 10:20",
      message:
        "2.000 TL sosyal destek odemesine hak kazandiniz. IBAN ve TC bilgilerinizi girerek talep edin: destek-basvuru-tr.com",
    },
    explanation:
      "Devlet destek ödemeleri e-Devlet/ilgili kurum üzerinden yürür; SMS’teki bir siteye TC ve IBAN girerek ‘talep’ edilmez. Başlık taklit edilebilir; ‘destek-basvuru-tr.com’ sahtedir ve kimlik + banka bilgisi toplar.",
    flags: [
      {
        kind: "danger",
        label: "TC + IBAN talebi",
        detail: "Bir siteye bu bilgileri girmek kimlik/banka hırsızlığıdır.",
      },
      {
        kind: "danger",
        label: "Sahte alan adı",
        detail: "‘destek-basvuru-tr.com’ resmî ‘turkiye.gov.tr’ değildir.",
      },
      {
        kind: "danger",
        label: "Bedava para cazibesi",
        detail: "Beklenmedik ‘destek ödemesi’ tıklatmak için yemdir.",
      },
    ],
    takeaway:
      "Devlet ödemelerini yalnızca e-Devlet’ten (turkiye.gov.tr) kendin sorgula; SMS linkiyle TC/IBAN girme.",
  },
  {
    id: "sms-12",
    channel: "sms",
    verdict: "phishing",
    difficulty: "zor",
    tactics: ["kimlik-avi", "veri-sizintisi", "sahte-gonderen"],
    title: "Arkadaştan ‘kod’ isteği",
    sms: {
      sender: "+90 536 448 90 12",
      timestamp: "Bugün 21:15",
      message:
        "Selam! Yanlislikla senin numarana bir dogrulama kodu gonderdim, hesabimi acamiyorum. Az once gelen 6 haneli kodu bana iletir misin? Cok acil :(",
    },
    explanation:
      "Hesap ele geçirme (account takeover) dolandırıcılığı. Saldırgan SENİN hesabına giriş/şifre sıfırlama başlatır, kod senin telefonuna gelir ve ‘yanlışlıkla geldi’ diyerek onu ister. Kodu verirsen hesabını kaptırırsın.",
    flags: [
      {
        kind: "danger",
        label: "Doğrulama kodu isteme",
        detail: "Sana gelen kodu kimseyle paylaşma — o kod senin hesabınındır.",
      },
      {
        kind: "danger",
        label: "‘Yanlışlıkla geldi’ bahanesi",
        detail: "Kodun neden sende olduğunu masum gösterme numarası.",
      },
      {
        kind: "danger",
        label: "Aciliyet + tanıdık tonu",
        detail: "‘Çok acil’ ve samimi dil, düşünmeni engeller.",
      },
    ],
    takeaway:
      "Telefonuna gelen 6 haneli doğrulama kodunu, ‘arkadaşın’ bile olsa asla kimseye iletme.",
  },
  {
    id: "sms-13",
    channel: "sms",
    verdict: "legit",
    difficulty: "kolay",
    tactics: [],
    title: "Veli bilgilendirme",
    sms: {
      sender: "OKUL",
      timestamp: "Dün 08:00",
      message:
        "Sayin velimiz, 2 Eylul Cuma gunu veli toplantisi saat 14:00'te yapilacaktir. Katiliminiz onemlidir. Bilgi: okulumuz idaresi.",
    },
    explanation:
      "Meşru bir bilgilendirme. Bir link, ödeme, kişisel bilgi veya aciliyet baskısı içermez; yalnızca bir etkinliği duyurur. Bu tür salt bilgilendirici mesajlar risksizdir.",
    flags: [
      {
        kind: "safe",
        label: "Sadece bilgilendirme",
        detail: "Duyuru niteliğinde; hiçbir işlem/bilgi istemez.",
      },
      {
        kind: "safe",
        label: "Link/ödeme yok",
        detail: "Tıklanacak bağlantı veya ödeme talebi içermez.",
      },
      {
        kind: "safe",
        label: "Baskı yok",
        detail: "Tehdit veya aciliyet dili kullanmaz.",
      },
    ],
    takeaway:
      "Link ve bilgi talebi içermeyen, yalnızca duyuru yapan mesajlar genelde güvenlidir.",
  },

  {
    id: "vce-07",
    channel: "voice",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["kurum-taklidi", "otorite-baskisi", "aciliyet", "veri-sizintisi"],
    title: "Operatör: Hattınız kapatılıyor",
    voice: {
      callerId: "+90 850 222 33 44",
      callerLabel: "Bilinmeyen",
      duration: "03:28",
      transcript: [
        {
          speaker: "arayan",
          text: "Merhaba, operatörünüzden arıyorum. Adınıza izinsiz ikinci bir hat açılmış, adınız suça karışabilir.",
        },
        { speaker: "siz", text: "Ben ikinci hat açmadım." },
        {
          speaker: "arayan",
          text: "Bu yüzden acil işlem yapmalıyız. Kimliğinizi doğrulamam için TC kimlik numaranızı ve size gelecek onay kodunu almam gerekiyor.",
        },
        {
          speaker: "arayan",
          text: "Aksi halde tüm hatlarınız bu akşam kapanacak ve hakkınızda işlem başlatılacak.",
        },
      ],
    },
    explanation:
      "Operatör kimliğine bürünen bir dolandırıcılık. Operatörünüz sizi arayıp TC kimlik ve ‘onay kodu’ istemez, ‘suça karışırsınız’ diye korkutmaz. Onay kodu muhtemelen bir hesabınıza girişi/işlemi onaylatmak içindir.",
    flags: [
      {
        kind: "danger",
        label: "Onay kodu isteme",
        detail: "Telefonda gelen kodu istemek klasik ele geçirme yöntemidir.",
      },
      {
        kind: "danger",
        label: "Suç/kapatma korkusu",
        detail: "‘Adınız suça karışır, hatlar kapanır’ ile panik yaratır.",
      },
      {
        kind: "danger",
        label: "TC kimlik talebi",
        detail: "Kimlik doğrulama bahanesiyle bilgi toplar.",
      },
    ],
    takeaway:
      "Operatör de olsa telefonda onay kodu/TC isteyen aramada kapat; operatörünü resmî çağrı merkezinden kendin ara.",
  },
  {
    id: "vce-08",
    channel: "voice",
    verdict: "legit",
    difficulty: "kolay",
    tactics: [],
    title: "İş görüşmesi randevusu",
    voice: {
      callerId: "+90 212 444 55 66",
      callerLabel: "İnsan Kaynakları",
      duration: "01:12",
      transcript: [
        {
          speaker: "arayan",
          text: "Merhaba, ABC Teknoloji İnsan Kaynakları’ndan arıyorum. Geçen hafta yaptığınız başvuru için görüşme ayarlamak istiyoruz.",
        },
        { speaker: "siz", text: "Merhaba, tabii ki." },
        {
          speaker: "arayan",
          text: "Salı saat 11:00 sizin için uygun mu? Görüşme ofisimizde yüz yüze olacak, adresi e-postayla ileteceğiz.",
        },
        { speaker: "siz", text: "Uygun, teşekkürler." },
      ],
    },
    explanation:
      "Meşru bir görüşme araması. Senin yaptığın bir başvuru bağlamındadır, yalnızca randevu ayarlar; TC kimlik, kart bilgisi, kod veya ödeme istemez. Detayları resmî e-postayla ileteceğini söyler.",
    flags: [
      {
        kind: "safe",
        label: "Beklenen bağlam",
        detail: "Senin yaptığın bir iş başvurusuna dayanır.",
      },
      {
        kind: "safe",
        label: "Hassas bilgi istemez",
        detail: "Yalnızca uygun zamanı sorar; para/kimlik istemez.",
      },
      {
        kind: "safe",
        label: "Resmî kanala yönlendirir",
        detail: "Adresi e-postayla göndereceğini belirtir.",
      },
    ],
    takeaway:
      "Meşru görüşme aramaları yalnızca randevu için gereken bilgiyi konuşur; para veya hassas veri istemez.",
  },
  {
    id: "vce-09",
    channel: "voice",
    verdict: "phishing",
    difficulty: "orta",
    tactics: ["aciliyet", "para-transferi", "otorite-baskisi"],
    title: "‘Yakınınız kaza geçirdi’",
    voice: {
      callerId: "+90 555 909 10 11",
      callerLabel: "Bilinmeyen",
      duration: "02:02",
      transcript: [
        {
          speaker: "arayan",
          text: "Alo, hastaneden arıyorum. Bir yakınınız trafik kazası geçirdi, acil ameliyata alınması gerekiyor.",
        },
        { speaker: "siz", text: "Aman Tanrım, kim, nasıl?" },
        {
          speaker: "arayan",
          text: "Şu an detay veremem, durumu kritik. Ameliyat için hemen bir depozito yatırmanız gerekiyor, size IBAN vereyim, panik yapmayın ama çok acele edin.",
        },
      ],
    },
    explanation:
      "Duygusal manipülasyonla panik yaratan bir dolandırıcılık. Hastaneler acil müdahale için önden telefonla ‘depozito’ istemez, IBAN’a para yatırtmaz. Panik anında yakınını arayıp teyit etmen engellenmeye çalışılır.",
    flags: [
      {
        kind: "danger",
        label: "Acil ‘depozito’ isteği",
        detail: "Hastane, tedavi için telefonda IBAN’a para yatırtmaz.",
      },
      {
        kind: "danger",
        label: "Detay vermeme",
        detail: "‘Kim olduğunu söyleyemem’ diyerek teyidi engeller.",
      },
      {
        kind: "danger",
        label: "Panik + acele",
        detail: "Duygusal şokla düşünmeni engellemeye çalışır.",
      },
    ],
    takeaway:
      "Panik yaratan ‘yakının kazada’ aramalarında kapat, yakınını kendi numarasından ara ve teyit etmeden asla para gönderme.",
  },
  {
    id: "vce-10",
    channel: "voice",
    verdict: "legit",
    difficulty: "zor",
    tactics: [],
    title: "Memnuniyet anketi",
    voice: {
      callerId: "0850 333 00 00",
      callerLabel: "Anket Hizmetleri",
      duration: "00:55",
      transcript: [
        {
          speaker: "arayan",
          text: "Merhaba, geçen hafta yaptırdığınız servis hizmetiyle ilgili kısa bir memnuniyet anketi için aradık. 3 sorusu var, uygun musunuz?",
        },
        { speaker: "siz", text: "Kısa ise olur." },
        {
          speaker: "arayan",
          text: "Teşekkürler. Hizmetten 1–10 arası kaç puan verirsiniz? Kişisel veya ödeme bilginizi sormuyoruz, sadece memnuniyetinizi ölçüyoruz.",
        },
        { speaker: "siz", text: "8 diyebilirim." },
      ],
    },
    explanation:
      "Meşru bir anket. Yalnızca memnuniyet puanı sorar; TC kimlik, kart, parola veya kod istemez ve açıkça ‘kişisel/ödeme bilgisi sormuyoruz’ der. Yine de tereddüt edersen soruları yanıtlamayı reddedebilirsin — meşru anketler ısrar etmez.",
    flags: [
      {
        kind: "safe",
        label: "Hassas bilgi istemez",
        detail: "Yalnızca puan sorar; kimlik/kart/kod talebi yok.",
      },
      {
        kind: "safe",
        label: "Beklenen bağlam",
        detail: "Senin aldığın bir hizmete dair geri bildirim.",
      },
      {
        kind: "safe",
        label: "Baskı yok",
        detail: "Reddedebileceğin, kısa ve zorlama içermeyen bir görüşme.",
      },
    ],
    takeaway:
      "Meşru anketler yalnızca görüş sorar; kişisel/ödeme bilgisi istemez ve reddettiğinde ısrar etmez.",
  },
];

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
