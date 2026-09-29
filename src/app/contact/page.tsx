import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageShell from "@/components/PageShell";
import { CONTACT_FORM_URL, SITE_NAME, buildOpenGraph } from "@/lib/site";

const TITLE = "お問い合わせ";
const DESCRIPTION = `${SITE_NAME}の掲載内容へのご質問、情報の修正依頼、不具合のご報告などを受け付けるお問い合わせフォームのご案内です。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/contact/" },
  openGraph: buildOpenGraph(TITLE, DESCRIPTION),
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="py-6">
        <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: TITLE }]} />
        <h1 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">お問い合わせ</h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900">お問い合わせいただける内容</h2>
          <p className="mt-2">「{SITE_NAME}」に関する、以下のようなお問い合わせをお問い合わせフォームで受け付けています。</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>掲載内容についてのご質問</li>
            <li>分類・捨て方など、掲載情報の修正のご依頼</li>
            <li>表示の崩れやリンク切れなど、不具合のご報告</li>
            <li>その他、サイトに関するお問い合わせ</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">お問い合わせ方法</h2>
          <p className="mt-2">
            下のボタンから、Googleフォームのお問い合わせページ（外部サイト）へ移動します。内容をご入力のうえ送信してください。
          </p>
          <p className="mt-4">
            <a
              href={CONTACT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center gap-1 rounded-lg bg-green-700 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:w-auto"
            >
              お問い合わせフォームを開く
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(外部サイトのGoogleフォームが新しいタブで開きます)</span>
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-500">Googleフォームが新しいタブで開きます。</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-600">
            <li>お名前・メールアドレスの入力は任意です。返信をご希望の場合は、メールアドレスをご入力ください。</li>
            <li>いただいた内容は確認のうえ、必要に応じて対応します。内容によっては返信・対応できない場合があります。あらかじめご了承ください。</li>
            <li>
              ご入力いただいた情報の取り扱いについては、
              <Link href="/privacy/" className="text-green-700 underline underline-offset-2 hover:text-green-800">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </li>
          </ul>
        </section>

        <section className="border-l-2 border-amber-500 pl-3">
          <h2 className="text-base font-bold text-gray-900">ごみの収集日・個別のごみ処理についてのご質問</h2>
          <p className="mt-2 text-gray-700">
            お住まいの地域のごみ収集日、粗大ごみの申し込み、個別の品目の取り扱いなど、行政による判断が必要なお問い合わせについては、「{SITE_NAME}」ではお答えできません。福岡市など、お住まいの自治体の窓口へ直接お問い合わせください。
          </p>
        </section>
        </div>
      </div>
    </PageShell>
  );
}
