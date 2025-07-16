import React from 'react';
import { HyakuninIsshuCard } from '../../types/WordCard';

interface VerticalTextProps {
  text: string;
  furigana?: string | undefined;
  kimarijiInfo?: {
    position: number;
    length: number;
  } | undefined;
  className?: string;
  showFurigana?: boolean;
}

/**
 * 縦書きテキスト表示コンポーネント
 * ふりがなと決まり字ハイライト機能付き
 */
export const VerticalText: React.FC<VerticalTextProps> = ({
  text,
  furigana,
  kimarijiInfo,
  className = '',
  showFurigana = false,
}) => {
  // ふりがな表示なしの場合は単純な縦書きテキスト
  if (!showFurigana || !furigana) {
    return (
      <div className={`vertical-text ${className}`}>
        {text}
      </div>
    );
  }

  // ふりがな付きテキストのレンダリング
  const renderFuriganaText = () => {
    const textChars = Array.from(text);
    const furiganaChars = Array.from(furigana);
    
    return textChars.map((char, index) => {
      // 決まり字判定
      const isKimariji = kimarijiInfo && 
        index >= kimarijiInfo.position && 
        index < kimarijiInfo.position + kimarijiInfo.length;
      
      const rubyClass = isKimariji ? 'kimariji' : '';
      const charClass = isKimariji ? 'kimariji-highlight' : '';
      const rtClass = isKimariji ? 'kimariji-furigana' : '';
      
      return (
        <ruby key={index} className={rubyClass}>
          <span className={charClass}>
            {char}
          </span>
          <rt className={rtClass}>
            {furiganaChars[index] || ''}
          </rt>
        </ruby>
      );
    });
  };

  return (
    <div className={`vertical-text furigana-container ${className}`}>
      {renderFuriganaText()}
    </div>
  );
};

interface WakaTextProps {
  kamiNoKu: string;
  shimoNoKu?: string;
  reading?: {
    kamiNoKu: string;
    shimoNoKu?: string;
  };
  kimarijiInfo?: {
    position: number;
    length: number;
  };
  showFurigana?: boolean;
  side?: 'front' | 'back';
}

/**
 * 和歌テキスト表示コンポーネント
 * 上の句・下の句の表示を管理
 */
export const WakaText: React.FC<WakaTextProps> = ({
  kamiNoKu,
  shimoNoKu,
  reading,
  kimarijiInfo,
  showFurigana = false,
  side = 'front',
}) => {
  if (side === 'front') {
    // カード表面：上の句のみ
    return (
      <div className="vertical-container">
        <VerticalText
          text={kamiNoKu}
          furigana={reading?.kamiNoKu}
          kimarijiInfo={kimarijiInfo}
          className="waka-text kami-no-ku"
          showFurigana={showFurigana}
        />
      </div>
    );
  }

  // カード裏面：下の句
  return (
    <div className="vertical-container">
      {shimoNoKu && (
        <VerticalText
          text={shimoNoKu}
          furigana={reading?.shimoNoKu}
          className="waka-text shimo-no-ku"
          showFurigana={showFurigana}
        />
      )}
    </div>
  );
};

interface AuthorNameProps {
  author: string;
  reading?: string | undefined;
  showFurigana?: boolean;
}

/**
 * 作者名表示コンポーネント
 */
export const AuthorName: React.FC<AuthorNameProps> = ({
  author,
  reading,
  showFurigana = false,
}) => {
  if (!showFurigana || !reading) {
    return (
      <div className="author-name">
        {author}
      </div>
    );
  }

  // 作者名のふりがな表示
  const authorChars = Array.from(author);
  const readingChars = Array.from(reading);
  
  const renderAuthorWithFurigana = () => {
    return authorChars.map((char, index) => (
      <ruby key={index}>
        <span>{char}</span>
        <rt>{readingChars[index] || ''}</rt>
      </ruby>
    ));
  };

  return (
    <div className="author-name furigana-container">
      {renderAuthorWithFurigana()}
    </div>
  );
};

interface MeaningTextProps {
  meaning: string;
  show?: boolean;
}

/**
 * 現代語訳表示コンポーネント
 */
export const MeaningText: React.FC<MeaningTextProps> = ({
  meaning,
  show = false,
}) => {
  if (!show || !meaning) {
    return null;
  }

  return (
    <div className="meaning-text">
      {meaning}
    </div>
  );
};

interface CardNumberProps {
  number: number;
}

/**
 * カード番号表示コンポーネント
 */
export const CardNumber: React.FC<CardNumberProps> = ({ number }) => {
  return (
    <div className="card-number">
      {number}
    </div>
  );
};