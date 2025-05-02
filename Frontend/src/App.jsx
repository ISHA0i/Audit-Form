import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CybersecurityAuditForm from './components/CybersecurityAuditForm';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <nav className="app-nav">
            <Link to="/" className="nav-link">Form</Link>
            <Link to="/admin" className="nav-link">Admin Panel</Link>
          </nav>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<CybersecurityAuditForm />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
