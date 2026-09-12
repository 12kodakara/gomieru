import type { Metadata } from "next";
import { Suspense } from "react";
import PageShell from "@/components/PageShell";
import SearchResults from "@/components/SearchResults";

export const metadata: Metadata = {
  title: "検索結果",
  robots: { index: false, follow: true },
};

function SearchFallback() {
  return (
    <div className="py-6">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">検索結果</h1>
    </div>
  );
}

export default function SearchPage() {
  return (
    <PageShell>
      <Suspense fallback={<SearchFallback />}>
        <SearchResults />
      </Suspense>
    </PageShell>
  );
}
