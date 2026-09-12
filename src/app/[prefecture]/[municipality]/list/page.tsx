import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ItemLinkGrid from "@/components/ItemLinkGrid";
import PageShell from "@/components/PageShell";
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
    <PageShell>
      <div className="py-6">
        <Breadcrumbs
          items={[
            { name: "トップ", href: "/" },
            { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
            { name: municipality.name, href: `/${prefectureId}/${municipalityId}/` },
            { name: "品目一覧" },
          ]}
        />
        <h1 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">{municipality.name}のごみ品目一覧</h1>
        <p className="mt-2 text-sm text-gray-600">確認できている品目は全{totalCount}件です。カテゴリごとにまとめています。</p>
        <p className="mt-1 text-xs text-gray-400">品目名を選ぶと、捨て方と注意点を確認できます。</p>

        <div className="mt-6 space-y-8">
          {municipality.categories.map((category) => {
            const items = getItemsByCategory(municipality.id, category.id);
            if (items.length === 0) return null;
            const colors = categoryColorClasses[category.color];

            return (
              <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-16">
                <h2 className={`flex items-center gap-2 border-l-2 pl-2 text-sm font-bold text-gray-900 ${colors.border}`}>
                  <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} />
                  {category.name}
                  <span className="text-xs font-normal text-gray-400">{items.length}件</span>
                </h2>
                <div className="mt-3">
                  <ItemLinkGrid items={items.map((item) => ({ name: item.name, href: getItemPath(item, municipality) }))} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
