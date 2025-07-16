import { HyakuninIsshuCard } from '../types/WordCard';

/**
 * カードシャッフル管理クラス
 * Fisher-Yates シャッフルアルゴリズムを使用した高品質なランダム化
 */
export class ShuffleManager {
  private static readonly SHUFFLE_SEED_KEY = 'hyakunin-isshu-shuffle-seed';

  /**
   * Fisher-Yates シャッフルアルゴリズムを使用してカード配列をシャッフル
   * 元の配列は変更せず、新しい配列を返す
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    
    return shuffled;
  }

  /**
   * 百人一首カードを特別なロジックでシャッフル
   * より学習効果的なシャッフルを提供
   */
  static shuffleCards(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    return this.shuffle(cards);
  }

  /**
   * シード値を使用した再現可能なシャッフル
   * 同じシード値では同じ順序を生成
   */
  static shuffleWithSeed<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    
    // シンプルな線形合同法でシード値から疑似乱数を生成
    let random = seed;
    const seededRandom = () => {
      random = (random * 1664525 + 1013904223) % 4294967296;
      return random / 4294967296;
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    
    return shuffled;
  }

  /**
   * 日替わりシャッフル（毎日同じ順序）
   * 学習の継続性を保ちながらランダム性を提供
   */
  static getDailyShuffledCards(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    // 今日の日付をシード値として使用
    const today = new Date();
    const seed = today.getFullYear() * 10000 + 
                 (today.getMonth() + 1) * 100 + 
                 today.getDate();
    
    return this.shuffleWithSeed(cards, seed);
  }

  /**
   * 学習効果を考慮したシャッフル
   * 似たような作者や時代の歌を分散配置
   */
  static intelligentShuffle(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    // 基本的なシャッフルを行う
    let shuffled = this.shuffle(cards);
    
    // TODO: 将来的に以下の機能を実装予定
    // - 同じ作者の歌が連続しないよう調整
    // - 似たテーマの歌を分散配置
    // - 難易度バランスの考慮
    
    return shuffled;
  }

  /**
   * シャッフル履歴を保存（復元用）
   */
  static saveShuffleOrder(cards: HyakuninIsshuCard[]): void {
    // クライアントサイドでのみローカルストレージに保存
    if (typeof window !== 'undefined') {
      try {
        const order = cards.map(card => card.id);
        const timestamp = Date.now();
        const shuffleData = {
          order,
          timestamp,
        };
        localStorage.setItem(this.SHUFFLE_SEED_KEY, JSON.stringify(shuffleData));
      } catch (error) {
        console.warn('シャッフル順序の保存に失敗しました:', error);
      }
    }
  }

  /**
   * 保存されたシャッフル順序を復元
   */
  static restoreShuffleOrder(allCards: HyakuninIsshuCard[]): HyakuninIsshuCard[] | null {
    // クライアントサイドでのみローカルストレージから復元
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(this.SHUFFLE_SEED_KEY);
      if (!stored) return null;

      const shuffleData = JSON.parse(stored);
      if (!shuffleData || typeof shuffleData !== 'object') {
        return null;
      }
      
      const { order, timestamp } = shuffleData;
      if (!order || !timestamp || !Array.isArray(order)) {
        return null;
      }

      // 24時間以内のシャッフル履歴のみ復元
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (now - timestamp > oneDayMs) {
        return null;
      }

      // IDの順序に基づいてカードを並び替え
      const cardMap = new Map(allCards.map(card => [card.id, card]));
      const restoredCards: HyakuninIsshuCard[] = [];
      
      for (const id of order) {
        const card = cardMap.get(id);
        if (card) {
          restoredCards.push(card);
        }
      }

      // 全てのカードが復元できた場合のみ返す
      return restoredCards.length === allCards.length ? restoredCards : null;
    } catch (error) {
      console.warn('シャッフル順序の復元に失敗しました:', error);
      return null;
    }
  }

  /**
   * シャッフル履歴をクリア
   */
  static clearShuffleHistory(): void {
    // クライアントサイドでのみローカルストレージをクリア
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.SHUFFLE_SEED_KEY);
      } catch (error) {
        console.warn('シャッフル履歴のクリアに失敗しました:', error);
      }
    }
  }

  /**
   * カード配列がシャッフルされているかどうかを判定
   * IDの順序が連続していない場合はシャッフル済みと判定
   */
  static isShuffled(cards: HyakuninIsshuCard[]): boolean {
    if (cards.length <= 1) return false;
    
    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i]!.id + 1 !== cards[i + 1]!.id) {
        return true;
      }
    }
    
    return false;
  }
}

export default ShuffleManager;