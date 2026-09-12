import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-2.5 sm:px-6">
        <Link href="/" className="text-base font-bold text-gray-900">
          {SITE_NAME}
        </Link>
      </div>
    </header>
  );
}
