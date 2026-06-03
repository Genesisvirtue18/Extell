import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchTickets, updateTicketStatus } from '../services/api';
import { formatDate } from '../utils/date';

const TicketsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    const response = await fetchTickets({
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
    await updateTicketStatus(id, status);
    loadData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        subtitle="Monitor, filter, and resolve support enquiries."
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by email or category"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
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
          <p className="text-sm text-slate-500">Loading tickets...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Priority</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b last:border-0">
                    <td className="py-3 text-slate-700">{item.email}</td>
                    <td className="py-3 text-slate-700">{item.category}</td>
                    <td className="py-3 text-slate-700">{item.priority || 'normal'}</td>
                    <td className="py-3">
                      <select
                        value={item.status}
                        onChange={(event) => handleStatusChange(item._id, event.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
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

export default TicketsPage;
