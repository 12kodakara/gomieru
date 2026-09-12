import Link from "next/link";
import { categoryColorClasses } from "@/lib/categoryColor";
import type { CategoryColor } from "@/lib/types";

interface ItemRowProps {
  name: string;
  href: string;
  categoryName?: string;
  categoryColor?: CategoryColor;
  /** categoryName と同じ場合は重複表示しない。 */
  disposalMethod?: string;
  municipalityName?: string;
}

/**
 * 品目一件分を表す一覧行。カード化せず、罫線区切りの行として
 * <ul className="divide-y divide-gray-200 border-y border-gray-200"> の中で使う。
 */
export default function ItemRow({ name, href, categoryName, categoryColor, disposalMethod, municipalityName }: ItemRowProps) {
  const dot = categoryColor ? categoryColorClasses[categoryColor].dot : undefined;
  const meta = disposalMethod && disposalMethod !== categoryName ? disposalMethod : categoryName;

  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:bg-gray-50">
        <span className="flex min-w-0 items-center gap-2">
          {dot && <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />}
          <span className="truncate font-medium text-gray-900">{name}</span>
        </span>
        <span className="shrink-0 text-xs text-gray-500">
          {meta}
          {municipalityName && <span className="ml-1 text-gray-400">・{municipalityName}</span>}
        </span>
      </Link>
    </li>
  );
}
