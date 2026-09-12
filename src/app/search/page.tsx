import type { Metadata } from "next";
import ItemCard from "@/components/ItemCard";
import SearchBox from "@/components/SearchBox";
import { searchItems } from "@/lib/search";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "検索結果",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchItems(query) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900">検索結果</h1>
      <div className="mt-6">
        <SearchBox defaultValue={query} />
      </div>

      <div className="mt-8">
        {query === "" ? (
          <p className="text-sm text-gray-500">調べたいごみの品目名を入力してください。</p>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500">「{query}」の検索結果 {results.length}件</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((result) => (
                <ItemCard
                  key={`${result.item.municipality_id}-${result.item.id}`}
                  name={result.item.name}
                  href={result.href}
                  categoryName={result.category?.name}
                  categoryColor={result.category?.color}
                  disposalMethod={result.item.disposal_method}
                  municipalityName={result.municipalityName}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-semibold text-gray-700">該当する品目が見つかりませんでした</p>
            <p className="mt-2 text-sm text-gray-500">
              「ソファ」→「ソファー」のように、別の呼び方でも検索してみてください。
            </p>
            <p className="mt-1 text-sm text-gray-500">最終的な分別方法は福岡市公式サイトでも確認できます。</p>
          </div>
        )}
      </div>
    </div>
  );
}
