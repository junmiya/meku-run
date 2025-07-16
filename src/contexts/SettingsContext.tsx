'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HyakuninIsshuSettings } from '../types/WordCard';

interface SettingsContextType {
  settings: HyakuninIsshuSettings;
  updateSetting: <K extends keyof HyakuninIsshuSettings>(
    key: K,
    value: HyakuninIsshuSettings[K]
  ) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const defaultSettings: HyakuninIsshuSettings = {
  cardsPerPage: 10,
  showFurigana: false,
  showMeaning: false,
  shuffleMode: false,
  displayMode: 'normal',
  deviceType: 'auto',
  practiceMode: 'normal',
  kimarijiSettings: {
    showKimariji: false,
    highlightKimariji: true,
    kimarijiLength: 'all',
    displayMode: 'full',
  },
  competitionSettings: {
    timeLimit: 300, // 5分
    memorizationTime: 60, // 1分
    judgeMode: 'normal',
    enableSound: false,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'hyakunin-isshu-settings';

/**
 * 設定管理Context Provider
 * アプリケーション全体の設定を管理し、ローカルストレージに永続化
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HyakuninIsshuSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化時にローカルストレージから設定を読み込み
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as HyakuninIsshuSettings;
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.warn('設定の読み込みに失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 設定変更時にローカルストレージに保存
  const saveSettings = useCallback((newSettings: HyakuninIsshuSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('設定の保存に失敗しました:', error);
    }
  }, []);

  // 個別設定の更新
  const updateSetting = useCallback(<K extends keyof HyakuninIsshuSettings>(
    key: K,
    value: HyakuninIsshuSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      saveSettings(newSettings);
      return newSettings;
    });
  }, [saveSettings]);

  // 設定のリセット
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, [saveSettings]);

  const value: SettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * 設定Context用フック
 */
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};