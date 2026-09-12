/**
 * 自治体ページの「基本情報」表に表示する参考情報。
 * municipalities.json（自治体データ）は変更せず、既存の検証済みデータ
 * （municipality-rulesのsource_url、品目notes内の確認済み電話番号）を
 * 表示用にまとめ直したもの。新しい情報を推測・追加してはいない。
 */
export interface MunicipalityBasicInfo {
  officialSiteUrl: string;
  wasteSortingSiteUrl: string;
  wasteSortingSiteName: string;
  contactName: string;
  contactPhone: string;
}

const municipalityBasicInfo: Record<string, MunicipalityBasicInfo> = {
  "fukuoka-city": {
    officialSiteUrl: "https://www.city.fukuoka.lg.jp/",
    wasteSortingSiteUrl: "https://kateigomi-bunbetsu.city.fukuoka.lg.jp/",
    wasteSortingSiteName: "福岡市ごみと資源の分け方・出し方情報サイト",
    contactName: "福岡市 環境局 ごみ減量推進課",
    contactPhone: "092-711-4039",
  },
};

export function getMunicipalityBasicInfo(municipalityId: string): MunicipalityBasicInfo | undefined {
  return municipalityBasicInfo[municipalityId];
}
