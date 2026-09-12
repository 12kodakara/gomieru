import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

const TITLE = "このサイトについて";
const DESCRIPTION = `${SITE_NAME}がどのようなサイトか、情報の集め方や取り扱い方針をご案内します。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about/" },
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: TITLE }]} />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">このサイトについて</h1>

      <div className="mt-6 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900">「{SITE_NAME}」とは</h2>
          <p className="mt-2">
            「{SITE_NAME}」は、自治体ごとに異なるごみの分別方法や捨て方を、誰でも短時間で調べられるようにすることを目指した情報サイトです。「これはどのごみ？」「どうやって出せばいい？」といった疑問に、できるだけ分かりやすくお答えします。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">現在の対応地域</h2>
          <p className="mt-2">
            現在は福岡県福岡市の情報から掲載を開始しています。今後、他の自治体の情報にも順次対応地域を拡大していく予定です。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">情報の集め方</h2>
          <p className="mt-2">
            掲載している分別方法・出し方などの情報は、各自治体が公開している公式サイトの情報を確認したうえで整理・掲載しています。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">正確性についてのお願い</h2>
          <p className="mt-2">
            できる限り正確な情報の掲載に努めていますが、ごみの分別方法・収集方法・料金・制度などは、各自治体の都合により変更される場合があります。最終的なご判断は、必ず各自治体の公式サイトなど公式情報でご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900">運営について</h2>
          <p className="mt-2">
            「{SITE_NAME}」は、自治体・行政機関が運営する公式サイトではありません。個人・民間による情報提供サイトです。
          </p>
        </section>
      </div>
    </div>
  );
}
