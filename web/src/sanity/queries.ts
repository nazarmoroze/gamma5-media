import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  alt,
  hotspot,
  crop,
  asset->{ _id, url, metadata { lqip, dimensions { width, height } } }
`;

const caseCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  client,
  category,
  year,
  orientation,
  cover { ${imageFields} },
  "fullVideo": coalesce(fullVideoFile.asset->url, fullVideoUrl),
  "previewVideo": coalesce(previewVideoFile.asset->url, previewVideoUrl)
`;

export const SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings" && _type == "siteSettings"][0] {
    name,
    legalName,
    registeredName,
    location,
    email,
    phone,
    telegram,
    instagram,
    linkedin
  }
`);

export const HOME_QUERY = defineQuery(`
  *[_id == "homePage" && _type == "homePage"][0] {
    _id,
    _type,
    hero {
      title,
      subtitle,
      ctaLabel,
      "showreel": coalesce(showreelFile.asset->url, showreelUrl),
      poster { ${imageFields} }
    },
    about {
      heading,
      lead,
      body,
      stats[] { _key, value, label },
      clients[] {
        _key,
        name,
        logo { asset->{ _id, url, metadata { dimensions { width, height } } } }
      }
    },
    portfolio {
      title,
      intro,
      "cases": cases[]->{ ${caseCardFields} }
    },
    faq {
      title,
      intro,
      items[] { _key, question, answer }
    },
    contact { title, lede },
    seo {
      title,
      description,
      image { alt, asset->{ _id } }
    }
  }
`);

export const PRIVACY_QUERY = defineQuery(`
  *[_id == "privacyPolicy" && _type == "privacyPolicy"][0] {
    title,
    lastUpdated,
    description,
    body
  }
`);

export const CASES_QUERY = defineQuery(`
  *[_type == "case" && defined(slug.current)] | order(coalesce(order, 999) asc, year desc) {
    ${caseCardFields}
  }
`);

export const CASE_SLUGS_QUERY = defineQuery(`
  *[_type == "case" && defined(slug.current)].slug.current
`);

export const CASE_QUERY = defineQuery(`
  *[_type == "case" && slug.current == $slug][0] {
    ${caseCardFields},
    scope,
    summary,
    gallery[] { _key, caption, ${imageFields} },
    brief,
    idea,
    result,
    credits[] { _key, role, name },
    testimonial { quote, author, role }
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type == "case" && defined(slug.current)] { "slug": slug.current, _updatedAt }
`);
