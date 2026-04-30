'use client'

import './audition.css'

import React, { useEffect, useState } from 'react'

type MVItem = {
  id: string
  kicker: string
  title: string
  desc: string
  href: string
  start?: string
}

const MV_LIST: MVItem[] = [
  {
    id: 'Cg2UF5GqJzw',
    kicker: 'MV 01',
    title: 'ライブの熱量をそのまま映像へ',
    desc: 'ステージで爆発する熱量と、ファンと一体になる瞬間。あなたもこの景色の真ん中に立てる。',
    href: 'https://www.youtube.com/watch?v=Cg2UF5GqJzw',
  },
  {
    id: 'CT8IMsUV9nM',
    start: '1',
    kicker: 'MV 02',
    title: '世界観づくりまで見える映像展開',
    desc: '楽曲の世界観を映像で表現する。歌って踊るだけじゃない、表現者としての可能性が広がる。',
    href: 'https://www.youtube.com/watch?v=CT8IMsUV9nM&t=1s',
  },
  {
    id: 'WikZL9akqh0',
    kicker: 'MV 03',
    title: '推せる理由が映像でも積み上がる',
    desc: '初めて見た人さえ惹き込む、グループならではの空気感。あなたが加わる未来の物語が、ここから始まる。',
    href: 'https://www.youtube.com/watch?v=WikZL9akqh0',
  },
  {
    id: 'T162bkpr_5E',
    kicker: 'MV 04',
    title: '既存実績の厚みを一画面で見せる',
    desc: '一本だけじゃない、何作も残せる場所。アーティストとしての軌跡を、ここで積み上げていける。',
    href: 'https://www.youtube.com/watch?v=T162bkpr_5E',
  },
]

