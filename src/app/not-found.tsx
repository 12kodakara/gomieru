import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "ページが見つかりません",
};

export default function NotFound() {
  return (
    <PageShell>
      <div className="py-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">ページが見つかりません</h1>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
          <p>
            お探しのページは、移動または削除されたか、URLが間違っている可能性があります。お手数ですが、トップページから品目を検索するか、品目一覧からお探しください。
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <Link href="/" className="text-green-700 underline underline-offset-2 hover:text-green-800">
                {SITE_NAME} トップページ
              </Link>
            </li>
            <li>
              <Link
                href="/fukuoka/fukuoka-city/list/"
                className="text-green-700 underline underline-offset-2 hover:text-green-800"
              >
                福岡市の品目一覧
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
