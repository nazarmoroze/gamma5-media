import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {HomeIcon} from '@sanity/icons/Home'
import {LockIcon} from '@sanity/icons/Lock'
import {PlayIcon} from '@sanity/icons/Play'

// One document each, with a fixed ID. Kept out of "create new" and destructive actions.
export const SINGLETONS = ['homePage', 'siteSettings', 'privacyPolicy']

// Created by the website's contact form, never from the Studio.
export const FORM_SUBMISSIONS = ['quoteRequest']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Home page')
        .id('homePage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home page')),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
      S.listItem()
        .title('Privacy policy')
        .id('privacyPolicy')
        .icon(LockIcon)
        .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicy').title('Privacy policy')),
      S.divider(),
      S.listItem()
        .title('Quote requests')
        .id('quoteRequests')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('quoteRequest')
            .title('Quote requests')
            .defaultOrdering([{field: 'receivedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Cases')
        .id('cases')
        .icon(PlayIcon)
        .child(
          S.documentTypeList('case')
            .title('Cases')
            .defaultOrdering([
              {field: 'order', direction: 'asc'},
              {field: 'year', direction: 'desc'},
            ]),
        ),
    ])
