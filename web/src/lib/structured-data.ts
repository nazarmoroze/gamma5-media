import { siteUrl } from "./site";

// IDs shared across pages so search engines can connect the pieces of the site.
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;

export const absoluteUrl = (path: string) => (path === "/" ? siteUrl : `${siteUrl}${path}`);

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
