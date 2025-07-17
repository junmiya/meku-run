import { HyakuninIsshuCard } from '../types/WordCard';
import { TrainingResult, TrainingSession } from './TrainingGameManager';

/**
 * カードの成績情報
 */
export interface CardPerformance {
  cardId: number;
  totalAttempts: number;
  correctAnswers: number;
  averageResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  recentAttempts: TrainingResult[];
  difficulty: 'easy' | 'medium' | 'hard';
  lastPracticed: Date;
}

/**
 * 決まり字レベル別成績
 */
export interface KimarijiLevelPerformance {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  totalAttempts: number;
  correctAnswers: number;
  averageResponseTime: number;
  improvementRate: number; // 最近の改善率
  recommendedPractice: boolean;
}

/**
 * 全体的な成績分析
 */
export interface PerformanceAnalysis {
  overallStats: {
    totalSessions: number;
    totalCards: number;
    totalCorrectAnswers: number;
    overallAccuracy: number;
    averageResponseTime: number;
    improvementTrend: 'improving' | 'stable' | 'declining';
  };
  kimarijiLevels: KimarijiLevelPerformance[];
  weakCards: CardPerformance[];
  strongCards: CardPerformance[];
  recommendations: string[];
}

/**
 * 学習進捗の追跡
 */
export interface LearningProgress {
  beginner: {
    completed: boolean;
    accuracy: number;
    timeSpent: number; // 分
  };
  intermediate: {
    completed: boolean;
    accuracy: number;
    timeSpent: number;
  };
  advanced: {
    completed: boolean;
    accuracy: number;
    timeSpent: number;
  };
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  nextGoal: string;
}

/**
 * パフォーマンス分析と追跡の管理クラス
 */
export class PerformanceManager {
  private static readonly STORAGE_KEY = 'hyakunin-isshu-performance-data';
  private static instance: PerformanceManager;
  
  private cardPerformances: Map<number, CardPerformance> = new Map();
  private sessionHistory: TrainingSession[] = [];
  
  private constructor() {
    // クライアントサイドでのみローカルストレージを読み込み
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }
  
