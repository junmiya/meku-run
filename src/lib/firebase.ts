import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase 設定
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'demo-app-id',
};

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig);

// Firebase サービスを初期化
export const auth = getAuth(app);
export const db = getFirestore(app);

// エミュレーター接続設定（開発環境でのみ）
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // エミュレーター接続の重複防止
  if (!(db as any)._delegate._databaseId.projectId.includes('demo-project')) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Firestore emulator already connected');
    }
  }
}

export default app;
