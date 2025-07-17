import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';
import LoadingSpinner from './LoadingSpinner';

interface ConditionalAuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

/**
 * 条件付き認証ガード
 * requireAuth が true の場合のみ認証を要求
 */
const ConditionalAuthGuard: React.FC<ConditionalAuthGuardProps> = ({ 
  children, 
  requireAuth 
}) => {
  const { user, loading, isAuthEnabled } = useAuth();
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

  // 認証が無効化されている場合、または認証が不要な場合は常に children を表示
  if (!isAuthEnabled || !requireAuth) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <LoadingSpinner />
          <p style={{ marginTop: '16px', color: '#666' }}>認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '450px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              marginBottom: '8px',
              color: '#1F2937'
            }}>
              ログインが必要です
            </h2>
            <p style={{ 
              color: '#6B7280', 
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              この機能を使用するにはログインしてください
            </p>
          </div>
          
          <AuthForm
            mode={authMode}
            onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ConditionalAuthGuard;