import { NextResponse } from 'next/server'

type TunnelHandle = {
  url: string
  close: () => Promise<void> | void
}

type GlobalWithTunnel = typeof globalThis & {
  __auditionTunnel?: TunnelHandle | null
  __auditionTunnelPending?: Promise<TunnelHandle> | null
}

const g = globalThis as GlobalWithTunnel

const PORT = Number(process.env.PORT || 3000)

async function startTunnel(): Promise<TunnelHandle> {
  // Dynamic import so this code only runs at request time, not at build.
  type LocaltunnelFn = (opts: { port: number }) => Promise<{
    url: string
    close: () => void
    on: (event: string, listener: (...args: unknown[]) => void) => void
  }>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- localtunnel ships no types
  const mod = (await import('localtunnel').catch(() => null)) as { default: LocaltunnelFn } | null
  if (!mod) {
    throw new Error(
      'localtunnel モジュールが見つかりません。`pnpm --filter web add localtunnel` を実行してください。',
    )
  }
  const localtunnel = mod.default
  const tunnel = await localtunnel({ port: PORT })
  return {
    url: tunnel.url,
    close: () => tunnel.close(),
  }
}

export async function POST() {
  if (g.__auditionTunnel) {
    return NextResponse.json({ url: g.__auditionTunnel.url })
  }
  if (g.__auditionTunnelPending) {
    const t = await g.__auditionTunnelPending
    return NextResponse.json({ url: t.url })
  }
  try {
    g.__auditionTunnelPending = startTunnel()
    const handle = await g.__auditionTunnelPending
    g.__auditionTunnel = handle
    g.__auditionTunnelPending = null
    return NextResponse.json({ url: handle.url })
  } catch (err) {
    g.__auditionTunnelPending = null
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  if (g.__auditionTunnel) {
    try {
      await g.__auditionTunnel.close()
    } catch {
      /* ignore */
    }
    g.__auditionTunnel = null
  }
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ url: g.__auditionTunnel?.url ?? null })
}
