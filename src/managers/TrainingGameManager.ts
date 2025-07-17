import { HyakuninIsshuCard } from '../types/WordCard';
import { User } from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * 競技トレーニングセッションの結果
 */
export interface TrainingResult {
  cardId: number;
  responseTime: number;
  correct: boolean;
  timestamp: Date;
  kimarijiLength: number;
}

/**
 * 競技トレーニングセッション
 */
export interface TrainingSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  mode: 'memorization' | 'reaction' | 'competition';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  settings: {
    timeLimit: number;           // 制限時間（秒）
    memorizationTime: number;    // 暗記時間（秒）
    judgeMode: 'strict' | 'normal' | 'lenient';
  };
  results: TrainingResult[];
  statistics?: {
    totalCards: number;
    correctAnswers: number;
    averageResponseTime: number;
    fastestResponse: number;
    slowestResponse: number;
  };
}

/**
 * 競技トレーニング状態
 */
export interface TrainingState {
  isActive: boolean;
  currentPhase: 'setup' | 'memorization' | 'waiting' | 'active' | 'finished';
  timeRemaining: number;
  currentCard?: HyakuninIsshuCard;
  sessionStats: {
    totalAttempts: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
  };
}

/**
 * 競技トレーニングゲームの管理クラス
 * セッション管理、タイマー、判定システムを提供
 */
export class TrainingGameManager {
  private static readonly STORAGE_KEY = 'hyakunin-isshu-training-sessions';
  private static instance: TrainingGameManager;
  
  private currentSession: TrainingSession | null = null;
  private currentState: TrainingState;
  private sessionHistory: TrainingSession[] = [];
  private timer: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private user: User | null = null;
  private unsubscribeListener: (() => void) | null = null;
  
  private constructor() {
    this.currentState = {
      isActive: false,
      currentPhase: 'setup',
      timeRemaining: 0,
      sessionStats: {
        totalAttempts: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0
      }
    };
    
    // クライアントサイドでのみローカルストレージを読み込み
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): TrainingGameManager {
    if (!TrainingGameManager.instance) {
      TrainingGameManager.instance = new TrainingGameManager();
    }
    return TrainingGameManager.instance;
  }
  
  /**
   * ユーザーを設定
   */
  public setUser(user: User | null): void {
    if (this.user?.uid !== user?.uid) {
      this.cleanup();
      this.user = user;
      if (user) {
        this.loadFromFirestore();
      } else {
        this.loadFromStorage();
      }
    }
  }
  
  /**
   * 現在のユーザーを取得
   */
  public getCurrentUser(): User | null {
    return this.user;
  }
  
  /**
   * 新しいトレーニングセッションを開始
   */
  public startSession(
    mode: 'memorization' | 'reaction' | 'competition',
    kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed',
    settings: {
      timeLimit: number;
      memorizationTime: number;
      judgeMode: 'strict' | 'normal' | 'lenient';
    }
  ): TrainingSession {
    // 既存のセッションがある場合は終了
    if (this.currentSession) {
      this.endSession();
    }
    
    // 新しいセッションを作成
    this.currentSession = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      mode,
      kimarijiLevel,
      settings,
      results: []
    };
    
    // 状態を初期化
    this.currentState = {
      isActive: true,
      currentPhase: mode === 'memorization' ? 'memorization' : 'active',
      timeRemaining: mode === 'memorization' ? settings.memorizationTime : settings.timeLimit,
      sessionStats: {
        totalAttempts: 0,
        correctAnswers: 0,
        currentStreak: 0,
        bestStreak: 0
      }
    };
    
    // タイマーを開始
    this.startTimer();
    
