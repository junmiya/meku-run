import React, { useState } from 'react';

import { WordCard as WordCardType } from '../types/WordCard';
import './WordCard.css';

interface WordCardProps {
  card: WordCardType;
  onEdit?: (card: WordCardType) => void;
  onDelete?: (id: string) => void;
  onToggleStar?: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ 
  card, 
  onEdit, 
  onDelete, 
  onToggleStar 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="card-face front">
          <div className="card-content">
            <h3>{card.word}</h3>
            {card.tags && card.tags.length > 0 && (
              <div className="tags">
                {card.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="card-face back">
          <div className="card-content">
            <p>{card.meaning}</p>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button 
          className={`star-btn ${card.isStarred ? 'starred' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar?.(card.id);
          }}
        >
          ★
        </button>
        <button 
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(card);
          }}
        >
          編集
        </button>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(card.id);
          }}
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default WordCard;