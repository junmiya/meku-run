'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '../../../lib/supabase'
import LoadingSpinner from '../../../components/Auth/LoadingSpinner'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URLパラメータからcode を取得
        const code = searchParams.get('code')
        
        if (code) {
          // Authorization Code を使ってセッションを確立
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Auth exchange error:', error)
            router.push('/?error=auth_failed')
            return
          }

          if (data.session) {
            console.log('Authentication successful:', data.user?.email)
            // 認証成功時はホームページにリダイレクト
            router.push('/')
          } else {
            console.log('No session created')
            router.push('/?error=no_session')
          }
        } else {
          // codeパラメータがない場合、従来の方法でセッション確認
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth callback error:', error)
            router.push('/?error=session_error')
            return
          }

          if (data.session) {
            router.push('/')
          } else {
            router.push('/?error=no_code')
          }
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err)
        router.push('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase.auth])

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '50vh',
      padding: '20px'
    }}>
      <LoadingSpinner />
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        認証を完了しています...
      </p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '20px'
      }}>
        <LoadingSpinner />
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          読み込み中...
        </p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}