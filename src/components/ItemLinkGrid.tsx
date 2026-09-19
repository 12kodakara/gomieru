import Link from "next/link";
import IconBadge from "./IconBadge";
import { categoryColorClasses } from "@/lib/categoryColor";
import type { IconComponent } from "@/lib/iconMap";
import type { CategoryColor } from "@/lib/types";

interface ItemLinkGridItem {
  name: string;
  href: string;
  /** 分類ラベルを添える場合のみ指定する(トップページの「よく調べる品目」等)。 */
  categoryName?: string;
  categoryColor?: CategoryColor;
  /** 指定した場合のみ小型イラストアイコンを表示する(トップページのみ)。未指定時は従来通りの表示のまま変えない。 */
  icon?: IconComponent;
}

interface ItemLinkGridProps {
  items: ItemLinkGridItem[];
}

/**
 * 「よく調べる品目」「関連する品目」のようなシンプルなリンク一覧。
 * カード化せず、2〜3列のテキストリンク＋小さな分類ラベルとして表示する。
 * icon未指定の呼び出し元(品目一覧ページ・関連する品目)は従来と同じ見た目のまま。
 */
export default function ItemLinkGrid({ items }: ItemLinkGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
      {items.map((item) => {
        const dot = item.categoryColor ? categoryColorClasses[item.categoryColor].dot : undefined;

        if (item.icon) {
          const colors = item.categoryColor ? categoryColorClasses[item.categoryColor] : undefined;
          return (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center gap-2.5">
                <IconBadge icon={item.icon} bgClassName={colors?.iconBg ?? "bg-gray-100"} colorClassName={colors?.text ?? "text-gray-600"} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-800 hover:text-green-700">{item.name}</span>
                  {item.categoryName && <span className="block text-xs text-gray-400">{item.categoryName}</span>}
                </span>
              </Link>
            </li>
          );
        }

        return (
          <li key={item.href}>
            <Link href={item.href} className="block">
              <span className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-green-700">
                {dot && <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />}
                {item.name}
              </span>
              {item.categoryName && <span className="block text-xs text-gray-400">{item.categoryName}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
