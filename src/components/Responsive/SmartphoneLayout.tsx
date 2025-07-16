import React, { useState } from 'react';
import { HyakuninIsshuCard } from '../../types/WordCard';
import { CardContainer } from '../HyakuninIsshu/CardContainer';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';

interface SmartphoneLayoutProps {
  cards: HyakuninIsshuCard[];
  currentCardIndex: number;
  onCardSelect: (cardId: number) => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onCardAction: (action: string, cardId: number) => void;
  practiceMode: 'normal' | 'kimariji-only' | 'competition';
  currentKimariji?: string;
  showProgress?: boolean;
  correctAnswers?: number;
  totalQuestions?: number;
}

/**
 * スマートフォン用レイアウト（2枚表示）
 * 決まり字練習に最適化された縦並びレイアウト
 */
export const SmartphoneLayout: React.FC<SmartphoneLayoutProps> = ({
  cards,
  currentCardIndex,
  onCardSelect,
  onNextCard,
  onPrevCard,
  onCardAction,
  practiceMode,
  currentKimariji,
  showProgress = false,
  correctAnswers = 0,
  totalQuestions = 0,
}) => {
  const { settings } = useSettings();
  const { isLoggedIn } = useAuth();
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // 現在のカードを取得
  const currentCard = cards[currentCardIndex];
  const nextCard = cards[currentCardIndex + 1];

  // 決まり字を表示するかどうか
  const shouldShowKimariji = practiceMode === 'kimariji-only' || 
                           settings.kimarijiSettings.showKimariji;

  // 決まり字の表示
  const renderKimarijiDisplay = () => {
    if (!shouldShowKimariji || !currentKimariji) return null;

    return (
      <div className="kimariji-display">
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
    );
  };

  // 進捗表示
  const renderProgress = () => {
    if (!showProgress) return null;

    const progressPercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return (
      <div className="stats-mobile">
        <div className="stat-item-mobile">
          <strong>進捗: {correctAnswers}/{totalQuestions}</strong>
        </div>
        <div className="stat-item-mobile">
          正解率: {progressPercentage.toFixed(1)}%
        </div>
        <div className="progress-bar-mobile">
          <div 
            className="progress-fill-mobile" 
            style={{ width: `${progressPercentage}%` }}
          />
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
        onNextCard();
      }, 1500);
    }
  };

  // カードアクション処理
  const handleCardAction = (action: string, cardId: number) => {
    onCardAction(action, cardId);
  };

  // ナビゲーション表示
  const renderNavigation = () => {
    if (practiceMode === 'competition') return null;

    return (
      <div className="navigation-mobile">
        <button
          className="nav-button-mobile"
          onClick={onPrevCard}
          disabled={currentCardIndex === 0}
        >
          ← 前へ
        </button>
        <div className="card-counter-mobile">
          {currentCardIndex + 1} / {cards.length}
        </div>
        <button
          className="nav-button-mobile"
          onClick={onNextCard}
          disabled={currentCardIndex >= cards.length - 1}
        >
          次へ →
        </button>
      </div>
    );
  };

  // 回答結果表示
  const renderAnswerResult = () => {
    if (!showAnswer || !selectedCardId || !currentCard) return null;

    const isCorrect = selectedCardId === currentCard.id;
    
    return (
      <div className={`answer-result-mobile ${isCorrect ? 'correct' : 'incorrect'}`}>
        <div className="result-icon">
          {isCorrect ? '✓' : '✗'}
        </div>
        <div className="result-text">
          {isCorrect ? '正解！' : '不正解'}
        </div>
        {!isCorrect && (
          <div className="correct-answer">
            正解: {currentCard.author}
          </div>
        )}
      </div>
    );
  };

  if (!currentCard) {
    return (
      <div className="smartphone-layout">
        <div className="no-cards-message">
          カードがありません
        </div>
      </div>
    );
  }

  return (
    <div className={`smartphone-layout practice-mode-${practiceMode}`}>
      {/* 決まり字表示 */}
      {renderKimarijiDisplay()}
      
      {/* 進捗表示 */}
      {renderProgress()}
      
      {/* 回答結果表示 */}
      {renderAnswerResult()}
      
      {/* カードグリッド */}
      <div className="cards-grid">
        {/* 現在のカード */}
        <div className="card-item">
          <CardContainer
            card={currentCard}
            isFlipped={practiceMode === 'normal'}
            showFurigana={settings.showFurigana && isLoggedIn}
            showMeaning={settings.showMeaning}
            isMemorized={false}
            isFavorite={false}
            onCardAction={handleCardAction}
            onFlip={() => {}}
            className={`smartphone-card ${selectedCardId === currentCard.id ? 'selected' : ''}`}
            onClick={() => handleCardSelect(currentCard.id)}
          />
        </div>
        
        {/* 次のカード（選択肢として表示） */}
        {nextCard && (
          <div className="card-item">
            <CardContainer
              card={nextCard}
              isFlipped={practiceMode === 'normal'}
              showFurigana={settings.showFurigana && isLoggedIn}
              showMeaning={settings.showMeaning}
              isMemorized={false}
              isFavorite={false}
              onCardAction={handleCardAction}
              onFlip={() => {}}
              className={`smartphone-card ${selectedCardId === nextCard.id ? 'selected' : ''}`}
              onClick={() => handleCardSelect(nextCard.id)}
            />
          </div>
        )}
      </div>
      
      {/* ナビゲーション */}
      {renderNavigation()}
      
      {/* 練習モード固有の情報 */}
      {practiceMode === 'kimariji-only' && (
        <div className="practice-info-mobile">
          <div className="practice-tip">
            💡 決まり字を覚えて素早く判断しましょう
          </div>
        </div>
      )}
      
      {practiceMode === 'competition' && (
        <div className="practice-info-mobile">
          <div className="competition-info">
            ⏱️ 競技モード：制限時間内に正解を選んでください
          </div>
        </div>
      )}
    </div>
  );
};

