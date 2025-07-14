# Firebase Word Card App デプロイガイド

## 🚀 デプロイ手順

### 1. Firebase Console でプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名を入力（例: `firebase-word-card-app`）
4. Google Analytics は任意で設定

### 2. Firebase サービスの有効化

#### Authentication
1. 左メニューから「Authentication」選択
2. 「始める」をクリック
3. 「Sign-in method」タブで以下を有効化：
   - **Email/Password**: 有効
   - **Google**: 有効（任意）

#### Firestore Database
1. 左メニューから「Firestore Database」選択
2. 「データベースの作成」をクリック
3. **テストモード**で開始（後でセキュリティルールを適用）
4. リージョンを選択（asia-northeast1 推奨）

#### Hosting
1. 左メニューから「Hosting」選択
2. 「始める」をクリック
3. 手順に従って設定

### 3. Firebase 設定値の取得

1. プロジェクト設定（⚙️アイコン）を開く
2. 「全般」タブの「マイアプリ」で Web アプリを追加
3. アプリ名を入力（例: `Word Card App`）
4. Firebase Hosting も設定にチェック
5. 設定オブジェクトをコピー

### 4. サービスアカウント作成

1. Firebase Console → プロジェクト設定 → サービスアカウント
2. 「新しい秘密鍵の生成」をクリック
3. JSON ファイルをダウンロード
4. ファイルの内容をコピー（GitHub Secrets で使用）

### 5. GitHub リポジトリ作成

```bash
# GitHub でリポジトリを作成後
git remote add origin https://github.com/your-username/firebase-word-card-app.git
git branch -M main
git push -u origin main
```

### 6. GitHub Secrets 設定

GitHub リポジトリ → Settings → Secrets and variables → Actions

以下の secrets を追加：

- **Name**: `FIREBASE_SERVICE_ACCOUNT`
  - **Value**: サービスアカウントJSON ファイルの全内容

- **Name**: `FIREBASE_PROJECT_ID`
  - **Value**: Firebase プロジェクトID

### 7. 環境変数の設定

`.env.local` ファイルを更新：

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Authentication Control (初期は無効)
NEXT_PUBLIC_AUTH_ENABLED=false
```

### 8. セキュリティルールの適用

Firebase Console → Firestore Database → ルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/wordCards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 9. デプロイ実行

1. コードを `main` ブランチにプッシュ
2. GitHub Actions が自動実行
3. Firebase Hosting に自動デプロイ

## 🔍 デプロイ確認

### デプロイ URL
- **メインサイト**: `https://your-project-id.web.app`
- **代替URL**: `https://your-project-id.firebaseapp.com`

### 動作確認項目

#### 基本機能（認証OFF状態）
- [ ] ページの正常表示
- [ ] 単語カード作成
- [ ] カードの表示・編集・削除
- [ ] ページネーション機能
- [ ] 検索・フィルター機能
- [ ] ローカルストレージでの保存

#### 認証機能（認証ON時）
- [ ] ログインフォームの表示
- [ ] メール/パスワード認証
- [ ] Google OAuth（設定した場合）
- [ ] ユーザー別データ管理
- [ ] リアルタイム同期

## 🔧 認証機能の有効化

### 手順
1. `.env.local` で `NEXT_PUBLIC_AUTH_ENABLED=true` に変更
2. コードをコミット・プッシュ
3. GitHub Actions が自動デプロイ
4. 認証機能が有効になる

### 確認事項
- Firebase Authentication が正しく設定されている
- Firestore セキュリティルールが適用されている
- Google OAuth の設定（使用する場合）

## 🚨 トラブルシューティング

### デプロイエラー
- GitHub Secrets が正しく設定されているか確認
- Firebase プロジェクトIDが正しいか確認
- サービスアカウントに適切な権限があるか確認

### 認証エラー
- Firebase Console で Authentication が有効になっているか確認
- 環境変数が正しく設定されているか確認
- ドメインが承認済みドメインに追加されているか確認

### Firestore エラー
- セキュリティルールが正しく設定されているか確認
- 認証が有効な状態でアクセスしているか確認

## 📊 モニタリング

### Firebase Console
- **Hosting**: デプロイ状況とトラフィック
- **Authentication**: ユーザー登録・ログイン状況
- **Firestore**: データベース使用量
- **Functions**: Cloud Functions の実行状況（今後追加予定）

### GitHub Actions
- **Actions** タブでデプロイ履歴を確認
- エラー発生時はログを確認

---

🤖 Generated with [Claude Code](https://claude.ai/code)