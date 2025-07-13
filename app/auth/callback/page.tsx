'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase'
import LoadingSpinner from '../../../components/Auth/LoadingSpinner'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase認証のコールバック処理
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          // エラーの場合もホームにリダイレクト
          router.push('/')
          return
        }

        if (data.session) {
          // 認証成功時はホームページにリダイレクト
          router.push('/')
        } else {
          // セッションがない場合もホームにリダイレクト
          router.push('/')
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err)
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  return (
    <div className="auth-loading">
      <LoadingSpinner />
      <p>認証を完了しています...</p>
    </div>
  )
}