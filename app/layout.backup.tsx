import { AuthProvider } from '../src/contexts/AuthContext';
import { DataManagerProvider } from '../src/contexts/DataManagerContext';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import './globals.css';
import '../src/styles/design-tokens.css';
import '../src/styles/vertical-text.css';
import '../src/styles/card-styles.css';
import '../src/styles/settings.css';
import '../src/styles/hyakunin-app.css';

export const metadata = {
  title: '百人一首トレーニング',
  description: '縦書き表示対応の百人一首学習アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <DataManagerProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </DataManagerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}