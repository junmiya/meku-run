'use client';

import React from 'react';

// 非常にシンプルなレイアウトテスト
export default function SimpleLayoutPage() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        📋 シンプルレイアウトテスト
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '10px' }}>基本スタイル確認</h2>
        <p>このページが正常に表示されれば、基本的なHTMLとCSSは動作しています。</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '20px',
        maxWidth: '800px'
      }}>
        <div style={{ 
          backgroundColor: '#e8f4f8', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #3498db'
        }}>
          <h3 style={{ color: '#3498db', margin: '0 0 10px 0' }}>カード1</h3>
          <p style={{ margin: 0 }}>基本的なカードレイアウト</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #27ae60'
        }}>
          <h3 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>カード2</h3>
          <p style={{ margin: 0 }}>グリッドレイアウト</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #ffa000'
        }}>
          <h3 style={{ color: '#ffa000', margin: '0 0 10px 0' }}>カード3</h3>
          <p style={{ margin: 0 }}>CSS Grid動作確認</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>動作確認項目</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>HTML基本構造 ✓</li>
          <li>CSSインラインスタイル ✓</li>
          <li>CSS Grid レイアウト ✓</li>
          <li>色彩とタイポグラフィ ✓</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center' 
      }}>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontSize: '16px'
          }}
        >
          ← メインページに戻る
        </a>
      </div>
    </div>
  );
}