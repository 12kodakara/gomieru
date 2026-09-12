import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 静的エクスポート(output: "export")では、メタデータルートも
// 事前に静的生成できることを明示する必要がある。内容は変更しない。
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/search",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
