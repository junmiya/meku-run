'use client';

import { AuthProvider } from '../contexts/AuthContext';
import { SettingsProvider } from '../contexts/SettingsContext';

/**
 * クライアントサイドプロバイダーのラッパー
 * サーバーコンポーネントとクライアントコンポーネントを分離
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </AuthProvider>
  );
}