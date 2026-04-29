import type { Metadata } from 'next'
import Link from 'next/link'

import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'ブログ',
}

const BlogPage = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 20,
  })

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">ブログ</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {result.docs.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <article className="rounded-lg border p-6 transition hover:shadow-lg">
              <h2 className="text-xl font-semibold group-hover:text-highlight">{post.title}</h2>
              {post.excerpt && <p className="mt-2 text-gray-600">{post.excerpt}</p>}
              {post.publishedAt && (
                <time className="mt-4 block text-sm text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </time>
              )}
            </article>
          </Link>
        ))}
      </div>
      {result.docs.length === 0 && <p className="mt-8 text-gray-500">記事がまだありません。</p>}
    </main>
  )
}

export default BlogPage
