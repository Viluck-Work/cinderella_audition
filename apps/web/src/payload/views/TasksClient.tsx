'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

type Props = { taskId: string }

const NEWS_TYPES = [
  { id: 'holiday-summer', icon: '🎌', title: 'お盆休みのお知らせ', desc: '夏季休業の告知' },
  { id: 'holiday-newyear', icon: '🎍', title: '年末年始のお知らせ', desc: '年末年始休業の告知' },
  { id: 'holiday-gw', icon: '🏖', title: 'ゴールデンウィークのお知らせ', desc: 'GW休業の告知' },
  { id: 'business-hours', icon: '🕐', title: '営業時間の変更', desc: '臨時の営業時間変更' },
  { id: 'new-service', icon: '✨', title: '新サービスのご案内', desc: 'サービス追加・新作の告知' },
  { id: 'campaign', icon: '🎁', title: 'キャンペーン', desc: 'セール・特典・割引の告知' },
  { id: 'custom', icon: '✏️', title: 'その他（自由入力）', desc: '上記に当てはまらない内容' },
] as const

type NewsType = (typeof NEWS_TYPES)[number]['id']

const TONE_PRESETS = [
  'もう少し堅めに',
  'もう少しフレンドリーに',
  'もっと短く',
  '自分で書き直す',
] as const

