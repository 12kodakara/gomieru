import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { categoryColorClasses } from "@/lib/categoryColor";
import { getItemPath, getItemsByCategory, getItemsByMunicipality } from "@/lib/items";
import { getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";

interface ItemListPageProps {
  params: Promise<{ prefecture: string; municipality: string }>;
}

export function generateStaticParams() {
  return getMunicipalities().map((municipality) => ({
    prefecture: municipality.prefecture_id,
    municipality: municipality.id,
  }));
}

export async function generateMetadata({ params }: ItemListPageProps): Promise<Metadata> {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) return {};

  const title = `${municipality.name}のごみ品目一覧`;
  const description = `${municipality.name}で確認済みのごみ・資源品目をカテゴリ別に一覧で探せます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefectureId}/${municipalityId}/list/` },
    openGraph: { title, description },
  };
}

export default async function ItemListPage({ params }: ItemListPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const prefecture = getPrefectureById(prefectureId);
  const totalCount = getItemsByMunicipality(municipality.id).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/" },
          { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
          { name: municipality.name, href: `/${prefectureId}/${municipalityId}/` },
          { name: "品目一覧" },
        ]}
      />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">{municipality.name}のごみ品目一覧</h1>
      <p className="mt-2 text-sm text-gray-500">確認できている品目は全{totalCount}件です。カテゴリごとにまとめています。</p>
      <p className="mt-1 text-xs text-gray-400">品目名を選ぶと、捨て方と注意点を確認できます。</p>

      <div className="mt-8 space-y-10">
        {municipality.categories.map((category) => {
          const items = getItemsByCategory(municipality.id, category.id);
          if (items.length === 0) return null;
          const colors = categoryColorClasses[category.color];

          return (
            <section key={category.id}>
              <div className={`flex items-center gap-2 rounded-lg border-l-4 ${colors.border} bg-gray-50 px-3 py-2`}>
                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${colors.bg} ${colors.text}`}>
                  {category.name}
                </span>
                <span className="text-xs text-gray-400">{items.length}件</span>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={getItemPath(item, municipality)}
                      className="block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:border-green-400 hover:bg-green-50 hover:text-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
