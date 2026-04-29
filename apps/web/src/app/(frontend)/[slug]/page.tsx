import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks'
import { getPayloadClient } from '@/lib/payload'

type Args = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return {}

  const meta = page.meta as { title?: string; description?: string } | undefined

  return {
    title: meta?.title ?? page.title,
    description: meta?.description ?? undefined,
  }
}

export const generateStaticParams = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { status: { equals: 'published' }, slug: { not_equals: 'home' } },
    limit: 100,
  })

  return result.docs.map((page) => ({ slug: page.slug }))
}

const Page = async ({ params }: Args) => {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  return (
    <main>{page.layout && page.layout.length > 0 && <RenderBlocks blocks={page.layout} />}</main>
  )
}

export default Page
