import type { Media as MediaType } from '@/payload-types'

type Props = {
  heading: string
  subheading?: string | null
  image?: MediaType | string | null
  cta?: { label?: string | null; link?: string | null } | null
}

export const HeroBlock = ({ heading, subheading, image, cta }: Props) => {
  const imageUrl = typeof image === 'object' && image !== null ? image.url : null

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center bg-primary px-6 py-24 text-white">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">{heading}</h1>
        {subheading && <p className="mt-4 text-lg md:text-xl">{subheading}</p>}
        {cta?.label && cta?.link && (
          <a
            href={cta.link}
            className="mt-8 inline-block rounded-md bg-highlight px-8 py-3 font-medium text-white transition hover:opacity-90"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
