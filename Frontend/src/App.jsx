// import { useState } from 'react'
import './App.css';
import CybersecurityAuditForm from './component/CybersecurityAuditForm';

function App() {
  return (
    <div className="App">
      <header>
        <div className="container">
          <h1>Cybersecurity Audit Portal</h1>
        </div>
      </header>
      
      <main className="fade-in">
        <div className="container">
          <CybersecurityAuditForm />
        </div>
      </main>
      
      <footer>
        <div class="footer">

        <div className="container text-center">
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-1)' }}>Secure • Reliable • Professional</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-1)', marginTop: '1rem' }}>
            For any queries, contact us at: <a href="mailto:contact@endsecure.in" style={{ color: 'var(--neutral-1)' }}>contact@endsecure.in</a> | <a href="https://www.endsecure.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neutral-1)' }}>www.endsecure.in</a>
          </p>
        </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
