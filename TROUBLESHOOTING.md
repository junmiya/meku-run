# Firebase認証トラブルシューティングガイド

## 現在のFirestore権限エラー解決手順

### 1. Firebase Console での設定確認

**重要**: 以下の設定を必ず**手動で**Firebase Consoleで確認してください：

#### Authentication設定
- Firebase Console → Authentication → Sign-in method
- Email/password: 有効にする
- 承認済みドメイン: 
  - `localhost` 
  - `firebaseapp.com`
  - 実際のドメイン名

#### Firestore Database設定
- Firebase Console → Firestore Database → Rules
- 以下のルールを適用:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /wordCards/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 2. デバッグログの確認

開発者ツールのConsoleで以下のログを確認:

1. **認証状態**: `AuthProvider - Auth state changed:`
2. **ユーザー情報**: `uid`, `email`, `emailVerified`
3. **Firestore操作**: `FirebaseManager.getAllCards()`
4. **エラー詳細**: `permission-denied` エラーコード

### 3. 一般的な解決方法

#### 権限エラーの場合
1. Firebase Console でセキュリティルールを再確認
2. 認証状態が正しく設定されているか確認
3. ユーザーIDが正しく渡されているか確認

#### 認証エラーの場合
1. `.env.local` の Firebase設定を確認
2. Firebase Console の認証設定を確認
3. 承認済みドメインの設定を確認

### 4. 緊急時の対処法

**テストモードを一時的に有効化**:
```javascript
// firestore.rules - テスト用（本番環境では使用禁止）
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 15);
    }
  }
}
```

### 5. 現在のエラー状況

**症状**: 認証成功後にFirestore操作で権限エラー
**エラーコード**: `permission-denied`
**影響範囲**: 認証が有効な場合のみ

**次の確認事項**:
1. Firebase Console でのルール更新状況
2. 認証後のConsoleログ出力
3. ユーザー情報の詳細（uid、email、emailVerified）