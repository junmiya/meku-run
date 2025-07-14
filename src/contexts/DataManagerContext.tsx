'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { DataManager } from '../managers/DataManager';
import { LocalStorageManager } from '../managers/LocalStorageManager';
import { FirebaseManager } from '../managers/FirebaseManager';

import { useAuth } from './AuthContext';

interface DataManagerContextType {
  dataManager: DataManager;
  isCloudMode: boolean;
  switchToCloud: () => Promise<void>;
  switchToLocal: () => void;
  migrateToCloud: () => Promise<boolean>;
}

const DataManagerContext = createContext<DataManagerContextType | undefined>(undefined);

interface DataManagerProviderProps {
  children: ReactNode;
}

export const DataManagerProvider: React.FC<DataManagerProviderProps> = ({ children }) => {
  const { user, loading, isAuthEnabled } = useAuth();
  const [dataManager, setDataManager] = useState<DataManager>(new LocalStorageManager());
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [firebaseManager] = useState(new FirebaseManager());

  useEffect(() => {
    if (!loading) {
      if (isAuthEnabled && user) {
        // 認証が有効でユーザーがログインしている場合、クラウドモードを使用
        firebaseManager.setUser(user);
        setDataManager(firebaseManager);
        setIsCloudMode(true);
      } else {
        // 認証が無効、または認証が有効でもユーザーがログインしていない場合、ローカルストレージを使用
        setDataManager(new LocalStorageManager());
        setIsCloudMode(false);
      }
    }
  }, [user, loading, isAuthEnabled, firebaseManager]);

  const switchToCloud = async (): Promise<void> => {
    if (!isAuthEnabled) {
      throw new Error('認証機能が無効になっているため、クラウドモードに切り替えできません');
    }

    if (!user) {
      throw new Error('クラウドモードに切り替えるにはログインが必要です');
    }

    firebaseManager.setUser(user);
    setDataManager(firebaseManager);
    setIsCloudMode(true);
  };

  const switchToLocal = (): void => {
    setDataManager(new LocalStorageManager());
    setIsCloudMode(false);
  };

  const migrateToCloud = async (): Promise<boolean> => {
    if (!isAuthEnabled) {
      console.error('認証機能が無効になっているため、クラウドに移行できません');
      return false;
    }

    if (!user) {
      console.error('クラウドに移行するにはログインが必要です');
      return false;
    }

    try {
      // ローカルストレージからデータを取得
      const localManager = new LocalStorageManager();
      const localCards = await localManager.getAllCards();

      if (localCards.length === 0) {
        return true; // 移行するデータがない
      }

      // クラウドに移行
      const result = await firebaseManager.migrateFromLocalStorage(localCards);

      if (result.success) {
        console.log(`${localCards.length} 件のカードをクラウドに移行しました`);
        return true;
      } else {
        console.error('移行に失敗しました:', result.errors);
        return false;
      }
    } catch (error) {
      console.error('移行中にエラーが発生しました:', error);
      return false;
    }
  };

  const value: DataManagerContextType = {
    dataManager,
    isCloudMode,
    switchToCloud,
    switchToLocal,
    migrateToCloud,
  };

  return <DataManagerContext.Provider value={value}>{children}</DataManagerContext.Provider>;
};

export const useDataManager = (): DataManagerContextType => {
  const context = useContext(DataManagerContext);
  if (context === undefined) {
    throw new Error('useDataManager must be used within a DataManagerProvider');
  }
  return context;
};
