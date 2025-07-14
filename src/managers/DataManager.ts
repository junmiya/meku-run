import { WordCard } from '../types/WordCard';

export interface DataManager {
  // CRUD operations
  getAllCards(): Promise<WordCard[]>;
  getCard(id: string): Promise<WordCard | null>;
  createCard(card: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>): Promise<WordCard>;
  updateCard(id: string, updates: Partial<Omit<WordCard, 'id' | 'created_at'>>): Promise<WordCard>;
  deleteCard(id: string): Promise<void>;

  // Bulk operations
  createCards(cards: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>[]): Promise<WordCard[]>;
  deleteAllCards(): Promise<void>;

  // Sync operations
  syncData?(): Promise<SyncResult>;
  isOffline?(): boolean;
}

export interface SyncResult {
  success: boolean;
  conflicts?: WordCard[];
  errors?: Error[];
}