// スマートフォン用レイアウトのスタイル
const smartphoneStyles = `
  .smartphone-layout {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .smartphone-card {
    width: 100%;
    height: 200px;
    border-radius: 12px;
    transition: all 0.3s ease;
  }
  
  .smartphone-card.selected {
    border: 3px solid var(--color-accent-blue);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
  }
  
  .navigation-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
  }
  
  .nav-button-mobile {
    background: linear-gradient(135deg, var(--color-accent-blue) 0%, #4338ca 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .nav-button-mobile:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .nav-button-mobile:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  .card-counter-mobile {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .progress-bar-mobile {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.5rem;
  }
  
  .progress-fill-mobile {
    height: 100%;
    background: linear-gradient(90deg, var(--color-accent-green) 0%, var(--color-accent-blue) 100%);
    transition: width 0.3s ease;
  }
  
  .answer-result-mobile {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    z-index: 1000;
    animation: resultAppear 0.3s ease-out;
  }
  
  .answer-result-mobile.correct {
    border: 3px solid var(--color-accent-green);
  }
  
  .answer-result-mobile.incorrect {
    border: 3px solid var(--color-accent-red);
  }
  
  .result-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .answer-result-mobile.correct .result-icon {
    color: var(--color-accent-green);
  }
  
  .answer-result-mobile.incorrect .result-icon {
    color: var(--color-accent-red);
  }
  
  .result-text {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .correct-answer {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
  }
  
  .practice-info-mobile {
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    text-align: center;
  }
  
  .practice-tip {
    color: var(--color-accent-blue);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .competition-info {
    color: var(--color-accent-red);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .no-cards-message {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-secondary);
    font-size: 1.2rem;
  }
  
  @keyframes resultAppear {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

// スタイルを動的に注入
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = smartphoneStyles;
  document.head.appendChild(styleElement);
}

export default SmartphoneLayout;