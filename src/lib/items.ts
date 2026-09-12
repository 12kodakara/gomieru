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

/** 指定自治体のverified品目のみ。 */
export function getItemsByMunicipality(municipalityId: string): WasteItem[] {
  return (itemsByMunicipality[municipalityId] ?? []).filter(isPublished);
}

export function getItemsByCategory(municipalityId: string, categoryId: string): WasteItem[] {
  return getItemsByMunicipality(municipalityId).filter((item) => item.category === categoryId);
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
