import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {resolve} from './presentation/resolve'
import {schemaTypes} from './schemaTypes'
import {FORM_SUBMISSIONS, SINGLETONS, structure} from './structure'

// Only these actions make sense for a document that must always exist.
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Gamma5 Media',

  projectId: 'e30j6wkp',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      allowOrigins: [
        'http://localhost:*',
        'https://gamma5media.com',
        'https://www.gamma5media.com',
      ],
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType) && !FORM_SUBMISSIONS.includes(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) => {
      if (SINGLETONS.includes(schemaType)) {
        return actions.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
      }
      if (FORM_SUBMISSIONS.includes(schemaType)) {
        return actions.filter(({action}) => action !== 'duplicate')
      }
      return actions
    },
  },
})
