import Link from 'next/link'

import { RenderBlocks } from '@/components/blocks'
import { getPayloadClient } from '@/lib/payload'

const HomePage = async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' }, status: { equals: 'published' } },
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Next.js + Payload CMS</h1>
          <p className="mt-4 text-gray-600">
            管理画面で slug が &quot;home&quot; のページを作成してください。
          </p>
          <Link href="/admin" className="mt-4 inline-block text-highlight underline">
            管理画面へ
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>{page.layout && page.layout.length > 0 && <RenderBlocks blocks={page.layout} />}</main>
  )
}

export default HomePage
