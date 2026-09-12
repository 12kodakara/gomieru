import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ItemConclusion from "@/components/ItemConclusion";
import PageShell from "@/components/PageShell";
import SearchBox from "@/components/SearchBox";
import { getItemById, getItemsByMunicipality } from "@/lib/items";
import { getCategoryById, getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";

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
  const title = `${municipality.name}で${item.name}を捨てる方法`;
  const description = `${municipality.name}での${item.name}の捨て方は「${category?.name ?? "-"}」です。出し方・注意点・公式情報をまとめて確認できます。`;

  return {
    title,
    description,
    alternates: { canonical: `/${prefectureId}/${municipalityId}/${itemId}/` },
    openGraph: { title, description },
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
