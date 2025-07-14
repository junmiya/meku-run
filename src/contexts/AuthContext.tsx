'use client'

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
  updateProfile
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
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
} as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
    console.log('AUTH_ENABLED:', AUTH_ENABLED);
    console.log('Environment:', process.env.NEXT_PUBLIC_AUTH_ENABLED);
    
    if (!AUTH_ENABLED) {
      // 認証無効の場合は匿名ユーザーを設定
      setUser(ANONYMOUS_USER);
      setLoading(false);
      return;
    }

    // 認証有効の場合は Firebase Auth を使用
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Firebase Auth State Changed:', user);
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
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
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
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    isAuthEnabled: AUTH_ENABLED,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};