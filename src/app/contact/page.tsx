import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

const TITLE = "お問い合わせ";
const DESCRIPTION = `${SITE_NAME}の掲載情報についてのご指摘・お問い合わせ方法をご案内します。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact/" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: TITLE }]} />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">お問い合わせ</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900">お問い合わせいただける内容</h2>
          <p className="mt-2">「{SITE_NAME}」に関する、以下のようなお問い合わせを受け付けています。</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>掲載している情報の誤りについてのご指摘</li>
            <li>分類・捨て方についての情報修正のご依頼</li>
            <li>サイトの使い方など、サイトそのものに関するお問い合わせ</li>
          </ul>
        </section>

        {CONTACT_EMAIL ? (
          <section>
            <h2 className="text-base font-bold text-gray-900">お問い合わせ先</h2>
            <p className="mt-2">下記のメールアドレスまでご連絡ください。</p>
            <p className="mt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-semibold text-green-700 underline underline-offset-2 hover:text-green-800"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        ) : (
          <section>
            <h2 className="text-base font-bold text-gray-900">お問い合わせ先</h2>
            <p className="mt-2">
              現在、お問い合わせ窓口を準備中です。お手数をおかけしますが、しばらくお待ちください。
            </p>
          </section>
        )}

        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-base font-bold text-amber-900">ごみの収集日・個別のごみ処理についてのご質問</h2>
          <p className="mt-2 text-amber-900">
            お住まいの地域のごみ収集日、粗大ごみの申し込み、個別の品目の取り扱いなど、行政による判断が必要なお問い合わせについては、「{SITE_NAME}」ではお答えできません。福岡市など、お住まいの自治体の窓口へ直接お問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
