import type { CategoryColor } from "./types";

interface ColorClasses {
  bg: string;
  text: string;
  border: string;
}

export const categoryColorClasses: Record<CategoryColor, ColorClasses> = {
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  gray: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
};
