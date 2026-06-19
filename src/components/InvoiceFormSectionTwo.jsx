import './styles/InvoiceForm.css';

export default function InvoiceFormSectionTwo({ invoiceData, updateInvoiceData }) {
  return (
    <div className="glass-panel form-section section-two">
      <div className="form-layout section-two-layout">
        
        {/* Invoice From */}
        <div className="address-container">
          <div className="address-header">
            <h3 className="section-title">Invoice From</h3>
            <span className="address-subtitle">Your Business Details</span>
          </div>
          <textarea
            className="address-textarea"
            placeholder="Business Name,&#10;Address,&#10;Phone,&#10;Email,&#10;TAX ID, etc."
            value={invoiceData.invoiceFrom}
            onChange={(e) => updateInvoiceData('invoiceFrom', e.target.value)}
            rows="5"
          />
        </div>

        {/* Bill To */}
        <div className="address-container">
          <div className="address-header">
            <h3 className="section-title">Bill To</h3>
            <span className="address-subtitle">Client Details</span>
          </div>
          <textarea
            className="address-textarea"
            placeholder="Client/Business Name,&#10;Address,&#10;Phone,&#10;Email,&#10;TAX ID, etc."
            value={invoiceData.billTo}
            onChange={(e) => updateInvoiceData('billTo', e.target.value)}
            rows="5"
          />
        </div>

      </div>
    </div>
  );
}
