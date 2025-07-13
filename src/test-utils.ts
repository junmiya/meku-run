// Test utilities and helpers
import { WordCard } from './types/WordCard';

// Test用のWordCard作成ヘルパー（型安全性を緩和）
export const createMockCard = (overrides: Partial<WordCard> = {}): WordCard => ({
  id: '1',
  word: 'test',
  meaning: 'テスト',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});