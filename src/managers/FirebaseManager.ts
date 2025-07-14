import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WordCard } from '../types/WordCard';
import { DataManager, SyncResult } from './DataManager';

export class FirebaseManager implements DataManager {
  private user: User | null = null;
  private unsubscribeListeners: (() => void)[] = [];

  constructor(user: User | null = null) {
    this.user = user;
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  private ensureUser(): void {
    if (!this.user) {
      throw new Error('User must be set to use FirebaseManager');
    }
  }

  private getUserId(): string {
    this.ensureUser();
    return this.user!.uid;
  }

  private getCollectionRef() {
    const userId = this.getUserId();
    return collection(db, 'users', userId, 'wordCards');
  }

  private convertFirestoreToWordCard(doc: any): WordCard {
    const data = doc.data();
    return {
      id: doc.id,
      word: data.word,
      meaning: data.meaning,
      created_at: data.created_at?.toDate?.()?.toISOString() || data.created_at,
      updated_at: data.updated_at?.toDate?.()?.toISOString() || data.updated_at,
      tags: data.tags || [],
      isStarred: data.isStarred || false,
      user_id: this.getUserId(),
    };
  }

  async getAllCards(): Promise<WordCard[]> {
    this.ensureUser();

    console.log('FirebaseManager.getAllCards() - User:', this.user?.uid);
    console.log('FirebaseManager.getAllCards() - User email:', this.user?.email);
    console.log('FirebaseManager.getAllCards() - User email verified:', this.user?.emailVerified);

    try {
      // ユーザーが有効かチェック
      if (!this.user?.uid) {
        throw new Error('User is not authenticated');
      }

      const collectionRef = this.getCollectionRef();
      console.log(
        'FirebaseManager.getAllCards() - Collection path:',
        `users/${this.user!.uid}/wordCards`
      );

      // まずは簡単なクエリで試行
      const querySnapshot = await getDocs(collectionRef);
      console.log('FirebaseManager.getAllCards() - Snapshot size:', querySnapshot.size);

      const cards: WordCard[] = [];

      querySnapshot.forEach(doc => {
        cards.push(this.convertFirestoreToWordCard(doc));
      });

      // created_atでソート
      cards.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return cards;
    } catch (error) {
      console.error('FirebaseManager.getAllCards() - Full error:', error);
      console.error('FirebaseManager.getAllCards() - Error code:', (error as any).code);
      console.error('FirebaseManager.getAllCards() - Error message:', (error as any).message);

      // 権限エラーの場合、より詳細な情報を表示
      if ((error as any).code === 'permission-denied') {
        console.error('Permission denied. User info:', {
          uid: this.user?.uid,
          email: this.user?.email,
          emailVerified: this.user?.emailVerified,
          isAnonymous: this.user?.isAnonymous,
          providerData: this.user?.providerData,
        });
      }

      throw new Error(`Failed to fetch cards: ${error}`);
    }
  }

  async getCard(id: string): Promise<WordCard | null> {
    try {
      const docRef = doc(this.getCollectionRef(), id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.convertFirestoreToWordCard(docSnap);
    } catch (error) {
      console.error('Error fetching card from Firebase:', error);
      throw new Error(`Failed to fetch card: ${error}`);
    }
  }

  async createCard(
    cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>
  ): Promise<WordCard> {
    try {
      const docRef = await addDoc(this.getCollectionRef(), {
        ...cardData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Failed to create card');
      }

      return this.convertFirestoreToWordCard(docSnap);
    } catch (error) {
      console.error('Error creating card in Firebase:', error);
      throw new Error(`Failed to create card: ${error}`);
    }
  }

  async updateCard(
    id: string,
    updates: Partial<Omit<WordCard, 'id' | 'created_at'>>
  ): Promise<WordCard> {
    try {
      const docRef = doc(this.getCollectionRef(), id);

      // user_id と updated_at を除外して更新
      const { user_id, ...updateData } = updates;

      await updateDoc(docRef, {
        ...updateData,
        updated_at: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Card with id ${id} not found`);
      }

      return this.convertFirestoreToWordCard(docSnap);
    } catch (error) {
      console.error('Error updating card in Firebase:', error);
      throw new Error(`Failed to update card: ${error}`);
    }
  }

  async deleteCard(id: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(), id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting card from Firebase:', error);
      throw new Error(`Failed to delete card: ${error}`);
    }
  }

  async createCards(
    cardsData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>[]
  ): Promise<WordCard[]> {
    try {
      const batch = writeBatch(db);
      const docRefs: any[] = [];

      cardsData.forEach(cardData => {
        const docRef = doc(this.getCollectionRef());
        batch.set(docRef, {
          ...cardData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
        docRefs.push(docRef);
      });

      await batch.commit();

      // 作成されたドキュメントを取得
      const createdCards: WordCard[] = [];
      for (const docRef of docRefs) {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          createdCards.push(this.convertFirestoreToWordCard(docSnap));
        }
      }

      return createdCards;
    } catch (error) {
      console.error('Error creating cards in Firebase:', error);
      throw new Error(`Failed to create cards: ${error}`);
    }
  }

  async deleteAllCards(): Promise<void> {
    try {
      const querySnapshot = await getDocs(this.getCollectionRef());
      const batch = writeBatch(db);

      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting all cards from Firebase:', error);
      throw new Error(`Failed to delete all cards: ${error}`);
    }
  }

  async syncData(): Promise<SyncResult> {
    try {
      await this.getAllCards();
      return { success: true };
    } catch (error) {
      console.error('Error syncing data:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error : new Error('Unknown sync error')],
      };
    }
  }

  isOffline(): boolean {
    return !navigator.onLine;
  }

  // リアルタイム同期のためのリスナー
  subscribeToCards(callback: (cards: WordCard[]) => void): () => void {
    const q = query(this.getCollectionRef(), orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const cards: WordCard[] = [];
        querySnapshot.forEach(doc => {
          cards.push(this.convertFirestoreToWordCard(doc));
        });
        callback(cards);
      },
      error => {
        console.error('Error in real-time listener:', error);
      }
    );

    this.unsubscribeListeners.push(unsubscribe);
    return unsubscribe;
  }

  // すべてのリスナーをクリーンアップ
  cleanup(): void {
    this.unsubscribeListeners.forEach(unsubscribe => unsubscribe());
    this.unsubscribeListeners = [];
  }

  // LocalStorage からの移行
  async migrateFromLocalStorage(localCards: WordCard[]): Promise<SyncResult> {
    try {
      const cloudCards = await this.getAllCards();
      const cloudCardIds = new Set(cloudCards.map(card => card.id));

      // IDベースの重複チェック（既存のカードは除外）
      const cardsToMigrate = localCards.filter(card => !cloudCardIds.has(card.id));

      if (cardsToMigrate.length === 0) {
        return { success: true };
      }

      // 新しいカードを作成
      const cardsData = cardsToMigrate.map(
        ({ id, created_at, updated_at, user_id, ...rest }) => rest
      );
      await this.createCards(cardsData);

      return { success: true };
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error : new Error('Migration failed')],
      };
    }
  }
}
