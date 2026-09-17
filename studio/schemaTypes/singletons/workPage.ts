import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons/Play'

import {shareImageField} from '../fields/shareImage'

// Settings for the /work portfolio page. The cases themselves are separate documents.
export const workPageType = defineType({
  name: 'workPage',
  title: 'Work page',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading (H1)',
      type: 'string',
      description: 'Main heading of the portfolio page. Keep “video production” in it for search engines.',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 3,
      description: 'Short text under the heading.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO & sharing',
      type: 'object',
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
        shareImageField({name: 'image'}),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Work page'}),
  },
})
