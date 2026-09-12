import type { MetadataRoute } from "next";
import { getItemPath, getItemsByMunicipality } from "@/lib/items";
import { getMunicipalities, getPrefectures } from "@/lib/municipality";
import { SITE_URL } from "@/lib/site";

// 静的エクスポート(output: "export")では、メタデータルートも
// 事前に静的生成できることを明示する必要がある。内容は変更しない。
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/contact/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  for (const prefecture of getPrefectures()) {
    entries.push({
      url: `${SITE_URL}/${prefecture.id}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const municipality of getMunicipalities()) {
    entries.push({
      url: `${SITE_URL}/${municipality.prefecture_id}/${municipality.id}/`,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    entries.push({
      url: `${SITE_URL}/${municipality.prefecture_id}/${municipality.id}/list/`,
      changeFrequency: "weekly",
      priority: 0.6,
    });

    for (const item of getItemsByMunicipality(municipality.id)) {
      entries.push({
        url: `${SITE_URL}${getItemPath(item, municipality)}`,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
