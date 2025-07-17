'use client';

import React, { useState, useEffect } from 'react';
import { hyakuninIsshuData } from '../../src/data/hyakunin-isshu-data';

// 完全にクライアントサイドのみで動作する百人一首テストページ
export default function WorkingTestPage() {
  const [logs, setLogs] = useState<string[]>(['📋 ページ初期化開始...']);
  const [currentCard, setCurrentCard] = useState(0);
  
  useEffect(() => {
    const newLogs = [...logs];
    
    try {
      newLogs.push(`✅ useEffect実行成功: ${new Date().toLocaleTimeString('ja-JP')}`);
      newLogs.push(`✅ 百人一首データ読み込み: ${hyakuninIsshuData.length}首`);
      newLogs.push(`✅ React Stateの更新: 正常`);
      
      // データが存在することを確認
      if (hyakuninIsshuData && hyakuninIsshuData[0]) {
        newLogs.push(`✅ 第1首: ${hyakuninIsshuData[0].kamiNoKu.substring(0, 10)}...`);
      }
      
      newLogs.push(`🎯 クライアントサイドJavaScript: 完全動作`);
      setLogs(newLogs);
      
    } catch (error) {
      newLogs.push(`❌ エラー発生: ${error instanceof Error ? error.message : String(error)}`);
      setLogs(newLogs);
    }
  }, []);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % hyakuninIsshuData.length);
  };

  const card = hyakuninIsshuData[currentCard];

  return (
    <div style={{ 
      fontFamily: 'YuMincho, "Hiragino Mincho ProN", "Noto Serif JP", serif',
      margin: '20px auto',
      maxWidth: '800px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px',
        fontSize: '2rem'
      }}>
        🎴 百人一首トレーニング - 動作テスト
      </h1>
      
      {/* ログ表示 */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #27ae60',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#27ae60', marginBottom: '15px' }}>🔍 システム動作状況</h2>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {logs.map((log, index) => (
            <li key={index} style={{ 
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: log.startsWith('❌') ? '#ffe6e6' : '#e6ffe6',
              borderRadius: '4px',
              borderLeft: `4px solid ${log.startsWith('❌') ? '#e74c3c' : '#27ae60'}`
            }}>
              {log}
            </li>
          ))}
        </ul>
      </div>

      {/* 百人一首カード表示 */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ 
            backgroundColor: '#3498db',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '14px'
          }}>
            第{currentCard + 1}首 / 全{hyakuninIsshuData.length}首
          </span>
        </div>

        {card && (
          <>
            {/* 上の句（縦書き） */}
            <div style={{
              writingMode: 'vertical-rl' as any,
              textOrientation: 'upright' as any,
              direction: 'rtl' as any,
              height: '200px',
              fontSize: '1.5rem',
              lineHeight: '2.5',
              margin: '20px auto',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {card.kamiNoKu}
            </div>

            {/* 下の句（縦書き） */}
            <div style={{
              writingMode: 'vertical-rl' as any,
              textOrientation: 'upright' as any,
              direction: 'rtl' as any,
              height: '180px',
              fontSize: '1.3rem',
              lineHeight: '2.2',
              margin: '20px auto',
              padding: '20px',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {card.shimoNoKu}
            </div>

            {/* 作者名 */}
            <div style={{
              textAlign: 'center',
              fontSize: '1.1rem',
              color: '#666',
              marginTop: '20px',
              fontWeight: 'bold'
            }}>
              {card.author}
            </div>
          </>
        )}

        {/* 操作ボタン */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={nextCard}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            📖 次の句
          </button>
          
          <a
            href="/"
            style={{
              display: 'inline-block',
              backgroundColor: '#95a5a6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '16px'
            }}
          >
            🏠 メインページ
          </a>
        </div>
      </div>
    </div>
  );
}