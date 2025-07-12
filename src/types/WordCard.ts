export interface WordCard {
  id: string;
  word: string;
  meaning: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isStarred?: boolean;
}

export interface AppState {
  wordCards: {
    items: WordCard[];
    totalCount: number;
    currentPage: number;
    itemsPerPage: number;
    isLoading: boolean;
    error: string | null;
  };
  ui: {
    selectedCardId: string | null;
    isEditMode: boolean;
    searchQuery: string;
    sortBy: 'createdAt' | 'updatedAt' | 'alphabetical';
    sortOrder: 'asc' | 'desc';
  };
  settings: {
    storageType: 'localStorage' | 'supabase';
    itemsPerPage: number;
    theme: 'light' | 'dark';
  };
}