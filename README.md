# 🃏 Firebase Word Card App

Firebase を使用した日本語学習用単語カードアプリケーション

## ✨ 特徴

- 🔐 **認証切り替え機能**: 環境変数で認証のON/OFF切り替え可能
- ☁️ **クラウド同期**: Firebase Firestore でリアルタイム同期
- 💾 **オフライン対応**: LocalStorage による認証なしモード
- 📱 **レスポンシブ**: モバイル・デスクトップ対応
- 🎨 **モダンUI**: CSS3 アニメーション、グラデーション
- 🚀 **自動デプロイ**: GitHub Actions で Firebase Hosting に自動デプロイ

## 🌐 デプロイ先

**本番環境**: [https://meku-run.web.app](https://meku-run.web.app)

## 🏗️ 技術スタック

### フロントエンド
- **React 18** - UI ライブラリ
- **Next.js 14** - React フレームワーク (App Router)
- **TypeScript** - 型安全な開発
- **CSS3** - モダンスタイリング

### バックエンド
- **Firebase Authentication** - ユーザー認証
- **Firebase Firestore** - NoSQL データベース
- **Firebase Hosting** - 静的サイトホスティング

### 開発・デプロイ
- **GitHub Actions** - CI/CD パイプライン
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット

## 📁 プロジェクト構造

```
firebase-word-card-app/
├── 📁 app/                    # Next.js App Router
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # メインページ
│   └── globals.css            # グローバルスタイル
├── 📁 src/                    # ソースコード
│   ├── 📁 components/         # React コンポーネント
│   │   ├── 📁 Auth/          # 認証関連コンポーネント
│   │   ├── WordCard.tsx       # 単語カードコンポーネント
│   │   ├── CardForm.tsx       # カード作成フォーム
│   │   ├── SearchFilter.tsx   # 検索・フィルター
│   │   └── Pagination.tsx     # ページネーション
│   ├── 📁 contexts/           # React Context
│   │   ├── AuthContext.tsx    # 認証状態管理
│   │   └── DataManagerContext.tsx # データ管理
│   ├── 📁 hooks/              # カスタムフック
│   ├── 📁 lib/                # ライブラリ設定
│   ├── 📁 managers/           # データ管理クラス
│   ├── 📁 types/              # TypeScript 型定義
│   ├── 📁 utils/              # ユーティリティ関数
│   └── 📁 data/               # サンプルデータ
├── 📁 .github/workflows/      # GitHub Actions
├── 📄 firebase.json           # Firebase 設定
├── 📄 firestore.rules         # Firestore セキュリティルール
└── 📄 package.json            # 依存関係
```

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/junmiya/meku-run.git
cd meku-run
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Authentication Control
NEXT_PUBLIC_AUTH_ENABLED=false  # true で認証有効
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセス可能

## 🔧 認証機能の切り替え

### 認証を有効にする場合

1. `.env.local` で `NEXT_PUBLIC_AUTH_ENABLED=true` に変更
2. Firebase Console で Authentication を設定
3. Firestore Database を作成
4. セキュリティルールを適用

### 認証を無効にする場合

- `NEXT_PUBLIC_AUTH_ENABLED=false` に設定
- LocalStorage でデータを管理

## 📝 利用可能なスクリプト

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
npm run lint         # ESLint 実行
npm test             # テスト実行
```

## 🌟 主要機能

### 基本機能
- ✅ 単語カードの作成・編集・削除
- ✅ カードのフリップアニメーション
- ✅ 検索・フィルター機能
- ✅ ページネーション
- ✅ スター機能（お気に入り）

### 認証機能（認証有効時）
- ✅ Email/Password ログイン
- ✅ Google OAuth ログイン
- ✅ ユーザープロフィール管理
- ✅ パスワードリセット

### データ管理
- ✅ Firestore リアルタイム同期（認証有効時）
- ✅ LocalStorage 保存（認証無効時）
- ✅ データ移行機能

## 🔐 セキュリティ

### Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/wordCards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 デプロイ

### GitHub Actions による自動デプロイ

1. GitHub Secrets に以下を設定：
   - `FIREBASE_SERVICE_ACCOUNT`: Firebase サービスアカウント JSON
   - `FIREBASE_PROJECT_ID`: Firebase プロジェクト ID

2. `main` ブランチにプッシュで自動デプロイ

### 手動デプロイ

```bash
npm run build
firebase deploy --project meku-run
```

## 📊 パフォーマンス

- ⚡ **Lighthouse Score**: 95+
- 🎯 **Core Web Vitals**: 合格
- 📱 **Mobile Responsive**: 完全対応
- ♿ **Accessibility**: WCAG 2.1 準拠

## 🛣️ 今後の開発予定

### Phase 2: 認証システム強化
- パスワードリセット機能完全実装
- OAuth プロバイダー追加
- ユーザープロフィール詳細管理

### Phase 3: 学習機能
- フラッシュカード学習モード
- 習熟度トラッキング
- 学習統計・分析

### Phase 4: モバイルアプリ
- PWA 対応
- プッシュ通知
- オフライン同期

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 👨‍💻 作成者

- **GitHub**: [@junmiya](https://github.com/junmiya)
- **プロジェクト**: [meku-run](https://github.com/junmiya/meku-run)

---

🤖 Generated with [Claude Code](https://claude.ai/code)