'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDataManager } from '../../contexts/DataManagerContext';
import { LocalStorageManager } from '../../managers/LocalStorageManager';
import { FirebaseManager } from '../../managers/FirebaseManager';
import { WordCard } from '../../types/WordCard';

interface MigrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MigrationDialog: React.FC<MigrationDialogProps> = ({ isOpen, onClose }) => {
  const { user, isAuthEnabled } = useAuth();
  const { dataManager } = useDataManager();
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);
  const [localCardsCount, setLocalCardsCount] = useState<number>(0);
  const [cloudCardsCount, setCloudCardsCount] = useState<number>(0);

  // コンポーネントマウント時にデータ数を取得
  React.useEffect(() => {
    if (isOpen && isAuthEnabled && user) {
      checkDataCounts();
    }
  }, [isOpen, isAuthEnabled, user]);

  const checkDataCounts = async () => {
    try {
      // LocalStorageのデータ数を取得
      const localManager = new LocalStorageManager();
      const localCards = await localManager.getAllCards();
      setLocalCardsCount(localCards.length);

      // Firestoreのデータ数を取得
      if (user) {
        const firebaseManager = new FirebaseManager(user);
        const cloudCards = await firebaseManager.getAllCards();
        setCloudCardsCount(cloudCards.length);
      }
    } catch (error) {
      console.error('Error checking data counts:', error);
    }
  };

  const handleMigration = async () => {
    if (!user || !isAuthEnabled) {
      setMigrationResult('認証が必要です');
      return;
    }

    setIsLoading(true);
    setMigrationResult(null);

    try {
      // LocalStorageからデータを取得
      const localManager = new LocalStorageManager();
      const localCards = await localManager.getAllCards();

      if (localCards.length === 0) {
        setMigrationResult('LocalStorageにデータがありません');
        setIsLoading(false);
        return;
      }

      // Firebaseマネージャーでデータ移行
      const firebaseManager = new FirebaseManager(user);
      const migrationResult = await firebaseManager.migrateFromLocalStorage(localCards);

      if (migrationResult.success) {
        setMigrationResult(`移行完了: ${localCards.length}件のデータを処理しました`);

        // データ数を再確認
        await checkDataCounts();
      } else {
        setMigrationResult(`移行エラー: ${migrationResult.errors?.map(e => e.message).join(', ')}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      setMigrationResult(`移行エラー: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearLocalStorage = async () => {
    if (window.confirm('LocalStorageのデータを削除しますか？この操作は取り消せません。')) {
      try {
        const localManager = new LocalStorageManager();
        await localManager.deleteAllCards();
        setLocalCardsCount(0);
        setMigrationResult('LocalStorageのデータを削除しました');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        setMigrationResult(`削除エラー: ${error}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">データ移行</h2>

        {!isAuthEnabled ? (
          <div className="text-center">
            <p className="mb-4">認証機能が無効のため、データ移行は利用できません。</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              閉じる
            </button>
          </div>
        ) : !user ? (
          <div className="text-center">
            <p className="mb-4">データ移行にはログインが必要です。</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              閉じる
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">現在のデータ状況</h3>
              <div className="bg-gray-100 p-3 rounded">
                <p>LocalStorage: {localCardsCount}件</p>
                <p>Firestore: {cloudCardsCount}件</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">移行について</h3>
              <p className="text-sm text-gray-600">
                LocalStorageからFirestoreにデータを移行します。
                <br />
                重複したデータは作成されません。
              </p>
            </div>

            {migrationResult && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
                <p className="text-sm">{migrationResult}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={handleMigration}
                disabled={isLoading || localCardsCount === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? '移行中...' : 'データを移行する'}
              </button>

              <button
                onClick={handleClearLocalStorage}
                disabled={isLoading || localCardsCount === 0}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                LocalStorageを削除
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
