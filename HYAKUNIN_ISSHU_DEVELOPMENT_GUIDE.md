# 百人一首学習アプリ開発ガイド

## 📋 プロジェクト概要

Firebase対応の百人一首学習アプリケーションの開発ノウハウと技術的知見をまとめたドキュメントです。

**技術スタック:**
- Frontend: React 18 + Next.js 14 + TypeScript
- Backend: Firebase (Authentication + Firestore)
- Deployment: Firebase Hosting via GitHub Actions
- Development: Claude Code AI協働開発

## 🎯 決まり字システム実装のノウハウ

### 1. 決まり字データベースの構築

#### ✅ 成功事例: HTML→TypeScript自動変換
```javascript
// HTML変換スクリプト (scripts/convert-html-to-ts.js)
function convertHtmlToTypeScript() {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // HTMLタグを除去する関数
  function removeHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '').trim();
  }
  
  // CSS変数を抽出
  const cardPattern = /--card-(\d+)-([^:]+):\s*([^;]+);/g;
  // ... 処理継続
}
```

#### 📊 正確な決まり字分類統計
```javascript
決まり字分類統計: {
  '1': 7,   // 1字決まり (むすめふさほせ)
  '2': 42,  // 2字決まり 
  '3': 37,  // 3字決まり
  '4': 6,   // 4字決まり
  '5': 2,   // 5字決まり
  '6': 6    // 6字決まり
}
```

### 2. 決まり字フィルター実装

#### ❌ 失敗例: 制限されたデータセット
```javascript
// 問題のあるコード
const cards = cardManager.getRecommendedSet('desktop', 'beginner');
// → 1-2字決まりのみに制限され、3字以上で「すべて覚えました」表示
```

#### ✅ 解決策: 全データの活用
```javascript
// 修正されたコード
const cards = hyakuninIsshuData; // 全100首を使用
```

#### 重要なポイント
- **フィルタリング処理**: 全データから決まり字分類で絞り込む
- **型安全性**: `'all' | 1 | 2 | 3 | 4 | 5 | 6` の型定義
- **状態管理**: 覚えた状態と決まり字フィルターの連携

### 3. 表示レイアウトの最適化

#### ❌ 失敗例: 固定値マージン
```javascript
// 問題のあるコード
marginTop: '-50px' // 環境により表示ずれ
```

#### ✅ 解決策: 絶対配置
```javascript
// 修正されたコード
position: 'absolute',
bottom: '8px',
left: '50%',
transform: 'translateX(-50%)'
```

#### 重要なポイント
- **本番環境とローカル環境の差異**: フォントレンダリングの違い
- **絶対配置の活用**: 環境に依存しない確実な位置指定
- **フォント読み込み順序**: Google Fontsを優先

## 🛠️ 開発ワークフロー

### 1. 問題発見から解決まで

#### Phase 1: 問題の特定
```bash
# デバッグ用ログの活用
console.log('決まり字分類統計:', kimarijiStats);
debugKimarijiClassification();
```

#### Phase 2: 根本原因の調査
- **Agent tool**: 複雑な問題の詳細調査
- **コードリーディング**: 関連ファイルの詳細分析
- **データ検証**: 実際のデータ構造の確認

#### Phase 3: 修正実装
- **段階的修正**: 小さな変更から段階的に改善
- **型安全性**: TypeScriptの型チェック活用
- **テスト**: ローカル環境での動作確認

#### Phase 4: デプロイと検証
- **Git管理**: 詳細なコミットメッセージ
- **CI/CD**: GitHub Actions自動デプロイ
- **本番確認**: 実際の環境での動作検証

### 2. 効果的なデバッグ手法

#### コンソールログの活用
```javascript
// データベース状態の確認
console.log('決まり字分類統計:', kimarijiStats);

// フィルタリング結果の確認
console.log('フィルタリング後のカード数:', filteredCards.length);

// 個別カードの詳細確認
console.log('1字決まり:', getCardsByKimarijiLength(1));
```