    return this.currentSession;
  }
  
  /**
   * セッションを終了
   */
  public endSession(): TrainingSession | null {
    if (!this.currentSession) return null;
    
    // タイマーを停止
    this.stopTimer();
    
    // セッションを完了
    this.currentSession.endTime = new Date();
    const statistics = this.calculateStatistics();
    if (statistics) {
      this.currentSession.statistics = statistics;
    }
    
    // 履歴に追加
    this.sessionHistory.push(this.currentSession);
    
    // 状態を更新
    this.currentState.isActive = false;
    this.currentState.currentPhase = 'finished';
    
    // データを保存
    if (this.user) {
      this.saveToFirestore();
    } else {
      this.saveToStorage();
    }
    
    const completedSession = this.currentSession;
    this.currentSession = null;
    
    return completedSession;
  }
  
  /**
   * セッションを一時停止
   */
  public pauseSession(): void {
    if (this.currentSession && this.currentState.isActive) {
      this.stopTimer();
      this.currentState.currentPhase = 'waiting';
    }
  }
  
  /**
   * セッションを再開
   */
  public resumeSession(): void {
    if (this.currentSession && this.currentState.currentPhase === 'waiting') {
      this.currentState.currentPhase = 'active';
      this.startTimer();
    }
  }
  
  /**
   * カードに対する回答を記録
   */
  public recordAnswer(cardId: number, correct: boolean): TrainingResult {
    if (!this.currentSession) {
      throw new Error('アクティブなセッションがありません');
    }
    
    const responseTime = Date.now() - this.startTime;
    const result: TrainingResult = {
      cardId,
      responseTime,
      correct,
      timestamp: new Date(),
      kimarijiLength: this.getKimarijiLength(cardId)
    };
    
    // 結果を記録
    this.currentSession.results.push(result);
    
    // 統計を更新
    this.updateStats(correct);
    
    return result;
  }
  
  /**
   * 次のカードを設定
   */
  public setCurrentCard(card: HyakuninIsshuCard): void {
    this.currentState.currentCard = card;
    this.startTime = Date.now();
  }
  
  /**
   * 現在のセッション状態を取得
   */
  public getCurrentState(): TrainingState {
    return { ...this.currentState };
  }
  
  /**
   * 現在のセッションを取得
   */
  public getCurrentSession(): TrainingSession | null {
    return this.currentSession;
  }
  
  /**
   * セッション履歴を取得
   */
  public getSessionHistory(): TrainingSession[] {
    return [...this.sessionHistory];
  }
  
  /**
   * 特定のモードの統計を取得
   */
  public getStatsByMode(mode: 'memorization' | 'reaction' | 'competition'): {
    totalSessions: number;
    averageCorrectRate: number;
    averageResponseTime: number;
    bestSession: TrainingSession | null;
  } {
    const sessions = this.sessionHistory.filter(s => s.mode === mode && s.statistics);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageCorrectRate: 0,
        averageResponseTime: 0,
        bestSession: null
      };
    }
    
    const totalCorrectRate = sessions.reduce((sum, s) => {
      const rate = s.statistics!.correctAnswers / s.statistics!.totalCards;
      return sum + rate;
    }, 0);
    
    const totalResponseTime = sessions.reduce((sum, s) => sum + s.statistics!.averageResponseTime, 0);
    
    const bestSession = sessions.reduce((best, current) => {
      const currentRate = current.statistics!.correctAnswers / current.statistics!.totalCards;
      const bestRate = best.statistics!.correctAnswers / best.statistics!.totalCards;
      return currentRate > bestRate ? current : best;
    });
    
    return {
      totalSessions: sessions.length,
      averageCorrectRate: totalCorrectRate / sessions.length,
      averageResponseTime: totalResponseTime / sessions.length,
      bestSession
    };
  }
  
  /**
   * データをクリア
   */
  public clearHistory(): void {
    this.sessionHistory = [];
    if (this.user) {
      this.saveToFirestore();
    } else {
      this.saveToStorage();
    }
  }
  
  // プライベートメソッド
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private startTimer(): void {
    this.stopTimer();
    
    this.timer = setInterval(() => {
      this.currentState.timeRemaining--;
      
      if (this.currentState.timeRemaining <= 0) {
        this.onTimeUp();
      }
    }, 1000);
  }
  
  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  private onTimeUp(): void {
    if (this.currentState.currentPhase === 'memorization') {
      // 暗記時間終了 → 回答フェーズへ
      this.currentState.currentPhase = 'active';
      this.currentState.timeRemaining = this.currentSession!.settings.timeLimit;
    } else {
      // 制限時間終了 → セッション終了
      this.endSession();
    }
  }
  
  private updateStats(correct: boolean): void {
    this.currentState.sessionStats.totalAttempts++;
    
    if (correct) {
      this.currentState.sessionStats.correctAnswers++;
      this.currentState.sessionStats.currentStreak++;
      
      if (this.currentState.sessionStats.currentStreak > this.currentState.sessionStats.bestStreak) {
        this.currentState.sessionStats.bestStreak = this.currentState.sessionStats.currentStreak;
      }
    } else {
      this.currentState.sessionStats.currentStreak = 0;
    }
  }
  
  private calculateStatistics(): TrainingSession['statistics'] {
    if (!this.currentSession) return undefined;
    
    const results = this.currentSession.results;
    const correctResults = results.filter(r => r.correct);
    
    return {
      totalCards: results.length,
      correctAnswers: correctResults.length,
      averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
      fastestResponse: Math.min(...results.map(r => r.responseTime)),
      slowestResponse: Math.max(...results.map(r => r.responseTime))
    };
  }
  
  private getKimarijiLength(cardId: number): number {
    // 決まり字データベースから決まり字長を取得
    // 実際の実装では kimarijiDatabase を使用
    return 1; // 仮の値
  }
  
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(TrainingGameManager.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.sessionHistory = data.sessions || [];
      }
    } catch (error) {
      console.warn('トレーニングセッション履歴の読み込みに失敗しました:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      const data = {
        sessions: this.sessionHistory
      };
      localStorage.setItem(TrainingGameManager.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('トレーニングセッション履歴の保存に失敗しました:', error);
    }
  }
  
  /**
   * Firestoreからデータを読み込み
   */
  private async loadFromFirestore(): Promise<void> {
    if (!this.user) return;
    
    try {
      const userDocRef = doc(db, 'users', this.user.uid);
      const trainingDocRef = doc(userDocRef, 'training', 'sessions');
      
      // リアルタイムリスナーを設定
      this.unsubscribeListener = onSnapshot(trainingDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          
          // セッション履歴を復元
          if (data.sessions) {
            this.sessionHistory = data.sessions.map((session: any) => ({
              ...session,
              startTime: session.startTime?.toDate ? session.startTime.toDate() : new Date(session.startTime),
              endTime: session.endTime?.toDate ? session.endTime.toDate() : (session.endTime ? new Date(session.endTime) : undefined)
            }));
          }
        }
      });
    } catch (error) {
      console.warn('Firestoreからのトレーニングセッションデータ読み込みに失敗しました:', error);
      // フォールバックとしてローカルストレージを使用
      this.loadFromStorage();
    }
  }
  
  /**
   * Firestoreにデータを保存
   */
  private async saveToFirestore(): Promise<void> {
    if (!this.user) return;
    
    try {
      const userDocRef = doc(db, 'users', this.user.uid);
      const trainingDocRef = doc(userDocRef, 'training', 'sessions');
      
      const data = {
        sessions: this.sessionHistory,
        lastUpdated: serverTimestamp()
      };
      
      await setDoc(trainingDocRef, data, { merge: true });
    } catch (error) {
      console.warn('Firestoreへのトレーニングセッションデータ保存に失敗しました:', error);
    }
  }
  
  /**
   * リスナーのクリーンアップ
   */
  private cleanup(): void {
    if (this.unsubscribeListener) {
      this.unsubscribeListener();
      this.unsubscribeListener = null;
    }
  }
}