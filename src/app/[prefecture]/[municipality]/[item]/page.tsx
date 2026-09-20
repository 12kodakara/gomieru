import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ItemConclusion from "@/components/ItemConclusion";
import PageShell from "@/components/PageShell";
import SearchBox from "@/components/SearchBox";
import { getItemById, getItemsByMunicipality } from "@/lib/items";
import { getCategoryById, getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";
import { buildOpenGraph } from "@/lib/site";

interface ItemPageProps {
  params: Promise<{ prefecture: string; municipality: string; item: string }>;
}

export function generateStaticParams() {
  return getMunicipalities().flatMap((municipality) =>
    getItemsByMunicipality(municipality.id).map((item) => ({
      prefecture: municipality.prefecture_id,
      municipality: municipality.id,
      item: item.id,
    })),
  );
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { prefecture: prefectureId, municipality: municipalityId, item: itemId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) return {};

  const item = getItemById(municipality.id, itemId);
  if (!item) return {};

  const category = getCategoryById(municipality, item.category);
  // 品目ページ本文の「結論」欄と同じ考え方で、disposal_methodがあればそちらを優先する
  // (categoryの名称より具体的なため)。H1と同じ語順にすることでtitle/H1の一貫性を保つ。
  const conclusionText = item.disposal_method ?? category?.name ?? "分類情報準備中";
  const title = `${item.name}の捨て方（${municipality.name}）`;
  const description =
    item.conditions && item.conditions.length > 0
      ? `${municipality.name}で${item.name}を捨てる場合、基本の分別は「${conclusionText}」です。条件によって分別が変わるケースも含め、出し方・注意点・${municipality.name}の公式情報をまとめて確認できます。`
      : `${municipality.name}で${item.name}を捨てる場合の分別は「${conclusionText}」です。具体的な出し方や注意点、${municipality.name}の公式情報への案内をまとめて確認できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefectureId}/${municipalityId}/${itemId}/` },
    openGraph: buildOpenGraph(title, description),
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId, item: itemId } = await params;
  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const item = getItemById(municipality.id, itemId);
  if (!item) notFound();

  const prefecture = getPrefectureById(prefectureId);
  const category = getCategoryById(municipality, item.category);

  return (
    <PageShell>
      <div className="py-6">
        <Breadcrumbs
          items={[
            { name: "トップ", href: "/" },
            { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
            { name: municipality.name, href: `/${prefectureId}/${municipalityId}/` },
            { name: item.name },
          ]}
        />
        <p className="mt-3 text-sm text-gray-500">{municipality.name}のごみ分別</p>
        <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
          {item.name}の捨て方（{municipality.name}）
        </h1>

        <div className="mt-5">
          <ItemConclusion item={item} municipality={municipality} category={category} />
        </div>

        <section className="mt-6">
          <h2 className="border-l-2 border-green-700 pl-2 text-base font-bold text-gray-900">他の品目を調べる</h2>
          <div className="mt-3">
            <SearchBox placeholder={`${municipality.name}のごみ品目を検索`} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
