/**
 * 自治体ページの「ごみの種類」表に表示する概要文。
 * municipalities.json（自治体データ）は変更せず、表示専用の補足として
 * カテゴリidに対する短い説明をここでだけ管理する。
 * 未登録のidは概要欄を空表示にするだけで、動作には影響しない。
 */
const categoryDescriptions: Record<string, string> = {
  moeru: "生ごみ、紙くず、木くず等",
  moenai: "金属類、陶器・ガラス類、小型の電化製品等",
  recycle: "飲料・酒類・調味料等の空きびん、ペットボトル",
  sodai: "指定袋に入らない大きさ・重さの家具・家電等",
  "kogata-kaden": "小型家電回収ボックスで回収する製品",
  "kaden-recycle": "家電リサイクル法対象の4品目（テレビ・冷蔵庫等）",
  "not-collected": "事業系ごみ・処理困難物等、市で収集しないもの",
  koshi: "新聞・雑誌・段ボール等の古紙類",
};

export function getCategoryDescription(categoryId: string): string {
  return categoryDescriptions[categoryId] ?? "";
}
