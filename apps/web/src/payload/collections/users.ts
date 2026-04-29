import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: '管理者', value: 'admin' },
        { label: '編集者', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
    },
  ],
}
