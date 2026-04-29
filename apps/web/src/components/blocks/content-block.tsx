import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  content: SerializedEditorState
}

export const ContentBlock = ({ content }: Props) => (
  <section className="mx-auto max-w-3xl px-6 py-16">
    <div className="prose prose-lg max-w-none">
      <RichText data={content} />
    </div>
  </section>
)
