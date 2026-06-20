import { useState, useRef, useEffect } from 'react'
import html2pdf from 'html2pdf.js'
import './App.css'
import InvoiceFormSectionOne from './components/InvoiceFormSectionOne'
import InvoiceFormSectionTwo from './components/InvoiceFormSectionTwo'
import InvoiceFormSectionThree from './components/InvoiceFormSectionThree'
import InvoiceFormSectionFour from './components/InvoiceFormSectionFour'
import InvoiceFormSectionFive from './components/InvoiceFormSectionFive'
import InvoicePDFTemplate from './components/InvoicePDFTemplate'

import Login from './components/Login'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'app', 'admin'
  const [userEmail, setUserEmail] = useState(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('invoice_user');
    if (savedUser) {
      setUserEmail(savedUser);
      setCurrentView('app');
    }
  }, []);

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
    gst: 0,
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

  const handleLogin = (email) => {
    setUserEmail(email);
    localStorage.setItem('invoice_user', email);
    setCurrentView('app');
  };

  const handleAdminLogin = () => {
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('invoice_user');
    setCurrentView('login');
  };

  const handleCreateInvoice = () => {
    if (!pdfRef.current) return;
    setIsGenerating(true);
    
    const element = pdfRef.current;
    const opt = {
      margin:       0,
      filename:     `invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    const originalDisplay = element.parentElement.style.display;
    element.parentElement.style.display = 'block';

    html2pdf().set(opt).from(element).save().then(() => {
      element.parentElement.style.display = originalDisplay;
      setIsGenerating(false);
    });
  };

  if (currentView === 'login') {
    return <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;
  }

  if (currentView === 'admin') {
    return <AdminDashboard onLogout={() => setCurrentView('login')} />;
  }

  // APP VIEW
  return (
    <>
      <div className="invoice-header" style={{ position: 'relative' }}>
        <h1 className="text-gradient">AI Invoice Generator</h1>
        <p>Create professional invoices in seconds.</p>
        
        <div style={{ position: 'absolute', top: 0, right: 0, textAlign: 'right' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '4px' }}>
            Logged in as: <strong style={{ color: '#f8fafc' }}>{userEmail}</strong>
          </div>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
            Logout
          </button>
        </div>
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
      <div style={{ display: 'none' }}>
        <InvoicePDFTemplate invoiceData={invoiceData} contentRef={pdfRef} />
      </div>
    </>
  )
}

export default App
