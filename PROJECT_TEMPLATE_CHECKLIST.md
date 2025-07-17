# 🚀 Firebase + Next.js プロジェクト立ち上げチェックリスト

## 📋 新プロジェクト開始時のノウハウ活用

### Phase 1: プロジェクト初期設定 (10分)

#### ✅ 基本構成
- [ ] **リポジトリ作成** - GitHub で新しいリポジトリ作成
- [ ] **Next.js セットアップ** - `npx create-next-app@latest`
- [ ] **TypeScript 有効化** - 厳格な型チェック設定

#### ✅ Firebase 設定
- [ ] **Firebase プロジェクト作成** - Firebase Console
- [ ] **firebase.json コピー** - 前回プロジェクトから移植
- [ ] **Firestore ルール設定** - firestore.rules をコピー

### Phase 2: CI/CD パイプライン構築 (15分)

#### ✅ GitHub Actions 設定
- [ ] **ワークフローコピー** - `.github/workflows/deploy.yml`
- [ ] **プロジェクト固有情報更新:**
  - Firebase プロジェクト ID
  - GitHub リポジトリ名
  - デプロイ URL

#### ✅ Service Account 設定
- [ ] **Service Account 作成** - Firebase Console
- [ ] **権限付与:**
  - Firebase Hosting Admin
  - Firebase Authentication Admin
  - Project Editor
- [ ] **GitHub Secrets 設定:**
  - `FIREBASE_SERVICE_ACCOUNT_[PROJECT_NAME]`

### Phase 3: 品質システム導入 (10分)

#### ✅ 開発ツール設定
- [ ] **package.json スクリプト追加:**
  ```json
  "quality:check": "npm run type-check && npm run lint && npm run format:check",
  "quality:fix": "npm run format && npm run lint --fix",
  "quality:full": "npm run quality:fix && npm run type-check && npm run build"
  ```
- [ ] **Prettier 設定** - devDependencies に追加
- [ ] **ESLint 設定** - Next.js 推奨設定

#### ✅ TypeScript 設定
- [ ] **tsconfig.json 厳格設定:**
  ```json
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
  ```

### Phase 4: ドキュメント整備 (5分)

#### ✅ 開発ガイド設定
- [ ] **CLAUDE.md 更新** - プロジェクト固有情報に変更
- [ ] **README.md 作成** - プロジェクト概要とセットアップ手順
- [ ] **SERVICE_ACCOUNT_FIX.md コピー** - Firebase認証トラブル対応

### Phase 5: テスト実行 (5分)

#### ✅ 動作確認
- [ ] **ローカル開発サーバー** - `npm run dev`
- [ ] **品質チェック** - `npm run quality:check`
- [ ] **本番ビルド** - `npm run build`
- [ ] **GitHub Actions テスト** - 空コミットでデプロイ確認

## 🎯 活用のコツ

### Claude Code AI 協働時
1. **Plan Mode を積極活用** - 複雑なタスクは設計検討から
2. **Extended Thinking で深く考察** - アーキテクチャ決定時
3. **CLAUDE.md を参照** - 過去の判断基準と知見活用

### トラブル発生時
1. **SERVICE_ACCOUNT_FIX.md を確認** - Firebase認証エラー
2. **GitHub Actions ログ詳細確認** - エラーメッセージ分析
3. **品質チェック自動化** - 問題の早期発見

### 継続改善
1. **新しい知見を CLAUDE.md に追記**
2. **トラブル解決方法をドキュメント化**
3. **ワークフロー改善を次回プロジェクトに反映**

## 📚 参考ドキュメント

- **CLAUDE.md** - 開発協働ベストプラクティス
- **SERVICE_ACCOUNT_FIX.md** - Firebase認証設定手順  
- **QUALITY_SYSTEM.md** - 品質管理システム詳細
- **deploy-manual.sh** - 緊急手動デプロイスクリプト

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>