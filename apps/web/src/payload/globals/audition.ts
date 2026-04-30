import type { GlobalConfig } from 'payload'

const revealOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Zoom', value: 'zoom' },
  { label: 'Right', value: 'right' },
]

export const Audition: GlobalConfig = {
  slug: 'audition',
  admin: {
    group: 'コンテンツ',
  },
  fields: [
    {
      name: 'media',
      type: 'group',
      label: '画像',
      fields: [
        { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'FV画像' },
        { name: 'featureImage', type: 'upload', relationTo: 'media', label: '中間バナー画像' },
        {
          name: 'lumiBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: "Lumi7's 背景画像",
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'FV (Hero)',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'audition', type: 'text', label: '装飾テキスト' },
        { name: 'titleLine1Prefix', type: 'text', label: '見出し1行目（前）' },
        { name: 'titleHighlight', type: 'text', label: '見出し1行目（強調）' },
        { name: 'titleLine1Suffix', type: 'text', label: '見出し1行目（後）' },
        { name: 'titleLine2', type: 'text', label: '見出し2行目' },
        { name: 'lead', type: 'textarea' },
        {
          name: 'stats',
          type: 'array',
          label: 'ステータスカード',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'value', type: 'text' },
            { name: 'sub', type: 'textarea' },
          ],
        },
        { name: 'primaryHref', type: 'text' },
        { name: 'primaryLabel', type: 'text' },
        { name: 'secondaryHref', type: 'text' },
        { name: 'secondaryLabel', type: 'text' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'titleLine1', type: 'text' },
        { name: 'titleLine2', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'paragraphs',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea' }],
        },
        {
          name: 'scoreboard',
          type: 'array',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'value', type: 'text' },
            { name: 'desc', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'tracks',
      type: 'group',
      label: 'Track Record',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'titleLine1', type: 'text' },
        { name: 'titleLine2', type: 'text' },
        { name: 'note', type: 'textarea' },
        { name: 'platformPanelTitle', type: 'text' },
        { name: 'platformPanelDesc', type: 'textarea' },
        {
          name: 'platforms',
          type: 'array',
          fields: [
            { name: 'iconPath', type: 'text', label: 'アイコンパス（/audition/...）' },
            { name: 'name', type: 'text' },
            { name: 'desc', type: 'text' },
          ],
        },
        { name: 'damPanelTitle', type: 'text' },
        { name: 'damPanelDesc', type: 'textarea' },
        { name: 'mvSectionLabel', type: 'text' },
        { name: 'mvSectionTitleLine1', type: 'text' },
        { name: 'mvSectionTitleLine2', type: 'text' },
        { name: 'mvSectionNote', type: 'textarea' },
        {
          name: 'mvs',
          type: 'array',
          label: 'Music Videos',
          fields: [
            { name: 'youtubeId', type: 'text', required: true },
            { name: 'startSeconds', type: 'text' },
            { name: 'kicker', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'desc', type: 'textarea' },
            { name: 'href', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'groups',
      type: 'group',
      label: 'Groups',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'titleLine1', type: 'text' },
        { name: 'titleLine2', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'badge', type: 'text' },
            { name: 'name', type: 'text' },
            { name: 'nameKana', type: 'text' },
            { name: 'meta', type: 'text' },
            { name: 'desc', type: 'textarea' },
            {
              name: 'highlights',
              type: 'array',
              fields: [{ name: 'text', type: 'text' }],
            },
            { name: 'logoPath', type: 'text' },
            { name: 'logoAlt', type: 'text' },
            {
              name: 'visualVariant',
              type: 'select',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Lumi (live-stage bg)', value: 'lumi' },
              ],
              defaultValue: 'default',
            },
            { name: 'reveal', type: 'select', options: revealOptions, defaultValue: 'left' },
          ],
        },
      ],
    },
    {
      name: 'support',
      type: 'group',
      label: 'Support',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'reasons',
          type: 'array',
          fields: [
            { name: 'no', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'desc', type: 'textarea' },
            { name: 'reveal', type: 'select', options: revealOptions, defaultValue: 'left' },
          ],
        },
      ],
    },
    {
      name: 'flow',
      type: 'group',
      label: 'Flow',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'steps',
          type: 'array',
          fields: [
            { name: 'step', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'desc', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'requirements',
      type: 'group',
      label: 'Requirements',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'desc', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'conditions',
      type: 'group',
      label: 'Conditions',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'titleLine1', type: 'text' },
        { name: 'titleLine2', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'rows',
          type: 'array',
          fields: [
            { name: 'category', type: 'text' },
            { name: 'beforeDebut', type: 'textarea' },
            { name: 'afterDebut', type: 'textarea' },
            { name: 'oneYear', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'group',
      label: 'FAQ',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'note', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'question', type: 'text' },
            { name: 'answer', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'titleLine1', type: 'text' },
        { name: 'titleLine2', type: 'text' },
        { name: 'desc', type: 'textarea' },
        { name: 'primaryHref', type: 'text' },
        { name: 'primaryLabel', type: 'text' },
        { name: 'secondaryHref', type: 'text' },
        { name: 'secondaryLabel', type: 'text' },
      ],
    },
  ],
}
