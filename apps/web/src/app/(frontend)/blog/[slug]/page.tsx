import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'
import type { Media as MediaType } from '@/payload-types'

type Args = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({ params }: Args): Promise<Metadata> => {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) return {}

  const meta = post.meta as { title?: string; description?: string } | undefined

  return {
    title: meta?.title ?? post.title,
    description: meta?.description ?? post.excerpt ?? undefined,
  }
}

export const generateStaticParams = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    limit: 100,
  })

  return result.docs.map((post) => ({ slug: post.slug }))
}

const BlogPost = async ({ params }: Args) => {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const post = result.docs[0]
  if (!post) notFound()

  const featuredImage =
    typeof post.featuredImage === 'object' && post.featuredImage !== null
      ? (post.featuredImage as MediaType)
      : null

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        {post.publishedAt && (
          <time className="mt-2 block text-gray-500">
            {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
          </time>
        )}
        {featuredImage?.url && (
          <img src={featuredImage.url} alt={featuredImage.alt} className="mt-8 w-full rounded-lg" />
        )}
        <div className="prose prose-lg mt-8 max-w-none">
          <RichText data={post.content} />
        </div>
      </article>
    </main>
  )
}

export default BlogPost
