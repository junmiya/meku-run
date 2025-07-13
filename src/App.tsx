import React, { useState } from 'react';

import AuthGuard from './components/Auth/AuthGuard';
import LoadingSpinner from './components/Auth/LoadingSpinner';
import UserProfile from './components/Auth/UserProfile';
import CardForm from './components/CardForm';
import Pagination from './components/Pagination';
import SearchFilter from './components/SearchFilter';
import WordCard from './components/WordCard';
import { AuthProvider } from './contexts/AuthContext';
import { DataManagerProvider } from './contexts/DataManagerContext';
import { useCardForm } from './hooks/useCardForm';
import { useWordCards } from './hooks/useWordCards';

import './App.css';

function WordCardApp() {
  const [showProfile, setShowProfile] = useState(false);
  
  // カスタムフック使用
  const wordCardsHook = useWordCards({ itemsPerPage: 6 });
  const {
    cards,
    filteredCards,
    displayCards,
    availableTags,
    totalPages,
    currentPage,
    searchQuery,
    sortBy,
    sortOrder,
    showStarredOnly,
    selectedTag,
    itemsPerPage,
    loading,
    error,
    isCloudMode,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setShowStarredOnly,
    setSelectedTag,
    handlePageChange,
    createCard,
    updateCard,
    deleteCard,
    toggleStar,
    loadSampleData,
  } = wordCardsHook;

  const cardFormHook = useCardForm({
    onSave: async (cardData) => {
      if (cardFormHook.editingCard) {
        await updateCard(cardFormHook.editingCard.id, cardData);
      } else {
        await createCard(cardData);
      }
    },
    onCancel: () => {
      // カスタムフック内で処理されるため、ここでは何もしない
    },
  });

  if (loading) {
    return (
      <div className="auth-loading">
        <LoadingSpinner />
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>単語カードアプリ</h1>
        <div className="header-status">
          {isCloudMode ? (
            <span className="cloud-mode">☁️ クラウド同期</span>
          ) : (
            <span className="local-mode">💾 ローカル保存</span>
          )}
        </div>
        <div className="header-buttons">
          <button 
            className="sample-btn"
            onClick={loadSampleData}
          >
            TOEIC700点サンプル
          </button>
          <button 
            className="create-btn"
            onClick={cardFormHook.openCreateForm}
          >
            新しいカードを作成
          </button>
          <button 
            className="profile-btn"
            onClick={() => setShowProfile(true)}
          >
            👤 プロフィール
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>エラー: {error}</p>
        </div>
      )}

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
                      onEdit={cardFormHook.openEditForm}
                      onDelete={deleteCard}
                      onToggleStar={toggleStar}
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

      {cardFormHook.showForm && (
        <CardForm
          card={cardFormHook.editingCard}
          onSave={cardFormHook.handleFormSave}
          onCancel={cardFormHook.closeForm}
        />
      )}

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

function App() {
  // Handle auth callback route - immediate redirect
  if (window.location.pathname === '/auth/callback') {
    // Immediate redirect using window.location
    window.location.href = window.location.origin;
    
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        認証完了中...リダイレクトしています...
      </div>
    );
  }

  return (
    <AuthProvider>
      <DataManagerProvider>
        <AuthGuard>
          <WordCardApp />
        </AuthGuard>
      </DataManagerProvider>
    </AuthProvider>
  );
}

export default App;