#### 段階的問題解決
1. **現象の確認**: 何が起こっているか
2. **原因の仮説**: なぜ起こっているか
3. **検証**: 仮説が正しいか
4. **修正**: 根本原因を解決
5. **検証**: 修正が効果的か

## 🎨 スタイリングのベストプラクティス

### 1. 環境差異への対応

#### フォント設定の統一
```javascript
// 推奨フォント設定
fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif'
```

#### 位置指定の安定化
```javascript
// 相対位置の基準点設定
position: 'relative' // 親要素

// 絶対配置による確実な位置指定
position: 'absolute',
bottom: '8px',
left: '50%',
transform: 'translateX(-50%)'
```

### 2. CSS設計原則

#### ファイル構成
```
src/styles/
├── design-tokens.css      # デザインシステムの基本トークン
├── card-styles.css        # カード表示の統一スタイル
├── hyakunin-app.css      # アプリケーション全体のスタイル
├── responsive-layouts.css # レスポンシブ対応
├── settings.css          # 設定画面のスタイル
└── vertical-text.css     # 縦書きテキストのスタイル
```

#### 保守性の向上
- **モジュール化**: 機能別のCSS分離
- **デザイントークン**: 一貫したスタイル管理
- **レスポンシブ設計**: 複数デバイス対応

## 🔧 TypeScript活用のノウハウ

### 1. 型定義の重要性

#### 決まり字フィルターの型定義
```typescript
// 適切な型定義
type KimarijiFilter = 'all' | 1 | 2 | 3 | 4 | 5 | 6;

// 使用例
const [kimarijiLengthFilter, setKimarijiLengthFilter] = useState<KimarijiFilter>('all');
```

#### データ構造の型安全性
```typescript
// 百人一首カードの型定義
export interface HyakuninIsshuCard {
  id: number;
  kamiNoKu: string;
  shimoNoKu: string;
  author: string;
  reading: {
    kamiNoKu: string;
    shimoNoKu: string;
    author: string;
  };
  kimariji: {
    position: number;
    length: number;
    pattern: string;
    category: 1 | 2 | 3 | 4 | 5 | 6;
    conflictCards: number[];
    difficulty: 'easy' | 'medium' | 'hard';
    notes?: string;
  };
  meaning?: string;
}
```

### 2. エラーハンドリング

#### 型チェックの活用
```bash
# 開発時の型チェック
npm run type-check

# ビルド時の型チェック
npm run build
```

#### 実行時エラーの対応
```javascript
// 初期化エラーのハンドリング
try {
  setCards(hyakuninIsshuData);
  setDisplayCards(hyakuninIsshuData.slice(0, cardsPerPage));
  setIsInitialized(true);
} catch (error) {
  console.error('初期化エラー:', error);
  setIsInitialized(true);
}
```

## 📚 データ管理のノウハウ

### 1. 状態管理の設計

#### MemorizationManager
```typescript
// 覚えた状態の管理
class MemorizationManager {
  private memorizedCards: Set<number> = new Set();
  
  toggleMemorized(cardId: number): void {
    if (this.memorizedCards.has(cardId)) {
      this.memorizedCards.delete(cardId);
    } else {
      this.memorizedCards.add(cardId);
    }
    this.saveToStorage();
  }
  
  isMemorized(cardId: number): boolean {
    return this.memorizedCards.has(cardId);
  }
}
```

#### 決まり字データベース
```typescript
// 決まり字情報の管理
export const kimarijiDatabase: Record<number, KimarijiInfo> = {};
export const kimarijiByLength: Record<number, number[]> = {
  1: [], 2: [], 3: [], 4: [], 5: [], 6: []
};

// 自動生成
hyakuninIsshuData.forEach(card => {
  if (card.kimariji) {
    kimarijiDatabase[card.id] = card.kimariji;
    kimarijiByLength[card.kimariji.category].push(card.id);
  }
});
```

### 2. データの整合性確保

#### 分類統計の検証
```javascript
// 合計確認（100首）
const total = Object.values(kimarijiByLength).reduce((sum, cards) => sum + cards.length, 0);
console.log('総カード数:', total); // 100になるべき
```

