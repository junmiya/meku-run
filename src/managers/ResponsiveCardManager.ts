import { HyakuninIsshuCard } from '../types/WordCard';
import { DeviceType } from '../hooks/useDeviceDetection';

/**
 * 難易度レベル定義
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * 札セット情報
 */
export interface CardSetInfo {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  difficulty: DifficultyLevel;
  deviceType: DeviceType;
  recommendedForBeginners: boolean;
}

/**
 * 札選択設定
 */
export interface CardSelectionSettings {
  deviceType: DeviceType;
  cardCount: number;
  difficulty: DifficultyLevel;
  includeMemorized: boolean;
  shuffleMode: boolean;
  kimarijiFilter?: {
    minLength: number;
    maxLength: number;
  };
}

/**
 * レスポンシブカード管理クラス
 */
export class ResponsiveCardManager {
  private static instance: ResponsiveCardManager;
  private allCards: HyakuninIsshuCard[] = [];

  private constructor() {}

  static getInstance(): ResponsiveCardManager {
    if (!ResponsiveCardManager.instance) {
      ResponsiveCardManager.instance = new ResponsiveCardManager();
    }
    return ResponsiveCardManager.instance;
  }

  /**
   * 全カードデータを設定
   */
  setAllCards(cards: HyakuninIsshuCard[]): void {
    this.allCards = cards;
  }

  /**
   * デバイスタイプに最適なカード数を取得
   */
  getOptimalCardCount(deviceType: DeviceType): number {
    const cardCounts: Record<DeviceType, number> = {
      smartphone: 2,
      tablet: 12,
      desktop: 50,
    };
    return cardCounts[deviceType];
  }

  /**
   * 利用可能な札セット情報を取得
   */
  getAvailableCardSets(): CardSetInfo[] {
    return [
      {
        id: 'smartphone-basic',
        name: '基礎練習セット',
        description: '2枚での基本的な練習',
        cardCount: 2,
        difficulty: 'beginner',
        deviceType: 'smartphone',
        recommendedForBeginners: true,
      },
      {
        id: 'tablet-intermediate',
        name: '中級練習セット',
        description: '12枚での中級レベル練習',
        cardCount: 12,
        difficulty: 'intermediate',
        deviceType: 'tablet',
        recommendedForBeginners: false,
      },
      {
        id: 'desktop-advanced',
        name: '上級練習セット',
        description: '50枚での本格的な練習',
        cardCount: 50,
        difficulty: 'advanced',
        deviceType: 'desktop',
        recommendedForBeginners: false,
      },
    ];
  }

  /**
   * 設定に基づいて札セットを生成
   */
  generateCardSet(settings: CardSelectionSettings): HyakuninIsshuCard[] {
    let availableCards = [...this.allCards];

    // 決まり字フィルタリング
    if (settings.kimarijiFilter) {
      const { minLength, maxLength } = settings.kimarijiFilter;
      availableCards = availableCards.filter(card => {
        const kimarijiLength = card.kimariji?.length || 0;
        return kimarijiLength >= minLength && kimarijiLength <= maxLength;
      });
    }

    // 難易度による選択
    availableCards = this.filterByDifficulty(availableCards, settings.difficulty);

    // 必要な枚数に調整
    let selectedCards = this.selectCards(availableCards, settings.cardCount);

    // シャッフル
    if (settings.shuffleMode) {
      selectedCards = this.shuffleCards(selectedCards);
    }

    return selectedCards;
  }

  /**
   * 難易度によるフィルタリング
   */
  private filterByDifficulty(cards: HyakuninIsshuCard[], difficulty: DifficultyLevel): HyakuninIsshuCard[] {
    switch (difficulty) {
      case 'beginner':
        // 1-2字決まりの札を優先
        return cards.filter(card => {
          const kimarijiLength = card.kimariji?.length || 0;
          return kimarijiLength <= 2;
        });
      
      case 'intermediate':
        // 2-4字決まりの札を選択
        return cards.filter(card => {
          const kimarijiLength = card.kimariji?.length || 0;
          return kimarijiLength >= 2 && kimarijiLength <= 4;
        });
      
      case 'advanced':
        // 全ての札を対象
        return cards;
      
      default:
        return cards;
    }
  }

