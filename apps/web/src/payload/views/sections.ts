/**
 * AutoSite 詳細編集画面のサイドバー構造とフィールド定義。
 * 各「セクション」は Audition global の特定の部分への薄いビュー。
 *
 * 後で業種 Skill から動的に生成する想定。今はメインビジュアル（hero）だけ
 * 完全に動かして、他は同じ仕組みで横展開する。
 */

export type FieldKind = 'text' | 'textarea'

export type FieldDef = {
  /** 表示ラベル */
  label: string
  /** ヘルプテキスト */
  help?: string
  /** Audition global の中の dot path （例: 'hero.titleLine2'） */
  path: string
  kind: FieldKind
  /** 推奨文字数（業種 Skill から取得する想定。未指定ならカウンタ表示なし） */
  recommendedMax?: number
}

export type FieldGroup = {
  title: string
  desc?: string
  fields: FieldDef[]
  /** 「表示の仕方」プリセット選択を出すか（hero 等のみ） */
  showDisplayPreset?: boolean
}

export type SectionDef = {
  slug: string
  pageLabel: string
  pageIcon: string
  title: string
  description: string
  groups: FieldGroup[]
}

export type SidebarGroup = {
  label: string
  items: { slug: string; icon: string; label: string }[]
}

export const SECTIONS: SectionDef[] = [
  {
    slug: 'hero',
    pageLabel: 'メインビジュアル',
    pageIcon: '⭐',
    title: 'メインビジュアル',
    description: 'サイトを開いた時に最初に表示される、一番上の大きな部分です。',
    groups: [
      {
        title: '表示する文字',
        desc: '訪問者が最初に目にする部分です。短く、印象的に。',
        fields: [
          {
            label: '小さな見出し（上部の文字）',
            help: '英語や短いフレーズが効果的です',
            path: 'hero.eyebrow',
            kind: 'text',
            recommendedMax: 50,
          },
          {
            label: '大きな見出し（前半）',
            help: 'サイトの主役となる文字。短く力強く。',
            path: 'hero.titleLine1Prefix',
            kind: 'text',
            recommendedMax: 20,
          },
          {
            label: '大きな見出しの強調部分',
            help: 'ゴールドで強調表示される文字',
            path: 'hero.titleHighlight',
            kind: 'text',
            recommendedMax: 10,
          },
          {
            label: '大きな見出し（後半）',
            help: '末尾の助詞や記号',
            path: 'hero.titleLine1Suffix',
            kind: 'text',
            recommendedMax: 10,
          },
          {
            label: '大きな見出しの2行目',
            path: 'hero.titleLine2',
            kind: 'text',
            recommendedMax: 20,
          },
          {
            label: '補足の説明文',
            path: 'hero.lead',
            kind: 'textarea',
            recommendedMax: 200,
          },
        ],
        showDisplayPreset: true,
      },
      {
        title: 'メインボタン',
        desc: '訪問者に最も押してほしいボタンです。',
        fields: [
          {
            label: 'ボタンの文字',
            path: 'hero.primaryLabel',
            kind: 'text',
            recommendedMax: 20,
          },
          {
            label: 'ボタンを押した時の遷移先',
            help: 'ページ内のセクションは # から始めて指定します',
            path: 'hero.primaryHref',
            kind: 'text',
          },
        ],
      },
      {
        title: 'サブボタン',
        desc: '２つ目のボタン。',
        fields: [
          {
            label: 'ボタンの文字',
            path: 'hero.secondaryLabel',
            kind: 'text',
            recommendedMax: 20,
          },
          {
            label: 'ボタンを押した時の遷移先',
            path: 'hero.secondaryHref',
            kind: 'text',
          },
        ],
      },
    ],
  },
  {
    slug: 'about',
    pageLabel: '強み・特徴',
    pageIcon: '💪',
    title: '強み・特徴 (About)',
    description: 'なぜ自社を選ぶべきかを伝えるセクションです。',
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
    ],
  },
  {
    slug: 'tracks',
    pageLabel: '実績',
    pageIcon: '📋',
    title: '実績 (Track Record)',
    description: '配信プラットフォームや MV など、実績を見せるセクション。',
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
    ],
  },
  {
    slug: 'cta',
    pageLabel: '応募ボタン',
    pageIcon: '🎯',
    title: '応募ボタン (CTA)',
    description: 'ページ最下部の応募エリア。',
    groups: [
      {
        title: '見出し',
        fields: [
          { label: 'セクション小見出し', path: 'cta.label', kind: 'text', recommendedMax: 20 },
          { label: 'タイトル1行目', path: 'cta.titleLine1', kind: 'text', recommendedMax: 30 },
          { label: 'タイトル2行目', path: 'cta.titleLine2', kind: 'text', recommendedMax: 30 },
          { label: '説明文', path: 'cta.desc', kind: 'textarea', recommendedMax: 150 },
        ],
      },
      {
        title: 'メインボタン',
        fields: [
          { label: 'ボタンの文字', path: 'cta.primaryLabel', kind: 'text', recommendedMax: 20 },
          { label: 'ボタンの遷移先', path: 'cta.primaryHref', kind: 'text' },
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
      { slug: 'cta', icon: '🎯', label: '応募ボタン' },
    ],
  },
]

export const findSection = (slug: string) => SECTIONS.find((s) => s.slug === slug)
