import React, { useState, useEffect } from 'react';
import { HyakuninIsshuCard } from '../../types/WordCard';
import { CardContainer } from '../HyakuninIsshu/CardContainer';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

interface DesktopLayoutProps {
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
  memorizationTime?: number;
  isMemorizationPhase?: boolean;
}

/**
 * PC用レイアウト（5×10段 = 50枚表示）
 * 本格的な競技かるた体験に最適化されたレイアウト
 */
export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
  memorizationTime,
  isMemorizationPhase = false,
}) => {
  const { settings } = useSettings();
  const { isLoggedIn } = useAuth();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);

  const cardsPerPage = 50;
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = cards.slice(startIndex, startIndex + cardsPerPage);

  // 決まり字を表示するかどうか
  const shouldShowKimariji = practiceMode === 'kimariji-only' || 
                           settings.kimarijiSettings.showKimariji;

  // キーボードショートカット
  useEffect(() => {
    if (!keyboardShortcuts) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
          break;
        case 'Space':
          event.preventDefault();
          // スペースキーでランダムカードを選択
          if (currentCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * currentCards.length);
            const randomCard = currentCards[randomIndex];
            if (randomCard) {
              handleCardSelect(randomCard.id);
            }
          }
          break;
        case 'r':
          event.preventDefault();
          // Rキーで全カードリセット
          setFlippedCards(new Set());
          setSelectedCardId(null);
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedCardId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, currentCards, keyboardShortcuts, onPageChange]);

  // ヘッダー部分の表示
  const renderHeader = () => {
    return (
      <div className="desktop-header">
        <div className="header-left">
          <h1 className="app-title">🎴 百人一首トレーニング</h1>
          <div className="mode-indicator">
            <span className={`mode-badge mode-${practiceMode}`}>
              {practiceMode === 'normal' && '📖 通常練習'}
              {practiceMode === 'kimariji-only' && '🎯 決まり字練習'}
              {practiceMode === 'competition' && '🏆 競技モード'}
            </span>
          </div>
        </div>
        
        <div className="header-right">
          {isMemorizationPhase && memorizationTime && (
            <div className="memorization-timer">
              <div className="timer-label">暗記時間</div>
              <div className="timer-value">
                {Math.floor(memorizationTime / 60)}:{(memorizationTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
          
          {timeRemaining !== undefined && !isMemorizationPhase && (
            <div className="game-timer">
              <div className="timer-label">残り時間</div>
              <div className={`timer-value ${timeRemaining <= 30 ? 'urgent' : ''}`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 決まり字表示エリア
  const renderKimarijiDisplay = () => {
    if (!shouldShowKimariji || !currentKimariji) return null;

    return (
      <div className="kimariji-display-desktop">
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
      </div>
    );
  };

  // 詳細統計表示
  const renderDetailedStats = () => {
    if (!showProgress) return null;

    const progressPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const currentSessionCards = currentCards.filter(card => flippedCards.has(card.id)).length;
    const sessionProgress = (currentSessionCards / currentCards.length) * 100;

    return (
      <div className="stats-desktop">
        <div className="stat-category">
          <div className="category-title">今回の成績</div>
          <div className="stat-row">
            <div className="stat-item-desktop">
              <div className="stat-value">{correctAnswers}</div>
              <div className="stat-label">正解数</div>
            </div>
            <div className="stat-item-desktop">
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">総問題数</div>
            </div>
            <div className="stat-item-desktop">
              <div className="stat-value">{progressPercentage.toFixed(1)}%</div>
              <div className="stat-label">正解率</div>
            </div>
          </div>
        </div>
        
        <div className="stat-category">
          <div className="category-title">学習進捗</div>
          <div className="stat-row">
            <div className="stat-item-desktop">
              <div className="stat-value">{currentSessionCards}</div>
              <div className="stat-label">学習済み</div>
            </div>
            <div className="stat-item-desktop">
              <div className="stat-value">{currentCards.length}</div>
              <div className="stat-label">総カード数</div>
            </div>
            <div className="stat-item-desktop">
              <div className="stat-value">{sessionProgress.toFixed(1)}%</div>
              <div className="stat-label">進捗率</div>
            </div>
          </div>
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
      }, 800);
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
      <div className="pagination-desktop">
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            最初
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← 前
          </button>
          
          <div className="pagination-info">
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            次 →
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            最後
          </button>
        </div>
        
        <div className="page-info">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  // キーボードショートカット表示
  const renderKeyboardShortcuts = () => {
    return (
      <div className="keyboard-shortcuts">
        <div className="shortcuts-toggle">
          <button
            className="toggle-button"
            onClick={() => setKeyboardShortcuts(!keyboardShortcuts)}
          >
            ⌨️ ショートカット {keyboardShortcuts ? 'ON' : 'OFF'}
          </button>
        </div>
        
        {keyboardShortcuts && (
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>←</kbd> <span>前のページ</span>
            </div>
            <div className="shortcut-item">
              <kbd>→</kbd> <span>次のページ</span>
            </div>
            <div className="shortcut-item">
              <kbd>Space</kbd> <span>ランダム選択</span>
            </div>
            <div className="shortcut-item">
              <kbd>R</kbd> <span>リセット</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd> <span>選択解除</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`desktop-layout practice-mode-${practiceMode}`}>
      {/* ヘッダー */}
      {renderHeader()}
      
      {/* 決まり字表示 */}
      {renderKimarijiDisplay()}
      
      {/* 詳細統計 */}
      {renderDetailedStats()}
      
      {/* 暗記フェーズの表示 */}
      {isMemorizationPhase && (
        <div className="memorization-phase">
          <div className="phase-indicator">
            📖 暗記時間 - カードの配置を覚えてください
          </div>
        </div>
      )}
      
      {/* カードグリッド (5×10段) */}
      <div className="cards-grid">
        {currentCards.map((card, index) => (
          <div 
            key={card.id} 
            className="card-item" 
            style={{ animationDelay: `${index * 0.05}s` }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardContainer
              card={card}
              isFlipped={flippedCards.has(card.id)}
              showFurigana={settings.showFurigana && isLoggedIn}
              showMeaning={settings.showMeaning}
              isMemorized={false}
              isFavorite={false}
              onCardAction={handleCardAction}
              onFlip={() => handleCardFlip(card.id)}
              className={`desktop-card ${
                selectedCardId === card.id ? 'selected' : ''
              } ${hoveredCard === card.id ? 'hovered' : ''}`}
              onClick={() => handleCardSelect(card.id)}
            />
          </div>
        ))}
        
        {/* 空のスロットを埋める */}
        {Array.from({ length: Math.max(0, cardsPerPage - currentCards.length) }, (_, i) => (
          <div key={`empty-${i}`} className="card-item empty-slot" />
        ))}
      </div>
      
      {/* ページネーション */}
      {renderPagination()}
      
      {/* キーボードショートカット */}
      {renderKeyboardShortcuts()}
    </div>
  );
};

// PC用レイアウトのスタイル
const desktopStyles = `
  .desktop-layout {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .desktop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
  
  .mode-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .mode-badge.mode-normal {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
  }
  
  .mode-badge.mode-kimariji-only {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }
  
  .mode-badge.mode-competition {
    background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
    color: #991b1b;
  }
  
  .header-right {
    display: flex;
    gap: 2rem;
  }
  
  .memorization-timer,
  .game-timer {
    text-align: center;
  }
  
  .timer-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .timer-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--color-accent-blue);
    font-family: 'Courier New', monospace;
  }
  
  .timer-value.urgent {
    color: var(--color-accent-red);
    animation: pulse 1s infinite;
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(10, auto);
    gap: 0.5rem;
    margin: 2rem 0;
  }
  
  .desktop-card {
    width: 100%;
    height: 100px;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .desktop-card.selected {
    border: 2px solid var(--color-accent-blue);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
    transform: scale(1.05);
    z-index: 10;
  }
  
  .desktop-card.hovered {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .empty-slot {
    background: rgba(0, 0, 0, 0.03);
    border: 1px dashed rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  
  .kimariji-display-desktop {
    text-align: center;
    margin: 2rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-radius: 12px;
    border: 2px solid var(--color-accent-gold);
  }
  
  .kimariji-content .kimariji-label {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }
  
  .kimariji-content .kimariji-instruction {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-top: 1rem;
  }
  
  .stats-desktop {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 2rem 0;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .stat-category {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .category-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-around;
  }
  
  .stat-item-desktop {
    text-align: center;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-accent-blue);
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
  
  .memorization-phase {
    text-align: center;
    margin: 2rem 0;
    padding: 1rem;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-radius: 8px;
    border: 2px solid var(--color-accent-blue);
  }
  
  .phase-indicator {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-accent-blue);
  }
  
  .pagination-desktop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
    padding: 2rem;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .pagination-button {
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, #4338ca 100%);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
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
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }
  
  .pagination-info {
    display: flex;
    gap: 0.25rem;
  }
  
  .page-number {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 35px;
    text-align: center;
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
  
  .page-info {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
  
  .keyboard-shortcuts {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .shortcuts-toggle {
    padding: 0.5rem;
  }
  
  .toggle-button {
    background: none;
    border: none;
    font-size: 0.8rem;
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: color 0.2s ease;
  }
  
  .toggle-button:hover {
    color: var(--color-text-primary);
  }
  
  .shortcuts-list {
    border-top: 1px solid var(--color-border);
    padding: 1rem;
    min-width: 180px;
  }
  
  .shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }
  
  .shortcut-item:last-child {
    margin-bottom: 0;
  }
  
  .shortcut-item kbd {
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 3px;
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
    font-family: monospace;
  }
  
  .shortcut-item span {
    color: var(--color-text-secondary);
  }
  
  /* カードアニメーション */
  .card-item {
    animation: cardSlideIn 0.5s ease-out;
    animation-fill-mode: both;
  }
  
  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// スタイルを動的に注入
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = desktopStyles;
  document.head.appendChild(styleElement);
}

export default DesktopLayout;