/**
 * 決まり字情報データベース
 * 百人一首の各歌の決まり字情報を管理
 * 既存の百人一首データから自動生成
 */

import { hyakuninIsshuData } from './hyakunin-isshu-data';

export interface KimarijiInfo {
  position: number;        // 決まり字開始位置（0ベース）
  length: number;          // 決まり字の文字数
  pattern: string;         // 決まり字パターン
  category: 1 | 2 | 3 | 4 | 5 | 6;  // 字数分類
  conflictCards: number[]; // 類似する札のID配列
  difficulty: 'easy' | 'medium' | 'hard';
  notes?: string;         // 覚え方のメモ
}

/**
 * 決まり字データベース
 * hyakuninIsshuData から自動生成
 */
export const kimarijiDatabase: Record<number, KimarijiInfo> = {};

// 百人一首データから決まり字データベースを自動生成
hyakuninIsshuData.forEach(card => {
  if (card.kimariji) {
    kimarijiDatabase[card.id] = {
      position: card.kimariji.position,
      length: card.kimariji.length,
      pattern: card.kimariji.pattern,
      category: card.kimariji.category,
      conflictCards: card.kimariji.conflictCards || [],
      difficulty: card.kimariji.difficulty,
      ...(card.kimariji.notes && { notes: card.kimariji.notes })
    };
  }
});

/**
 * 決まり字の長さ別分類
 * 動的に生成される
 */
export const kimarijiByLength: Record<number, number[]> = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
};

// 決まり字データベースから長さ別分類を自動生成
Object.entries(kimarijiDatabase).forEach(([cardIdStr, info]) => {
  const cardId = parseInt(cardIdStr);
  // categoryを使用して分類（categoryがlengthに対応）
  const category = info.category;
  
  if (category >= 1 && category <= 6 && kimarijiByLength[category]) {
    kimarijiByLength[category].push(cardId);
  }
});

// 各配列をソート
Object.keys(kimarijiByLength).forEach(key => {
  const numKey = parseInt(key);
  if (kimarijiByLength[numKey]) {
    kimarijiByLength[numKey].sort((a, b) => a - b);
  }
});

/**
 * 暗記用語呂合わせ
 */
export const memorizeHelpers = {
  oneChar: {
    name: '1字決まり',
    mnemonic: 'むすめふさほせ',
    explanation: '1字で決まる7首の覚え方',
    cards: kimarijiByLength[1] || []
  },
  twoChar: {
    name: '2字決まり',
    explanation: '最も一般的な決まり字パターン',
    totalCount: kimarijiByLength[2]?.length || 0
  },
  threeChar: {
    name: '3字決まり',
    explanation: '中級者向けの決まり字パターン',
    totalCount: kimarijiByLength[3]?.length || 0
  },
  fourChar: {
    name: '4字決まり',
    explanation: '上級者向けの決まり字パターン',
    totalCount: kimarijiByLength[4]?.length || 0
  },
  fiveChar: {
    name: '5字決まり',
    explanation: '最難関の決まり字パターン',
    totalCount: kimarijiByLength[5]?.length || 0
  },
  sixChar: {
    name: '6字決まり',
    explanation: '最長の決まり字パターン',
    totalCount: kimarijiByLength[6]?.length || 0
  }
};

/**
 * 決まり字情報を取得
 */
export const getKimarijiInfo = (cardId: number): KimarijiInfo | undefined => {
  return kimarijiDatabase[cardId];
};

/**
 * 決まり字の長さでカードをフィルタリング
 */
export const getCardsByKimarijiLength = (length: number): number[] => {
  return kimarijiByLength[length] || [];
};

/**
 * 決まり字の難易度別カード一覧
 */
export const getCardsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): number[] => {
  return Object.entries(kimarijiDatabase)
    .filter(([_, info]) => info.difficulty === difficulty)
    .map(([cardId, _]) => parseInt(cardId));
};

/**
 * 決まり字パターンから該当カードを検索
 */
export const findCardByPattern = (pattern: string): number | undefined => {
  const entry = Object.entries(kimarijiDatabase)
    .find(([_, info]) => info.pattern === pattern);
  
  return entry ? parseInt(entry[0]) : undefined;
};

/**
 * 類似する決まり字のグループを取得
 */
export const getSimilarCards = (cardId: number): number[] => {
  const info = kimarijiDatabase[cardId];
  return info ? info.conflictCards : [];
};

/**
 * 練習推奨順序（易しいものから）
 */
export const practiceOrder = {
  beginner: [
    ...getCardsByDifficulty('easy'),
    ...getCardsByKimarijiLength(1),
  ],
  intermediate: [
    ...getCardsByKimarijiLength(2),
    ...getCardsByDifficulty('medium'),
  ],
  advanced: [
    ...getCardsByKimarijiLength(3),
    ...getCardsByKimarijiLength(4),
    ...getCardsByDifficulty('hard'),
  ],
};

/**
 * 決まり字システムの統計情報
 */
export const kimarijiStats = {
  total: Object.keys(kimarijiDatabase).length,
  byLength: Object.entries(kimarijiByLength).map(([length, cards]) => ({
    length: parseInt(length),
    count: cards.length,
    percentage: Object.keys(kimarijiDatabase).length > 0 ? (cards.length / Object.keys(kimarijiDatabase).length) * 100 : 0
  })),
  byDifficulty: ['easy', 'medium', 'hard'].map(difficulty => ({
    difficulty,
    count: getCardsByDifficulty(difficulty as any).length,
    percentage: Object.keys(kimarijiDatabase).length > 0 ? (getCardsByDifficulty(difficulty as any).length / Object.keys(kimarijiDatabase).length) * 100 : 0
  }))
};

/**
 * デバッグ用：決まり字分類の確認
 */
export const debugKimarijiClassification = () => {
  console.log('決まり字分類統計:');
  Object.entries(kimarijiByLength).forEach(([length, cards]) => {
    console.log(`${length}字決まり: ${cards.length}枚 - ${cards.join(', ')}`);
  });
  
  console.log('\n決まり字パターン一覧:');
  Object.entries(kimarijiDatabase).forEach(([cardId, info]) => {
    console.log(`${cardId}番: ${info.pattern} (category: ${info.category})`);
  });
  
  // 5字以上のテスト
  console.log('\n5字以上決まり:', getCardsByKimarijiLength(5));
};

export default kimarijiDatabase;