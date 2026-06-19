import { useRef, useEffect, useState } from 'react';
import './styles/InvoiceForm.css';

export default function InvoiceFormSectionOne({ invoiceData, updateInvoiceData }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Update Due Date dynamically based on Issue Date and Payment Terms
  useEffect(() => {
    if (!invoiceData.invoiceDate) return;
    
    const issueDateObj = new Date(invoiceData.invoiceDate);
    let daysToAdd = 0;

    switch (invoiceData.dueTerms) {
      case 'NET 7': daysToAdd = 7; break;
      case 'NET 15': daysToAdd = 15; break;
      case 'NET 30': daysToAdd = 30; break;
      case 'NET 45': daysToAdd = 45; break;
      case 'NET 60': daysToAdd = 60; break;
      case 'Due on receipt': 
      default: daysToAdd = 0; break;
    }

    issueDateObj.setDate(issueDateObj.getDate() + daysToAdd);
    updateInvoiceData('dueDate', issueDateObj.toISOString().split('T')[0]);
  }, [invoiceData.invoiceDate, invoiceData.dueTerms]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInvoiceData('logo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = (e) => {
    e.stopPropagation();
    updateInvoiceData('logo', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (!invoiceData.logo && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    updateInvoiceData('currency', val);
    
    // Update the currency symbol accordingly
    let symbol = '$';
    switch(val) {
      case 'EUR': symbol = '€'; break;
      case 'GBP': symbol = '£'; break;
      case 'JPY': symbol = '¥'; break;
      case 'INR': symbol = '₹'; break;
      default: symbol = '$'; break;
    }
    updateInvoiceData('currencySymbol', symbol);
  };

  return (
    <div className="glass-panel form-section">
      <div className="form-layout">
        {/* Left Column: Logo Upload */}
        <div className="logo-upload-container">
          <div 
            className={`logo-dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleChange} 
              style={{ display: 'none' }} 
            />
            
            {invoiceData.logo ? (
              <div className="logo-preview-container">
                <img src={invoiceData.logo} alt="Company Logo" className="logo-preview" />
                <button className="remove-logo-btn" onClick={removeLogo} title="Remove Logo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="upload-text">Upload logo</p>
                <p className="upload-subtext">Supported formats: JPG, PNG, SVG</p>
                <p className="upload-subtext">Recommended size: 500px x 500px</p>
                <button className="upload-btn" onClick={(e) => { e.stopPropagation(); triggerFileSelect(); }}>Upload</button>
                <p className="upload-subtext mt-auto">Max upload size: 1 MB</p>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Invoice Details Grid */}
        <div className="invoice-details-container">
          <h3 className="section-title">Invoice Details</h3>
          <div className="details-grid">
            
            <div className="field-group">
              <label htmlFor="invoice-number">Invoice Number</label>
              <input 
                type="text" 
                id="invoice-number" 
                value={invoiceData.invoiceNumber}
                onChange={(e) => updateInvoiceData('invoiceNumber', e.target.value)}
                placeholder="INV-0001"
              />
            </div>
            
            <div className="field-group">
              <label htmlFor="payment-terms">Payment Terms</label>
              <select 
                id="payment-terms" 
                value={invoiceData.dueTerms}
                onChange={(e) => updateInvoiceData('dueTerms', e.target.value)}
              >
                <option value="Due on receipt">Due on receipt</option>
                <option value="NET 7">NET 7</option>
                <option value="NET 15">NET 15</option>
                <option value="NET 30">NET 30</option>
                <option value="NET 45">NET 45</option>
                <option value="NET 60">NET 60</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="issue-date">Issue Date</label>
              <input 
                type="date" 
                id="issue-date" 
                value={invoiceData.invoiceDate}
                onChange={(e) => updateInvoiceData('invoiceDate', e.target.value)}
              />
            </div>
            
            <div className="field-group">
              <label htmlFor="due-date">Due Date</label>
              <input 
                type="date" 
                id="due-date" 
                value={invoiceData.dueDate}
                onChange={(e) => updateInvoiceData('dueDate', e.target.value)}
              />
            </div>

            <div className="field-group">
              <label htmlFor="currency">Currency</label>
              <select 
                id="currency" 
                value={invoiceData.currency}
                onChange={handleCurrencyChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="field-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
                GST Applicable
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="gst-applicable"
                  checked={invoiceData.gstApplicable}
                  onChange={(e) => updateInvoiceData('gstApplicable', e.target.checked)}
                  style={{ display: 'none' }}
                />
                {/* Toggle Track */}
                <div style={{
                  position: 'relative',
                  width: '48px',
                  height: '26px',
                  borderRadius: '13px',
                  background: invoiceData.gstApplicable ? '#6366f1' : '#334155',
                  border: `1px solid ${invoiceData.gstApplicable ? '#6366f1' : '#475569'}`,
                  transition: 'background 0.3s, border-color 0.3s',
                  flexShrink: 0,
                  boxShadow: invoiceData.gstApplicable ? '0 0 8px rgba(99,102,241,0.5)' : 'none',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    width: '16px',
                    height: '16px',
                    background: '#ffffff',
                    borderRadius: '50%',
                    transition: 'transform 0.3s ease',
                    transform: invoiceData.gstApplicable ? 'translateX(22px)' : 'translateX(0px)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </div>
                {/* Label text */}
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: invoiceData.gstApplicable ? '#6366f1' : '#94a3b8',
                  transition: 'color 0.3s',
                }}>
                  {invoiceData.gstApplicable ? '18% GST Applicable' : 'GST Not Applicable'}
                </span>
              </label>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
