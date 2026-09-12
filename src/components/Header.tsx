import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-lg font-extrabold text-green-700">
          <span aria-hidden="true">♻️</span>
          {SITE_NAME}
        </Link>
        <nav className="text-sm font-medium text-gray-500">
          <Link href="/#regions" className="hover:text-green-700">
            地域を選ぶ
          </Link>
        </nav>
      </div>
    </header>
  );
}
