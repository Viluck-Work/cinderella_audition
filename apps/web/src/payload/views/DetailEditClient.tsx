'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { ArrayFieldDef, FieldDef, FlatFieldDef, SectionDef, SidebarGroup } from './sections'

type Props = {
  sidebar: SidebarGroup[]
  sections: SectionDef[]
  activeSlug: string
  initialData: Record<string, unknown> | null
  companyName?: string
  /** sections.ts のデフォルトラベルを上書きする CMS 由来のラベル */
  sectionLabels?: Record<string, string>
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

// dot path で nested オブジェクト/配列から値を取り出す
// 数値キー（'0', '1', ...）は配列インデックスとして扱う
const getByPath = (obj: unknown, path: string): unknown => {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null) return undefined
    if (Array.isArray(acc)) {
      const idx = Number(key)
      return Number.isNaN(idx) ? undefined : acc[idx]
    }
    if (typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

// dot path で nested オブジェクト/配列を更新（新しい参照を返す）
const cloneShallow = (v: unknown): unknown => {
  if (Array.isArray(v)) return [...v]
  if (v && typeof v === 'object') return { ...(v as Record<string, unknown>) }
  return v
}
const setByPath = (
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> => {
  const keys = path.split('.')
  const next = { ...obj } as Record<string, unknown> | unknown[]
  let cur: Record<string, unknown> | unknown[] = next
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const isArrIdx = /^\d+$/.test(k)
    const curAsAny = cur as Record<string, unknown> & unknown[]
    const child = isArrIdx ? curAsAny[Number(k)] : curAsAny[k]
    const nextChild =
      cloneShallow(child) ??
      (/^\d+$/.test(keys[i + 1]) ? ([] as unknown[]) : ({} as Record<string, unknown>))
    if (isArrIdx) curAsAny[Number(k)] = nextChild
    else curAsAny[k] = nextChild
    cur = nextChild as Record<string, unknown> | unknown[]
  }
  const lastKey = keys[keys.length - 1]
  const isArrIdx = /^\d+$/.test(lastKey)
  if (isArrIdx) (cur as unknown[])[Number(lastKey)] = value
  else (cur as Record<string, unknown>)[lastKey] = value
  return next as Record<string, unknown>
}

export default function DetailEditClient({
  sidebar,
  sections,
  activeSlug,
  initialData,
  companyName = '株式会社サンプル様',
  sectionLabels = {},
}: Props) {
  const labelOf = useCallback(
    (slug: string, fallback: string): string => sectionLabels[slug] || fallback,
    [sectionLabels],
  )
  const activeSection = useMemo(
    () => sections.find((s) => s.slug === activeSlug) ?? sections[0],
    [sections, activeSlug],
  )
  const activeSectionLabel = labelOf(activeSection.slug, activeSection.pageLabel)

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

  // ドラッグ中の DOM 直接更新用 ref
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const layoutRef = useRef<HTMLDivElement>(null)
  const frameWrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  // 与えられた previewWidth / paneWidth で表示要素を直接更新する。
  // React 再レンダリングを避けるため、ドラッグ中はこちらを使う。
  // iframe の内部 width には触らない（中身の再レイアウトを回避）。
  const applyDomSizes = useCallback(
    (newPreviewWidth: number, newPaneWidth: number, committedIframeWidth: number) => {
      const inner = Math.max(MIN_WIDTH, newPaneWidth - 48 - 24)
      const scale = newPreviewWidth > inner ? inner / newPreviewWidth : 1
      const visualW = newPreviewWidth * scale
      const iframeScale = visualW / committedIframeWidth

      if (layoutRef.current) {
        layoutRef.current.style.gridTemplateColumns = `240px minmax(0, 1fr) 6px ${newPaneWidth}px`
      }
      if (frameWrapRef.current) {
        frameWrapRef.current.style.width = `${visualW + 24}px`
      }
      if (frameRef.current) {
        frameRef.current.style.width = `${visualW}px`
      }
      if (iframeRef.current) {
        iframeRef.current.style.transform = `scale(${iframeScale})`
        iframeRef.current.style.height = `${100 / iframeScale}%`
      }
    },
    [],
  )

  // ドラッグでプレビュー幅をリサイズ
  const [isResizing, setIsResizing] = useState(false)
  const startResize = useCallback(
    (clientX: number, side: 'left' | 'right') => {
      const startX = clientX
      const startWidth = previewWidth
      const committedIframeWidth = previewWidth // ドラッグ中は iframe 内部はこの値で固定
      setIsResizing(true)

      let raf = 0
      let pendingCx = clientX
      let lastApplied = startWidth
      const flush = () => {
        raf = 0
        const delta = pendingCx - startX
        const next = side === 'right' ? startWidth + delta * 2 : startWidth - delta * 2
        const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(next / 2) * 2))
        lastApplied = clamped
        // React 再レンダリングなしで DOM 直接更新
        applyDomSizes(clamped, paneWidth, committedIframeWidth)
      }
      const schedule = (cx: number) => {
        pendingCx = cx
        if (raf) return
        raf = requestAnimationFrame(flush)
      }
      const onMouseMove = (ev: MouseEvent) => schedule(ev.clientX)
      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches[0]) schedule(ev.touches[0].clientX)
      }
      const cleanup = () => {
        if (raf) cancelAnimationFrame(raf)
        setIsResizing(false)
        // ドラッグ終了時に1回だけ React state を確定 → iframe 内部 width を再設定
        setCustomWidth(lastApplied)
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
    [previewWidth, paneWidth, applyDomSizes, setCustomWidth],
  )

  // 列の仕切り (editor / preview pane の境界) ドラッグ
  const startPaneDrag = useCallback(
    (clientX: number) => {
      const startX = clientX
      const startWidth = paneWidth
      const committedIframeWidth = previewWidth
      setIsDraggingPane(true)

      let raf = 0
      let pendingCx = clientX
      let lastApplied = startWidth
      const flush = () => {
        raf = 0
        const delta = startX - pendingCx
        const maxByViewport =
          typeof window !== 'undefined' ? Math.max(360, window.innerWidth - 280 - 240) : 1600
        const next = Math.max(360, Math.min(maxByViewport, startWidth + delta))
        lastApplied = next
        applyDomSizes(previewWidth, next, committedIframeWidth)
      }
      const schedule = (cx: number) => {
        pendingCx = cx
        if (raf) return
        raf = requestAnimationFrame(flush)
      }
      const onMouseMove = (ev: MouseEvent) => schedule(ev.clientX)
      const onTouchMove = (ev: TouchEvent) => {
        if (ev.touches[0]) schedule(ev.touches[0].clientX)
      }
      const cleanup = () => {
        if (raf) cancelAnimationFrame(raf)
        setIsDraggingPane(false)
        setPaneWidth(lastApplied)
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
    [paneWidth, previewWidth, applyDomSizes],
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
    sendTimer.current = window.setTimeout(() => postLivePreview(data), 250)
    return () => {
      if (sendTimer.current) window.clearTimeout(sendTimer.current)
    }
  }, [data, postLivePreview])

  const sendScrollTo = useCallback((anchor: string) => {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    win.postMessage({ type: 'autosite-scroll', anchor }, window.location.origin)
  }, [])

  const handleIframeLoad = useCallback(() => {
    iframeReadyRef.current = true
    // iframe 内の useLivePreview がマウント完了後に購読を始めるので、
    // 少し待ってから初期値を一度送る
    window.setTimeout(() => {
      postLivePreview(data)
      if (activeSection.anchor) sendScrollTo(activeSection.anchor)
    }, 200)
  }, [data, postLivePreview, sendScrollTo, activeSection.anchor])

  // セクション切替で iframe をスクロール
  useEffect(() => {
    if (!iframeReadyRef.current) return
    if (activeSection.anchor) sendScrollTo(activeSection.anchor)
  }, [activeSection.anchor, sendScrollTo])

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
          <div className="ase-company">{companyName}</div>
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
        ref={layoutRef}
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
                  <span>{labelOf(item.slug, item.label)}</span>
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
                トップページ / {activeSectionLabel}
              </div>
              <h2 className="ase-editor-title">{activeSectionLabel}</h2>
              <p className="ase-editor-desc">{activeSection.description}</p>
            </div>

            {activeSection.groups.map((group, gi) => (
              <div key={gi} className="ase-field-group">
                <div className="ase-field-group-title">{group.title}</div>
                {group.desc && <div className="ase-field-group-desc">{group.desc}</div>}

                {group.fields.map((field) => (
                  <FieldRouter
                    key={field.path}
                    field={field}
                    data={data}
                    onUpdate={updateField}
                  />
                ))}

                {gi === 0 && activeSection.slug === 'hero' && (
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
              ref={frameWrapRef}
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
                ref={frameRef}
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

function FieldRouter({
  field,
  data,
  onUpdate,
}: {
  field: FieldDef
  data: Record<string, unknown>
  onUpdate: (path: string, value: unknown) => void
}) {
  if (field.kind === 'array') {
    return <ArrayField field={field} data={data} onUpdate={onUpdate} />
  }
  return (
    <FieldRow
      field={field}
      value={(getByPath(data, field.path) as string) ?? ''}
      onChange={(v) => onUpdate(field.path, v)}
    />
  )
}

const FieldRow = React.memo(function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FlatFieldDef
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
})

function ArrayField({
  field,
  data,
  onUpdate,
}: {
  field: ArrayFieldDef
  data: Record<string, unknown>
  onUpdate: (path: string, value: unknown) => void
}) {
  const raw = getByPath(data, field.path)
  const items = Array.isArray(raw) ? (raw as Record<string, unknown>[]) : []
  const minItems = field.minItems ?? 0

  const addItem = () => {
    onUpdate(field.path, [...items, { ...field.defaultItem }])
  }
  const removeItem = (i: number) => {
    if (items.length <= minItems) return
    const next = items.slice()
    next.splice(i, 1)
    onUpdate(field.path, next)
  }
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
    onUpdate(field.path, next)
  }

  return (
    <div className="ase-field">
      <div className="ase-array-header">
        <label className="ase-field-label" style={{ marginBottom: 0 }}>
          {field.label}
        </label>
        <button type="button" className="ase-array-add" onClick={addItem}>
          ＋ 追加
        </button>
      </div>
      {field.help && <div className="ase-field-help">{field.help}</div>}

      <div className="ase-array-items">
        {items.length === 0 && <div className="ase-array-empty">まだ項目がありません</div>}
        {items.map((_, i) => (
          <div key={i} className="ase-array-item">
            <div className="ase-array-item-head">
              <span className="ase-array-item-label">
                {field.itemLabelTemplate
                  ? field.itemLabelTemplate.replace('{n}', String(i + 1))
                  : `${field.label} ${i + 1}`}
              </span>
              <div className="ase-array-item-actions">
                <button
                  type="button"
                  className="ase-array-mini-btn"
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                  title="上へ"
                  aria-label="上へ"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="ase-array-mini-btn"
                  onClick={() => moveItem(i, 1)}
                  disabled={i === items.length - 1}
                  title="下へ"
                  aria-label="下へ"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="ase-array-mini-btn ase-array-remove"
                  onClick={() => removeItem(i)}
                  disabled={items.length <= minItems}
                  title="削除"
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="ase-array-item-body">
              {field.itemFields.map((sub) => (
                <FieldRow
                  key={sub.path}
                  field={sub}
                  value={
                    (getByPath(data, `${field.path}.${i}.${sub.path}`) as string) ?? ''
                  }
                  onChange={(v) => onUpdate(`${field.path}.${i}.${sub.path}`, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
