import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../Auth/AuthForm';

/**
 * ユーザーログインボタン（右上表示用）
 */
const UserLoginButton: React.FC = () => {
  const { user, isLoggedIn, signOut, isAuthEnabled } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // 認証が無効な場合は何も表示しない
  if (!isAuthEnabled) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (isLoggedIn && user) {
    return (
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* ユーザー情報 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        }}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="プロフィール"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}>
            {user.displayName || user.email}
          </span>
        </div>

        {/* ログアウトボタン */}
        <button
          onClick={handleSignOut}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ログインボタン */}
      <button
        onClick={() => setShowAuthModal(true)}
        style={{
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
      >
        ログイン
      </button>

      {/* 認証モーダル */}
      {showAuthModal && (
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
            borderRadius: '12px',
            maxWidth: '450px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            {/* 閉じるボタン */}
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>

            <div style={{ padding: '24px' }}>
              <AuthForm
                mode={authMode}
                onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLoginButton;