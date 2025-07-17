'use client';

import React, { useState, useEffect } from 'react';
import { hyakuninIsshuData } from '../src/data/hyakunin-isshu-data';
import { ResponsiveCardManager } from '../src/managers/ResponsiveCardManager';
import { memorizationManager } from '../src/managers/MemorizationManager';
import { TrainingGameManager } from '../src/managers/TrainingGameManager';
import { PerformanceManager } from '../src/managers/PerformanceManager';
import { HyakuninIsshuCard } from '../src/types/WordCard';
import { getCardsByKimarijiLength, getKimarijiInfo, debugKimarijiClassification } from '../src/data/kimariji-data';
import { Timer, CompetitionModeSelect } from '../src/components/Timer';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import ConditionalAuthGuard from '../src/components/Auth/ConditionalAuthGuard';
import UserLoginButton from '../src/components/Header/UserLoginButton';



// インラインスタイルを使用した百人一首メインページ
function HyakuninIsshuApp() {
  const { user, isLoggedIn } = useAuth();
  const [cards, setCards] = useState<HyakuninIsshuCard[]>([]);
  const [displayCards, setDisplayCards] = useState<HyakuninIsshuCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [memorizedCount, setMemorizedCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  
  // 表示枚数変更処理
  const handleCardsPerPageChange = (newCardsPerPage: number) => {
    setCardsPerPage(newCardsPerPage);
    
    let filteredCards: HyakuninIsshuCard[];
    
    if (kimarijiLengthFilter === 'all') {
      filteredCards = hyakuninIsshuData.filter(card => !memorizationManager.isMemorized(card.id));
    } else {
      const kimarijiCardIds = getCardsByKimarijiLength(kimarijiLengthFilter);
      filteredCards = memorizationManager.getUnmemorizedCardsByKimarijiLength(hyakuninIsshuData, kimarijiCardIds);
    }
    
    setDisplayCards(filteredCards.slice(0, newCardsPerPage));
  };

  // 決まり字数でフィルタリング
  const filterCardsByKimarijiLength = (cardsList: HyakuninIsshuCard[]) => {
    if (kimarijiLengthFilter === 'all') return cardsList;
    
    const kimarijiCards = getCardsByKimarijiLength(kimarijiLengthFilter);
    return cardsList.filter(card => kimarijiCards.includes(card.id));
  };

  // 決まり字数フィルター変更処理
  const handleKimarijiLengthChange = (length: 'all' | 1 | 2 | 3 | 4 | 5 | 6) => {
    setKimarijiLengthFilter(length);
    
    // デバッグ: フィルタリング前の状態確認
    console.log(`フィルター: ${length}字決まりを選択`);
    console.log('全カード数:', cards.length);
    
    let filteredCards: HyakuninIsshuCard[];
    
    if (length === 'all') {
      // 全ての覚えていないカードを取得
      filteredCards = cards.filter(card => !memorizationManager.isMemorized(card.id));
    } else {
      // 指定された決まり字数のカードIDを取得
      const kimarijiCardIds = getCardsByKimarijiLength(length);
      console.log(`${length}字決まりの札ID:`, kimarijiCardIds);
      
      // 決まり字フィルターと覚えていないカードのフィルターを組み合わせ
      // 全てのカード（hyakuninIsshuData）から検索するように修正
      filteredCards = memorizationManager.getUnmemorizedCardsByKimarijiLength(hyakuninIsshuData, kimarijiCardIds);
    }
    
    console.log('フィルタリング後のカード数:', filteredCards.length);
    setDisplayCards(filteredCards.slice(0, cardsPerPage));
  };
  const [showKimariji, setShowKimariji] = useState(false);
  const [hiraganaMode, setHiraganaMode] = useState(false);
  const [kimarijiLengthFilter, setKimarijiLengthFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5 | 6>('all');
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [currentTrainingType, setCurrentTrainingType] = useState<'oneChar' | 'twoChar' | 'threeChar' | 'mixed'>('oneChar');
  
  // 競技モード関連の状態
  const [isCompetitionMode, setIsCompetitionMode] = useState(false);
  const [competitionMode, setCompetitionMode] = useState<'memorization' | 'reaction' | 'competition'>('memorization');
  const [competitionLevel, setCompetitionLevel] = useState<1 | 2 | 3 | 4 | 5 | 6 | 'mixed'>('mixed');
  const [competitionSettings, setCompetitionSettings] = useState({
    timeLimit: 60,
    memorizationTime: 15,
    judgeMode: 'normal' as 'strict' | 'normal' | 'lenient'
  });
  
  const cardManager = ResponsiveCardManager.getInstance();
  const trainingGameManager = TrainingGameManager.getInstance();
  const performanceManager = PerformanceManager.getInstance();
  
  // ユーザー情報が変更されたらマネージャーに設定
  useEffect(() => {
    performanceManager.setUser(user);
    trainingGameManager.setUser(user);
    
    // ログアウト時はトレーニングモード・競技モードを無効化
    if (!isLoggedIn && (isTrainingMode || isCompetitionMode)) {
      setIsTrainingMode(false);
      setIsCompetitionMode(false);
    }
  }, [user, isLoggedIn, performanceManager, trainingGameManager, isTrainingMode, isCompetitionMode]);

  // 初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        cardManager.setAllCards(hyakuninIsshuData);
        // 初期化時は全てのカードを使用（beginnerフィルターを適用しない）
        const allCards = hyakuninIsshuData;
        
        setCards(allCards);
        setDisplayCards(allCards.slice(0, 10));
        setMemorizedCount(memorizationManager.getMemorizedCount());
        setIsInitialized(true);
        
        // デバッグ: 決まり字データベースの状態確認
        console.log('決まり字データベースの状態:');
        debugKimarijiClassification();
        console.log('1字決まり:', getCardsByKimarijiLength(1));
        console.log('2字決まり:', getCardsByKimarijiLength(2));
        console.log('3字決まり:', getCardsByKimarijiLength(3));
        console.log('4字決まり:', getCardsByKimarijiLength(4));
        console.log('5字決まり:', getCardsByKimarijiLength(5));
        console.log('6字決まり:', getCardsByKimarijiLength(6));
        
        // 覚えた状態のデバッグ
        console.log('覚えたカード数:', memorizationManager.getMemorizedCount());
        console.log('覚えたカードID:', memorizationManager.getMemorizedCardIds());
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
    
    // 覚えた札を表示リストから削除
    if (memorizationManager.isMemorized(cardId)) {
      const newDisplayCards = displayCards.filter(card => card.id !== cardId);
      setDisplayCards(newDisplayCards);
      
      // 新しい札を追加（残りの札がある場合）
      const remainingCards = hyakuninIsshuData.filter(card => 
        !newDisplayCards.some(displayCard => displayCard.id === card.id) && 
        !memorizationManager.isMemorized(card.id)
      );
      
      if (remainingCards.length > 0 && newDisplayCards.length < cardsPerPage) {
        let filteredRemainingCards: HyakuninIsshuCard[];
        
        if (kimarijiLengthFilter === 'all') {
          filteredRemainingCards = remainingCards;
        } else {
          const kimarijiCardIds = getCardsByKimarijiLength(kimarijiLengthFilter);
          filteredRemainingCards = remainingCards.filter(card => 
            kimarijiCardIds.includes(card.id)
          );
        }
        
        if (filteredRemainingCards.length > 0) {
          const nextCard = filteredRemainingCards[0];
          if (nextCard) {
            setDisplayCards([...newDisplayCards, nextCard]);
          }
        }
      }
    }
  };

  // シャッフル処理
  const handleShuffle = () => {
    const shuffledCards = [...hyakuninIsshuData].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    
    let filteredCards: HyakuninIsshuCard[];
    
    if (kimarijiLengthFilter === 'all') {
      filteredCards = shuffledCards.filter(card => !memorizationManager.isMemorized(card.id));
    } else {
      const kimarijiCardIds = getCardsByKimarijiLength(kimarijiLengthFilter);
      filteredCards = memorizationManager.getUnmemorizedCardsByKimarijiLength(shuffledCards, kimarijiCardIds);
    }
    
    setDisplayCards(filteredCards.slice(0, cardsPerPage));
    setFlippedCards(new Set());
  };

  // リセット処理
  const handleReset = () => {
    // 全ての記憶状態をリセット
    hyakuninIsshuData.forEach(card => {
      if (memorizationManager.isMemorized(card.id)) {
        memorizationManager.toggleMemorized(card.id);
      }
    });
    
    setMemorizedCount(0);
    
    let filteredCards: HyakuninIsshuCard[];
    
    if (kimarijiLengthFilter === 'all') {
      filteredCards = hyakuninIsshuData;
    } else {
      const kimarijiCardIds = getCardsByKimarijiLength(kimarijiLengthFilter);
      filteredCards = hyakuninIsshuData.filter(card => kimarijiCardIds.includes(card.id));
    }
    
    setDisplayCards(filteredCards.slice(0, cardsPerPage));
    setFlippedCards(new Set());
  };

  // 競技モード開始
  const startCompetitionMode = () => {
    setIsCompetitionMode(true);
    const session = trainingGameManager.startSession(
      competitionMode,
      competitionLevel,
      competitionSettings
    );
    
    // 競技モード用のカードを設定
    const competitionCards = getCompetitionCards();
    setDisplayCards(competitionCards);
    setFlippedCards(new Set());
  };

  // 競技モード終了
  const endCompetitionMode = () => {
    const session = trainingGameManager.endSession();
    if (session) {
      performanceManager.updateSessionHistory(session);
    }
    setIsCompetitionMode(false);
  };

  // 競技用カードの取得
  const getCompetitionCards = (): HyakuninIsshuCard[] => {
    if (competitionLevel === 'mixed') {
      return hyakuninIsshuData.slice(0, 20); // 混合の場合は20枚
    } else {
      const kimarijiCards = getCardsByKimarijiLength(competitionLevel);
      return hyakuninIsshuData.filter(card => kimarijiCards.includes(card.id));
    }
  };

  // 競技モードでのカード回答
  const handleCompetitionAnswer = (cardId: number, correct: boolean) => {
    const result = trainingGameManager.recordAnswer(cardId, correct);
    performanceManager.recordTrainingResult(result);
    
    // 次のカードを設定
    const remainingCards = displayCards.filter(card => card.id !== cardId);
    if (remainingCards.length > 0) {
      setDisplayCards(remainingCards);
      const nextCard = remainingCards[0];
      if (nextCard) {
        trainingGameManager.setCurrentCard(nextCard);
      }
    } else {
      // 全てのカードが完了
      endCompetitionMode();
    }
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

  // 競技モード選択画面
  if (isCompetitionMode && trainingGameManager.getCurrentState().currentPhase === 'setup') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '24px',
            color: '#1F2937',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            競技トレーニングモード
          </h2>
          
          <CompetitionModeSelect
            onModeSelect={setCompetitionMode}
            onKimarijiLevelSelect={setCompetitionLevel}
            onSettingsChange={setCompetitionSettings}
          />
          
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={startCompetitionMode}
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              開始
            </button>
            <button
              onClick={() => setIsCompetitionMode(false)}
              style={{
                backgroundColor: '#6B7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)',
      padding: '16px',
      position: 'relative'
    }}>
      {/* ヘッダー */}
      <header style={{ marginBottom: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          {/* ログインボタン（右上） */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            zIndex: 10
          }}>
            <UserLoginButton />
          </div>
          
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            textAlign: 'center', 
            marginBottom: '16px',
            paddingTop: '8px'
          }}>
百人一首トレーニング
          </h1>
          
          {/* モード切り替えタブ */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '16px' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex'
            }}>
              <button
                onClick={() => {
                  setIsTrainingMode(false);
                  setIsCompetitionMode(false);
                }}
                style={{
                  backgroundColor: !isTrainingMode && !isCompetitionMode ? '#3b82f6' : 'transparent',
                  color: !isTrainingMode && !isCompetitionMode ? 'white' : '#6b7280',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: !isTrainingMode && !isCompetitionMode ? '600' : '400'
                }}
              >
                通常モード
              </button>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setIsTrainingMode(true);
                    setIsCompetitionMode(false);
                  }
                }}
                disabled={!isLoggedIn}
                title={!isLoggedIn ? "ログインが必要です" : ""}
                style={{
                  backgroundColor: isTrainingMode && !isCompetitionMode ? '#3b82f6' : 'transparent',
                  color: !isLoggedIn ? '#9ca3af' : (isTrainingMode && !isCompetitionMode ? 'white' : '#6b7280'),
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: isTrainingMode && !isCompetitionMode ? '600' : '400',
                  opacity: isLoggedIn ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                トレーニングモード
                {!isLoggedIn && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    fontSize: '10px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🔒
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setIsTrainingMode(false);
                    setIsCompetitionMode(true);
                  }
                }}
                disabled={!isLoggedIn}
                title={!isLoggedIn ? "ログインが必要です" : ""}
                style={{
                  backgroundColor: isCompetitionMode ? '#10b981' : 'transparent',
                  color: !isLoggedIn ? '#9ca3af' : (isCompetitionMode ? 'white' : '#6b7280'),
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: isCompetitionMode ? '600' : '400',
                  opacity: isLoggedIn ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                競技モード
                {!isLoggedIn && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    fontSize: '10px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🔒
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* 統計・制御パネル - 通常モード時のみ表示 */}
          {!isTrainingMode && !isCompetitionMode && (
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
                  backgroundColor: '#93c5fd', 
                  color: 'white',
                  padding: '8px 12px', 
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '32px',
                  lineHeight: '1'
                }}>
                  デバイス: PC
                </span>
                <div style={{ 
                  backgroundColor: '#86efac', 
                  color: 'white',
                  padding: '8px 12px', 
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '32px',
                  lineHeight: '1',
                  gap: '8px'
                }}>
                  表示: 
                  <select
                    value={cardsPerPage}
                    onChange={(e) => handleCardsPerPageChange(Number(e.target.value))}
                    style={{
                      backgroundColor: 'white',
                      color: '#166534',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value={5}>5枚</option>
                    <option value={10}>10枚</option>
                    <option value={15}>15枚</option>
                    <option value={20}>20枚</option>
                  </select>
                </div>
                <div style={{ 
                  backgroundColor: '#c4b5fd', 
                  color: 'white',
                  padding: '8px 12px', 
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '32px',
                  lineHeight: '1',
                  gap: '8px'
                }}>
                  覚えた: {memorizedCount}/{hyakuninIsshuData.length}首
                  {memorizedCount > 0 && (
                    <button
                      onClick={handleReset}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        lineHeight: '1'
                      }}
                    >
                      リセット
                    </button>
                  )}
                </div>
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
シャッフル
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
                <button
                  onClick={() => setHiraganaMode(!hiraganaMode)}
                  style={{
                    backgroundColor: hiraganaMode ? '#10b981' : '#e5e7eb',
                    color: hiraganaMode ? 'white' : '#374151',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ひらがな {hiraganaMode ? 'ON' : 'OFF'}
                </button>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  backgroundColor: '#f3f4f6',
                  padding: '8px 12px',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>決まり字数:</span>
                  <select
                    value={kimarijiLengthFilter}
                    onChange={(e) => handleKimarijiLengthChange(e.target.value as 'all' | 1 | 2 | 3 | 4 | 5 | 6)}
                    style={{
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">全て</option>
                    <option value={1}>1字</option>
                    <option value={2}>2字</option>
                    <option value={3}>3字</option>
                    <option value={4}>4字</option>
                    <option value={5}>5字</option>
                    <option value={6}>6字</option>
                  </select>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {isCompetitionMode ? (
          // 競技モード - ログイン必須
          <ConditionalAuthGuard requireAuth={true}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              textAlign: 'center'
            }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '24px'
            }}>
              競技トレーニングモード
            </h2>
            
            {/* タイマー表示 */}
            <div style={{ marginBottom: '24px' }}>
              <Timer
                timeRemaining={trainingGameManager.getCurrentState().timeRemaining}
                totalTime={competitionSettings.timeLimit}
                phase={trainingGameManager.getCurrentState().currentPhase}
              />
            </div>
            
            {/* 競技統計 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                  {trainingGameManager.getCurrentState().sessionStats.correctAnswers}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>正解</div>
              </div>
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                  {trainingGameManager.getCurrentState().sessionStats.totalAttempts}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>試行</div>
              </div>
              <div style={{ 
                backgroundColor: '#f3f4f6',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                  {trainingGameManager.getCurrentState().sessionStats.currentStreak}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>連続</div>
              </div>
            </div>
            
            {/* 競技終了ボタン */}
            <button
              onClick={endCompetitionMode}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              競技終了
            </button>
            </div>
          </ConditionalAuthGuard>
        ) : isTrainingMode ? (
          // トレーニングモード - ログイン必須
          <ConditionalAuthGuard requireAuth={true}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '24px' 
            }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              基礎トレーニング
            </h2>
            
            {/* トレーニングメニュー */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div 
                onClick={() => setCurrentTrainingType('oneChar')}
                style={{ 
                  backgroundColor: currentTrainingType === 'oneChar' ? '#e0f2fe' : '#f8fafc',
                  border: currentTrainingType === 'oneChar' ? '2px solid #0284c7' : '2px solid #e2e8f0',
                  borderRadius: '8px', 
                  padding: '20px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '8px' 
                }}>
                  1字決まり練習
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  marginBottom: '8px'
                }}>
                  最も覚えやすい1字で決まる札から開始
                </p>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#059669',
                  fontWeight: '500'
                }}>
                  推奨: 初心者
                </div>
              </div>
              
              <div 
                onClick={() => setCurrentTrainingType('twoChar')}
                style={{ 
                  backgroundColor: currentTrainingType === 'twoChar' ? '#e0f2fe' : '#f8fafc',
                  border: currentTrainingType === 'twoChar' ? '2px solid #0284c7' : '2px solid #e2e8f0',
                  borderRadius: '8px', 
                  padding: '20px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '8px' 
                }}>
                  2字決まり練習
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  marginBottom: '8px'
                }}>
                  標準的な2字で決まる札の習得
                </p>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#d97706',
                  fontWeight: '500'
                }}>
                  推奨: 中級者
                </div>
              </div>
              
              <div 
                onClick={() => setCurrentTrainingType('threeChar')}
                style={{ 
                  backgroundColor: currentTrainingType === 'threeChar' ? '#e0f2fe' : '#f8fafc',
                  border: currentTrainingType === 'threeChar' ? '2px solid #0284c7' : '2px solid #e2e8f0',
                  borderRadius: '8px', 
                  padding: '20px', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1f2937', 
                  marginBottom: '8px' 
                }}>
                  3字以上決まり練習
                </h3>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  marginBottom: '8px'
                }}>
                  難しい決まり字の上級練習
                </p>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#dc2626',
                  fontWeight: '500'
                }}>
                  推奨: 上級者
                </div>
              </div>
            </div>
            
            {/* 選択されたトレーニングの詳細 */}
            <div style={{ 
              backgroundColor: '#f1f5f9', 
              borderRadius: '8px', 
              padding: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '12px' 
              }}>
                {currentTrainingType === 'oneChar' && '1字決まり練習'}
                {currentTrainingType === 'twoChar' && '2字決まり練習'}
                {currentTrainingType === 'threeChar' && '3字以上決まり練習'}
              </h3>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '16px' 
              }}>
                {currentTrainingType === 'oneChar' && '「む・す・め・ふ・さ・ほ・せ」の7首を完全習得するまで反復練習します。'}
                {currentTrainingType === 'twoChar' && '2字で決まる札を段階的に習得します。最も一般的な決まり字パターンです。'}
                {currentTrainingType === 'threeChar' && '3字以上で決まる札の習得です。上級者向けの難しい決まり字です。'}
              </p>
              <button
                onClick={() => {
                  // トレーニング開始処理
                  setIsTrainingMode(false);
                  if (currentTrainingType === 'oneChar') {
                    handleKimarijiLengthChange(1);
                  } else if (currentTrainingType === 'twoChar') {
                    handleKimarijiLengthChange(2);
                  } else if (currentTrainingType === 'threeChar') {
                    handleKimarijiLengthChange(3);
                  }
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                練習開始
              </button>
            </div>
            </div>
          </ConditionalAuthGuard>
        ) : (
          // 通常モード
          displayCards.length === 0 ? (
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
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
                maxWidth: '1200px', 
                margin: '0 auto'
              }}>
                {displayCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  style={{
                    backgroundColor: '#f8f6f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    // 百人一首の札の実際の比率（縦:横 = 1.1:1）
                    aspectRatio: '1 / 1.1',
                    width: '220px',
                    flexShrink: 0
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
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      minHeight: '180px',
                      padding: '12px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '8px 6px'
                      }}>
                        <div
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            direction: 'rtl',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            letterSpacing: '0.03em',
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {hiraganaMode ? card.reading.shimoNoKu.replace(/\s+/g, '\n') : card.shimoNoKu.replace(/\s+/g, '\n')}
                        </div>
                      </div>
                      
                      {/* 決まり字表示（下の句） */}
                      {showKimariji && card.kimariji && (
                        <div style={{ 
                          textAlign: 'center', 
                          marginTop: '4px', 
                          marginBottom: '4px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            fontSize: '0.6rem', 
                            backgroundColor: '#fff7e6', 
                            color: '#b45309',
                            padding: '3px 4px', 
                            borderRadius: '2px',
                            fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
                            fontWeight: '700',
                            border: '1px solid #f3d19e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            決まり字：{getKimarijiInfo(card.id)?.pattern || card.reading.kamiNoKu.replace(/\s+/g, '').substring(card.kimariji.position, card.kimariji.position + card.kimariji.length)}
                          </div>
                        </div>
                      )}
                      
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: '#444444', 
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
                        fontWeight: '500',
                        letterSpacing: '0.05em',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap'
                      }}>
                        {card.author}
                      </div>
                    </div>
                  ) : (
                    // 表面（上の句）
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      minHeight: '180px',
                      padding: '12px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '8px 6px'
                      }}>
                        <div
                          style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            direction: 'rtl',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            textAlign: 'center',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
                            fontWeight: '700',
                            color: '#1a1a1a',
                            letterSpacing: '0.03em',
                            whiteSpace: 'pre-line'
                          }}
                        >
                          {hiraganaMode ? card.reading.kamiNoKu.replace(/\s+/g, '\n') : card.kamiNoKu.replace(/\s+/g, '\n')}
                        </div>
                      </div>
                      
                      {/* 決まり字表示 */}
                      {showKimariji && card.kimariji && (
                        <div style={{ 
                          textAlign: 'center', 
                          marginTop: '4px', 
                          marginBottom: '4px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <div style={{ 
                            fontSize: '0.6rem', 
                            backgroundColor: '#fff7e6', 
                            color: '#b45309',
                            padding: '3px 4px', 
                            borderRadius: '2px',
                            fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", serif',
                            fontWeight: '700',
                            border: '1px solid #f3d19e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            決まり字：{getKimarijiInfo(card.id)?.pattern || card.reading.kamiNoKu.replace(/\s+/g, '').substring(card.kimariji.position, card.kimariji.position + card.kimariji.length)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              </div>
            </>
          )
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

// 認証プロバイダーでラップしたメインコンポーネント（条件付き認証）
export default function HomePage() {
  return (
    <AuthProvider>
      <HyakuninIsshuApp />
    </AuthProvider>
  );
}