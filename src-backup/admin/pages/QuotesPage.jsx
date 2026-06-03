import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchQuoteRequests, updateQuoteStatus } from '../services/api';
import { formatDate } from '../utils/date';

const STATUS_OPTIONS = ['new', 'contacted', 'quoted', 'closed'];

const QuotesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    const response = await fetchQuoteRequests({
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
    await updateQuoteStatus(id, status);
    loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quote Requests"
        subtitle="Track custom pricing requests from product pages."
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, or product"
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
          <p className="text-sm text-slate-500">Loading quote requests...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 text-slate-700">{item.fullName}</td>
                    <td className="py-3 text-slate-700">{item.email}</td>
                    <td className="py-3 text-slate-700">{item.companyName || '—'}</td>
                    <td className="py-3 text-slate-700">{item.productName || item.productSku || '—'}</td>
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

export default QuotesPage;

