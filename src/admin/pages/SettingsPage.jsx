import PageHeader from '../components/PageHeader';
import { useAdminAuth } from '../hooks/useAdminAuth';

const SettingsPage = () => {
  const { admin } = useAdminAuth();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Admin profile and authentication status." />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Name</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{admin?.name || 'Admin'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{admin?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Role</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{admin?.role || 'admin'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Created At</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
