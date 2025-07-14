# 🔐 Firebase Service Account 緊急設定ガイド

## 現在の問題
```
Error: Failed to authenticate, have you run firebase login?
Error: Process completed with exit code 1.
```

## 原因分析
GitHub Actions で Firebase CLI 認証が失敗している。Service Account JSON が正しく設定されていない可能性。

## 🚀 解決手順

### 1. Firebase Console での Service Account 作成

1. **Firebase Console にアクセス**
   ```
   https://console.firebase.google.com/project/meku-run/overview
   ```

2. **プロジェクト設定 → サービス アカウント**
   - 左メニュー：⚙️ プロジェクトの設定
   - タブ：サービス アカウント
   - 「新しい秘密鍵の生成」をクリック

3. **JSON キーファイルダウンロード**
   - ファイル名例：`meku-run-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
   - **⚠️ このファイルは絶対に Git にコミットしない**

### 2. Service Account 権限設定

Google Cloud Console で以下の権限を付与：

```
Firebase Hosting Admin
Firebase Authentication Admin  
Cloud Datastore User (Firestore用)
```

**Google Cloud Console URL:**
```
https://console.cloud.google.com/iam-admin/iam?project=meku-run
```

### 3. GitHub Secrets 設定

1. **GitHub Repository Settings**
   ```
   https://github.com/junmiya/meku-run/settings/secrets/actions
   ```

2. **新しい Repository Secret 作成**
   - Name: `FIREBASE_SERVICE_ACCOUNT_MEKU_RUN`
   - Value: ダウンロードした JSON ファイルの内容全体をコピー&ペースト

### 4. JSON 形式確認

Service Account JSON は以下の形式である必要があります：

```json
{
  "type": "service_account",
  "project_id": "meku-run",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@meku-run.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 5. テスト実行

GitHub Secrets 設定後、新しいコミットをプッシュしてテスト：

```bash
git commit --allow-empty -m "🔧 Test Firebase Service Account"
git push origin main
```

## ⚡ 緊急回避策

GitHub Secrets 設定が困難な場合の代替手段：

### Option A: Firebase CLI Token 使用

```bash
# ローカルで実行
firebase login:ci
# 出力されたトークンを FIREBASE_TOKEN として GitHub Secrets に設定
```

### Option B: 手動デプロイ

```bash
# ローカル環境で手動デプロイ
npm run build
firebase login
firebase deploy --project meku-run --only hosting
```

## 🔍 デバッグ方法

GitHub Actions ログで確認すべきポイント：

1. **Service Account 存在確認**
   ```
   ✅ FIREBASE_SERVICE_ACCOUNT_MEKU_RUN is configured
   ```

2. **JSON 形式検証**
   ```
   ✅ Valid JSON
   ```

3. **認証テスト**
   ```
   firebase projects:list --json
   ```

## 📞 トラブルシューティング

### よくある問題

1. **JSON 形式エラー**
   - 改行コードが含まれている
   - エスケープ文字が正しくない

2. **権限不足**
   - Service Account に適切なロールが付与されていない
   - プロジェクトアクセス権限がない

3. **プロジェクト ID 不一致**
   - firebase.json の project_id と実際のプロジェクト ID が異なる

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>