import React, { useState, useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';

import AuthForm from './AuthForm';
import LoadingSpinner from './LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAuthEnabled } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // 認証が無効化されている場合は、常に children を表示
  if (!isAuthEnabled) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="auth-loading">
        <LoadingSpinner />
        <p>認証状態を確認中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-page">
        <header className="auth-header">
          <h1>単語カードアプリ</h1>
          <p>アカウントにログインして、クラウド同期をご利用ください</p>
        </header>
        
        <AuthForm 
          mode={authMode} 
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} 
        />
        
        <div className="auth-footer">
          <p>
            <strong>ローカルでのご利用も可能です</strong><br />
            ログインしなくても、ブラウザ内でデータを保存して利用できます。
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;