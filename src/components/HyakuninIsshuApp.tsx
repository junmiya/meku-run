'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { SettingsPanel } from '../components/Settings/SettingsPanel';
import { CardContainer } from '../components/HyakuninIsshu/CardContainer';
import { memorizationManager } from '../managers/MemorizationManager';
import { ShuffleManager } from '../managers/ShuffleManager';
import { hyakuninIsshuData } from '../data/hyakunin-isshu-data';
import { HyakuninIsshuCard, CardAction } from '../types/WordCard';

/**
 * 百人一首トレーニングアプリのメインコンポーネント
 */
export const HyakuninIsshuApp: React.FC = () => {
  try {
    const { settings } = useSettings();
    const { isLoggedIn } = useAuth();
  
  // State
  const [cards, setCards] = useState<HyakuninIsshuCard[]>([]);
  const [displayCards, setDisplayCards] = useState<HyakuninIsshuCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [memorizedCount, setMemorizedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化処理（クライアントサイドでのみ実行）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeCards();
    }
  }, []);

  // 設定変更時の処理
  useEffect(() => {
    if (cards.length > 0) {
      updateDisplayCards();
    }
  }, [settings, cards, currentPage]);

  // 覚えたカード数の更新
  useEffect(() => {
    setMemorizedCount(memorizationManager.getMemorizedCount());
  }, []);

  const initializeCards = () => {
    setIsLoading(true);
    try {
      let initialCards = [...hyakuninIsshuData];
      
      // シャッフル設定の適用
      if (settings.shuffleMode) {
        const restored = ShuffleManager.restoreShuffleOrder(initialCards);
        if (restored) {
          initialCards = restored;
        } else {
          initialCards = ShuffleManager.shuffleCards(initialCards);
          ShuffleManager.saveShuffleOrder(initialCards);
        }
      }
      
      setCards(initialCards);
      setCurrentPage(1);
      
      // 初期化完了後、displayCardsを即座に更新
      setTimeout(() => {
        updateDisplayCards();
      }, 0);
    } catch (error) {
      console.error('カードの初期化に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDisplayCards = () => {
    console.log('updateDisplayCards called with:', { cardsLength: cards.length, currentPage, settings: settings.cardsPerPage });
    
    if (cards.length === 0) {
      console.log('Cards is empty, skipping update');
      return;
    }
    
    let cardsToDisplay = [...cards];
    
    // 表示モードによるフィルタリング
    if (settings.displayMode === 'recovery') {
      cardsToDisplay = memorizationManager.filterMemorizedCards(cardsToDisplay);
    } else {
      // 通常モードでは覚えたカードを除外
      cardsToDisplay = memorizationManager.filterUnmemorizedCards(cardsToDisplay);
    }
    
    // ページネーション
    const startIndex = (currentPage - 1) * settings.cardsPerPage;
    const endIndex = startIndex + settings.cardsPerPage;
    const paginatedCards = cardsToDisplay.slice(startIndex, endIndex);
    
    setDisplayCards(paginatedCards);
  };

  const handleCardAction = (action: CardAction, cardId: number) => {
    switch (action) {
      case 'memorize':
        const newMemorizedState = memorizationManager.toggleMemorized(cardId);
        setMemorizedCount(memorizationManager.getMemorizedCount());
        
        // 通常モードで覚えたカードは即座に非表示にする
        if (newMemorizedState && settings.displayMode === 'normal') {
          updateDisplayCards();
        }
        break;
        
      case 'favorite':
        // TODO: お気に入り機能の実装
        console.log('お気に入り機能は今後実装予定です');
        break;
    }
  };

  const handleCardFlip = (cardId: number) => {
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(cardId)) {
        newFlipped.delete(cardId);
      } else {
        newFlipped.add(cardId);
      }
      return newFlipped;
    });
  };

  const handleShuffle = () => {
    const shuffledCards = ShuffleManager.shuffleCards(cards);
    setCards(shuffledCards);
    ShuffleManager.saveShuffleOrder(shuffledCards);
    setCurrentPage(1);
    setFlippedCards(new Set());
  };

  const handleMemorizationClear = () => {
    setMemorizedCount(0);
    updateDisplayCards();
  };

  const totalPages = Math.ceil(
    (settings.displayMode === 'recovery' 
      ? memorizationManager.filterMemorizedCards(cards).length
      : memorizationManager.filterUnmemorizedCards(cards).length
    ) / settings.cardsPerPage
  );

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>百人一首データを読み込み中...</p>
      </div>
    );
  }

  // デバッグ用のログ
  console.log('HyakuninIsshuApp render:', {
    cards: cards.length,
    displayCards: displayCards.length,
    currentPage,
    settings: settings.cardsPerPage,
    isLoading,
    hyakuninIsshuDataLength: hyakuninIsshuData.length
  });

  // エラー状況の確認
  if (!hyakuninIsshuData || hyakuninIsshuData.length === 0) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>エラー: 百人一首データが読み込めませんでした</h1>
        <p>hyakuninIsshuData: {JSON.stringify(hyakuninIsshuData)}</p>
      </div>
    );
  }

  return (
    <div className="hyakunin-isshu-app" style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      {/* ヘッダー */}
      <header className="app-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ color: '#333', fontSize: '24px' }}>🎴 百人一首トレーニング</h1>
        <div className="header-controls">
          {settings.shuffleMode && (
            <button className="shuffle-button" onClick={handleShuffle}>
              🔀 シャッフル
            </button>
          )}
          <button className="settings-button" onClick={() => setShowSettings(true)}>
            ⚙️ 設定
          </button>
        </div>
      </header>

      {/* 統計情報 */}
      <div className="app-stats">
        <div className="stat-item">
          <span>表示モード:</span>
          <span>{settings.displayMode === 'recovery' ? '復習モード' : '通常モード'}</span>
        </div>
        <div className="stat-item">
          <span>覚えたカード:</span>
          <span>{memorizedCount} / {hyakuninIsshuData.length}</span>
        </div>
        {settings.shuffleMode && (
          <div className="stat-item">
            <span>🔀 シャッフル中</span>
          </div>
        )}
      </div>

      {/* カードグリッド */}
      <main className="cards-container">
        {displayCards.length === 0 ? (
          <div className="empty-state">
            <h2>
              {settings.displayMode === 'recovery' 
                ? '覚えたカードがありません' 
                : 'すべてのカードを覚えました！'}
            </h2>
            <p>
              {settings.displayMode === 'recovery'
                ? 'カードを覚えてから復習モードをお使いください。'
                : '設定から復習モードに切り替えて復習することができます。'}
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {displayCards.map((card) => (
              <CardContainer
                key={card.id}
                card={card}
                isFlipped={flippedCards.has(card.id)}
                showFurigana={settings.showFurigana && isLoggedIn}
                showMeaning={settings.showMeaning}
                isMemorized={memorizationManager.isMemorized(card.id)}
                isFavorite={false} // TODO: お気に入り機能実装後に対応
                onCardAction={handleCardAction}
                onFlip={handleCardFlip}
              />
            ))}
          </div>
        )}
      </main>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← 前へ
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            次へ →
          </button>
        </div>
      )}

      {/* 設定パネル */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        totalCards={hyakuninIsshuData.length}
        memorizedCount={memorizedCount}
        onMemorizationClear={handleMemorizationClear}
      />
    </div>
  );
  
  } catch (error) {
    console.error('HyakuninIsshuApp error:', error);
    return (
      <div style={{ padding: '20px', color: 'red', backgroundColor: '#fff' }}>
        <h1>🚨 アプリケーションエラー</h1>
        <p>アプリケーションの初期化中にエラーが発生しました。</p>
        <details style={{ marginTop: '10px' }}>
          <summary>エラー詳細</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
        <div style={{ marginTop: '20px' }}>
          <a href="/debug" style={{ 
            padding: '10px 15px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            デバッグページに移動
          </a>
        </div>
      </div>
    );
  }
};