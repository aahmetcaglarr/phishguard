import type { Tactic, TacticMeta, Channel } from "./types";

export const TACTICS: Record<Tactic, TacticMeta> = {
  "kimlik-avi": {
    id: "kimlik-avi",
    label: "Kimlik Avı",
    short: "Kimlik Avı",
    description:
      "Kullanıcıyı sahte bir giriş sayfasına yönlendirerek kullanıcı adı, parola veya doğrulama kodu çalmayı hedefler.",
  },
  aciliyet: {
    id: "aciliyet",
    label: "Aciliyet & Korku",
    short: "Aciliyet",
    description:
      "‘Hesabınız kapatılacak’, ‘son 2 saat’ gibi baskıyla kurbanı düşünmeden harekete geçmeye zorlar.",
  },
  "sahte-gonderen": {
    id: "sahte-gonderen",
    label: "Sahte Gönderen",
    short: "Sahte Gönderen",
    description:
      "Görünen ad tanıdık olsa da e-posta adresi/numara sahtedir. Gönderen kimliği taklit edilir.",
  },
  "odul-tuzagi": {
    id: "odul-tuzagi",
    label: "Ödül Tuzağı",
    short: "Ödül Tuzağı",
    description:
      "Çekiliş, hediye, iade veya bedava ürün vaadiyle kurbanı tıklamaya/bilgi vermeye ikna eder.",
  },
  "kurum-taklidi": {
    id: "kurum-taklidi",
    label: "Kurum Taklidi",
    short: "Kurum Taklidi",
    description:
      "Banka, kargo, e-Devlet, GİB gibi güvenilen bir kurumun kimliğine bürünür.",
  },
  "kotu-baglanti": {
    id: "kotu-baglanti",
    label: "Sahte Bağlantı",
    short: "Sahte Link",
    description:
      "Benzer görünen (typosquatting) alan adları veya kısaltılmış linklerle kötücül siteye yönlendirir.",
  },
  "ek-dosya": {
    id: "ek-dosya",
    label: "Zararlı Ek",
    short: "Zararlı Ek",
    description:
      "Fatura, CV, makbuz gibi görünen ekler aslında zararlı yazılım (makro, .exe, .html) içerir.",
  },
  "otorite-baskisi": {
    id: "otorite-baskisi",
    label: "Otorite Baskısı",
    short: "Otorite",
    description:
      "Kendini yönetici, polis, savcı veya vergi dairesi olarak tanıtıp itaat baskısı kurar (CEO dolandırıcılığı dahil).",
  },
  "para-transferi": {
    id: "para-transferi",
    label: "Para Transferi",
    short: "Para Transferi",
    description:
      "Acil ödeme, IBAN değişikliği veya ‘güvenli hesaba aktarım’ ile doğrudan para çalmayı hedefler.",
  },
  "veri-sizintisi": {
    id: "veri-sizintisi",
    label: "Bilgi Toplama",
    short: "Bilgi Toplama",
    description:
      "TC kimlik, doğum tarihi, kart bilgisi gibi kişisel verileri parça parça toplar.",
  },
};

export const ALL_TACTICS = Object.values(TACTICS);

export const CHANNEL_META: Record<
  Channel,
  { label: string; icon: string; description: string }
> = {
  email: {
    label: "E-posta",
    icon: "mail",
    description: "Sahte kurumsal e-postalar, fatura ve giriş tuzakları.",
  },
  sms: {
    label: "SMS",
    icon: "message",
    description: "Kısa mesaj (smishing): kargo, banka ve ödül tuzakları.",
  },
  voice: {
    label: "Sesli Arama",
    icon: "phone",
    description: "Telefon dolandırıcılığı (vishing) arama dökümleri.",
  },
};
