import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: '数値ハイライト',
    plural: '数値ハイライト',
  },
  fields: [
    { name: 'label', type: 'text', label: 'セクション小見出し（例: Numbers）' },
    { name: 'heading', type: 'text', label: 'タイトル' },
    { name: 'intro', type: 'textarea', label: 'リード文' },
    {
      name: 'items',
      type: 'array',
      label: '数値カード',
      minRows: 2,
      fields: [
        { name: 'value', type: 'text', label: '数値（例: 100%, 50社）', required: true },
        { name: 'label', type: 'text', label: 'ラベル', required: true },
        { name: 'sub', type: 'text', label: '補足' },
      ],
    },
  ],
}
