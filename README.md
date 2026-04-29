# Next.js + Payload CMS テンプレート

コーポレートサイト / LP 向けの再利用テンプレート。

## 技術スタック

| カテゴリ       | 技術                        |
| -------------- | --------------------------- |
| フレームワーク | Next.js 15 (App Router)     |
| CMS            | Payload CMS 3.x             |
| DB             | PostgreSQL 16 (Drizzle ORM) |
| UI             | shadcn/ui + Tailwind CSS v4 |
| monorepo       | Turborepo + pnpm            |

## 構成

```
apps/web/          Next.js + Payload 統合アプリ
packages/ui/       共通UIコンポーネント (shadcn/ui)
packages/tailwind-config/  共有テーマ (Tailwind v4)
```

### CMS コレクション

| コレクション | 用途                                           |
| ------------ | ---------------------------------------------- |
| Users        | 管理者・編集者 (認証付き)                      |
| Pages        | 固定ページ (Hero/Content/CTA ブロックビルダー) |
| Posts        | ブログ記事                                     |
| Media        | 画像管理 (thumbnail/card/tablet 自動リサイズ)  |

### グローバル

- **SiteSettings** — サイト名・説明・ロゴ・OGPデフォルト画像
- **Navigation** — ヘッダー/フッターメニュー (サブメニュー対応)

### 機能

- SEO プラグイン (Pages/Posts にメタデータ自動付与)
- Google Tag Manager (環境変数で条件付き有効化)
- sitemap.xml / robots.txt 動的生成
- Vercel Blob Storage (本番メディア保存、環境変数で条件付き有効化)
- Live Preview (Pages)

## セットアップ

### 前提条件

- Node.js 20+
- pnpm 10+
- Docker (PostgreSQL 用)

### 1. リポジトリ作成

このリポジトリは GitHub Template として公開されている。新規プロジェクトは以下のいずれかで作成する。

**GitHub UI から**

1. リポジトリページ上部の **Use this template → Create a new repository** をクリック
2. 新リポジトリ名を入力 → Create

**GitHub CLI から**

```bash
gh repo create <org>/<new-project> \
  --template Viluck-Work/next-payload-template \
  --private --clone

cd <new-project>
```

作成後、`package.json` の `name` フィールド等、テンプレート固有の名前を新プロジェクト名に置き換える。

### 2. 依存関係インストール

```bash
pnpm install
```

### 3. 環境変数設定

```bash
cp .env.example .env
```

`.env` を編集:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=ランダムな文字列に変更する
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_GTM_ID=                 # GTM-XXXXXXX (任意)
BLOB_READ_WRITE_TOKEN=              # Vercel Blob トークン (本番のみ)
```

`PAYLOAD_SECRET` は必ず変更すること:

```bash
openssl rand -base64 32
```

### 4. PostgreSQL 起動

```bash
docker compose up -d
```

### 5. 開発サーバー起動

```bash
pnpm dev
```

初回起動時に Payload が自動でDBテーブルを作成する。`next-env.d.ts` もこのタイミングで自動生成される（`pnpm type-check` を先に走らせたい場合は `pnpm build` を一度実行すること）。

- フロントエンド: http://localhost:3000
- 管理画面: http://localhost:3000/admin

初回アクセス時に管理者アカウントを作成する画面が表示される。その後、管理画面で以下を設定する:

1. **Globals → SiteSettings**: サイト名・説明・OGPデフォルト画像
2. **Globals → Navigation**: ヘッダー/フッターメニュー
3. **Collections → Pages**: slug `home` のページを作成（トップページになる）

### 6. 型生成 (任意)

CMS のコレクション定義を変更した場合:

```bash
cd apps/web
pnpm generate:types
```

### トラブルシューティング

- **DBを初期化したい**: `docker compose down -v && docker compose up -d` でボリュームごと削除
- **ポート 3000 / 5432 が使用中**: 既存プロセス停止または `docker-compose.yml` / `next dev -p` で別ポート指定
- **`PAYLOAD_SECRET is required` エラー**: `.env` を作成・編集し、`openssl rand -base64 32` で生成した値を設定

## コマンド一覧

| コマンド            | 内容                      |
| ------------------- | ------------------------- |
| `pnpm dev`          | 開発サーバー起動          |
| `pnpm build`        | 本番ビルド                |
| `pnpm lint`         | ESLint 実行               |
| `pnpm type-check`   | TypeScript 型チェック     |
| `pnpm format`       | Prettier で全ファイル整形 |
| `pnpm format:check` | フォーマットチェック      |

## カスタマイズ

### テーマカラー変更

`packages/tailwind-config/theme.css` を編集:

```css
@theme {
  --color-primary: #1a1a2e;
  --color-highlight: #e94560;
  /* ... */
}
```

### ブロック追加

1. `apps/web/src/payload/blocks/` に新ブロック定義を作成
2. `apps/web/src/payload/collections/pages.ts` の `blocks` 配列に追加
3. `apps/web/src/components/blocks/` にレンダラーコンポーネントを作成
4. `apps/web/src/components/blocks/index.tsx` の switch に追加
5. `pnpm generate:types` で型を再生成

### コレクション追加

1. `apps/web/src/payload/collections/` に定義ファイル作成
2. `apps/web/payload.config.ts` の `collections` 配列に追加
3. `pnpm generate:types` で型を再生成

## デプロイ (Vercel)

1. Vercel にプロジェクトをインポート
2. Root Directory を `apps/web` に設定
3. 環境変数を設定:
   - `DATABASE_URL` — PostgreSQL 接続文字列 (Neon / Supabase 等)
   - `PAYLOAD_SECRET` — 本番用シークレット
   - `NEXT_PUBLIC_SERVER_URL` — 本番URL (例: `https://example.com`)
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob のトークン
   - `NEXT_PUBLIC_GTM_ID` — GTM コンテナID (任意)

## Git 規約

- コミットメッセージ: `type: emoji タイトル`
  - `feat: ✨` / `fix: 🐛` / `refactor: ♻️` / `chore: 🔧` / `docs: 📝`
- commitlint + husky で自動検証
- lint-staged で commit 時に自動フォーマット
