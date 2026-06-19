import React from 'react';

export default function InvoicePDFTemplate({ invoiceData, contentRef }) {
  const { 
    logo, invoiceNumber, invoiceDate, dueDate, dueTerms, currencySymbol,
    invoiceFrom, billTo, items, globalDiscount, globalDiscountType,
    gstApplicable, gst, shipping, subtotal, total, paymentMethod, bankDetails, notes, terms
  } = invoiceData;

  const formatCurrency = (amount) => {
    return `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
  };

  const getItemAmount = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    let itemAmount = qty * rate;
    if (item.discountType === '%') {
      itemAmount -= itemAmount * (discount / 100);
    } else {
      itemAmount -= discount;
    }
    return Math.max(0, itemAmount);
  };

  // We use inline styles for the PDF template to ensure html2pdf captures everything perfectly
  // without relying on complex external CSS that might not render right.
  return (
    <div style={{ display: 'none' }}>
      <div 
        ref={contentRef} 
        style={{
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#333',
          background: '#fff',
          width: '800px', // Fixed width for A4 approximation
          minHeight: '1120px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px', marginBottom: '30px' }}>
          <div>
            {logo ? (
              <img src={logo} alt="Logo" style={{ maxHeight: '80px', maxWidth: '200px', objectFit: 'contain' }} />
            ) : (
              <h1 style={{ margin: 0, color: '#111', fontSize: '24px' }}>INVOICE</h1>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#111' }}>INVOICE</h2>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <p style={{ margin: '2px 0' }}><strong>Invoice #:</strong> {invoiceNumber || 'INV-0001'}</p>
              <p style={{ margin: '2px 0' }}><strong>Date:</strong> {invoiceDate}</p>
              <p style={{ margin: '2px 0' }}><strong>Due Date:</strong> {dueDate}</p>
              <p style={{ margin: '2px 0' }}><strong>Terms:</strong> {dueTerms}</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ width: '45%' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>From</h3>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>
              {invoiceFrom || 'Your Business Details...'}
            </div>
          </div>
          <div style={{ width: '45%' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>Bill To</h3>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.5' }}>
              {billTo || 'Client Details...'}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '10px 5px', fontSize: '14px' }}>Description</th>
              <th style={{ padding: '10px 5px', fontSize: '14px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '10px 5px', fontSize: '14px', textAlign: 'right' }}>Rate</th>
              <th style={{ padding: '10px 5px', fontSize: '14px', textAlign: 'right' }}>Discount</th>
              <th style={{ padding: '10px 5px', fontSize: '14px', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 5px', fontSize: '14px' }}>{item.description || `Item ${index + 1}`}</td>
                <td style={{ padding: '12px 5px', fontSize: '14px', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '12px 5px', fontSize: '14px', textAlign: 'right' }}>{formatCurrency(item.rate)}</td>
                <td style={{ padding: '12px 5px', fontSize: '14px', textAlign: 'right' }}>
                  {item.discount > 0 ? (item.discountType === '%' ? `${item.discount}%` : formatCurrency(item.discount)) : '-'}
                </td>
                <td style={{ padding: '12px 5px', fontSize: '14px', textAlign: 'right' }}>{formatCurrency(getItemAmount(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {globalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px', color: '#ef4444' }}>
                <span>Discount ({globalDiscount}{globalDiscountType}):</span>
                <span>-{formatCurrency(globalDiscountType === '%' ? subtotal * (globalDiscount/100) : globalDiscount)}</span>
              </div>
            )}
            {gstApplicable && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
                <span>GST (18%):</span>
                <span>{formatCurrency(gst)}</span>
              </div>
            )}
            {shipping > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '14px' }}>
                <span>Shipping:</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: '5px', borderTop: '2px solid #333', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer info: Bank, Notes, Terms */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <div style={{ width: '30%' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Payment Info</h4>
            <p style={{ margin: '0 0 5px 0' }}><strong>Method:</strong> {paymentMethod}</p>
            {bankDetails && (
              <div style={{ whiteSpace: 'pre-wrap' }}>{bankDetails}</div>
            )}
          </div>
          
          <div style={{ width: '30%' }}>
            {notes && (
              <>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Notes</h4>
                <div style={{ whiteSpace: 'pre-wrap' }}>{notes}</div>
              </>
            )}
          </div>

          <div style={{ width: '30%' }}>
            {terms && (
              <>
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Terms</h4>
                <div style={{ whiteSpace: 'pre-wrap' }}>{terms}</div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
