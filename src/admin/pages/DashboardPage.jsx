'use client';

import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { fetchDashboard, fetchChatbotLeads } from '../services/api';
import { formatDate, formatMonthYear } from '../utils/date';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [chatbotQueries, setChatbotQueries] = useState([]);
  const [chatbotQueryError, setChatbotQueryError] = useState('');
  const [chatbotQueryLoading, setChatbotQueryLoading] = useState(false);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError('');
        const response = await fetchDashboard();
        const payload = response?.data ?? response?.stats ?? response;
        setStats(payload || null);
      } catch (error) {
        setStats(null);
        setLoadError(error?.response?.data?.message || error?.message || 'Unable to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadChatbotQueries = async () => {
    setChatbotQueryLoading(true);
    setChatbotQueryError('');
    try {
      const response = await fetchChatbotLeads({ page: 1, limit: 200 });
      const findRows = (value, depth = 0) => {
        if (Array.isArray(value)) return value;
        if (!value || typeof value !== 'object' || depth > 4) return null;
        for (const key of ['leads', 'chatbotLeads', 'items', 'results', 'records', 'docs', 'queries', 'data']) {
          const rows = findRows(value[key], depth + 1);
          if (rows) return rows;
        }
        return null;
      };
      if (response?.success === false) throw new Error(response?.message || 'Chatbot leads request failed.');
      setChatbotQueries(findRows(response) || []);
    } catch (error) {
      setChatbotQueryError(error?.response?.data?.message || error?.message || 'Unable to load chatbot queries.');
    } finally {
      setChatbotQueryLoading(false);
    }
  };

  useEffect(() => {
    loadChatbotQueries();
    const refreshTimer = window.setInterval(loadChatbotQueries, 30000);
    return () => window.clearInterval(refreshTimer);
  }, []);

  const categoryData = useMemo(() => stats?.categoryStats || [], [stats]);
  const monthlyData = useMemo(() => {
    if (!stats?.monthlyTickets) return [];
    return [...stats.monthlyTickets]
      .map((item) => ({
        label: formatMonthYear(item.year, item.month),
        count: item.count
      }))
      .reverse();
  }, [stats]);

  return (
    <div className="space-y-6 bg-[#f5f6f8] -m-6 p-6 rounded-3xl">
      <PageHeader title="Dashboard Overview" subtitle="Track products, categories, and support trends." />

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
          Loading dashboard metrics...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {loadError}
        </div>
      ) : (
        <>
          {/* Primary metrics row */}
          <div className="grid gap-4 lg:grid-cols-5">
            <StatCard label="Total Products" value={stats?.totalProducts || 0} />
            <StatCard label="Total Categories" value={stats?.totalCategories || 0} />
            <StatCard label="Support Tickets" value={stats?.totalTickets || 0} />
            <StatCard label="Quote Requests" value={stats?.totalQuotes || 0} helper="Open quotes" />
            <StatCard label="Warranty Reg." value={stats?.totalWarranties || 0} helper="Active records" />
          </div>

          {/* Charts row */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Products per Category</h3>
                <span className="text-xs text-slate-400">Live</span>
              </div>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} barSize={22}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" />
                    <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f172a" radius={[14, 14, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Tickets Created per Month</h3>
                <span className="text-xs text-slate-400">12 mo</span>
              </div>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#e75a3c" strokeWidth={2.4} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Tools</h3>
                <p className="text-xs text-slate-500">Quick access to customer-facing calculators.</p>
              </div>
              <a
                href="/ups-calculator"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Open UPS Calculator
              </a>
            </div>
          </div>

          {/* Latest tickets */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Latest Support Tickets</h3>
              <span className="text-xs text-slate-400">{stats?.latestTickets?.length || 0} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.latestTickets || []).map((ticket) => (
                    <tr key={ticket._id} className="border-b last:border-0">
                      <td className="py-3 text-slate-700">{ticket.email}</td>
                      <td className="py-3 text-slate-700">{ticket.category}</td>
                      <td className="py-3 text-slate-700">{ticket.status}</td>
                      <td className="py-3 text-slate-500">{formatDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chatbot presales questions */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Chatbot Queries</h3>
                <p className="mt-1 text-xs text-slate-500">Visitor details and product questions captured by the sales assistant.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{chatbotQueries.length} records</span>
                <button type="button" onClick={loadChatbotQueries} disabled={chatbotQueryLoading} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  {chatbotQueryLoading ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>
            </div>
            {chatbotQueryError ? <p className="mb-3 text-sm text-rose-600">{chatbotQueryError}</p> : null}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Question</th>
                    <th className="pb-3 pr-4">Answer</th>
                    <th className="pb-3">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {chatbotQueries.map((query) => (
                    <tr key={query._id} className="border-b last:border-0">
                      <td className="py-3 pr-4 text-slate-700">{query.name || query.fullName || '-'}</td>
                      <td className="py-3 pr-4 text-slate-700">{query.email || '-'}</td>
                      <td className="max-w-xl py-3 pr-4 text-slate-600">
                        <span className="line-clamp-2">{query.question || '-'}</span>
                      </td>
                      <td className="max-w-xl py-3 pr-4 text-slate-600"><span className="line-clamp-2">{query.answer || '-'}</span></td>
                      <td className="whitespace-nowrap py-3 text-slate-500">{formatDate(query.createdAt)}</td>
                    </tr>
                  ))}
                  {!chatbotQueries.length && !chatbotQueryError && !chatbotQueryLoading ? (
                    <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-400">No chatbot questions recorded yet.</td></tr>
                  ) : null}
                  {!chatbotQueries.length && chatbotQueryLoading ? <tr><td colSpan={5} className="py-6 text-center text-sm text-slate-400">Loading chatbot questions…</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest quote requests */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Latest Quote Requests</h3>
              <span className="text-xs text-slate-400">{stats?.latestQuotes?.length || 0} items</span>
            </div>
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
                  {(stats?.latestQuotes || []).map((quote) => (
                    <tr key={quote._id} className="border-b last:border-0">
                      <td className="py-3 text-slate-700">{quote.fullName}</td>
                      <td className="py-3 text-slate-700">{quote.email}</td>
                      <td className="py-3 text-slate-700">{quote.companyName || '-'}</td>
                      <td className="py-3 text-slate-700">{quote.productName || '-'}</td>
                      <td className="py-3 text-slate-700">{quote.status}</td>
                      <td className="py-3 text-slate-500">{formatDate(quote.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Latest warranty registrations */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Recent Warranty Registrations</h3>
              <span className="text-xs text-slate-400">{stats?.latestWarranties?.length || 0} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Invoice</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.latestWarranties || []).map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="py-3 text-slate-700">{item.productName}</td>
                      <td className="py-3 text-slate-700">{item.customerName || '-'}</td>
                      <td className="py-3 text-slate-700">{item.invoiceId}</td>
                      <td className="py-3 text-slate-700">{item.status}</td>
                      <td className="py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;


