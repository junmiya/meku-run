'use client';

import React from 'react';

// 緊急テストページ - 最小限のコンポーネント
export default function EmergencyTestPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2c3e50', fontSize: '2rem' }}>
        🚨 緊急テストページ
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px 0',
        border: '2px solid #27ae60'
      }}>
        <h2 style={{ color: '#27ae60' }}>✅ 基本表示確認</h2>
        <ul style={{ fontSize: '14px' }}>
          <li>React コンポーネント: 正常動作</li>
          <li>CSS スタイル: 適用済み</li>
          <li>JavaScript: 実行中</li>
          <li>現在時刻: [クライアントサイドで表示]</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #ffa000'
      }}>
        <h3>📍 アクセス情報</h3>
        <p>正しいURL: <strong>http://localhost:3000/test-emergency</strong></p>
        <p>メインページ: <a href="/" style={{ color: '#007bff' }}>http://localhost:3000/</a></p>
      </div>

      <button 
        onClick={() => {
          alert('JavaScript動作確認: 正常');
          console.log('Emergency test: JavaScript working');
        }}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        🔧 JavaScript動作テスト
      </button>
    </div>
  );
}