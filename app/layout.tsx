import './globals.css';
import { ClientProviders } from '../src/components/ClientProviders';

export const metadata = {
  title: '百人一首トレーニング',
  description: '縦書き表示対応の百人一首学習アプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div id="root">
          <ClientProviders>
            {children}
          </ClientProviders>
        </div>
      </body>
    </html>
  );
}