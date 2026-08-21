import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";
import { ALL_TACTICS, CHANNEL_META } from "@/lib/tactics";
import type { Channel } from "@/lib/types";
import {
  MailIcon,
  MessageIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@/components/Icons";

const CHANNEL_ICON: Record<Channel, typeof MailIcon> = {
  email: MailIcon,
  sms: MessageIcon,
  voice: PhoneIcon,
};

export default function HomePage() {
  const total = SCENARIOS.length;
  const byChannel = (c: Channel) =>
    SCENARIOS.filter((s) => s.channel === c).length;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
          {/* Sol: editöryel başlık */}
          <div className="animate-fade-up">
            <span className="eyebrow">Oltalama Farkındalık Simülasyonu</span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.04] tracking-tight text-ink sm:text-6xl">
              Oltayı yutma.
              <br />
              <span className="italic text-accent">Tanı</span>, ve geç.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Sahte e-postaları, SMS&apos;leri ve arama dökümlerini incele;
              zararlı mı güvenli mi karar ver. Gerçek bir tuzağa düşmeden, güvenli
              bir ortamda refleksini geliştir.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link href="/simulasyon" className="btn-primary px-6 py-3.5 text-base">
                Simülasyona başla
                <ArrowRightIcon width={18} height={18} />
              </Link>
              <Link
                href="/rehber"
                className="text-base font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-accent"
              >
                Önce güvenlik rehberi
              </Link>
            </div>

            {/* Editöryel istatistik şeridi */}
            <dl className="mt-12 flex items-end gap-8 border-t border-line pt-6">
              {[
                { v: total, l: "Senaryo" },
                { v: 3, l: "Kanal" },
                { v: ALL_TACTICS.length, l: "Taktik" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-4xl font-semibold text-ink">
                    {s.v}
                  </dt>
                  <dd className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                    {s.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Sağ: işaretlenmiş "delil" e-posta */}
          <div
            className="animate-fade-up lg:pl-6"
            style={{ animationDelay: "120ms" }}
          >
            <ExhibitEmail />
          </div>
        </div>
      </section>

      {/* Kanallar */}
      <section className="container-page py-16 sm:py-20">
        <SectionHead
          index="01"
          title="Saldırı tek bir yoldan gelmez"
          desc="En yaygın üç oltalama kanalı, gerçekçi arayüzlerle karşında."
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl2 border border-line bg-line md:grid-cols-3">
          {(["email", "sms", "voice"] as Channel[]).map((c) => {
            const Icon = CHANNEL_ICON[c];
            return (
              <div key={c} className="bg-bg-card p-7">
                <div className="flex items-center justify-between">
                  <Icon width={24} height={24} className="text-accent" />
                  <span className="font-mono text-xs text-ink-faint">
                    {byChannel(c)} senaryo
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-medium text-ink">
                  {CHANNEL_META[c].label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {CHANNEL_META[c].description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="border-y border-line bg-bg-soft/60">
        <div className="container-page py-16 sm:py-20">
          <SectionHead
            index="02"
            title="Üç adımda farkındalık"
            desc="Karmaşık kurulum yok. Aç, oyna, öğren."
          />
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "İncele",
                d: "Sırayla gelen sahte veya gerçek mesajları dikkatle oku. Gönderen, bağlantı ve dildeki ipuçlarını yakala.",
              },
              {
                n: "02",
                t: "Karar ver",
                d: "‘Zararlı mı, güvenli mi?’ Süre dolmadan tahminini yap; ardından tehdidi ele veren tüm işaretleri öğren.",
              },
              {
                n: "03",
                t: "Gelişir",
                d: "Detaylı rapor, hangi saldırı türlerinde hata yaptığını gösterir ve sana özel öneriler sunar.",
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-display text-3xl font-semibold text-accent">
                  {s.n}
                </div>
                <div className="mt-3 h-px w-10 bg-line" />
                <h3 className="mt-4 font-display text-xl font-medium text-ink">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neden PhishGuard */}
      <section className="container-page py-16 sm:py-20">
        <SectionHead
          index="03"
          title="Sadece test değil, bir eğitim"
          desc="Oyunlaştırma ile motivasyon, analitik ile ölçülebilir gelişim."
        />
        <div className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {[
            {
              t: "Kırmızı bayrak analizi",
              d: "Her senaryodan sonra tehdidi ele veren tüm işaretler gerekçesiyle açıklanır.",
            },
            {
              t: "Zayıf yön raporu",
              d: "Kanal ve taktik bazında doğruluğun ölçülür; en çok hata yaptığın tür öne çıkar.",
            },
            {
              t: "Oyunlaştırma",
              d: "Puan, seri, XP ve seviye sistemi öğrenmeyi sürükleyici hale getirir.",
            },
            {
              t: "Eğitmen paneli",
              d: "Sınıf geneli başarı ve en çok hata yapılan saldırı türleri tek ekranda.",
            },
            {
              t: "Gerçekçi senaryolar",
              d: "Banka, kargo, e-Devlet, CEO dolandırıcılığı gibi güncel taktiklerden esinlenildi.",
            },
            {
              t: "Güvenli ortam",
              d: "Tüm bağlantılar devre dışı. Hata yapmak risksiz — asıl amaç öğrenmek.",
            },
          ].map((f) => (
            <div key={f.t} className="border-t border-line pt-5">
              <h3 className="font-display text-lg font-medium text-ink">
                {f.t}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line bg-ink text-bg">
        <div className="container-page py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            Bir sonraki oltayı yutacak mısın,
            <br className="hidden sm:block" /> yoksa{" "}
            <span className="italic text-accent">yakalayacak</span> mısın?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-bg/70">
            5 dakikalık bir turla başla. Refleksin ne kadar güçlü, hemen gör.
          </p>
          <Link
            href="/simulasyon"
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-lg bg-bg px-7 py-3.5 text-base font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Ücretsiz başla
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="eyebrow">{index} · Bölüm</span>
      <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-lg text-ink-soft">{desc}</p>
    </div>
  );
}

function ExhibitEmail() {
  return (
    <figure className="relative">
      <div className="rounded-xl2 border border-line bg-bg-card shadow-lift">
        {/* başlık şeridi */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Delil A — Gelen Kutusu
          </span>
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="text-xs text-ink-faint">Gönderen</div>
          <div className="mt-0.5 text-sm text-ink">
            Garanti BBVA Güvenlik{" "}
            <span className="font-mono text-ink-soft">
              &lt;guvenlik@
              <mark className="bg-accent/15 px-0.5 text-accent-dark decoration-clone">
                garanti-bbva-tr.info
              </mark>
              &gt;
            </span>
            <sup className="ml-0.5 font-mono text-accent">1</sup>
          </div>

          <div className="mt-4 text-xs text-ink-faint">Konu</div>
          <div className="mt-0.5 text-sm font-medium text-ink">
            <mark className="bg-accent/15 px-0.5 text-accent-dark">
              ACİL:
            </mark>{" "}
            Hesabınız{" "}
            <mark className="bg-accent/15 px-0.5 text-accent-dark">
              24 saat içinde
            </mark>{" "}
            kapatılacaktır
            <sup className="ml-0.5 font-mono text-accent">2</sup>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-bg-soft/70 p-3 text-sm leading-relaxed text-ink-soft">
            Değerli Müşterimiz, hesabınızda olağandışı hareket tespit edildi.
            Kimliğinizi doğrulamak için hemen{" "}
            <span className="text-info underline decoration-info/40">
              bağlantıya tıklayın
            </span>
            .
          </div>

          {/* dipnotlar */}
          <dl className="mt-5 space-y-2 border-t border-line pt-4">
            <div className="flex gap-2 text-xs">
              <dt className="font-mono font-semibold text-accent">1</dt>
              <dd className="text-ink-soft">
                Sahte alan adı — resmî banka adresi değil.
              </dd>
            </div>
            <div className="flex gap-2 text-xs">
              <dt className="font-mono font-semibold text-accent">2</dt>
              <dd className="text-ink-soft">
                Yapay aciliyet — panikle düşünmeni engeller.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
        Senaryolardan biri — sen olsan tanır mıydın?
      </figcaption>
    </figure>
  );
}
