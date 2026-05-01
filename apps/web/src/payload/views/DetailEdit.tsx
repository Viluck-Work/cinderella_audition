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
  let initialData: Record<string, unknown> | null = null
  let siteName = '株式会社サンプル'
  let sectionLabels: Record<string, string> = {}
  try {
    const payload = await getPayload({ config })
    const audition = (await payload.findGlobal({ slug: 'audition', depth: 0 })) as Record<
      string,
      unknown
    >
    initialData = audition
    if (audition?.sectionLabels && typeof audition.sectionLabels === 'object') {
      sectionLabels = audition.sectionLabels as Record<string, string>
    }
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
      initialData={initialData}
      companyName={`${siteName}様`}
      sectionLabels={sectionLabels}
    />
  )
}
