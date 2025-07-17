// 完全に静的なページ - Next.js App Router 対応
export default function EmergencyPage() {
  const timestamp = new Date().toISOString();
  
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      margin: '40px',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1>🚨 Emergency Test Page</h1>
        <div style={{
          color: '#2e7d32',
          background: '#e8f5e8',
          padding: '15px',
          borderRadius: '5px',
          border: '1px solid #4caf50'
        }}>
          <h2>✅ Next.js Static Generation Working</h2>
          <p>This page was generated at: <strong>{timestamp}</strong></p>
          <p>If you can see this, Next.js basic static generation is functional.</p>
        </div>
        
        <h3>Environment Check:</h3>
        <ul>
          <li>✅ TypeScript compilation</li>
          <li>✅ Next.js page routing</li>
          <li>✅ Static HTML generation</li>
          <li>✅ CSS styling</li>
        </ul>
        
        <h3>Network Test:</h3>
        <p>If this page loads, but other pages show empty HTML, the issue is likely:</p>
        <ol>
          <li>Client-side JavaScript errors</li>
          <li>Context provider failures</li>
          <li>Hydration mismatches</li>
        </ol>
        
        <div style={{marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '5px'}}>
          <h4>Test Results:</h4>
          <p><strong>Server Response:</strong> Working ✅</p>
          <p><strong>HTML Generation:</strong> Working ✅</p>
          <p><strong>Static Assets:</strong> Working ✅</p>
        </div>
      </div>
    </div>
  );
}