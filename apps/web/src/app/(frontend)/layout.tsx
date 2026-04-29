import '@/app/global.css'

import type { Metadata } from 'next'
import React from 'react'

import { GoogleTagManager, GoogleTagManagerNoscript } from '@/components/gtm'
import { getPayloadClient } from '@/lib/payload'

export const generateMetadata = async (): Promise<Metadata> => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'site-settings' }).catch(() => null)

  const siteName = settings?.siteName || 'My Site'

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: settings?.siteDescription ?? undefined,
  }
}

const FrontendLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head>
      <GoogleTagManager />
    </head>
    <body className="font-sans antialiased">
      <GoogleTagManagerNoscript />
      {children}
    </body>
  </html>
)

export default FrontendLayout
