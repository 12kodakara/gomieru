import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import MunicipalityItemsSection from "@/components/MunicipalityItemsSection";
import SearchBox from "@/components/SearchBox";
import { getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";

interface MunicipalityPageProps {
  params: Promise<{ prefecture: string; municipality: string }>;
}

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

function ItemsSectionFallback() {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-gray-900">よく検索される品目</h2>
    </section>
  );
}

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;

  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const prefecture = getPrefectureById(prefectureId);

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

      <Suspense fallback={<ItemsSectionFallback />}>
        <MunicipalityItemsSection municipality={municipality} prefectureId={prefectureId} municipalityId={municipalityId} />
      </Suspense>
    </div>
  );
}
