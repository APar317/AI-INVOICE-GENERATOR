import { useEffect } from 'react';
import './styles/InvoiceForm.css';

export default function InvoiceFormSectionThree({ invoiceData, updateInvoiceData }) {
  const { items, globalDiscount, globalDiscountType, tax, shipping, subtotal, total, currencySymbol } = invoiceData;

  const generateId = () => Date.now() + Math.random();

  const handleAddItem = () => {
    updateInvoiceData('items', [...items, { id: generateId(), description: '', qty: 1, rate: 0, discount: 0, discountType: '%' }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      updateInvoiceData('items', items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    updateInvoiceData('items', items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Calculate Subtotal and Total whenever inputs change
  useEffect(() => {
    let newSubtotal = 0;

    items.forEach(item => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const discount = parseFloat(item.discount) || 0;
      
      let itemAmount = qty * rate;
      
      if (item.discountType === '%') {
        itemAmount -= itemAmount * (discount / 100);
      } else {
        itemAmount -= discount;
      }
      
      newSubtotal += Math.max(0, itemAmount);
    });

    updateInvoiceData('subtotal', newSubtotal);

    let calculatedTotal = newSubtotal;
    const gDiscount = parseFloat(globalDiscount) || 0;
    
    if (globalDiscountType === '%') {
      calculatedTotal -= calculatedTotal * (gDiscount / 100);
    } else {
      calculatedTotal -= gDiscount;
    }
    
    calculatedTotal = Math.max(0, calculatedTotal);

    const taxVal = parseFloat(tax) || 0;
    const taxAmount = calculatedTotal * (taxVal / 100);
    calculatedTotal += taxAmount;

    const shippingVal = parseFloat(shipping) || 0;
    calculatedTotal += shippingVal;

    updateInvoiceData('total', calculatedTotal);
  }, [items, globalDiscount, globalDiscountType, tax, shipping]);

  const formatCurrency = (amount) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
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

  return (
    <div className="glass-panel form-section section-three">
      <h3 className="section-title">Items</h3>
      
      <div className="items-table-container">
        <div className="items-header-row">
          <div className="header-desc">Item Description</div>
          <div className="header-qty">Qty</div>
          <div className="header-rate">Rate</div>
          <div className="header-discount">Discount</div>
          <div className="header-amount">Amount</div>
        </div>

        {items.map((item) => (
          <div className="item-row" key={item.id}>
            <div className="item-desc">
              <input 
                type="text" 
                placeholder="Item description" 
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              />
            </div>
            <div className="item-qty">
              <input 
                type="number" 
                min="0"
                step="1"
                value={item.qty}
                onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
              />
            </div>
            <div className="item-rate">
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={item.rate}
                onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
              />
            </div>
            <div className="item-discount">
              <div className="discount-input-group">
                <input 
                  type="number" 
                  min="0"
                  step="0.01"
                  value={item.discount}
                  onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                />
                <select 
                  value={item.discountType}
                  onChange={(e) => updateItem(item.id, 'discountType', e.target.value)}
                >
                  <option value="%">%</option>
                  <option value="flat">{currencySymbol}</option>
                </select>
              </div>
            </div>
            <div className="item-amount">
              <span>{formatCurrency(getItemAmount(item))}</span>
              {items.length > 1 && (
                <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)} title="Remove Item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="add-item-btn" onClick={handleAddItem}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Item
      </button>

      <div className="summary-section">
        <div className="summary-row">
          <span className="summary-label">Subtotal:</span>
          <span className="summary-value font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="summary-row">
          <span className="summary-label">Discount:</span>
          <div className="summary-input-group">
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={globalDiscount}
              onChange={(e) => updateInvoiceData('globalDiscount', e.target.value)}
            />
            <select 
              value={globalDiscountType}
              onChange={(e) => updateInvoiceData('globalDiscountType', e.target.value)}
            >
              <option value="%">%</option>
              <option value="flat">{currencySymbol}</option>
            </select>
          </div>
        </div>

        <div className="summary-row">
          <span className="summary-label">Tax:</span>
          <div className="summary-input-group simple">
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={tax}
              onChange={(e) => updateInvoiceData('tax', e.target.value)}
            />
            <span className="static-addon">%</span>
          </div>
        </div>

        <div className="summary-row">
          <span className="summary-label">Shipping:</span>
          <div className="summary-input-group simple">
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={shipping}
              onChange={(e) => updateInvoiceData('shipping', e.target.value)}
            />
            <span className="static-addon">{currencySymbol}</span>
          </div>
        </div>

        <div className="summary-row total-row">
          <span className="summary-label">Total:</span>
          <span className="summary-value total-value">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
