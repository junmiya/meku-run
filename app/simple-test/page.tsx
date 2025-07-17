export default function SimpleTestPage() {
  return (
    <html>
      <head>
        <title>Simple Test</title>
      </head>
      <body>
        <h1>Simple Test Page</h1>
        <p>If you can see this, basic Next.js is working.</p>
        <div>Current time: {new Date().toISOString()}</div>
      </body>
    </html>
  );
}