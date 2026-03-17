import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';
import supportBackground from '../assets/support-background.png';
import warrantyImage from '../assets/warranty.jpeg';
import { submitWarrantyRegistration } from '../lib/api';

const initialForm = {
  customerName: '',
  productName: '',
  mobile: '',
  email: '',
  invoiceId: '',
  serialNumber: '',
  purchaseDate: '',
  notes: ''
};

function WarrantyPage() {
  const { theme = 'light' } = useOutletContext() || {};
  const isLight = theme === 'light';
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.productName || !form.mobile || !form.invoiceId) {
      setStatus({ type: 'error', message: 'Product name, mobile number, and invoice ID are required.' });
      return;
    }

    try {
      setSubmitting(true);
      await submitWarrantyRegistration(form);
      setStatus({ type: 'success', message: 'Registration saved. Our team will verify and email your warranty status.' });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: 'error', message: error?.message || 'Unable to submit warranty registration.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 ml-5">
        <div
          className="relative flex items-center justify-center p-6 lg:p-12 rounded-2xl"
          style={{
            backgroundImage: `url(${warrantyImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <div className={`absolute inset-0 ${isLight ? 'bg-white/75' : 'bg-gray-950/60'}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/10 to-gray-900/50" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-200/80">Extell Care</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">Product Warranty Registration</h1>
              <p className={`mt-4 max-w-lg text-base ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                Activate protection in under a minute. Your invoice and product details help us verify eligibility,
                provide faster replacements, and keep you updated on coverage milestones.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
              <ShieldCheck className="text-red-200" size={26} />
              <div>
                <p className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-gray-300'}`}>Coverage Includes</p>
                <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>Remote diagnostics, advance replacement, priority repair.</p>
              </div>
            </div>
          </div>
        </div>

      
          <div className="ml-5 relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-500">Warranty Desk</p>
              <h2 className="text-2xl font-bold text-gray-900">Register your product</h2>
              <p className="text-sm text-gray-600">
                Add your invoice ID and contact so we can verify coverage. We will confirm registration within one
                business day.
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600">
                <PhoneCall size={16} className="text-red-500" />
                Need help? Call support: <span className="font-semibold text-gray-900 ml-1">+1 365 889 5555</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Product Name *</label>
                  <input
                    name="productName"
                    value={form.productName}
                    onChange={handleChange}
                    placeholder="e.g., Galaxy Online UPS 3kVA"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Invoice ID *</label>
                  <input
                    name="invoiceId"
                    value={form.invoiceId}
                    onChange={handleChange}
                    placeholder="Invoice / Bill number"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Customer Name</label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Email (optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Mobile No *</label>
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile number"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Purchase Date</label>
                  <input
                    type="date"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Serial Number</label>
                  <input
                    name="serialNumber"
                    value={form.serialNumber}
                    onChange={handleChange}
                    placeholder="Device serial (optional)"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-800">Notes</label>
                  <input
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Any remarks"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {status.message ? (
                <div
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  {status.message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:shadow-red-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    
  );
}

export default WarrantyPage;
