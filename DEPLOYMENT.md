# 🚀 Firebase Word Card App - デプロイメントガイド

## 📋 デプロイメント概要

このプロジェクトは**GitHub Actions**を使用して**Firebase Hosting**へ自動デプロイされます。

**デプロイ先URL**: [https://meku-run.web.app](https://meku-run.web.app)

## 🔧 GitHub Secrets 設定

デプロイを実行するために、以下のGitHub Secretsを設定する必要があります：

### 必須Secrets

| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `FIREBASE_SERVICE_ACCOUNT_MEKU_RUN` | Firebase Service Account JSON | Firebase Console > プロジェクト設定 > サービスアカウント |

### オプションSecrets（デフォルト値あり）

| Secret名 | デフォルト値 | 説明 |
|----------|-------------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBJSobP7SJjT0kLDKx7cIrq2uCeTlKs978` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `meku-run.firebaseapp.com` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `meku-run` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `meku-run.firebasestorage.app` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `762843174518` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:762843174518:web:7057c9553148b56719b157` | Firebase App ID |
| `NEXT_PUBLIC_AUTH_ENABLED` | `true` | 認証機能の有効/無効 |

## 🚀 デプロイ手順

### 1. Firebase Service Account設定

1. **Firebase Console**にアクセス
2. **プロジェクト設定** > **サービスアカウント**
3. **新しい秘密鍵を生成**をクリック
4. JSONファイルをダウンロード
5. JSONファイルの内容をコピー

### 2. GitHub Secrets設定

1. **GitHub Repository**にアクセス
2. **Settings** > **Secrets and variables** > **Actions**
3. **New repository secret**をクリック
4. `FIREBASE_SERVICE_ACCOUNT_MEKU_RUN`という名前でJSONを登録

### 3. 自動デプロイ実行

以下のイベントで自動デプロイが実行されます：

- ✅ **mainブランチへのpush** → 本番環境デプロイ
- ✅ **Pull Request作成** → プレビュー環境デプロイ
- ✅ **手動実行** → workflow_dispatch

## 🔄 デプロイプロセス

### GitHub Actions ワークフロー

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

### デプロイステップ

1. **コードチェックアウト**
2. **Node.js 20セットアップ**
3. **依存関係インストール** (`npm ci`)
4. **本番ビルド実行** (`npm run build`)
5. **Firebase Hostingデプロイ**
6. **デプロイ完了通知**

## 📊 ビルド設定

### Next.js設定 (`next.config.js`)

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',        // 静的エクスポート
  trailingSlash: true,
  // Firebase設定は環境変数またはデフォルト値
}
```

### Firebase Hosting設定 (`firebase.json`)

```json
{
  "hosting": {
    "site": "meku-run",
    "public": "out",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## 🛠️ 手動デプロイ（ローカル環境）

```bash
# 1. 依存関係インストール
npm install

# 2. 本番ビルド
npm run build

# 3. Firebase CLIログイン
firebase login

# 4. デプロイ実行
firebase deploy --only hosting
```

## 🔍 トラブルシューティング

### よくある問題

1. **Firebase Service Account エラー**
   - GitHub SecretsにJSONが正しく設定されているか確認
   - JSONの形式が正しいか確認

2. **ビルドエラー**
   - 依存関係の競合がないか確認
   - TypeScriptエラーがないか確認

3. **デプロイエラー**
   - Firebase プロジェクトの権限設定確認
   - Hosting設定の確認

### デバッグ方法

```bash
# GitHub Actionsログを確認
# Repository > Actions > 該当のワークフロー

# ローカルでのビルド確認
npm run build
npm run lint
npm run type-check
```

## 📈 パフォーマンス監視

### Firebase Hosting Analytics

- **ページビュー**
- **ユーザー数**
- **パフォーマンス指標**

### GitHub Actions実行時間

- **ビルド時間**: 約2-3分
- **デプロイ時間**: 約1-2分
- **合計実行時間**: 約3-5分

## 🌟 デプロイ後の確認事項

1. ✅ **URL動作確認**: https://meku-run.web.app
2. ✅ **認証機能**: ログイン/サインアップ
3. ✅ **Firestore接続**: データ読み書き
4. ✅ **レスポンシブデザイン**: モバイル対応
5. ✅ **パフォーマンス**: Lighthouse Score

## 🚀 今後の改善予定

- **CDN最適化**
- **プリロード設定**
- **パフォーマンス監視強化**
- **セキュリティヘッダー追加**

---

## 🔄 デプロイ実行状況

**更新日時**: 2025-01-14
**ステータス**: GitHub Actions実行中

---

🤖 Generated with [Claude Code](https://claude.ai/code)