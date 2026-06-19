import { useState } from 'react';
import './styles/InvoiceForm.css';

export default function InvoiceFormSectionFive({ invoiceData, updateInvoiceData }) {
  return (
    <div className="glass-panel form-section section-five" style={{ marginTop: '2rem' }}>
      <div className="section-two-layout">
        <div className="address-container">
          <div className="address-header">
            <h3 className="section-title" style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Notes</h3>
          </div>
          <textarea
            className="address-textarea"
            placeholder="Notes to be displayed on the invoice"
            value={invoiceData.notes}
            onChange={(e) => updateInvoiceData('notes', e.target.value)}
            rows="4"
          />
        </div>

        <div className="address-container">
          <div className="address-header">
            <h3 className="section-title" style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Terms</h3>
          </div>
          <textarea
            className="address-textarea"
            placeholder="Terms and conditions for this invoice"
            value={invoiceData.terms}
            onChange={(e) => updateInvoiceData('terms', e.target.value)}
            rows="4"
          />
        </div>
      </div>
    </div>
  );
}
