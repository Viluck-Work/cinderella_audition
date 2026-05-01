'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { FieldDef, SectionDef, SidebarGroup } from './sections'

type Props = {
  sidebar: SidebarGroup[]
  sections: SectionDef[]
  activeSlug: string
  initialData: Record<string, unknown> | null
}

type Device = 'pc' | 'tablet' | 'mobile' | 'custom'

const DEVICE_PRESETS: Record<Exclude<Device, 'custom'>, number> = {
  pc: 1280,
  tablet: 768,
  mobile: 390,
}

const MIN_WIDTH = 320
const MAX_WIDTH = 1600

const DISPLAY_PRESETS = [
  { value: 'standard', label: '標準' },
  { value: 'emphasized', label: 'より目立つように大きく' },
  { value: 'calm', label: '落ち着いた印象に' },
  { value: 'luxury', label: '高級感のある印象に' },
] as const

// dot path で nested オブジェクトから値を取り出す
const getByPath = (obj: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

// dot path で nested オブジェクトを更新（新しい参照を返す）
const setByPath = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> => {
  const keys = path.split('.')
  const next = { ...obj }
  let cur: Record<string, unknown> = next
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const child = cur[k]
    cur[k] = child && typeof child === 'object' ? { ...(child as Record<string, unknown>) } : {}
    cur = cur[k] as Record<string, unknown>
  }
  cur[keys[keys.length - 1]] = value
  return next
}

