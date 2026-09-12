import Link from "next/link";
import Disclaimer from "./Disclaimer";
import { SITE_NAME } from "@/lib/site";

/**
 * このサイトについて／プライバシーポリシー／お問い合わせ等のページを追加する際は
 * ここに {name, href} を追記するだけでフッターに表示される（AdSense審査対応）。
 * ページが存在しない項目を並べると空リンクになるため、作成済みのものだけ追加すること。
 */
const POLICY_LINKS: { name: string; href: string }[] = [
  { name: "このサイトについて", href: "/about/" },
  { name: "プライバシーポリシー", href: "/privacy/" },
  { name: "お問い合わせ", href: "/contact/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Disclaimer />
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <Link href="/" className="hover:text-green-700">
            トップ
          </Link>
          <Link href="/fukuoka/" className="hover:text-green-700">
            福岡県
          </Link>
          <Link href="/fukuoka/fukuoka-city/" className="hover:text-green-700">
            福岡市
          </Link>
        </nav>
        {POLICY_LINKS.length > 0 && (
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {POLICY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-green-700">
                {link.name}
              </Link>
            ))}
          </nav>
        )}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
