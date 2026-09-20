import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageShell from "@/components/PageShell";
import { getMunicipalitiesByPrefecture, getPrefectureById, getPrefectures } from "@/lib/municipality";
import { buildOpenGraph } from "@/lib/site";

interface PrefecturePageProps {
  params: Promise<{ prefecture: string }>;
}

export function generateStaticParams() {
  return getPrefectures().map((prefecture) => ({ prefecture: prefecture.id }));
}

export async function generateMetadata({ params }: PrefecturePageProps): Promise<Metadata> {
  const { prefecture: prefectureId } = await params;
  const prefecture = getPrefectureById(prefectureId);
  if (!prefecture) return {};

  const title = `${prefecture.name}のごみ・リサイクル情報`;
  const description = `${prefecture.name}内の自治体別に、ごみの分別・リサイクル・捨て方を検索できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefecture.id}/` },
    openGraph: buildOpenGraph(title, description),
  };
}

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { prefecture: prefectureId } = await params;
  const prefecture = getPrefectureById(prefectureId);
  if (!prefecture) notFound();

  const municipalities = getMunicipalitiesByPrefecture(prefecture.id);

  return (
    <PageShell>
      <div className="py-6">
        <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: prefecture.name }]} />
        <h1 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">{prefecture.name}のごみ・リサイクル情報</h1>
        <p className="mt-2 text-sm text-gray-600">市区町村を選んで、ごみの分別・捨て方を確認できます。</p>

        <section className="mt-6">
          <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">市区町村から探す</h2>
          {municipalities.length > 0 ? (
            <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
              {municipalities.map((municipality) => (
                <li key={municipality.id}>
                  <Link
                    href={`/${prefecture.id}/${municipality.id}/`}
                    className="block py-2.5 text-sm font-medium text-gray-900 hover:text-green-700"
                  >
                    {municipality.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-gray-400">この都道府県のデータは準備中です。</p>
          )}
        </section>
      </div>
    </PageShell>
  );
}
