import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import MunicipalityItemsSection from "@/components/MunicipalityItemsSection";
import PageShell from "@/components/PageShell";
import SearchBox from "@/components/SearchBox";
import { categoryColorClasses } from "@/lib/categoryColor";
import { getCategoryDescription } from "@/lib/categoryDescriptions";
import { getMunicipalities, getMunicipalityById, getPrefectureById } from "@/lib/municipality";
import { getMunicipalityBasicInfo } from "@/lib/municipalityInfo";
import { buildOpenGraph } from "@/lib/site";

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
    openGraph: buildOpenGraph(title, description),
  };
}

function ItemsSectionFallback() {
  return (
    <section id="popular" className="mt-8 scroll-mt-16">
      <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">よく調べる品目</h2>
    </section>
  );
}

export default async function MunicipalityPage({ params }: MunicipalityPageProps) {
  const { prefecture: prefectureId, municipality: municipalityId } = await params;

  const municipality = getMunicipalityById(municipalityId);
  if (!municipality || municipality.prefecture_id !== prefectureId) notFound();

  const prefecture = getPrefectureById(prefectureId);
  const basicInfo = getMunicipalityBasicInfo(municipality.id);

  return (
    <PageShell>
      <div className="py-6">
        <Breadcrumbs
          items={[
            { name: "トップ", href: "/" },
            { name: prefecture?.name ?? prefectureId, href: `/${prefectureId}/` },
            { name: municipality.name },
          ]}
        />
        <h1 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">{municipality.name}のごみ分別</h1>
        <p className="mt-2 text-sm text-gray-600">
          {municipality.name}のごみの分別・出し方・収集方法をまとめています。品目名で検索するか、下の一覧から探してください。
        </p>

        <div className="mt-5">
          <SearchBox placeholder={`${municipality.name}のごみ品目を検索`} />
        </div>

        <section id="categories" className="mt-8 scroll-mt-16">
          <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">ごみの種類</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-300 text-left text-xs text-gray-500">
                  <th className="py-2 pr-3 font-semibold">種類</th>
                  <th className="hidden py-2 pr-3 font-semibold sm:table-cell">概要</th>
                  <th className="py-2 font-semibold">一覧</th>
                </tr>
              </thead>
              <tbody>
                {municipality.categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-200">
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-1.5 font-medium text-gray-900">
                        <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryColorClasses[category.color].dot}`} />
                        {category.name}
                      </span>
                      {getCategoryDescription(category.id) && (
                        <span className="mt-0.5 block text-xs text-gray-400 sm:hidden">{getCategoryDescription(category.id)}</span>
                      )}
                    </td>
                    <td className="hidden py-2.5 pr-3 text-gray-500 sm:table-cell">{getCategoryDescription(category.id) || "－"}</td>
                    <td className="py-2.5">
                      <a
                        href={`/${prefectureId}/${municipalityId}/?category=${category.id}`}
                        className="text-green-700 underline underline-offset-2 hover:text-green-800"
                      >
                        品目一覧 →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Suspense fallback={<ItemsSectionFallback />}>
          <MunicipalityItemsSection municipality={municipality} prefectureId={prefectureId} municipalityId={municipalityId} />
        </Suspense>

        {basicInfo && (
          <section className="mt-8">
            <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">{municipality.name}の基本情報</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <th className="w-1/3 py-2 pr-3 text-left font-semibold text-gray-500">自治体名</th>
                    <td className="py-2 text-gray-900">{municipality.name}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-3 text-left font-semibold text-gray-500">公式サイト</th>
                    <td className="py-2">
                      <a
                        href={basicInfo.officialSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-green-700 underline underline-offset-2 hover:text-green-800"
                      >
                        {basicInfo.officialSiteUrl}
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-3 text-left font-semibold text-gray-500">ごみ分別ページ</th>
                    <td className="py-2">
                      <a
                        href={basicInfo.wasteSortingSiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-green-700 underline underline-offset-2 hover:text-green-800"
                      >
                        {basicInfo.wasteSortingSiteName}
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-3 text-left font-semibold text-gray-500">問い合わせ先</th>
                    <td className="py-2 text-gray-900">
                      {basicInfo.contactName}　{basicInfo.contactPhone}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
