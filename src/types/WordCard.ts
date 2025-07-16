// 百人一首カード関連の型定義
export interface HyakuninIsshuCard {
  id: number; // 1-100
  kamiNoKu: string; // 上の句
  shimoNoKu: string; // 下の句  
  author: string; // 作者
  reading: {
    kamiNoKu: string; // 上の句ふりがな
    shimoNoKu: string; // 下の句ふりがな
    author: string; // 作者読み
  };
  kimariji: {
    position: number; // 決まり字の開始位置
    length: number; // 決まり字の文字数
    pattern: string; // 決まり字パターン
    category: 1 | 2 | 3 | 4 | 5 | 6;  // 字数分類
    conflictCards: number[]; // 競合する札のID
    difficulty: 'easy' | 'medium' | 'hard';
    notes?: string; // 覚え方のメモ
  };
  meaning?: string; // 現代語訳
}

// カード状態管理
export interface HyakuninIsshuCardState {
  id: number;
  isMemorized: boolean;  // 覚えた状態
  isFavorite: boolean;   // お気に入り状態
  isHidden: boolean;     // 非表示状態（覚えたで隠した）
  lastStudied?: Date;    // 最後に学習した日時
  studyCount: number;    // 学習回数
}

// アプリケーション設定
export interface HyakuninIsshuSettings {
  cardsPerPage: 5 | 10 | 20 | 50;  // 1ページの表示枚数
  showFurigana: boolean;           // ふりがな表示（ログイン後のみ）
  showMeaning: boolean;            // 現代語訳表示
  shuffleMode: boolean;            // シャッフルモード
  displayMode: 'normal' | 'recovery'; // 通常モード | 復活モード
  // レスポンシブ設定
  deviceType: 'auto' | 'smartphone' | 'tablet' | 'desktop';
  practiceMode: 'normal' | 'kimariji-only' | 'competition';
  kimarijiSettings: {
    showKimariji: boolean;
    highlightKimariji: boolean;
    kimarijiLength: 1 | 2 | 3 | 4 | 5 | 6 | 'all';
    displayMode: 'full' | 'kimariji-only' | 'hint';
  };
  competitionSettings: {
    timeLimit: number;           // 制限時間（秒）
    memorizationTime: number;    // 暗記時間（秒）
    judgeMode: 'strict' | 'normal' | 'lenient';
    enableSound: boolean;        // 音声機能（将来実装）
  };
}

// ユーザー進捗情報（ログイン後のみ）
export interface UserProgress {
  userId: string;
  memorizedCards: Set<number>;     // 覚えたカードのIDセット
  favoriteCards: Set<number>;      // お気に入りカードのIDセット
  hiddenCards: Set<number>;        // 非表示カードのIDセット
  totalStudyTime: number;          // 総学習時間（分）
  studySessions: number;           // 学習セッション数
  lastLoginDate: Date;             // 最終ログイン日
  createdAt: Date;                 // アカウント作成日
}

// 学習セッション記録
export interface StudySession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  studiedCards: number[];          // 学習したカードID
  newMemorizedCards: number[];     // 新たに覚えたカードID
  reviewedCards: number[];         // 復習したカードID
  duration?: number;               // セッション時間（分）
}

// アプリケーション全体の状態管理
export interface AppState {
  hyakuninIsshu: {
    allCards: HyakuninIsshuCard[];       // 全100首のデータ
    visibleCards: HyakuninIsshuCard[];   // 現在表示中のカード
    cardStates: Map<number, HyakuninIsshuCardState>; // カード状態管理
    currentPage: number;
    totalCount: number;
    isLoading: boolean;
    error: string | null;
  };
  ui: {
    selectedCardId: number | null;
    isFlipped: Map<number, boolean>;     // カードのフリップ状態
    searchQuery: string;
    sortBy: 'id' | 'author' | 'random';
    sortOrder: 'asc' | 'desc';
  };
  settings: HyakuninIsshuSettings;
  user: {
    isLoggedIn: boolean;
    authLevel: 'guest' | 'authenticated';
    progress?: UserProgress;            // ログイン後のみ
  };
}

// 認証レベル判定
export type AuthLevel = 'guest' | 'authenticated';

// カードアクション
export type CardAction = 'memorize' | 'favorite' | 'flip' | 'recover' | 'hide';

// 表示モード
export type DisplayMode = 'normal' | 'recovery' | 'favorites' | 'memorized';

// 旧WordCard型（互換性のため残す - 後で削除）
export interface WordCard {
  id: string;
  word: string;
  meaning: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  isStarred?: boolean;
  user_id?: string;
}
