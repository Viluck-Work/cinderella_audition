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

const shift = ([r, g, b]: [number, number, number], amt: number): [number, number, number] => [
  r + amt,
  g + amt,
  b + amt,
]

const rgba = (rgb: [number, number, number], a: number) =>
  `rgba(${clamp(rgb[0])}, ${clamp(rgb[1])}, ${clamp(rgb[2])}, ${a})`

export function buildThemeVars(bg: string, primary: string, accent: string): ThemeTokens {
  const rgb = hexToRgb(bg)
  const isDark = luminance(rgb) < 0.5
  // カードは常に背景より「沈む」方向に色をずらす:
  //   暗い背景 → カードはさらに黒寄り（マイナス方向）
  //   明るい背景 → カードはさらに白寄り（プラス方向）
  const dir = isDark ? -1 : 1
  const text = isDark ? '#f6f3ee' : '#0a0a0c'
  const muted = isDark ? 'rgba(246, 243, 238, 0.7)' : 'rgba(10, 10, 12, 0.7)'
  const soft = isDark ? 'rgba(246, 243, 238, 0.48)' : 'rgba(10, 10, 12, 0.48)'
  const line = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

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
    '--card': rgbToHex(...shift(rgb, 8 * dir)),
    // 控えめカード
    '--card-soft': rgbToHex(...shift(rgb, 5 * dir)),
    // 強調カード（Flow ステップ、Conditions 行、モバイルナビ）
    '--card-strong': rgbToHex(...shift(rgb, 13 * dir)),
    // 最深カード（Conditions ヘッダ）
    '--card-deep': rgbToHex(...shift(rgb, 18 * dir)),
    // backdrop-blur 前提の半透明（FV ステータスカード）
    '--card-translucent': rgba(shift(rgb, 5 * dir), 0.6),
    // 半透明・ヘッダー / モバイルナビ
    '--card-translucent-strong': rgba(shift(rgb, 8 * dir), 0.76),
  }
}
