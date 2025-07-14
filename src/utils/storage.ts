import { WordCard } from '../types/WordCard';

const STORAGE_KEY = 'word-card-app';

export class LocalStorageManager {
  static save(cards: WordCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static load(): WordCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }

      const cards = JSON.parse(data);
      // Convert date strings back to Date objects
      return cards.map((card: WordCard & { createdAt: string; updatedAt: string }) => ({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return [];
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
