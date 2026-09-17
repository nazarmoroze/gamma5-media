import {defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'company', title: 'Company', default: true},
    {name: 'contacts', title: 'Contacts & socials'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Brand name',
      type: 'string',
      group: 'company',
      description: 'Short name used across the site, e.g. GAMMA5.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      // Holds the full brand name despite the field name; the registered entity is in registeredName.
      name: 'legalName',
      title: 'Full brand name',
      type: 'string',
      group: 'company',
      description: 'Used as the LinkedIn label and as the alternate name in structured data, e.g. GAMMA5 Media.',
    }),
    defineField({
      name: 'registeredName',
      title: 'Legal entity name',
      type: 'string',
      group: 'company',
      description:
        'Registered company name, shown in the footer copyright and used in structured data, e.g. Clubia Club Individual Adventures LTD.',
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'company',
      description: 'Shown in the footer, e.g. Based in Cyprus, working worldwide.',
    }),

    defineField({
      name: 'email',
      type: 'string',
      group: 'contacts',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      group: 'contacts',
      description: 'International format, e.g. +357 96 167457. Also used for the WhatsApp link.',
      validation: (rule) =>
        rule.regex(/^\+[\d\s()-]{7,20}$/, {name: 'international phone number'}).warning(),
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram username',
      type: 'string',
      group: 'contacts',
      description: 'Without @, e.g. tillmannv',
      validation: (rule) => rule.regex(/^[A-Za-z0-9_]{5,32}$/, {name: 'Telegram username'}),
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram username',
      type: 'string',
      group: 'contacts',
      description: 'Without @, e.g. gamma5media',
      validation: (rule) => rule.regex(/^[A-Za-z0-9._]{1,30}$/, {name: 'Instagram username'}),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'contacts',
      validation: (rule) => rule.uri({scheme: ['https']}),
    }),
  ],
  preview: {
    prepare: () => ({title: 'Site settings'}),
  },
})
