import configPromise from '@payload-config'
import { generatePageMetadata, NotFoundPage } from '@payloadcms/next/views'

import { importMap } from '@/app/(payload)/admin/importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config: configPromise, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config: configPromise, importMap, params, searchParams })

export default NotFound
