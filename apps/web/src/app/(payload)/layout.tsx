import '@payloadcms/next/css'

import configPromise from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from '@/app/(payload)/admin/importMap.js'
import { serverFunction } from '@/app/(payload)/admin/serverFunctions'

type LayoutArgs = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutArgs) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
