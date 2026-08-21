import type { Metadata } from "next";
import Link from "next/link";
import { ALL_TACTICS, CHANNEL_META } from "@/lib/tactics";
import type { Channel } from "@/lib/types";
import {
  MailIcon,
  MessageIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@/components/Icons";

export const metadata: Metadata = {
  title: "Güvenlik Rehberi — PhishGuard",
  description:
    "Oltalama taktikleri, kanal bazlı ipuçları ve dolandırıcılığa karşı altın kurallar.",
};

const CHANNEL_ICON: Record<Channel, typeof MailIcon> = {
  email: MailIcon,
  sms: MessageIcon,
  voice: PhoneIcon,
};

const GOLDEN_RULES = [
  {
    t: "Aciliyet = alarm",
    d: "‘Son 2 saat’, ‘hesabınız kapatılacak’ gibi baskı, düşünmeni engellemek içindir. Ne kadar acilse o kadar şüphelen.",
  },
  {
    t: "Kodunu asla paylaşma",
    d: "SMS doğrulama (OTP) kodunu hiç kimse — bankan bile — telefonda veya mesajla isteyemez.",
  },
  {
    t: "Adrese bak, ada değil",
    d: "Görünen ad (‘Garanti’, ‘Apple’) taklit edilebilir. Asıl gönderen e-posta adresine ve linkin alan adına bak.",
  },
  {
    t: "Bağımsız kanaldan doğrula",
    d: "Şüpheli bir istekte kuruma/kişiye kendi bildiğin resmî numaradan ulaş; gelen mesajdaki numaraya değil.",
  },
  {
    t: "Ödül bedava, bilgi pahalı",
    d: "Bir hediye için kart bilgisi, TC kimlik veya ‘vergi’ ödemesi isteniyorsa, bu kesinlikle dolandırıcılıktır.",
  },
  {
    t: "Tıklamadan önce dur",
    d: "Beklemediğin bir ek veya link geldiğinde önce dur, düşün, doğrula. Bir saniyelik tereddüt seni korur.",
  },
];

const CHANNEL_TIPS: Record<Channel, string[]> = {
  email: [
    "Gönderen adresinin alan adı gerçek kuruma tam olarak eşleşiyor mu? (‘@garantibbva.com.tr’ ✓ / ‘@garanti-bbva.info’ ✕)",
    "Bağlantının üzerine gelip (tıklamadan) hedef adresi kontrol et; kısaltılmış veya benzer görünen alan adlarına dikkat.",
    "‘Makroları etkinleştir’ diyen hiçbir eki açma. .html, .docm, .exe uzantılı beklenmedik ekler tehlikelidir.",
    "Genel hitaplar (‘Değerli Müşterimiz’) ve dil bilgisi hataları klasik ipuçlarıdır.",
  ],
  sms: [
    "Kurumlar SMS’i kısa isim başlığından gönderir; kişisel bir cep numarasından gelen ‘resmî’ mesaja güvenme.",
    "Kısaltılmış (bit.ly) veya garip uzantılı (.xyz, .info) linklere asla tıklama.",
    "Küçük bir ‘kargo/gümrük ücreti’ istemek, kart bilgini toplamak için yaygın bir tuzaktır.",
    "‘Numaram değişti, acil para’ mesajlarını kişinin bilinen numarasından arayarak doğrula.",
  ],
  voice: [
    "Savcı, polis veya banka kendini telefonla tanıtıp para transferi ya da şifre istemez.",
    "‘Devlet güvence hesabı’ diye bir şey yoktur; bu ifadeyi duyduğun an kapat.",
    "Arayan numara tanıdık görünse bile taklit (spoofing) edilebilir; numaraya güvenme, içeriğe bak.",
    "Baskı altındayken telefonu kapat, birkaç dakika bekle ve resmî numarayı kendin ara.",
  ],
};

export default function RehberPage() {
  return (
    <div className="container-page max-w-4xl py-14">
      {/* başlık */}
      <header className="max-w-2xl">
        <span className="eyebrow">Güvenlik Rehberi</span>
        <h1 className="mt-5 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Oltalamayı tanı, tuzağa düşme
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Dolandırıcıların en sık kullandığı taktikler, kanal bazlı uyarı
          işaretleri ve her durumda işine yarayacak altın kurallar.
        </p>
      </header>

      {/* Altın kurallar */}
      <section className="mt-16">
        <div className="eyebrow">Altın Kurallar</div>
        <div className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {GOLDEN_RULES.map((r, i) => (
            <div key={r.t} className="flex gap-4 border-t border-line pt-5">
              <span className="font-display text-2xl font-semibold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-ink">
                  {r.t}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {r.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kanal bazlı ipuçları */}
      <section className="mt-16">
        <div className="eyebrow">Kanal Bazlı Uyarı İşaretleri</div>
        <div className="mt-6 space-y-10">
          {(["email", "sms", "voice"] as Channel[]).map((c) => {
            const Icon = CHANNEL_ICON[c];
            return (
              <div key={c} className="border-t border-line pt-6">
                <div className="flex items-center gap-3">
                  <Icon width={22} height={22} className="text-accent" />
                  <h3 className="font-display text-2xl font-medium text-ink">
                    {CHANNEL_META[c].label}
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {CHANNEL_TIPS[c].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 font-mono text-xs font-semibold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-relaxed text-ink-soft">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Taktik sözlüğü */}
      <section className="mt-16">
        <div className="eyebrow">Taktik Sözlüğü</div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Simülasyondaki her senaryo bir veya birkaç taktikle etiketlenir.
          Raporunda hangi taktikte zayıf olduğunu bu terimlerle görürsün.
        </p>
        <dl className="mt-6 grid gap-x-12 gap-y-6 sm:grid-cols-2">
          {ALL_TACTICS.map((t) => (
            <div key={t.id} className="border-t border-line pt-4">
              <dt className="font-display text-lg font-medium text-ink">
                {t.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-soft">
                {t.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="mt-16 border-t border-line pt-10 text-center">
        <h2 className="font-display text-2xl font-medium text-ink">
          Öğrendiklerini test et
        </h2>
        <p className="mx-auto mt-2 max-w-md text-ink-soft">
          Teori güzel, pratik daha iyi. Bu bilgileri gerçek senaryolarda dene.
        </p>
        <Link
          href="/simulasyon"
          className="btn-primary mx-auto mt-6 px-6 py-3.5"
        >
          Simülasyona git
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </section>
    </div>
  );
}
