import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Briefcase,
  FolderDown,
  LifeBuoy,
  FileText,
  Calculator,
  ShieldCheck,
  Settings,
  LogOut,
  Users
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/solutions', label: 'Solutions', icon: Layers },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/resources', label: 'Resources', icon: FolderDown },
  { to: '/admin/quotes', label: 'Quotes', icon: FileText },
  { to: '/admin/tickets', label: 'Tickets', icon: LifeBuoy },
  { to: '/admin/warranties', label: 'Warranties', icon: ShieldCheck },
 { to: '/admin/ups-dashboard', label: 'UPS Dashboard', icon: Calculator },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex">
        <aside className="min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-6 hidden md:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin Panel</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Extell Systems</h2>
          </div>
          <nav className="mt-8 flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? 'bg-[#ed2125] text-white' : 'text-slate-600 hover:bg-red-100'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <button
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome</p>
              <p className="text-lg font-semibold text-slate-900">{admin?.name || 'Admin'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">{admin?.email || ''}</p>
              <p className="text-xs text-slate-500">Role: {admin?.role || 'admin'}</p>
            </div>
          </header>

          <nav className="lg:hidden border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        isActive ? 'border-slate-900 bg-red-900 text-white' : 'border-slate-200 text-slate-600 bg-white'
                      }`
                    }
                  >
                    <Icon size={14} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;





