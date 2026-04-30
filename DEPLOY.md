# 本番デプロイ手順 (Vercel + Supabase)

最初の公開デモを Vercel + Supabase で立ち上げる手順です。所要時間: 30〜45分。

## 1. Supabase でデータベースを作る

1. https://supabase.com/ にサインアップ → New project
2. Project name: `autosite-prod` (任意)
3. Region: Tokyo（`ap-northeast-1`）推奨
4. Database password を控える（パスワードマネージャ推奨）
5. プロジェクト作成完了後、左メニュー **Project Settings → Database**
6. **Connection string** タブで「**Transaction pooler**」のURLをコピー
   ```
   postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
   ```

   - `[YOUR-PASSWORD]` をコピペ後、実パスワードに置換
   - Payload は long-running connection を多用するので **Session pooler (port 5432)** より **Transaction pooler (port 6543)** が無難

## 2. Vercel Blob で画像ストレージを作る（任意・推奨）

画像 (Media collection) は Vercel Blob に置くと運用が楽です。

1. https://vercel.com/ にサインアップ → 任意のチームを選択
2. ダッシュボード → **Storage** → **Create Blob Store**
3. ストア作成後 → 「**.env.local**」タブから **`BLOB_READ_WRITE_TOKEN`** をコピー

スキップする場合は画像はリポジトリ内 `apps/web/public/` の静的ファイルのみで運用可能。

## 3. Vercel プロジェクトを作る

1. このリポジトリを GitHub にプッシュ済みであることを確認
2. Vercel ダッシュボード → **Add New → Project**
3. リポジトリ `cinderella_audition` を Import
4. **Root Directory**: そのまま（ルート）。`vercel.json` で `apps/web` をビルドする設定済み
5. **Framework Preset**: Next.js（自動検出）
6. **Build Command / Output**: `vercel.json` の設定が使われるため触らない
7. **Environment Variables** に以下を入力:

| Name                     | Value                             | 備考                             |
| ------------------------ | --------------------------------- | -------------------------------- |
| `DATABASE_URL`           | Supabase の接続文字列             | 1. でコピーしたもの              |
| `PAYLOAD_SECRET`         | 32文字以上のランダム文字列        | `openssl rand -base64 32` で生成 |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-project.vercel.app` | デプロイ後の URL に後で更新可    |
| `BLOB_READ_WRITE_TOKEN`  | Vercel Blob のトークン            | 任意（2. をスキップ時は省略）    |
| `NEXT_PUBLIC_GTM_ID`     | GTM コンテナID（任意）            | 計測しない場合は空欄             |

8. **Deploy** クリック

初回ビルドで Payload が DB スキーマを自動マイグレーションします。

## 4. 初回ログインユーザー作成

1. デプロイ完了後、`https://your-project.vercel.app/admin` を開く
2. 初回アクセス時のみ「Create First User」フォームが出るので、メール・パスワード設定
3. ログイン後、左メニュー **コンテンツ → オーディションLP** から編集

## 5. NEXT_PUBLIC_SERVER_URL の更新

初回デプロイ完了後、Vercel が割り当てた実 URL に環境変数を更新します。

1. Vercel プロジェクト → **Settings → Environment Variables**
2. `NEXT_PUBLIC_SERVER_URL` の値を実際のドメインに変更（`https://autosite-prod.vercel.app` 等）
3. **Deployments → 最新の Deploy → Redeploy**

これで管理画面の「公開ページURL」表示が正しいドメインを返すようになります。

## 6. (任意) カスタムドメイン

1. Vercel プロジェクト → **Settings → Domains**
2. ドメインを追加 → DNS レコードを表示通りに設定
3. SSL 証明書は自動発行
4. 設定完了後、`NEXT_PUBLIC_SERVER_URL` をカスタムドメインに更新 → Redeploy

## トラブルシューティング

- **`PAYLOAD_SECRET environment variable is required`** → 環境変数が反映されていない。Settings から確認、再デプロイ
- **DB 接続エラー** → Supabase の Connection string がパスワード未置換、またはポートが 5432 になっている。**6543 (Transaction pooler)** を使う
- **Live Preview の iframe が表示されない** → `NEXT_PUBLIC_SERVER_URL` が正しい本番 URL になっているか確認
- **画像 upload が失敗** → `BLOB_READ_WRITE_TOKEN` 未設定。Storage を作成して環境変数追加 → Redeploy

## ローカル開発との差分

| 項目     | ローカル                | 本番                  |
| -------- | ----------------------- | --------------------- |
| DB       | Docker の Postgres      | Supabase              |
| 画像     | `apps/web/public/` 静的 | Vercel Blob           |
| URL      | `http://localhost:3000` | `https://your-domain` |
| 環境変数 | `apps/web/.env`         | Vercel 環境変数       |
