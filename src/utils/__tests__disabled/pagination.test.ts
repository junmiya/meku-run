import { WordCard } from '../../types/WordCard';
import { FilterManager, PaginationManager } from '../pagination';

const mockCards: WordCard[] = [
  {
    id: '1',
    word: 'accomplish',
    meaning: '達成する',
    created_at: '2025-01-10T00:00:00.000Z',
    updated_at: '2025-01-10T00:00:00.000Z',
    tags: ['動詞', 'ビジネス'],
    isStarred: true,
  },
  {
    id: '2',
    word: 'budget',
    meaning: '予算',
    created_at: '2025-01-11T00:00:00.000Z',
    updated_at: '2025-01-11T00:00:00.000Z',
    tags: ['名詞', '経済'],
    isStarred: false,
  },
  {
    id: '3',
    word: 'comprehensive',
    meaning: '包括的な',
    created_at: '2025-01-12T00:00:00.000Z',
    updated_at: '2025-01-12T00:00:00.000Z',
    tags: ['形容詞', 'ビジネス'],
    isStarred: true,
  },
];

describe('PaginationManager', () => {
  describe('getPageItems', () => {
    it('returns correct items for first page', () => {
      const result = PaginationManager.getPageItems(mockCards, 1, 2);
      expect(result).toHaveLength(2);
      expect(result[0]!.id).toBe('1');
      expect(result[1]!.id).toBe('2');
    });

    it('returns correct items for second page', () => {
      const result = PaginationManager.getPageItems(mockCards, 2, 2);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('returns empty array for page beyond available items', () => {
      const result = PaginationManager.getPageItems(mockCards, 3, 2);
      expect(result).toHaveLength(0);
    });

    it('handles single item per page', () => {
      const result = PaginationManager.getPageItems(mockCards, 2, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('getTotalPages', () => {
    it('calculates total pages correctly', () => {
      expect(PaginationManager.getTotalPages(10, 3)).toBe(4);
      expect(PaginationManager.getTotalPages(9, 3)).toBe(3);
      expect(PaginationManager.getTotalPages(0, 3)).toBe(0);
    });

    it('handles edge cases', () => {
      expect(PaginationManager.getTotalPages(1, 1)).toBe(1);
      expect(PaginationManager.getTotalPages(5, 10)).toBe(1);
    });
  });
});

describe('FilterManager', () => {
  describe('filterCards', () => {
    it('filters by search query in word', () => {
      const result = FilterManager.filterCards(mockCards, 'accomplish', '', false);
      expect(result).toHaveLength(1);
      expect(result[0].word).toBe('accomplish');
    });

    it('filters by search query in meaning', () => {
      const result = FilterManager.filterCards(mockCards, '達成', '', false);
      expect(result).toHaveLength(1);
      expect(result[0].word).toBe('accomplish');
    });

    it('filters by tag', () => {
      const result = FilterManager.filterCards(mockCards, '', 'ビジネス', false);
      expect(result).toHaveLength(2);
      expect(result.map(card => card.word)).toEqual(['accomplish', 'comprehensive']);
    });

    it('filters by starred status', () => {
      const result = FilterManager.filterCards(mockCards, '', '', true);
      expect(result).toHaveLength(2);
      expect(result.every(card => card.isStarred)).toBe(true);
    });

    it('applies multiple filters', () => {
      const result = FilterManager.filterCards(mockCards, '', 'ビジネス', true);
      expect(result).toHaveLength(2);
      expect(result.every(card => card.isStarred && card.tags?.includes('ビジネス'))).toBe(true);
    });

    it('returns all cards when no filters applied', () => {
      const result = FilterManager.filterCards(mockCards, '', '', false);
      expect(result).toHaveLength(3);
    });

    it('handles case-insensitive search', () => {
      const result = FilterManager.filterCards(mockCards, 'ACCOMPLISH', '', false);
      expect(result).toHaveLength(1);
      expect(result[0].word).toBe('accomplish');
    });
  });

  describe('sortCards', () => {
    it('sorts by created date ascending', () => {
      const result = FilterManager.sortCards(mockCards, 'createdAt', 'asc');
      expect(result[0].word).toBe('accomplish');
      expect(result[2].word).toBe('comprehensive');
    });

    it('sorts by created date descending', () => {
      const result = FilterManager.sortCards(mockCards, 'createdAt', 'desc');
      expect(result[0].word).toBe('comprehensive');
      expect(result[2].word).toBe('accomplish');
    });

    it('sorts alphabetically ascending', () => {
      const result = FilterManager.sortCards(mockCards, 'alphabetical', 'asc');
      expect(result[0].word).toBe('accomplish');
      expect(result[1].word).toBe('budget');
      expect(result[2].word).toBe('comprehensive');
    });

    it('sorts alphabetically descending', () => {
      const result = FilterManager.sortCards(mockCards, 'alphabetical', 'desc');
      expect(result[0].word).toBe('comprehensive');
      expect(result[1].word).toBe('budget');
      expect(result[2].word).toBe('accomplish');
    });

    it('does not mutate original array', () => {
      const original = [...mockCards];
      FilterManager.sortCards(mockCards, 'alphabetical', 'asc');
      expect(mockCards).toEqual(original);
    });
  });

  describe('getAllTags', () => {
    it('returns unique tags from all cards', () => {
      const tags = FilterManager.getAllTags(mockCards);
      expect(tags).toEqual(['ビジネス', '動詞', '名詞', '形容詞', '経済']);
    });

    it('returns sorted tags', () => {
      const tags = FilterManager.getAllTags(mockCards);
      const sortedTags = [...tags].sort();
      expect(tags).toEqual(sortedTags);
    });

    it('handles cards without tags', () => {
      const cardsWithoutTags = [
        { ...mockCards[0], tags: undefined },
        { ...mockCards[1], tags: [] },
      ];
      const tags = FilterManager.getAllTags(cardsWithoutTags);
      expect(tags).toEqual([]);
    });

    it('returns empty array for empty input', () => {
      const tags = FilterManager.getAllTags([]);
      expect(tags).toEqual([]);
    });
  });
});
