import React from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  phase: 'setup' | 'memorization' | 'waiting' | 'active' | 'finished';
  onTimeUp?: () => void;
}

/**
 * 競技トレーニング用タイマーコンポーネント
 */
export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalTime,
  phase,
  onTimeUp
}) => {
  // 時間を分:秒形式に変換
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 進捗率を計算
  const progressPercentage = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;
  
  // フェーズに応じた色とメッセージ
  const getPhaseInfo = () => {
    switch (phase) {
      case 'setup':
        return {
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          message: '準備中',
          showProgress: false
        };
      case 'memorization':
        return {
          color: '#3B82F6',
          backgroundColor: '#DBEAFE',
          message: '暗記時間',
          showProgress: true
        };
      case 'waiting':
        return {
          color: '#F59E0B',
          backgroundColor: '#FEF3C7',
          message: '一時停止中',
          showProgress: false
        };
      case 'active':
        return {
          color: timeRemaining <= 10 ? '#EF4444' : '#10B981',
          backgroundColor: timeRemaining <= 10 ? '#FEE2E2' : '#D1FAE5',
          message: '回答時間',
          showProgress: true
        };
      case 'finished':
        return {
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          message: '終了',
          showProgress: false
        };
      default:
        return {
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          message: '',
          showProgress: false
        };
    }
  };
  
  const phaseInfo = getPhaseInfo();
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: phaseInfo.backgroundColor,
      borderRadius: '12px',
      border: `2px solid ${phaseInfo.color}`,
      minWidth: '200px',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* フェーズ表示 */}
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: phaseInfo.color,
        textAlign: 'center'
      }}>
        {phaseInfo.message}
      </div>
      
      {/* 時間表示 */}
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: phaseInfo.color,
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        {formatTime(timeRemaining)}
      </div>
      
      {/* 進捗バー */}
      {phaseInfo.showProgress && totalTime > 0 && (
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#E5E7EB',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: phaseInfo.color,
              borderRadius: '4px',
              transition: 'width 0.3s ease-in-out',
              width: `${progressPercentage}%`
            }}
          />
        </div>
      )}
      
      {/* 残り時間が少ない場合の警告 */}
      {phase === 'active' && timeRemaining <= 10 && timeRemaining > 0 && (
        <div style={{
          fontSize: '12px',
          color: '#EF4444',
          fontWeight: '600',
          textAlign: 'center',
          animation: 'blink 1s infinite'
        }}>
          急いで！
        </div>
      )}
      
      {/* 時間切れの場合 */}
      {timeRemaining <= 0 && phase !== 'finished' && (
        <div style={{
          fontSize: '14px',
          color: '#EF4444',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          時間切れ
        </div>
      )}
      
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * 競技モード選択用のコンポーネント
 */
interface CompetitionModeSelectProps {
  onModeSelect: (mode: 'memorization' | 'reaction' | 'competition') => void;
  onKimarijiLevelSelect: (level: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed') => void;
  onSettingsChange: (settings: {
    timeLimit: number;
    memorizationTime: number;
    judgeMode: 'strict' | 'normal' | 'lenient';
  }) => void;
}

export const CompetitionModeSelect: React.FC<CompetitionModeSelectProps> = ({
  onModeSelect,
  onKimarijiLevelSelect,
  onSettingsChange
}) => {
  const [selectedMode, setSelectedMode] = React.useState<'memorization' | 'reaction' | 'competition'>('memorization');
  const [selectedLevel, setSelectedLevel] = React.useState<1 | 2 | 3 | 4 | 5 | 6 | 'mixed'>('mixed');
  const [settings, setSettings] = React.useState({
    timeLimit: 60,
    memorizationTime: 15,
    judgeMode: 'normal' as 'strict' | 'normal' | 'lenient'
  });
  
  const handleModeChange = (mode: 'memorization' | 'reaction' | 'competition') => {
    setSelectedMode(mode);
    onModeSelect(mode);
  };
  
  const handleLevelChange = (level: 1 | 2 | 3 | 4 | 5 | 6 | 'mixed') => {
    setSelectedLevel(level);
    onKimarijiLevelSelect(level);
  };
  
  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '16px',
        color: '#1F2937'
      }}>
        競技モード選択
      </h3>
      
      {/* モード選択 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#374151'
        }}>
          練習モード
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px'
        }}>
          {[
            { value: 'memorization', label: '暗記練習' },
            { value: 'reaction', label: '反応練習' },
            { value: 'competition', label: '本格競技' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleModeChange(mode.value as any)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${selectedMode === mode.value ? '#3B82F6' : '#D1D5DB'}`,
                borderRadius: '8px',
                backgroundColor: selectedMode === mode.value ? '#EFF6FF' : 'white',
                color: selectedMode === mode.value ? '#3B82F6' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 決まり字レベル選択 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#374151'
        }}>
          決まり字レベル
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {[1, 2, 3, 4, 5, 6, 'mixed'].map((level) => (
            <button
              key={level}
              onClick={() => handleLevelChange(level as any)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${selectedLevel === level ? '#10B981' : '#D1D5DB'}`,
                borderRadius: '8px',
                backgroundColor: selectedLevel === level ? '#ECFDF5' : 'white',
                color: selectedLevel === level ? '#10B981' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {level === 'mixed' ? '混合' : `${level}字`}
            </button>
          ))}
        </div>
      </div>
      
      {/* 設定 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#374151'
        }}>
          時間設定
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              暗記時間（秒）
            </label>
            <input
              type="number"
              value={settings.memorizationTime}
              onChange={(e) => handleSettingsChange({
                ...settings,
                memorizationTime: parseInt(e.target.value) || 15
              })}
              min="5"
              max="60"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              制限時間（秒）
            </label>
            <input
              type="number"
              value={settings.timeLimit}
              onChange={(e) => handleSettingsChange({
                ...settings,
                timeLimit: parseInt(e.target.value) || 60
              })}
              min="30"
              max="300"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* 判定モード */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '8px',
          color: '#374151'
        }}>
          判定モード
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px'
        }}>
          {[
            { value: 'strict', label: '厳格' },
            { value: 'normal', label: '通常' },
            { value: 'lenient', label: '寛容' }
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleSettingsChange({
                ...settings,
                judgeMode: mode.value as any
              })}
              style={{
                padding: '8px 12px',
                border: `2px solid ${settings.judgeMode === mode.value ? '#F59E0B' : '#D1D5DB'}`,
                borderRadius: '8px',
                backgroundColor: settings.judgeMode === mode.value ? '#FFFBEB' : 'white',
                color: settings.judgeMode === mode.value ? '#F59E0B' : '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};