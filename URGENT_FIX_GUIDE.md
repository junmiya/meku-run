# 🚨 緊急修正ガイド - Service Account JSON エラー

## 現在のエラー
```
❌ Invalid JSON format
```

## 🔥 即座の解決手順（5分以内）

### 1. Firebase Console でService Account作成
1. **URLに直接アクセス:**
   ```
   https://console.firebase.google.com/project/meku-run/settings/serviceaccounts/adminsdk
   ```

2. **「新しい秘密鍵の生成」ボタンをクリック**

3. **JSONファイルがダウンロードされる**
   - ファイル名: `meku-run-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

### 2. GitHub Secrets設定
1. **URLに直接アクセス:**
   ```
   https://github.com/junmiya/meku-run/settings/secrets/actions
   ```

2. **既存のSecretを更新:**
   - Secret名: `FIREBASE_SERVICE_ACCOUNT_MEKU_RUN`
   - 「Update」をクリック

3. **JSONファイルを開いて内容をコピー:**
   ```json
   {
     "type": "service_account",
     "project_id": "meku-run",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@meku-run.iam.gserviceaccount.com",
     ...
   }
   ```

4. **JSONファイル全体をValue欄に貼り付け**
   - ⚠️ 改行や空白も含めてそのまま貼り付け
   - ⚠️ 余計な文字は追加しない

### 3. 権限設定確認
1. **Google Cloud Console:**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=meku-run
   ```

2. **Service Accountに以下の権限を確認:**
   - Firebase Hosting Admin
   - Firebase Authentication Admin
   - Editor (推奨)

### 4. テスト実行
```bash
# 空コミットでテスト
git commit --allow-empty -m "🔧 Test new Service Account"
git push origin main
```

## ⚡ 代替手段（GitHub Actions修正が困難な場合）

### 手動デプロイ実行
```bash
# プロジェクトルートで実行
./deploy-manual.sh
```

### Firebase CLI Token使用
```bash
# ローカルで実行
firebase login:ci
# 出力されたトークンをGitHub SecretsのFIREBASE_TOKENに設定
```

## 🔍 よくある失敗パターン

### ❌ 間違った設定例:
1. **JSONの一部だけコピー**
2. **改行が削除されている**
3. **エスケープ文字が壊れている**
4. **余計な文字が追加されている**

### ✅ 正しい設定:
- ダウンロードしたJSONファイルをそのまま開く
- Ctrl+A で全選択
- Ctrl+C でコピー
- GitHub SecretsにCtrl+V で貼り付け

## 📞 サポート情報

**Firebase Console:** https://console.firebase.google.com/project/meku-run
**GitHub Secrets:** https://github.com/junmiya/meku-run/settings/secrets/actions
**Google Cloud IAM:** https://console.cloud.google.com/iam-admin/iam?project=meku-run

---

🤖 Generated with [Claude Code](https://claude.ai/code)