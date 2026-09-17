import {defineArrayMember, defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

const imageWithAlt = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'image',
    description,
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        validation: (rule) => rule.required().warning('Describe the image for screen readers'),
      }),
    ],
  })

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'about', title: 'About'},
    {name: 'portfolio', title: 'Portfolio'},
    {name: 'faq', title: 'FAQ'},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'hero',
      type: 'object',
      group: 'hero',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          description: 'The main H1 of the site. Keep “video production” in it for SEO.',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'subtitle',
          type: 'text',
          rows: 2,
          validation: (rule) => rule.max(140).warning('Keep it to one short sentence'),
        }),
        defineField({
          name: 'ctaLabel',
          title: 'Button label',
          type: 'string',
          description: 'Scrolls to the contact form.',
          validation: (rule) => rule.required().max(30),
        }),
        defineField({
          name: 'showreelFile',
          title: 'Showreel file',
          type: 'file',
          description: 'MP4. Plays muted in the background and in full in the player. Takes priority over the URL.',
          options: {accept: 'video/mp4,video/webm'},
        }),
        defineField({
          name: 'showreelUrl',
          title: 'Showreel URL',
          type: 'url',
          description: 'Direct link to an MP4, used when no file is uploaded.',
          validation: (rule) => rule.uri({scheme: ['https']}),
        }),
        imageWithAlt('poster', 'Poster image', 'Shown while the video loads and when motion is reduced.'),
      ],
    }),

    defineField({
      name: 'about',
      type: 'object',
      group: 'about',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'heading',
          type: 'string',
          description: 'Shown right after the brand name, e.g. “is a full-cycle video production company based in Cyprus.”',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'lead', type: 'text', rows: 3}),
        defineField({name: 'body', type: 'text', rows: 3}),
        defineField({
          name: 'stats',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'stat',
              type: 'object',
              fields: [
                defineField({name: 'value', type: 'string', description: 'e.g. 18+', validation: (rule) => rule.required()}),
                defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'value', subtitle: 'label'}},
            }),
          ],
          validation: (rule) => rule.max(4),
        }),
        defineField({
          name: 'clients',
          title: 'Client logos',
          type: 'array',
          description: 'Shown right under the hero as “Trusted by”. White logos on a transparent background (PNG or SVG) look best.',
          of: [
            defineArrayMember({
              name: 'client',
              type: 'object',
              fields: [
                defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'logo', type: 'image', validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'name', media: 'logo'}},
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'portfolio',
      type: 'object',
      group: 'portfolio',
      options: {collapsible: false},
      fields: [
        defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'intro', type: 'text', rows: 2}),
        defineField({
          name: 'cases',
          title: 'Cases on the home page',
          type: 'array',
          description: 'Pick the cases to show and drag to set their order. All cases are listed on /work.',
          of: [defineArrayMember({type: 'reference', to: [{type: 'case'}]})],
          validation: (rule) => rule.unique().max(9),
        }),
      ],
    }),

    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'object',
      group: 'faq',
      options: {collapsible: false},
      fields: [
        defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'intro', type: 'text', rows: 2}),
        defineField({
          name: 'items',
          title: 'Questions',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'faqItem',
              type: 'object',
              fields: [
                defineField({name: 'question', type: 'string', validation: (rule) => rule.required()}),
                defineField({name: 'answer', type: 'text', rows: 4, validation: (rule) => rule.required()}),
              ],
              preview: {select: {title: 'question', subtitle: 'answer'}},
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'contact',
      type: 'object',
      group: 'contact',
      options: {collapsible: false},
      fields: [
        defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
        defineField({name: 'lede', title: 'Text', type: 'text', rows: 3}),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          description: 'Browser tab and Google title. The brand name is added automatically.',
          validation: (rule) => rule.required().max(60).warning('Google shows about 60 characters'),
        }),
        defineField({
          name: 'description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().min(70).max(160).warning('Aim for 120–160 characters'),
        }),
        imageWithAlt('image', 'Social share image', '1200×630 works best.'),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Home page'}),
  },
})
