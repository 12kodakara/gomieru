export type CategoryColor = "red" | "blue" | "orange" | "green" | "purple" | "gray";

export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
}

export interface Prefecture {
  id: string;
  name: string;
  name_kana: string;
}

export interface Municipality {
  id: string;
  prefecture_id: string;
  name: string;
  name_kana: string;
  categories: Category[];
}

export type DataStatus = "verified" | "draft";

/**
 * disposal_method は自治体ごとに自由記述で管理する（固定enumにはしない）。
 * 理由：全国展開すると自治体固有の処分方法（例:「販売店へご相談ください」）が
 * 今後も増えるため、型で選択肢を固定すると拡張性を失う。
 * その代わり、このリストを「同じ意味の表記を増やさないためのチェックリスト」として運用する。
 * 新しい品目を追加する際は、まずこのリストに合う表記がないか確認し、
 * 本当に新しい処分方法が必要な場合だけ追記すること（完了報告に追加理由を残す）。
 */
export const CANONICAL_DISPOSAL_METHODS = [
  "燃えるごみ",
  "燃えないごみ",
  "粗大ごみ",
  "空きびん・ペットボトル",
  "古紙回収へ",
  "小型充電式電池回収へ",
  "小型家電回収ボックスへ",
  "家電リサイクル法に従って処分",
  "メーカー・リネットジャパンへ回収を依頼",
  "購入店・販売店へご相談ください",
] as const;

export interface DisposalCondition {
  /** どのような場合にこの処分方法になるか（例: "指定袋に入らない大きさ・重さの場合"） */
  condition: string;
  /** その条件に該当する場合の処分方法 */
  disposal_method: string;
  /** 補足説明（任意） */
  note?: string;
}

/**
 * 自治体共通で使い回せる処分ルール（粗大ごみの申込手順、家電リサイクル法の
 * 一般的な処分方法、小型家電回収ボックスの説明など）。品目ごとに同じ文章を
 * コピーし続けないよう、municipality-rules データに1か所だけ保持する。
 * キーを増やす場合は MunicipalityRuleKey も合わせて更新すること。
 */
export interface BulkyWasteRule {
  steps: string[];
  notes?: string;
  source_title?: string;
  source_url?: string;
  source_checked_at?: string;
}

export interface HomeApplianceRecyclingRule {
  description: string;
  notes?: string;
  source_title?: string;
  source_url?: string;
  source_checked_at?: string;
}

export interface SmallApplianceBoxRule {
  description: string;
  source_title?: string;
  source_url?: string;
  source_checked_at?: string;
}

export interface MunicipalityRules {
  bulkyWaste?: BulkyWasteRule;
  homeApplianceRecycling?: HomeApplianceRecyclingRule;
  smallApplianceBox?: SmallApplianceBoxRule;
}

export type MunicipalityRuleKey = keyof MunicipalityRules;

export interface WasteItem {
  id: string;
  name: string;
  aliases: string[];
  /** サイト内部の分類・絞り込み用（カテゴリカード、検索結果バッジ等） */
  category: string;
  /**
   * ユーザーが最初に知るべき実際の処分・回収方法（品目ページの結論欄で優先表示）。
   * 未設定の場合は category の名称にフォールバックする。
   * 現時点では任意項目だが、将来的に verified 必須項目へ格上げしやすいよう
   * validateItems.ts の REQUIRED_TEXT_FIELDS に一行追加するだけで済む構造にしている。
   */
  disposal_method?: string;
  /**
   * 「基本はA、ただし〇〇の場合はB」という公式情報が確認できた場合にのみ設定する。
   * 推測で条件を作らないこと。品目ページでは「条件によって捨て方が変わります」として表示する。
   */
  conditions?: DisposalCondition[];
  /**
   * この品目が使う自治体共通ルール（bulkyWaste等）のキー。
   * 品目固有の description/notes は残しつつ、自治体で共通の手順・料金説明等を
   * 二重管理しないようにするための参照。品目ページでは
   * 「自治体共通の処分手順」セクションとして item-specific な内容の後に表示する。
   */
  municipality_rule_refs?: MunicipalityRuleKey[];
  municipality_id: string;
  description: string;
  notes: string;
  alternatives?: string;
  steps?: string[];
  /** @deprecated source_url を優先。既存データ互換のため残置 */
  official_url?: string;
  /** @deprecated source_checked_at を優先。既存データ互換のため残置 */
  last_checked?: string;
  source_title?: string;
  source_url?: string;
  source_checked_at?: string;
  source_excerpt?: string;
  data_status: DataStatus;
  /**
   * data_status: "draft" の品目が、なぜverifiedにできていないかの短い理由。
   * `npm run list:drafts` で一覧表示するために使う。verified品目では通常不要。
   */
  draft_reason?: string;
}
