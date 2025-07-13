import React, { useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';

import './UserProfile.css';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      setIsSigningOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile-overlay">
      <div className="user-profile">
        <div className="profile-header">
          <h3>プロフィール</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="avatar">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" />
              ) : (
                <div className="avatar-placeholder">
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                </div>
              )}
            </div>

            <div className="user-details">
              <p className="user-name">
                {user.user_metadata?.full_name || 'ユーザー'}
              </p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-label">アカウント作成日</span>
              <span className="stat-value">
                {new Date(user.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">最終ログイン</span>
              <span className="stat-value">
                {user.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString('ja-JP')
                  : '不明'
                }
              </span>
            </div>
          </div>

          <div className="profile-actions">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="signout-button"
            >
              {isSigningOut ? 'ログアウト中...' : 'ログアウト'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;