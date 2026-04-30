import type { GlobalConfig } from 'payload'

import {
  AUDITION_DEFAULTS as D,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_PRIMARY_COLOR,
} from '@/lib/audition-defaults'

const revealOptions = [
  { label: '左から', value: 'left' },
  { label: 'ズーム', value: 'zoom' },
  { label: '右から', value: 'right' },
]

export const Audition: GlobalConfig = {
  slug: 'audition',
  label: 'オーディションLP',
  admin: {
    group: 'コンテンツ',
    description:
      'オーディションランディングページ（/audition）の全文言・画像。各セクションを開いて編集してください。保存後、ページをリロードすると反映されます。',
    livePreview: {
      url: ({ data: _data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/audition`,
      breakpoints: [
        { label: 'モバイル', name: 'mobile', width: 390, height: 844 },
        { label: 'タブレット', name: 'tablet', width: 820, height: 1180 },
        { label: 'デスクトップ', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  fields: [
    {
      name: 'sharePreviewUrl',
      type: 'ui',
      admin: {
        components: {
          Field: '@/payload/components/SharePreviewURL',
        },
      },
    },
    {
      name: 'theme',
      type: 'group',
      label: 'カラーテーマ',
      admin: {
        description:
          'サイト全体の配色を 3 色で管理します。一番面積が大きい色がメインカラー、強調や差し色がサブ／アクセントです。「デフォルトに戻す」ボタンで初期配色に戻せます。',
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'text',
          label: 'メインカラー（ベース：面積の最も大きい色）',
          defaultValue: DEFAULT_BACKGROUND_COLOR,
          admin: {
            description:
              'サイト全体の地色。ここを変えるとカードの色も自動で連動して再計算されます。',
            components: {
              Field: '@/payload/components/ColorField',
            },
          },
        },
        {
          name: 'primaryColor',
          type: 'text',
          label: 'サブカラー（差し色：見出し・ボタン・ライン）',
          defaultValue: DEFAULT_PRIMARY_COLOR,
          admin: {
            description: 'セクションラベル、強調文字、ボタンの差し色などに使われます。',
            components: {
              Field: '@/payload/components/ColorField',
            },
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          label: 'アクセントカラー（強調・ハイライト）',
          defaultValue: DEFAULT_ACCENT_COLOR,
          admin: {
            description: 'CTA エリアのグロー、注意喚起などに使われる差し色。',
            components: {
              Field: '@/payload/components/ColorField',
            },
          },
        },
        {
          name: 'cardColor',
          type: 'text',
          label: 'カード色（任意）',
          defaultValue: '',
          admin: {
            description:
              '空欄ならメインカラーから自動で計算します。指定するとパネル / セクション / FAQ などすべてのカード基準色になります。強調カード（Flow / Conditions ヘッダ等）はここから派生。',
            components: {
              Field: '@/payload/components/ColorField',
            },
          },
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      label: '画像',
      admin: { description: 'メイン画像。Mediaコレクションにアップロードした画像を選択。' },
      fields: [
        {
          name: 'heroImage',
          type: 'upload',
          relationTo: 'media',
          label: 'FV画像（最上部）',
        },
        {
          name: 'featureImage',
          type: 'upload',
          relationTo: 'media',
          label: '中間バナー画像（FVのすぐ下）',
        },
        {
          name: 'lumiBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: "Groups - Lumi7's の背景画像",
        },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'FV (Hero)',
      admin: { description: 'ページ最上部のキービジュアル。' },
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          label: '上部の小さな見出し',
          defaultValue: D.hero.eyebrow,
        },
        { name: 'audition', type: 'text', label: '装飾テキスト', defaultValue: D.hero.audition },
        {
          name: 'titleLine1Prefix',
          type: 'text',
          label: 'メイン見出し1行目（前）',
          defaultValue: D.hero.titleLine1Prefix,
        },
        {
          name: 'titleHighlight',
          type: 'text',
          label: 'メイン見出し1行目（強調・ゴールド）',
          defaultValue: D.hero.titleHighlight,
        },
        {
          name: 'titleLine1Suffix',
          type: 'text',
          label: 'メイン見出し1行目（後）',
          defaultValue: D.hero.titleLine1Suffix,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'メイン見出し2行目',
          defaultValue: D.hero.titleLine2,
        },
        { name: 'lead', type: 'textarea', label: 'リード文', defaultValue: D.hero.lead },
        {
          name: 'stats',
          type: 'array',
          label: 'ステータスカード',
          defaultValue: D.hero.stats,
          fields: [
            { name: 'label', type: 'text', label: 'ラベル' },
            { name: 'value', type: 'text', label: '値' },
            { name: 'sub', type: 'textarea', label: '補足' },
          ],
        },
        {
          name: 'primaryHref',
          type: 'text',
          label: 'メインボタンのリンク先',
          defaultValue: D.hero.primaryHref,
        },
        {
          name: 'primaryLabel',
          type: 'text',
          label: 'メインボタンのラベル',
          defaultValue: D.hero.primaryLabel,
        },
        {
          name: 'secondaryHref',
          type: 'text',
          label: 'サブボタンのリンク先',
          defaultValue: D.hero.secondaryHref,
        },
        {
          name: 'secondaryLabel',
          type: 'text',
          label: 'サブボタンのラベル',
          defaultValue: D.hero.secondaryLabel,
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      label: 'About',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.about.label },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'タイトル1行目',
          defaultValue: D.about.titleLine1,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'タイトル2行目',
          defaultValue: D.about.titleLine2,
        },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.about.note },
        {
          name: 'paragraphs',
          type: 'array',
          label: '本文（段落ごと）',
          defaultValue: D.about.paragraphs.map((text) => ({ text })),
          fields: [{ name: 'text', type: 'textarea', label: '本文' }],
        },
        {
          name: 'scoreboard',
          type: 'array',
          label: '主要指標カード',
          defaultValue: D.about.scoreboard,
          fields: [
            { name: 'label', type: 'text', label: 'ラベル' },
            { name: 'value', type: 'text', label: '値' },
            { name: 'desc', type: 'textarea', label: '説明' },
          ],
        },
      ],
    },
    {
      name: 'tracks',
      type: 'group',
      label: 'Track Record（実績）',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.tracks.label },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'タイトル1行目',
          defaultValue: D.tracks.titleLine1,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'タイトル2行目',
          defaultValue: D.tracks.titleLine2,
        },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.tracks.note },
        {
          name: 'platformPanelTitle',
          type: 'text',
          label: 'プラットフォームパネル：見出し',
          defaultValue: D.tracks.platformPanelTitle,
        },
        {
          name: 'platformPanelDesc',
          type: 'textarea',
          label: 'プラットフォームパネル：説明',
          defaultValue: D.tracks.platformPanelDesc,
        },
        {
          name: 'platforms',
          type: 'array',
          label: 'プラットフォーム一覧',
          defaultValue: D.tracks.platforms,
          fields: [
            {
              name: 'iconPath',
              type: 'text',
              label: 'アイコンパス（例: /audition/assets/spotify.svg）',
            },
            { name: 'name', type: 'text', label: '名称' },
            { name: 'desc', type: 'text', label: '説明' },
          ],
        },
        {
          name: 'damPanelTitle',
          type: 'text',
          label: 'DAM パネル：見出し',
          defaultValue: D.tracks.damPanelTitle,
        },
        {
          name: 'damPanelDesc',
          type: 'textarea',
          label: 'DAM パネル：説明',
          defaultValue: D.tracks.damPanelDesc,
        },
        {
          name: 'mvSectionLabel',
          type: 'text',
          label: 'MV セクション小見出し',
          defaultValue: D.tracks.mvSectionLabel,
        },
        {
          name: 'mvSectionTitleLine1',
          type: 'text',
          label: 'MV タイトル1行目',
          defaultValue: D.tracks.mvSectionTitleLine1,
        },
        {
          name: 'mvSectionTitleLine2',
          type: 'text',
          label: 'MV タイトル2行目',
          defaultValue: D.tracks.mvSectionTitleLine2,
        },
        {
          name: 'mvSectionNote',
          type: 'textarea',
          label: 'MV リード文',
          defaultValue: D.tracks.mvSectionNote,
        },
        {
          name: 'mvs',
          type: 'array',
          label: 'Music Videos',
          defaultValue: D.tracks.mvs,
          fields: [
            {
              name: 'youtubeId',
              type: 'text',
              required: true,
              label: 'YouTube 動画ID（v= の後の文字列）',
            },
            { name: 'startSeconds', type: 'text', label: '再生開始秒数（任意）' },
            { name: 'kicker', type: 'text', label: 'キッカー（例: MV 01）' },
            { name: 'title', type: 'text', label: 'タイトル' },
            { name: 'desc', type: 'textarea', label: '説明' },
            { name: 'href', type: 'text', label: 'YouTube リンク' },
          ],
        },
      ],
    },
    {
      name: 'groups',
      type: 'group',
      label: 'Groups（既存グループ）',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.groups.label },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'タイトル1行目',
          defaultValue: D.groups.titleLine1,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'タイトル2行目',
          defaultValue: D.groups.titleLine2,
        },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.groups.note },
        {
          name: 'items',
          type: 'array',
          label: 'グループ',
          defaultValue: D.groups.items.map((item) => ({
            ...item,
            highlights: item.highlights.map((text) => ({ text })),
          })),
          fields: [
            { name: 'badge', type: 'text', label: 'バッジ（左上）' },
            { name: 'name', type: 'text', label: '英語名' },
            { name: 'nameKana', type: 'text', label: '日本語名・カナ' },
            { name: 'meta', type: 'text', label: 'デビュー日 / 人数' },
            { name: 'desc', type: 'textarea', label: '紹介文' },
            {
              name: 'highlights',
              type: 'array',
              label: '実績ハイライト（箇条書き）',
              fields: [{ name: 'text', type: 'text', label: '内容' }],
            },
            { name: 'logoPath', type: 'text', label: 'ロゴ画像パス' },
            { name: 'logoAlt', type: 'text', label: 'ロゴ alt テキスト' },
            {
              name: 'visualVariant',
              type: 'select',
              label: '背景バリエーション',
              defaultValue: 'default',
              options: [
                { label: 'デフォルト', value: 'default' },
                { label: 'Lumi (live-stage 背景)', value: 'lumi' },
              ],
            },
            {
              name: 'reveal',
              type: 'select',
              label: 'スクロール演出',
              options: revealOptions,
              defaultValue: 'left',
            },
          ],
        },
      ],
    },
    {
      name: 'support',
      type: 'group',
      label: 'Support（サポート理由）',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.support.label },
        { name: 'title', type: 'text', label: 'タイトル', defaultValue: D.support.title },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.support.note },
        {
          name: 'reasons',
          type: 'array',
          label: '理由カード',
          defaultValue: D.support.reasons,
          fields: [
            { name: 'no', type: 'text', label: 'No.（例: 01 / Creative）' },
            { name: 'title', type: 'text', label: '見出し' },
            { name: 'desc', type: 'textarea', label: '説明' },
            {
              name: 'reveal',
              type: 'select',
              label: 'スクロール演出',
              options: revealOptions,
              defaultValue: 'left',
            },
          ],
        },
      ],
    },
    {
      name: 'flow',
      type: 'group',
      label: 'Flow（合格〜デビューの流れ）',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.flow.label },
        { name: 'title', type: 'text', label: 'タイトル', defaultValue: D.flow.title },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.flow.note },
        {
          name: 'steps',
          type: 'array',
          label: 'ステップ',
          defaultValue: D.flow.steps,
          fields: [
            { name: 'step', type: 'text', label: 'ステップ番号（例: Step 01）' },
            { name: 'title', type: 'text', label: '見出し' },
            { name: 'desc', type: 'textarea', label: '説明' },
          ],
        },
      ],
    },
    {
      name: 'requirements',
      type: 'group',
      label: 'Requirements（求める人物像）',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'セクション小見出し',
          defaultValue: D.requirements.label,
        },
        { name: 'title', type: 'text', label: 'タイトル', defaultValue: D.requirements.title },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.requirements.note },
        {
          name: 'items',
          type: 'array',
          label: '項目',
          defaultValue: D.requirements.items,
          fields: [
            { name: 'title', type: 'text', label: '見出し' },
            { name: 'desc', type: 'textarea', label: '本文' },
          ],
        },
      ],
    },
    {
      name: 'conditions',
      type: 'group',
      label: 'Conditions（活動条件表）',
      admin: { description: '「同左」と入力すると、モバイル時には自動で「同上」と表示されます。' },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'セクション小見出し',
          defaultValue: D.conditions.label,
        },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'タイトル1行目',
          defaultValue: D.conditions.titleLine1,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'タイトル2行目',
          defaultValue: D.conditions.titleLine2,
        },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.conditions.note },
        {
          name: 'rows',
          type: 'array',
          label: '表の行',
          defaultValue: D.conditions.rows,
          fields: [
            { name: 'category', type: 'text', label: '項目（例: 寮）' },
            { name: 'beforeDebut', type: 'textarea', label: 'デビュー前' },
            { name: 'afterDebut', type: 'textarea', label: 'デビュー直後' },
            { name: 'oneYear', type: 'textarea', label: '1年後のイメージ' },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'group',
      label: 'FAQ',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.faq.label },
        { name: 'title', type: 'text', label: 'タイトル', defaultValue: D.faq.title },
        { name: 'note', type: 'textarea', label: 'リード文', defaultValue: D.faq.note },
        {
          name: 'items',
          type: 'array',
          label: 'よくある質問',
          defaultValue: D.faq.items,
          fields: [
            { name: 'question', type: 'text', label: '質問' },
            { name: 'answer', type: 'textarea', label: '回答' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA（最下部の応募エリア）',
      fields: [
        { name: 'label', type: 'text', label: 'セクション小見出し', defaultValue: D.cta.label },
        {
          name: 'titleLine1',
          type: 'text',
          label: 'タイトル1行目',
          defaultValue: D.cta.titleLine1,
        },
        {
          name: 'titleLine2',
          type: 'text',
          label: 'タイトル2行目',
          defaultValue: D.cta.titleLine2,
        },
        { name: 'desc', type: 'textarea', label: '説明文', defaultValue: D.cta.desc },
        {
          name: 'primaryHref',
          type: 'text',
          label: 'メインボタンのリンク先（応募フォームURL）',
          defaultValue: D.cta.primaryHref,
        },
        {
          name: 'primaryLabel',
          type: 'text',
          label: 'メインボタンのラベル',
          defaultValue: D.cta.primaryLabel,
        },
        {
          name: 'secondaryHref',
          type: 'text',
          label: 'サブボタンのリンク先',
          defaultValue: D.cta.secondaryHref,
        },
        {
          name: 'secondaryLabel',
          type: 'text',
          label: 'サブボタンのラベル',
          defaultValue: D.cta.secondaryLabel,
        },
      ],
    },
  ],
}
