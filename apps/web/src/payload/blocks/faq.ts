import type { Block } from 'payload'

export const FaqBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ',
  },
  fields: [
    { name: 'label', type: 'text', label: 'セクション小見出し（例: FAQ）' },
    { name: 'heading', type: 'text', label: 'タイトル' },
    { name: 'intro', type: 'textarea', label: 'リード文' },
    {
      name: 'items',
      type: 'array',
      label: '質問と回答',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', label: '質問', required: true },
        { name: 'answer', type: 'textarea', label: '回答', required: true },
      ],
    },
  ],
}
