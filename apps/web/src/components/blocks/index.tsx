import type { Page } from '@/payload-types'

import { ContentBlock } from './content-block'
import { CtaBlock } from './cta-block'
import { HeroBlock } from './hero-block'

type LayoutBlock = NonNullable<Page['layout']>[number]

export const RenderBlocks = ({ blocks }: { blocks: LayoutBlock[] }) => (
  <>
    {blocks.map((block) => {
      switch (block.blockType) {
        case 'hero':
          return <HeroBlock key={block.id} {...block} />
        case 'content':
          return <ContentBlock key={block.id} {...block} />
        case 'cta':
          return <CtaBlock key={block.id} {...block} />
        default:
          return null
      }
    })}
  </>
)
