import { getItemPath, getPublishedItems } from "./items";
import { getMunicipalityById } from "./municipality";
import type { Category, WasteItem } from "./types";

export interface SearchResult {
  item: WasteItem;
  municipalityName: string;
  category?: Category;
  href: string;
}

/** オートコンプリート用の軽量な候補データ（品目の全文は持たない）。 */
export interface SearchSuggestion {
  id: string;
  name: string;
  aliases: string[];
  categoryName?: string;
  disposalMethod?: string;
  municipalityName: string;
  href: string;
}

function toHiragana(value: string): string {
  return value.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

/**
 * 全角/半角・ひらがな/カタカナ・大文字/小文字・空白の違いを吸収して比較できるようにする。
 * 例: "チャリ" と "ちゃり"、"電子 レンジ" と "電子レンジ" は同一視される。
 */
export function normalizeQuery(value: string): string {
  return toHiragana(value.normalize("NFKC")).trim().toLowerCase().replace(/\s+/g, "");
}

function isMatch(item: WasteItem, query: string): boolean {
  const candidates = [item.name, ...item.aliases].map(normalizeQuery);
  return candidates.some((candidate) => candidate.includes(query) || query.includes(candidate));
}

export function searchItems(rawQuery: string): SearchResult[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return [];

  return getPublishedItems()
    .filter((item) => isMatch(item, query))
    .map((item) => {
      const municipality = getMunicipalityById(item.municipality_id);
      const category = municipality?.categories.find((c) => c.id === item.category);
      return {
        item,
        municipalityName: municipality?.name ?? "",
        category,
        href: municipality ? getItemPath(item, municipality) : "/",
      };
    });
}

/**
 * SearchBox のオートコンプリート候補一覧。verified品目のみを対象に、
 * name完全一致に近いものを優先して並べる。クライアントに軽量なデータだけ
 * 渡すため、description/notes/steps等は含めない。
 */
export function getSuggestionIndex(): SearchSuggestion[] {
  return getPublishedItems().map((item) => {
    const municipality = getMunicipalityById(item.municipality_id);
    const category = municipality ? municipality.categories.find((c) => c.id === item.category) : undefined;
    return {
      id: item.id,
      name: item.name,
      aliases: item.aliases,
      categoryName: category?.name,
      disposalMethod: item.disposal_method,
      municipalityName: municipality?.name ?? "",
      href: municipality ? getItemPath(item, municipality) : "/",
    };
  });
}
