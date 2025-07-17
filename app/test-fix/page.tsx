export default function TestFixPage() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#e8f5e8',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2e7d32', fontSize: '48px', marginBottom: '20px' }}>
        🎉 修復成功！
      </h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#1976d2', marginBottom: '20px' }}>
          ✅ Next.js が正常に動作しています
        </h2>
        
        <p style={{ fontSize: '18px', marginBottom: '15px', color: '#333' }}>
          問題原因: <code style={{ backgroundColor: '#fff3cd', padding: '4px 8px' }}>
            output: 'export'
          </code> 設定
        </p>
        
        <p style={{ fontSize: '16px', marginBottom: '20px', color: '#666' }}>
          開発環境用に設定を調整しました
        </p>
        
        <div style={{ fontSize: '14px', color: '#888' }}>
          <p>現在時刻: {new Date().toLocaleString('ja-JP')}</p>
          <p>テストページ生成: 動的レンダリング確認</p>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        >
          メインページに戻る
        </a>
      </div>
    </div>
  );
}