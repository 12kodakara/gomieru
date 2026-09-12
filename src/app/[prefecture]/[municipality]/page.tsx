import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
import SearchBox from "@/components/SearchBox";
import { getItemPath, getItemsByCategory, getItemsByMunicipality } from "@/lib/items";
import { getCategoryById, getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";

interface MunicipalityPageProps {
  params: Promise<{ prefecture: string; municipality: string }>;
  searchParams: Promise<{ category?: string }>;
}

// カテゴリ未指定時の「よく検索される品目」に表示する上限。
// verified品目が増えても一覧が肥大化しないよう先頭N件のみ表示し、
// 全件は「品目一覧を見る」導線に誘導する。
const MAX_POPULAR_ITEMS = 8;

export function generateStaticParams() {
  return getMunicipalities().map((municipality) => ({
    prefecture: municipality.prefecture_id,
    municipality: municipality.id,
  }));
}

export async function generateMetadata({ params }: MunicipalityPageProps): Promise<Metadata> {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) return {};

  const title = `${municipality.name}のごみ分別・捨て方検索`;
  const description = `${municipality.name}のごみ分別・リサイクル・捨て方を品目やカテゴリから検索できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefectureId}/${municipalityId}/` },
    openGraph: { title, description },
  };
}

export default async function MunicipalityPage({ params, searchParams }: MunicipalityPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;
  const { category: categoryId } = await searchParams;

  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const prefecture = getPrefectureById(prefectureId);
  const allItems = getItemsByMunicipality(municipality.id);
  const selectedCategory = categoryId ? getCategoryById(municipality, categoryId) : undefined;
  const filteredItems = selectedCategory
    ? getItemsByCategory(municipality.id, selectedCategory.id)
    : allItems.slice(0, MAX_POPULAR_ITEMS);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "トップ", href: "/" },
          { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
          { name: municipality.name },
        ]}
      />
      <h1 className="mt-3 text-2xl font-extrabold text-gray-900">{municipality.name}のごみ・リサイクル・捨て方検索</h1>
      <p className="mt-2 text-sm text-gray-500">品目名で検索するか、ごみの種類から探してください。</p>

      <div className="mt-6">
        <SearchBox placeholder={`${municipality.name}のごみ品目を検索`} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-gray-900">ごみの種類から探す</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {municipality.categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              href={`/${prefectureId}/${municipalityId}/?category=${category.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-gray-900">
            {selectedCategory ? `「${selectedCategory.name}」の品目` : "よく検索される品目"}
          </h2>
          {selectedCategory && (
            <Link href={`/${prefectureId}/${municipalityId}/`} className="shrink-0 text-xs text-green-700 hover:underline">
              絞り込みを解除
            </Link>
          )}
        </div>
        {filteredItems.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredItems.map((item) => {
              const category = getCategoryById(municipality, item.category);
              return (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  href={getItemPath(item, municipality)}
                  categoryName={category?.name}
                  categoryColor={category?.color}
                  disposalMethod={item.disposal_method}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-400">該当する品目のデータは準備中です。</p>
        )}
        <div className="mt-5 text-center">
          <Link
            href={`/${prefectureId}/${municipalityId}/list/`}
            className="inline-block rounded-lg border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100"
          >
            品目一覧を見る（全{allItems.length}件）
          </Link>
        </div>
      </section>
    </div>
  );
}
