import type { Block } from 'payload'

export const CtaBlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'CTA',
    plural: 'CTA',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
    },
  ],
}
