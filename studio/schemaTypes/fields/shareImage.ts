import {defineField} from 'sanity'

const WIDTH = 1200
const HEIGHT = 630

// Sanity image asset IDs look like "image-<hash>-1200x630-jpg".
function parseAssetRef(ref?: string) {
  const match = ref?.match(/-(\d+)x(\d+)-([a-z0-9]+)$/)
  if (!match) return null
  return {width: Number(match[1]), height: Number(match[2]), format: match[3]}
}

type ShareImageValue = {asset?: {_ref?: string}} | undefined

/**
 * Image shown when a page is shared in messengers and social networks (Open Graph / X cards).
 * When empty, the site falls back to the default GAMMA5 share image.
 */
export const shareImageField = ({name = 'shareImage', group}: {name?: string; group?: string} = {}) =>
  defineField({
    name,
    title: 'Share image',
    type: 'image',
    group,
    description:
      'Preview shown when this page is shared in WhatsApp, Telegram, Facebook, LinkedIn or X. Upload a JPG (photos) or PNG (graphics) exactly 1200 × 630 px, landscape 1.91:1. Keep logos and text away from the edges, some apps crop them. Keep the file light, a few hundred KB at most. Leave empty to use the default GAMMA5 image.',
    options: {hotspot: true, accept: 'image/jpeg,image/png'},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
        description: 'Short description of the image for people who cannot see it.',
      }),
    ],
    validation: (rule) => [
      rule.custom((value: ShareImageValue) => {
        const asset = parseAssetRef(value?.asset?._ref)
        if (!asset) return true
        return ['jpg', 'jpeg', 'png'].includes(asset.format) ? true : 'Upload a JPG or PNG file. Messengers do not show SVG, WebP or GIF previews reliably.'
      }),
      rule
        .custom((value: ShareImageValue) => {
          const asset = parseAssetRef(value?.asset?._ref)
          if (!asset) return true
          if (asset.width < WIDTH || asset.height < HEIGHT) {
            return `The image is ${asset.width} × ${asset.height} px. Use at least ${WIDTH} × ${HEIGHT} px, otherwise the preview looks blurry.`
          }
          const ratio = asset.width / asset.height
          if (Math.abs(ratio - WIDTH / HEIGHT) > 0.04) {
            return `The image is ${asset.width} × ${asset.height} px. Use a 1.91:1 landscape image (${WIDTH} × ${HEIGHT} px), otherwise it will be cropped.`
          }
          return true
        })
        .warning(),
    ],
  })
