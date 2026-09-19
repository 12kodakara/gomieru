import type { SVGProps } from "react";

/**
 * トップページ「よく調べる品目」用の小型フラットアイコン。
 * すべて装飾目的のため aria-hidden="true" を付与する(CategoryIcons.tsxと同方針)。
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

export function BicycleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="17" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="17" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6 17l4-8h4l4 8M10 9h3M6 17h6l3-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="7" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function MicrowaveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1.2" fill="currentColor" opacity="0.12" />
      <rect x="3" y="6" width="18" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="5.3" y="8.3" width="9.4" height="7.4" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="18" cy="10.3" r="1" fill="currentColor" />
      <rect x="16.6" y="13" width="2.8" height="1.3" fill="currentColor" />
      <rect x="16.6" y="15" width="2.8" height="1.3" fill="currentColor" />
    </svg>
  );
}

export function FutonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="14" width="18" height="5" rx="2.2" fill="currentColor" />
      <rect x="3" y="9" width="18" height="5" rx="2.2" fill="currentColor" opacity="0.7" />
      <rect x="3" y="4" width="18" height="5" rx="2.2" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

export function TvIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="5" y="6" width="14" height="8" fill="currentColor" opacity="0.15" />
      <path d="M9 20h6M12 16v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function FridgeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1.7" />
      <line x1="9" y1="4.5" x2="9" y2="7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="9" y1="11" x2="9" y2="14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function WashingMachineIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="13" r="5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="13" r="2.3" fill="currentColor" opacity="0.45" />
      <circle cx="7" cy="5.5" r="0.9" fill="currentColor" />
      <circle cx="10" cy="5.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function AirConditionerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="7" rx="1.8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <line x1="6" y1="13.6" x2="4.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="13.6" x2="11" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="13.6" x2="19.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18.5" cy="8.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LaptopIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="4" width="16" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="6" y="6" width="12" height="6" fill="currentColor" opacity="0.15" />
      <path
        d="M2.5 17.5h19l-1.5 2.3a1.5 1.5 0 01-1.25.7H5.25a1.5 1.5 0 01-1.25-.7L2.5 17.5z"
        fill="currentColor"
      />
    </svg>
  );
}