#### 決まり字パターンの検証
```javascript
// 1字決まり「むすめふさほせ」の確認
const oneCharCards = kimarijiByLength[1];
console.log('1字決まり:', oneCharCards.length); // 7になるべき
```

## 🚀 デプロイとCI/CDのノウハウ

### 1. GitHub Actions設定

#### デプロイワークフロー
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting
on:
  push:
    branches: [ main ]
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_MEKU_RUN }}'
          channelId: live
          projectId: meku-run
```

### 2. 品質保証

#### 自動チェック
```bash
# TypeScript型チェック
npm run type-check

# ESLint静的解析
npm run lint

# 本番ビルド検証
npm run build
```

#### コミットメッセージ規約
```
🎯 完全な決まり字データベースをkimariji.htmlから構築
🔧 決まり字分類を1字から6字まで正しく表示するように修正
🎨 本番環境での下の句表示ずれ問題を修正
```

## 💡 学んだ教訓

### 1. 技術的教訓

#### データ設計の重要性
- **全データの活用**: 制限されたデータセットによる予期しない問題
- **型安全性**: TypeScriptの型定義による早期エラー発見
- **一貫性**: ローカル環境と本番環境での差異への対応

#### デバッグの効率化
- **段階的アプローチ**: 小さな問題から順番に解決
- **ログの活用**: 適切なデバッグ情報の出力
- **Agent tool**: 複雑な問題の詳細分析

### 2. 開発プロセスの教訓

#### 問題解決のパターン
1. **現象の正確な把握**: 何が起こっているか
2. **根本原因の特定**: なぜ起こっているか
3. **段階的修正**: 小さな変更から始める
4. **検証**: 修正が効果的か確認
5. **デプロイ**: 本番環境での最終確認

#### 協働開発の効果
- **Claude Code**: 複雑な問題の分析と解決案の提示
- **段階的実装**: 大きな問題を小さなタスクに分割
- **継続的改善**: 問題発見から解決までの迅速な対応

## 🔮 今後の改善提案

### 1. 技術的改善

#### パフォーマンス最適化
- **メモ化**: 決まり字フィルタリングの結果をキャッシュ
- **仮想化**: 大量のカード表示の最適化
- **Code Splitting**: 必要な機能のみを読み込み

#### ユーザー体験向上
- **プログレッシブ読み込み**: 段階的なデータ読み込み
- **オフライン対応**: Service Workerによるキャッシュ
- **アクセシビリティ**: 画面リーダー対応

### 2. 開発体制の改善

#### テスト自動化
- **単体テスト**: 決まり字フィルタリング機能のテスト
- **E2Eテスト**: 主要な学習フローのテスト
- **視覚回帰テスト**: 表示崩れの自動検出

#### 品質管理
- **コードレビュー**: GitHub Pull Request活用
- **継続的品質監視**: SonarQube等の品質分析
- **パフォーマンス監視**: Web Vitals測定

## 🎉 成功の要因

### 1. 技術的成功要因

- **正確なデータ**: 競技かるた標準の決まり字分類
- **型安全性**: TypeScriptによる堅牢な開発
- **段階的改善**: 小さな問題から順番に解決
- **環境差異への対応**: 本番環境固有の問題解決

### 2. 開発プロセスの成功要因

- **問題の明確化**: 現象の正確な把握
- **根本原因の追求**: 表面的な修正ではなく根本解決
- **継続的検証**: 修正後の動作確認
- **協働開発**: Claude Codeとの効果的な連携

---

## 📝 まとめ

百人一首学習アプリの開発を通じて、以下の重要な知見を得ました：

1. **データ設計の重要性**: 正確で完全なデータが高品質なアプリの基盤
2. **問題解決のプロセス**: 段階的アプローチによる効率的な開発
3. **環境差異への対応**: ローカル環境と本番環境の違いを考慮した実装
4. **協働開発の効果**: AI支援による高速で品質の高い開発

このノウハウが今後の類似プロジェクトの成功に活用されることを期待します。

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>