  /**
   * 指定枚数の札を選択
   */
  private selectCards(cards: HyakuninIsshuCard[], count: number): HyakuninIsshuCard[] {
    if (cards.length <= count) {
      return cards;
    }

    // 決まり字の長さでバランス良く選択
    const selectedCards: HyakuninIsshuCard[] = [];
    const cardsByKimariji = this.groupByKimarijiLength(cards);

    // 各決まり字グループから均等に選択
    const groups = Object.keys(cardsByKimariji).sort();
    const cardsPerGroup = Math.floor(count / groups.length);
    let remainingCards = count;

    groups.forEach(group => {
      const groupCards = cardsByKimariji[group];
      if (!groupCards || !Array.isArray(groupCards)) return;
      
      const takeCount = Math.min(cardsPerGroup, remainingCards, groupCards.length);
      
      // ランダムに選択
      const shuffled = this.shuffleCards([...groupCards]);
      selectedCards.push(...shuffled.slice(0, takeCount));
      remainingCards -= takeCount;
    });

    // 残りの札を補填
    if (remainingCards > 0) {
      const usedIds = new Set(selectedCards.map(card => card.id));
      const availableCards = cards.filter(card => !usedIds.has(card.id));
      const shuffled = this.shuffleCards(availableCards);
      selectedCards.push(...shuffled.slice(0, remainingCards));
    }

    return selectedCards;
  }

  /**
   * 決まり字の長さでグループ化
   */
  private groupByKimarijiLength(cards: HyakuninIsshuCard[]): Record<string, HyakuninIsshuCard[]> {
    const groups: Record<string, HyakuninIsshuCard[]> = {};
    
    cards.forEach(card => {
      const length = card.kimariji?.length || 0;
      const key = `${length}字決まり`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(card);
    });

    return groups;
  }

  /**
   * Fisher-Yates シャッフル
   */
  shuffleCards(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    const shuffled = [...cards];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const cardI = shuffled[i];
      const cardJ = shuffled[j];
      if (cardI && cardJ) {
        shuffled[i] = cardJ;
        shuffled[j] = cardI;
      }
    }
    
    return shuffled;
  }

  /**
   * 札セットの統計情報を取得
   */
  getCardSetStats(cards: HyakuninIsshuCard[]): {
    totalCards: number;
    kimarijiDistribution: Record<string, number>;
    averageKimarijiLength: number;
    difficultyLevel: DifficultyLevel;
  } {
    const kimarijiDistribution: Record<string, number> = {};
    let totalKimarijiLength = 0;

    cards.forEach(card => {
      const length = card.kimariji?.length || 0;
      const key = `${length}字決まり`;
      kimarijiDistribution[key] = (kimarijiDistribution[key] || 0) + 1;
      totalKimarijiLength += length;
    });

    const averageKimarijiLength = totalKimarijiLength / cards.length;
    
    // 平均決まり字長から難易度を判定
    let difficultyLevel: DifficultyLevel;
    if (averageKimarijiLength <= 2) {
      difficultyLevel = 'beginner';
    } else if (averageKimarijiLength <= 3.5) {
      difficultyLevel = 'intermediate';
    } else {
      difficultyLevel = 'advanced';
    }

    return {
      totalCards: cards.length,
      kimarijiDistribution,
      averageKimarijiLength,
      difficultyLevel,
    };
  }

  /**
   * 練習推奨セットを取得
   */
  getRecommendedSet(deviceType: DeviceType, userLevel: DifficultyLevel): HyakuninIsshuCard[] {
    const cardCount = this.getOptimalCardCount(deviceType);
    
    const settings: CardSelectionSettings = {
      deviceType,
      cardCount,
      difficulty: userLevel,
      includeMemorized: false,
      shuffleMode: true,
    };

    return this.generateCardSet(settings);
  }

  /**
   * 苦手札を重点的に含むセットを生成
   */
  generateWeakCardsSet(
    deviceType: DeviceType, 
    weakCardIds: number[]
  ): HyakuninIsshuCard[] {
    const cardCount = this.getOptimalCardCount(deviceType);
    const weakCards = this.allCards.filter(card => weakCardIds.includes(card.id));
    
    // 苦手札を優先的に含める
    const priorityCount = Math.min(weakCards.length, Math.floor(cardCount * 0.7));
    const remainingCount = cardCount - priorityCount;
    
    const otherCards = this.allCards.filter(card => !weakCardIds.includes(card.id));
    const shuffledOthers = this.shuffleCards(otherCards);
    
    return [
      ...this.shuffleCards(weakCards).slice(0, priorityCount),
      ...shuffledOthers.slice(0, remainingCount),
    ];
  }

  /**
   * 復習用セットを生成
   */
  generateReviewSet(
    deviceType: DeviceType,
    memorizedCardIds: number[]
  ): HyakuninIsshuCard[] {
    const cardCount = this.getOptimalCardCount(deviceType);
    const memorizedCards = this.allCards.filter(card => memorizedCardIds.includes(card.id));
    
    if (memorizedCards.length === 0) {
      return [];
    }

    const shuffled = this.shuffleCards(memorizedCards);
    return shuffled.slice(0, Math.min(cardCount, shuffled.length));
  }
}

// シングルトンインスタンスをエクスポート
export const responsiveCardManager = ResponsiveCardManager.getInstance();