export default function DetailEditClient({ sidebar, sections, activeSlug, initialData }: Props) {
  const activeSection = useMemo(
    () => sections.find((s) => s.slug === activeSlug) ?? sections[0],
    [sections, activeSlug],
  )

  const [data, setData] = useState<Record<string, unknown>>(initialData ?? {})
  const baselineRef = useRef<Record<string, unknown>>(initialData ?? {})
  const [device, setDevice] = useState<Device>('pc')
  const [previewWidth, setPreviewWidth] = useState<number>(DEVICE_PRESETS.pc)
  const [paneWidth, setPaneWidth] = useState<number>(720)
  const [isDraggingPane, setIsDraggingPane] = useState(false)

  const setDeviceAndWidth = useCallback((d: Exclude<Device, 'custom'>) => {
    setDevice(d)
    setPreviewWidth(DEVICE_PRESETS[d])
  }, [])

  const setCustomWidth = useCallback((w: number) => {
    const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w))
    setPreviewWidth(clamped)
    setDevice('custom')
  }, [])

  // ドラッグでプレビュー幅をリサイズ
  const [isResizing, setIsResizing] = useState(false)
  const startResize = useCallback(
    (clientX: number, side: 'left' | 'right') => {
      const startX = clientX
      const startWidth = previewWidth
      setIsResizing(true)

      const onMove = (cx: number) => {
        const delta = cx - startX
        // 中央寄せなのでハンドルからの delta はそのまま伸縮量に。
        // 左ハンドルは左方向で広がる、右ハンドルは右方向で広がる。
        const next = side === 'right' ? startWidth + delta * 2 : startWidth - delta * 2
        setCustomWidth(Math.round(next / 2) * 2)
      }
      const onMouseMove = (ev: MouseEvent) => onMove(ev.clientX)
      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches[0]) onMove(ev.touches[0].clientX)
      }
      const cleanup = () => {
        setIsResizing(false)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', cleanup)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', cleanup)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', cleanup)
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', cleanup)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'ew-resize'
    },
    [previewWidth, setCustomWidth],
  )

  // 列の仕切り (editor / preview pane の境界) ドラッグ
  const startPaneDrag = useCallback(
    (clientX: number) => {
      const startX = clientX
      const startWidth = paneWidth
      setIsDraggingPane(true)

      const onMove = (cx: number) => {
        // 仕切りを左に動かす(cx < startX) と preview 列が広がる
        const delta = startX - cx
        const maxByViewport =
          typeof window !== 'undefined' ? Math.max(360, window.innerWidth - 280 - 240) : 1600
        const next = Math.max(360, Math.min(maxByViewport, startWidth + delta))
        setPaneWidth(next)
      }
      const onMouseMove = (ev: MouseEvent) => onMove(ev.clientX)
      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches[0]) onMove(ev.touches[0].clientX)
      }
      const cleanup = () => {
        setIsDraggingPane(false)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', cleanup)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', cleanup)
        document.body.style.userSelect = ''
        document.body.style.cursor = ''
      }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', cleanup)
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', cleanup)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'ew-resize'
    },
    [paneWidth],
  )
  const [displayPreset, setDisplayPreset] = useState<string>('standard')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(baselineRef.current)
  }, [data])

  const updateField = useCallback((path: string, value: unknown) => {
    setData((prev) => setByPath(prev, path, value))
  }, [])

  const handleRevert = useCallback(() => {
    setData(baselineRef.current)
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/globals/audition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error(`保存に失敗しました (${res.status})`)
      }
      baselineRef.current = data
      setSavedAt(Date.now())
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }, [data])

  // ライブプレビュー: 入力のたびに iframe へ postMessage を送る。
  // AuditionClient の useLivePreview フックが受け取ってマージ・再描画する。
  // postMessage の origin が hook の serverURL と一致する必要があるため、
  // 同一オリジン (NEXT_PUBLIC_SERVER_URL || window.location.origin) を使う。
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const iframeReadyRef = useRef(false)
  const sendTimer = useRef<number | null>(null)

  const postLivePreview = useCallback((payload: Record<string, unknown>) => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage(
      {
        type: 'payload-live-preview',
        globalSlug: 'audition',
        data: payload,
      },
      window.location.origin,
    )
  }, [])

  useEffect(() => {
    if (!iframeReadyRef.current) return
    if (sendTimer.current) window.clearTimeout(sendTimer.current)
    sendTimer.current = window.setTimeout(() => postLivePreview(data), 80)
    return () => {
      if (sendTimer.current) window.clearTimeout(sendTimer.current)
    }
  }, [data, postLivePreview])

  const handleIframeLoad = useCallback(() => {
    iframeReadyRef.current = true
    // iframe 内の useLivePreview がマウント完了後に購読を始めるので、
    // 少し待ってから初期値を一度送る
    window.setTimeout(() => postLivePreview(data), 200)
  }, [data, postLivePreview])

  // プレビューのスケール: previewWidth がペインに収まらないときは
  // CSS transform で縮小して全幅レンダリングを表示する。
  const PREVIEW_PADDING = 48 // body padding
  const HANDLE_WIDTH = 24 // 左右ハンドル分
  const availableInner = Math.max(MIN_WIDTH, paneWidth - PREVIEW_PADDING - HANDLE_WIDTH)
  const previewScale = previewWidth > availableInner ? availableInner / previewWidth : 1
  const visualPreviewWidth = previewWidth * previewScale

  const previewUrl = '/audition'

  return (
    <div className="autosite-edit">
      <header className="ase-header">
        <div className="ase-header-left">
          <Link href="/admin" className="ase-logo">
            AutoSite
          </Link>
          <nav className="ase-nav">
            <Link href="/admin" className="ase-nav-link">
              TOP
            </Link>
          </nav>
          <div className="ase-company">株式会社サンプル様</div>
        </div>
        <div className="ase-header-right">
          <a className="ase-btn-secondary" href={previewUrl} target="_blank" rel="noreferrer">
            <span style={{ opacity: 0.6 }}>↗</span>
            サイトを見る
          </a>
          <div className="ase-avatar">山</div>
        </div>
      </header>

      <div
        className={`ase-layout${isDraggingPane ? ' is-dragging-pane' : ''}`}
        style={{ gridTemplateColumns: `240px minmax(0, 1fr) 6px ${paneWidth}px` }}
      >
        {/* サイドバー */}
        <aside className="ase-sidebar">
          <Link href="/admin" className="ase-sidebar-back">
            ← ホームに戻る
          </Link>

          {sidebar.map((group) => (
            <div key={group.label} className="ase-sidebar-section">
              <div className="ase-sidebar-label">{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  className={`ase-sidebar-item${item.slug === activeSlug ? ' is-active' : ''}`}
                  href={`/admin/edit?section=${item.slug}`}
                >
                  <span className="ase-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* エディタ */}
        <div className="ase-editor">
          <div className="ase-editor-scroll">
            <div className="ase-editor-header">
              <div className="ase-breadcrumb">
                トップページ / {activeSection.pageLabel}
              </div>
              <h2 className="ase-editor-title">{activeSection.title}</h2>
              <p className="ase-editor-desc">{activeSection.description}</p>
            </div>

            {activeSection.groups.map((group, gi) => (
              <div key={gi} className="ase-field-group">
                <div className="ase-field-group-title">{group.title}</div>
                {group.desc && <div className="ase-field-group-desc">{group.desc}</div>}

                {group.fields.map((field) => (
                  <FieldRow
                    key={field.path}
                    field={field}
                    value={(getByPath(data, field.path) as string) ?? ''}
                    onChange={(v) => updateField(field.path, v)}
                  />
                ))}

                {group.showDisplayPreset && (
                  <div style={{ marginTop: 24 }}>
                    <div className="ase-field-group-title" style={{ fontSize: 13 }}>
                      表示の仕方
                    </div>
                    <div className="ase-field-group-desc">
                      大きな見出しの印象を選びます。文字サイズ、余白、装飾が業種に合わせて自動調整されます。
                    </div>
                    <div className="ase-display-options">
                      {DISPLAY_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          className={`ase-display-option${displayPreset === preset.value ? ' is-selected' : ''}`}
                          onClick={() => setDisplayPreset(preset.value)}
                        >
                          <span className="ase-display-radio" />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 保存バー */}
          <div className="ase-save-bar">
            <div className="ase-save-status">
              {isDirty && <div className="ase-save-dot" />}
              {saving
                ? '保存中…'
                : isDirty
                  ? '変更があります（保存ボタンで公開されます）'
                  : savedAt
                    ? '保存済み'
                    : '変更なし'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="ase-btn-secondary"
                onClick={handleRevert}
                disabled={!isDirty || saving}
              >
                変更を元に戻す
              </button>
              <button
                type="button"
                className="ase-btn-primary"
                onClick={handleSave}
                disabled={!isDirty || saving}
              >
                {saving ? '保存中…' : '保存して公開'}
              </button>
            </div>
          </div>
        </div>

        {/* 列の仕切り（ドラッグで preview pane の幅を調整） */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="編集とプレビューの区切りをドラッグして幅を変える"
          className={`ase-pane-divider${isDraggingPane ? ' is-dragging' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault()
            startPaneDrag(e.clientX)
          }}
          onTouchStart={(e) => {
            if (e.touches[0]) startPaneDrag(e.touches[0].clientX)
          }}
        >
          <span />
        </div>

        {/* プレビュー */}
        <aside className="ase-preview">
          <div className="ase-preview-header">
            <div className="ase-preview-title">プレビュー</div>
            <div className="ase-device-toggle">
              <button
                type="button"
                className={`ase-device-btn${device === 'pc' ? ' is-active' : ''}`}
                onClick={() => setDeviceAndWidth('pc')}
                title="PC (1280px)"
              >
                PC
              </button>
              <button
                type="button"
                className={`ase-device-btn${device === 'tablet' ? ' is-active' : ''}`}
                onClick={() => setDeviceAndWidth('tablet')}
                title="タブレット (768px)"
              >
                タブレット
              </button>
              <button
                type="button"
                className={`ase-device-btn${device === 'mobile' ? ' is-active' : ''}`}
                onClick={() => setDeviceAndWidth('mobile')}
                title="スマホ (390px)"
              >
                スマホ
              </button>
            </div>
          </div>

          <div className="ase-preview-control">
            <div className="ase-preview-width-input">
              <input
                type="number"
                min={MIN_WIDTH}
                max={MAX_WIDTH}
                value={previewWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value) || MIN_WIDTH)}
              />
              <span>px</span>
            </div>
            <div className="ase-preview-hint">
              ハンドル（左右の縦バー）をドラッグして幅を変えられます
              {previewScale < 1 && (
                <span style={{ marginLeft: 8, color: '#1a1a1a', fontWeight: 500 }}>
                  / 表示倍率 {Math.round(previewScale * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="ase-preview-body">
            <div
              className={`ase-preview-frame-wrap${isResizing ? ' is-resizing' : ''}`}
              style={{ width: visualPreviewWidth + HANDLE_WIDTH }}
            >
              <button
                type="button"
                aria-label="左から幅を変更"
                className="ase-resize-handle ase-resize-handle-left"
                onMouseDown={(e) => {
                  e.preventDefault()
                  startResize(e.clientX, 'left')
                }}
                onTouchStart={(e) => {
                  if (e.touches[0]) startResize(e.touches[0].clientX, 'left')
                }}
              >
                <span />
              </button>
              <div
                className="ase-preview-frame"
                style={{ width: visualPreviewWidth, position: 'relative', overflow: 'hidden' }}
              >
                <iframe
                  ref={iframeRef}
                  src={previewUrl}
                  title="プレビュー"
                  onLoad={handleIframeLoad}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: previewWidth,
                    height: `${100 / previewScale}%`,
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                    border: 0,
                    pointerEvents: isResizing ? 'none' : 'auto',
                  }}
                />
              </div>
              <button
                type="button"
                aria-label="右から幅を変更"
                className="ase-resize-handle ase-resize-handle-right"
                onMouseDown={(e) => {
                  e.preventDefault()
                  startResize(e.clientX, 'right')
                }}
                onTouchStart={(e) => {
                  if (e.touches[0]) startResize(e.touches[0].clientX, 'right')
                }}
              >
                <span />
              </button>
            </div>
            <div className="ase-preview-note">
              入力すると即座にプレビューに反映されます。
              <br />
              「保存して公開」を押すまでサイトには反映されません。
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: string
  onChange: (v: string) => void
}) {
  const len = (value ?? '').length
  const max = field.recommendedMax
  const overMax = !!max && len > max

  return (
    <div className="ase-field">
      <label className="ase-field-label">{field.label}</label>
      {field.help && <div className="ase-field-help">{field.help}</div>}
      {field.kind === 'textarea' ? (
        <textarea
          className="ase-input"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="ase-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {max && (
        <div className={`ase-char-counter${overMax ? ' is-warn' : ''}`}>
          {len} / 推奨{max}文字以内
        </div>
      )}
    </div>
  )
}
