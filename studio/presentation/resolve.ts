import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  // Which document opens in the side panel for a given page in the preview.
  mainDocuments: defineDocuments([
    {route: '/', filter: `_type == "homePage" && _id == "homePage"`},
    {route: '/work/:slug', filter: `_type == "case" && slug.current == $slug`},
    {route: '/privacy-policy', filter: `_type == "privacyPolicy" && _id == "privacyPolicy"`},
  ]),
  // Where a document is used on the site, shown on top of the document form.
  locations: {
    homePage: defineLocations({
      message: 'This document is the home page',
      tone: 'positive',
      locations: [{title: 'Home', href: '/'}],
    }),
    privacyPolicy: defineLocations({
      message: 'This document is the privacy policy page',
      tone: 'positive',
      locations: [{title: 'Privacy Policy', href: '/privacy-policy'}],
    }),
    siteSettings: defineLocations({
      message: 'Used in the header, footer and contact section on every page',
      tone: 'caution',
      locations: [
        {title: 'Home', href: '/'},
        {title: 'Work', href: '/work'},
      ],
    }),
    case: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled case', href: `/work/${doc?.slug}`},
          {title: 'Work', href: '/work'},
          {title: 'Home', href: '/'},
        ],
      }),
    }),
  },
}
