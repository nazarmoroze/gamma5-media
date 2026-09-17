import {defineField} from 'sanity'

type FileValue = {asset?: {_ref?: string}} | undefined

const ONLY_MP4 = (value: FileValue) => {
  const ref = value?.asset?._ref
  if (!ref) return true
  return ref.endsWith('-mp4') ? true : 'Upload an MP4 file. Other formats do not play in every browser.'
}

/** Video uploaded to Sanity and served from its CDN. MP4 only, so it plays in Safari, Chrome and Firefox. */
export const videoFileField = ({
  name,
  title,
  description,
  group,
  fieldset,
}: {
  name: string
  title: string
  description: string
  group?: string
  fieldset?: string
}) =>
  defineField({
    name,
    title,
    type: 'file',
    group,
    fieldset,
    description,
    options: {accept: 'video/mp4'},
    validation: (rule) => rule.custom(ONLY_MP4),
  })
