import type { IconComponent } from "@/lib/iconMap";

interface IconBadgeProps {
  icon: IconComponent;
  /** 淡い円形背景のクラス(例: "bg-red-50")。 */
  bgClassName: string;
  /** アイコン自体の色クラス(例: "text-red-700")。 */
  colorClassName: string;
}

/**
 * 「ごみの種類」「よく調べる品目」で使う、淡い円形背景付きの小型アイコン。
 * 装飾目的のため aria-hidden はアイコン側(SVG)で付与済み。
 * サイズはPCで約40px、スマホで約32pxを基準に、既存レイアウトを崩さない範囲で調整。
 */
export default function IconBadge({ icon: Icon, bgClassName, colorClassName }: IconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${bgClassName} ${colorClassName}`}
    >
      <Icon width={18} height={18} className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
    </span>
  );
}
