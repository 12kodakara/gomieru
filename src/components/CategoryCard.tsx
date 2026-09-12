import Link from "next/link";
import { categoryColorClasses } from "@/lib/categoryColor";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  href: string;
}

export default function CategoryCard({ category, href }: CategoryCardProps) {
  const colors = categoryColorClasses[category.color];

  return (
    <Link
      href={href}
      className={`block rounded-xl border px-4 py-4 text-center transition hover:shadow-md ${colors.border} ${colors.bg}`}
    >
      <span className={`text-sm font-bold ${colors.text}`}>{category.name}</span>
    </Link>
  );
}
