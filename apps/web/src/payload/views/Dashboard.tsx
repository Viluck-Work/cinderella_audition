import type { AdminViewServerProps } from 'payload'

import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

import config from '../../../payload.config'

import './dashboard.css'

import DashboardClient from './DashboardClient'

const formatDate = (d: Date) => {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}曜日`
}

export default async function Dashboard(_props: AdminViewServerProps) {
  // 後で payload.findGlobal で SiteSettings から会社名等を取得する想定。
  // 現在はモックデータ。
  await nextHeaders().catch(() => null)

  // SiteSettings から会社名を取得
  let siteName = '株式会社サンプル'
  try {
    const payload = await getPayload({ config })
    const settings = (await payload.findGlobal({ slug: 'site-settings' })) as {
      siteName?: string
    } | null
    if (settings?.siteName) siteName = settings.siteName
  } catch {
    // フォールバック
  }

  const today = new Date()
  const data = {
    companyName: `${siteName}様`,
    userInitial: '山',
    userName: '山田',
    today: formatDate(today),
    history: [
      { id: 'h1', recent: true, title: 'お知らせを1件追加（GW休業のご案内）', time: '4月25日 14:32' },
      { id: 'h2', recent: false, title: 'トップページの画像を変更', time: '4月18日 10:15' },
      { id: 'h3', recent: false, title: '代表挨拶の文章を編集', time: '4月10日 16:48' },
    ],
    aiStats: {
      monthLabel: `${today.getFullYear()}年${today.getMonth() + 1}月の活動`,
      knowledgeUpdates: 3,
      autoFixes: 12,
      qualityPercent: 100,
    },
    siteUrl: '/audition',
  }

  return <DashboardClient data={data} />
}
