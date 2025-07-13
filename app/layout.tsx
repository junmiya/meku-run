import { AuthProvider } from '../contexts/AuthContext'
import '../components/Auth/AuthForm.css'
import '../components/Auth/UserProfile.css'
import '../components/Auth/LoadingSpinner.css'

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
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}