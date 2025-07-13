'use client'

import { AuthResponse, Session, User, AuthError } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { createClient } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<{ data: { url: string }; error: null } | { data: { url: null }; error: AuthError }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: {}; error: null } | { data: null; error: AuthError }>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // セッションを取得
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
    };

    getSession();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // ユーザープロファイルの作成/更新（必要に応じて）
        if (event === 'SIGNED_IN' && session?.user) {
          await createOrUpdateProfile(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ユーザープロファイルの作成/更新
  const createOrUpdateProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Error updating profile:', error);
      }
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    options?: { data?: { full_name?: string } }
  ): Promise<AuthResponse> => {
    setLoading(true);
    
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        ...(options && { options }),
      });
      
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const signInWithGoogle = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};