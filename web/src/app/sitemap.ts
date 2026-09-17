import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { client } from "@/sanity/client";
import { SITEMAP_QUERY } from "@/sanity/queries";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await client.fetch(SITEMAP_QUERY, {}, { perspective: "published" });

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/work`, changeFrequency: "weekly", priority: 0.8 },
    ...cases
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${siteUrl}/work/${item.slug}`,
        lastModified: item._updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
