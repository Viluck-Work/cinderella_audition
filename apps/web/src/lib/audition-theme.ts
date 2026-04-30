/**
 * Audition LP のカラーテーマトークン。
 *
 * 1 箇所にまとめて、背景ベースカラーから派生する各サーフェイス色を返す。
 * AuditionClient はこの戻り値を CSS 変数として root に流し、CSS 側は
 * 全カードを var(--card-*) 経由で塗る。
 */

export type ThemeTokens = Record<string, string>

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)))

const hexToRgb = (hex: string): [number, number, number] => {
  const m = hex.trim().replace(/^#/, '')
  const full =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if ([r, g, b].some(Number.isNaN)) return [5, 5, 5]
  return [r, g, b]
}

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`

// 0..1 の輝度（簡易・カードの濃淡判定にしか使わない）
const luminance = ([r, g, b]: [number, number, number]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255

// 色を黒に向けて pct (0..1) の割合で寄せる。
// 鮮やかな色でも確実にトーンを下げられる。
const mixWithBlack = (
  [r, g, b]: [number, number, number],
  pct: number,
): [number, number, number] => {
  const m = 1 - pct
  return [r * m, g * m, b * m]
}

const rgba = (rgb: [number, number, number], a: number) =>
  `rgba(${clamp(rgb[0])}, ${clamp(rgb[1])}, ${clamp(rgb[2])}, ${a})`

export function buildThemeVars(bg: string, primary: string, accent: string): ThemeTokens {
  const rgb = hexToRgb(bg)
  const isDark = luminance(rgb) < 0.5
  // 視認性: 背景が暗ければ明るいテキスト、明るければ暗いテキスト
  const text = isDark ? '#f6f3ee' : '#0a0a0c'
  const muted = isDark ? 'rgba(246, 243, 238, 0.7)' : 'rgba(10, 10, 12, 0.7)'
  const soft = isDark ? 'rgba(246, 243, 238, 0.48)' : 'rgba(10, 10, 12, 0.48)'
  const line = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  // カードは「常に黒に寄せて」沈ませる。
  // 鮮やかな色（青や赤など彩度が高く RGB のレンジが狭い色）でも
  // 確実にコントラストが出る。
  const cardSoft = mixWithBlack(rgb, 0.18) // 控えめ
  const cardBase = mixWithBlack(rgb, 0.32) // 通常カード
  const cardStrong = mixWithBlack(rgb, 0.5) // 強調（Flow ステップ等）
  const cardDeep = mixWithBlack(rgb, 0.66) // 最深（Conditions ヘッダ）
  const cardTransparent = mixWithBlack(rgb, 0.4) // 半透明背景
  const cardTransparentStrong = mixWithBlack(rgb, 0.55)

  return {
    '--bg': bg,
    '--gold': primary,
    '--accent': accent,
    '--accent-soft': rgba(hexToRgb(accent), 0.18),
    '--text': text,
    '--muted': muted,
    '--soft': soft,
    '--line': line,
    // 通常カード（Platform / Score / Group / Reason / Logo chip 等）
    '--card': rgbToHex(...cardBase),
    // 控えめカード
    '--card-soft': rgbToHex(...cardSoft),
    // 強調カード（Flow ステップ、Conditions 行、モバイルナビ）
    '--card-strong': rgbToHex(...cardStrong),
    // 最深カード（Conditions ヘッダ）
    '--card-deep': rgbToHex(...cardDeep),
    // backdrop-blur 前提の半透明（FV ステータスカード）
    '--card-translucent': rgba(cardTransparent, 0.6),
    // 半透明・ヘッダー / モバイルナビ
    '--card-translucent-strong': rgba(cardTransparentStrong, 0.76),
  }
}
