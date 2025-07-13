'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthForm from '../components/Auth/AuthForm'
import UserProfile from '../components/Auth/UserProfile'
import LoadingSpinner from '../components/Auth/LoadingSpinner'
import WordCard from '../components/WordCard'
import CardForm from '../components/CardForm'
import SearchFilter from '../components/SearchFilter'
import Pagination from '../components/Pagination'
import { useWordCards } from '../hooks/useWordCards'
import { useCardForm } from '../hooks/useCardForm'
import { WordCard as WordCardType } from '../types/WordCard'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showUserProfile, setShowUserProfile] = useState(false)

  const {
    cards,
    filteredCards,
    displayCards,
    loading: cardsLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    showStarredOnly,
    setShowStarredOnly,
    currentPage,
    handlePageChange,
    totalPages,
    createCard,
    updateCard,
    deleteCard,
    toggleStar,
    loadSampleData,
    availableTags
  } = useWordCards()

  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<WordCardType | undefined>()

  const openFormForNew = () => {
    setEditingCard(undefined)
    setShowForm(true)
  }

  const openFormForEdit = (card: WordCardType) => {
    setEditingCard(card)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCard(undefined)
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  const handleCreateCard = async (cardData: Omit<WordCardType, 'id' | 'created_at' | 'updated_at'>) => {
    await createCard(cardData)
    closeForm()
  }

  const handleUpdateCard = async (cardData: Omit<WordCardType, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingCard) {
      await updateCard(editingCard.id, cardData)
      closeForm()
    }
  }

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('この単語カードを削除しますか？')) {
      await deleteCard(cardId)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>単語カードアプリ</h1>
        <p>ログインして単語カードの学習を始めましょう</p>
        <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>単語カードアプリ</h1>
        <button
          onClick={() => setShowUserProfile(!showUserProfile)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showUserProfile ? 'プロフィールを閉じる' : 'プロフィール'}
        </button>
      </div>

      {showUserProfile && (
        <div style={{ marginBottom: '20px' }}>
          <UserProfile onClose={() => setShowUserProfile(false)} />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={openFormForNew}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          新しい単語カードを追加
        </button>

        {cards.length === 0 && (
          <button
            onClick={loadSampleData}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            サンプルデータを読み込み
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px' }}>
          <CardForm
            card={editingCard}
            onSave={editingCard ? handleUpdateCard : handleCreateCard}
            onCancel={closeForm}
          />
        </div>
      )}

      {cards.length > 0 && (
        <>
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            selectedTag={selectedTag}
            onSelectedTagChange={setSelectedTag}
            showStarredOnly={showStarredOnly}
            onShowStarredOnlyChange={setShowStarredOnly}
            availableTags={availableTags}
            totalCards={cards.length}
            filteredCards={filteredCards.length}
          />

          {cardsLoading ? (
            <LoadingSpinner />
          ) : displayCards.length > 0 ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                margin: '20px 0'
              }}>
                {displayCards.map((card) => (
                  <WordCard
                    key={card.id}
                    card={card}
                    onEdit={() => openFormForEdit(card)}
                    onDelete={() => handleDeleteCard(card.id)}
                    onToggleStar={() => toggleStar(card.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={6}
                  totalItems={filteredCards.length}
                />
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>条件に一致する単語カードが見つかりません。</p>
            </div>
          )}
        </>
      )}

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          margin: '20px 0'
        }}>
          エラー: {error}
        </div>
      )}
    </div>
  )
}