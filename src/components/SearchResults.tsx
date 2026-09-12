"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ItemConclusion from "./ItemConclusion";
import ItemRow from "./ItemRow";
import SearchBox from "./SearchBox";
import { getMunicipalityById } from "@/lib/municipality";
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
  const singleResult = results.length === 1 ? results[0] : undefined;
  const singleMunicipality = singleResult ? getMunicipalityById(singleResult.item.municipality_id) : undefined;

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">検索結果</h1>
      <div className="mt-5">
        <SearchBox defaultValue={query} />
      </div>

      <div className="mt-6">
        {query === "" ? (
          <p className="text-sm text-gray-500">調べたいごみの品目名を入力してください。</p>
        ) : singleResult && singleMunicipality ? (
          <>
            <p className="text-sm text-gray-500">{singleMunicipality.name}</p>
            <h2 className="mt-0.5 text-lg font-bold text-gray-900">{singleResult.item.name}</h2>
            <div className="mt-4">
              <ItemConclusion item={singleResult.item} municipality={singleMunicipality} category={singleResult.category} />
            </div>
            <p className="mt-4 text-sm">
              <Link href={singleResult.href} className="text-green-700 underline underline-offset-2 hover:text-green-800">
                この品目のページを見る
              </Link>
            </p>
          </>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500">
              「{query}」の検索結果 {results.length}件
            </p>
            <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
              {results.map((result) => (
                <ItemRow
                  key={`${result.item.municipality_id}-${result.item.id}`}
                  name={result.item.name}
                  href={result.href}
                  categoryName={result.category?.name}
                  categoryColor={result.category?.color}
                  disposalMethod={result.item.disposal_method}
                  municipalityName={result.municipalityName}
                />
              ))}
            </ul>
          </>
        ) : (
          <div className="border-t border-gray-200 pt-5">
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
