'use client'

import './audition.css'

import { useLivePreview } from '@payloadcms/live-preview-react'
import React, { useEffect, useMemo, useState } from 'react'

import type { AuditionData } from '@/lib/audition-defaults'
import { mapAuditionData } from '@/lib/audition-mapper'
import { buildThemeVars } from '@/lib/audition-theme'

import AdditionalSection from './AdditionalSection'

type Props = { data: AuditionData }

export default function AuditionClient({ data: initialData }: Props) {
  // requestHandler を上書きして、Payload API への mergeData リクエストをスキップする。
  // 親 (DetailEditClient) が常に完全なデータを postMessage で送ってくる前提で、
  // 入力フィールドを編集するたびにサーバーラウンドトリップが発生する重さを回避。
  const directRequestHandler = React.useCallback(
    (args: { data: { data?: unknown } }) =>
      Promise.resolve({
        json: () => Promise.resolve(args.data?.data),
      } as Response),
    [],
  )

  const { data: liveRaw } = useLivePreview<Record<string, unknown>>({
    initialData: initialData as unknown as Record<string, unknown>,
    serverURL:
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SERVER_URL || '',
    depth: 2,
    requestHandler: directRequestHandler,
  })
  const data = useMemo<AuditionData>(
    () =>
      (liveRaw as unknown) === initialData ? initialData : mapAuditionData(liveRaw as unknown),
    [liveRaw, initialData],
  )
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({})
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 },
    )

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.2 },
    )

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))
    document.querySelectorAll('.section').forEach((el) => sectionObserver.observe(el))

    const parallaxNodes = document.querySelectorAll<HTMLElement>('.parallax')
    let rafId = 0
    const runParallax = () => {
      const vh = window.innerHeight || 1
      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const speed = Number(node.dataset.speed || 0.12)
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed
        node.style.transform = `translate3d(0, ${offset * -0.18}px, 0)`
      })
      rafId = 0
    }
    const scheduleParallax = () => {
      if (reduceMotion) return
      if (rafId) return
      rafId = window.requestAnimationFrame(runParallax)
    }
    if (!reduceMotion) runParallax()
    window.addEventListener('scroll', scheduleParallax, { passive: true })
    window.addEventListener('resize', scheduleParallax)

    const magneticNodes = document.querySelectorAll<HTMLElement>('.magnetic')
    const handlers: Array<{ node: HTMLElement; move: (e: MouseEvent) => void; reset: () => void }> =
      []
    if (!reduceMotion) {
      magneticNodes.forEach((node) => {
        const reset = () => {
          node.style.transform = ''
        }
        const move = (e: MouseEvent) => {
          const rect = node.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width - 0.5
          const py = (e.clientY - rect.top) / rect.height - 0.5
          node.style.transform = `perspective(1200px) rotateX(${py * -8}deg) rotateY(${px * 10}deg) translate3d(${px * 10}px, ${py * 10}px, 0)`
        }
        node.addEventListener('mousemove', move)
        node.addEventListener('mouseleave', reset)
        handlers.push({ node, move, reset })
      })
    }

    return () => {
      revealObserver.disconnect()
      sectionObserver.disconnect()
      window.removeEventListener('scroll', scheduleParallax)
      window.removeEventListener('resize', scheduleParallax)
      if (rafId) window.cancelAnimationFrame(rafId)
      handlers.forEach(({ node, move, reset }) => {
        node.removeEventListener('mousemove', move)
        node.removeEventListener('mouseleave', reset)
      })
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [navOpen])

  // 親 (DetailEditClient) からのメッセージ:
  // - 'autosite-scroll': 指定アンカーへスクロール
  // - 'autosite-edit-mode': クリックで編集ポップアップを出すモード切替
  const [editMode, setEditMode] = useState(false)
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return
      if (!ev.data || typeof ev.data !== 'object') return
      const type = (ev.data as { type?: unknown }).type
      if (type === 'autosite-scroll') {
        const anchor = (ev.data as { anchor?: string }).anchor
        if (typeof anchor !== 'string') return
        if (anchor === '' || anchor === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
        const sel = anchor.startsWith('#') ? anchor : `#${anchor}`
        const el = document.querySelector(sel)
        if (el instanceof HTMLElement) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else if (type === 'autosite-edit-mode') {
        setEditMode(Boolean((ev.data as { enabled?: boolean }).enabled))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // 編集モード時: data-edit-path を持つ要素のクリックを捕まえて親に通知
  useEffect(() => {
    if (!editMode) {
      document.body.classList.remove('autosite-edit-mode')
      return
    }
    document.body.classList.add('autosite-edit-mode')
    const onClick = (ev: MouseEvent) => {
      const target = (ev.target as HTMLElement | null)?.closest<HTMLElement>('[data-edit-path]')
      if (!target) return
      ev.preventDefault()
      ev.stopPropagation()
      const path = target.getAttribute('data-edit-path')
      if (!path) return
      const r = target.getBoundingClientRect()
      window.parent?.postMessage(
        {
          type: 'autosite-edit-request',
          path,
          rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        },
        window.location.origin,
      )
    }
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.body.classList.remove('autosite-edit-mode')
    }
  }, [editMode])

  const themeVar = buildThemeVars(
    data.theme.backgroundColor,
    data.theme.primaryColor,
    data.theme.accentColor,
    data.theme.cardColor,
  ) as React.CSSProperties
  const heroVar = { '--hero-image': `url('${data.media.heroImage}')` } as React.CSSProperties
  const featureVar = {
    '--feature-image': `url('${data.media.featureImage}')`,
  } as React.CSSProperties
  const lumiVar = {
    '--lumi-image': `url('${data.media.lumiBackgroundImage}')`,
  } as React.CSSProperties

  const renderConditionCell = (text: string) =>
    text === '同左' ? (
      <>
        <span className="ditto-desktop">同左</span>
        <span className="ditto-mobile">同上</span>
      </>
    ) : (
      text
    )

  return (
    <div className="audition-root" style={themeVar}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: 'メンズアイドル新メンバー募集',
            description:
              '大阪から、夢と輝きを全国へ届ける次世代メンズアイドルを募集します。未経験歓迎。合格から約6ヶ月でデビュー。',
            datePosted: '2026-04-01',
            employmentType: 'CONTRACTOR',
            hiringOrganization: {
              '@type': 'Organization',
              name: 'Cinderella entertainment',
              sameAs: 'https://cin-dere-lla.com/',
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: '大阪市',
                addressRegion: '大阪府',
                addressCountry: 'JP',
              },
            },
          }),
        }}
      />
      <div className="site-shell">
        <header className="header">
          <div className="container header-inner">
            <a href="#top" className="brand" aria-label="Cinderella entertainment">
              <img
                className="brand-logo"
                src="/audition/assets/cinderella-logo-main.png"
                alt="Cinderella entertainment logo"
              />
            </a>
            <nav className="nav" aria-label="ページ内ナビゲーション">
              <a href="#about">ABOUT</a>
              <a href="#tracks">TRACK RECORD</a>
              <a href="#groups">GROUPS</a>
              <a href="#support">SUPPORT</a>
              <a href="#flow">FLOW</a>
              <a href="#requirements">REQUIREMENTS</a>
              <a href="#faq">FAQ</a>
            </nav>
            <div className="header-actions">
              <a href="#tracks" className="pill pill-outline">
                実績を見る
              </a>
              <a href="#entry" className="pill pill-solid">
                応募する
              </a>
              <button
                type="button"
                className="nav-toggle"
                aria-label="メニューを開く"
                aria-expanded={navOpen}
                aria-controls="mobile-nav"
                onClick={() => setNavOpen((v) => !v)}
              >
                <span
                  className={`nav-toggle-bars${navOpen ? ' is-open' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </header>

        <div
          id="mobile-nav"
          className={`mobile-nav${navOpen ? ' is-open' : ''}`}
          aria-hidden={!navOpen}
        >
          <button
            type="button"
            className="mobile-nav-backdrop"
            aria-label="メニューを閉じる"
            tabIndex={navOpen ? 0 : -1}
            onClick={() => setNavOpen(false)}
          />
          <nav className="mobile-nav-panel" aria-label="モバイルナビゲーション">
            {[
              ['#about', 'ABOUT'],
              ['#tracks', 'TRACK RECORD'],
              ['#groups', 'GROUPS'],
              ['#support', 'SUPPORT'],
              ['#flow', 'FLOW'],
              ['#requirements', 'REQUIREMENTS'],
              ['#faq', 'FAQ'],
              ['#entry', 'ENTRY'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                tabIndex={navOpen ? 0 : -1}
                onClick={() => setNavOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <main id="top">
          {/* Hero */}
          <section className="hero section">
            <div
              className="hero-media parallax"
              data-speed="0.18"
              aria-hidden="true"
              style={heroVar}
            />
            <div className="container hero-grid">
              <div className="hero-copy parallax" data-speed="0.1">
                <div className="eyebrow" data-edit-path="hero.eyebrow">
                  {data.hero.eyebrow}
                </div>
                <div className="hero-audition serif" data-edit-path="hero.audition">
                  {data.hero.audition}
                </div>
                <h1>
                  <span className="hero-title-line">
                    <span data-edit-path="hero.titleLine1Prefix">
                      {data.hero.titleLine1Prefix}
                    </span>
                    <span className="hero-highlight" data-edit-path="hero.titleHighlight">
                      {data.hero.titleHighlight}
                    </span>
                    <span data-edit-path="hero.titleLine1Suffix">
                      {data.hero.titleLine1Suffix}
                    </span>
                  </span>
                  <span className="hero-title-line" data-edit-path="hero.titleLine2">
                    {data.hero.titleLine2}
                  </span>
                </h1>
                <p className="hero-lead" data-edit-path="hero.lead">
                  {data.hero.lead}
                </p>
                <div className="hero-meta">
                  {data.hero.stats.map((stat, i) => (
                    <div key={stat.label} className="hero-stat magnetic">
                      <div className="hero-stat-label" data-edit-path={`hero.stats.${i}.label`}>
                        {stat.label}
                      </div>
                      <div
                        className="hero-stat-value serif"
                        data-edit-path={`hero.stats.${i}.value`}
                      >
                        {stat.value}
                      </div>
                      <div className="hero-stat-sub" data-edit-path={`hero.stats.${i}.sub`}>
                        {stat.sub}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hero-actions">
                  <a
                    href={data.hero.primaryHref}
                    className="pill pill-solid"
                    data-edit-path="hero.primaryLabel"
                  >
                    {data.hero.primaryLabel}
                  </a>
                  <a
                    href={data.hero.secondaryHref}
                    className="pill pill-outline"
                    data-edit-path="hero.secondaryLabel"
                  >
                    {data.hero.secondaryLabel}
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-scroll">Scroll</div>
          </section>

          {/* Feature band */}
          <section className="feature-band">
            <div className="container">
              <div
                className="feature-visual reveal magnetic"
                data-reveal="left"
                aria-hidden="true"
                style={featureVar}
              />
            </div>
          </section>

          {/* About */}
          <section id="about" className="section intro-band">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="about.label">
                  {data.about.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span>
                    <span data-edit-path="about.titleLine1">{data.about.titleLine1}</span>
                    <br />
                    <span data-edit-path="about.titleLine2">{data.about.titleLine2}</span>
                  </span>
                </h2>
                <p className="section-note" data-edit-path="about.note">
                  {data.about.note}
                </p>
              </div>
              <div className="intro-grid">
                <div className="intro-copy about-copy reveal" data-reveal="left">
                  {data.about.paragraphs.map((p, i) => (
                    <p key={i} data-edit-path={`about.paragraphs.${i}.text`}>
                      {p}
                    </p>
                  ))}
                </div>
                <div
                  className="scoreboard reveal magnetic"
                  data-reveal="right"
                  aria-label="主要指標"
                >
                  {data.about.scoreboard.map((s, i) => (
                    <div key={s.label} className="score">
                      <small data-edit-path={`about.scoreboard.${i}.label`}>{s.label}</small>
                      <strong
                        className="serif"
                        data-edit-path={`about.scoreboard.${i}.value`}
                      >
                        {s.value}
                      </strong>
                      <span data-edit-path={`about.scoreboard.${i}.desc`}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Track Record */}
          <section id="tracks" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="tracks.label">
                  {data.tracks.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span>
                    <span data-edit-path="tracks.titleLine1">{data.tracks.titleLine1}</span>
                    <br />
                    <span data-edit-path="tracks.titleLine2">{data.tracks.titleLine2}</span>
                  </span>
                </h2>
                <p className="section-note" data-edit-path="tracks.note">
                  {data.tracks.note}
                </p>
              </div>

              <div className="platform-grid">
                <article className="platform-panel">
                  <h3 data-edit-path="tracks.platformPanelTitle">
                    {data.tracks.platformPanelTitle}
                  </h3>
                  <p data-edit-path="tracks.platformPanelDesc">
                    {data.tracks.platformPanelDesc}
                  </p>
                  <div className="platform-logos">
                    {data.tracks.platforms.map((p, i) => (
                      <div key={p.name} className="logo-chip reveal magnetic" data-reveal="zoom">
                        <div className="logo-icon">
                          <img src={p.iconPath} alt={p.name} />
                        </div>
                        <div className="logo-body">
                          <strong data-edit-path={`tracks.platforms.${i}.name`}>{p.name}</strong>
                          <span data-edit-path={`tracks.platforms.${i}.desc`}>{p.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="dam-panel">
                  <div>
                    <h3 data-edit-path="tracks.damPanelTitle">{data.tracks.damPanelTitle}</h3>
                    <p data-edit-path="tracks.damPanelDesc">{data.tracks.damPanelDesc}</p>
                  </div>
                  <div className="dam-mark">
                    <img src="/audition/assets/dam.png" alt="DAM" />
                  </div>
                </article>
              </div>

              {/* Music Videos */}
              <div className="mv-section">
                <div className="mv-section-top section-top">
                  <div className="section-label" data-edit-path="tracks.mvSectionLabel">
                    {data.tracks.mvSectionLabel}
                  </div>
                  <h3
                    className="section-title title-reveal"
                    style={{ fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                  >
                    <span>
                      <span data-edit-path="tracks.mvSectionTitleLine1">
                        {data.tracks.mvSectionTitleLine1}
                      </span>
                      <br />
                      <span data-edit-path="tracks.mvSectionTitleLine2">
                        {data.tracks.mvSectionTitleLine2}
                      </span>
                    </span>
                  </h3>
                  <p className="section-note" data-edit-path="tracks.mvSectionNote">
                    {data.tracks.mvSectionNote}
                  </p>
                </div>
                <div className="mv-grid">
                  {data.tracks.mvs.map((mv, i) => (
                    <article
                      key={mv.youtubeId}
                      className="mv-card reveal magnetic"
                      data-reveal="zoom"
                    >
                      {playingVideos[mv.youtubeId] ? (
                        <iframe
                          className="mv-frame"
                          src={`https://www.youtube.com/embed/${mv.youtubeId}${mv.startSeconds ? `?start=${mv.startSeconds}&autoplay=1` : '?autoplay=1'}`}
                          title={mv.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          className="mv-poster"
                          type="button"
                          onClick={() =>
                            setPlayingVideos((prev) => ({ ...prev, [mv.youtubeId]: true }))
                          }
                          style={
                            {
                              '--poster-image': `url('https://img.youtube.com/vi/${mv.youtubeId}/maxresdefault.jpg')`,
                            } as React.CSSProperties
                          }
                        >
                          <span className="mv-play" aria-hidden="true" />
                          <span className="mv-meta-line">
                            <span>Music Video</span>
                            <span>Play</span>
                          </span>
                        </button>
                      )}
                      <div className="mv-copy">
                        <div className="mv-kicker" data-edit-path={`tracks.mvs.${i}.kicker`}>
                          {mv.kicker}
                        </div>
                        <div className="mv-title" data-edit-path={`tracks.mvs.${i}.title`}>
                          {mv.title}
                        </div>
                        <p data-edit-path={`tracks.mvs.${i}.desc`}>{mv.desc}</p>
                        <a
                          className="mv-link"
                          href={mv.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch on YouTube
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Groups */}
          <section id="groups" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="groups.label">
                  {data.groups.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span>
                    <span data-edit-path="groups.titleLine1">{data.groups.titleLine1}</span>
                    <br />
                    <span data-edit-path="groups.titleLine2">{data.groups.titleLine2}</span>
                  </span>
                </h2>
                <p className="section-note" data-edit-path="groups.note">
                  {data.groups.note}
                </p>
              </div>
              <div className="group-list">
                {data.groups.items.map((g, i) => (
                  <article
                    key={g.name}
                    className="group-card magnetic reveal"
                    data-reveal={g.reveal}
                  >
                    <div
                      className={`group-visual${g.visualVariant === 'lumi' ? ' group-visual-lumi' : ''}`}
                      style={g.visualVariant === 'lumi' ? lumiVar : undefined}
                    >
                      <div className="group-badge" data-edit-path={`groups.items.${i}.badge`}>
                        {g.badge}
                      </div>
                      <div className="group-logo-wrap">
                        <div className="group-logo-panel">
                          <img src={g.logoPath} alt={g.logoAlt} />
                        </div>
                      </div>
                    </div>
                    <div className="group-copy">
                      <div className="group-name">
                        <strong className="serif" data-edit-path={`groups.items.${i}.name`}>
                          {g.name}
                        </strong>
                        <span data-edit-path={`groups.items.${i}.nameKana`}>{g.nameKana}</span>
                      </div>
                      <div className="group-meta" data-edit-path={`groups.items.${i}.meta`}>
                        {g.meta}
                      </div>
                      <p data-edit-path={`groups.items.${i}.desc`}>{g.desc}</p>
                      <ul className="detail-list">
                        {g.highlights.map((h, j) => (
                          <li key={j} data-edit-path={`groups.items.${i}.highlights.${j}.text`}>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Support */}
          <section id="support" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="support.label">
                  {data.support.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span data-edit-path="support.title">{data.support.title}</span>
                </h2>
                <p className="section-note" data-edit-path="support.note">
                  {data.support.note}
                </p>
              </div>
              <div className="reasons">
                {data.support.reasons.map((r, i) => (
                  <article
                    key={r.no}
                    className="reason-card magnetic reveal"
                    data-reveal={r.reveal}
                  >
                    <div className="reason-no" data-edit-path={`support.reasons.${i}.no`}>
                      {r.no}
                    </div>
                    <h3 data-edit-path={`support.reasons.${i}.title`}>{r.title}</h3>
                    <p data-edit-path={`support.reasons.${i}.desc`}>{r.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Flow */}
          <section id="flow" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="flow.label">
                  {data.flow.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span data-edit-path="flow.title">{data.flow.title}</span>
                </h2>
                <p className="section-note" data-edit-path="flow.note">
                  {data.flow.note}
                </p>
              </div>
              <div className="flow">
                {data.flow.steps.map((s, i) => (
                  <article key={s.step} className="flow-step">
                    <div className="step-index" data-edit-path={`flow.steps.${i}.step`}>
                      {s.step}
                    </div>
                    <div className="step-body">
                      <h3 data-edit-path={`flow.steps.${i}.title`}>{s.title}</h3>
                      <p data-edit-path={`flow.steps.${i}.desc`}>{s.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section id="requirements" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="requirements.label">
                  {data.requirements.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span data-edit-path="requirements.title">{data.requirements.title}</span>
                </h2>
                <p className="section-note" data-edit-path="requirements.note">
                  {data.requirements.note}
                </p>
              </div>
              <div className="requirements-section">
                {data.requirements.items.map((r, i) => (
                  <div key={r.title} className="requirement-item">
                    <strong data-edit-path={`requirements.items.${i}.title`}>{r.title}</strong>
                    <p data-edit-path={`requirements.items.${i}.desc`}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Conditions */}
          <section className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="conditions.label">
                  {data.conditions.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span>
                    <span data-edit-path="conditions.titleLine1">
                      {data.conditions.titleLine1}
                    </span>
                    <br />
                    <span data-edit-path="conditions.titleLine2">
                      {data.conditions.titleLine2}
                    </span>
                  </span>
                </h2>
                <p className="section-note" data-edit-path="conditions.note">
                  {data.conditions.note}
                </p>
              </div>
              <div className="conditions-table">
                <table>
                  <thead>
                    <tr>
                      <th>項目</th>
                      <th>デビュー前</th>
                      <th>デビュー直後</th>
                      <th>1年後のイメージ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.conditions.rows.map((row, i) => (
                      <tr key={row.category}>
                        <td data-edit-path={`conditions.rows.${i}.category`}>{row.category}</td>
                        <td data-edit-path={`conditions.rows.${i}.beforeDebut`}>
                          {renderConditionCell(row.beforeDebut)}
                        </td>
                        <td data-edit-path={`conditions.rows.${i}.afterDebut`}>
                          {renderConditionCell(row.afterDebut)}
                        </td>
                        <td data-edit-path={`conditions.rows.${i}.oneYear`}>
                          {renderConditionCell(row.oneYear)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label" data-edit-path="faq.label">
                  {data.faq.label}
                </div>
                <h2 className="section-title title-reveal">
                  <span data-edit-path="faq.title">{data.faq.title}</span>
                </h2>
                <p className="section-note" data-edit-path="faq.note">
                  {data.faq.note}
                </p>
              </div>
              <div className="faq-grid">
                {data.faq.items.map((faq, i) => (
                  <article key={faq.question} className="faq-item">
                    <div className="faq-question" data-edit-path={`faq.items.${i}.question`}>
                      {faq.question}
                    </div>
                    <div className="faq-answer" data-edit-path={`faq.items.${i}.answer`}>
                      {faq.answer}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Additional sections (CMS-managed templates) */}
          {data.additionalSections.map((block, i) => (
            <AdditionalSection key={i} block={block} />
          ))}

          {/* CTA / Entry */}
          <section id="entry" className="cta section">
            <div className="container">
              <div className="cta-wrap parallax magnetic" data-speed="0.08">
                <div className="cta-label" data-edit-path="cta.label">
                  {data.cta.label}
                </div>
                <h2 className="cta-title serif title-reveal">
                  <span>
                    <span data-edit-path="cta.titleLine1">{data.cta.titleLine1}</span>
                    <br />
                    <span data-edit-path="cta.titleLine2">{data.cta.titleLine2}</span>
                  </span>
                </h2>
                <p data-edit-path="cta.desc">{data.cta.desc}</p>
                <div className="cta-actions">
                  <a
                    href={data.cta.primaryHref}
                    className="pill pill-solid"
                    data-edit-path="cta.primaryLabel"
                  >
                    {data.cta.primaryLabel}
                  </a>
                  <a
                    href={data.cta.secondaryHref}
                    className="pill pill-outline"
                    data-edit-path="cta.secondaryLabel"
                  >
                    {data.cta.secondaryLabel}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container footer-inner">
            <div className="brand">
              <img
                className="brand-logo"
                src="/audition/assets/cinderella-logo-main.png"
                alt="Cinderella entertainment logo"
              />
            </div>
            <div className="footer-links">
              <a href="https://cin-dere-lla.com/" target="_blank" rel="noopener noreferrer">
                会社概要
              </a>
              <span>プライバシーポリシー</span>
              <span>お問い合わせ</span>
            </div>
            <div>© Cinderella entertainment Inc.</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
