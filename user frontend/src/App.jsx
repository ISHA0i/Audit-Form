import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CybersecurityAuditForm from './components/CybersecurityAuditForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main className="app-content">
          <Routes>
            <Route path="/" element={<CybersecurityAuditForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
