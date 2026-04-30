import type { Block } from 'payload'

export const FeatureGridBlock: Block = {
  slug: 'feature-grid',
  labels: {
    singular: '特徴グリッド',
    plural: '特徴グリッド',
  },
  fields: [
    { name: 'label', type: 'text', label: 'セクション小見出し（例: Features）' },
    { name: 'heading', type: 'text', label: 'タイトル' },
    { name: 'intro', type: 'textarea', label: 'リード文' },
    {
      name: 'columns',
      type: 'select',
      label: '横の列数',
      defaultValue: '3',
      options: [
        { label: '2 列', value: '2' },
        { label: '3 列', value: '3' },
        { label: '4 列', value: '4' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: '項目',
      minRows: 2,
      fields: [
        { name: 'icon', type: 'text', label: 'アイコン（絵文字 1 字 or 数字）' },
        { name: 'title', type: 'text', label: '見出し', required: true },
        { name: 'desc', type: 'textarea', label: '説明' },
      ],
    },
  ],
}
