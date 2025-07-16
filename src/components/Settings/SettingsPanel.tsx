import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { memorizationManager } from '../../managers/MemorizationManager';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  totalCards: number;
  memorizedCount: number;
  onMemorizationClear?: () => void;
}

/**
 * アプリケーション設定パネル
 * 表示設定、学習設定、覚えたカード管理を行う
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  totalCards,
  memorizedCount,
  onMemorizationClear,
}) => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { isLoggedIn } = useAuth();

  if (!isOpen) return null;

  const handleCardsPerPageChange = (value: string) => {
    const numValue = parseInt(value) as 5 | 10 | 20 | 50;
    updateSetting('cardsPerPage', numValue);
  };

  const handleShuffleModeToggle = () => {
    updateSetting('shuffleMode', !settings.shuffleMode);
  };

  const handleDisplayModeChange = (mode: 'normal' | 'recovery') => {
    updateSetting('displayMode', mode);
  };

  const handleFuriganaToggle = () => {
    if (isLoggedIn) {
      updateSetting('showFurigana', !settings.showFurigana);
    }
  };

  const handleMeaningToggle = () => {
    updateSetting('showMeaning', !settings.showMeaning);
  };

  const handleClearMemorized = () => {
    if (window.confirm('覚えたカードをすべてクリアしますか？この操作は取り消せません。')) {
      memorizationManager.clearAllMemorized();
      onMemorizationClear?.();
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('すべての設定をリセットしますか？')) {
      resetSettings();
    }
  };

  const completionRate = totalCards > 0 ? (memorizedCount / totalCards) * 100 : 0;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h2>⚙️ 設定</h2>
          <button className="close-button" onClick={onClose} aria-label="設定を閉じる">
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* 表示設定 */}
          <section className="settings-section">
            <h3>📱 表示設定</h3>
            
            <div className="setting-item">
              <label htmlFor="cards-per-page">1ページあたりの表示カード数:</label>
              <select
                id="cards-per-page"
                value={settings.cardsPerPage}
                onChange={(e) => handleCardsPerPageChange(e.target.value)}
                className="setting-select"
              >
                <option value="5">5枚</option>
                <option value="10">10枚</option>
                <option value="20">20枚</option>
                <option value="50">50枚</option>
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.showMeaning}
                  onChange={handleMeaningToggle}
                />
                <span>現代語訳を表示</span>
              </label>
            </div>
          </section>

          {/* 学習設定 */}
          <section className="settings-section">
            <h3>📚 学習設定</h3>
            
            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.shuffleMode}
                  onChange={handleShuffleModeToggle}
                />
                <span>シャッフルモード</span>
              </label>
              <small>カードをランダムな順序で表示します</small>
            </div>

            <div className="setting-item">
              <label>表示モード:</label>
              <div className="radio-group">
                <label className="setting-radio">
                  <input
                    type="radio"
                    name="displayMode"
                    value="normal"
                    checked={settings.displayMode === 'normal'}
                    onChange={() => handleDisplayModeChange('normal')}
                  />
                  <span>通常モード</span>
                </label>
                <label className="setting-radio">
                  <input
                    type="radio"
                    name="displayMode"
                    value="recovery"
                    checked={settings.displayMode === 'recovery'}
                    onChange={() => handleDisplayModeChange('recovery')}
                  />
                  <span>復習モード（覚えたカードのみ）</span>
                </label>
              </div>
            </div>
          </section>

          {/* ログイン限定機能 */}
          <section className="settings-section">
            <h3>🔐 ログイン限定機能</h3>
            
            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.showFurigana}
                  onChange={handleFuriganaToggle}
                  disabled={!isLoggedIn}
                />
                <span>ふりがなモード（決まり字ハイライト付き）</span>
              </label>
              {!isLoggedIn && (
                <small className="login-required">※ ログインが必要です</small>
              )}
            </div>
          </section>

          {/* 学習進捗 */}
          <section className="settings-section">
            <h3>📊 学習進捗</h3>
            
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">覚えたカード:</span>
                <span className="stat-value">{memorizedCount} / {totalCards}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">完了率:</span>
                <span className="stat-value">{completionRate.toFixed(1)}%</span>
              </div>
            </div>

            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <button 
              className="danger-button"
              onClick={handleClearMemorized}
              disabled={memorizedCount === 0}
            >
              覚えたカードをすべてクリア
            </button>
          </section>

          {/* リセット */}
          <section className="settings-section">
            <h3>🔄 リセット</h3>
            <button className="danger-button" onClick={handleResetSettings}>
              すべての設定をリセット
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};