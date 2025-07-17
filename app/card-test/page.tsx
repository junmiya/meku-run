'use client';

import React, { useState } from 'react';
import { hyakuninIsshuData } from '../../src/data/hyakunin-isshu-data';
import './page.css';

/**
 * 百人一首カード表示テスト（簡易版）
 * コンポーネントインポートなしで基本機能確認
 */
export default function CardTestPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);

  const card = hyakuninIsshuData[currentCard];

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % hyakuninIsshuData.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + hyakuninIsshuData.length) % hyakuninIsshuData.length);
    setIsFlipped(false);
  };

  if (!card) {
    return <div className="card-test-page">カードが見つかりません</div>;
  }

  return (
    <div className="card-test-page">
      <div className="header">
        <h1>🎴 百人一首カードテスト</h1>
        <div className="controls">
          <div className="control-group">
            <button className="btn" onClick={prevCard}>前の札</button>
            <button className="btn" onClick={nextCard}>次の札</button>
          </div>
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showFurigana}
                onChange={(e) => setShowFurigana(e.target.checked)}
              />
              ふりがな表示
            </label>
          </div>
        </div>
      </div>

      <div className="card-container">
        <div className="card">
          <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
            {/* カード表面（上の句） */}
            <div className="card-front" onClick={handleCardClick}>
              <div className="card-number">{card.id}</div>
              <div className="vertical-text">
                {showFurigana ? card.reading.kamiNoKu : card.kamiNoKu}
              </div>
              <div className="author">
                {showFurigana ? card.reading.author : card.author}
              </div>
            </div>

            {/* カード裏面（下の句） */}
            <div className="card-back" onClick={handleCardClick}>
              <div className="card-number">{card.id}</div>
              <div className="vertical-text">
                {showFurigana ? card.reading.shimoNoKu : card.shimoNoKu}
              </div>
              <div className="author">
                {showFurigana ? card.reading.author : card.author}
              </div>
              {card.meaning && (
                <div className="meaning">
                  {card.meaning}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn" onClick={handleCardClick}>
          {isFlipped ? '表面に戻る' : '裏面を見る'}
        </button>
      </div>

      <div className="card-stats">
        <div className="stat-item">
          <div className="stat-value">{currentCard + 1}</div>
          <div className="stat-label">現在の札</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{hyakuninIsshuData.length}</div>
          <div className="stat-label">全札数</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{card.kimariji.length}</div>
          <div className="stat-label">決まり字文字数</div>
        </div>
      </div>

      <div className="footer">
        <p>
          百人一首トレーニングアプリ - カード表示テスト<br />
          クリックでカードを回転 | 
          <a href="/hyakunin-isshu">メインアプリへ</a>
        </p>
      </div>
    </div>
  );
}