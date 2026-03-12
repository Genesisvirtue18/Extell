import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { fetchDashboard } from '../services/api';
import { formatDate, formatMonthYear } from '../utils/date';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboard();
        setStats(response);
      } finally {
        setLoading(false);
      }
    };
    load();
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
      ) : (
        <>
         

          {/* Primary metrics row */}
          <div className="grid gap-4 lg:grid-cols-4">
            <StatCard label="Total Products" value={stats?.totalProducts || 0} />
            <StatCard label="Total Categories" value={stats?.totalCategories || 0} />
            <StatCard label="Support Tickets" value={stats?.totalTickets || 0} />
            <StatCard label="Latest Enquiries" value={stats?.latestTickets?.length || 0} helper="Last 5 tickets" />
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

          {/* Latest tickets */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
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
        </>
      )}
    </div>
  );
};

export default DashboardPage;
