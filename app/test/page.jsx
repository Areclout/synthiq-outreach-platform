export default function TestPage() {
  return <div style={{padding:40,background:'#111',color:'#fff',minHeight:'100vh'}}>
    <h1>Synthiq Test Page</h1>
    <p>If you can see this, the app router is working.</p>
    <p>Timestamp: {new Date().toISOString()}</p>
  </div>
}
