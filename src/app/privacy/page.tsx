import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

const TITLE = "プライバシーポリシー";
const DESCRIPTION = `${SITE_NAME}における個人情報の取り扱い、アクセス解析・広告配信の可能性、Cookieの利用等についてご案内します。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy/" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: TITLE }]} />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">プライバシーポリシー</h1>
      <p className="mt-2 text-sm text-gray-500">
        「{SITE_NAME}」（以下「当サイト」といいます）における、利用者情報の取り扱いについて説明します。
      </p>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900">個人情報の取り扱いについて</h2>
          <p className="mt-2">
            当サイトは、現時点では会員登録やお問い合わせフォームなど、利用者が個人情報を入力する仕組みを設けていません。今後、そうした機能を追加する場合は、取得する情報の範囲や利用目的をこのページで改めてご案内します。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">アクセス解析について</h2>
          <p className="mt-2">
            当サイトでは、サイトの改善を目的として、Google Analyticsなどのアクセス解析サービスを利用する場合があります。導入した場合、これらのサービスはCookie等を利用して、個人を特定しない形でアクセス状況（閲覧ページ、滞在時間、利用端末の種類など）を収集することがあります。取得されたデータの取り扱いについては、各サービス提供者のプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">広告配信について</h2>
          <p className="mt-2">
            当サイトでは、運営維持のため、Google
            AdSenseなどの第三者配信事業者による広告サービスを利用する場合があります。導入した場合、広告配信事業者は、利用者の興味・関心に応じた広告を表示するために、Cookie等を使用して当サイトや他サイトへのアクセス情報を利用することがあります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">Cookieについて</h2>
          <p className="mt-2">
            Cookieとは、利用者のブラウザに保存される情報で、サイトの利用状況を記憶する仕組みです。上記のアクセス解析・広告配信サービスを導入した場合、これらのサービスによってCookieが使用されることがあります。Cookieの利用を望まない場合は、ブラウザの設定によりCookieを無効にすることができます。ただし、その場合、当サイトの一部機能が正しく動作しない可能性があります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">第三者配信事業者について</h2>
          <p className="mt-2">
            アクセス解析・広告配信サービスを提供する第三者事業者は、それぞれ独自のプライバシーポリシーに基づいてデータを取り扱います。当サイトは、これら第三者事業者によるデータの取り扱いについて、直接管理する立場にありません。各事業者のポリシーについては、各事業者の公式サイトをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">外部リンクについて</h2>
          <p className="mt-2">
            当サイトには、各自治体の公式サイトなど外部サイトへのリンクを掲載しています。リンク先のサイトで提供される情報の正確性やプライバシーに関する取り扱いについて、当サイトは責任を負いかねます。リンク先のサイトをご利用の際は、各サイトの利用規約・プライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">免責事項</h2>
          <p className="mt-2">
            当サイトは、掲載内容の正確性・完全性・有用性についてできる限りの注意を払っていますが、これを保証するものではありません。ごみの分別・収集方法・料金・制度は自治体の都合により変更される場合があります。当サイトの情報を利用したことにより生じたいかなる損害についても、当サイトは責任を負いかねます。最終的なご判断は、必ず各自治体の公式情報をご確認のうえ行ってください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">著作権について</h2>
          <p className="mt-2">
            当サイトに掲載している文章・構成等の著作権は、特に明記がない限り当サイトに帰属します。自治体公式サイト等から確認した情報を参考に作成したコンテンツについては、出典元を明記するよう努めています。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">プライバシーポリシーの変更について</h2>
          <p className="mt-2">
            当サイトは、法令の変更やサービス内容の変更等に応じて、本ポリシーの内容を予告なく変更することがあります。変更後の内容は、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">お問い合わせ窓口</h2>
          <p className="mt-2">
            本ポリシーに関するお問い合わせは、
            <Link href="/contact/" className="text-green-700 underline underline-offset-2 hover:text-green-800">
              お問い合わせページ
            </Link>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
