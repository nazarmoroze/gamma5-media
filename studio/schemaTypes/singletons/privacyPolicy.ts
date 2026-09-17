import {defineArrayMember, defineField, defineType} from 'sanity'
import {LockIcon} from '@sanity/icons/Lock'

import {shareImageField} from '../fields/shareImage'

export const privacyPolicyType = defineType({
  name: 'privacyPolicy',
  title: 'Privacy policy',
  type: 'document',
  icon: LockIcon,
  fields: [
    defineField({name: 'title', type: 'string', initialValue: 'Privacy Policy', validation: (rule) => rule.required()}),
    defineField({
      name: 'lastUpdated',
      title: 'Last updated',
      type: 'date',
      description: 'Change this date whenever the policy text changes. It is shown at the top of the page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().min(70).max(160).warning('Aim for 120–160 characters'),
    }),
    shareImageField(),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Subheading', value: 'h3'},
          ],
          lists: [
            {title: 'Bullets', value: 'bullet'},
            {title: 'Numbers', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    description: 'https://…, mailto:… or tel:…',
                    validation: (rule) => rule.required().uri({scheme: ['https', 'http', 'mailto', 'tel']}),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', lastUpdated: 'lastUpdated'},
    prepare: ({title, lastUpdated}) => ({title: title || 'Privacy policy', subtitle: lastUpdated ? `Last updated ${lastUpdated}` : undefined}),
  },
})
