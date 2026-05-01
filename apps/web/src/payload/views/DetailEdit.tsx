import type { AdminViewServerProps } from 'payload'

import { getPayload } from 'payload'
import config from '../../../payload.config'

import './detail-edit.css'

import DetailEditClient from './DetailEditClient'
import { findSection, SECTIONS, SIDEBAR } from './sections'

type SearchParams = Record<string, string | string[] | undefined>

const pickSlug = (sp: SearchParams | undefined): string => {
  const raw = sp?.section
  const v = Array.isArray(raw) ? raw[0] : raw
  return v && findSection(v) ? v : SECTIONS[0].slug
}

export default async function DetailEdit(props: AdminViewServerProps) {
  // Payload の AdminViewServerProps から searchParams を拾う
  const sp = (props as unknown as { searchParams?: SearchParams }).searchParams
  const sectionSlug = pickSlug(sp)

  // Audition global の現状値 + SiteSettings から会社名を取得
  let initialData: unknown = null
  let siteName = '株式会社サンプル'
  try {
    const payload = await getPayload({ config })
    initialData = await payload.findGlobal({ slug: 'audition', depth: 0 })
    const settings = (await payload.findGlobal({ slug: 'site-settings' })) as {
      siteName?: string
    } | null
    if (settings?.siteName) siteName = settings.siteName
  } catch {
    // 取得失敗時はクライアント側でデフォルトにフォールバック
  }

  return (
    <DetailEditClient
      sidebar={SIDEBAR}
      sections={SECTIONS}
      activeSlug={sectionSlug}
      initialData={initialData as Record<string, unknown> | null}
      companyName={`${siteName}様`}
    />
  )
}
