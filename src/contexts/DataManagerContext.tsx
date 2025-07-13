import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { DataManager } from '../managers/DataManager';
import { LocalStorageManager } from '../managers/LocalStorageManager';
import { SupabaseManager } from '../managers/SupabaseManager';

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
  const { user, loading } = useAuth();
  const [dataManager, setDataManager] = useState<DataManager>(new LocalStorageManager());
  const [isCloudMode, setIsCloudMode] = useState(false);
  const [supabaseManager] = useState(new SupabaseManager());

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, set up cloud mode
        supabaseManager.setUser(user);
        setDataManager(supabaseManager);
        setIsCloudMode(true);
      } else {
        // User is not authenticated, use local storage
        setDataManager(new LocalStorageManager());
        setIsCloudMode(false);
      }
    }
  }, [user, loading, supabaseManager]);

  const switchToCloud = async (): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to switch to cloud mode');
    }
    
    supabaseManager.setUser(user);
    setDataManager(supabaseManager);
    setIsCloudMode(true);
  };

  const switchToLocal = (): void => {
    setDataManager(new LocalStorageManager());
    setIsCloudMode(false);
  };

  const migrateToCloud = async (): Promise<boolean> => {
    if (!user) {
      console.error('Cannot migrate to cloud: user not authenticated');
      return false;
    }

    try {
      // Get local storage data
      const localManager = new LocalStorageManager();
      const localCards = await localManager.getAllCards();
      
      if (localCards.length === 0) {
        return true; // Nothing to migrate
      }

      // Migrate to cloud
      const result = await supabaseManager.migrateFromLocalStorage(localCards);
      
      if (result.success) {
        console.log(`Successfully migrated ${localCards.length} cards to cloud`);
        return true;
      } else {
        console.error('Migration failed:', result.errors);
        return false;
      }
    } catch (error) {
      console.error('Error during migration:', error);
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

  return (
    <DataManagerContext.Provider value={value}>
      {children}
    </DataManagerContext.Provider>
  );
};

export const useDataManager = (): DataManagerContextType => {
  const context = useContext(DataManagerContext);
  if (context === undefined) {
    throw new Error('useDataManager must be used within a DataManagerProvider');
  }
  return context;
};