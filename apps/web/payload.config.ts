import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from '@/payload/collections/media'
import { Pages } from '@/payload/collections/pages'
import { Posts } from '@/payload/collections/posts'
import { Users } from '@/payload/collections/users'
import { Audition } from '@/payload/globals/audition'
import { Navigation } from '@/payload/globals/navigation'
import { SiteSettings } from '@/payload/globals/site-settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is required')
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  editor: lexicalEditor(),
  admin: {
    user: 'users',
    components: {
      views: {
        dashboard: {
          Component: '@/payload/views/Dashboard',
        },
        detailEdit: {
          Component: '@/payload/views/DetailEdit',
          path: '/edit',
          exact: false,
        },
        tasks: {
          Component: '@/payload/views/Tasks',
          path: '/tasks',
          exact: false,
        },
      },
    },
  },
  collections: [Users, Media, Pages, Posts],
  globals: [SiteSettings, Navigation, Audition],
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['pages', 'posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => (doc as { title?: string }).title ?? '',
      generateDescription: ({ doc }) => (doc as { excerpt?: string }).excerpt ?? '',
    }),
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
