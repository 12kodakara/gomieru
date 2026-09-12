import Link from "next/link";
import ItemCard from "@/components/ItemCard";
import SearchBox from "@/components/SearchBox";
import { getItemPath, getItemsByMunicipality, getPublishedItems } from "@/lib/items";
import {
  getCategoryById,
  getMunicipalitiesByPrefecture,
  getMunicipalityById,
  getMunicipalityPath,
  getPrefectures,
} from "@/lib/municipality";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata = {
  title: { absolute: `${SITE_TAGLINE}｜${SITE_NAME}` },
  alternates: { canonical: "/" },
};

// トップページに表示する「よく検索される品目」の上限。
// 品目データが増えても一覧が肥大化しないよう先頭N件のみ表示する。
const MAX_POPULAR_ITEMS = 6;

export default function HomePage() {
  const prefectures = getPrefectures();
  const popularItems = getPublishedItems().slice(0, MAX_POPULAR_ITEMS);
  const fukuokaCityItemCount = getItemsByMunicipality("fukuoka-city").length;

  return (
    <div>
      <section className="border-b border-green-100 bg-gradient-to-b from-green-50 to-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            このごみ、どう捨てる？が<span className="text-green-600">見える</span>。
          </h1>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">あなたの街のごみの捨て方をすぐに調べられます。</p>
          <div className="mx-auto mt-7 max-w-xl">
            <SearchBox />
          </div>
        </div>
      </section>

      <section id="regions" className="mx-auto max-w-3xl scroll-mt-16 px-4 py-10">
        <h2 className="text-lg font-bold text-gray-900">地域から探す</h2>
        <div className="mt-4 space-y-4">
          {prefectures.map((prefecture) => {
            const municipalities = getMunicipalitiesByPrefecture(prefecture.id);
            return (
              <div key={prefecture.id} className="rounded-xl border border-gray-200 p-4">
                <Link href={`/${prefecture.id}/`} className="text-base font-bold text-green-700 hover:underline">
                  {prefecture.name}
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  {municipalities.map((municipality) => (
                    <Link
                      key={municipality.id}
                      href={getMunicipalityPath(municipality)}
                      className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100"
                    >
                      {municipality.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {popularItems.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-14">
          <h2 className="text-lg font-bold text-gray-900">よく検索される品目</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {popularItems.map((item) => {
              const municipality = getMunicipalityById(item.municipality_id);
              if (!municipality) return null;
              const category = getCategoryById(municipality, item.category);
              return (
                <ItemCard
                  key={`${item.municipality_id}-${item.id}`}
                  name={item.name}
                  href={getItemPath(item, municipality)}
                  categoryName={category?.name}
                  categoryColor={category?.color}
                />
              );
            })}
          </div>
          <div className="mt-5 text-center">
            <Link
              href="/fukuoka/fukuoka-city/list/"
              className="inline-block rounded-lg border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100"
            >
              福岡市の品目一覧を見る（全{fukuokaCityItemCount}件）
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
