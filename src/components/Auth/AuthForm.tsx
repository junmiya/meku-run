import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

import './AuthForm.css';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('氏名を入力してください');
      return;
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        setSuccess('アカウントが作成されました');
      }
    } catch (err: any) {
      console.error('Full auth error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      setError(getErrorMessage(err.code || err.message));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    try {
      await resetPassword(email);
      setSuccess('パスワードリセットメールを送信しました');
      setShowResetPassword(false);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(getErrorMessage(err.code || err.message));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(getErrorMessage(err.code || err.message));
    }
  };

  const getErrorMessage = (message: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'メールアドレスの形式が正しくありません',
      'auth/user-disabled': 'このアカウントは無効化されています',
      'auth/user-not-found': 'このメールアドレスのアカウントが見つかりません',
      'auth/wrong-password': 'パスワードが間違っています',
      'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
      'auth/too-many-requests': 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください',
      'auth/popup-closed-by-user': 'ログインがキャンセルされました',
      'auth/weak-password': 'パスワードは6文字以上で入力してください',
      'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
      '認証機能が無効になっています': '認証機能が無効になっています',
    };
    
    return errorMessages[message] || `エラー: ${message}`;
  };

  if (showResetPassword) {
    return (
      <div className="auth-form">
        <h2>パスワードリセット</h2>
        
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="reset-email">メールアドレス</label>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'リセット中...' : 'パスワードリセット'}
          </button>

          <button
            type="button"
            onClick={() => setShowResetPassword(false)}
            className="link-button"
          >
            ログインに戻る
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>{mode === 'signin' ? 'ログイン' : 'アカウント作成'}</h2>
      
      {/* Google Sign-in Button */}
      <div className="google-auth-section">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-signin-button"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Googleで{mode === 'signin' ? 'ログイン' : '登録'}
        </button>
      </div>

      <div className="divider">
        <span>または</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="fullName">氏名</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="氏名を入力"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力（6文字以上）"
            minLength={6}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading 
            ? (mode === 'signin' ? 'ログイン中...' : 'アカウント作成中...')
            : (mode === 'signin' ? 'ログイン' : 'アカウント作成')
          }
        </button>

        <div className="auth-links">
          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="link-button"
            >
              パスワードを忘れた方
            </button>
          )}
          
          <button
            type="button"
            onClick={onToggleMode}
            className="link-button"
          >
            {mode === 'signin' 
              ? 'アカウントをお持ちでない方はこちら' 
              : '既にアカウントをお持ちの方はこちら'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;