import React from 'react'

import type { AdditionalSectionBlock } from '@/lib/audition-defaults'

const overlayMap: Record<
  NonNullable<AdditionalSectionBlock & { blockType: 'banner' }>['overlay'] & string,
  string
> = {
  none: 'rgba(0,0,0,0)',
  light: 'rgba(0,0,0,0.25)',
  medium: 'rgba(0,0,0,0.5)',
  strong: 'rgba(0,0,0,0.7)',
}

export default function AdditionalSection({ block }: { block: AdditionalSectionBlock }) {
  switch (block.blockType) {
    case 'feature-grid':
      return (
        <section className="section">
          <div className="container">
            {(block.label || block.heading || block.intro) && (
              <div className="section-top">
                {block.label && <div className="section-label">{block.label}</div>}
                {block.heading && (
                  <h2 className="section-title">
                    <span>{block.heading}</span>
                  </h2>
                )}
                {block.intro && <p className="section-note">{block.intro}</p>}
              </div>
            )}
            <div
              className="block-feature-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${block.columns || '3'}, minmax(0, 1fr))`,
                gap: 16,
              }}
            >
              {block.items.map((item, i) => (
                <article
                  key={i}
                  className="block-feature-item"
                  style={{
                    padding: 24,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                  }}
                >
                  {item.icon && (
                    <div
                      className="block-feature-icon"
                      style={{
                        fontSize: 32,
                        marginBottom: 12,
                        color: 'var(--gold)',
                      }}
                    >
                      {item.icon}
                    </div>
                  )}
                  <h3 style={{ fontSize: 18, marginBottom: 8 }}>{item.title}</h3>
                  {item.desc && (
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--muted)' }}>
                      {item.desc}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )

    case 'stats':
      return (
        <section className="section">
          <div className="container">
            {(block.label || block.heading || block.intro) && (
              <div className="section-top">
                {block.label && <div className="section-label">{block.label}</div>}
                {block.heading && (
                  <h2 className="section-title">
                    <span>{block.heading}</span>
                  </h2>
                )}
                {block.intro && <p className="section-note">{block.intro}</p>}
              </div>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
                gap: 16,
              }}
            >
              {block.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: 28,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    className="serif"
                    style={{
                      fontSize: 'clamp(36px, 5vw, 56px)',
                      lineHeight: 1,
                      color: 'var(--gold)',
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </div>
                  {item.sub && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--soft)' }}>
                      {item.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )

    case 'text-image': {
      const imageRight = block.imagePosition !== 'left'
      return (
        <section className="section">
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 40,
                alignItems: 'center',
              }}
              className="block-text-image"
            >
              <div style={{ order: imageRight ? 0 : 1 }}>
                {block.label && <div className="section-label">{block.label}</div>}
                <h2 className="section-title" style={{ marginTop: 8 }}>
                  <span>{block.heading}</span>
                </h2>
                {block.body && (
                  <p
                    style={{
                      marginTop: 16,
                      lineHeight: 2,
                      color: 'var(--muted)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {block.body}
                  </p>
                )}
                {block.cta?.label && block.cta?.link && (
                  <a href={block.cta.link} className="pill pill-solid" style={{ marginTop: 24 }}>
                    {block.cta.label}
                  </a>
                )}
              </div>
              {block.image && (
                <div
                  style={{
                    minHeight: 320,
                    background: `url('${block.image}') center / cover no-repeat`,
                    border: '1px solid var(--line)',
                  }}
                />
              )}
            </div>
          </div>
        </section>
      )
    }

    case 'banner':
      return (
        <section
          style={{
            position: 'relative',
            minHeight: 360,
            display: 'flex',
            alignItems: 'center',
            background: block.image
              ? `${overlayMap[block.overlay || 'medium']
                  .replace('rgba', 'linear-gradient(rgba')
                  .replace(
                    ')',
                    `), rgba(0,0,0,0))`,
                  )},  url('${block.image}') center / cover no-repeat`
              : 'var(--card-strong)',
          }}
        >
          <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
            <h2 className="section-title">
              <span>{block.heading}</span>
            </h2>
            {block.subheading && (
              <p
                style={{
                  marginTop: 16,
                  color: 'var(--muted)',
                  maxWidth: 640,
                  margin: '16px auto 0',
                }}
              >
                {block.subheading}
              </p>
            )}
            {block.cta?.label && block.cta?.link && (
              <a
                href={block.cta.link}
                className="pill pill-solid"
                style={{ marginTop: 28, display: 'inline-flex' }}
              >
                {block.cta.label}
              </a>
            )}
          </div>
        </section>
      )

    case 'faq':
      return (
        <section className="section">
          <div className="container">
            {(block.label || block.heading || block.intro) && (
              <div className="section-top">
                {block.label && <div className="section-label">{block.label}</div>}
                {block.heading && (
                  <h2 className="section-title">
                    <span>{block.heading}</span>
                  </h2>
                )}
                {block.intro && <p className="section-note">{block.intro}</p>}
              </div>
            )}
            <div className="faq-grid">
              {block.items.map((item, i) => (
                <article key={i} className="faq-item">
                  <div className="faq-question">{item.question}</div>
                  <div className="faq-answer">{item.answer}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )

    case 'timeline':
      return (
        <section className="section">
          <div className="container">
            {(block.label || block.heading || block.intro) && (
              <div className="section-top">
                {block.label && <div className="section-label">{block.label}</div>}
                {block.heading && (
                  <h2 className="section-title">
                    <span>{block.heading}</span>
                  </h2>
                )}
                {block.intro && <p className="section-note">{block.intro}</p>}
              </div>
            )}
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 14 }}>
              {block.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr',
                    gap: 24,
                    padding: 20,
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                  }}
                >
                  <div className="serif" style={{ fontSize: 20, color: 'var(--gold)' }}>
                    {item.date}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{item.title}</h3>
                    {item.desc && (
                      <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 14 }}>
                        {item.desc}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )

    default:
      return null
  }
}
