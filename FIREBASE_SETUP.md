# 🔧 Firebase Service Account 設定手順

## 🚨 現在のエラー状況

GitHub ActionsでFirebase Hostingデプロイが失敗しています：

```
Error: Input required and not supplied: firebaseServiceAccount
```

## 📋 解決手順

### 1. Firebase Service Account作成

1. **Firebase Console**にアクセス: https://console.firebase.google.com/project/meku-run
2. **プロジェクト設定**（歯車アイコン）をクリック
3. **サービスアカウント**タブを選択
4. **新しい秘密鍵を生成**をクリック
5. **JSONファイル**をダウンロード

### 2. GitHub Secrets設定

1. **GitHub Repository**にアクセス: https://github.com/junmiya/meku-run
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**をクリック
4. 以下の情報を入力：

```
Name: FIREBASE_SERVICE_ACCOUNT_MEKU_RUN
Value: [ダウンロードしたJSONファイルの全内容をコピー&ペースト]
```

### 3. JSONファイル例

```json
{
  "type": "service_account",
  "project_id": "meku-run",
  "private_key_id": "abcd1234...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@meku-run.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40meku-run.iam.gserviceaccount.com"
}
```

### 4. 設定完了後

設定完了後、以下のいずれかでデプロイが自動実行されます：

1. **新しいコミットをpush**
2. **GitHub Actions画面で手動再実行**

## ✅ 確認方法

設定が完了すると、GitHub Actionsログに以下が表示されます：

```
✅ FIREBASE_SERVICE_ACCOUNT_MEKU_RUN is configured
```

## 🎯 最終結果

デプロイ成功後、以下のURLでアプリにアクセスできます：

**本番URL**: https://meku-run.web.app

---

🤖 Generated with [Claude Code](https://claude.ai/code)