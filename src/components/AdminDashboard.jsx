import React, { useState, useEffect } from 'react';
import './styles/SaaS.css';

export default function AdminDashboard({ onLogout }) {
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('invoice_login_history') || '[]');
    // Sort by latest first
    history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLoginHistory(history);
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all login logs?')) {
      localStorage.removeItem('invoice_login_history');
      setLoginHistory([]);
    }
  };

  return (
    <div className="saas-container" style={{ alignItems: 'flex-start', padding: '2rem 10%', display: 'block' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient" style={{ margin: 0 }}>Admin Dashboard</h2>
        <button onClick={onLogout} className="secondary-btn" style={{ width: 'auto', padding: '8px 16px' }}>
          Logout Admin
        </button>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#f8fafc' }}>Login History</h3>
          <button onClick={clearHistory} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Clear Logs
          </button>
        </div>

        {loginHistory.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No login records found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem' }}>User Email</th>
                  <th style={{ padding: '12px', color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem' }}>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((log, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', color: '#f8fafc', fontSize: '0.9rem' }}>{log.email}</td>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: '0.9rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
