# CLAUDE.md - Firebase Word Card App 開発ガイド

## 📋 プロジェクト概要

Firebase対応の日本語学習用単語カードアプリケーション

**技術スタック:**
- Frontend: React 18 + Next.js 14 + TypeScript
- Backend: Firebase (Authentication + Firestore)
- Deployment: Firebase Hosting via GitHub Actions
- Development: Claude Code AI協働開発

## 🏗️ アーキテクチャ設計原則

### 1. Plan Mode 優先開発
- **実装前に設計**: 複雑なタスクはPlan Modeで設計検討
- **Extended Thinking**: 深い問題解決のための時間確保
- **段階的実装**: 大きな機能は小さなステップに分割

### 2. 品質ファーストアプローチ
- **TypeScript型安全性**: 100%型定義
- **ESLint準拠**: エラー0件維持
- **自動テスト**: 単体テスト + E2Eテスト
- **継続的品質監視**: GitHub Actions統合

### 3. ドキュメント駆動開発
- **永続的メモリ**: CLAUDE.mdによる知識保存
- **現状追跡**: CURRENT_STATUS.mdで状況管理
- **手順書完備**: DEPLOYMENT.md, TROUBLESHOOTING.md
- **技術決定記録**: ADR (Architecture Decision Records)

## 🔧 開発環境設定

### 必須ツール
- **Node.js 20**: JavaScript runtime
- **npm**: パッケージマネージャー
- **Firebase CLI**: デプロイツール
- **Git**: バージョン管理
- **VS Code**: 推奨エディター

### VS Code 拡張機能
- **ESLint**: 静的解析
- **Prettier**: コードフォーマッター
- **TypeScript**: 型チェック
- **GitLens**: Git履歴可視化

### 品質チェックコマンド
```bash
npm run type-check    # TypeScript型チェック (< 10秒)
npm run lint          # ESLint静的解析 (< 5秒)
npm run format        # Prettier フォーマット (< 3秒)
npm run build         # 本番ビルド検証 (< 30秒)
```

## 📁 プロジェクト構造

```
firebase-word-card-app/
├── 📁 app/                    # Next.js App Router
├── 📁 src/                    # ソースコード
│   ├── 📁 components/         # Reactコンポーネント
│   ├── 📁 contexts/           # React Context
│   ├── 📁 hooks/              # カスタムフック
│   ├── 📁 lib/                # ライブラリ設定
│   ├── 📁 managers/           # データ管理クラス
│   ├── 📁 types/              # TypeScript型定義
│   └── 📁 utils/              # ユーティリティ関数
├── 📁 .github/workflows/      # GitHub Actions
├── 📄 firebase.json           # Firebase設定
├── 📄 CLAUDE.md              # 開発ガイド（本ファイル）
├── 📄 QUALITY_SYSTEM.md      # 品質システム
└── 📄 package.json           # 依存関係
```

## 🚀 開発ワークフロー

### 1. 新機能開発
```
Plan Mode → 設計検討 → 実装 → テスト → レビュー → マージ
```

### 2. バグ修正
```
問題特定 → 原因分析 → 修正実装 → 検証 → デプロイ
```

### 3. リファクタリング
```
技術債務特定 → 改善計画 → 段階的実装 → 品質検証
```

## 🔍 デバッグ戦略

### Firebase関連
- **認証エラー**: AuthContext.tsxのログ確認
- **Firestore権限**: firestore.rulesの設定確認
- **デプロイエラー**: GitHub Actionsログ分析

### フロントエンド
- **TypeScriptエラー**: `npm run type-check`
- **ESLintエラー**: `npm run lint`
- **ビルドエラー**: `npm run build`

### CI/CDパイプライン
- **GitHub Actions**: `.github/workflows/deploy.yml`
- **Firebase Service Account**: GitHub Secrets設定
- **デプロイログ**: Firebase CLI詳細出力

## 📊 品質メトリクス

### 現在の状況
- ✅ TypeScript型安全性: 100%
- ✅ ESLint準拠: エラー0件目標
- ✅ ビルド成功率: 継続監視
- ✅ デプロイ自動化: GitHub Actions

### 改善目標
- 🎯 単体テストカバレッジ: 80%以上
- 🎯 E2Eテスト: 主要機能100%
- 🎯 Lighthouse Score: 95以上
- 🎯 Core Web Vitals: 全項目合格

## 🛡️ セキュリティ対策

### Firebase Security Rules
```javascript
// Firestore Rules
match /users/{userId}/wordCards/{cardId} {
  allow read, write: if request.auth.uid == userId;
}
```

### 環境変数管理
- **本番**: GitHub Secrets
- **開発**: .env.local (gitignore対象)
- **設定**: next.config.js fallback values

## 🔄 継続的改善

### 日次チェック
- GitHub Actions実行結果確認
- エラーログ分析
- パフォーマンス監視

### 週次レビュー
- 品質メトリクス分析
- 技術債務評価
- 改善計画更新

### 月次評価
- アーキテクチャレビュー
- 依存関係更新
- セキュリティ監査

## 🤝 Claude Code協働のベストプラクティス

### 効果的なプロンプト
- **具体的な要求**: 曖昧さを避ける
- **コンテキスト提供**: 関連ファイルの参照
- **期待値明示**: 完成イメージの共有

### Plan Mode活用
- **複雑なタスク**: 3ステップ以上の作業
- **アーキテクチャ変更**: 影響範囲の大きい修正
- **新機能追加**: 設計検討が必要な機能

### 知識の蓄積
- **CLAUDE.md更新**: 新しい知見の記録
- **トラブルシューティング**: 解決方法の文書化
- **技術決定**: 判断根拠の保存

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>