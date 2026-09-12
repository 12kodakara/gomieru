import fukuokaCityItems from "@/data/items/fukuoka-city.json";
import type { Municipality, WasteItem } from "./types";
import { validateItems } from "./validateItems";

/**
 * 自治体ごとの品目データレジストリ。
 * 新しい自治体を追加する際は data/items/<municipality_id>.json を作成し、ここに登録する。
 */
const itemsByMunicipality: Record<string, WasteItem[]> = {
  "fukuoka-city": fukuokaCityItems as WasteItem[],
};

const allItemsRaw: WasteItem[] = Object.values(itemsByMunicipality).flat();

if (process.env.NODE_ENV !== "production") {
  const issues = validateItems(allItemsRaw);
  if (issues.length > 0) {
    console.warn(
      `[data-validation] verified品目に ${issues.length} 件の問題があります:\n` +
        issues.map((issue) => `  - ${issue.message}`).join("\n"),
    );
  }
}

function isPublished(item: WasteItem): boolean {
  return item.data_status === "verified";
}

/** 全品目（draftを含む、内部検証用）。公開ページからは使用しないこと。 */
export function getAllItems(): WasteItem[] {
  return allItemsRaw;
}

/** verified品目のみ。全自治体横断。トップページ・検索で使用。 */
export function getPublishedItems(): WasteItem[] {
  return allItemsRaw.filter(isPublished);
}

/** トップページ・サイドナビの「よく調べる品目」表示用に、先頭N件のverified品目を返す。 */
export function getPopularItems(limit: number): WasteItem[] {
  return getPublishedItems().slice(0, limit);
}

/** 指定自治体のverified品目のみ。 */
export function getItemsByMunicipality(municipalityId: string): WasteItem[] {
  return (itemsByMunicipality[municipalityId] ?? []).filter(isPublished);
}

export function getItemsByCategory(municipalityId: string, categoryId: string): WasteItem[] {
  return getItemsByMunicipality(municipalityId).filter((item) => item.category === categoryId);
}

/**
 * 「燃えるごみ」「燃えないごみ」「市で収集しないもの」は対象範囲が広く、
 * 同じカテゴリというだけでは関連性が薄い組み合わせになりやすい
 * (例:「布団」と「生ごみ」が同じ「燃えるごみ」)。
 * これらのカテゴリでは、品目名・別名が実際に重なるものだけを関連品目として扱う。
 */
const BROAD_CATEGORY_IDS = new Set(["moeru", "moenai", "not-collected"]);

function normalizeForRelation(value: string): string {
  return value.replace(/[\s・･]/g, "");
}

function isNameRelated(a: WasteItem, b: WasteItem): boolean {
  const aTerms = [a.name, ...a.aliases].map(normalizeForRelation).filter((term) => term.length >= 2);
  const bTerms = [b.name, ...b.aliases].map(normalizeForRelation).filter((term) => term.length >= 2);
  return aTerms.some((at) => bTerms.some((bt) => at.includes(bt) || bt.includes(at)));
}

/**
 * 品目詳細ページ「関連する品目」用。同カテゴリ・同自治体・verified品目を基本とし、
 * 対象範囲が広いカテゴリでは名前・別名が実際に重なるものだけにさらに絞り込む。
 * 適切な候補がなければ空配列を返し、無理に件数を埋めない。
 */
export function getRelatedItems(item: WasteItem, limit: number): WasteItem[] {
  const sameCategory = getItemsByCategory(item.municipality_id, item.category).filter((other) => other.id !== item.id);
  const candidates = BROAD_CATEGORY_IDS.has(item.category)
    ? sameCategory.filter((other) => isNameRelated(item, other))
    : sameCategory;
  return candidates.slice(0, limit);
}

/** verified品目のみ返す。draftはnotFound相当として扱われる。 */
export function getItemById(municipalityId: string, itemId: string): WasteItem | undefined {
  return getItemsByMunicipality(municipalityId).find((item) => item.id === itemId);
}

export function getItemPath(item: WasteItem, municipality: Municipality): string {
  return `/${municipality.prefecture_id}/${municipality.id}/${item.id}/`;
}

export function getItemSourceUrl(item: WasteItem): string | undefined {
  return item.source_url ?? item.official_url;
}

export function getItemCheckedAt(item: WasteItem): string | undefined {
  return item.source_checked_at ?? item.last_checked;
}

export function getItemSourceTitle(item: WasteItem, municipality: Municipality): string {
  return item.source_title ?? `${municipality.name}公式サイト`;
}
