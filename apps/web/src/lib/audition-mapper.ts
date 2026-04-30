import { AUDITION_DEFAULTS, type AuditionData } from './audition-defaults'

type MediaRef = number | { url?: string | null } | null | undefined

const resolveMedia = (ref: MediaRef, fallback: string): string => {
  if (!ref || typeof ref === 'number') return fallback
  return ref.url || fallback
}

const pick = <T>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || value === '' ? fallback : value

const mapArray = <S, T>(
  source: S[] | null | undefined,
  fallback: T[],
  map: (item: S, index: number) => T,
): T[] => {
  if (!source || source.length === 0) return fallback
  return source.map(map)
}

type RawAudition = {
  theme?: Partial<AuditionData['theme']>
  media?: { heroImage?: MediaRef; featureImage?: MediaRef; lumiBackgroundImage?: MediaRef }
  hero?: Partial<AuditionData['hero']> & { stats?: AuditionData['hero']['stats'] }
  about?: Partial<Omit<AuditionData['about'], 'paragraphs'>> & {
    paragraphs?: { text?: string }[]
    scoreboard?: AuditionData['about']['scoreboard']
  }
  tracks?: Partial<AuditionData['tracks']> & {
    platforms?: AuditionData['tracks']['platforms']
    mvs?: AuditionData['tracks']['mvs']
  }
  groups?: Partial<Omit<AuditionData['groups'], 'items'>> & {
    items?: (Omit<AuditionData['groups']['items'][number], 'highlights'> & {
      highlights?: { text?: string }[]
    })[]
  }
  support?: Partial<Omit<AuditionData['support'], 'reasons'>> & {
    reasons?: AuditionData['support']['reasons']
  }
  flow?: Partial<Omit<AuditionData['flow'], 'steps'>> & { steps?: AuditionData['flow']['steps'] }
  requirements?: Partial<Omit<AuditionData['requirements'], 'items'>> & {
    items?: AuditionData['requirements']['items']
  }
  conditions?: Partial<Omit<AuditionData['conditions'], 'rows'>> & {
    rows?: AuditionData['conditions']['rows']
  }
  faq?: Partial<Omit<AuditionData['faq'], 'items'>> & { items?: AuditionData['faq']['items'] }
  cta?: Partial<AuditionData['cta']>
}

