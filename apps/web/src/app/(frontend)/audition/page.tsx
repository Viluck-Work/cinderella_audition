import type { Metadata } from 'next'

import { getAuditionData } from '@/lib/audition-data'

import AuditionClient from './AuditionClient'

const TITLE = 'メンズアイドル新メンバー募集 | Cinderella entertainment'
const DESCRIPTION =
  '大阪から、夢と輝きを全国へ届ける次世代メンズアイドルを募集します。未経験歓迎。合格から約6ヶ月でデビュー。'
const OG_IMAGE = '/audition/assets/hero-fv.jpg'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'メンズアイドル',
    'オーディション',
    '新メンバー募集',
    '大阪',
    'Cinderella entertainment',
    '未経験歓迎',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Cinderella entertainment',
    locale: 'ja_JP',
    images: [{ url: OG_IMAGE, width: 1600, height: 900, alt: 'Cinderella entertainment' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
}

export default async function AuditionPage() {
  const data = await getAuditionData()
  return <AuditionClient data={data} />
}
