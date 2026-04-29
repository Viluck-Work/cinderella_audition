import type { CollectionConfig } from 'payload'

import { ContentBlock } from '@/payload/blocks/content'
import { CtaBlock } from '@/payload/blocks/cta'
import { HeroBlock } from '@/payload/blocks/hero'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${data.slug === 'home' ? '' : data.slug}`,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ContentBlock, CtaBlock],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: '下書き', value: 'draft' },
        { label: '公開', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
