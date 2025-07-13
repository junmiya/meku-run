import { User } from '@supabase/supabase-js';

import { createClient } from '../lib/supabase';
import { WordCard } from '../types/WordCard';

import { DataManager, SyncResult } from './DataManager';

export class SupabaseManager implements DataManager {
  private user: User | null = null;
  private supabase = createClient();

  constructor(user: User | null = null) {
    this.user = user;
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  private ensureAuthenticated(): void {
    if (!this.user) {
      throw new Error('User must be authenticated to use SupabaseManager');
    }
  }

  async getAllCards(): Promise<WordCard[]> {
    this.ensureAuthenticated();
    
    const { data, error } = await this.supabase
      .from('word_cards')
      .select('*')
      .eq('user_id', this.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cards from Supabase:', error);
      throw new Error(`Failed to fetch cards: ${error.message}`);
    }

    return data || [];
  }

  async getCard(id: string): Promise<WordCard | null> {
    this.ensureAuthenticated();
    
    const { data, error } = await this.supabase
      .from('word_cards')
      .select('*')
      .eq('id', id)
      .eq('user_id', this.user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching card from Supabase:', error);
      throw new Error(`Failed to fetch card: ${error.message}`);
    }

    return data;
  }

  async createCard(cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>): Promise<WordCard> {
    this.ensureAuthenticated();
    
    const { data, error } = await this.supabase
      .from('word_cards')
      .insert([{
        ...cardData,
        user_id: this.user!.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating card in Supabase:', error);
      throw new Error(`Failed to create card: ${error.message}`);
    }

    return data;
  }

  async updateCard(id: string, updates: Partial<Omit<WordCard, 'id' | 'created_at'>>): Promise<WordCard> {
    this.ensureAuthenticated();
    
    const { data, error } = await this.supabase
      .from('word_cards')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', this.user!.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating card in Supabase:', error);
      throw new Error(`Failed to update card: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Card with id ${id} not found`);
    }

    return data;
  }

  async deleteCard(id: string): Promise<void> {
    this.ensureAuthenticated();
    
    const { error } = await this.supabase
      .from('word_cards')
      .delete()
      .eq('id', id)
      .eq('user_id', this.user!.id);

    if (error) {
      console.error('Error deleting card from Supabase:', error);
      throw new Error(`Failed to delete card: ${error.message}`);
    }
  }

  async createCards(cardsData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>[]): Promise<WordCard[]> {
    this.ensureAuthenticated();
    
    const cardsWithUserId = cardsData.map(cardData => ({
      ...cardData,
      user_id: this.user!.id,
    }));

    const { data, error } = await this.supabase
      .from('word_cards')
      .insert(cardsWithUserId)
      .select();

    if (error) {
      console.error('Error creating cards in Supabase:', error);
      throw new Error(`Failed to create cards: ${error.message}`);
    }

    return data || [];
  }

  async deleteAllCards(): Promise<void> {
    this.ensureAuthenticated();
    
    const { error } = await this.supabase
      .from('word_cards')
      .delete()
      .eq('user_id', this.user!.id);

    if (error) {
      console.error('Error deleting all cards from Supabase:', error);
      throw new Error(`Failed to delete all cards: ${error.message}`);
    }
  }

  async syncData(): Promise<SyncResult> {
    this.ensureAuthenticated();
    
    try {
      // For now, just fetch latest data
      // In a full implementation, this would handle conflict resolution
      await this.getAllCards();
      return { success: true };
    } catch (error) {
      console.error('Error syncing data:', error);
      return { 
        success: false, 
        errors: [error instanceof Error ? error : new Error('Unknown sync error')]
      };
    }
  }

  isOffline(): boolean {
    return !navigator.onLine;
  }

  // Migration helpers
  async migrateFromLocalStorage(localCards: WordCard[]): Promise<SyncResult> {
    this.ensureAuthenticated();
    
    try {
      // Get existing cloud cards
      const cloudCards = await this.getAllCards();
      const cloudCardIds = new Set(cloudCards.map(card => card.id));
      
      // Filter out cards that already exist in cloud
      const cardsToMigrate = localCards.filter(card => !cloudCardIds.has(card.id));
      
      if (cardsToMigrate.length === 0) {
        return { success: true };
      }

      // Create new cards in cloud (without id, created_at, updated_at)
      const cardsData = cardsToMigrate.map(({ id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest }) => rest);
      await this.createCards(cardsData);
      
      return { success: true };
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
      return { 
        success: false, 
        errors: [error instanceof Error ? error : new Error('Migration failed')]
      };
    }
  }
}