'use client';

import { SettingsProvider } from '../../src/contexts/SettingsContext';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { HyakuninIsshuApp } from '../../src/components/HyakuninIsshuApp';

/**
 * 百人一首トレーニングアプリ専用ページ
 */
export default function HyakuninTestPage() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <HyakuninIsshuApp />
      </SettingsProvider>
    </AuthProvider>
  );
}