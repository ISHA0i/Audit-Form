// import { useState } from 'react'
import './App.css';
import CybersecurityAuditForm from './component/CybersecurityAuditForm';

function App() {
  return (
    <div className="App">
      <header>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Cybersecurity Audit Portal</h1>
            <nav>
              <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
                <li><a href="#" style={{ color: 'var(--white)' }}>Home</a></li>
                <li><a href="#" style={{ color: 'var(--white)' }}>About</a></li>
                <li><a href="#" style={{ color: 'var(--white)' }}>Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="fade-in">
        <div className="container">
          <CybersecurityAuditForm />
        </div>
      </main>
      
      <footer>
        <div className="container text-center">
          <p style={{ marginBottom: '0.5rem' }}>© {new Date().getFullYear()} Cybersecurity Audit Portal. All rights reserved.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--neutral-1)' }}>Secure • Reliable • Professional</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
