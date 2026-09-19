import type { CategoryColor } from "./types";

interface ColorClasses {
  /** 品目詳細ページの結論欄の枠線・見出し左のアクセント線・表の区切りに使う。 */
  border: string;
  /** 結論の文字色。装飾目的ではなく、分類の識別のためだけに使う。 */
  text: string;
  /** 品目名の前に添える小さな色点。カード一覧・表などではこの点のみに留める。 */
  dot: string;
  /** トップページのイラストアイコンに使う、ごく淡い円形背景。 */
  iconBg: string;
}

export const categoryColorClasses: Record<CategoryColor, ColorClasses> = {
  red: { border: "border-red-300", text: "text-red-700", dot: "bg-red-500", iconBg: "bg-red-50" },
  blue: { border: "border-blue-300", text: "text-blue-700", dot: "bg-blue-500", iconBg: "bg-blue-50" },
  orange: { border: "border-orange-300", text: "text-orange-700", dot: "bg-orange-500", iconBg: "bg-orange-50" },
  green: { border: "border-green-300", text: "text-green-700", dot: "bg-green-500", iconBg: "bg-green-50" },
  purple: { border: "border-purple-300", text: "text-purple-700", dot: "bg-purple-500", iconBg: "bg-purple-50" },
  gray: { border: "border-gray-300", text: "text-gray-700", dot: "bg-gray-400", iconBg: "bg-gray-100" },
};
