/**
 * AutoSite 詳細編集画面のサイドバー構造とフィールド定義。
 * 各「セクション」は Audition global の特定の部分への薄いビュー。
 *
 * 後で業種 Skill から動的に生成する想定。今は手書き。
 */

export type FlatFieldDef = {
  label: string
  help?: string
  /** Audition global の中の dot path （例: 'hero.titleLine2'） */
  path: string
  kind: 'text' | 'textarea' | 'color'
  /** 推奨文字数 */
  recommendedMax?: number
  /** color の時に空欄を許容（自動算出など） */
  allowEmpty?: boolean
}

export type ArrayFieldDef = {
  label: string
  help?: string
  /** 配列フィールドへの dot path （例: 'hero.stats'） */
  path: string
  kind: 'array'
  /** 各アイテムの表示ラベル。'{n}' があれば 1 始まりの番号に置換（例: 'カード {n}'） */
  itemLabelTemplate?: string
  /** アイテム内のサブフィールド（path はアイテムからの相対） */
  itemFields: FlatFieldDef[]
  /** 「追加」ボタンで作る初期値 */
  defaultItem: Record<string, unknown>
  minItems?: number
}

export type FieldDef = FlatFieldDef | ArrayFieldDef

export type FieldGroup = {
  title: string
  desc?: string
  fields: FieldDef[]
}

export type SectionDef = {
  slug: string
  pageLabel: string
  pageIcon: string
  title: string
  description: string
  /** クリック時に iframe をスクロールさせるアンカー（'#about' など）。なければトップ */
  anchor?: string
  groups: FieldGroup[]
}

export type SidebarGroup = {
  label: string
  items: { slug: string; icon: string; label: string }[]
}

