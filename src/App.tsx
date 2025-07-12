import React, { useState, useEffect, useMemo } from 'react';
import { WordCard as WordCardType } from './types/WordCard';
import WordCard from './components/WordCard';
import CardForm from './components/CardForm';
import SearchFilter from './components/SearchFilter';
import Pagination from './components/Pagination';
import { LocalStorageManager, generateId } from './utils/storage';
import { PaginationManager, FilterManager } from './utils/pagination';
import './App.css';

function App() {
  const [cards, setCards] = useState<WordCardType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<WordCardType | undefined>();
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 1ページあたりのカード数
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'alphabetical'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');

  // Load cards from localStorage on component mount
  useEffect(() => {
    const savedCards = LocalStorageManager.load();
    setCards(savedCards);
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    LocalStorageManager.save(cards);
  }, [cards]);

  const handleCreateCard = (cardData: Omit<WordCardType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: WordCardType = {
      ...cardData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCards(prev => [newCard, ...prev]);
    setShowForm(false);
  };

  const handleEditCard = (cardData: Omit<WordCardType, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCard) return;
    
    const updatedCard: WordCardType = {
      ...editingCard,
      ...cardData,
      updatedAt: new Date()
    };
    
    setCards(prev => prev.map(card => 
      card.id === editingCard.id ? updatedCard : card
    ));
    setEditingCard(undefined);
    setShowForm(false);
  };

  const handleDeleteCard = (id: string) => {
    if (window.confirm('このカードを削除しますか？')) {
      setCards(prev => prev.filter(card => card.id !== id));
    }
  };

  const handleToggleStar = (id: string) => {
    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isStarred: !card.isStarred, updatedAt: new Date() } : card
    ));
  };

  const handleEditClick = (card: WordCardType) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCard(undefined);
  };

  // フィルタリングとソート処理
  const { filteredCards, availableTags, displayCards, totalPages } = useMemo(() => {
    // フィルタリング
    const filtered = FilterManager.filterCards(
      cards,
      searchQuery,
      selectedTag,
      showStarredOnly
    );

    // ソート
    const sorted = FilterManager.sortCards(filtered, sortBy, sortOrder);

    // ページネーション
    const paginated = PaginationManager.getPageItems(sorted, currentPage, itemsPerPage);
    const totalPagesCount = PaginationManager.getTotalPages(sorted.length, itemsPerPage);

    // 利用可能なタグ一覧
    const tags = FilterManager.getAllTags(cards);

    return {
      filteredCards: sorted,
      availableTags: tags,
      displayCards: paginated,
      totalPages: totalPagesCount
    };
  }, [cards, currentPage, itemsPerPage, searchQuery, sortBy, sortOrder, showStarredOnly, selectedTag]);

  // 検索やフィルタが変更されたときは1ページ目に戻る
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag, showStarredOnly, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページ変更時に一番上にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>単語カードアプリ</h1>
        <button 
          className="create-btn"
          onClick={() => setShowForm(true)}
        >
          新しいカードを作成
        </button>
      </header>

      <main className="app-main">
        {cards.length === 0 ? (
          <div className="empty-state">
            <p>まだ単語カードがありません</p>
            <p>「新しいカードを作成」ボタンから始めましょう！</p>
          </div>
        ) : (
          <>
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              showStarredOnly={showStarredOnly}
              onShowStarredOnlyChange={setShowStarredOnly}
              selectedTag={selectedTag}
              onSelectedTagChange={setSelectedTag}
              availableTags={availableTags}
              totalCards={cards.length}
              filteredCards={filteredCards.length}
            />

            {filteredCards.length === 0 ? (
              <div className="empty-state">
                <p>条件に一致するカードがありません</p>
                <p>検索条件を変更してみてください</p>
              </div>
            ) : (
              <>
                <div className="cards-grid">
                  {displayCards.map(card => (
                    <WordCard
                      key={card.id}
                      card={card}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteCard}
                      onToggleStar={handleToggleStar}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredCards.length}
                />
              </>
            )}
          </>
        )}
      </main>

      {showForm && (
        <CardForm
          card={editingCard}
          onSave={editingCard ? handleEditCard : handleCreateCard}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App;
