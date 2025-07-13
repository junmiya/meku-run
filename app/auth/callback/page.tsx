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
        console.log('Auth callback page loaded')
        console.log('Current URL:', window.location.href)
        
        // URLフラグメント（#）のトークンを処理
        const hash = window.location.hash
        console.log('URL hash:', hash)
        
        if (hash && hash.includes('access_token')) {
          console.log('Found access token in URL hash')
          
          // Supabaseがフラグメントからセッションを自動設定
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Session error after OAuth:', error)
            router.push('/?error=session_failed')
            return
          }

          if (data.session) {
            console.log('Session created successfully:', data.session.user?.email)
            // URLを清掃してからリダイレクト
            window.history.replaceState({}, document.title, '/auth/callback')
            router.push('/')
          } else {
            console.log('No session found, checking for manual token parsing')
            // 手動でトークンを処理
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: new URLSearchParams(hash.substring(1)).get('access_token') || '',
              refresh_token: new URLSearchParams(hash.substring(1)).get('refresh_token') || ''
            })
            
            if (sessionError) {
              console.error('Manual session error:', sessionError)
              router.push('/?error=manual_session_failed')
            } else if (sessionData.session) {
              console.log('Manual session created:', sessionData.session?.user?.email)
              window.history.replaceState({}, document.title, '/auth/callback')
              router.push('/')
            } else {
              router.push('/?error=no_manual_session')
            }
          }
        } else {
          // codeパラメータを確認（OAuth code flow）
          const code = searchParams.get('code')
          console.log('OAuth code:', code)
          
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)
            
            if (error) {
              console.error('Code exchange error:', error)
              router.push('/?error=code_exchange_failed')
              return
            }

            if (data.session) {
              console.log('Code exchange successful:', data.session?.user?.email)
              router.push('/')
            } else {
              router.push('/?error=no_session_from_code')
            }
          } else {
            console.log('No tokens found, checking existing session')
            const { data, error } = await supabase.auth.getSession()
            
            if (error) {
              console.error('Session check error:', error)
              router.push('/?error=session_check_failed')
              return
            }

            if (data.session) {
              console.log('Existing session found:', data.session?.user?.email)
              router.push('/')
            } else {
              console.log('No session found, redirecting to home')
              router.push('/?message=no_session')
            }
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        router.push('/?error=unexpected')
      }
    }

    // 少し遅延してからコールバック処理を実行
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
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