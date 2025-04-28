// import { useState } from 'react'
import './App.css';
import CybersecurityAuditForm from './component/CybersecurityAuditForm';

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--neutral-light-3)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CybersecurityAuditForm />
    </div>
  );
}

export default App;