const formatJpDate = (s: string) => {
  if (!s) return ''
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`
}

const generateMockText = (typeId: NewsType, start: string, end: string): string => {
  const range = `${formatJpDate(start)} 〜 ${formatJpDate(end)}`
  if (typeId === 'holiday-summer') {
    return `平素は格別のご愛顧を賜り、誠にありがとうございます。\n\n誠に勝手ながら、下記の期間を夏季休業とさせていただきます。\n\n休業期間：${range}\n\nご不便をおかけいたしますが、何卒ご理解いただきますようお願い申し上げます。\nなお、休業期間中のお問い合わせにつきましては、休業明けに順次ご対応させていただきます。`
  }
  if (typeId === 'holiday-newyear') {
    return `平素は格別のご高配を賜り、厚く御礼申し上げます。\n\n誠に勝手ながら、下記の期間を年末年始休業とさせていただきます。\n\n休業期間：${range}\n\n何卒ご理解賜りますよう、よろしくお願い申し上げます。`
  }
  if (typeId === 'holiday-gw') {
    return `平素は格別のお引き立てを賜り、誠にありがとうございます。\n\n誠に勝手ながら、ゴールデンウィーク期間中の休業についてご案内申し上げます。\n\n休業期間：${range}\n\n何卒よろしくお願い申し上げます。`
  }
  return `${range} のお知らせ内容をAIが自動で作成します。`
}

export default function TasksClient({ taskId }: Props) {
  if (taskId !== 'news') {
    return (
      <div className="autosite-task">
        <header className="ast-header">
          <div className="ast-header-left">
            <div className="ast-logo">AutoSite</div>
            <div className="ast-company">株式会社サンプル様</div>
          </div>
          <div className="ast-header-right">
            <div className="ast-avatar">山</div>
          </div>
        </header>
        <main className="ast-main">
          <p className="ast-page-desc">このタスクはまだ準備中です。</p>
          <div className="ast-button-row" style={{ borderTop: 'none', paddingTop: 0 }}>
            <Link href="/admin" className="ast-btn-back">
              ← ホームに戻る
            </Link>
          </div>
        </main>
      </div>
    )
  }
  return <NewsTask />
}

function NewsTask() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedType, setSelectedType] = useState<NewsType>('holiday-summer')
  const today = new Date()
  const defaultStart = new Date(today.getFullYear(), 7, 13).toISOString().slice(0, 10)
  const defaultEnd = new Date(today.getFullYear(), 7, 16).toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const [tone, setTone] = useState<string | null>(null)

  const generated = useMemo(
    () => generateMockText(selectedType, startDate, endDate),
    [selectedType, startDate, endDate],
  )

  const selectedTypeMeta = NEWS_TYPES.find((t) => t.id === selectedType)!

  return (
    <div className="autosite-task">
      <header className="ast-header">
        <div className="ast-header-left">
          <div className="ast-logo">AutoSite</div>
          <div className="ast-company">株式会社サンプル様</div>
        </div>
        <div className="ast-header-right">
          <a className="ast-btn-secondary" href="/audition" target="_blank" rel="noreferrer">
            <span style={{ opacity: 0.6 }}>↗</span>
            サイトを見る
          </a>
          <div className="ast-avatar">山</div>
        </div>
      </header>

      <main className="ast-main">
        <div className="ast-breadcrumb">
          <Link href="/admin">ホーム</Link>
          <span>/</span>
          <span>お知らせを追加</span>
        </div>

        <h1 className="ast-page-title">お知らせを追加</h1>
        <p className="ast-page-desc">
          いくつかの選択肢から、最適な文章をAIが作成します。修正も簡単にできます。
        </p>

        <div className="ast-steps">
          <div className={`ast-step${step > 1 ? ' is-complete' : step === 1 ? ' is-active' : ''}`}>
            <div className="ast-step-num">{step > 1 ? '✓' : '1'}</div>
            <span>種類を選ぶ</span>
          </div>
          <div className="ast-step-divider" />
          <div className={`ast-step${step > 2 ? ' is-complete' : step === 2 ? ' is-active' : ''}`}>
            <div className="ast-step-num">{step > 2 ? '✓' : '2'}</div>
            <span>内容を確認</span>
          </div>
          <div className="ast-step-divider" />
          <div className={`ast-step${step === 3 ? ' is-active' : ''}`}>
            <div className="ast-step-num">3</div>
            <span>公開</span>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="ast-label">どんなお知らせですか？</div>
            <div className="ast-options">
              {NEWS_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`ast-option${selectedType === t.id ? ' is-selected' : ''}`}
                  onClick={() => setSelectedType(t.id)}
                >
                  <div className="ast-option-icon">{t.icon}</div>
                  <div>
                    <div className="ast-option-title">{t.title}</div>
                    <div className="ast-option-desc">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="ast-button-row">
              <Link href="/admin" className="ast-btn-back">
                ← ホームへ
              </Link>
              <button type="button" className="ast-btn-primary" onClick={() => setStep(2)}>
                次へ →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="ast-label">選択した種類</div>
            <div className="ast-options">
              <div className="ast-option is-selected" style={{ cursor: 'default' }}>
                <div className="ast-option-icon">{selectedTypeMeta.icon}</div>
                <div>
                  <div className="ast-option-title">{selectedTypeMeta.title}</div>
                  <div className="ast-option-desc">{selectedTypeMeta.desc}</div>
                </div>
              </div>
            </div>

            <div className="ast-form-row">
              <label className="ast-form-label">期間</label>
              <div className="ast-form-input-pair">
                <input
                  type="date"
                  className="ast-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="ast-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="ast-ai-preview">
              <div className="ast-ai-preview-header">
                <span className="ast-ai-badge">AI生成</span>
                <span className="ast-ai-preview-title">
                  業種に最適化された文章を作成しました
                  {tone && <span style={{ marginLeft: 8 }}>（{tone}）</span>}
                </span>
              </div>
              <div className="ast-ai-preview-text">
                {generated.split('\n').map((line, i) => (
                  <div key={i} style={{ minHeight: '1.5em' }}>
                    {line}
                  </div>
                ))}
              </div>
              <div className="ast-tone-buttons">
                {TONE_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="ast-tone-btn"
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="ast-sync-info">
              <div className="ast-sync-info-title">
                <span style={{ fontSize: 16 }}>⚡</span>
                公開すると、以下が自動的に行われます
              </div>
              <ul className="ast-sync-list">
                <li>
                  <span className="ast-check">✓</span>サイトの「お知らせ」セクションに掲載
                </li>
                <li>
                  <span className="ast-check">✓</span>
                  トップページのバナーに表示（お知らせ期間の3日前から）
                </li>
                <li>
                  <span className="ast-check">✓</span>
                  期間終了の翌日に自動で非表示に切り替え
                </li>
              </ul>
            </div>

            <div className="ast-button-row">
              <button type="button" className="ast-btn-back" onClick={() => setStep(1)}>
                ← 戻る
              </button>
              <button type="button" className="ast-btn-primary" onClick={() => setStep(3)}>
                プレビューを確認 →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="ast-form-row">
              <label className="ast-form-label">プレビュー</label>
              <div className="ast-ai-preview" style={{ marginTop: 8 }}>
                <div className="ast-ai-preview-text" style={{ background: '#fff', border: 'none' }}>
                  {generated.split('\n').map((line, i) => (
                    <div key={i} style={{ minHeight: '1.5em' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ast-sync-info">
              <div className="ast-sync-info-title">
                <span style={{ fontSize: 16 }}>✅</span>
                これで公開してよろしいですか？
              </div>
            </div>

            <div className="ast-button-row">
              <button type="button" className="ast-btn-back" onClick={() => setStep(2)}>
                ← 戻る
              </button>
              <button
                type="button"
                className="ast-btn-primary"
                onClick={() =>
                  alert('Phase 3 では公開フローは未接続です（AI連携は Phase 4）。')
                }
              >
                公開する
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