export default function AuditionClient() {
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

  return (
    <div className="audition-root">
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
            <div className="hero-media parallax" data-speed="0.18" aria-hidden="true" />
            <div className="container hero-grid">
              <div className="hero-copy parallax" data-speed="0.1">
                <div className="eyebrow">Cinderella entertainment audition</div>
                <div className="hero-audition serif">Audition</div>
                <h1>
                  <span className="hero-title-line">
                    夢を<span className="hero-highlight">現実（リアル）</span>へ。
                  </span>
                  <span className="hero-title-line">新メンバー募集。</span>
                </h1>
                <p className="hero-lead">
                  &ldquo;自由&rdquo;と&ldquo;挑戦&rdquo;に可能性を創り出し、新たな&ldquo;エンターテインメント&rdquo;を届ける。
                  Cinderella entertainment は、あなたの夢を実現する魔法の杖。
                  大阪から、夢と輝きを全国へ届ける次世代メンズアイドルを募集します。
                </p>
                <div className="hero-meta">
                  {[
                    {
                      label: 'Base',
                      value: 'Osaka',
                      sub: '大阪を起点に、全国へ広がる輝きをつくる。',
                    },
                    {
                      label: 'Debut',
                      value: '~6ヶ月',
                      sub: '合格から約6ヶ月を目安にデビューへ進行。',
                    },
                    { label: 'Track', value: '100%', sub: '全員デビュー前提で選考する体制です。' },
                  ].map((stat) => (
                    <div key={stat.label} className="hero-stat magnetic">
                      <div className="hero-stat-label">{stat.label}</div>
                      <div className="hero-stat-value serif">{stat.value}</div>
                      <div className="hero-stat-sub">{stat.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="hero-actions">
                  <a href="#entry" className="pill pill-solid">
                    今すぐエントリー
                  </a>
                  <a href="#about" className="pill pill-outline">
                    Cinderellaとは
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
              />
            </div>
          </section>

          {/* About */}
          <section id="about" className="section intro-band">
            <div className="container">
              <div className="section-top">
                <div className="section-label">About</div>
                <h2 className="section-title title-reveal">
                  <span>
                    夢を抱くだけで終わらせず、
                    <br />
                    夢を現実へ変えていく。
                  </span>
                </h2>
                <p className="section-note">
                  未経験から、確かに応援される存在へ。あなたの個性と本気を、楽曲・映像・ライブのすべての舞台で輝かせます。
                </p>
              </div>
              <div className="intro-grid">
                <div className="intro-copy about-copy reveal" data-reveal="left">
                  <p>
                    「大阪から、夢と輝きを全国へ」。
                    関西のカルチャーと熱量を原動力に、次世代を担うメンズアイドルを創出します。
                    夢を持つ者もがシンデレラに。そう言い切れるだけの行動と投資を重ねています。
                  </p>
                  <p>
                    シンデレラでは、まず「売れる」ことから始めます。
                    認知と収益が生まれ、長く続けることで技術も磨かれていく。
                    その上でファンへのサービスを深め、「本物のアイドル」を目指していきます。
                  </p>
                </div>
                <div
                  className="scoreboard reveal magnetic"
                  data-reveal="right"
                  aria-label="主要指標"
                >
                  {[
                    {
                      label: 'Founded',
                      value: '2023.08',
                      desc: '設立直後から複数グループを立ち上げ、運営を推進。',
                    },
                    {
                      label: 'Location',
                      value: '大阪',
                      desc: '主な活動拠点は大阪。全国への展開を視野に運営。',
                    },
                    {
                      label: 'Experience',
                      value: '未経験歓迎',
                      desc: '現在のメンバーの多くが未経験からスタート。',
                    },
                    {
                      label: 'Vision',
                      value: '5-10年',
                      desc: '5年から10年続くグループづくりを視野に設計。',
                    },
                  ].map((s) => (
                    <div key={s.label} className="score">
                      <small>{s.label}</small>
                      <strong className="serif">{s.value}</strong>
                      <span>{s.desc}</span>
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
                <div className="section-label">Track Record</div>
                <h2 className="section-title title-reveal">
                  <span>
                    配信と映像で、
                    <br />
                    実績を示す。
                  </span>
                </h2>
                <p className="section-note">
                  あなたの歌声と姿は、ストリーミング、MV、カラオケ、街中のBGMまで届く。多くの人と出会えるステージが、ここにあります。
                </p>
              </div>

              <div className="platform-grid">
                <article className="platform-panel">
                  <h3>主要プラットフォームで展開</h3>
                  <p>
                    Apple Music、Spotify、TikTok、YouTube
                    など、新たなファンと出会う場所へ、確実に楽曲を届ける。約50曲を各種ストリーミングサイトで配信し、オンラインでも熱量が伝わる導線を重ねています。
                  </p>
                  <div className="platform-logos">
                    {[
                      {
                        src: '/audition/assets/apple-music.svg',
                        name: 'Apple Music',
                        desc: '音源接点の強い定番プラットフォーム',
                      },
                      {
                        src: '/audition/assets/spotify.svg',
                        name: 'Spotify',
                        desc: '新規リスナー獲得に強いストリーミング導線',
                      },
                      {
                        src: '/audition/assets/tiktok.svg',
                        name: 'TikTok',
                        desc: '拡散と発見を生みやすい短尺動画接点',
                      },
                      {
                        src: '/audition/assets/youtube.svg',
                        name: 'YouTube',
                        desc: 'MVとライブ映像で世界観を伝える基盤',
                      },
                    ].map((p) => (
                      <div key={p.name} className="logo-chip reveal magnetic" data-reveal="zoom">
                        <div className="logo-icon">
                          <img src={p.src} alt={p.name} />
                        </div>
                        <div className="logo-body">
                          <strong>{p.name}</strong>
                          <span>{p.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="dam-panel">
                  <div>
                    <h3>DAM配信など、実績の見え方も強い。</h3>
                    <p>
                      ただ音源を並べるのではなく、届き方そのものを設計する。カラオケ、放送、タイアップなど、応援の理由が増えていく実績形成にも投資しています。
                    </p>
                  </div>
                  <div className="dam-mark">
                    <img src="/audition/assets/dam.png" alt="DAM" />
                  </div>
                </article>
              </div>

              {/* Music Videos */}
              <div className="mv-section">
                <div className="mv-section-top section-top">
                  <div className="section-label">Music Videos</div>
                  <h3
                    className="section-title title-reveal"
                    style={{ fontSize: 'clamp(26px, 3.5vw, 42px)' }}
                  >
                    <span>
                      MVという証明が、
                      <br />
                      世界観の厚みになる。
                    </span>
                  </h3>
                  <p className="section-note">
                    歌だけじゃない、表情も世界観もすべてが作品になる。あなたの魅力を全方位から伝えるMVを、ここで残していけます。
                  </p>
                </div>
                <div className="mv-grid">
                  {MV_LIST.map((mv) => (
                    <article key={mv.id} className="mv-card reveal magnetic" data-reveal="zoom">
                      {playingVideos[mv.id] ? (
                        <iframe
                          className="mv-frame"
                          src={`https://www.youtube.com/embed/${mv.id}${mv.start ? `?start=${mv.start}&autoplay=1` : '?autoplay=1'}`}
                          title={mv.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          className="mv-poster"
                          type="button"
                          onClick={() => setPlayingVideos((prev) => ({ ...prev, [mv.id]: true }))}
                          style={
                            {
                              '--poster-image': `url('https://img.youtube.com/vi/${mv.id}/maxresdefault.jpg')`,
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
                        <div className="mv-kicker">{mv.kicker}</div>
                        <div className="mv-title">{mv.title}</div>
                        <p>{mv.desc}</p>
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
                <div className="section-label">Groups</div>
                <h2 className="section-title title-reveal">
                  <span>
                    すでに走っているグループがいる。
                    <br />
                    だから未来像が明確になる。
                  </span>
                </h2>
                <p className="section-note">
                  抽象的な「いつか」ではなく、どんな速度で、どこまで届くのか。既存グループの歩みそのものが、その答えになります。
                </p>
              </div>
              <div className="group-list">
                <article className="group-card magnetic reveal" data-reveal="left">
                  <div className="group-visual">
                    <div className="group-badge">Featured Group</div>
                    <div className="group-logo-wrap">
                      <div className="group-logo-panel">
                        <img src="/audition/assets/neoaster-logo.png" alt="Neo Aster logo" />
                      </div>
                    </div>
                  </div>
                  <div className="group-copy">
                    <div className="group-name">
                      <strong className="serif">Neo Aster</strong>
                      <span>ネオアスター</span>
                    </div>
                    <div className="group-meta">2024.04.21 debut / 4 members</div>
                    <p>
                      王道感と推進力を併せ持つグループ。ライブの説得力だけでなく、外部への波及も実績として示してきました。
                    </p>
                    <ul className="detail-list">
                      {[
                        '1stアルバムで週間オリコンチャート2位',
                        '毎日放送「かまいたちの知らんけど」EDテーマ',
                        '日本テレビ系「バズリズム02」出演',
                        'FamilyMart店内放送・ビジョンで楽曲展開',
                        '朝日放送テレビ「Music House」2026年1月度EDテーマ',
                      ].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>

                <article className="group-card magnetic reveal" data-reveal="right">
                  <div className="group-visual group-visual-lumi">
                    <div className="group-badge">Growing Fast</div>
                    <div className="group-logo-wrap">
                      <div className="group-logo-panel">
                        <img src="/audition/assets/lumi7s-logo.png" alt="Lumi7's logo" />
                      </div>
                    </div>
                  </div>
                  <div className="group-copy">
                    <div className="group-name">
                      <strong className="serif">Lumi7&apos;s</strong>
                      <span>ルミナス</span>
                    </div>
                    <div className="group-meta">2024.04.04 debut / 5 members</div>
                    <p>
                      立ち上がりの勢いそのままに、ライブ規模も注目度も拡大中。成長曲線が明快だからこそ、新メンバー募集にも説得力が宿ります。
                    </p>
                    <ul className="detail-list">
                      {[
                        '1周年単独ライブを Zepp Namba で開催し500名動員',
                        '2026年4月28日に なんばHatch 公演を予定',
                        '大阪拠点で急成長中の注目グループとして展開',
                        'ライブとSNSの両輪でファンコミュニティを拡張',
                      ].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Support */}
          <section id="support" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label">Support</div>
                <h2 className="section-title title-reveal">
                  <span>シンデレラのグループが人気の理由。</span>
                </h2>
                <p className="section-note">
                  活動への投資、活動に専念できる環境、運営の熱量。この三つが噛み合うことで、成長は偶然に左右されにくくなります。
                </p>
              </div>
              <div className="reasons">
                {[
                  {
                    no: '01 / Creative',
                    title: '活動への投資',
                    desc: '約2ヶ月に1回の新曲制作、有名作曲家への依頼、専属ダンス・ボイスレッスン、定期的な新衣装制作まで。伸び続けるために必要な投資を継続します。',
                    reveal: 'left',
                  },
                  {
                    no: '02 / Environment',
                    title: '活動に専念できる環境',
                    desc: 'イベント会場への送迎、撮影、編集、SNS更新サポートなど、表に出ない部分まで整え、活動に集中できる時間を増やします。',
                    reveal: 'zoom',
                  },
                  {
                    no: '03 / Management',
                    title: '運営の熱量',
                    desc: '主に30代前後の男性マネジメント陣が、公私を超えた関係性を大切にしながら支える。仕事に100%向き合い、活動を120%バックアップする体制です。',
                    reveal: 'right',
                  },
                ].map((r) => (
                  <article
                    key={r.no}
                    className="reason-card magnetic reveal"
                    data-reveal={r.reveal}
                  >
                    <div className="reason-no">{r.no}</div>
                    <h3>{r.title}</h3>
                    <p>{r.desc}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Flow */}
          <section id="flow" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label">Flow</div>
                <h2 className="section-title title-reveal">
                  <span>合格からデビューまでの流れ。</span>
                </h2>
                <p className="section-note">
                  合格後は、契約、準備、プレデビューを経て、約6ヶ月を目安にデビューを目指します。
                </p>
              </div>
              <div className="flow">
                {[
                  {
                    step: 'Step 01',
                    title: 'オーディション合格',
                    desc: '書類や面談など複数の審査を通じて、将来性と相性を丁寧に見ます。',
                  },
                  {
                    step: 'Step 02',
                    title: '契約と活動準備',
                    desc: '契約内容はオンラインでも確認可能。必要に応じて保護者の同席にも対応します。',
                  },
                  {
                    step: 'Step 03',
                    title: 'レッスン・撮影・SNS整備',
                    desc: '歌やダンスだけでなく、見せ方や発信も含めてプレデビューの準備を進めます。',
                  },
                  {
                    step: 'Step 04',
                    title: 'プレデビュー',
                    desc: '舞台に立つ前から、オンラインや撮影素材を通じて応援される入口をつくります。',
                  },
                  {
                    step: 'Step 05',
                    title: '正式デビュー',
                    desc: 'お客様の前でデビューライブを実施。その後は月10〜15回ほどのイベント出演を想定しています。',
                  },
                ].map((s) => (
                  <article key={s.step} className="flow-step">
                    <div className="step-index">{s.step}</div>
                    <div className="step-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
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
                <div className="section-label">Requirements</div>
                <h2 className="section-title title-reveal">
                  <span>弊社で求めるアイドルの人物像</span>
                </h2>
                <p className="section-note">
                  経験よりも、まっすぐな気持ちと素直さ。ファンを大切にできる人と、長く一緒に走っていきたい。
                </p>
              </div>
              <div className="requirements-section">
                {[
                  {
                    title: '合格基準',
                    desc: '「アイドル活動未経験」でも一切問題ありません。現在のメンバー8割は未経験です。',
                  },
                  {
                    title: '人物像',
                    desc: '「素直でいいやつ」です。素直なやつは「成長」し、いいやつは「周りから応援される」人です。私たちは、グループとしての活動と、ファンを喜ばせることを最優先します。',
                  },
                  {
                    title: 'アイドルとして',
                    desc: 'メンズアイドルの価値の最も重要なものは「今日来てくれたファンを幸せにできるか」です。「稼ぎたいから」アイドルをやる人は弊社には不要です。',
                  },
                  {
                    title: '長く常に成長',
                    desc: 'メンズアイドルグループの平均年数は1.5年と言われています。弊社では今後5年〜10年活動できるようなグループを作ることをビジョンとしておりますので、短期目線でやりたい方は合わないかもしれないです。',
                  },
                  {
                    title: '他者を尊重',
                    desc: '応援してくれるファンの皆様、サポートしてくれるスタッフ、イベント会場の設営の方、最も近くにいる味方の家族。それぞれの方々に対して、リスペクトと感謝が必要です。',
                  },
                ].map((r) => (
                  <div key={r.title} className="requirement-item">
                    <strong>{r.title}</strong>
                    <p>{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Conditions */}
          <section className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label">Conditions</div>
                <h2 className="section-title title-reveal">
                  <span>
                    合格後の条件と、
                    <br />
                    活動イメージについて。
                  </span>
                </h2>
                <p className="section-note">
                  寮も送迎も会社が支える。アイドルとしての活動に、安心して全力を注げる環境を用意しています。
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
                    <tr>
                      <td>寮</td>
                      <td>100%会社負担</td>
                      <td>100%会社負担</td>
                      <td>{'寮から卒業し、\n一人暮らしするメンバーもいます'}</td>
                    </tr>
                    <tr>
                      <td>送迎</td>
                      <td>レッスン場所までは自身で通勤</td>
                      <td>イベント時は完全送迎</td>
                      <td>イベント時は完全送迎</td>
                    </tr>
                    <tr>
                      <td>休日</td>
                      <td>
                        {
                          '不定期となります。\nおおよそ月に16日程度活動日ですが、\n活動日以外にTikTokライブや、個人練習をするメンバーも多いです。'
                        }
                      </td>
                      <td>
                        <span className="ditto-desktop">同左</span>
                        <span className="ditto-mobile">同上</span>
                      </td>
                      <td>
                        <span className="ditto-desktop">同左</span>
                        <span className="ditto-mobile">同上</span>
                      </td>
                    </tr>
                    <tr>
                      <td>確定申告</td>
                      <td>{'弊社で税理士ご紹介可能です。\n所属メンバーの8割が利用しています。'}</td>
                      <td>
                        <span className="ditto-desktop">同左</span>
                        <span className="ditto-mobile">同上</span>
                      </td>
                      <td>
                        <span className="ditto-desktop">同左</span>
                        <span className="ditto-mobile">同上</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="section">
            <div className="container">
              <div className="section-top">
                <div className="section-label">FAQ</div>
                <h2 className="section-title title-reveal">
                  <span>よくある質問</span>
                </h2>
                <p className="section-note">
                  応募前に気になる、契約・費用・デビュー・生活のこと。あなたの不安に、ひとつずつお答えします。
                </p>
              </div>
              <div className="faq-grid">
                {[
                  {
                    q: 'Q. 「契約期間3年」ですが、契約期間満了後が不安です。',
                    a: '契約期間は3年ですが、もちろん更新をしてアイドル活動を続けることは可能です。また「アイドル活動」から卒業した過去の卒業生の中には弊社が支援して、「自身のプロデュースしたグループのマネジメント」や「メンズコンカフェ」をオープンした方もいます。セカンドキャリアも支援可能です！',
                  },
                  {
                    q: 'Q. 合格後、レッスン費用などの「自己負担」となる費用はありますか？',
                    a: '基本的な自己負担は一切ございません。レッスン会場、打ち合わせのために事務所までの交通費は自己負担となりますが、東京への移動費などは会社負担となりますのでご安心ください。',
                  },
                  {
                    q: 'Q. 他のプロダクションでは合格したけどデビューできないこともよく聞きます。',
                    a: '弊社は、まだ小さなプロダクションです。そのため、練習生を集めることはなく、全員デビューすることを前提で合格通知を出させていただいております。過去のデビューまでの割合は100%です。',
                  },
                  {
                    q: 'Q. 初めて親元を離れる生活が不安です。',
                    a: 'これからデビューの皆さんは20歳前後の方が多いです。そのため、弊社のメンバーはほとんどが初めて親元を離れた生活を送っています。生活の仕方や大阪での遊び方なども含めて皆さんに指導し、趣味を見つけることや行ってはいけない場所も含めてマネジメントいたします。',
                  },
                ].map((faq) => (
                  <article key={faq.q} className="faq-item">
                    <div className="faq-question">{faq.q}</div>
                    <div className="faq-answer">{faq.a}</div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* CTA / Entry */}
          <section id="entry" className="cta section">
            <div className="container">
              <div className="cta-wrap parallax magnetic" data-speed="0.08">
                <div className="cta-label">Entry</div>
                <h2 className="cta-title serif title-reveal">
                  <span>
                    夢を現実へ変える一歩を、
                    <br />
                    ここから。
                  </span>
                </h2>
                <p>
                  未経験でも構いません。必要なのは、行動し続ける意志。Cinderella entertainment
                  とともに、夢を現実へ変えていく最初の一歩を踏み出してください。
                </p>
                <div className="cta-actions">
                  <a href="https://forms.gle/" className="pill pill-solid">
                    エントリーフォームへ
                  </a>
                  <a href="#tracks" className="pill pill-outline">
                    実績をもう一度見る
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
