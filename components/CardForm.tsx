import React, { useState, useEffect } from 'react';

import { WordCard } from '../types/WordCard';
import './CardForm.css';

interface CardFormProps {
  card?: WordCard | undefined;
  onSave: (card: Omit<WordCard, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ card, onSave, onCancel }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [tags, setTags] = useState('');
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    if (card) {
      setWord(card.word);
      setMeaning(card.meaning);
      setTags(card.tags?.join(', ') || '');
      setIsStarred(card.isStarred || false);
    }
  }, [card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim() || !meaning.trim()) {
      alert('単語と意味を入力してください');
      return;
    }

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const cardData: Omit<WordCard, 'id' | 'created_at' | 'updated_at'> = {
      word: word.trim(),
      meaning: meaning.trim(),
      isStarred,
      ...(tagArray.length > 0 && { tags: tagArray })
    };

    onSave(cardData);

    // Reset form
    setWord('');
    setMeaning('');
    setTags('');
    setIsStarred(false);
  };

  return (
    <div className="card-form-overlay">
      <div className="card-form">
        <h2>{card ? '単語カードを編集' : '新しい単語カードを作成'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="word">単語</label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="単語を入力"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="meaning">意味</label>
            <textarea
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="意味を入力"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">タグ（カンマ区切り）</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="タグ1, タグ2, タグ3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isStarred}
                onChange={(e) => setIsStarred(e.target.checked)}
              />
              お気に入り
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              キャンセル
            </button>
            <button type="submit" className="save-btn">
              {card ? '更新' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardForm;