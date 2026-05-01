'use client'

import Link from 'next/link'

const SECTIONS = [
  { slug: 'hero', label: 'メインビジュアル', icon: '⭐' },
  { slug: 'about', label: '強み・特徴', icon: '💪' },
  { slug: 'tracks', label: '実績', icon: '📋' },
  { slug: 'cta', label: '応募ボタン', icon: '🎯' },
]

export default function OpenEditorButton() {
  return (
    <div
      style={{
        margin: '12px 0 24px',
        padding: 16,
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        background: 'var(--theme-elevation-50)',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <strong style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
        🛠 経営者向け編集ページ
      </strong>
      <div style={{ marginBottom: 12, color: 'var(--theme-elevation-600)' }}>
        どこからでも編集できる、わかりやすい画面に切り替えます。プレビュー付き。
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SECTIONS.map((s) => (
          <Link
            key={s.slug}
            href={`/admin/edit?section=${s.slug}`}
            style={{
              padding: '8px 14px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: 6,
              background: 'var(--theme-elevation-100)',
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
            }}
          >
            <span>{s.icon}</span>
            <span>{s.label}を編集</span>
            <span style={{ opacity: 0.5 }}>↗</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
