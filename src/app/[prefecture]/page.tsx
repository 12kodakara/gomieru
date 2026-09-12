import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getMunicipalitiesByPrefecture, getPrefectureById, getPrefectures } from "@/lib/municipality";

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
    openGraph: { title, description },
  };
}

export default async function PrefecturePage({ params }: PrefecturePageProps) {
  const { prefecture: prefectureId } = await params;
  const prefecture = getPrefectureById(prefectureId);
  if (!prefecture) notFound();

  const municipalities = getMunicipalitiesByPrefecture(prefecture.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ name: "トップ", href: "/" }, { name: prefecture.name }]} />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">{prefecture.name}のごみ・リサイクル情報</h1>
      <p className="mt-2 text-sm text-gray-500">市区町村を選んで、ごみの分別・捨て方を確認できます。</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-gray-900">市区町村から探す</h2>
        {municipalities.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {municipalities.map((municipality) => (
              <Link
                key={municipality.id}
                href={`/${prefecture.id}/${municipality.id}/`}
                className="rounded-xl border border-gray-200 bg-white p-4 font-bold text-gray-900 transition hover:border-green-400 hover:shadow-md"
              >
                {municipality.name}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">この都道府県のデータは準備中です。</p>
        )}
      </section>
    </div>
  );
}
