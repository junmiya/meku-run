'use client';

import React, { useState, useEffect } from 'react';
import { hyakuninIsshuData } from '../src/data/hyakunin-isshu-data';
import { ResponsiveCardManager } from '../src/managers/ResponsiveCardManager';
import { memorizationManager } from '../src/managers/MemorizationManager';
import { TrainingGameManager } from '../src/managers/TrainingGameManager';
import { PerformanceManager } from '../src/managers/PerformanceManager';
import { HyakuninIsshuCard } from '../src/types/WordCard';
import { getCardsByKimarijiLength, getKimarijiInfo, debugKimarijiClassification, memorizeHelpers } from '../src/data/kimariji-data';
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
  const [selectedKimarijiLevels, setSelectedKimarijiLevels] = useState<Set<number>>(new Set([1]));
  const [mixedTrainingMode, setMixedTrainingMode] = useState(false);
  const [activeTrainingSession, setActiveTrainingSession] = useState(false);
  const [currentTrainingCard, setCurrentTrainingCard] = useState<HyakuninIsshuCard | null>(null);
  const [trainingCardIndex, setTrainingCardIndex] = useState(0);
  const [trainingCards, setTrainingCards] = useState<HyakuninIsshuCard[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [trainingScore, setTrainingScore] = useState({ correct: 0, total: 0 });
  const [answerChoices, setAnswerChoices] = useState<HyakuninIsshuCard[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [trainingStartTime, setTrainingStartTime] = useState<number | null>(null);
  const [trainingEndTime, setTrainingEndTime] = useState<number | null>(null);
  const [showTrainingCompleteScreen, setShowTrainingCompleteScreen] = useState(false);
  
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

  // 決まり字レベル選択ハンドラ
  const handleKimarijiLevelToggle = (level: number) => {
    const newSelection = new Set(selectedKimarijiLevels);
    if (newSelection.has(level)) {
      newSelection.delete(level);
    } else {
      newSelection.add(level);
    }
    setSelectedKimarijiLevels(newSelection);
    
    // 混合モードは自動的に無効化
    if (mixedTrainingMode) {
      setMixedTrainingMode(false);
    }
  };

  const handleMixedModeToggle = () => {
    setMixedTrainingMode(!mixedTrainingMode);
    // 混合モード有効時は個別選択をクリア
    if (!mixedTrainingMode) {
      setSelectedKimarijiLevels(new Set());
    }
  };

  // 選択されたレベルから対象札を取得
  const getTargetCardsForTraining = (): HyakuninIsshuCard[] => {
    if (mixedTrainingMode) {
      // 混合モード：全ての札を対象
      return hyakuninIsshuData;
    }
    
    if (selectedKimarijiLevels.size === 0) {
      return [];
    }
    
    // 選択されたレベルの札IDを収集
    const targetCardIds = new Set<number>();
    Array.from(selectedKimarijiLevels).forEach(level => {
      const levelCards = getCardsByKimarijiLength(level);
      levelCards.forEach(cardId => targetCardIds.add(cardId));
    });
    
    // 札IDから実際の札データを取得
    return hyakuninIsshuData.filter(card => targetCardIds.has(card.id));
  };

  // トレーニングセッション開始
  const startTrainingSession = () => {
    const targetCards = getTargetCardsForTraining();
    
    if (targetCards.length === 0) {
      console.warn('対象となる札がありません');
      return;
    }
    
    console.log('トレーニング開始:', {
      mode: mixedTrainingMode ? 'mixed' : 'selected',
      selectedLevels: Array.from(selectedKimarijiLevels),
      targetCardsCount: targetCards.length,
      targetCards: targetCards.map(card => ({ id: card.id, kamiNoKu: card.kamiNoKu.slice(0, 10) + '...' }))
    });
    
    // 開始時刻を記録
    setTrainingStartTime(Date.now());
    setTrainingEndTime(null);
    setShowTrainingCompleteScreen(false);
    
    // TrainingGameManagerでセッション開始
    trainingGameManager.startSession(
      'memorization', // まずは暗記モードから開始
      mixedTrainingMode ? 'mixed' : Array.from(selectedKimarijiLevels)[0] as any,
      {
        timeLimit: 300, // 5分
        memorizationTime: 60, // 1分
        judgeMode: 'normal'
      }
    );
    
    // トレーニング状態の初期化
    const shuffledCards = [...targetCards].sort(() => Math.random() - 0.5); // シャッフル
    setTrainingCards(shuffledCards);
    const firstCard = shuffledCards.length > 0 ? shuffledCards[0]! : null;
    setCurrentTrainingCard(firstCard);
    setTrainingCardIndex(0);
    setShowAnswer(false);
    setTrainingScore({ correct: 0, total: 0 });
    setSelectedChoice(null);
    setShowResult(false);
    
    // 最初の問題の選択肢を生成
    if (firstCard) {
      setAnswerChoices(generateAnswerChoices(firstCard));
    }
    
    // トレーニングモードを終了してセッション画面に移行
    setIsTrainingMode(false);
    setActiveTrainingSession(true);
  };

  // 選択肢を生成する関数
  const generateAnswerChoices = (correctCard: HyakuninIsshuCard): HyakuninIsshuCard[] => {
    // 正解以外のカードからランダムに3つ選択
    const otherCards = hyakuninIsshuData.filter(card => card.id !== correctCard.id);
    const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
    const wrongChoices = shuffledOthers.slice(0, 3);
    
    // 正解と不正解を混ぜてシャッフル
    const allChoices = [correctCard, ...wrongChoices];
    return allChoices.sort(() => Math.random() - 0.5);
  };

  // 選択肢クリック時
  const handleChoiceSelect = (choiceIndex: number) => {
    if (selectedChoice !== null || !currentTrainingCard || choiceIndex >= answerChoices.length) return; // 既に選択済みまたはカードがない場合は無視
    
    setSelectedChoice(choiceIndex);
    setShowResult(true);
    
    const selectedCard = answerChoices[choiceIndex];
    if (!selectedCard) return; // カードが見つからない場合は無視
    
    const isCorrect = selectedCard.id === currentTrainingCard.id;
    
    // スコア更新
    setTrainingScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    // 1秒後に次の問題へ
    setTimeout(() => {
      nextTrainingCard();
    }, 1000);
  };

  // トレーニング問題の回答表示
  const showTrainingAnswer = () => {
    setShowAnswer(true);
  };

  // 「覚えた」ボタンクリック時
  const markTrainingCardAsKnown = () => {
    if (currentTrainingCard) {
      setTrainingScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      nextTrainingCard();
    }
  };

  // 「わからない」ボタンクリック時
  const markTrainingCardAsUnknown = () => {
    if (currentTrainingCard) {
      setTrainingScore(prev => ({ correct: prev.correct, total: prev.total + 1 }));
      nextTrainingCard();
    }
  };

  // 次の問題へ
  const nextTrainingCard = () => {
    const nextIndex = trainingCardIndex + 1;
    if (nextIndex < trainingCards.length) {
      setTrainingCardIndex(nextIndex);
      const nextCard = trainingCards[nextIndex]!;
      setCurrentTrainingCard(nextCard);
      setShowAnswer(false);
      setSelectedChoice(null);
      setShowResult(false);
      
      // 次の問題の選択肢を生成
      setAnswerChoices(generateAnswerChoices(nextCard));
    } else {
      // トレーニング完了
      endTrainingSession();
    }
  };

  // トレーニングセッション終了
  const endTrainingSession = () => {
    // 終了時刻を記録
    setTrainingEndTime(Date.now());
    
    const session = trainingGameManager.endSession();
    if (session) {
      performanceManager.updateSessionHistory(session);
    }
    
    // 完了画面を表示
    setShowTrainingCompleteScreen(true);
    
    // セッション状態をリセット（トレーニングモードとスコアは維持）
    setActiveTrainingSession(false);
    setCurrentTrainingCard(null);
    setTrainingCardIndex(0);
    setTrainingCards([]);
    setShowAnswer(false);
    setAnswerChoices([]);
    setSelectedChoice(null);
    setShowResult(false);
    
    // 元の表示に戻す
    setCards(hyakuninIsshuData);
    setDisplayCards(hyakuninIsshuData.slice(0, cardsPerPage));
  };

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
                  if (!showTrainingCompleteScreen) {
                    setIsTrainingMode(false);
                    setIsCompetitionMode(false);
                  }
                }}
                disabled={showTrainingCompleteScreen}
                style={{
                  backgroundColor: !isTrainingMode && !isCompetitionMode && !showTrainingCompleteScreen ? '#3b82f6' : 'transparent',
                  color: !isTrainingMode && !isCompetitionMode && !showTrainingCompleteScreen ? 'white' : '#6b7280',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: !isTrainingMode && !isCompetitionMode && !showTrainingCompleteScreen ? '600' : '400'
                }}
              >
                通常モード
              </button>
              <button
                onClick={() => {
                  if (isLoggedIn && !showTrainingCompleteScreen) {
                    setIsTrainingMode(true);
                    setIsCompetitionMode(false);
                  }
                }}
                disabled={!isLoggedIn || showTrainingCompleteScreen}
                title={!isLoggedIn ? "ログインが必要です" : ""}
                style={{
                  backgroundColor: (isTrainingMode || showTrainingCompleteScreen) && !isCompetitionMode ? '#3b82f6' : 'transparent',
                  color: !isLoggedIn ? '#9ca3af' : ((isTrainingMode || showTrainingCompleteScreen) && !isCompetitionMode ? 'white' : '#6b7280'),
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: (isTrainingMode || showTrainingCompleteScreen) && !isCompetitionMode ? '600' : '400',
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
                  if (isLoggedIn && !showTrainingCompleteScreen) {
                    setIsTrainingMode(false);
                    setIsCompetitionMode(true);
                  }
                }}
                disabled={!isLoggedIn || showTrainingCompleteScreen}
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
            
            {/* 決まり字レベル選択 */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: '#1f2937', 
                marginBottom: '16px' 
              }}>
                🎯 練習する決まり字レベルを選択してください
              </h3>
              
              {/* 個別レベル選択 */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '12px',
                marginBottom: '20px'
              }}>
                {[1, 2, 3, 4, 5, 6].map(level => {
                  const helper = level === 1 ? memorizeHelpers.oneChar :
                                level === 2 ? memorizeHelpers.twoChar :
                                level === 3 ? memorizeHelpers.threeChar :
                                level === 4 ? memorizeHelpers.fourChar :
                                level === 5 ? memorizeHelpers.fiveChar :
                                memorizeHelpers.sixChar;
                  
                  const isSelected = selectedKimarijiLevels.has(level);
                  
                  return (
                    <label 
                      key={level}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: isSelected ? '#e0f2fe' : '#f8fafc',
                        border: isSelected ? '2px solid #0284c7' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        opacity: mixedTrainingMode ? 0.5 : 1
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleKimarijiLevelToggle(level)}
                        disabled={mixedTrainingMode}
                        style={{ 
                          marginRight: '12px',
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {level}字決まり ({'totalCount' in helper ? helper.totalCount : helper.cards?.length || 0}首)
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6b7280' 
                        }}>
                          {helper.explanation}
                          {level === 1 && ' - むすめふさほせ'}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              {/* 混合モード */}
              <div style={{ 
                borderTop: '1px solid #e2e8f0',
                paddingTop: '16px'
              }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: mixedTrainingMode ? '#fef3c7' : '#f8fafc',
                  border: mixedTrainingMode ? '2px solid #f59e0b' : '2px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={mixedTrainingMode}
                    onChange={handleMixedModeToggle}
                    style={{ 
                      marginRight: '12px',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  <div>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      🎲 混合モード - 全レベルランダム出題
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#6b7280' 
                    }}>
                      1〜6字決まりから均等にランダム出題（全100首対象）
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* 練習開始セクション */}
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
                {mixedTrainingMode 
                  ? '🎲 混合モード練習' 
                  : `📚 選択レベル練習 (${selectedKimarijiLevels.size}レベル)`
                }
              </h3>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '16px' 
              }}>
                {mixedTrainingMode 
                  ? '全ての決まり字レベルからランダムに問題を出題します。総合的な実力向上を目指します。'
                  : selectedKimarijiLevels.size === 0 
                    ? '練習するレベルを選択してください。複数選択も可能です。'
                    : `選択した ${Array.from(selectedKimarijiLevels).join('・')} 字決まりレベルから問題を出題します。`
                }
              </p>
              <button
                onClick={startTrainingSession}
                disabled={!mixedTrainingMode && selectedKimarijiLevels.size === 0}
                style={{
                  backgroundColor: (!mixedTrainingMode && selectedKimarijiLevels.size === 0) ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: (!mixedTrainingMode && selectedKimarijiLevels.size === 0) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {mixedTrainingMode || selectedKimarijiLevels.size > 0 ? '練習開始' : 'レベルを選択してください'}
              </button>
            </div>
            </div>
          </ConditionalAuthGuard>
        ) : showTrainingCompleteScreen ? (
          // トレーニング完了画面
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>
              🎉
            </div>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              トレーニング完了！
            </h2>
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  backgroundColor: '#dcfce7',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '12px', color: '#166534', marginBottom: '4px' }}>正解数</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>
                    {trainingScore.correct}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#e0f2fe',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '12px', color: '#0c4a6e', marginBottom: '4px' }}>総問題数</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>
                    {trainingScore.total}
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '12px',
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '12px', color: '#a16207', marginBottom: '4px' }}>正解率</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#a16207' }}>
                    {trainingScore.total > 0 ? Math.round((trainingScore.correct / trainingScore.total) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div style={{
                backgroundColor: '#e0f2fe',
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid #0284c7'
              }}>
                <div style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '4px' }}>かかった時間</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7' }}>
                  {Math.floor((trainingEndTime - trainingStartTime) / 60000)}分 {Math.floor(((trainingEndTime - trainingStartTime) % 60000) / 1000)}秒
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  // 完了画面を閉じてトレーニングモードに戻る
                  setShowTrainingCompleteScreen(false);
                  setIsTrainingMode(true);
                  setTrainingStartTime(null);
                  setTrainingEndTime(null);
                  setTrainingScore({ correct: 0, total: 0 });
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                もう一度練習
              </button>
              <button
                onClick={() => {
                  // 完了画面を閉じて通常モードに戻る
                  setShowTrainingCompleteScreen(false);
                  setIsTrainingMode(false);
                  setTrainingStartTime(null);
                  setTrainingEndTime(null);
                  setTrainingScore({ correct: 0, total: 0 });
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                通常モードに戻る
              </button>
            </div>
          </div>
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
              {/* トレーニングセッション画面 */}
              {activeTrainingSession && currentTrainingCard && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  maxWidth: '800px',
                  margin: '0 auto 24px auto'
                }}>
                  {/* ヘッダー情報 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    padding: '12px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>
                      🎯 トレーニング問題
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#64748b'
                    }}>
                      {trainingCardIndex + 1} / {trainingCards.length} 問目
                    </div>
                  </div>

                  {/* 進捗バー */}
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    height: '8px',
                    marginBottom: '24px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      height: '100%',
                      width: `${((trainingCardIndex + 1) / trainingCards.length) * 100}%`,
                      borderRadius: '8px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  {/* スコア表示 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      textAlign: 'center',
                      padding: '8px 16px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#166534' }}>正解</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#166534' }}>
                        {trainingScore.correct}
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'center',
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '6px'
                    }}>
                      <div style={{ fontSize: '12px', color: '#374151' }}>総問題数</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                        {trainingScore.total}
                      </div>
                    </div>
                  </div>

                  {/* 問題表示 */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '32px',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px'
                    }}>
                      この上の句に続く下の句を選んでください
                    </div>
                    
                    {/* 上の句表示（決まり字付き） */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '24px',
                      marginBottom: '24px'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        lineHeight: '1.6',
                        color: '#1f2937',
                        marginBottom: '16px',
                        fontFamily: 'serif',
                        writingMode: 'horizontal-tb', // 常に横表示
                        textAlign: 'center',
                        minHeight: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {hiraganaMode ? currentTrainingCard.reading.kamiNoKu : currentTrainingCard.kamiNoKu}
                      </div>
                      
                      {/* 決まり字表示（大きく） */}
                      <div style={{
                        fontSize: '24px', // 大きくした
                        color: '#dc2626',
                        backgroundColor: '#fef2f2',
                        padding: '12px 20px', // パディングも大きく
                        borderRadius: '8px',
                        border: '2px solid #dc2626',
                        display: 'inline-block',
                        fontWeight: '700', // より太く
                        marginTop: '8px'
                      }}>
                        決まり字：{getKimarijiInfo(currentTrainingCard.id)?.pattern || currentTrainingCard.reading.kamiNoKu.replace(/\s+/g, '').substring(0, 3)}
                      </div>
                    </div>

                    {/* 選択肢表示 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px'
                    }}>
                      {answerChoices.map((choice, index) => {
                        const isSelected = selectedChoice === index;
                        const isCorrect = choice.id === currentTrainingCard.id;
                        const showResultColors = showResult && isSelected;
                        
                        return (
                          <button
                            key={choice.id}
                            onClick={() => handleChoiceSelect(index)}
                            disabled={selectedChoice !== null}
                            style={{
                              backgroundColor: showResultColors
                                ? (isCorrect ? '#dcfce7' : '#fef2f2')
                                : (isSelected ? '#e0f2fe' : '#ffffff'),
                              border: showResultColors
                                ? (isCorrect ? '2px solid #059669' : '2px solid #dc2626')
                                : (isSelected ? '2px solid #3b82f6' : '2px solid #e5e7eb'),
                              borderRadius: '8px',
                              padding: '12px',
                              cursor: selectedChoice !== null ? 'default' : 'pointer',
                              fontSize: '16px',
                              lineHeight: '1.5',
                              textAlign: 'center',
                              fontFamily: 'serif',
                              height: '180px', // 固定高さ
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: showResultColors
                                ? (isCorrect ? '#059669' : '#dc2626')
                                : '#1f2937',
                              transition: 'all 0.2s ease',
                              opacity: selectedChoice !== null && !isSelected ? 0.5 : 1,
                              fontWeight: showResultColors ? '600' : '400'
                            }}
                          >
                            <div style={{
                              writingMode: 'vertical-rl',
                              textOrientation: 'upright',
                              height: '160px', // 固定高さで中心配置を安定化
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1.8',
                              width: '100%',
                              whiteSpace: 'pre-line' // 改行を有効にする
                            }}>
                              {choice.reading.shimoNoKu.replace(/\s+/g, '\n')}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* 結果表示 */}
                    {showResult && selectedChoice !== null && answerChoices[selectedChoice] && (
                      <div style={{
                        padding: '12px',
                        borderRadius: '6px',
                        backgroundColor: answerChoices[selectedChoice].id === currentTrainingCard.id ? '#dcfce7' : '#fef2f2',
                        border: answerChoices[selectedChoice].id === currentTrainingCard.id ? '1px solid #059669' : '1px solid #dc2626',
                        color: answerChoices[selectedChoice].id === currentTrainingCard.id ? '#059669' : '#dc2626',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {answerChoices[selectedChoice].id === currentTrainingCard.id ? '✓ 正解！' : '✗ 不正解'}
                        {answerChoices[selectedChoice].id !== currentTrainingCard.id && (
                          <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: '400' }}>
                            正解：{currentTrainingCard.reading.shimoNoKu}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 操作ボタン */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {showResult && (
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        padding: '8px 16px',
                        fontStyle: 'italic'
                      }}>
                        1秒後に次の問題に進みます...
                      </div>
                    )}
                    
                    <button
                      onClick={endTrainingSession}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        minWidth: '120px'
                      }}
                    >
                      セッション終了
                    </button>
                  </div>
                </div>
              )}
              
              {/* カードグリッド（トレーニングセッション中は非表示） */}
              {!activeTrainingSession && (
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
              )}
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