import React, { useState } from 'react';
import { HyakuninIsshuCard, CardAction } from '../../types/WordCard';

interface CardContainerProps {
  card: HyakuninIsshuCard;
  isFlipped?: boolean;
  showFurigana?: boolean;
  showMeaning?: boolean;
  isMemorized?: boolean;
  isFavorite?: boolean;
  onCardAction?: (action: CardAction, cardId: number) => void;
  onFlip?: (cardId: number) => void;
  onClick?: () => void;
  className?: string;
}

/**
 * 百人一首カードコンテナ
 * フリップアニメーション・状態管理・操作ボタンを含む
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  card,
  isFlipped = false,
  showFurigana = false,
  showMeaning = false,
  isMemorized = false,
  isFavorite = false,
  onCardAction,
  onFlip,
  onClick,
  className = '',
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンクリック時はフリップしない
    if ((e.target as HTMLElement).closest('.card-actions')) {
      return;
    }

    // 外部からのクリックハンドラーを実行
    onClick?.();

    // フリップアニメーション実行
    setIsFlipping(true);
    onFlip?.(card.id);
    
    // アニメーション完了後にフラグリセット
    setTimeout(() => {
      setIsFlipping(false);
    }, 600); // CSS transition duration と合わせる
  };

  const handleAction = (action: CardAction) => {
    onCardAction?.(action, card.id);
  };

  return (
    <div className={`card-flip-container ${className}`}>
      <div 
        className={`card-flip-inner ${isFlipped ? 'flipped' : ''} ${isFlipping ? 'flipping' : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`百人一首 ${card.id}番 ${card.author}の歌`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(e as any);
          }
        }}
      >
        {/* カード表面（上の句） */}
        <CardFront 
          card={card}
          showFurigana={showFurigana}
        />
        
        {/* カード裏面（下の句 + 操作ボタン） */}
        <CardBack
          card={card}
          showFurigana={showFurigana}
          showMeaning={showMeaning}
          isMemorized={isMemorized}
          isFavorite={isFavorite}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};

interface CardFrontProps {
  card: HyakuninIsshuCard;
  showFurigana: boolean;
}

/**
 * カード表面コンポーネント（上の句）
 */
const CardFront: React.FC<CardFrontProps> = ({ card, showFurigana }) => {
  return (
    <div className="card-front hyakunin-card">
      {/* カード番号 */}
      <div className="card-number">{card.id}</div>
      
      {/* 上の句（縦書き） */}
      <div className="card-content-vertical">
        <div className="vertical-container">
          {showFurigana ? (
            <FuriganaText 
              text={card.kamiNoKu}
              furigana={card.reading.kamiNoKu}
              kimarijiInfo={card.kimariji}
              className="waka-text kami-no-ku"
            />
          ) : (
            <div className="waka-text kami-no-ku vertical-text">
              {card.kamiNoKu}
            </div>
          )}
        </div>
        
        {/* 装飾要素 */}
        <div className="card-decoration">
          <div className="card-border-decoration" />
        </div>
      </div>
    </div>
  );
};

interface CardBackProps {
  card: HyakuninIsshuCard;
  showFurigana: boolean;
  showMeaning: boolean;
  isMemorized: boolean;
  isFavorite: boolean;
  onAction: (action: CardAction) => void;
}

/**
 * カード裏面コンポーネント（下の句 + 操作）
 */
const CardBack: React.FC<CardBackProps> = ({
  card,
  showFurigana,
  showMeaning,
  isMemorized,
  isFavorite,
  onAction,
}) => {
  return (
    <div className="card-back hyakunin-card">
      <div className="back-content">
        {/* 作者名と下の句を横並び */}
        <div className="poem-section">
          {/* 作者名（縦書き・左側） */}
          <div className="author-section">
            {showFurigana ? (
              <AuthorWithFurigana
                author={card.author}
                reading={card.reading.author}
              />
            ) : (
              <div className="author-name">
                {card.author}
              </div>
            )}
          </div>
          
          {/* 下の句（縦書き） */}
          <div className="vertical-container">
            {showFurigana ? (
              <FuriganaText 
                text={card.shimoNoKu}
                furigana={card.reading.shimoNoKu}
                className="waka-text shimo-no-ku"
              />
            ) : (
              <div className="waka-text shimo-no-ku vertical-text">
                {card.shimoNoKu}
              </div>
            )}
          </div>
        </div>
        
        {/* アクションボタン群 */}
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`btn-memorized ${isMemorized ? 'active' : ''}`}
            onClick={() => onAction('memorize')}
            aria-label={isMemorized ? '覚えた解除' : '覚えた'}
          >
            {isMemorized ? '✓ 覚えた' : '覚えた'}
          </button>
          
          <button 
            className={`btn-favorite ${isFavorite ? 'active' : ''}`}
            onClick={() => onAction('favorite')}
            aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>
        
        {/* 現代語訳（オプション） */}
        {showMeaning && card.meaning && (
          <div className="meaning-text">
            {card.meaning}
          </div>
        )}
      </div>
    </div>
  );
};

interface FuriganaTextProps {
  text: string;
  furigana: string;
  kimarijiInfo?: {
    position: number;
    length: number;
  };
  className?: string;
}

/**
 * ふりがな付きテキストコンポーネント
 */
const FuriganaText: React.FC<FuriganaTextProps> = ({
  text,
  furigana,
  kimarijiInfo,
  className = '',
}) => {
  const textChars = Array.from(text);
  const furiganaChars = Array.from(furigana);
  
  const renderWithKimariji = () => {
    return textChars.map((char, index) => {
      const isKimariji = kimarijiInfo && 
        index >= kimarijiInfo.position && 
        index < kimarijiInfo.position + kimarijiInfo.length;
      
      return (
        <ruby key={index} className={isKimariji ? 'kimariji' : ''}>
          <span className={isKimariji ? 'kimariji-highlight' : ''}>
            {char}
          </span>
          <rt className={isKimariji ? 'kimariji-furigana' : ''}>
            {furiganaChars[index] || ''}
          </rt>
        </ruby>
      );
    });
  };
  
  return (
    <div className={`vertical-text furigana-container ${className}`}>
      {renderWithKimariji()}
    </div>
  );
};

interface AuthorWithFuriganaProps {
  author: string;
  reading: string;
}

/**
 * ふりがな付き作者名コンポーネント
 */
const AuthorWithFurigana: React.FC<AuthorWithFuriganaProps> = ({
  author,
  reading,
}) => {
  const authorChars = Array.from(author);
  const readingChars = Array.from(reading);
  
  const renderAuthor = () => {
    return authorChars.map((char, index) => (
      <ruby key={index}>
        <span>{char}</span>
        <rt>{readingChars[index] || ''}</rt>
      </ruby>
    ));
  };

  return (
    <div className="author-name furigana-container">
      {renderAuthor()}
    </div>
  );
};