'use client';

import React, { useState, useEffect } from 'react';
import { hyakuninIsshuData } from '../../src/data/hyakunin-isshu-data';

/**
 * デバッグページ - 百人一首アプリの初期化問題を調査
 */
export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logs: string[] = [];
    
    try {
      logs.push(`✅ Page loaded at: ${new Date().toISOString()}`);
      
      // Check if window object is available
      logs.push(`✅ typeof window: ${typeof window}`);
      
      // Check hyakunin-isshu data
      logs.push(`✅ hyakuninIsshuData imported: ${!!hyakuninIsshuData}`);
      logs.push(`✅ hyakuninIsshuData length: ${hyakuninIsshuData?.length || 'undefined'}`);
      
      // Test localStorage access
      if (typeof window !== 'undefined') {
        try {
          const testKey = 'debug-test';
          localStorage.setItem(testKey, 'test-value');
          const retrieved = localStorage.getItem(testKey);
          localStorage.removeItem(testKey);
          logs.push(`✅ localStorage access: ${retrieved === 'test-value' ? 'Working' : 'Failed'}`);
        } catch (e) {
          logs.push(`❌ localStorage error: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      
      // Check first card data
      if (hyakuninIsshuData && hyakuninIsshuData[0]) {
        const firstCard = hyakuninIsshuData[0];
        logs.push(`✅ First card ID: ${firstCard.id}`);
        logs.push(`✅ First card kamiNoKu: ${firstCard.kamiNoKu.substring(0, 20)}...`);
        logs.push(`✅ First card has kimariji: ${!!firstCard.kimariji}`);
      }
      
      setDebugInfo(logs);
      
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logs.push(`❌ Fatal error: ${errorMsg}`);
      setDebugInfo(logs);
    }
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      margin: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1>🔍 Debug Page - 百人一首アプリ初期化テスト</h1>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          border: '1px solid #f44336',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#d32f2f', margin: '0 0 10px 0' }}>❌ Critical Error</h3>
          <pre style={{ 
            color: '#d32f2f', 
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {error}
          </pre>
        </div>
      )}
      
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '20px'
      }}>
        <h2>Debug Information:</h2>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {debugInfo.map((log, index) => (
            <li key={index} style={{ 
              marginBottom: '8px',
              padding: '5px',
              backgroundColor: log.startsWith('❌') ? '#ffebee' : '#e8f5e8',
              borderRadius: '3px'
            }}>
              {log}
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#2196f3',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          ← メインページに戻る
        </a>
        
        <a href="/emergency" style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#ff9800',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          🚨 緊急テストページ
        </a>
      </div>
    </div>
  );
}