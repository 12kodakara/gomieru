import fukuokaCityRules from "@/data/municipality-rules/fukuoka-city.json";
import type { MunicipalityRuleKey, MunicipalityRules } from "./types";

/**
 * 自治体ごとの共通処分ルールのレジストリ。
 * 新しい自治体を追加する際は data/municipality-rules/<municipality_id>.json を作成し、
 * ここに登録する（data/items のレジストリと同じ構成）。
 */
const rulesByMunicipality: Record<string, MunicipalityRules> = {
  "fukuoka-city": fukuokaCityRules as MunicipalityRules,
};

export function getMunicipalityRules(municipalityId: string): MunicipalityRules | undefined {
  return rulesByMunicipality[municipalityId];
}

export function getMunicipalityRule<K extends MunicipalityRuleKey>(
  municipalityId: string,
  key: K,
): MunicipalityRules[K] | undefined {
  return rulesByMunicipality[municipalityId]?.[key];
}
