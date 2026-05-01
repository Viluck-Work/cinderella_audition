'use client'

import Link from 'next/link'
import React from 'react'

type HistoryItem = { id: string; recent: boolean; title: string; time: string }

type Task = {
  icon: string
  title: string
  desc: string
  href: string
}

type Props = {
  data: {
    companyName: string
    userInitial: string
    userName: string
    today: string
    history: HistoryItem[]
    aiStats: {
      monthLabel: string
      knowledgeUpdates: number
      autoFixes: number
      qualityPercent: number
    }
    siteUrl: string
  }
}

const TASKS: Task[] = [
  {
    icon: '📢',
    title: 'お知らせを追加',
    desc: '休業案内、新サービス告知など',
    href: '/admin/globals/audition',
  },
  {
    icon: '🕐',
    title: '営業時間を変える',
    desc: '通常営業日・臨時休業の設定',
    href: '/admin/edit?section=hero',
  },
  {
    icon: '🖼',
    title: '写真を差し替える',
    desc: 'トップ画像・サービス画像など',
    href: '/admin/collections/media',
  },
  {
    icon: '🏢',
    title: '会社情報を編集',
    desc: '会社概要、代表挨拶、沿革',
    href: '/admin/edit?section=about',
  },
  {
    icon: '📋',
    title: 'サービス内容を編集',
    desc: '提供サービスの追加・修正',
    href: '/admin/edit?section=tracks',
  },
  {
    icon: '⚙',
    title: '細かい部分を編集',
    desc: '各ページの詳細設定',
    href: '/admin/edit?section=hero',
  },
]

export default function DashboardClient({ data }: Props) {
  return (
    <div className="autosite-home">
      <header className="ash-header">
        <div className="ash-header-left">
          <div className="ash-logo">AutoSite</div>
          <div className="ash-company">{data.companyName}</div>
        </div>
        <div className="ash-header-right">
          <a className="ash-btn-secondary" href={data.siteUrl} target="_blank" rel="noreferrer">
            <span style={{ opacity: 0.6 }}>↗</span>
            サイトを見る
          </a>
          <div className="ash-avatar" aria-label={`${data.userName}様`}>
            {data.userInitial}
          </div>
        </div>
      </header>

      <main className="ash-main">
        <div className="ash-greeting">
          <div className="ash-date">{data.today}</div>
          <h1>おかえりなさい、{data.userName}様</h1>
        </div>

        <section className="ash-section">
          <div className="ash-section-label">何をしますか？</div>
          <div className="ash-task-grid">
            {TASKS.map((task) => (
              <Link key={task.title} className="ash-task-card" href={task.href}>
                <div className="ash-task-icon" aria-hidden="true">
                  {task.icon}
                </div>
                <div>
                  <div className="ash-task-title">{task.title}</div>
                  <div className="ash-task-desc">{task.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="ash-section">
          <div className="ash-section-label">最近の編集</div>
          <div className="ash-history-card">
            {data.history.map((item) => (
              <div key={item.id} className="ash-history-item">
                <div className="ash-history-left">
                  <div
                    className={`ash-history-dot ${item.recent ? 'is-recent' : 'is-old'}`}
                    aria-hidden="true"
                  />
                  <div>
                    <div className="ash-history-title">{item.title}</div>
                    <div className="ash-history-time">{item.time}</div>
                  </div>
                </div>
                <button type="button" className="ash-btn-link">
                  確認 →
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="ash-section" style={{ marginBottom: 0 }}>
          <div className="ash-section-label">AIによる維持管理</div>
          <div className="ash-ai-card">
            <div className="ash-ai-label">{data.aiStats.monthLabel}</div>

            <div className="ash-ai-stats">
              <div>
                <div className="ash-ai-num">{data.aiStats.knowledgeUpdates}</div>
                <div className="ash-ai-stat-label">
                  業種知識の更新を
                  <br />
                  サイトに反映
                </div>
              </div>
              <div>
                <div className="ash-ai-num">{data.aiStats.autoFixes}</div>
                <div className="ash-ai-stat-label">
                  セキュリティ・
                  <br />
                  表示崩れの自動修正
                </div>
              </div>
              <div>
                <div className="ash-ai-num">
                  {data.aiStats.qualityPercent}
                  <span className="ash-ai-unit">%</span>
                </div>
                <div className="ash-ai-stat-label">
                  プロレベル品質
                  <br />
                  を維持中
                </div>
              </div>
            </div>

            <div className="ash-ai-footer">
              業種専門のAIが、貴社サイトを最新で安全な状態に保っています。
              <br />
              特別な操作は不要です。
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
