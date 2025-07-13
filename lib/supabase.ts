import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// 環境変数の型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

// クライアントサイド用
export const createClient = () => createClientComponentClient()

// 開発環境用のデフォルト値（本番では実際の値を使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClientComponentClient()

// Supabase の型定義
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      word_cards: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          meaning: string;
          tags: string[] | null;
          isStarred: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word: string;
          meaning: string;
          tags?: string[] | null;
          isStarred?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word?: string;
          meaning?: string;
          tags?: string[] | null;
          isStarred?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type SupabaseClient = ReturnType<typeof createClient>;