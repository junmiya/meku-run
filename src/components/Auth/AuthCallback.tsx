import React, { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

import LoadingSpinner from './LoadingSpinner';

interface AuthCallbackProps {
  onComplete: () => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          // Clear the URL hash and redirect after a delay
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
            onComplete();
          }, 2000);
          return;
        }

        if (data.session) {
          setStatus('success');
          // Clear the URL hash and redirect after a short delay
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
            onComplete();
          }, 1500);
        } else {
          setStatus('error');
          setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
            onComplete();
          }, 2000);
        }
      } catch (err) {
        console.error('Unexpected auth callback error:', err);
        setStatus('error');
        setTimeout(() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          onComplete();
        }, 2000);
      }
    };

    // Only handle callback if there's a hash in the URL (typical for OAuth)
    if (window.location.hash) {
      handleAuthCallback();
    } else {
      onComplete();
    }
  }, [onComplete]);

  if (status === 'loading') {
    return (
      <div className="auth-loading">
        <LoadingSpinner />
        <p>認証を完了しています...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="auth-loading">
        <LoadingSpinner />
        <p>ログインに成功しました！</p>
      </div>
    );
  }

  return (
    <div className="auth-loading">
      <p>認証でエラーが発生しました。再度お試しください。</p>
    </div>
  );
};

export default AuthCallback;