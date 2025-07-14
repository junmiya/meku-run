# 🔧 Service Account JSON エラー修正ガイド

## 🚨 現在のエラー
```
❌ Invalid JSON format
Error: Process completed with exit code 1.
```

## 🎯 解決手順（5分で完了）

### 1️⃣ Firebase Console で新しい Service Account 作成

1. **Firebase Console にアクセス:**
   ```
   https://console.firebase.google.com/project/meku-run/settings/serviceaccounts/adminsdk
   ```

2. **「新しい秘密鍵の生成」をクリック**
   - ボタンが見つからない場合は、ページをリフレッシュ
   - Firebase Admin SDK タブを選択

3. **JSON ファイルがダウンロードされる**
   - ファイル名例: `meku-run-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
   - **⚠️ このファイルは機密情報です - Git にコミットしない**

### 2️⃣ GitHub Secrets の更新

1. **GitHub Repository Settings にアクセス:**
   ```
   https://github.com/junmiya/meku-run/settings/secrets/actions
   ```

2. **既存の Secret を更新:**
   - Secret 名: `FIREBASE_SERVICE_ACCOUNT_MEKU_RUN`
   - 右側の「Update」ボタンをクリック

3. **JSON ファイルの内容をコピー:**
   - ダウンロードした JSON ファイルをテキストエディタで開く
   - **全選択** (Ctrl+A / Cmd+A)
   - **コピー** (Ctrl+C / Cmd+C)

4. **GitHub Secrets に貼り付け:**
   - Value 欄に **そのまま貼り付け** (Ctrl+V / Cmd+V)
   - **改行や空白も含めて全て貼り付ける**
   - 「Update secret」をクリック

### 3️⃣ 正しい JSON 形式の確認

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

### 4️⃣ 権限確認（必要に応じて）

1. **Google Cloud Console にアクセス:**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=meku-run
   ```

2. **Service Account の権限確認:**
   - Service Account Email: `firebase-adminsdk-xxxxx@meku-run.iam.gserviceaccount.com`
   - 必要な権限: `Firebase Hosting Admin`

3. **権限が不足している場合:**
   - 「編集」ボタンをクリック
   - 「ロールを追加」で `Firebase Hosting Admin` を追加

### 5️⃣ 動作テスト

GitHub Secrets 更新後、以下のコマンドでテスト：

```bash
# 空コミットでテスト
git commit --allow-empty -m "🔧 Test new Service Account JSON"
git push origin main
```

## 🔍 よくある間違い

### ❌ 間違った設定例
1. **JSON の一部だけコピー**
2. **改行が削除されている**
3. **余計な文字が追加されている**
4. **エスケープ文字が壊れている**

### ✅ 正しい設定方法
1. **JSON ファイル全体を選択**
2. **改行・空白も含めてコピー**
3. **GitHub Secrets にそのまま貼り付け**
4. **余計な編集をしない**

## 📞 トラブルシューティング

### エラーが続く場合
1. **新しい Service Account を作成**
2. **古い JSON ファイルを削除**
3. **ブラウザのキャッシュをクリア**
4. **手動デプロイスクリプトでテスト:** `./deploy-manual.sh`

### 確認用リンク
- **Firebase Console:** https://console.firebase.google.com/project/meku-run
- **GitHub Secrets:** https://github.com/junmiya/meku-run/settings/secrets/actions
- **Google Cloud IAM:** https://console.cloud.google.com/iam-admin/iam?project=meku-run

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>