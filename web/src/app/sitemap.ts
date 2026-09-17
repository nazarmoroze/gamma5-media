import type { MetadataRoute } from "next";

import { site } from "@/content/home";
import { sanityFetch } from "@/sanity/fetch";
import { SITEMAP_QUERY } from "@/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await sanityFetch({ query: SITEMAP_QUERY });

  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, changeFrequency: "weekly", priority: 0.8 },
    ...cases
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${site.url}/work/${item.slug}`,
        lastModified: item._updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
