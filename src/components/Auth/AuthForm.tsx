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
      'auth/too-many-requests':
        'ログイン試行回数が多すぎます。しばらく待ってから再試行してください',
      'auth/popup-closed-by-user': 'ログインがキャンセルされました',
      'auth/weak-password': 'パスワードは6文字以上で入力してください',
      'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
      認証機能が無効になっています: '認証機能が無効になっています',
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
              onChange={e => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'リセット中...' : 'パスワードリセット'}
          </button>

          <button type="button" onClick={() => setShowResetPassword(false)} className="link-button">
            ログインに戻る
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>{mode === 'signin' ? 'ログイン' : 'アカウント作成'}</h2>

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="form-group">
            <label htmlFor="fullName">氏名</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
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
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
            placeholder="パスワードを入力（6文字以上）"
            minLength={6}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading
            ? mode === 'signin'
              ? 'ログイン中...'
              : 'アカウント作成中...'
            : mode === 'signin'
              ? 'ログイン'
              : 'アカウント作成'}
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

          <button type="button" onClick={onToggleMode} className="link-button">
            {mode === 'signin'
              ? 'アカウントをお持ちでない方はこちら'
              : '既にアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
