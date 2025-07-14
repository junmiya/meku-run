# Firebase Word Card App

Firebase を使用した単語カードアプリケーション。認証オンオフ機能付き。

## 🚀 機能

- **単語カード**: 表面（単語）と裏面（意味）の2面構成
- **フリップアニメーション**: クリック・タッチで裏返し
- **認証オンオフ**: 環境変数で認証機能を制御
- **データ管理**: 認証ON時はFirestore、OFF時はローカルストレージ
- **リアルタイム同期**: Firebase Firestoreによる同期
- **レスポンシブ**: モバイル・デスクトップ対応

## 📋 認証機能

### 認証 OFF（初期状態）
- 匿名ユーザーとして動作
- ローカルストレージにデータ保存
- 認証なしで全機能利用可能

### 認証 ON
- Firebase Authentication 使用
- Email/Password + Google OAuth
- Firestore にユーザー別データ保存
- リアルタイム同期機能

## 🛠️ セットアップ

### 1. Firebase プロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクト作成
2. **Authentication** を有効化
3. **Firestore Database** を有効化
4. **Hosting** を有効化

### 2. 環境変数設定

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
NEXT_PUBLIC_AUTH_ENABLED=false  # 認証機能のON/OFF
```

### 3. インストール・実行

```bash
# 依存関係をインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 🔧 認証機能の制御

### 認証を無効化（デフォルト）
```bash
NEXT_PUBLIC_AUTH_ENABLED=false
```

### 認証を有効化
```bash
NEXT_PUBLIC_AUTH_ENABLED=true
```

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── Auth/                  # 認証関連コンポーネント
│   ├── WordCard.tsx           # 単語カードコンポーネント
│   ├── CardForm.tsx           # カード作成フォーム
│   └── Pagination.tsx         # ページネーション
├── contexts/
│   ├── AuthContext.tsx        # 認証状態管理
│   └── DataManagerContext.tsx # データ管理
├── managers/
│   ├── FirebaseManager.ts     # Firebase データ管理
│   └── LocalStorageManager.ts # ローカルストレージ管理
├── lib/
│   └── firebase.ts            # Firebase設定
└── types/
    └── WordCard.ts            # 型定義
```

## 🔐 Firestore セキュリティルール

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

### GitHub Actions 自動デプロイ

1. GitHub リポジトリ作成
2. GitHub Secrets 設定：
   - `FIREBASE_SERVICE_ACCOUNT`: サービスアカウントJSON
   - `FIREBASE_PROJECT_ID`: プロジェクトID
3. `main` ブランチにプッシュで自動デプロイ

### 手動デプロイ

```bash
# Firebase CLI インストール
npm install -g firebase-tools

# ログイン
firebase login

# デプロイ
firebase deploy
```

## 📊 データ構造

### WordCard

```typescript
interface WordCard {
  id: string;
  word: string;          // 表面：単語
  meaning: string;       // 裏面：意味
  created_at: string;
  updated_at: string;
  tags?: string[];
  isStarred?: boolean;
  user_id?: string;
}
```

## 🔄 データ管理

### 認証OFF時
- `LocalStorageManager` 使用
- ブラウザのローカルストレージに保存
- オフライン完全対応

### 認証ON時
- `FirebaseManager` 使用
- Firestore Database に保存
- リアルタイム同期
- クラウドバックアップ

## 🧪 テスト

```bash
# テスト実行
npm test

# 型チェック
npm run type-check

# リント
npm run lint
```

## 📄 ライセンス

MIT License

---

🤖 Generated with [Claude Code](https://claude.ai/code)