import { WordCard } from '../types/WordCard';

import { DataManager } from './DataManager';

const STORAGE_KEY = 'wordCards';

export class LocalStorageManager implements DataManager {
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  private getStoredCards(): WordCard[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveCards(cards: WordCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data to local storage');
    }
  }

  async getAllCards(): Promise<WordCard[]> {
    return this.getStoredCards();
  }

  async getCard(id: string): Promise<WordCard | null> {
    const cards = this.getStoredCards();
    return cards.find(card => card.id === id) || null;
  }

  async createCard(cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>): Promise<WordCard> {
    const cards = this.getStoredCards();
    const now = this.getCurrentTimestamp();
    
    const newCard: WordCard = {
      ...cardData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    };

    cards.push(newCard);
    this.saveCards(cards);
    
    return newCard;
  }

  async updateCard(id: string, updates: Partial<Omit<WordCard, 'id' | 'created_at'>>): Promise<WordCard> {
    const cards = this.getStoredCards();
    const cardIndex = cards.findIndex(card => card.id === id);
    
    if (cardIndex === -1) {
      throw new Error(`Card with id ${id} not found`);
    }

    const existingCard = cards[cardIndex]!;
    const updatedCard: WordCard = {
      ...existingCard,
      ...updates,
      updated_at: this.getCurrentTimestamp(),
      // Ensure required properties are preserved
      id: existingCard.id,
      word: updates.word ?? existingCard.word,
      meaning: updates.meaning ?? existingCard.meaning,
      created_at: existingCard.created_at,
    };

    cards[cardIndex] = updatedCard;
    this.saveCards(cards);
    
    return updatedCard;
  }

  async deleteCard(id: string): Promise<void> {
    const cards = this.getStoredCards();
    const filteredCards = cards.filter(card => card.id !== id);
    
    if (filteredCards.length === cards.length) {
      throw new Error(`Card with id ${id} not found`);
    }
    
    this.saveCards(filteredCards);
  }

  async createCards(cardsData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>[]): Promise<WordCard[]> {
    const cards = this.getStoredCards();
    const now = this.getCurrentTimestamp();
    
    const newCards: WordCard[] = cardsData.map(cardData => ({
      ...cardData,
      id: this.generateId(),
      created_at: now,
      updated_at: now,
    }));

    cards.push(...newCards);
    this.saveCards(cards);
    
    return newCards;
  }

  async deleteAllCards(): Promise<void> {
    this.saveCards([]);
  }

  isOffline(): boolean {
    return true; // LocalStorageManager is always "offline"
  }
}