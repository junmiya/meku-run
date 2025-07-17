/**
 * Firestore データベース構造の型定義
 * 百人一首競技・トレーニングシステム用
 */

import { Timestamp } from 'firebase/firestore';

/**
 * ユーザープロフィール
 * パス: users/{userId}/profile/profile
 */
export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  totalStudyTime: number; // 分
  totalSessions: number;
  preferredKimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

/**
 * トレーニング進捗
 * パス: users/{userId}/progress/performance
 */
export interface UserProgress {
  userId: string;
  cardPerformances: [number, CardPerformance][]; // Map → Array for Firestore
  sessionHistory: TrainingSession[];
  lastUpdated: Timestamp;
}

/**
 * トレーニングセッション履歴
 * パス: users/{userId}/training/sessions
 */
export interface TrainingSessionHistory {
  userId: string;
  sessions: TrainingSession[];
  lastUpdated: Timestamp;
}

/**
 * カード成績情報
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
  lastPracticed: Timestamp;
}

/**
 * トレーニング結果
 */
export interface TrainingResult {
  cardId: number;
  responseTime: number;
  correct: boolean;
  timestamp: Timestamp;
  kimarijiLength: number;
}

/**
 * トレーニングセッション
 */
export interface TrainingSession {
  sessionId: string;
  userId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  mode: 'memorization' | 'reaction' | 'competition';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  settings: {
    timeLimit: number;
    memorizationTime: number;
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
 * 競技記録
 * パス: competitions/{competitionId}/records/{recordId}
 */
export interface CompetitionRecord {
  recordId: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  sessionId: string;
  competitionType: 'time_attack' | 'accuracy' | 'mixed';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  
  // 記録詳細
  totalTime: number; // 総時間（秒）
  totalCards: number;
  correctAnswers: number;
  accuracy: number; // 正解率
  averageResponseTime: number;
  fastestResponse: number;
  
  // スコア計算
  totalScore: number; // 総合スコア
  timeBonus: number; // 時間ボーナス
  accuracyBonus: number; // 正解率ボーナス
  
  // メタデータ
  createdAt: Timestamp;
  deviceInfo?: {
    platform: string;
    userAgent: string;
  };
}

/**
 * 競技セッション
 * パス: competitions/{competitionId}/sessions/{sessionId}
 */
export interface CompetitionSession {
  sessionId: string;
  competitionId: string;
  userId: string;
  userName: string;
  
  // セッション設定
  competitionType: 'time_attack' | 'accuracy' | 'mixed';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  settings: {
    timeLimit: number;
    memorizationTime: number;
    judgeMode: 'strict' | 'normal' | 'lenient';
  };
  
  // セッション状態
  status: 'preparing' | 'memorizing' | 'active' | 'finished' | 'cancelled';
  startTime: Timestamp;
  endTime?: Timestamp;
  
  // 結果
  results: TrainingResult[];
  finalRecord?: CompetitionRecord;
  
  // メタデータ
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * リーダーボード
 * パス: leaderboards/{boardType}
 */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userPhotoURL?: string;
  recordId: string;
  
  // ランキング情報
  rank: number;
  score: number;
  totalTime: number;
  accuracy: number;
  averageResponseTime: number;
  
  // 記録詳細
  competitionType: 'time_attack' | 'accuracy' | 'mixed';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  achievedAt: Timestamp;
  
  // 統計情報
  totalAttempts: number;
  bestStreak: number;
}

/**
 * 全体統計
 * パス: globalStats/statistics
 */
export interface GlobalStatistics {
  totalUsers: number;
  totalSessions: number;
  totalCompetitions: number;
  
  // 期間別統計
  daily: {
    activeUsers: number;
    completedSessions: number;
    averageSessionTime: number;
  };
  
  weekly: {
    activeUsers: number;
    completedSessions: number;
    topPerformers: string[]; // userIds
  };
  
  monthly: {
    activeUsers: number;
    completedSessions: number;
    topPerformers: string[];
  };
  
  // 決まり字レベル別統計
  kimarijiStats: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    totalAttempts: number;
    averageAccuracy: number;
    averageResponseTime: number;
    topPerformers: string[];
  }[];
  
  lastUpdated: Timestamp;
}

/**
 * 競技イベント
 * パス: events/{eventId}
 */
export interface CompetitionEvent {
  eventId: string;
  title: string;
  description: string;
  
  // イベント設定
  competitionType: 'time_attack' | 'accuracy' | 'mixed';
  kimarijiLevel: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
  
  // 期間
  startDate: Timestamp;
  endDate: Timestamp;
  
  // 参加者
  participants: string[]; // userIds
  maxParticipants?: number;
  
  // 結果
  leaderboard: LeaderboardEntry[];
  
  // 状態
  status: 'upcoming' | 'active' | 'finished' | 'cancelled';
  
  // メタデータ
  createdBy: string; // adminUserId
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Firestore コレクション構造
 */
export interface FirestoreCollections {
  // ユーザー関連
  users: {
    [userId: string]: {
      profile: {
        profile: UserProfile;
      };
      progress: {
        performance: UserProgress;
      };
      training: {
        sessions: TrainingSessionHistory;
      };
    };
  };
  
  // 競技関連
  competitions: {
    [competitionId: string]: {
      records: {
        [recordId: string]: CompetitionRecord;
      };
      sessions: {
        [sessionId: string]: CompetitionSession;
      };
    };
  };
  
  // リーダーボード
  leaderboards: {
    'time_attack_1': LeaderboardEntry[];
    'time_attack_2': LeaderboardEntry[];
    'time_attack_3': LeaderboardEntry[];
    'time_attack_4': LeaderboardEntry[];
    'time_attack_5': LeaderboardEntry[];
    'time_attack_6': LeaderboardEntry[];
    'time_attack_mixed': LeaderboardEntry[];
    'accuracy_1': LeaderboardEntry[];
    'accuracy_2': LeaderboardEntry[];
    'accuracy_3': LeaderboardEntry[];
    'accuracy_4': LeaderboardEntry[];
    'accuracy_5': LeaderboardEntry[];
    'accuracy_6': LeaderboardEntry[];
    'accuracy_mixed': LeaderboardEntry[];
    'overall': LeaderboardEntry[];
  };
  
  // 全体統計
  globalStats: {
    statistics: GlobalStatistics;
  };
  
  // イベント
  events: {
    [eventId: string]: CompetitionEvent;
  };
}

/**
 * Firestore クエリ用のヘルパー型
 */
export type CompetitionType = 'time_attack' | 'accuracy' | 'mixed';
export type KimarijiLevel = 1 | 2 | 3 | 4 | 5 | 6 | 'mixed';
export type LeaderboardType = `${CompetitionType}_${KimarijiLevel}` | 'overall';
export type JudgeMode = 'strict' | 'normal' | 'lenient';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SessionStatus = 'preparing' | 'memorizing' | 'active' | 'finished' | 'cancelled';
export type EventStatus = 'upcoming' | 'active' | 'finished' | 'cancelled';