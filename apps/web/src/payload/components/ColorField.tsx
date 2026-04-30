'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

const isValidHex = (v: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)

const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const fieldPath = path || field?.name || ''
  const { value, setValue } = useField<string>({ path: fieldPath })

  const fieldWithDefault = field as { defaultValue?: unknown } | undefined
  const defaultValue =
    typeof fieldWithDefault?.defaultValue === 'string'
      ? (fieldWithDefault.defaultValue as string)
      : '#d6b37a'
  // defaultValue が空文字列なら、このフィールドは「未指定 = 自動」を許容するモード
  const optionalMode = defaultValue === ''
  const current = (value as string | undefined) ?? ''
  const isEmpty = current === ''
  // color picker が表示するプレビュー色（空なら適当な中間色）
  const safe = isValidHex(current) ? current : optionalMode ? '#888888' : defaultValue

  return (
    <div className="field-type" style={{ marginBottom: 16 }}>
      <label className="field-label" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
        {field?.label && typeof field.label === 'string' ? field.label : fieldPath}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <input
          type="color"
          value={safe}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: 56,
            height: 40,
            padding: 2,
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 6,
            cursor: 'pointer',
            background: 'transparent',
          }}
        />
        <input
          type="text"
          value={current}
          onChange={(e) => setValue(e.target.value)}
          placeholder={optionalMode ? '空欄で自動' : '#d6b37a'}
          style={{
            width: 130,
            padding: '8px 10px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: 14,
          }}
        />
        {optionalMode && isEmpty ? (
          <span
            style={{
              fontSize: 12,
              color: 'var(--theme-elevation-600)',
              fontStyle: 'italic',
            }}
          >
            自動算出中
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 28,
              height: 28,
              borderRadius: 999,
              background: safe,
              border: '1px solid var(--theme-elevation-200)',
            }}
          />
        )}
        <button
          type="button"
          onClick={() => setValue(defaultValue)}
          disabled={current === defaultValue}
          style={{
            padding: '6px 12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: 4,
            background: 'var(--theme-elevation-100)',
            cursor: current === defaultValue ? 'default' : 'pointer',
            opacity: current === defaultValue ? 0.5 : 1,
            fontSize: 12,
          }}
        >
          {optionalMode ? '自動に戻す（クリア）' : 'デフォルトに戻す'}
        </button>
      </div>
      {field?.admin?.description && typeof field.admin.description === 'string' && (
        <div
          className="field-description"
          style={{ marginTop: 6, fontSize: 12, color: 'var(--theme-elevation-600)' }}
        >
          {field.admin.description}
        </div>
      )}
    </div>
  )
}

export default ColorField
