'use client';

import React, { useState, useEffect } from 'react';

/**
 * 単純なテストページ - Context プロバイダーなし
 */
export default function TestSimplePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testLogs: string[] = [];
    
    try {
      testLogs.push(`✅ useEffect executed at: ${new Date().toISOString()}`);
      testLogs.push(`✅ typeof window: ${typeof window}`);
      testLogs.push(`✅ React state working: ${logs.length === 0 ? 'Yes' : 'No'}`);
      
      if (typeof window !== 'undefined') {
        testLogs.push(`✅ Window object available`);
        testLogs.push(`✅ localStorage available: ${typeof localStorage !== 'undefined'}`);
      }
      
      setLogs(testLogs);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      testLogs.push(`❌ Error: ${errorMsg}`);
      setLogs(testLogs);
    }
  }, []);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      margin: '20px',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{ color: '#333' }}>🧪 Simple Test Page (No Contexts)</h1>
      
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2>Client-Side Test Results:</h2>
        {error && (
          <div style={{ 
            color: 'red', 
            backgroundColor: '#ffe6e6', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {logs.map((log, index) => (
            <li key={index} style={{ 
              marginBottom: '5px',
              padding: '8px',
              backgroundColor: log.startsWith('❌') ? '#ffe6e6' : '#e6ffe6',
              borderRadius: '4px'
            }}>
              {log}
            </li>
          ))}
        </ul>
        
        {logs.length === 0 && !error && (
          <div style={{ 
            color: '#666', 
            fontStyle: 'italic',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            borderRadius: '4px'
          }}>
            ⏳ Waiting for client-side JavaScript to execute...
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          ← メインページに戻る
        </a>
        
        <a href="/debug" style={{
          display: 'inline-block',
          padding: '10px 15px',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}>
          🔍 デバッグページ
        </a>
      </div>
    </div>
  );
}