import { useEffect, useMemo, useState } from 'react';

import { useDataManager } from '../contexts/DataManagerContext';
import { generateSampleData } from '../data/sampleData';
import { WordCard } from '../types/WordCard';
import { FilterManager, PaginationManager } from '../utils/pagination';

interface UseWordCardsConfig {
  itemsPerPage?: number;
}

export const useWordCards = (config: UseWordCardsConfig = {}) => {
  const { itemsPerPage = 6 } = config;
  const { dataManager, isCloudMode } = useDataManager();

  // カードデータ
  const [cards, setCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ページネーション・フィルタ状態
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'alphabetical'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  // 初期データ読み込み
  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const savedCards = await dataManager.getAllCards();

        if (savedCards.length === 0) {
          const sampleCards = generateSampleData();
          const createdCards = await dataManager.createCards(sampleCards);
          setCards(createdCards);
        } else {
          setCards(savedCards);
        }
      } catch (err) {
        console.error('Error loading cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [dataManager]);

  // フィルタ・ソート処理
  const { filteredCards, availableTags, displayCards, totalPages } = useMemo(() => {
    const filtered = FilterManager.filterCards(cards, searchQuery, selectedTag, showStarredOnly);
    const sorted = FilterManager.sortCards(filtered, sortBy, sortOrder);
    const paginated = PaginationManager.getPageItems(sorted, currentPage, itemsPerPage);
    const totalPagesCount = PaginationManager.getTotalPages(sorted.length, itemsPerPage);
    const tags = FilterManager.getAllTags(cards);

    return {
      filteredCards: sorted,
      availableTags: tags,
      displayCards: paginated,
      totalPages: totalPagesCount,
    };
  }, [cards, currentPage, itemsPerPage, searchQuery, sortBy, sortOrder, showStarredOnly, selectedTag]);

  // フィルタ変更時のページリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag, showStarredOnly, sortBy, sortOrder]);

  // CRUD操作
  const createCard = async (cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCard = await dataManager.createCard(cardData);
      setCards(prev => [newCard, ...prev]);
    } catch (err) {
      console.error('Error creating card:', err);
      setError(err instanceof Error ? err.message : 'Failed to create card');
    }
  };

  const updateCard = async (id: string, cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const updatedCard = await dataManager.updateCard(id, cardData);
      setCards(prev =>
        prev.map(card => (card.id === id ? updatedCard : card))
      );
    } catch (err) {
      console.error('Error updating card:', err);
      setError(err instanceof Error ? err.message : 'Failed to update card');
    }
  };

  const deleteCard = async (id: string) => {
    if (window.confirm('このカードを削除しますか？')) {
      try {
        await dataManager.deleteCard(id);
        setCards(prev => prev.filter(card => card.id !== id));
      } catch (err) {
        console.error('Error deleting card:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete card');
      }
    }
  };

  const toggleStar = async (id: string) => {
    const card = cards.find(c => c.id === id);
    if (card) {
      try {
        const updatedCard = await dataManager.updateCard(id, {
          isStarred: !card.isStarred,
        });
        setCards(prev =>
          prev.map(c => (c.id === id ? updatedCard : c))
        );
      } catch (err) {
        console.error('Error toggling star:', err);
        setError(err instanceof Error ? err.message : 'Failed to update card');
      }
    }
  };

  const loadSampleData = async () => {
    if (window.confirm('現在のデータを削除してTOEIC700点レベルのサンプルデータを読み込みますか？')) {
      try {
        await dataManager.deleteAllCards();
        const sampleCards = generateSampleData();
        const createdCards = await dataManager.createCards(sampleCards);
        setCards(createdCards);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading sample data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sample data');
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    // データ
    cards,
    filteredCards,
    displayCards,
    availableTags,
    totalPages,

    // 状態
    loading,
    error,
    isCloudMode,

    // フィルタ・ページネーション状態
    currentPage,
    searchQuery,
    sortBy,
    sortOrder,
    showStarredOnly,
    selectedTag,
    itemsPerPage,

    // 状態更新関数
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setShowStarredOnly,
    setSelectedTag,
    handlePageChange,

    // CRUD操作
    createCard,
    updateCard,
    deleteCard,
    toggleStar,
    loadSampleData,
  };
};