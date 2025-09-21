export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          AI Sales Agent
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          color: '#6b7280',
          marginBottom: '3rem'
        }}>
          B2B Prospecting Platform - Successfully Deployed!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ margin: '0.5rem 0', color: '#111827' }}>Smart Qualification</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>AI-powered prospect scoring</p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✉️</div>
            <h3 style={{ margin: '0.5rem 0', color: '#111827' }}>Email Sequences</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Automated outreach campaigns</p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <h3 style={{ margin: '0.5rem 0', color: '#111827' }}>Analytics</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Real-time performance metrics</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a
            href="/api/test"
            style={{
              padding: '0.75rem 2rem',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              display: 'inline-block',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Test API
          </a>
          <a
            href="https://github.com/yoprobotics/ai-sales-agent"
            style={{
              padding: '0.75rem 2rem',
              background: '#1f2937',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '500',
              display: 'inline-block',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#111827'}
            onMouseOut={(e) => e.currentTarget.style.background = '#1f2937'}
          >
            View on GitHub
          </a>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.5rem'
        }}>
          <p style={{ margin: 0, color: '#166534' }}>
            ✅ Deployment Status: <strong>SUCCESS</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
