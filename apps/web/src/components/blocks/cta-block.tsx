type Props = {
  heading: string
  description?: string | null
  buttonLabel: string
  buttonLink: string
}

export const CtaBlock = ({ heading, description, buttonLabel, buttonLink }: Props) => (
  <section className="bg-accent px-6 py-16 text-center text-white">
    <h2 className="text-3xl font-bold">{heading}</h2>
    {description && <p className="mx-auto mt-4 max-w-2xl text-lg">{description}</p>}
    <a
      href={buttonLink}
      className="mt-8 inline-block rounded-md bg-highlight px-8 py-3 font-medium text-white transition hover:opacity-90"
    >
      {buttonLabel}
    </a>
  </section>
)
