import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'サイト設定',
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'OGP デフォルト画像',
    },
    {
      name: 'footerText',
      type: 'text',
    },
  ],
}
