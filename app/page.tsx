'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthForm from '../components/Auth/AuthForm'
import UserProfile from '../components/Auth/UserProfile'
import LoadingSpinner from '../components/Auth/LoadingSpinner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>単語カードアプリ</h1>
        <p>ログインして単語カードの学習を始めましょう</p>
        <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>単語カードアプリ</h1>
      <UserProfile onClose={() => {}} />
      <div style={{ marginTop: '20px' }}>
        <h2>単語カード機能</h2>
        <p>認証が完了しました。単語カード機能を実装します。</p>
      </div>
    </div>
  )
}