export default function Home() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🚀 AI Sales Agent
      </h1>
      <p style={{ fontSize: '1.5rem', color: '#666' }}>
        Deployment Successful!
      </p>
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9', 
        padding: '20px', 
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '600px'
      }}>
        <p>Platform is live and ready for development</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#666' }}>
          Version 0.1.0 - MVP Build
        </p>
      </div>
    </div>
  )
}
