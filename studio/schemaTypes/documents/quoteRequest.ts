import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

const METHODS = [
  {title: 'Email', value: 'email'},
  {title: 'WhatsApp', value: 'whatsapp'},
  {title: 'Telegram', value: 'telegram'},
]

const STATUSES = [
  {title: 'New', value: 'new'},
  {title: 'Contacted', value: 'contacted'},
  {title: 'Closed', value: 'closed'},
  {title: 'Spam', value: 'spam'},
]

const label = (list: {title: string; value: string}[], value?: string) =>
  list.find((item) => item.value === value)?.title ?? value

// Created by the contact form on the website. Only the status and notes are edited here.
export const quoteRequestType = defineType({
  name: 'quoteRequest',
  title: 'Quote request',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      options: {list: STATUSES, layout: 'radio', direction: 'horizontal'},
      initialValue: 'new',
    }),
    defineField({name: 'name', type: 'string', readOnly: true}),
    defineField({name: 'method', title: 'Reply via', type: 'string', options: {list: METHODS}, readOnly: true}),
    defineField({
      name: 'contact',
      type: 'string',
      description: 'Email address, WhatsApp number or Telegram username, depending on “Reply via”.',
      readOnly: true,
    }),
    defineField({name: 'receivedAt', title: 'Received', type: 'datetime', readOnly: true}),
    defineField({name: 'emailSent', title: 'Email notification sent', type: 'boolean', readOnly: true}),
    defineField({name: 'notes', type: 'text', rows: 4, description: 'Internal notes. Not shown on the website.'}),
  ],
  orderings: [{title: 'Newest first', name: 'receivedAtDesc', by: [{field: 'receivedAt', direction: 'desc'}]}],
  preview: {
    select: {name: 'name', method: 'method', contact: 'contact', status: 'status', receivedAt: 'receivedAt'},
    prepare: ({name, method, contact, status, receivedAt}) => ({
      title: name || 'Unnamed request',
      subtitle: [label(STATUSES, status), label(METHODS, method), contact].filter(Boolean).join(' · '),
      description: receivedAt ? new Date(receivedAt).toLocaleString('en-GB', {timeZone: 'Europe/Nicosia'}) : undefined,
    }),
  },
})