  /**
   * シングルトンインスタンスの取得
   */
  public static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }
  
  /**
   * トレーニング結果を記録
   */
  public recordTrainingResult(result: TrainingResult): void {
    const cardId = result.cardId;
    let performance = this.cardPerformances.get(cardId);
    
    if (!performance) {
      performance = {
        cardId,
        totalAttempts: 0,
        correctAnswers: 0,
        averageResponseTime: 0,
        fastestResponse: Infinity,
        slowestResponse: 0,
        recentAttempts: [],
        difficulty: 'medium',
        lastPracticed: new Date()
      };
    }
    
    // 統計を更新
    performance.totalAttempts++;
    if (result.correct) {
      performance.correctAnswers++;
    }
    
    // 反応時間を更新
    performance.averageResponseTime = (
      (performance.averageResponseTime * (performance.totalAttempts - 1) + result.responseTime) /
      performance.totalAttempts
    );
    
    performance.fastestResponse = Math.min(performance.fastestResponse, result.responseTime);
    performance.slowestResponse = Math.max(performance.slowestResponse, result.responseTime);
    
    // 最近の試行を記録（最大10件）
    performance.recentAttempts.push(result);
    if (performance.recentAttempts.length > 10) {
      performance.recentAttempts.shift();
    }
    
    // 難易度を更新
    performance.difficulty = this.calculateDifficulty(performance);
    performance.lastPracticed = new Date();
    
    this.cardPerformances.set(cardId, performance);
    this.saveToStorage();
  }
  
  /**
   * セッション履歴を更新
   */
  public updateSessionHistory(session: TrainingSession): void {
    this.sessionHistory.push(session);
    
    // セッションの各結果を記録
    session.results.forEach(result => {
      this.recordTrainingResult(result);
    });
    
    this.saveToStorage();
  }
  
  /**
   * カードの成績を取得
   */
  public getCardPerformance(cardId: number): CardPerformance | undefined {
    return this.cardPerformances.get(cardId);
  }
  
  /**
   * 全体的な成績分析を取得
   */
  public getPerformanceAnalysis(): PerformanceAnalysis {
    const allCards = Array.from(this.cardPerformances.values());
    const totalAttempts = allCards.reduce((sum, card) => sum + card.totalAttempts, 0);
    const totalCorrect = allCards.reduce((sum, card) => sum + card.correctAnswers, 0);
    
    // 決まり字レベル別の成績
    const kimarijiLevels = this.getKimarijiLevelPerformances();
    
    // 弱い札と強い札を特定
    const weakCards = this.getWeakCards(5);
    const strongCards = this.getStrongCards(5);
    
    // 推奨事項を生成
    const recommendations = this.generateRecommendations(weakCards, kimarijiLevels);
    
    return {
      overallStats: {
        totalSessions: this.sessionHistory.length,
        totalCards: allCards.length,
        totalCorrectAnswers: totalCorrect,
        overallAccuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
        averageResponseTime: this.calculateOverallAverageResponseTime(),
        improvementTrend: this.calculateImprovementTrend()
      },
      kimarijiLevels,
      weakCards,
      strongCards,
      recommendations
    };
  }
  
  /**
   * 苦手札を取得
   */
  public getWeakCards(limit: number = 10): CardPerformance[] {
    return Array.from(this.cardPerformances.values())
      .filter(card => card.totalAttempts >= 3) // 最低3回は試行
      .sort((a, b) => {
        const aAccuracy = a.correctAnswers / a.totalAttempts;
        const bAccuracy = b.correctAnswers / b.totalAttempts;
        return aAccuracy - bAccuracy; // 正解率の低い順
      })
      .slice(0, limit);
  }
  
  /**
   * 得意札を取得
   */
  public getStrongCards(limit: number = 10): CardPerformance[] {
    return Array.from(this.cardPerformances.values())
      .filter(card => card.totalAttempts >= 3) // 最低3回は試行
      .sort((a, b) => {
        const aAccuracy = a.correctAnswers / a.totalAttempts;
        const bAccuracy = b.correctAnswers / b.totalAttempts;
        return bAccuracy - aAccuracy; // 正解率の高い順
      })
      .slice(0, limit);
  }
  
  /**
   * 学習進捗を取得
   */
  public getLearningProgress(): LearningProgress {
    const analysis = this.getPerformanceAnalysis();
    const accuracy = analysis.overallStats.overallAccuracy;
    const totalTime = this.calculateTotalStudyTime();
    
    let currentLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    let nextGoal = '1字決まりを完全に覚える';
    
    if (accuracy >= 0.9 && totalTime >= 180) { // 90%以上、3時間以上
      currentLevel = 'advanced';
      nextGoal = '競技レベルの速度を目指す';
    } else if (accuracy >= 0.7 && totalTime >= 60) { // 70%以上、1時間以上
      currentLevel = 'intermediate';
      nextGoal = '全ての決まり字を習得する';
    }
    
    return {
      beginner: {
        completed: accuracy >= 0.5,
        accuracy: Math.min(accuracy * 2, 1), // 初級者向けの調整
        timeSpent: Math.min(totalTime, 60)
      },
      intermediate: {
        completed: accuracy >= 0.7,
        accuracy: Math.max(0, (accuracy - 0.5) * 2.5), // 中級者向けの調整
        timeSpent: Math.max(0, Math.min(totalTime - 60, 120))
      },
      advanced: {
        completed: accuracy >= 0.9,
        accuracy: Math.max(0, (accuracy - 0.7) * 5), // 上級者向けの調整
        timeSpent: Math.max(0, totalTime - 180)
      },
      currentLevel,
      nextGoal
    };
  }
  
  /**
   * 決まり字レベル別の推奨練習を取得
   */
  public getRecommendedPractice(): {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    reason: string;
    expectedImprovement: number;
  }[] {
    const kimarijiLevels = this.getKimarijiLevelPerformances();
    
    return kimarijiLevels
      .filter(level => level.recommendedPractice)
      .map(level => ({
        level: level.level,
        reason: this.getRecommendationReason(level),
        expectedImprovement: level.improvementRate
      }))
      .sort((a, b) => b.expectedImprovement - a.expectedImprovement);
  }
  
  /**
   * データをクリア
   */
  public clearData(): void {
    this.cardPerformances.clear();
    this.sessionHistory = [];
    this.saveToStorage();
  }
  
  // プライベートメソッド
  
  private calculateDifficulty(performance: CardPerformance): 'easy' | 'medium' | 'hard' {
    const accuracy = performance.correctAnswers / performance.totalAttempts;
    const avgResponseTime = performance.averageResponseTime;
    
    if (accuracy >= 0.8 && avgResponseTime <= 2000) return 'easy';
    if (accuracy >= 0.6 && avgResponseTime <= 4000) return 'medium';
    return 'hard';
  }
  
  private getKimarijiLevelPerformances(): KimarijiLevelPerformance[] {
    const levels: KimarijiLevelPerformance[] = [];
    
    for (let level = 1; level <= 6; level++) {
      const cards = this.getCardsByKimarijiLevel(level as 1 | 2 | 3 | 4 | 5 | 6);
      const totalAttempts = cards.reduce((sum, card) => sum + card.totalAttempts, 0);
      const correctAnswers = cards.reduce((sum, card) => sum + card.correctAnswers, 0);
      const avgResponseTime = cards.length > 0 ? 
        cards.reduce((sum, card) => sum + card.averageResponseTime, 0) / cards.length : 0;
      
      levels.push({
        level: level as 1 | 2 | 3 | 4 | 5 | 6,
        totalAttempts,
        correctAnswers,
        averageResponseTime: avgResponseTime,
        improvementRate: this.calculateImprovementRate(level as 1 | 2 | 3 | 4 | 5 | 6),
        recommendedPractice: totalAttempts > 0 ? correctAnswers / totalAttempts < 0.7 : true
      });
    }
    
    return levels;
  }
  
  private getCardsByKimarijiLevel(level: 1 | 2 | 3 | 4 | 5 | 6): CardPerformance[] {
    // 実際の実装では kimarijiDatabase を使用してレベル別のカードを取得
    return Array.from(this.cardPerformances.values())
      .filter(card => this.getKimarijiLevelForCard(card.cardId) === level);
  }
  
  private getKimarijiLevelForCard(cardId: number): number {
    // 実際の実装では kimarijiDatabase から取得
    return Math.floor(Math.random() * 6) + 1; // 仮の値
  }
  
  private calculateOverallAverageResponseTime(): number {
    const allCards = Array.from(this.cardPerformances.values());
    if (allCards.length === 0) return 0;
    
    const totalTime = allCards.reduce((sum, card) => sum + card.averageResponseTime, 0);
    return totalTime / allCards.length;
  }
  
  private calculateImprovementTrend(): 'improving' | 'stable' | 'declining' {
    if (this.sessionHistory.length < 2) return 'stable';
    
    const recentSessions = this.sessionHistory.slice(-5); // 最近5セッション
    const accuracies = recentSessions.map(session => {
      if (!session.statistics) return 0;
      return session.statistics.correctAnswers / session.statistics.totalCards;
    });
    
    const firstHalf = accuracies.slice(0, Math.floor(accuracies.length / 2));
    const secondHalf = accuracies.slice(Math.floor(accuracies.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, acc) => sum + acc, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, acc) => sum + acc, 0) / secondHalf.length;
    
    const improvement = secondAvg - firstAvg;
    
    if (improvement > 0.05) return 'improving';
    if (improvement < -0.05) return 'declining';
    return 'stable';
  }
  
  private calculateImprovementRate(level: 1 | 2 | 3 | 4 | 5 | 6): number {
    // 最近のセッションでの改善率を計算
    const recentSessions = this.sessionHistory.slice(-3);
    if (recentSessions.length < 2) return 0;
    
    const levelResults = recentSessions.flatMap(session => 
      session.results.filter(result => result.kimarijiLength === level)
    );
    
    if (levelResults.length < 2) return 0;
    
    const midPoint = Math.floor(levelResults.length / 2);
    const firstHalf = levelResults.slice(0, midPoint);
    const secondHalf = levelResults.slice(midPoint);
    
    const firstAccuracy = firstHalf.filter(r => r.correct).length / firstHalf.length;
    const secondAccuracy = secondHalf.filter(r => r.correct).length / secondHalf.length;
    
    return secondAccuracy - firstAccuracy;
  }
  
  private calculateTotalStudyTime(): number {
    // セッション履歴から総学習時間を計算（分）
    return this.sessionHistory.reduce((total, session) => {
      if (!session.endTime) return total;
      const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60;
      return total + duration;
    }, 0);
  }
  
  private generateRecommendations(
    weakCards: CardPerformance[],
    kimarijiLevels: KimarijiLevelPerformance[]
  ): string[] {
    const recommendations: string[] = [];
    
    // 苦手札に基づく推奨
    if (weakCards.length > 0) {
      const weakestCard = weakCards[0];
      if (weakestCard) {
        const accuracy = weakestCard.correctAnswers / weakestCard.totalAttempts;
        if (accuracy < 0.3) {
          recommendations.push(`${weakestCard.cardId}番の札を集中的に練習しましょう`);
        }
      }
    }
    
    // 決まり字レベルに基づく推奨
    const weakestLevel = kimarijiLevels.find(level => 
      level.totalAttempts > 0 && level.correctAnswers / level.totalAttempts < 0.5
    );
    if (weakestLevel) {
      recommendations.push(`${weakestLevel.level}字決まりの練習を強化しましょう`);
    }
    
    // 全体的な推奨
    const overallAccuracy = kimarijiLevels.reduce((sum, level) => {
      return sum + (level.totalAttempts > 0 ? level.correctAnswers / level.totalAttempts : 0);
    }, 0) / kimarijiLevels.length;
    
    if (overallAccuracy < 0.5) {
      recommendations.push('基本的な1字決まりから始めましょう');
    } else if (overallAccuracy < 0.7) {
      recommendations.push('2字決まりの練習を増やしましょう');
    } else {
      recommendations.push('競技レベルの速度向上を目指しましょう');
    }
    
    return recommendations;
  }
  
  private getRecommendationReason(level: KimarijiLevelPerformance): string {
    const accuracy = level.totalAttempts > 0 ? level.correctAnswers / level.totalAttempts : 0;
    
    if (accuracy < 0.3) return '正解率が低いため基礎から練習が必要';
    if (accuracy < 0.7) return '正解率向上のため反復練習が効果的';
    if (level.averageResponseTime > 3000) return '反応時間短縮のため速度練習が必要';
    return '更なる上達のため継続練習が推奨';
  }
  
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(PerformanceManager.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // カード成績を復元
        if (data.cardPerformances) {
          this.cardPerformances = new Map(data.cardPerformances);
        }
        
        // セッション履歴を復元
        if (data.sessionHistory) {
          this.sessionHistory = data.sessionHistory.map((session: any) => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined
          }));
        }
      }
    } catch (error) {
      console.warn('パフォーマンスデータの読み込みに失敗しました:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      const data = {
        cardPerformances: Array.from(this.cardPerformances.entries()),
        sessionHistory: this.sessionHistory
      };
      localStorage.setItem(PerformanceManager.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('パフォーマンスデータの保存に失敗しました:', error);
    }
  }
}