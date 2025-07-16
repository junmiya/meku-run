import { HyakuninIsshuCard } from '../types/WordCard';

/**
 * 覚えたカードの一時的な管理クラス
 * ローカルストレージを使用してセッション間での永続化を行う
 */
export class MemorizationManager {
  private static readonly STORAGE_KEY = 'hyakunin-isshu-memorized-cards';
  private memorizedCardIds: Set<number>;

  constructor() {
    this.memorizedCardIds = new Set();
    // クライアントサイドでのみローカルストレージを読み込み
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  /**
   * ローカルストレージから覚えたカードIDを読み込み
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(MemorizationManager.STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as number[];
        this.memorizedCardIds = new Set(ids);
      }
    } catch (error) {
      console.warn('覚えたカードの読み込みに失敗しました:', error);
      this.memorizedCardIds = new Set();
    }
  }

  /**
   * ローカルストレージに覚えたカードIDを保存
   */
  private saveToStorage(): void {
    // クライアントサイドでのみローカルストレージに保存
    if (typeof window !== 'undefined') {
      try {
        const ids = Array.from(this.memorizedCardIds);
        localStorage.setItem(MemorizationManager.STORAGE_KEY, JSON.stringify(ids));
      } catch (error) {
        console.warn('覚えたカードの保存に失敗しました:', error);
      }
    }
  }

  /**
   * カードを覚えたとしてマーク
   */
  markAsMemorized(cardId: number): void {
    this.memorizedCardIds.add(cardId);
    this.saveToStorage();
  }

  /**
   * カードの覚えたマークを解除
   */
  unmarkAsMemorized(cardId: number): void {
    this.memorizedCardIds.delete(cardId);
    this.saveToStorage();
  }

  /**
   * カードが覚えた状態かどうかを確認
   */
  isMemorized(cardId: number): boolean {
    return this.memorizedCardIds.has(cardId);
  }

  /**
   * 覚えたカードの切り替え
   */
  toggleMemorized(cardId: number): boolean {
    if (this.isMemorized(cardId)) {
      this.unmarkAsMemorized(cardId);
      return false;
    } else {
      this.markAsMemorized(cardId);
      return true;
    }
  }

  /**
   * 覚えたカードIDの一覧を取得
   */
  getMemorizedCardIds(): number[] {
    return Array.from(this.memorizedCardIds).sort((a, b) => a - b);
  }

  /**
   * 覚えたカードの数を取得
   */
  getMemorizedCount(): number {
    return this.memorizedCardIds.size;
  }

  /**
   * カード一覧から覚えたカードを除外
   */
  filterUnmemorizedCards(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    return cards.filter(card => !this.isMemorized(card.id));
  }

  /**
   * カード一覧から覚えたカードのみを抽出（復習モード用）
   */
  filterMemorizedCards(cards: HyakuninIsshuCard[]): HyakuninIsshuCard[] {
    return cards.filter(card => this.isMemorized(card.id));
  }

  /**
   * 全ての覚えたカードをクリア
   */
  clearAllMemorized(): void {
    this.memorizedCardIds.clear();
    this.saveToStorage();
  }

  /**
   * 覚えたカードの統計情報を取得
   */
  getStatistics(totalCards: number): {
    memorizedCount: number;
    remainingCount: number;
    completionRate: number;
  } {
    const memorizedCount = this.getMemorizedCount();
    return {
      memorizedCount,
      remainingCount: totalCards - memorizedCount,
      completionRate: totalCards > 0 ? (memorizedCount / totalCards) * 100 : 0,
    };
  }
}

// シングルトンインスタンス
export const memorizationManager = new MemorizationManager();