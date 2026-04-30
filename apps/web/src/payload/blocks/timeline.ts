import type { Block } from 'payload'

export const TimelineBlock: Block = {
  slug: 'timeline',
  labels: {
    singular: 'タイムライン',
    plural: 'タイムライン',
  },
  fields: [
    { name: 'label', type: 'text', label: 'セクション小見出し（例: History）' },
    { name: 'heading', type: 'text', label: 'タイトル' },
    { name: 'intro', type: 'textarea', label: 'リード文' },
    {
      name: 'items',
      type: 'array',
      label: 'マイルストーン',
      minRows: 2,
      fields: [
        { name: 'date', type: 'text', label: '時期（例: 2024.04）', required: true },
        { name: 'title', type: 'text', label: '見出し', required: true },
        { name: 'desc', type: 'textarea', label: '詳細' },
      ],
    },
  ],
}
