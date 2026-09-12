import Link from "next/link";
import { categoryColorClasses } from "@/lib/categoryColor";
import type { CategoryColor } from "@/lib/types";

interface ItemCardProps {
  name: string;
  href: string;
  categoryName?: string;
  categoryColor?: CategoryColor;
  /** categoryName と同じ場合は重複表示しない。 */
  disposalMethod?: string;
  municipalityName?: string;
}

export default function ItemCard({
  name,
  href,
  categoryName,
  categoryColor,
  disposalMethod,
  municipalityName,
}: ItemCardProps) {
  const colors = categoryColor ? categoryColorClasses[categoryColor] : undefined;
  const showDisposalMethod = disposalMethod && disposalMethod !== categoryName;

  return (
    <Link href={href} className="block h-full">
      <div className="flex h-full flex-col gap-1.5 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-green-400 hover:shadow-md">
        <p className="font-bold text-gray-900">{name}</p>
        {categoryName && colors && (
          <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
            {categoryName}
          </span>
        )}
        {showDisposalMethod && <span className="text-xs text-green-700">{disposalMethod}</span>}
        {municipalityName && <span className="text-xs text-gray-400">{municipalityName}</span>}
      </div>
    </Link>
  );
}
