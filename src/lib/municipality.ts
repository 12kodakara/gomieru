import prefecturesData from "@/data/prefectures.json";
import municipalitiesData from "@/data/municipalities.json";
import type { Category, Municipality, Prefecture } from "./types";

const prefectures = prefecturesData as Prefecture[];
const municipalities = municipalitiesData as Municipality[];

export function getPrefectures(): Prefecture[] {
  return prefectures;
}

export function getPrefectureById(id: string): Prefecture | undefined {
  return prefectures.find((p) => p.id === id);
}

export function getMunicipalities(): Municipality[] {
  return municipalities;
}

export function getMunicipalitiesByPrefecture(prefectureId: string): Municipality[] {
  return municipalities.filter((m) => m.prefecture_id === prefectureId);
}

export function getMunicipalityById(id: string): Municipality | undefined {
  return municipalities.find((m) => m.id === id);
}

export function getMunicipalityPath(municipality: Municipality): string {
  return `/${municipality.prefecture_id}/${municipality.id}/`;
}

export function getCategoryById(
  municipality: Municipality,
  categoryId: string,
): Category | undefined {
  return municipality.categories.find((c) => c.id === categoryId);
}