export const SECTIONS: SectionDef[] = [
  // サイト全体
  {
    slug: 'theme',
    pageLabel: '色とロゴ',
    pageIcon: '🎨',
    title: 'カラーテーマ',
    description: 'サイト全体の配色を 3 色で管理します。',
    anchor: '#top',
    groups: [
      {
        title: 'カラー',
        fields: [
          { label: 'メインカラー（背景）', path: 'theme.backgroundColor', kind: 'color' },
          { label: 'サブカラー（差し色）', path: 'theme.primaryColor', kind: 'color' },
          { label: 'アクセントカラー', path: 'theme.accentColor', kind: 'color' },
          {
            label: 'カード色',
            help: '空欄なら背景から自動算出',
            path: 'theme.cardColor',
            kind: 'color',
            allowEmpty: true,
          },
        ],
      },
    ],
  },

  // FV / Hero
  {
    slug: 'hero',
    pageLabel: 'メインビジュアル',
    pageIcon: '⭐',
    title: 'メインビジュアル',
    description: 'サイトを開いた時に最初に表示される、一番上の大きな部分です。',
    anchor: '#top',
    groups: [
      {
        title: '表示する文字',
        desc: '訪問者が最初に目にする部分です。',
        fields: [
          { label: '上部の小さな見出し', path: 'hero.eyebrow', kind: 'text', recommendedMax: 50 },
          { label: '装飾テキスト (Audition)', path: 'hero.audition', kind: 'text', recommendedMax: 20 },
          { label: '見出し1行目（前）', path: 'hero.titleLine1Prefix', kind: 'text', recommendedMax: 20 },
          { label: '見出し1行目（強調）', path: 'hero.titleHighlight', kind: 'text', recommendedMax: 10 },
          { label: '見出し1行目（後）', path: 'hero.titleLine1Suffix', kind: 'text', recommendedMax: 10 },
          { label: '見出し2行目', path: 'hero.titleLine2', kind: 'text', recommendedMax: 20 },
          { label: '補足の説明文', path: 'hero.lead', kind: 'textarea', recommendedMax: 200 },
        ],
      },
      {
        title: 'ステータスカード',
        desc: '画面下部に並ぶ 3 つの小さなカード。',
        fields: [
          {
            label: 'カード一覧',
            path: 'hero.stats',
            kind: 'array',
            itemLabelTemplate: 'カード {n}',
            defaultItem: { label: '', value: '', sub: '' },
            itemFields: [
              { label: 'ラベル', path: 'label', kind: 'text', recommendedMax: 20 },
              { label: '値', path: 'value', kind: 'text', recommendedMax: 30 },
              { label: '補足', path: 'sub', kind: 'textarea', recommendedMax: 80 },
            ],
          },
        ],
      },
      {
        title: 'メインボタン',
        fields: [
          { label: 'ボタンの文字', path: 'hero.primaryLabel', kind: 'text', recommendedMax: 20 },
          { label: 'リンク先', path: 'hero.primaryHref', kind: 'text' },
        ],
      },
      {
        title: 'サブボタン',
        fields: [
          { label: 'ボタンの文字', path: 'hero.secondaryLabel', kind: 'text', recommendedMax: 20 },
          { label: 'リンク先', path: 'hero.secondaryHref', kind: 'text' },
        ],
      },
    ],
  },

  // About
  {
    slug: 'about',
    pageLabel: '強み・特徴',
    pageIcon: '💪',
    title: '強み・特徴 (About)',
    description: 'なぜ自社を選ぶべきかを伝えるセクション。',
    anchor: '#about',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'about.label', kind: 'text', recommendedMax: 20 },
          { label: 'タイトル1行目', path: 'about.titleLine1', kind: 'text', recommendedMax: 30 },
          { label: 'タイトル2行目', path: 'about.titleLine2', kind: 'text', recommendedMax: 30 },
          { label: 'リード文', path: 'about.note', kind: 'textarea', recommendedMax: 150 },
        ],
      },
      {
        title: '本文（段落）',
        fields: [
          {
            label: '段落',
            path: 'about.paragraphs',
            kind: 'array',
            itemLabelTemplate: '段落 {n}',
            defaultItem: { text: '' },
            itemFields: [{ label: '本文', path: 'text', kind: 'textarea', recommendedMax: 300 }],
          },
        ],
      },
      {
        title: '主要指標カード',
        fields: [
          {
            label: '指標カード',
            path: 'about.scoreboard',
            kind: 'array',
            itemLabelTemplate: 'カード {n}',
            defaultItem: { label: '', value: '', desc: '' },
            itemFields: [
              { label: 'ラベル', path: 'label', kind: 'text', recommendedMax: 20 },
              { label: '値', path: 'value', kind: 'text', recommendedMax: 30 },
              { label: '説明', path: 'desc', kind: 'textarea', recommendedMax: 80 },
            ],
          },
        ],
      },
    ],
  },

  // Track Record
  {
    slug: 'tracks',
    pageLabel: '実績',
    pageIcon: '📋',
    title: '実績 (Track Record)',
    description: '配信プラットフォームや MV など、実績を見せるセクション。',
    anchor: '#tracks',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'tracks.label', kind: 'text', recommendedMax: 20 },
          { label: 'タイトル1行目', path: 'tracks.titleLine1', kind: 'text', recommendedMax: 30 },
          { label: 'タイトル2行目', path: 'tracks.titleLine2', kind: 'text', recommendedMax: 30 },
          { label: 'リード文', path: 'tracks.note', kind: 'textarea', recommendedMax: 150 },
        ],
      },
      {
        title: 'プラットフォームパネル',
        fields: [
          { label: '見出し', path: 'tracks.platformPanelTitle', kind: 'text', recommendedMax: 30 },
          { label: '説明', path: 'tracks.platformPanelDesc', kind: 'textarea', recommendedMax: 200 },
          {
            label: 'プラットフォーム一覧',
            path: 'tracks.platforms',
            kind: 'array',
            itemLabelTemplate: 'プラットフォーム {n}',
            defaultItem: { iconPath: '', name: '', desc: '' },
            itemFields: [
              { label: 'アイコンパス', path: 'iconPath', kind: 'text' },
              { label: '名称', path: 'name', kind: 'text' },
              { label: '説明', path: 'desc', kind: 'text' },
            ],
          },
        ],
      },
      {
        title: 'DAM パネル',
        fields: [
          { label: '見出し', path: 'tracks.damPanelTitle', kind: 'text' },
          { label: '説明', path: 'tracks.damPanelDesc', kind: 'textarea' },
        ],
      },
      {
        title: 'MV セクション',
        fields: [
          { label: '小見出し', path: 'tracks.mvSectionLabel', kind: 'text' },
          { label: 'タイトル1行目', path: 'tracks.mvSectionTitleLine1', kind: 'text' },
          { label: 'タイトル2行目', path: 'tracks.mvSectionTitleLine2', kind: 'text' },
          { label: 'リード文', path: 'tracks.mvSectionNote', kind: 'textarea' },
          {
            label: 'Music Videos',
            path: 'tracks.mvs',
            kind: 'array',
            itemLabelTemplate: 'MV {n}',
            defaultItem: { youtubeId: '', kicker: '', title: '', desc: '', href: '' },
            itemFields: [
              { label: 'YouTube 動画 ID', path: 'youtubeId', kind: 'text' },
              { label: '再生開始秒数（任意）', path: 'startSeconds', kind: 'text' },
              { label: 'キッカー', path: 'kicker', kind: 'text' },
              { label: 'タイトル', path: 'title', kind: 'text' },
              { label: '説明', path: 'desc', kind: 'textarea' },
              { label: 'YouTube リンク', path: 'href', kind: 'text' },
            ],
          },
        ],
      },
    ],
  },

  // Groups
  {
    slug: 'groups',
    pageLabel: '既存グループ',
    pageIcon: '👥',
    title: '既存グループ (Groups)',
    description: '所属しているグループの紹介。',
    anchor: '#groups',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'groups.label', kind: 'text' },
          { label: 'タイトル1行目', path: 'groups.titleLine1', kind: 'text' },
          { label: 'タイトル2行目', path: 'groups.titleLine2', kind: 'text' },
          { label: 'リード文', path: 'groups.note', kind: 'textarea' },
        ],
      },
      {
        title: 'グループ一覧',
        fields: [
          {
            label: 'グループ',
            path: 'groups.items',
            kind: 'array',
            itemLabelTemplate: 'グループ {n}',
            defaultItem: {
              badge: '',
              name: '',
              nameKana: '',
              meta: '',
              desc: '',
              logoPath: '',
              logoAlt: '',
              visualVariant: 'default',
              reveal: 'left',
            },
            itemFields: [
              { label: 'バッジ', path: 'badge', kind: 'text' },
              { label: '英語名', path: 'name', kind: 'text' },
              { label: '日本語名・カナ', path: 'nameKana', kind: 'text' },
              { label: 'デビュー日 / 人数', path: 'meta', kind: 'text' },
              { label: '紹介文', path: 'desc', kind: 'textarea' },
              { label: 'ロゴパス', path: 'logoPath', kind: 'text' },
              { label: 'ロゴ alt', path: 'logoAlt', kind: 'text' },
            ],
          },
        ],
      },
    ],
  },

  // Support
  {
    slug: 'support',
    pageLabel: 'サポート',
    pageIcon: '🤝',
    title: 'サポート理由 (Support)',
    description: 'なぜ続けられるか、どう支援するかのセクション。',
    anchor: '#support',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'support.label', kind: 'text' },
          { label: 'タイトル', path: 'support.title', kind: 'text' },
          { label: 'リード文', path: 'support.note', kind: 'textarea' },
        ],
      },
      {
        title: '理由カード',
        fields: [
          {
            label: '理由',
            path: 'support.reasons',
            kind: 'array',
            itemLabelTemplate: '理由 {n}',
            defaultItem: { no: '', title: '', desc: '', reveal: 'left' },
            itemFields: [
              { label: 'No.', path: 'no', kind: 'text' },
              { label: '見出し', path: 'title', kind: 'text' },
              { label: '説明', path: 'desc', kind: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // Flow
  {
    slug: 'flow',
    pageLabel: '流れ',
    pageIcon: '🔄',
    title: '合格〜デビューの流れ (Flow)',
    description: 'ステップごとの流れを示すセクション。',
    anchor: '#flow',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'flow.label', kind: 'text' },
          { label: 'タイトル', path: 'flow.title', kind: 'text' },
          { label: 'リード文', path: 'flow.note', kind: 'textarea' },
        ],
      },
      {
        title: 'ステップ',
        fields: [
          {
            label: 'ステップ',
            path: 'flow.steps',
            kind: 'array',
            itemLabelTemplate: 'Step {n}',
            defaultItem: { step: '', title: '', desc: '' },
            itemFields: [
              { label: 'ステップ番号', path: 'step', kind: 'text' },
              { label: '見出し', path: 'title', kind: 'text' },
              { label: '説明', path: 'desc', kind: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // Requirements
  {
    slug: 'requirements',
    pageLabel: '求める人物像',
    pageIcon: '🎯',
    title: '求める人物像 (Requirements)',
    description: '応募者へのメッセージ。',
    anchor: '#requirements',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'requirements.label', kind: 'text' },
          { label: 'タイトル', path: 'requirements.title', kind: 'text' },
          { label: 'リード文', path: 'requirements.note', kind: 'textarea' },
        ],
      },
      {
        title: '項目',
        fields: [
          {
            label: '項目',
            path: 'requirements.items',
            kind: 'array',
            itemLabelTemplate: '項目 {n}',
            defaultItem: { title: '', desc: '' },
            itemFields: [
              { label: '見出し', path: 'title', kind: 'text' },
              { label: '本文', path: 'desc', kind: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // Conditions
  {
    slug: 'conditions',
    pageLabel: '活動条件',
    pageIcon: '📊',
    title: '活動条件表 (Conditions)',
    description: '寮・送迎・休日などの条件を整理した表。',
    anchor: '#top',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'conditions.label', kind: 'text' },
          { label: 'タイトル1行目', path: 'conditions.titleLine1', kind: 'text' },
          { label: 'タイトル2行目', path: 'conditions.titleLine2', kind: 'text' },
          { label: 'リード文', path: 'conditions.note', kind: 'textarea' },
        ],
      },
      {
        title: '表の行',
        fields: [
          {
            label: '行',
            path: 'conditions.rows',
            kind: 'array',
            itemLabelTemplate: '行 {n}',
            defaultItem: { category: '', beforeDebut: '', afterDebut: '', oneYear: '' },
            itemFields: [
              { label: '項目', path: 'category', kind: 'text' },
              { label: 'デビュー前', path: 'beforeDebut', kind: 'textarea' },
              { label: 'デビュー直後', path: 'afterDebut', kind: 'textarea' },
              { label: '1年後のイメージ', path: 'oneYear', kind: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // FAQ
  {
    slug: 'faq',
    pageLabel: 'FAQ',
    pageIcon: '❓',
    title: 'FAQ',
    description: 'よくある質問。',
    anchor: '#faq',
    groups: [
      {
        title: 'セクションタイトル',
        fields: [
          { label: 'セクション小見出し', path: 'faq.label', kind: 'text' },
          { label: 'タイトル', path: 'faq.title', kind: 'text' },
          { label: 'リード文', path: 'faq.note', kind: 'textarea' },
        ],
      },
      {
        title: '質問と回答',
        fields: [
          {
            label: '質問',
            path: 'faq.items',
            kind: 'array',
            itemLabelTemplate: 'Q{n}',
            defaultItem: { question: '', answer: '' },
            itemFields: [
              { label: '質問', path: 'question', kind: 'text' },
              { label: '回答', path: 'answer', kind: 'textarea' },
            ],
          },
        ],
      },
    ],
  },

  // CTA
  {
    slug: 'cta',
    pageLabel: '応募ボタン',
    pageIcon: '🎯',
    title: '応募ボタン (CTA)',
    description: 'ページ最下部の応募エリア。',
    anchor: '#entry',
    groups: [
      {
        title: '見出し',
        fields: [
          { label: 'セクション小見出し', path: 'cta.label', kind: 'text' },
          { label: 'タイトル1行目', path: 'cta.titleLine1', kind: 'text' },
          { label: 'タイトル2行目', path: 'cta.titleLine2', kind: 'text' },
          { label: '説明文', path: 'cta.desc', kind: 'textarea' },
        ],
      },
      {
        title: 'メインボタン',
        fields: [
          { label: 'ボタンの文字', path: 'cta.primaryLabel', kind: 'text' },
          { label: 'リンク先', path: 'cta.primaryHref', kind: 'text' },
        ],
      },
      {
        title: 'サブボタン',
        fields: [
          { label: 'ボタンの文字', path: 'cta.secondaryLabel', kind: 'text' },
          { label: 'リンク先', path: 'cta.secondaryHref', kind: 'text' },
        ],
      },
    ],
  },
]

export const SIDEBAR: SidebarGroup[] = [
  {
    label: 'サイト全体',
    items: [{ slug: 'theme', icon: '🎨', label: '色とロゴ' }],
  },
  {
    label: 'トップページ',
    items: [
      { slug: 'hero', icon: '⭐', label: 'メインビジュアル' },
      { slug: 'about', icon: '💪', label: '強み・特徴' },
      { slug: 'tracks', icon: '📋', label: '実績' },
      { slug: 'groups', icon: '👥', label: '既存グループ' },
      { slug: 'support', icon: '🤝', label: 'サポート' },
      { slug: 'flow', icon: '🔄', label: '流れ' },
      { slug: 'requirements', icon: '🎯', label: '求める人物像' },
      { slug: 'conditions', icon: '📊', label: '活動条件' },
      { slug: 'faq', icon: '❓', label: 'FAQ' },
      { slug: 'cta', icon: '🎯', label: '応募ボタン' },
    ],
  },
]

export const findSection = (slug: string) => SECTIONS.find((s) => s.slug === slug)
