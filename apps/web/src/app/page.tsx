export default function Home() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 AI Sales Agent</h1>
      <p style={{ fontSize: '1.5rem', color: '#666' }}>Platform Successfully Deployed!</p>
      <div style={{ 
        background: '#f0f9ff', 
        border: '2px solid #0ea5e9', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '30px auto',
        maxWidth: '600px'
      }}>
        <p style={{ margin: 0, fontSize: '1.1rem' }}>
          ✅ Vercel Deployment Successful<br />
          ✅ Next.js 14 App Router Ready<br />
          ✅ Database Connection Ready
        </p>
      </div>
      <div style={{ marginTop: '30px' }}>
        <a 
          href="/login" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#0ea5e9',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            margin: '0 10px'
          }}
        >
          Login
        </a>
        <a 
          href="/register" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            margin: '0 10px'
          }}
        >
          Register
        </a>
      </div>
    </div>
  )
}
