'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { HyakuninIsshuSettings } from '../types/WordCard';

// 最小限の設定Context（Firebase依存なし）
interface MinimalSettingsContextType {
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
    timeLimit: 300,
    memorizationTime: 60,
    judgeMode: 'normal',
    enableSound: false,
  },
};

const MinimalSettingsContext = createContext<MinimalSettingsContextType | undefined>(undefined);

// 最小限の認証Context（常に匿名ユーザー）
interface MinimalAuthContextType {
  isLoggedIn: boolean;
  user: null;
  loading: boolean;
}

const MinimalAuthContext = createContext<MinimalAuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: false,
});

/**
 * Firebase依存を排除した最小限のContext Provider
 * クライアントサイドハイドレーション問題の緊急回避策
 */
export const MinimalClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<HyakuninIsshuSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = useCallback(<K extends keyof HyakuninIsshuSettings>(
    key: K,
    value: HyakuninIsshuSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const settingsValue = {
    settings,
    updateSetting,
    resetSettings,
    isLoading,
  };

  const authValue = {
    isLoggedIn: false,
    user: null,
    loading: false,
  };

  return (
    <MinimalSettingsContext.Provider value={settingsValue}>
      <MinimalAuthContext.Provider value={authValue}>
        {children}
      </MinimalAuthContext.Provider>
    </MinimalSettingsContext.Provider>
  );
};

// カスタムフック
export const useSettings = () => {
  const context = useContext(MinimalSettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a MinimalSettingsProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(MinimalAuthContext);
  return context;
};