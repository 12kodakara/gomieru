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
 * 明示的に「用途・製品として関連する」と判断できる品目のグループ(SEO・回遊改善 第2回)。
 * カテゴリをまたいでも実際に一緒に調べられそうな組み合わせだけを、
 * 品目idで直接指定する(自動判定に任せない)。1つの配列=1グループとし、
 * 同じグループ内の他の品目が互いの「関連する品目」候補になる。
 *
 * 収録方針:
 *   ・利用者に理由を説明できる組み合わせのみ(例: 家電リサイクル法の対象4品目、
 *     PC本体と周辺機器、寝具、乾電池と充電式電池 等)
 *   ・「同じごみ分類だから」という理由だけのグループ化はしない
 *   ・aliasの一致は判断材料に使わない(表記揺れ・同一品目の可能性があるため)
 *
 * 明確に説明できる組み合わせだけを収録しており、全96件を網羅する意図はない。
 * 未収録の品目は下記のカテゴリ内一致ロジックにフォールバックし、それでも
 * 安全な候補が無ければ「関連する品目」自体を表示しない。
 */
const RELATED_ITEM_CLUSTERS: string[][] = [
  // 寝具・大型家具(布団はmoeru、他3件はsodaiとカテゴリをまたぐ)
  ["futon", "mattress", "bed", "carpet"],
  // 家具(いずれもsodai。買い替え・模様替えでまとめて処分を検討しやすい)
  ["desk", "chair", "table", "chest", "bookshelf", "color-box", "cupboard", "sofa"],
  // 窓まわりの粗大ごみ(いずれもsodai)
  ["window-screen", "aluminum-sash"],
  // キッチン家電(いずれもmoenai。調理・食卓まわりの電化製品としてまとめて処分を検討しやすい)
  ["microwave", "rice-cooker", "toaster", "hot-plate"],
  // パソコン本体と周辺機器(パソコンはnot-collected、他はmoenai/kogata-kadenとカテゴリをまたぐ)
  ["pc", "printer", "usb-memory", "wifi-router"],
  // 電池類(乾電池はmoenai、充電式電池・ボタン電池はnot-collectedで処分方法が異なるため併記が特に有用)
  ["dry-battery", "rechargeable-battery", "button-battery"],
  // 音響・楽器機器(エレキギター/お風呂のふた等と同じsodaiだが、用途が近いものだけを厳選)
  ["electric-guitar", "audio-rack", "amplifier"],
  // 照明(電球・LED電球はmoenai同士で名称も一部重なるが、蛍光管も含めて明示的にまとめる)
  ["light-bulb", "led-bulb", "fluorescent-tube"],
];

const relatedClusterByItemId = new Map<string, string[]>();
for (const cluster of RELATED_ITEM_CLUSTERS) {
  for (const id of cluster) relatedClusterByItemId.set(id, cluster);
}

/**
 * 「粗大ごみ」等はカテゴリ内の品目が多様なため、カテゴリが同じというだけでは
 * 関連性を説明しにくい(例: 自転車と本棚)。これらのカテゴリでは上記クラスターに
 * 未収録の品目は、下のisNameRelatedによる名称一致のみに頼る。
 * 一方、対象がそもそも少なく製品として近い一部カテゴリは、同カテゴリ・同処分方法
 * (下のgetRelatedItems内で判定)の品目までを候補として許可する。
 * kogata-kadenを含めるのは、同じカテゴリ内でも「小型充電式電池回収へ」(モバイル
 * バッテリー)と「小型家電回収ボックスへ」(他5件)で実際の処分方法が異なるため、
 * 同処分方法の絞り込みで誤った組み合わせを防ぐ必要があるため。
 */
const CATEGORY_MATCH_ALLOWED = new Set(["recycle", "kaden-recycle", "koshi", "kogata-kaden"]);

function normalizeForRelation(value: string): string {
  return value.replace(/[\s・･]/g, "");
}

/**
 * 品目名同士(name のみ)の部分一致だけを見る。別名(aliases)は表記揺れ・
 * 同一品目の吸収用に存在し、たまたま他の品目の名前と文字列が重なることがある
 * (例:「ガラス」の別名ではなく品目名に「ガラス」が含まれるかどうかで判定する)ため、
 * 関連品目の判定材料には使わない。
 */
function isNameRelated(a: WasteItem, b: WasteItem): boolean {
  const an = normalizeForRelation(a.name);
  const bn = normalizeForRelation(b.name);
  return an.length >= 2 && bn.length >= 2 && (an.includes(bn) || bn.includes(an));
}

/**
 * 品目詳細ページ「関連する品目」用。
 * 1. 明示的なクラスター定義があればそれを最優先で使う。
 * 2. なければ、対象が少なく製品として近いカテゴリ(recycle/kaden-recycle/koshi)は
 *    同カテゴリ・同処分方法の品目を候補にする。
 * 3. それ以外は、品目名同士が実際に重なるものだけを候補にする。
 * 適切な候補がなければ空配列を返し、無理に件数を埋めない。
 */
export function getRelatedItems(item: WasteItem, limit: number): WasteItem[] {
  const cluster = relatedClusterByItemId.get(item.id);
  if (cluster) {
    const clustered = cluster
      .filter((id) => id !== item.id)
      .map((id) => getItemById(item.municipality_id, id))
      .filter((other): other is WasteItem => other !== undefined);
    return clustered.slice(0, limit);
  }

  const sameCategory = getItemsByCategory(item.municipality_id, item.category).filter((other) => other.id !== item.id);

  if (CATEGORY_MATCH_ALLOWED.has(item.category)) {
    const sameDisposalMethod = sameCategory.filter(
      (other) => !item.disposal_method || !other.disposal_method || other.disposal_method === item.disposal_method,
    );
    return sameDisposalMethod.slice(0, limit);
  }

  return sameCategory.filter((other) => isNameRelated(item, other)).slice(0, limit);
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
