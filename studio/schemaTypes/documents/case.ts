import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

import {shareImageField} from '../fields/shareImage'
import {videoFileField} from '../fields/videoFile'

export const CASE_CATEGORIES = [
  {title: 'Commercial', value: 'commercial'},
  {title: 'YouTube', value: 'youtube'},
  {title: 'Short content', value: 'short'},
]

export const caseType = defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  icon: PlayIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'media', title: 'Video & images'},
    {name: 'story', title: 'Story'},
    {name: 'credits', title: 'Credits & testimonial'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
      description: 'Used in the page address: /work/<slug>',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      type: 'string',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      group: 'overview',
      options: {list: CASE_CATEGORIES, layout: 'radio', direction: 'horizontal'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      type: 'number',
      group: 'overview',
      validation: (rule) => rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
      group: 'overview',
      description:
        'When the film was first published. Search engines use it for the video. If empty, the date the case was added to the site is used.',
    }),
    defineField({
      name: 'scope',
      title: 'What we did',
      type: 'array',
      group: 'overview',
      description: 'For example: Concept, Shoot, Post-production',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      group: 'overview',
      description: 'One or two sentences. Shown at the top of the case page and in search results.',
      validation: (rule) => rule.max(240).warning('Keep it under 240 characters'),
    }),
    defineField({
      name: 'order',
      type: 'number',
      group: 'overview',
      description: 'Lower numbers come first.',
      validation: (rule) => rule.integer().min(0),
    }),

    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().warning('Describe the image for screen readers'),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    shareImageField({group: 'media'}),
    videoFileField({
      name: 'fullVideoFile',
      title: 'Full film',
      group: 'media',
      description:
        'The finished film with sound. Upload an MP4 (H.264 video, AAC audio), 1920 × 1080 for horizontal or 1080 × 1920 for vertical. It plays in the player and on the case page.',
    }),
    videoFileField({
      name: 'previewVideoFile',
      title: 'Preview loop',
      group: 'media',
      description:
        'A short silent loop of a few seconds for the portfolio card and the case page while the full film is not uploaded. Upload an MP4 (H.264) without sound, 1280 × 720 is enough; keep it light, ideally under 2–3 MB.',
    }),
    defineField({
      name: 'orientation',
      type: 'string',
      group: 'media',
      options: {
        list: [
          {title: 'Horizontal', value: 'horizontal'},
          {title: 'Vertical (9:16)', value: 'vertical'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'horizontal',
    }),
    defineField({
      name: 'gallery',
      title: 'Stills',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.required().warning('Describe the image for screen readers'),
            }),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'brief',
      title: 'The brief',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'What the client needed.',
    }),
    defineField({
      name: 'idea',
      title: 'The idea',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'The creative approach we took.',
    }),
    defineField({
      name: 'result',
      title: 'The result',
      type: 'text',
      rows: 4,
      group: 'story',
      description: 'What was delivered and what it achieved.',
    }),

    defineField({
      name: 'credits',
      type: 'array',
      group: 'credits',
      of: [
        defineArrayMember({
          name: 'credit',
          type: 'object',
          fields: [
            defineField({name: 'role', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        }),
      ],
    }),
    defineField({
      name: 'testimonial',
      type: 'object',
      group: 'credits',
      description: 'Only publish quotes the client has approved.',
      fields: [
        defineField({name: 'quote', type: 'text', rows: 3}),
        defineField({name: 'author', type: 'string'}),
        defineField({name: 'role', title: 'Author role', type: 'string'}),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Manual order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'year', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {title: 'title', client: 'client', category: 'category', media: 'cover'},
    prepare({title, client, category, media}) {
      const label = CASE_CATEGORIES.find((c) => c.value === category)?.title
      return {title, subtitle: [client, label].filter(Boolean).join(' · '), media}
    },
  },
})
