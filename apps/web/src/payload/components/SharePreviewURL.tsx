'use client'

import { useState } from 'react'

const PATH = '/audition'

export default function SharePreviewURL() {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SERVER_URL || ''
  const url = `${origin}${PATH}`
  const isLocal = /^https?:\/\/(localhost|127\.|0\.)/i.test(origin)

  const [copied, setCopied] = useState(false)
  const [tunneling, setTunneling] = useState(false)
  const [tunnelUrl, setTunnelUrl] = useState<string | null>(null)
  const [tunnelError, setTunnelError] = useState<string | null>(null)
  const [tunnelCopied, setTunnelCopied] = useState(false)

  const copy = async (value: string, kind: 'main' | 'tunnel') => {
    try {
      await navigator.clipboard.writeText(value)
      if (kind === 'main') {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } else {
        setTunnelCopied(true)
        setTimeout(() => setTunnelCopied(false), 1500)
      }
    } catch {
      /* ignore */
    }
  }

  const startTunnel = async () => {
    setTunneling(true)
    setTunnelError(null)
    try {
      const res = await fetch('/api/share-url', { method: 'POST' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as { url?: string; error?: string }
      if (!json.url) throw new Error(json.error || '取得失敗')
      setTunnelUrl(`${json.url.replace(/\/+$/, '')}${PATH}`)
    } catch (err) {
      setTunnelError(err instanceof Error ? err.message : String(err))
    } finally {
      setTunneling(false)
    }
  }

  const stopTunnel = async () => {
    try {
      await fetch('/api/share-url', { method: 'DELETE' })
    } catch {
      /* ignore */
    }
    setTunnelUrl(null)
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
      <strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
        🔗 クライアント共有用 デモURL
      </strong>

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
          {url}
        </code>
        <button
          type="button"
          onClick={() => copy(url, 'main')}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            background: 'var(--theme-elevation-100)',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ コピー済み' : 'コピー'}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          開く ↗
        </a>
      </div>

      {isLocal && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px dashed var(--theme-elevation-150)',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong>📡 外部公開URL（ローカル開発時のみ）</strong>
            <br />
            上のURLは <code>localhost</code> なので外部からは見えません。「外部URLを発行」を押すと
            localtunnel 経由で一時的な公開URLを生成します。
          </div>

          {!tunnelUrl ? (
            <button
              type="button"
              onClick={startTunnel}
              disabled={tunneling}
              style={{
                padding: '8px 14px',
                border: '1px solid var(--theme-success-500, #2e7d32)',
                background: 'var(--theme-success-500, #2e7d32)',
                color: '#fff',
                borderRadius: 4,
                cursor: tunneling ? 'wait' : 'pointer',
                opacity: tunneling ? 0.7 : 1,
              }}
            >
              {tunneling ? '生成中...' : '外部URLを発行'}
            </button>
          ) : (
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
                {tunnelUrl}
              </code>
              <button
                type="button"
                onClick={() => copy(tunnelUrl, 'tunnel')}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: 4,
                  background: 'var(--theme-elevation-100)',
                  cursor: 'pointer',
                }}
              >
                {tunnelCopied ? '✓ コピー済み' : 'コピー'}
              </button>
              <a
                href={tunnelUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: 4,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                開く ↗
              </a>
              <button
                type="button"
                onClick={stopTunnel}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: 4,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                停止
              </button>
            </div>
          )}

          {tunnelError && (
            <div style={{ marginTop: 8, color: 'var(--theme-error-500, #c62828)' }}>
              エラー: {tunnelError}
            </div>
          )}

          {tunnelUrl && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--theme-elevation-600)' }}>
              ※ サーバープロセスが終了するとURLは失効します。
              <br />※ 初回アクセス時に localtunnel の確認画面が表示されます（Click to Continue
              を押してください）。
            </div>
          )}
        </div>
      )}
    </div>
  )
}
