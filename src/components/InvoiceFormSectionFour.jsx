export default function InvoiceFormSectionFour({ invoiceData, updateInvoiceData }) {
  const paymentMethods = [
    {
      id: 'bank',
      label: 'Bank Transfer',
      color: '#2563eb',
      bg: 'rgba(37,99,235,0.12)',
      logo: (
        // Real bank/SWIFT style icon
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#1d4ed8"/>
          <path d="M18 6L5 13h26L18 6z" fill="#fff"/>
          <rect x="8" y="15" width="3" height="10" rx="0.5" fill="#93c5fd"/>
          <rect x="14" y="15" width="3" height="10" rx="0.5" fill="#93c5fd"/>
          <rect x="20" y="15" width="3" height="10" rx="0.5" fill="#93c5fd"/>
          <rect x="26" y="15" width="3" height="10" rx="0.5" fill="#93c5fd"/>
          <rect x="5" y="25" width="26" height="2.5" rx="0.5" fill="#bfdbfe"/>
          <text x="18" y="13.5" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold" fontFamily="Arial">$</text>
        </svg>
      ),
    },
    {
      id: 'paypal',
      label: 'PayPal',
      color: '#009cde',
      bg: 'rgba(0,156,222,0.12)',
      logo: (
        // Actual PayPal logo shape
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#003087"/>
          {/* PayPal P - shadow */}
          <path d="M16 9h7c3.3 0 5.5 2.2 5 5.5-.6 4-3.5 6-7 6h-1.5l-1.5 7H13L16 9z" fill="#009cde" opacity="0.5"/>
          {/* PayPal P - main */}
          <path d="M14 9h7c3.3 0 5.5 2.2 5 5.5-.6 4-3.5 6-7 6h-1.5l-1.5 7H11L14 9z" fill="#009cde"/>
          <path d="M14 9h6c3 0 5 2 4.5 5-.5 3.5-3 5.5-6.5 5.5h-1L15.5 24H12L14 9z" fill="#fff" opacity="0.15"/>
        </svg>
      ),
    },
    {
      id: 'upi',
      label: 'UPI',
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.12)',
      logo: (
        // UPI real logo style - NPCI colors
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#fff"/>
          {/* UPI Logo */}
          {/* Left arrow up - green */}
          <path d="M10 26L14 10l4 16" stroke="#097939" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M10.5 21h7" stroke="#097939" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Right arrow - orange */}
          <path d="M22 26V14" stroke="#ed7d31" strokeWidth="3" strokeLinecap="round"/>
          <path d="M19 17l3-3 3 3" stroke="#ed7d31" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* UPI text */}
          <text x="18" y="33" textAnchor="middle" fill="#097939" fontSize="4.5" fontWeight="900" fontFamily="Arial" letterSpacing="1">UPI</text>
        </svg>
      ),
    },
    {
      id: 'stripe',
      label: 'Stripe',
      color: '#635bff',
      bg: 'rgba(99,91,255,0.12)',
      logo: (
        // Real Stripe logo S shape
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#635bff"/>
          {/* Stripe S */}
          <path
            d="M18.3 13.4c0-1.1.9-1.5 2.3-1.5 2.1 0 4.7.6 6.5 1.7V7.8C25.2 6.7 22.8 6 20.6 6c-5 0-8.4 2.6-8.4 6.9 0 6.7 9.2 5.6 9.2 8.5 0 1.3-1.1 1.7-2.7 1.7-2.3 0-5.2-.9-7.5-2.3v5.9C13.5 28 16.3 28.5 19 28.5c5.1 0 8.6-2.5 8.6-7-0.1-7.2-9.3-5.9-9.3-8.1z"
            fill="#fff"
          />
        </svg>
      ),
    },
    {
      id: 'cash',
      label: 'Cash',
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.12)',
      logo: (
        // Cash / dollar bill icon
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#15803d"/>
          <rect x="4" y="11" width="28" height="16" rx="2" fill="#166534"/>
          <rect x="4" y="11" width="28" height="16" rx="2" stroke="#4ade80" strokeWidth="1.5"/>
          {/* Center circle */}
          <circle cx="18" cy="19" r="4" stroke="#4ade80" strokeWidth="1.5" fill="none"/>
          <text x="18" y="22.5" textAnchor="middle" fill="#4ade80" fontSize="6" fontWeight="bold" fontFamily="Arial">$</text>
          {/* Corner dots */}
          <rect x="6" y="13" width="4" height="3" rx="0.5" fill="#4ade80" opacity="0.4"/>
          <rect x="26" y="13" width="4" height="3" rx="0.5" fill="#4ade80" opacity="0.4"/>
          <rect x="6" y="22" width="4" height="3" rx="0.5" fill="#4ade80" opacity="0.4"/>
          <rect x="26" y="22" width="4" height="3" rx="0.5" fill="#4ade80" opacity="0.4"/>
        </svg>
      ),
    },
  ];

  const selected = invoiceData.paymentMethod;

  return (
    <div style={styles.card}>
      <div style={styles.layout}>

        {/* Left: Payment Methods */}
        <div style={styles.leftCol}>
          <h3 style={styles.title}>How does this invoice get paid?</h3>
          <div style={styles.methodList}>
            {paymentMethods.map((method) => {
              const isSelected = selected === method.label;
              return (
                <label key={method.id} style={{ cursor: 'pointer', display: 'block' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.label}
                    checked={isSelected}
                    onChange={(e) => updateInvoiceData('paymentMethod', e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    ...styles.methodCard,
                    background: isSelected ? method.bg : 'rgba(255,255,255,0.02)',
                    borderColor: isSelected ? method.color : '#2d3347',
                    boxShadow: isSelected ? `0 0 0 1px ${method.color}50, 0 4px 12px ${method.color}20` : 'none',
                    transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                  }}>
                    {/* Brand Logo */}
                    <div style={styles.logoWrap}>
                      {method.logo}
                    </div>

                    {/* Label */}
                    <span style={{
                      ...styles.methodLabel,
                      color: isSelected ? '#f8fafc' : '#94a3b8',
                      fontWeight: isSelected ? 700 : 500,
                    }}>
                      {method.label}
                    </span>

                    {/* Radio dot */}
                    <div style={{
                      ...styles.radioIndicator,
                      borderColor: isSelected ? method.color : '#475569',
                      background: isSelected ? method.color : 'transparent',
                    }}>
                      {isSelected && <div style={styles.radioDot} />}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right: Details */}
        <div style={styles.rightCol}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12" y2="12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="8" r="1" fill="#6366f1"/>
            </svg>
            <h3 style={styles.title}>Payment details</h3>
          </div>
          <textarea
            placeholder={
              selected === 'UPI'
                ? 'UPI ID: yourname@bank\nQR Code link (optional)'
                : selected === 'PayPal'
                ? 'PayPal Email: you@email.com'
                : selected === 'Stripe'
                ? 'Stripe payment link or details...'
                : selected === 'Cash'
                ? 'Any cash pickup instructions...'
                : 'Bank Name:\nAccount Holder:\nAccount Number:\nAccount Type:\nIFSC / SWIFT Code:\nIBAN (if applicable):'
            }
            value={invoiceData.bankDetails}
            onChange={(e) => updateInvoiceData('bankDetails', e.target.value)}
            rows={8}
            style={styles.textarea}
          />
        </div>

      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#1a1d27',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '2rem',
    marginTop: '2rem',
  },
  layout: {
    display: 'flex',
    gap: '3rem',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  leftCol: { flex: '1 1 260px' },
  rightCol: { flex: '1 1 260px' },
  title: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '1.25rem',
  },
  methodList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  methodCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid',
    transition: 'all 0.25s ease',
  },
  logoWrap: {
    flexShrink: 0,
    lineHeight: 0,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  methodLabel: {
    flex: 1,
    fontSize: '0.92rem',
    transition: 'color 0.2s',
  },
  radioIndicator: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  radioDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#fff',
  },
  textarea: {
    width: '100%',
    resize: 'vertical',
    background: '#252936',
    border: '1px solid #334155',
    color: '#f8fafc',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '0.9rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    lineHeight: '1.7',
    outline: 'none',
    boxSizing: 'border-box',
  },
};
