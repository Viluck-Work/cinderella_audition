#!/usr/bin/env node
// Spawn a localtunnel that exposes the local dev server (default: http://localhost:3000)
// and print a demo URL for /audition. Pass --port=NNNN to override the port,
// or --path=/some/path to override the path appended to the public URL.

import { spawn } from 'node:child_process'

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v = 'true'] = a.replace(/^--/, '').split('=')
      return [k, v]
    }),
)

const port = String(args.port || process.env.PORT || 3000)
const path = String(args.path || '/audition')
const subdomain = args.subdomain ? ['--subdomain', String(args.subdomain)] : []

console.log(`\n[share-preview] localhost:${port}${path} を公開します...`)
console.log('[share-preview] localtunnel を起動中（初回はパッケージ取得に少し時間がかかります）')

const child = spawn(
  'pnpm',
  ['dlx', 'localtunnel', '--port', port, ...subdomain, '--print-requests'],
  {
    stdio: ['inherit', 'pipe', 'inherit'],
    env: process.env,
  },
)

let printed = false
child.stdout.on('data', (chunk) => {
  const out = chunk.toString()
  process.stdout.write(out)
  const match = out.match(/your url is:\s*(https?:\/\/[\S]+)/i)
  if (match && !printed) {
    printed = true
    const base = match[1].trim().replace(/\/+$/, '')
    const demo = `${base}${path}`
    console.log('\n========================================')
    console.log(' クライアント共有用 デモ URL')
    console.log(`   ${demo}`)
    console.log('========================================')
    console.log(' ※ このプロセスを終了すると URL は失効します')
    console.log(
      ' ※ 初回アクセス時 localtunnel の説明ページが表示されることがあります（[Click to Continue] を押すと閲覧可能）',
    )
    console.log('')
  }
})

child.on('exit', (code) => process.exit(code ?? 0))

const cleanup = () => {
  if (!child.killed) child.kill('SIGINT')
}
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
