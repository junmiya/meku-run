'use client';

import React, { useState, useEffect } from 'react';
import { hyakuninIsshuData } from '../../src/data/hyakunin-isshu-data';
import { ResponsiveCardManager } from '../../src/managers/ResponsiveCardManager';
import { memorizationManager } from '../../src/managers/MemorizationManager';
import { HyakuninIsshuCard } from '../../src/types/WordCard';

// インラインスタイルを使用した固定版メインページ
export default function FixedMainPage() {
  const [cards, setCards] = useState<HyakuninIsshuCard[]>([]);
  const [displayCards, setDisplayCards] = useState<HyakuninIsshuCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [memorizedCount, setMemorizedCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const [showKimariji, setShowKimariji] = useState(false);
  
  const cardManager = ResponsiveCardManager.getInstance();

  // 初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        cardManager.setAllCards(hyakuninIsshuData);
        const managedCards = cardManager.getRecommendedSet('desktop', 'beginner');
        
        setCards(managedCards);
        setDisplayCards(managedCards.slice(0, 10));
        setMemorizedCount(memorizationManager.getMemorizedCount());
        setIsInitialized(true);
      } catch (error) {
        console.error('初期化エラー:', error);
        setIsInitialized(true);
      }
    }
  }, []);

  // カードフリップ処理
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

  // 覚えた処理
  const handleMemorized = (cardId: number) => {
    memorizationManager.toggleMemorized(cardId);
    setMemorizedCount(memorizationManager.getMemorizedCount());
  };

  // シャッフル処理
  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setDisplayCards(shuffledCards.slice(0, 10));
    setFlippedCards(new Set());
  };

  if (!isInitialized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>百人一首データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)',
      padding: '16px'
    }}>
      {/* ヘッダー */}
      <header style={{ marginBottom: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            textAlign: 'center', 
            marginBottom: '16px'
          }}>
            🎴 百人一首トレーニング
          </h1>
          
          {/* 統計・制御パネル */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '16px', 
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '16px', 
                fontSize: '0.875rem'
              }}>
                <span style={{ 
                  backgroundColor: '#dbeafe', 
                  padding: '4px 12px', 
                  borderRadius: '9999px'
                }}>
                  デバイス: PC
                </span>
                <span style={{ 
                  backgroundColor: '#dcfce7', 
                  padding: '4px 12px', 
                  borderRadius: '9999px'
                }}>
                  表示: {displayCards.length}枚
                </span>
                <span style={{ 
                  backgroundColor: '#e9d5ff', 
                  padding: '4px 12px', 
                  borderRadius: '9999px'
                }}>
                  覚えた: {memorizedCount}/{hyakuninIsshuData.length}首
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShuffle}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🔀 シャッフル
                </button>
                <button
                  onClick={() => setShowKimariji(!showKimariji)}
                  style={{
                    backgroundColor: showKimariji ? '#f59e0b' : '#e5e7eb',
                    color: showKimariji ? 'white' : '#374151',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  決まり字 {showKimariji ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {displayCards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '16px'
            }}>
              すべての句を覚えました！
            </h2>
            <p style={{ color: '#6b7280' }}>
              復習モードに切り替えて復習することができます。
            </p>
          </div>
        ) : (
          <>
            {/* カードグリッド */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '16px',
              maxWidth: '1280px', 
              margin: '0 auto'
            }}>
              {displayCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* カード番号 */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {card.id}
                  </div>

                  {/* 覚えたボタン */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMemorized(card.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      fontSize: '0.75rem',
                      backgroundColor: memorizationManager.isMemorized(card.id) ? '#10b981' : '#e5e7eb',
                      color: memorizationManager.isMemorized(card.id) ? 'white' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✓
                  </button>

                  {flippedCards.has(card.id) ? (
                    // 裏面（下の句）
                    <div style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            direction: 'rtl',
                            fontSize: '1.125rem',
                            lineHeight: '1.75',
                            margin: '0 auto',
                            height: '128px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {card.shimoNoKu}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
                          {card.author}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 表面（上の句）
                    <div style={{ height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div
                        style={{
                          writingMode: 'vertical-rl',
                          textOrientation: 'upright',
                          direction: 'rtl',
                          fontSize: '1.125rem',
                          lineHeight: '1.75',
                          margin: '0 auto',
                          height: '128px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {card.kamiNoKu}
                      </div>
                      
                      {/* 決まり字表示 */}
                      {showKimariji && card.kimariji && (
                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            backgroundColor: '#fef3c7', 
                            color: '#d97706',
                            padding: '2px 8px', 
                            borderRadius: '4px'
                          }}>
                            決まり字: {card.kamiNoKu.substring(card.kimariji.position, card.kimariji.position + card.kimariji.length)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* スピンアニメーション用CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}