import type { Metadata } from 'next'

import AuditionClient from './AuditionClient'

export const metadata: Metadata = {
  title: 'メンズアイドル新メンバー募集 | Cinderella entertainment',
  description:
    '大阪から、夢と輝きを全国へ届ける次世代メンズアイドルを募集します。未経験歓迎。合格から約6ヶ月でデビュー。',
}

export default function AuditionPage() {
  return <AuditionClient />
}
