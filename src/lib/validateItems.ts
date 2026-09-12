import { getMunicipalityById } from "./municipality";
import { getMunicipalityRules } from "./municipalityRules";
import type { WasteItem } from "./types";

export interface ValidationIssue {
  municipalityId: string;
  itemId: string;
  message: string;
}

function isBlank(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

// disposal_method は現時点では任意項目。将来必須化する場合は
// ["disposal_method", "disposal_method"] をこの配列に追加するだけでよい。
const REQUIRED_TEXT_FIELDS: Array<[keyof WasteItem, string]> = [
  ["id", "id"],
  ["name", "name"],
  ["category", "category"],
  ["municipality_id", "municipality_id"],
  ["description", "description"],
];

/**
 * data_status: "verified" の品目のみを対象に、公開に必要な最低限のフィールドが
 * 揃っているかを検証する。draft品目は未確認情報のため検証対象外。
 */
export function validateItems(items: WasteItem[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const item of items) {
    if (item.data_status !== "verified") continue;

    const label = `${item.municipality_id}/${item.id}`;

    for (const [field, fieldLabel] of REQUIRED_TEXT_FIELDS) {
      const value = item[field];
      if (typeof value !== "string" || isBlank(value)) {
        issues.push({
          municipalityId: item.municipality_id,
          itemId: item.id,
          message: `[${label}] ${fieldLabel} が未設定です`,
        });
      }
    }

    if (isBlank(item.source_url) && isBlank(item.official_url)) {
      issues.push({
        municipalityId: item.municipality_id,
        itemId: item.id,
        message: `[${label}] source_url または official_url が必要です`,
      });
    }

    if (isBlank(item.source_checked_at) && isBlank(item.last_checked)) {
      issues.push({
        municipalityId: item.municipality_id,
        itemId: item.id,
        message: `[${label}] source_checked_at または last_checked が必要です`,
      });
    }

    const municipality = getMunicipalityById(item.municipality_id);
    if (!municipality) {
      issues.push({
        municipalityId: item.municipality_id,
        itemId: item.id,
        message: `[${label}] municipality_id に一致する自治体が見つかりません`,
      });
    } else if (!municipality.categories.some((c) => c.id === item.category)) {
      issues.push({
        municipalityId: item.municipality_id,
        itemId: item.id,
        message: `[${label}] category "${item.category}" は ${municipality.id} に定義されていません`,
      });
    }

    if (item.municipality_rule_refs && item.municipality_rule_refs.length > 0) {
      const rules = getMunicipalityRules(item.municipality_id);
      for (const ref of item.municipality_rule_refs) {
        if (!rules?.[ref]) {
          issues.push({
            municipalityId: item.municipality_id,
            itemId: item.id,
            message: `[${label}] municipality_rule_refs "${ref}" が ${item.municipality_id} のルールに見つかりません`,
          });
        }
      }
    }
  }

  return issues;
}
