import Link from "next/link";
import IconBadge from "@/components/IconBadge";
import ItemLinkGrid from "@/components/ItemLinkGrid";
import PageShell from "@/components/PageShell";
import SearchBox from "@/components/SearchBox";
import { categoryColorClasses } from "@/lib/categoryColor";
import { categoryIconComponents, itemIconComponents } from "@/lib/iconMap";
import { getItemPath, getItemsByMunicipality, getPopularItems } from "@/lib/items";
import {
  getCategoryById,
  getMunicipalitiesByPrefecture,
  getMunicipalityById,
  getMunicipalityPath,
  getPrefectures,
} from "@/lib/municipality";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata = {
  title: { absolute: `${SITE_TAGLINE}｜${SITE_NAME}` },
  alternates: { canonical: "/" },
};

// トップページに表示する「よく調べる品目」の上限。
// 品目データが増えても一覧が肥大化しないよう先頭N件のみ表示する。
const MAX_POPULAR_ITEMS = 8;

export default function HomePage() {
  const prefectures = getPrefectures();
  const popularItems = getPopularItems(MAX_POPULAR_ITEMS);
  const fukuokaCityItemCount = getItemsByMunicipality("fukuoka-city").length;
  const fukuokaCity = getMunicipalityById("fukuoka-city");

  // サイト内検索(/search/?q=...)が実際に機能していることを確認したうえで設定する
  // WebSite + SearchAction。Googleのsitelinks検索ボックスの対象になり得る。
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <div className="py-6">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-5 sm:p-6">
          <h1 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl md:text-3xl">
            捨てたいものを入力するだけ。
            <br />
            ごみの出し方が、すぐ見える。
          </h1>

          <section id="regions" className="mt-5 scroll-mt-16">
            <h2 className="text-xs font-bold text-gray-400">地域を選ぶ</h2>
            <div className="mt-1.5 divide-y divide-gray-200 border-y border-gray-200">
              {prefectures.map((prefecture) => {
                const municipalities = getMunicipalitiesByPrefecture(prefecture.id);
                return (
                  <div key={prefecture.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2.5 text-sm">
                    <Link href={`/${prefecture.id}/`} className="font-bold text-gray-900 hover:text-green-700">
                      {prefecture.name}
                    </Link>
                    {municipalities.map((municipality) => (
                      <Link
                        key={municipality.id}
                        href={getMunicipalityPath(municipality)}
                        className="text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-green-700 hover:decoration-green-700"
                      >
                        {municipality.name}
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-5">
            <SearchBox />
          </div>

          <ol
            id="guide"
            className="mt-4 flex scroll-mt-16 flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-gray-600 sm:gap-x-3 sm:text-sm"
          >
            <li className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 text-[11px] font-bold text-gray-500">
                1
              </span>
              地域を選ぶ
            </li>
            <li aria-hidden="true" className="text-gray-300">
              →
            </li>
            <li className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 text-[11px] font-bold text-gray-500">
                2
              </span>
              品目を入力
            </li>
            <li aria-hidden="true" className="text-gray-300">
              →
            </li>
            <li className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 text-[11px] font-bold text-gray-500">
                3
              </span>
              答えを見る
            </li>
          </ol>
        </div>

        {fukuokaCity && (
          <section className="mt-8">
            <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">ごみの種類</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
              {fukuokaCity.categories.map((category) => {
                const colors = categoryColorClasses[category.color];
                const Icon = categoryIconComponents[category.id];
                return (
                  <li key={category.id}>
                    <Link
                      href={`/fukuoka/fukuoka-city/?category=${category.id}`}
                      className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-green-700"
                    >
                      {Icon ? (
                        <IconBadge icon={Icon} bgClassName={colors.iconBg} colorClassName={colors.text} />
                      ) : (
                        <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
                      )}
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {popularItems.length > 0 && (
          <section id="popular" className="mt-8 scroll-mt-16">
            <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">よく調べる品目</h2>
            <div className="mt-3">
              <ItemLinkGrid
                items={popularItems.flatMap((item) => {
                  const municipality = getMunicipalityById(item.municipality_id);
                  if (!municipality) return [];
                  const category = getCategoryById(municipality, item.category);
                  return [
                    {
                      name: item.name,
                      href: getItemPath(item, municipality),
                      categoryName: category?.name,
                      categoryColor: category?.color,
                      icon: itemIconComponents[item.id] ?? (category ? categoryIconComponents[category.id] : undefined),
                    },
                  ];
                })}
              />
            </div>
            <p className="mt-3 text-sm">
              <Link href="/fukuoka/fukuoka-city/list/" className="text-green-700 underline underline-offset-2 hover:text-green-800">
                福岡市の品目一覧を見る（全{fukuokaCityItemCount}件）
              </Link>
            </p>
          </section>
        )}
      </div>
    </PageShell>
  );
}
