import { AuthProvider } from '../contexts/AuthContext'
import { DataManagerProvider } from '../contexts/DataManagerContext'
import './globals.css'

export const metadata = {
  title: '単語カードアプリ',
  description: 'Google認証対応の単語学習アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <DataManagerProvider>
            {children}
          </DataManagerProvider>
        </AuthProvider>
      </body>
    </html>
  )
}