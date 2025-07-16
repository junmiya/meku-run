'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// 認証有効/無効の制御
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true';

// 匿名ユーザーの定義
const ANONYMOUS_USER: User = {
  uid: 'anonymous',
  email: 'anonymous@example.com',
  displayName: 'Anonymous User',
  emailVerified: false,
  photoURL: null,
  phoneNumber: null,
  providerId: 'firebase',
  isAnonymous: true,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({}) as any,
  reload: async () => {},
  toJSON: () => ({}),
} as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - AUTH_ENABLED:', AUTH_ENABLED);
    console.log('AuthProvider - Environment:', process.env.NODE_ENV);

    if (!AUTH_ENABLED) {
      console.log('AuthProvider - Using anonymous user');
      setUser(ANONYMOUS_USER);
      setLoading(false);
      return;
    }

    // 認証有効の場合は Firebase Auth を使用
    const unsubscribe = onAuthStateChanged(auth, user => {
      console.log('AuthProvider - Auth state changed:', {
        uid: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
        isAnonymous: user?.isAnonymous,
      });
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    if (!AUTH_ENABLED) {
      throw new Error('認証機能が無効になっています');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    if (!AUTH_ENABLED) {
      throw new Error('認証機能が無効になっています');
    }

    try {
      console.log('AuthProvider - Signing in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthProvider - User signed in successfully:', {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    if (!AUTH_ENABLED) {
      throw new Error('認証機能が無効になっています');
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    if (!AUTH_ENABLED) {
      throw new Error('認証機能が無効になっています');
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!AUTH_ENABLED) {
      throw new Error('認証機能が無効になっています');
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoggedIn: user !== null && !user.isAnonymous,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthEnabled: AUTH_ENABLED,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