export function mapAuditionData(raw: unknown): AuditionData {
  if (!raw) return AUDITION_DEFAULTS
  const r = raw as RawAudition
  const D = AUDITION_DEFAULTS

  return {
    theme: {
      primaryColor: pick(r.theme?.primaryColor, D.theme.primaryColor),
      accentColor: pick(r.theme?.accentColor, D.theme.accentColor),
    },
    media: {
      heroImage: resolveMedia(r.media?.heroImage, D.media.heroImage),
      featureImage: resolveMedia(r.media?.featureImage, D.media.featureImage),
      lumiBackgroundImage: resolveMedia(r.media?.lumiBackgroundImage, D.media.lumiBackgroundImage),
    },
    hero: {
      eyebrow: pick(r.hero?.eyebrow, D.hero.eyebrow),
      audition: pick(r.hero?.audition, D.hero.audition),
      titleLine1Prefix: pick(r.hero?.titleLine1Prefix, D.hero.titleLine1Prefix),
      titleHighlight: pick(r.hero?.titleHighlight, D.hero.titleHighlight),
      titleLine1Suffix: pick(r.hero?.titleLine1Suffix, D.hero.titleLine1Suffix),
      titleLine2: pick(r.hero?.titleLine2, D.hero.titleLine2),
      lead: pick(r.hero?.lead, D.hero.lead),
      stats: mapArray(r.hero?.stats, D.hero.stats, (s) => ({
        label: s.label,
        value: s.value,
        sub: s.sub,
      })),
      primaryHref: pick(r.hero?.primaryHref, D.hero.primaryHref),
      primaryLabel: pick(r.hero?.primaryLabel, D.hero.primaryLabel),
      secondaryHref: pick(r.hero?.secondaryHref, D.hero.secondaryHref),
      secondaryLabel: pick(r.hero?.secondaryLabel, D.hero.secondaryLabel),
    },
    about: {
      label: pick(r.about?.label, D.about.label),
      titleLine1: pick(r.about?.titleLine1, D.about.titleLine1),
      titleLine2: pick(r.about?.titleLine2, D.about.titleLine2),
      note: pick(r.about?.note, D.about.note),
      paragraphs: mapArray(r.about?.paragraphs, D.about.paragraphs, (p) => p.text ?? '').filter(
        Boolean,
      ),
      scoreboard: mapArray(r.about?.scoreboard, D.about.scoreboard, (s) => ({
        label: s.label,
        value: s.value,
        desc: s.desc,
      })),
    },
    tracks: {
      label: pick(r.tracks?.label, D.tracks.label),
      titleLine1: pick(r.tracks?.titleLine1, D.tracks.titleLine1),
      titleLine2: pick(r.tracks?.titleLine2, D.tracks.titleLine2),
      note: pick(r.tracks?.note, D.tracks.note),
      platformPanelTitle: pick(r.tracks?.platformPanelTitle, D.tracks.platformPanelTitle),
      platformPanelDesc: pick(r.tracks?.platformPanelDesc, D.tracks.platformPanelDesc),
      platforms: mapArray(r.tracks?.platforms, D.tracks.platforms, (p) => ({
        iconPath: p.iconPath,
        name: p.name,
        desc: p.desc,
      })),
      damPanelTitle: pick(r.tracks?.damPanelTitle, D.tracks.damPanelTitle),
      damPanelDesc: pick(r.tracks?.damPanelDesc, D.tracks.damPanelDesc),
      mvSectionLabel: pick(r.tracks?.mvSectionLabel, D.tracks.mvSectionLabel),
      mvSectionTitleLine1: pick(r.tracks?.mvSectionTitleLine1, D.tracks.mvSectionTitleLine1),
      mvSectionTitleLine2: pick(r.tracks?.mvSectionTitleLine2, D.tracks.mvSectionTitleLine2),
      mvSectionNote: pick(r.tracks?.mvSectionNote, D.tracks.mvSectionNote),
      mvs: mapArray(r.tracks?.mvs, D.tracks.mvs, (m) => ({
        youtubeId: m.youtubeId,
        startSeconds: m.startSeconds,
        kicker: m.kicker,
        title: m.title,
        desc: m.desc,
        href: m.href,
      })),
    },
    groups: {
      label: pick(r.groups?.label, D.groups.label),
      titleLine1: pick(r.groups?.titleLine1, D.groups.titleLine1),
      titleLine2: pick(r.groups?.titleLine2, D.groups.titleLine2),
      note: pick(r.groups?.note, D.groups.note),
      items: mapArray(r.groups?.items, D.groups.items, (g) => ({
        badge: g.badge,
        name: g.name,
        nameKana: g.nameKana,
        meta: g.meta,
        desc: g.desc,
        highlights: (g.highlights ?? [])
          .map((h: { text?: string }) => h.text ?? '')
          .filter(Boolean),
        logoPath: g.logoPath,
        logoAlt: g.logoAlt,
        visualVariant: g.visualVariant,
        reveal: g.reveal,
      })),
    },
    support: {
      label: pick(r.support?.label, D.support.label),
      title: pick(r.support?.title, D.support.title),
      note: pick(r.support?.note, D.support.note),
      reasons: mapArray(r.support?.reasons, D.support.reasons, (s) => ({
        no: s.no,
        title: s.title,
        desc: s.desc,
        reveal: s.reveal,
      })),
    },
    flow: {
      label: pick(r.flow?.label, D.flow.label),
      title: pick(r.flow?.title, D.flow.title),
      note: pick(r.flow?.note, D.flow.note),
      steps: mapArray(r.flow?.steps, D.flow.steps, (s) => ({
        step: s.step,
        title: s.title,
        desc: s.desc,
      })),
    },
    requirements: {
      label: pick(r.requirements?.label, D.requirements.label),
      title: pick(r.requirements?.title, D.requirements.title),
      note: pick(r.requirements?.note, D.requirements.note),
      items: mapArray(r.requirements?.items, D.requirements.items, (i) => ({
        title: i.title,
        desc: i.desc,
      })),
    },
    conditions: {
      label: pick(r.conditions?.label, D.conditions.label),
      titleLine1: pick(r.conditions?.titleLine1, D.conditions.titleLine1),
      titleLine2: pick(r.conditions?.titleLine2, D.conditions.titleLine2),
      note: pick(r.conditions?.note, D.conditions.note),
      rows: mapArray(r.conditions?.rows, D.conditions.rows, (row) => ({
        category: row.category,
        beforeDebut: row.beforeDebut,
        afterDebut: row.afterDebut,
        oneYear: row.oneYear,
      })),
    },
    faq: {
      label: pick(r.faq?.label, D.faq.label),
      title: pick(r.faq?.title, D.faq.title),
      note: pick(r.faq?.note, D.faq.note),
      items: mapArray(r.faq?.items, D.faq.items, (i) => ({
        question: i.question,
        answer: i.answer,
      })),
    },
    cta: {
      label: pick(r.cta?.label, D.cta.label),
      titleLine1: pick(r.cta?.titleLine1, D.cta.titleLine1),
      titleLine2: pick(r.cta?.titleLine2, D.cta.titleLine2),
      desc: pick(r.cta?.desc, D.cta.desc),
      primaryHref: pick(r.cta?.primaryHref, D.cta.primaryHref),
      primaryLabel: pick(r.cta?.primaryLabel, D.cta.primaryLabel),
      secondaryHref: pick(r.cta?.secondaryHref, D.cta.secondaryHref),
      secondaryLabel: pick(r.cta?.secondaryLabel, D.cta.secondaryLabel),
    },
  }
}
