import { WordCard } from '../../types/WordCard';
import { generateId, LocalStorageManager } from '../storage';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const mockCards: WordCard[] = [
  {
    id: '1',
    word: 'test',
    meaning: 'テスト',
    created_at: '2025-01-12T10:00:00.000Z',
    updated_at: '2025-01-12T10:00:00.000Z',
    tags: ['テスト'],
    isStarred: true,
  },
  {
    id: '2',
    word: 'example',
    meaning: '例',
    created_at: '2025-01-12T11:00:00.000Z',
    updated_at: '2025-01-12T11:00:00.000Z',
  },
];

describe('LocalStorageManager', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('saves cards to localStorage', () => {
      LocalStorageManager.save(mockCards);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'word-card-app',
        JSON.stringify(mockCards)
      );
    });

    it('handles save errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      expect(() => LocalStorageManager.save(mockCards)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to localStorage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('load', () => {
    it('loads cards from localStorage', () => {
      const serializedCards = JSON.stringify(mockCards);
      mockLocalStorage.getItem.mockReturnValueOnce(serializedCards);

      const loaded = LocalStorageManager.load();

      expect(loaded).toHaveLength(2);
      expect(loaded[0].word).toBe('test');
      expect(loaded[0].created_at).toBe('2025-01-12T10:00:00.000Z');
      expect(loaded[0].updated_at).toBe('2025-01-12T10:00:00.000Z');
    });

    it('returns empty array when no data exists', () => {
      const loaded = LocalStorageManager.load();

      expect(loaded).toEqual([]);
    });

    it('handles load errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.getItem.mockImplementationOnce(() => {
        throw new Error('Parse error');
      });

      const loaded = LocalStorageManager.load();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load from localStorage:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.getItem.mockReturnValueOnce('invalid-json');

      const loaded = LocalStorageManager.load();

      expect(loaded).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('clears localStorage', () => {
      LocalStorageManager.clear();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('word-card-app');
    });

    it('handles clear errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockLocalStorage.removeItem.mockImplementationOnce(() => {
        throw new Error('Clear failed');
      });

      expect(() => LocalStorageManager.clear()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear localStorage:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  it('generates IDs with reasonable length', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(10);
    expect(id.length).toBeLessThan(20);
  });
});
