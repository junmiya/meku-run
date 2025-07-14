# 🚀 代替デプロイ方法

## GitHub Actions が失敗した場合の緊急対応

### Option 1: 手動デプロイスクリプト
```bash
cd /workspace/firebase-word-card-app
./deploy-manual.sh
```

### Option 2: Firebase CLI Token方式
```bash
# 1. トークン生成
firebase login:ci

# 2. 出力されたトークンをコピー

# 3. GitHub Secretsに追加
# Name: FIREBASE_TOKEN
# Value: [生成されたトークン]
```

### Option 3: 完全手動デプロイ
```bash
# ビルド
npm run build

# Firebase ログイン
firebase login

# デプロイ
firebase deploy --project meku-run --only hosting
```

## 🌐 デプロイ確認URL
https://meku-run.web.app

---

Service Account修正後、GitHubに新しいコミットをプッシュしてテストしてください。