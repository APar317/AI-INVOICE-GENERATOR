import React from 'react';
import './styles/SaaS.css';

export default function Pricing({ usageCount, onSelectPlan }) {
  return (
    <div className="saas-container pricing-view">
      <div className="pricing-header">
        <h1 className="text-gradient">Choose Your Plan</h1>
        <p>You have generated <strong>{usageCount} / 10</strong> free invoices.</p>
      </div>

      <div className="pricing-cards">
        {/* Free Plan */}
        <div className="pricing-card">
          <div className="plan-name">Free Plan</div>
          <div className="plan-price">₹0</div>
          <p className="plan-desc">Perfect for trying out the tool</p>
          
          <ul className="plan-features">
            <li><span className="check">✓</span> Up to 10 invoices</li>
            <li><span className="check">✓</span> Standard Templates</li>
            <li><span className="check">✓</span> PDF Download</li>
            <li className="disabled"><span className="cross">✕</span> Unlimited Generation</li>
            <li className="disabled"><span className="cross">✕</span> Premium Support</li>
          </ul>

          <button 
            className="secondary-btn" 
            onClick={() => onSelectPlan('free')}
            disabled={usageCount >= 10}
          >
            {usageCount >= 10 ? 'Limit Reached' : 'Continue Free'}
          </button>
        </div>

        {/* Basic Premium Plan */}
        <div className="pricing-card premium">
          <div className="premium-badge">Most Popular</div>
          <div className="plan-name">Basic Plan</div>
          <div className="plan-price">₹500 <span className="period">/ lifetime</span></div>
          <p className="plan-desc">For professionals and freelancers</p>
          
          <ul className="plan-features">
            <li><span className="check">✓</span> <strong>Unlimited Invoices</strong></li>
            <li><span className="check">✓</span> PDF Download</li>
            <li><span className="check">✓</span> Lifetime Access</li>
          </ul>

          <button className="primary-btn glow" onClick={() => onSelectPlan('premium')}>
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
