'use client';

import React, { useState, useEffect } from 'react';
import { SettingsProvider } from '../contexts/SettingsContext';

/**
 * クライアントサイドプロバイダーのラッパー
 * 静的エクスポート対応のため認証を動的ロード
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [AuthProvider, setAuthProvider] = useState<React.ComponentType<{ children: React.ReactNode }> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // クライアントサイドでのみ認証プロバイダーをロード
    if (typeof window !== 'undefined') {
      import('../contexts/AuthContext').then((module) => {
        setAuthProvider(() => module.AuthProvider);
      });
    }
  }, []);

  if (!mounted) {
    // サーバーサイド/静的エクスポート時はローディング状態を表示
    return (
      <SettingsProvider>
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
            }} />
            <p style={{ color: '#6b7280' }}>百人一首データを読み込み中...</p>
          </div>
        </div>
      </SettingsProvider>
    );
  }

  // クライアントサイドで認証プロバイダーがロードされた場合
  if (AuthProvider) {
    return (
      <AuthProvider>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </AuthProvider>
    );
  }

  // 認証プロバイダーがロードされていない場合は認証なしで実行
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}