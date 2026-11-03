'use client';

import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { fetchChatbotLeads } from '../services/api';
import { formatDate } from '../utils/date';

const getLeadRows = (value, depth = 0) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object' || depth > 4) return null;
  for (const key of ['leads', 'chatbotLeads', 'items', 'results', 'records', 'docs', 'queries', 'data']) {
    const rows = getLeadRows(value[key], depth + 1);
    if (rows) return rows;
  }
  return null;
};

export default function ChatbotLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchChatbotLeads({ page: 1, limit: 200 });
      if (response?.success === false) throw new Error(response?.message || 'Unable to load chatbot leads.');
      setLeads(getLeadRows(response) || []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || loadError?.message || 'Unable to load chatbot leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
    const timer = window.setInterval(loadLeads, 30000);
    return () => window.clearInterval(timer);
  }, [loadLeads]);

  return (
    <div className="space-y-6">
      <PageHeader title="Chatbot Leads" subtitle="Review visitor questions and the assistant’s replies." />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Presales conversations</h2>
            <p className="mt-1 text-xs text-slate-500">Name, email, question, and chatbot response.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">{leads.length} records</span>
            <button type="button" onClick={loadLeads} disabled={loading} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {error ? <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
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
              {leads.map((lead, index) => (
                <tr key={lead._id || lead.id || `${lead.email}-${lead.createdAt}-${index}`} className="border-b align-top last:border-0">
                  <td className="py-4 pr-4 font-medium text-slate-800">{lead.fullName || lead.name || '-'}</td>
                  <td className="py-4 pr-4 text-slate-600">{lead.email || '-'}</td>
                  <td className="max-w-sm py-4 pr-4 whitespace-normal text-slate-700">{lead.question || '-'}</td>
                  <td className="max-w-lg py-4 pr-4 whitespace-normal text-slate-600">{lead.answer || '-'}</td>
                  <td className="whitespace-nowrap py-4 text-slate-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
              {!loading && !error && leads.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">No chatbot leads recorded yet.</td></tr>
              ) : null}
              {loading && leads.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-slate-400">Loading chatbot leads…</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
