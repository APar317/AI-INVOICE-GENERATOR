import './styles/InvoiceForm.css';

export default function InvoiceFormSectionFour({ invoiceData, updateInvoiceData }) {
  const paymentMethods = [
    { id: 'bank', label: 'Bank Transfer', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { id: 'paypal', label: 'PayPal', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> },
    { id: 'upi', label: 'UPI', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
    { id: 'link', label: 'Payment Link', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> },
    { id: 'cash', label: 'Cash', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg> }
  ];

  return (
    <div className="glass-panel form-section section-four" style={{ marginTop: '2rem' }}>
      <div className="section-two-layout">
        
        {/* Left Column: Payment Method */}
        <div className="address-container">
          <div className="address-header">
            <h3 className="section-title" style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>How does this invoice get paid?</h3>
          </div>
          <div className="payment-methods-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {paymentMethods.map(method => (
              <label key={method.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method.label}
                  checked={invoiceData.paymentMethod === method.label}
                  onChange={(e) => updateInvoiceData('paymentMethod', e.target.value)}
                  style={{ accentColor: 'var(--accent-primary)', width: '1rem', height: '1rem' }}
                />
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>{method.icon}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right Column: Bank Details */}
        <div className="address-container">
          <div className="address-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <h3 className="section-title" style={{ margin: 0, fontSize: '0.95rem' }}>Enter bank details</h3>
          </div>
          <textarea
            className="address-textarea"
            placeholder="Bank Name,&#10;Account Holder Name,&#10;Account Number,&#10;Account Type,&#10;IFSC/SWIFT Code,&#10;IBAN, etc..."
            value={invoiceData.bankDetails}
            onChange={(e) => updateInvoiceData('bankDetails', e.target.value)}
            rows="6"
          />
        </div>
        
      </div>
    </div>
  );
}
