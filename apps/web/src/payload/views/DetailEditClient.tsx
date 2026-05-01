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

type Device = 'pc' | 'mobile'

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

  // プレビュー iframe の自動リフレッシュ（dirty 時に debounce）
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const refreshTimer = useRef<number | null>(null)
  useEffect(() => {
    if (!isDirty) return
    if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
    refreshTimer.current = window.setTimeout(() => {
      if (iframeRef.current) iframeRef.current.src = iframeRef.current.src
    }, 700)
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current)
    }
  }, [isDirty, data])

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

      <div className="ase-layout">
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

        {/* プレビュー */}
        <aside className="ase-preview">
          <div className="ase-preview-header">
            <div className="ase-preview-title">プレビュー</div>
            <div className="ase-device-toggle">
              <button
                type="button"
                className={`ase-device-btn${device === 'pc' ? ' is-active' : ''}`}
                onClick={() => setDevice('pc')}
              >
                PC
              </button>
              <button
                type="button"
                className={`ase-device-btn${device === 'mobile' ? ' is-active' : ''}`}
                onClick={() => setDevice('mobile')}
              >
                スマホ
              </button>
            </div>
          </div>
          <div className="ase-preview-body">
            <div
              className="ase-preview-frame"
              style={{ maxWidth: device === 'mobile' ? 390 : '100%' }}
            >
              <iframe ref={iframeRef} src={previewUrl} title="プレビュー" />
            </div>
            <div className="ase-preview-note">
              保存ボタンを押すと公開されます。
              <br />
              プレビューは数秒遅れて反映されます。
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
