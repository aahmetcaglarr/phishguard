import Link from "next/link";
import { ArrowRightIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <span className="eyebrow justify-center">Hata 404</span>
        <h1 className="mt-5 font-display text-6xl font-medium text-ink">
          Sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-soft">
          Aradığın sayfa burada değil — belki de bu bir tuzaktı.
        </p>
        <Link href="/" className="btn-primary mx-auto mt-7 px-6 py-3.5">
          Ana sayfaya dön
          <ArrowRightIcon width={18} height={18} />
        </Link>
      </div>
    </div>
  );
}
