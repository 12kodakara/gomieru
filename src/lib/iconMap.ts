import type { ComponentType, SVGProps } from "react";
import {
  BottleIcon,
  BoxIcon,
  FlameIcon,
  NewspaperIcon,
  PlugIcon,
  RecycleIcon,
  SofaIcon,
  TrashBagIcon,
} from "@/components/icons/CategoryIcons";
import {
  AirConditionerIcon,
  BicycleIcon,
  FridgeIcon,
  FutonIcon,
  LaptopIcon,
  MicrowaveIcon,
  TvIcon,
  WashingMachineIcon,
} from "@/components/icons/ItemIcons";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * カテゴリidごとのイラストアイコン。未登録のidは呼び出し側で
 * 従来の色点表示にフォールバックする(新しい自治体・カテゴリを
 * 追加してもレイアウトが壊れないようにするため)。
 */
export const categoryIconComponents: Record<string, IconComponent> = {
  moeru: FlameIcon,
  moenai: TrashBagIcon,
  recycle: BottleIcon,
  sodai: SofaIcon,
  "kogata-kaden": PlugIcon,
  "kaden-recycle": RecycleIcon,
  koshi: NewspaperIcon,
  "not-collected": BoxIcon,
};

/**
 * 品目idごとのイラストアイコン(トップページ「よく調べる品目」用)。
 * 未登録のidは呼び出し側でカテゴリアイコンにフォールバックする。
 */
export const itemIconComponents: Record<string, IconComponent> = {
  bicycle: BicycleIcon,
  microwave: MicrowaveIcon,
  futon: FutonIcon,
  tv: TvIcon,
  refrigerator: FridgeIcon,
  "washing-machine": WashingMachineIcon,
  "air-conditioner": AirConditionerIcon,
  pc: LaptopIcon,
};
