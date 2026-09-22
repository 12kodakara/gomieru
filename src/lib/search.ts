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

/**
 * 1文字(品目名またはalias)は完全一致の場合だけマッチさせる。
 * 「石」が「石油ファンヒーター」のような無関係な複合語に部分一致してしまう
 * ような誤誘導を防ぐための一般ルール。特定の品目名をハードコードするのでは
 * なく、候補の文字数だけで判定するため、将来1文字の品目・aliasが増えても
 * 自動的に適用される。2文字以上の候補は従来通り双方向の部分一致を許可する。
 */
function isMatch(item: WasteItem, query: string): boolean {
  const candidates = [item.name, ...item.aliases].map(normalizeQuery);
  return candidates.some((candidate) => {
    if (Array.from(candidate).length === 1) {
      return candidate === query;
    }
    return candidate.includes(query) || query.includes(candidate);
  });
}

/**
 * 短い語が別品目の複合alias(またはその逆)に偶然含まれることで発生する、
 * 無関係な品目への誤誘導を防ぐための個別ケース限定の除外リスト。
 * 例:「デスク」は机のaliasだが、パソコンのalias「デスクトップパソコン」にも
 * 部分一致してしまうため、この検索語(完全一致)に限りパソコンを除外する。
 * 部分一致ロジック自体(isMatch)は変更せず、この4語だけに影響する局所的な調整。
 */
const SEARCH_DISAMBIGUATION_EXCLUDE_IDS: Record<string, string[]> = {
  [normalizeQuery("デスク")]: ["pc"],
  [normalizeQuery("デスクトップパソコン")]: ["desk"],
  [normalizeQuery("ノート")]: ["pc"],
  [normalizeQuery("ノートパソコン")]: ["notebook"],
  [normalizeQuery("衣類")]: ["washing-machine", "iron"],
  [normalizeQuery("ホットプレート")]: ["plate"],
  [normalizeQuery("プレート")]: ["hot-plate"],
  [normalizeQuery("クーラーボックス")]: ["air-conditioner"],
  [normalizeQuery("クーラーバッグ")]: ["air-conditioner", "bag"],
  [normalizeQuery("クーラーパック")]: ["air-conditioner"],
  [normalizeQuery("クーラーケース")]: ["air-conditioner"],
  [normalizeQuery("ウォータークーラー")]: ["air-conditioner"],
  [normalizeQuery("クーラー")]: ["cooler-box"],
};

export function isSearchDisambiguationExcluded(itemId: string, normalizedQuery: string): boolean {
  const excludeIds = SEARCH_DISAMBIGUATION_EXCLUDE_IDS[normalizedQuery];
  return excludeIds ? excludeIds.includes(itemId) : false;
}

export function searchItems(rawQuery: string): SearchResult[] {
  const query = normalizeQuery(rawQuery);
  if (!query) return [];

  return getPublishedItems()
    .filter((item) => isMatch(item, query) && !isSearchDisambiguationExcluded(item.id, query))
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
