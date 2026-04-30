'use client'

import { useEffect, useState } from 'react'

const PATH = '/audition'

const resolveOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}

export default function SharePreviewURL() {
  const [origin, setOrigin] = useState<string>(() => resolveOrigin())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setOrigin(resolveOrigin())
  }, [])

  const url = origin ? `${origin}${PATH}` : ''

  const copy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      style={{
        margin: '12px 0 28px',
        padding: 16,
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 8,
        background: 'var(--theme-elevation-50)',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>🔗 公開ページURL</strong>
      <div style={{ marginBottom: 10, color: 'var(--theme-elevation-600)' }}>
        編集内容を保存後、このURLでオーディションLPが公開されます。
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <code
          style={{
            padding: '6px 10px',
            background: 'var(--theme-elevation-100)',
            borderRadius: 4,
            wordBreak: 'break-all',
            flex: 1,
            minWidth: 240,
          }}
        >
          {url || '（URL を取得中…）'}
        </code>
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            background: 'var(--theme-elevation-100)',
            cursor: url ? 'pointer' : 'not-allowed',
          }}
        >
          {copied ? '✓ コピー済み' : 'コピー'}
        </button>
        <a
          href={url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'inherit',
            pointerEvents: url ? 'auto' : 'none',
            opacity: url ? 1 : 0.5,
          }}
        >
          開く ↗
        </a>
      </div>
    </div>
  )
}
