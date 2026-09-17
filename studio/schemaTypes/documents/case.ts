import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

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
  fieldsets: [
    {name: 'fullVideo', title: 'Full video', description: 'Plays in the player and on the case page.'},
    {name: 'previewVideo', title: 'Preview video', description: 'Short loop for cards.'},
  ],
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
    defineField({
      name: 'fullVideoFile',
      title: 'File',
      type: 'file',
      group: 'media',
      fieldset: 'fullVideo',
      description: 'The finished film (MP4). Takes priority over the URL.',
      options: {accept: 'video/mp4,video/webm'},
    }),
    defineField({
      name: 'fullVideoUrl',
      title: 'URL',
      type: 'url',
      group: 'media',
      fieldset: 'fullVideo',
      description: 'Direct link to the MP4, used when no file is uploaded.',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'previewVideoFile',
      title: 'File',
      type: 'file',
      group: 'media',
      fieldset: 'previewVideo',
      description: 'A short silent loop (a few seconds) that plays on hover.',
      options: {accept: 'video/mp4,video/webm'},
    }),
    defineField({
      name: 'previewVideoUrl',
      title: 'URL',
      type: 'url',
      group: 'media',
      fieldset: 'previewVideo',
      description: 'Direct link to the MP4, used when no file is uploaded.',
      validation: (rule) => rule.uri({scheme: ['https']}),
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
