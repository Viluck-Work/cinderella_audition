import type { Block } from 'payload'

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'バナー',
    plural: 'バナー',
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', label: '背景画像', required: true },
    { name: 'heading', type: 'text', label: '大見出し', required: true },
    { name: 'subheading', type: 'textarea', label: 'サブテキスト' },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA ボタン（任意）',
      fields: [
        { name: 'label', type: 'text', label: 'ボタンテキスト' },
        { name: 'link', type: 'text', label: 'リンク先' },
      ],
    },
    {
      name: 'overlay',
      type: 'select',
      label: '画像のオーバーレイ',
      defaultValue: 'medium',
      options: [
        { label: 'なし', value: 'none' },
        { label: '弱め', value: 'light' },
        { label: '中', value: 'medium' },
        { label: '強め', value: 'strong' },
      ],
    },
  ],
}
