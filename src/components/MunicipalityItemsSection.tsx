"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ItemRow from "./ItemRow";
import { getItemPath, getItemsByCategory, getItemsByMunicipality } from "@/lib/items";
import { getCategoryById } from "@/lib/municipality";
import type { Municipality } from "@/lib/types";

// カテゴリ未指定時の「よく調べる品目」に表示する上限。
// verified品目が増えても一覧が肥大化しないよう先頭N件のみ表示し、
// 全件は「品目一覧を見る」導線に誘導する。
const MAX_POPULAR_ITEMS = 8;

interface MunicipalityItemsSectionProps {
  municipality: Municipality;
  prefectureId: string;
  municipalityId: string;
}

/**
 * 静的エクスポート(output: "export")では ?category= をサーバー側で読めないため、
 * useSearchParams() でクライアント側から読み取り、絞り込みもブラウザ側で行う。
 * 呼び出し元(page.tsx)で <Suspense> に包むこと。
 */
export default function MunicipalityItemsSection({
  municipality,
  prefectureId,
  municipalityId,
}: MunicipalityItemsSectionProps) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ?? undefined;

  const allItems = getItemsByMunicipality(municipality.id);
  const selectedCategory = categoryId ? getCategoryById(municipality, categoryId) : undefined;
  const filteredItems = selectedCategory
    ? getItemsByCategory(municipality.id, selectedCategory.id)
    : allItems.slice(0, MAX_POPULAR_ITEMS);

  return (
    <section id="popular" className="mt-8 scroll-mt-16">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="border-l-2 border-green-700 pl-2 text-sm font-bold text-gray-900">
          {selectedCategory ? `「${selectedCategory.name}」の品目` : "よく調べる品目"}
        </h2>
        {selectedCategory && (
          <Link href={`/${prefectureId}/${municipalityId}/`} className="shrink-0 text-xs text-green-700 hover:underline">
            絞り込みを解除
          </Link>
        )}
      </div>
      {filteredItems.length > 0 ? (
        <ul className="mt-3 divide-y divide-gray-200 border-y border-gray-200">
          {filteredItems.map((item) => {
            const category = getCategoryById(municipality, item.category);
            return (
              <ItemRow
                key={item.id}
                name={item.name}
                href={getItemPath(item, municipality)}
                categoryName={category?.name}
                categoryColor={category?.color}
                disposalMethod={item.disposal_method}
              />
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-gray-400">該当する品目のデータは準備中です。</p>
      )}
      <p className="mt-3 text-sm">
        <Link href={`/${prefectureId}/${municipalityId}/list/`} className="text-green-700 underline underline-offset-2 hover:text-green-800">
          品目一覧を見る（全{allItems.length}件）
        </Link>
      </p>
    </section>
  );
}
