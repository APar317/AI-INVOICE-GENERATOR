import { useEffect } from 'react';

export default function InvoiceFormSectionThree({ invoiceData, updateInvoiceData }) {
  const {
    items, globalDiscount, globalDiscountType,
    shipping, subtotal, total, currencySymbol,
    gstApplicable, gst
  } = invoiceData;

  const generateId = () => Date.now() + Math.random();

  const handleAddItem = () => {
    updateInvoiceData('items', [
      ...items,
      { id: generateId(), description: '', qty: 1, rate: 0, discount: 0, discountType: '%' }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      updateInvoiceData('items', items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    updateInvoiceData('items', items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  useEffect(() => {
    let newSubtotal = 0;
    items.forEach(item => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      let amount = qty * rate;
      if (item.discountType === '%') {
        amount -= amount * (discount / 100);
      } else {
        amount -= discount;
      }
      newSubtotal += Math.max(0, amount);
    });
    updateInvoiceData('subtotal', newSubtotal);

    let afterDiscount = newSubtotal;
    const gDiscount = parseFloat(globalDiscount) || 0;
    if (globalDiscountType === '%') {
      afterDiscount -= afterDiscount * (gDiscount / 100);
    } else {
      afterDiscount -= gDiscount;
    }
    afterDiscount = Math.max(0, afterDiscount);

    const gstAmount = gstApplicable ? parseFloat((afterDiscount * 0.18).toFixed(2)) : 0;
    updateInvoiceData('gst', gstAmount);

    const shippingVal = parseFloat(shipping) || 0;
    updateInvoiceData('total', parseFloat((afterDiscount + gstAmount + shippingVal).toFixed(2)));
  }, [items, globalDiscount, globalDiscountType, shipping, gstApplicable]);

  const fmt = (n) => `${currencySymbol}${(parseFloat(n) || 0).toFixed(2)}`;

  const getItemAmount = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const discount = parseFloat(item.discount) || 0;
    let amount = qty * rate;
    if (item.discountType === '%') {
      amount -= amount * (discount / 100);
    } else {
      amount -= discount;
    }
    return Math.max(0, amount);
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.sectionTitle}>Items</h3>

      {/* ── Table Header ── */}
      <div style={styles.tableHeader}>
        <div style={{ ...styles.col, flex: 3 }}>Description</div>
        <div style={{ ...styles.col, flex: 1, textAlign: 'center' }}>Qty</div>
        <div style={{ ...styles.col, flex: 1.2, textAlign: 'right' }}>Rate</div>
        <div style={{ ...styles.col, flex: 1.5, textAlign: 'center' }}>Discount</div>
        <div style={{ ...styles.col, flex: 1.2, textAlign: 'right' }}>Amount</div>
      </div>

      {/* ── Item Rows ── */}
      {items.map((item) => (
        <div key={item.id} style={styles.itemRow}>
          {/* Description */}
          <div style={{ flex: 3 }}>
            <input
              type="text"
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Qty */}
          <div style={{ flex: 1 }}>
            <input
              type="number"
              min="0"
              step="1"
              value={item.qty}
              onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
              style={{ ...styles.input, textAlign: 'center' }}
            />
          </div>

          {/* Rate */}
          <div style={{ flex: 1.2 }}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.rate}
              onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
              style={{ ...styles.input, textAlign: 'right' }}
            />
          </div>

          {/* Discount — input + dropdown INLINE */}
          <div style={{ flex: 1.5, display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.discount}
              onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
              style={{ ...styles.input, flex: 2, textAlign: 'center' }}
            />
            <select
              value={item.discountType}
              onChange={(e) => updateItem(item.id, 'discountType', e.target.value)}
              style={{ ...styles.select, flex: 1 }}
            >
              <option value="%">%</option>
              <option value="flat">{currencySymbol}</option>
            </select>
          </div>

          {/* Amount + Remove */}
          <div style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: '#f8fafc' }}>{fmt(getItemAmount(item))}</span>
            {items.length > 1 && (
              <button
                onClick={() => handleRemoveItem(item.id)}
                title="Remove item"
                style={styles.removeBtn}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}

      {/* ── Add Item Button ── */}
      <button onClick={handleAddItem} style={styles.addItemBtn}>
        + Add Item
      </button>

      {/* ── Summary Section ── */}
      <div style={styles.summaryWrapper}>
        <div style={styles.summaryBox}>

          {/* Subtotal */}
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryValue}>{fmt(subtotal)}</span>
          </div>

          {/* Global Discount */}
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Discount</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={globalDiscount}
                onChange={(e) => updateInvoiceData('globalDiscount', e.target.value)}
                style={{ ...styles.input, width: '80px', textAlign: 'center' }}
              />
              <select
                value={globalDiscountType}
                onChange={(e) => updateInvoiceData('globalDiscountType', e.target.value)}
                style={{ ...styles.select, width: '64px' }}
              >
                <option value="%">%</option>
                <option value="flat">{currencySymbol}</option>
              </select>
            </div>
          </div>

          <div style={styles.divider} />

          {/* GST Toggle */}
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>GST (18%)</span>
            <label style={styles.toggleWrap}>
              <input
                type="checkbox"
                checked={gstApplicable}
                onChange={(e) => updateInvoiceData('gstApplicable', e.target.checked)}
                style={{ display: 'none' }}
              />
              {/* Track */}
              <div style={{
                ...styles.toggleTrack,
                background: gstApplicable ? '#6366f1' : '#334155',
                borderColor: gstApplicable ? '#6366f1' : '#475569',
              }}>
                {/* Thumb */}
                <div style={{
                  ...styles.toggleThumb,
                  transform: gstApplicable ? 'translateX(18px)' : 'translateX(0px)',
                }} />
              </div>
              <span style={{
                ...styles.toggleText,
                color: gstApplicable ? '#6366f1' : '#94a3b8',
                fontWeight: gstApplicable ? 600 : 400,
              }}>
                {gstApplicable ? 'Applicable' : 'Not Applicable'}
              </span>
            </label>
          </div>

          {/* GST Amount (visible only when ON) */}
          {gstApplicable && (
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>GST Amount</span>
              <span style={{ ...styles.summaryValue, color: '#10b981' }}>{fmt(gst)}</span>
            </div>
          )}

          <div style={styles.divider} />

          {/* Shipping */}
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Shipping</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shipping}
                onChange={(e) => updateInvoiceData('shipping', e.target.value)}
                style={{ ...styles.input, width: '100px', textAlign: 'right' }}
              />
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{currencySymbol}</span>
            </div>
          </div>

          {/* Total */}
          <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>{fmt(total)}</span>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Inline Styles ── */
const styles = {
  card: {
    background: '#1a1d27',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '2rem',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: '1.5rem',
  },
  tableHeader: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '10px',
    borderBottom: '1px solid #334155',
    marginBottom: '4px',
  },
  col: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  itemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  input: {
    width: '100%',
    background: '#252936',
    border: '1px solid #334155',
    color: '#f8fafc',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxSizing: 'border-box',
  },
  select: {
    background: '#252936',
    border: '1px solid #334155',
    color: '#f8fafc',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter, system-ui, sans-serif',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 6px center',
    backgroundSize: '14px',
    paddingRight: '28px',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '4px 6px',
    borderRadius: '4px',
    lineHeight: 1,
  },
  addItemBtn: {
    alignSelf: 'flex-start',
    marginTop: '14px',
    background: 'transparent',
    border: 'none',
    color: '#6366f1',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '6px 0',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  summaryWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  summaryBox: {
    width: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    fontWeight: 500,
  },
  summaryValue: {
    fontSize: '0.9rem',
    color: '#f8fafc',
    fontWeight: 600,
  },
  divider: {
    height: '1px',
    background: '#334155',
    margin: '4px 0',
  },
  toggleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  toggleTrack: {
    position: 'relative',
    width: '42px',
    height: '24px',
    borderRadius: '12px',
    border: '1px solid',
    transition: 'background 0.3s, border-color 0.3s',
    flexShrink: 0,
  },
  toggleThumb: {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '16px',
    height: '16px',
    background: '#fff',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
  },
  toggleText: {
    fontSize: '0.85rem',
    transition: 'color 0.3s',
    whiteSpace: 'nowrap',
  },
  totalRow: {
    borderTop: '2px solid #334155',
    paddingTop: '12px',
    marginTop: '4px',
  },
  totalLabel: {
    fontSize: '1.1rem',
    color: '#f8fafc',
    fontWeight: 700,
  },
  totalValue: {
    fontSize: '1.3rem',
    color: '#6366f1',
    fontWeight: 700,
  },
};
