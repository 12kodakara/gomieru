import type { SVGProps } from "react";

/**
 * トップページ「ごみの種類」用の小型フラットアイコン。
 * すべて装飾目的のため aria-hidden="true" を付与し、
 * スクリーンリーダーには読み上げさせず、隣接するテキストのみを伝える。
 * 外部画像・CDNを使わず、インラインSVGとしてバンドルする(404リスクゼロ)。
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M12 2.2c.7 2.6-2.1 4-2.1 7.2a2.3 2.3 0 004.6 0c0-.7-.3-1.2-.6-1.6.1.9-.4 1.4-.9 1.4-.7 0-1.1-.6-.8-1.5.5-1.4-.4-2.7-.2-5.5z"
        fill="currentColor"
      />
      <path
        d="M7.6 12.4c-.6 1.3-.9 2.3-.9 3.6a5.3 5.3 0 0010.6 0c0-3-1.6-4.9-3-6.7.4 2.6-.6 3.9-1.7 4.5.5.9.6 1.9.2 2.7a2.9 2.9 0 01-5.6-1c0-1.1.6-1.9 1.2-2.5-.4-.2-.6-.4-.8-.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TrashBagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M9.3 3h5.4l.5 2h2.3a1 1 0 01.9 1.4l-.3.6H5.9l-.3-.6a1 1 0 01.9-1.4h2.3l.5-2z"
        fill="currentColor"
      />
      <path
        d="M6.2 8.6h11.6l-1.1 10.2a2 2 0 01-2 1.8H9.3a2 2 0 01-2-1.8L6.2 8.6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BottleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M10.3 2h3.4v2.1l1 1.5c.4.5.6 1.2.6 1.8V19a3 3 0 01-3 3v0a3 3 0 01-3-3V7.4c0-.6.2-1.3.6-1.8l1-1.5V2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SofaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="11" width="16" height="6" rx="1.5" fill="currentColor" />
      <rect x="3.6" y="7.5" width="3.2" height="6.2" rx="1.2" fill="currentColor" />
      <rect x="17.2" y="7.5" width="3.2" height="6.2" rx="1.2" fill="currentColor" />
      <rect x="5" y="17" width="2" height="2.6" fill="currentColor" />
      <rect x="17" y="17" width="2" height="2.6" fill="currentColor" />
    </svg>
  );
}

export function PlugIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8.8" y="2" width="2" height="6" rx="1" fill="currentColor" />
      <rect x="13.2" y="2" width="2" height="6" rx="1" fill="currentColor" />
      <path d="M6 8h12v3.6a6 6 0 01-6 6 6 6 0 01-6-6V8z" fill="currentColor" />
      <rect x="11" y="17.6" width="2" height="4.4" fill="currentColor" />
    </svg>
  );
}

export function RecycleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle
        cx="12"
        cy="12"
        r="7.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeDasharray="12 7"
        strokeLinecap="round"
      />
      <path d="M12 3.3l2.7 2-2.7 2.1z" fill="currentColor" />
    </svg>
  );
}

export function NewspaperIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="6" width="12" height="14" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="7" y="4" width="12" height="14" rx="1" fill="currentColor" />
      <rect x="9.5" y="7.4" width="7" height="1.3" fill="white" />
      <rect x="9.5" y="10.2" width="7" height="1.3" fill="white" />
      <rect x="9.5" y="13" width="4.5" height="1.3" fill="white" />
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8l8-4 8 4-8 4-8-4z" fill="currentColor" opacity="0.85" />
      <path d="M4 8v8l8 4v-8L4 8z" fill="currentColor" opacity="0.6" />
      <path d="M20 8v8l-8 4v-8l8-4z" fill="currentColor" />
    </svg>
  );
}
