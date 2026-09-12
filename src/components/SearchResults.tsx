"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ItemCard from "./ItemCard";
import SearchBox from "./SearchBox";
import { searchItems } from "@/lib/search";

/**
 * 静的エクスポート(output: "export")では searchParams をサーバー側で読めないため、
 * useSearchParams() でクライアント側から読み取り、検索処理もブラウザ側で行う。
 * 呼び出し元(page.tsx)で <Suspense> に包むこと。
 */
export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const results = useMemo(() => (query ? searchItems(query) : []), [query]);

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
            <p className="text-sm text-gray-500">
              「{query}」の検索結果 {results.length}件
            </p>
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
