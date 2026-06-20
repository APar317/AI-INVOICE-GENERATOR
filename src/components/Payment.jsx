import React, { useState } from 'react';
import './styles/SaaS.css';

export default function Payment({ onVerifyPayment, onCancel }) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call for payment verification
    setTimeout(() => {
      onVerifyPayment();
    }, 2000);
  };

  return (
    <div className="saas-container">
      <div className="payment-card">
        <button className="back-btn" onClick={onCancel}>← Back</button>
        
        <div className="payment-header">
          <h2>Upgrade to Basic Plan</h2>
          <div className="payment-amount">₹500</div>
          <p>Unlimited Invoices • No Watermarks • Lifetime Access</p>
        </div>

        <div className="qr-container">
          <p className="scan-text">Scan to pay with any UPI app</p>
          <div className="qr-box">
            <img src="/upi-qr.png" alt="UPI QR Code" className="qr-image" />
          </div>
          <p className="upi-id">UPI ID: aparsaran08@okicici</p>
        </div>

        <div className="payment-actions">
          <button 
            className="primary-btn glow" 
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying Payment...' : 'I have made the payment'}
          </button>
          <p className="security-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
            Secure Payment Verification
          </p>
        </div>
      </div>
    </div>
  );
}
