import { defineQuery } from "next-sanity";

export const CASES_QUERY = defineQuery(`
  *[_type == "case" && defined(slug.current)] | order(coalesce(order, 999) asc, year desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    category,
    year,
    featured,
    orientation,
    cover { alt, hotspot, crop, asset->{ _id, url, metadata { lqip, dimensions { width, height } } } },
    "fullVideo": coalesce(fullVideoFile.asset->url, fullVideoUrl),
    "previewVideo": coalesce(previewVideoFile.asset->url, previewVideoUrl)
  }
`);

export const CASE_SLUGS_QUERY = defineQuery(`
  *[_type == "case" && defined(slug.current)].slug.current
`);

export const CASE_QUERY = defineQuery(`
  *[_type == "case" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    client,
    category,
    year,
    scope,
    summary,
    orientation,
    cover { alt, hotspot, crop, asset->{ _id, url, metadata { lqip, dimensions { width, height } } } },
    "fullVideo": coalesce(fullVideoFile.asset->url, fullVideoUrl),
    "previewVideo": coalesce(previewVideoFile.asset->url, previewVideoUrl),
    gallery[] { _key, alt, caption, hotspot, crop, asset->{ _id, url, metadata { lqip, dimensions { width, height } } } },
    brief,
    idea,
    result,
    credits[] { _key, role, name },
    testimonial { quote, author, role }
  }
`);
