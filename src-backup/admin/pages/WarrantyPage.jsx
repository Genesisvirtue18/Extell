import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchWarrantyRegistrations, updateWarrantyStatus } from '../services/api';
import { formatDate } from '../utils/date';

const STATUS_OPTIONS = ['pending', 'in-progress', 'approved', 'rejected'];

const WarrantyPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    const response = await fetchWarrantyRegistrations({
      q: search || undefined,
      status: statusFilter || undefined
    });
    setItems(response.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateWarrantyStatus(id, status);
    loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warranty Registrations"
        subtitle="Track warranty activations and verify invoice submissions."
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product, invoice, customer, or mobile"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={loadData}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Apply
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">Loading warranty registrations...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Mobile</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 text-slate-700">{item.productName}</td>
                    <td className="py-3 text-slate-700">{item.customerName || '—'}</td>
                    <td className="py-3 text-slate-700">{item.invoiceId}</td>
                    <td className="py-3 text-slate-700">{item.mobile}</td>
                    <td className="py-3">
                      <select
                        value={item.status}
                        onChange={(event) => handleStatusChange(item._id, event.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarrantyPage;
