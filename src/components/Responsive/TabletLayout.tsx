import React, { useState } from 'react';
import { HyakuninIsshuCard } from '../../types/WordCard';
import { CardContainer } from '../HyakuninIsshu/CardContainer';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

interface TabletLayoutProps {
  cards: HyakuninIsshuCard[];
  currentPage: number;
  onCardSelect: (cardId: number) => void;
  onPageChange: (page: number) => void;
  onCardAction: (action: string, cardId: number) => void;
  practiceMode: 'normal' | 'kimariji-only' | 'competition';
  currentKimariji?: string;
  showProgress?: boolean;
  correctAnswers?: number;
  totalQuestions?: number;
  timeRemaining?: number;
}

/**
 * タブレット用レイアウト（6×2段 = 12枚表示）
 * 中級者向けの練習に最適化されたグリッドレイアウト
 */
export const TabletLayout: React.FC<TabletLayoutProps> = ({
  cards,
  currentPage,
  onCardSelect,
  onPageChange,
  onCardAction,
  practiceMode,
  currentKimariji,
  showProgress = false,
  correctAnswers = 0,
  totalQuestions = 0,
  timeRemaining,
}) => {
  const { settings } = useSettings();
  const { isLoggedIn } = useAuth();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const cardsPerPage = 12;
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = cards.slice(startIndex, startIndex + cardsPerPage);

  // 決まり字を表示するかどうか
  const shouldShowKimariji = practiceMode === 'kimariji-only' || 
                           settings.kimarijiSettings.showKimariji;

  // 決まり字の表示
  const renderKimarijiDisplay = () => {
    if (!shouldShowKimariji || !currentKimariji) return null;

    return (
      <div className="kimariji-display">
        <div className="kimariji-content">
          <div className="kimariji-label">決まり字</div>
          <div className={`kimariji-highlight kimariji-length-${currentKimariji.length}`}>
            {currentKimariji}
          </div>
          {practiceMode === 'kimariji-only' && (
            <div className="kimariji-instruction">
              この決まり字から始まる下の句を選んでください
            </div>
          )}
        </div>
        {timeRemaining !== undefined && (
          <div className="timer-display">
            <div className="timer-label">残り時間</div>
            <div className={`timer-value ${timeRemaining <= 10 ? 'urgent' : ''}`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 統計情報表示
  const renderStats = () => {
    if (!showProgress) return null;

    const progressPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const currentSessionCards = currentCards.filter(card => flippedCards.has(card.id)).length;

    return (
      <div className="stats-tablet">
        <div className="stat-item-tablet">
          <div className="stat-value">{correctAnswers}</div>
          <div className="stat-label">正解数</div>
        </div>
        <div className="stat-item-tablet">
          <div className="stat-value">{totalQuestions}</div>
          <div className="stat-label">総問題数</div>
        </div>
        <div className="stat-item-tablet">
          <div className="stat-value">{progressPercentage.toFixed(1)}%</div>
          <div className="stat-label">正解率</div>
        </div>
        <div className="stat-item-tablet">
          <div className="stat-value">{currentSessionCards}</div>
          <div className="stat-label">学習済み</div>
        </div>
      </div>
    );
  };

  // カード選択処理
  const handleCardSelect = (cardId: number) => {
    setSelectedCardId(cardId);
    onCardSelect(cardId);
    
    // 競技モードでは即座に判定
    if (practiceMode === 'competition') {
      setShowAnswer(true);
      setTimeout(() => {
        setShowAnswer(false);
        setSelectedCardId(null);
      }, 1000);
    }
  };

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

  // カードアクション処理
  const handleCardAction = (action: string, cardId: number) => {
    onCardAction(action, cardId);
  };

  // ページネーション
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination-tablet">
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← 前のページ
        </button>
        
        <div className="pagination-info">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        
        <button
          className="pagination-button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次のページ →
        </button>
      </div>
    );
  };

  // 回答結果表示
  const renderAnswerResult = () => {
    if (!showAnswer || !selectedCardId) return null;

    const selectedCard = currentCards.find(card => card.id === selectedCardId);
    const isCorrect = selectedCard && selectedCard.id === selectedCardId;
    
    return (
      <div className={`answer-result-tablet ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="result-content">
          <div className="result-icon">
            {isCorrect ? '✓' : '✗'}
          </div>
          <div className="result-text">
            {isCorrect ? '正解！' : '不正解'}
          </div>
        </div>
      </div>
    );
  };

  // 練習モード情報
  const renderPracticeInfo = () => {
    return (
      <div className="practice-info-tablet">
        <div className="practice-mode-indicator">
          <span className="mode-label">
            {practiceMode === 'normal' && '📖 通常練習'}
            {practiceMode === 'kimariji-only' && '🎯 決まり字練習'}
            {practiceMode === 'competition' && '🏆 競技モード'}
          </span>
        </div>
        
        {practiceMode === 'kimariji-only' && (
          <div className="practice-tips">
            💡 決まり字を素早く認識して正しいカードを選択しましょう
          </div>
        )}
        
        {practiceMode === 'competition' && (
          <div className="practice-tips">
            ⚡ 競技かるたルールに準拠した練習です
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`tablet-layout practice-mode-${practiceMode}`}>
      {/* 決まり字表示 */}
      {renderKimarijiDisplay()}
      
      {/* 統計情報 */}
      {renderStats()}
      
      {/* 練習モード情報 */}
      {renderPracticeInfo()}
      
      {/* 回答結果表示 */}
      {renderAnswerResult()}
      
      {/* カードグリッド (6×2段) */}
      <div className="cards-grid">
        {currentCards.map((card, index) => (
          <div key={card.id} className="card-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContainer
              card={card}
              isFlipped={flippedCards.has(card.id)}
              showFurigana={settings.showFurigana && isLoggedIn}
              showMeaning={settings.showMeaning}
              isMemorized={false}
              isFavorite={false}
              onCardAction={handleCardAction}
              onFlip={() => handleCardFlip(card.id)}
              className={`tablet-card ${selectedCardId === card.id ? 'selected' : ''}`}
              onClick={() => handleCardSelect(card.id)}
            />
          </div>
        ))}
        
        {/* 空のスロットを埋める（見た目の均等性のため） */}
        {Array.from({ length: Math.max(0, cardsPerPage - currentCards.length) }, (_, i) => (
          <div key={`empty-${i}`} className="card-item empty-slot" />
        ))}
      </div>
      
      {/* ページネーション */}
      {renderPagination()}
    </div>
  );
};

// タブレット用レイアウトのスタイル
const tabletStyles = `
  .tablet-layout {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 1.5rem;
  }
  
  .tablet-card {
    width: 100%;
    height: 120px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .tablet-card.selected {
    border: 2px solid var(--color-accent-blue);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    transform: scale(1.05);
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(2, auto);
    gap: 0.75rem;
    margin: 2rem 0;
  }
  
  .empty-slot {
    background: rgba(0, 0, 0, 0.05);
    border: 1px dashed rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }
  
  .kimariji-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .kimariji-content {
    text-align: center;
    flex: 1;
  }
  
  .kimariji-label {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.5rem;
  }
  
  .kimariji-instruction {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-top: 0.5rem;
  }
  
  .timer-display {
    text-align: center;
    min-width: 120px;
  }
  
  .timer-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .timer-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent-blue);
    font-family: 'Courier New', monospace;
  }
  
  .timer-value.urgent {
    color: var(--color-accent-red);
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .stats-tablet {
    display: flex;
    justify-content: space-around;
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .stat-item-tablet {
    text-align: center;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent-blue);
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
  
  .pagination-tablet {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem;
  }
  
  .pagination-button {
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, #4338ca 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .pagination-info {
    display: flex;
    gap: 0.5rem;
  }
  
  .page-number {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .page-number:hover {
    background: var(--color-accent-blue);
    color: white;
  }
  
  .page-number.active {
    background: var(--color-accent-blue);
    color: white;
    font-weight: bold;
  }
  
  .answer-result-tablet {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  }
  
  .answer-result-tablet.correct {
    border: 2px solid var(--color-accent-green);
  }
  
  .answer-result-tablet.incorrect {
    border: 2px solid var(--color-accent-red);
  }
  
  .result-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .result-icon {
    font-size: 1.5rem;
  }
  
  .answer-result-tablet.correct .result-icon {
    color: var(--color-accent-green);
  }
  
  .answer-result-tablet.incorrect .result-icon {
    color: var(--color-accent-red);
  }
  
  .result-text {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .practice-info-tablet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border-radius: 8px;
    border-left: 4px solid var(--color-accent-blue);
  }
  
  .mode-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .practice-tips {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    font-style: italic;
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* アニメーション遅延 */
  .card-item {
    animation: cardFadeIn 0.4s ease-out;
    animation-fill-mode: both;
  }
  
  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* タッチ操作最適化 */
  @media (hover: none) and (pointer: coarse) {
    .tablet-card:hover {
      transform: none;
    }
    
    .tablet-card:active {
      transform: scale(0.98);
    }
  }
`;

// スタイルを動的に注入
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = tabletStyles;
  document.head.appendChild(styleElement);
}

export default TabletLayout;