import React from 'react';
import QRCode from 'react-qr-code';

export default function InvoicePDFTemplate({ invoiceData, contentRef }) {
  const {
    logo, invoiceNumber, invoiceDate, dueDate, dueTerms, currencySymbol,
    invoiceFrom, billTo, items, globalDiscount, globalDiscountType,
    gstApplicable, gst, shipping, subtotal, total,
    paymentMethod, bankDetails, notes, terms, currency
  } = invoiceData;

  const fmt = (n) => `${currencySymbol}${(parseFloat(n) || 0).toFixed(2)}`;

  const getItemAmount = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    let amt = qty * rate;
    if (item.discountType === '%') amt -= amt * (discount / 100);
    else amt -= discount;
    return Math.max(0, amt);
  };

  // ── Build QR payload based on payment method ──────────────────────────────
  const buildQRValue = () => {
    const amount = (parseFloat(total) || 0).toFixed(2);
    const inv = invoiceNumber || 'INV';

    if (paymentMethod === 'UPI' && bankDetails) {
      // Extract UPI ID (first line of bankDetails)
      const upiId = bankDetails.split('\n')[0].replace(/^UPI ID:\s*/i, '').trim();
      if (upiId) {
        return `upi://pay?pa=${upiId}&pn=Invoice&am=${amount}&cu=INR&tn=Invoice%20${inv}`;
      }
    }

    if (paymentMethod === 'PayPal' && bankDetails) {
      const email = bankDetails.split('\n')[0].replace(/^PayPal Email:\s*/i, '').trim();
      if (email) return `https://paypal.me/${email.replace('@', '')}/${amount}`;
    }

    if (paymentMethod === 'Stripe' && bankDetails) {
      const link = bankDetails.trim().split('\n')[0];
      if (link.startsWith('http')) return link;
    }

    if (paymentMethod === 'Payment Link' && bankDetails) {
      const link = bankDetails.trim().split('\n')[0];
      if (link.startsWith('http')) return link;
    }

    // Fallback: encode all payment details as text QR
    return `INVOICE: ${inv}\nAMOUNT: ${amount}\nMETHOD: ${paymentMethod}\n${bankDetails || ''}`.trim();
  };

  const qrValue = buildQRValue();

  // ── Method badge color ────────────────────────────────────────────────────
  const methodColors = {
    'Bank Transfer': '#2563eb',
    'PayPal':        '#009cde',
    'UPI':           '#7c3aed',
    'Stripe':        '#635bff',
    'Cash':          '#16a34a',
    'Payment Link':  '#f59e0b',
  };
  const badgeColor = methodColors[paymentMethod] || '#6366f1';

  return (
    <div style={{ display: 'none' }}>
      <div
        ref={contentRef}
        style={{
          padding: '40px',
          fontFamily: "'Inter', system-ui, sans-serif",
          color: '#1e293b',
          background: '#fff',
          width: '800px',
          minHeight: '1120px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #6366f1', paddingBottom: '24px', marginBottom: '32px' }}>
          <div>
            {logo ? (
              <img src={logo} alt="Logo" style={{ maxHeight: '72px', maxWidth: '180px', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#6366f1', letterSpacing: '-0.5px' }}>INVOICE</div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', marginBottom: '8px' }}>INVOICE</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.8' }}>
              <div><strong>Invoice #:</strong> {invoiceNumber || 'INV-0001'}</div>
              <div><strong>Date:</strong> {invoiceDate}</div>
              <div><strong>Due Date:</strong> {dueDate}</div>
              <div><strong>Terms:</strong> {dueTerms}</div>
            </div>
          </div>
        </div>

        {/* ── Addresses ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div style={{ width: '45%' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>From</div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.7', color: '#374151' }}>
              {invoiceFrom || 'Your Business Details...'}
            </div>
          </div>
          <div style={{ width: '45%' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Bill To</div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: '1.7', color: '#374151' }}>
              {billTo || 'Client Details...'}
            </div>
          </div>
        </div>

        {/* ── Items Table ── */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Description</th>
              <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Qty</th>
              <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Rate</th>
              <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Discount</th>
              <th style={{ padding: '10px 12px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#1e293b' }}>{item.description || `Item ${idx + 1}`}</td>
                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#475569', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#475569', textAlign: 'right' }}>{fmt(item.rate)}</td>
                <td style={{ padding: '11px 12px', fontSize: '13px', color: '#ef4444', textAlign: 'right' }}>
                  {item.discount > 0 ? (item.discountType === '%' ? `${item.discount}%` : fmt(item.discount)) : '—'}
                </td>
                <td style={{ padding: '11px 12px', fontSize: '13px', fontWeight: '600', color: '#1e293b', textAlign: 'right' }}>{fmt(getItemAmount(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Summary + QR side by side ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>

          {/* QR Code Box */}
          <div style={{
            width: '180px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              Scan to Pay
            </div>
            <div style={{ display: 'inline-block', padding: '8px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <QRCode
                value={qrValue}
                size={120}
                fgColor="#0f172a"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div style={{
              marginTop: '10px',
              display: 'inline-block',
              background: badgeColor,
              color: '#fff',
              fontSize: '10px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '20px',
              letterSpacing: '0.5px',
            }}>
              {paymentMethod}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#6366f1', marginTop: '8px' }}>
              {fmt(total)}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
              Invoice #{invoiceNumber || 'DRAFT'}
            </div>
          </div>

          {/* Summary Numbers */}
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>{fmt(subtotal)}</span>
            </div>
            {(parseFloat(globalDiscount) > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#ef4444' }}>Discount ({globalDiscount}{globalDiscountType})</span>
                <span style={{ color: '#ef4444', fontWeight: '600' }}>
                  -{fmt(globalDiscountType === '%' ? subtotal * (globalDiscount / 100) : globalDiscount)}
                </span>
              </div>
            )}
            {gstApplicable && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>GST (18%)</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>{fmt(gst)}</span>
              </div>
            )}
            {(parseFloat(shipping) > 0) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Shipping</span>
                <span style={{ fontWeight: '600' }}>{fmt(shipping)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', marginTop: '8px', background: '#6366f1', borderRadius: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>Total Due</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* ── Footer: Payment Info, Notes, Terms ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', borderTop: '2px solid #f1f5f9', paddingTop: '20px', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Payment Info</div>
            <div style={{ fontWeight: '600', color: '#374151', marginBottom: '4px' }}>{paymentMethod}</div>
            {bankDetails && <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{bankDetails}</div>}
          </div>
          {notes && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Notes</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{notes}</div>
            </div>
          )}
          {terms && (
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Terms</div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>{terms}</div>
            </div>
          )}
        </div>

        {/* ── Bottom accent line ── */}
        <div style={{ marginTop: '32px', height: '4px', background: 'linear-gradient(to right, #6366f1, #8b5cf6, #06b6d4)', borderRadius: '2px' }} />
      </div>
    </div>
  );
}
