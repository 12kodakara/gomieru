"use client";

import Link from "next/link";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

// サイト構成が現状「福岡県福岡市」のみのため固定リンクで構成している。
// 対応自治体が増える際は「現在の地域」セクションをページごとの動的な値に置き換える。
const NAV_SECTIONS: NavSection[] = [
  {
    heading: "基本",
    items: [
      { label: "トップ", href: "/" },
      { label: "地域から探す", href: "/#regions" },
      { label: "ごみの種類", href: "/fukuoka/fukuoka-city/#categories" },
      { label: "品目一覧", href: "/fukuoka/fukuoka-city/list/" },
    ],
  },
  {
    heading: "現在の地域",
    items: [
      { label: "福岡市トップ", href: "/fukuoka/fukuoka-city/" },
      { label: "よく調べる品目", href: "/fukuoka/fukuoka-city/#popular" },
    ],
  },
  {
    heading: "サイト情報",
    items: [
      { label: "ご利用ガイド", href: "/#guide" },
      { label: "このサイトについて", href: "/about/" },
    ],
  },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {NAV_SECTIONS.map((section, index) => (
        <div key={section.heading} className={index > 0 ? "mt-4" : undefined}>
          <p className="text-xs font-bold text-gray-400">{section.heading}</p>
          <ul className="mt-1.5 space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className="block py-0.5 text-sm text-gray-600 hover:text-green-700 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

interface PageShellProps {
  children: React.ReactNode;
}

/**
 * サイト共通の「左サイドナビ＋本文」レイアウト。
 * PCではサイドナビを常時表示し、スマホではハンバーガーメニューに格納する。
 */
export default function PageShell({ children }: PageShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="border-b border-gray-200 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700"
        >
          <span aria-hidden="true">≡</span>
          メニュー
        </button>
        {menuOpen && (
          <nav aria-label="サイトメニュー" className="mt-2 border-t border-gray-100 pt-2">
            <NavList onNavigate={() => setMenuOpen(false)} />
          </nav>
        )}
      </div>

      <div className="md:grid md:grid-cols-[170px_1fr] md:gap-8 md:py-6">
        <aside className="hidden md:block">
          <nav aria-label="サイトメニュー" className="sticky top-16 text-sm">
            <NavList />
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
