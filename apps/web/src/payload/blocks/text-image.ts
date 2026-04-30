import type { Block } from 'payload'

export const TextImageBlock: Block = {
  slug: 'text-image',
  labels: {
    singular: 'テキスト+画像',
    plural: 'テキスト+画像',
  },
  fields: [
    { name: 'label', type: 'text', label: 'セクション小見出し' },
    { name: 'heading', type: 'text', label: '見出し', required: true },
    { name: 'body', type: 'textarea', label: '本文' },
    { name: 'image', type: 'upload', relationTo: 'media', label: '画像' },
    {
      name: 'imagePosition',
      type: 'select',
      label: '画像の位置',
      defaultValue: 'right',
      options: [
        { label: '右', value: 'right' },
        { label: '左', value: 'left' },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA ボタン（任意）',
      fields: [
        { name: 'label', type: 'text', label: 'ボタンテキスト' },
        { name: 'link', type: 'text', label: 'リンク先' },
      ],
    },
  ],
}
