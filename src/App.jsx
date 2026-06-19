import { useState, useRef } from 'react'
import html2pdf from 'html2pdf.js'
import './App.css'
import InvoiceFormSectionOne from './components/InvoiceFormSectionOne'
import InvoiceFormSectionTwo from './components/InvoiceFormSectionTwo'
import InvoiceFormSectionThree from './components/InvoiceFormSectionThree'
import InvoiceFormSectionFour from './components/InvoiceFormSectionFour'
import InvoiceFormSectionFive from './components/InvoiceFormSectionFive'
import InvoicePDFTemplate from './components/InvoicePDFTemplate'

function App() {
  const [invoiceData, setInvoiceData] = useState({
    logo: null,
    invoiceName: 'Invoice',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    dueTerms: 'Due on receipt',
    currency: 'USD',
    currencySymbol: '$',
    invoiceFrom: '',
    billTo: '',
    items: [{ id: 1, description: '', qty: 1, rate: 0, discount: 0, discountType: '%' }],
    globalDiscount: 0,
    globalDiscountType: '%',
    gstApplicable: false,
    shipping: 0,
    subtotal: 0,
    total: 0,
    paymentMethod: 'Bank Transfer',
    bankDetails: '',
    notes: '',
    terms: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef(null);

  const updateInvoiceData = (field, value) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateInvoice = () => {
    if (!pdfRef.current) return;
    
    setIsGenerating(true);
    
    const element = pdfRef.current;
    
    // Configure html2pdf options
    const opt = {
      margin:       0,
      filename:     `invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Temporarily display the element for capture
    const originalDisplay = element.parentElement.style.display;
    element.parentElement.style.display = 'block';

    html2pdf().set(opt).from(element).save().then(() => {
      // Hide it again
      element.parentElement.style.display = originalDisplay;
      setIsGenerating(false);
    });
  };

  return (
    <>
      <div className="invoice-header">
        <h1 className="text-gradient">AI Invoice Generator</h1>
        <p>Create professional invoices in seconds.</p>
      </div>
      
      <div className="invoice-container">
        <InvoiceFormSectionOne invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
        <InvoiceFormSectionTwo invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
        <InvoiceFormSectionThree invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
        <InvoiceFormSectionFour invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
        <InvoiceFormSectionFive invoiceData={invoiceData} updateInvoiceData={updateInvoiceData} />
        
        <div className="actions-container">
          <button 
            className="create-invoice-btn" 
            onClick={handleCreateInvoice}
            disabled={isGenerating}
            style={{ opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? 'Generating PDF...' : 'Create Invoice'}
          </button>
        </div>
      </div>

      {/* Hidden PDF Template for Capture */}
      <InvoicePDFTemplate invoiceData={invoiceData} contentRef={pdfRef} />
    </>
  )
}

export default App
