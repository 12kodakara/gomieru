import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export interface BreadcrumbItem {
  name: string;
  /** 現在のページの場合は省略する（リンクにしない）。 */
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="パンくずリスト" className="overflow-x-auto">
      <ol className="flex min-w-0 items-center gap-1 whitespace-nowrap text-xs text-gray-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-green-700 hover:underline">
                {item.name}
              </Link>
            ) : (
              <span className="text-gray-500" aria-current="page">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
