import React, { useState } from 'react';
import './styles/SaaS.css';

export default function Login({ onLogin, onAdminLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (isAdminMode) {
      // Hardcoded Admin Credentials
      if (email === 'admin@invoice.com' && (password === 'Apar@1721' || password === 'Surat@7781')) {
        setError('');
        onAdminLogin();
      } else {
        setError('Invalid Admin credentials.');
      }
      return;
    }

    // Normal User Login
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password criteria: 
    // at least 6 characters, contains number, lowercase, uppercase
    const hasLength = password.length >= 6;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLength || !hasLower || !hasUpper || !hasNumber) {
      setError('Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, and a number.');
      return;
    }
    
    setError('');
    
    // Log the user's login timestamp into local storage
    const history = JSON.parse(localStorage.getItem('invoice_login_history') || '[]');
    history.push({
      email: email,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('invoice_login_history', JSON.stringify(history));

    // Mock login success
    onLogin(email);
  };

  return (
    <div className="saas-container">
      <div className="login-card" style={{ position: 'relative' }}>
        <button 
          onClick={() => { setIsAdminMode(!isAdminMode); setError(''); setEmail(''); setPassword(''); }}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: isAdminMode ? '#ef4444' : '#6366f1', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
        >
          {isAdminMode ? 'User Login' : 'Admin Login'}
        </button>

        <div className="login-header">
          <h2>{isAdminMode ? 'Admin Access' : 'Welcome Back'}</h2>
          <p>{isAdminMode ? 'Login to view user tracking logs' : 'Login to continue creating professional invoices'}</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="form-group">
            <label>{isAdminMode ? 'Admin ID' : 'Gmail ID'}</label>
            <input 
              type="email" 
              placeholder={isAdminMode ? "admin@invoice.com" : "you@gmail.com"} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {!isAdminMode && (
              <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', lineHeight: '1.4'}}>
                Must be at least 6 characters, with 1 uppercase, 1 lowercase, and 1 number.
              </p>
            )}
          </div>
          
          <button type="submit" className="primary-btn" style={isAdminMode ? { background: '#ef4444' } : {}}>
            {isAdminMode ? 'Enter Dashboard' : 'Login'}
          </button>
        </form>
        
        {!isAdminMode && (
          <div className="login-footer">
            <p>Don't have an account? Just enter any email to register.</p>
          </div>
        )}
      </div>
    </div>
  );
}
