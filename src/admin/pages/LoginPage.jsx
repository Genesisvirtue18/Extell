import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      await login(values);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Admin Portal</p>
            <p className="text-4xl font-semibold leading-tight text-gray-400">Manage products, content, and support tickets.</p>
            <p className="text-sm text-gray-400">
              Secure access for Extell Systems administrators. Use your admin credentials to continue.
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Role-based access for admins.</li>
              <li>• Encrypted sessions & multi-factor ready.</li>
              <li>• Centralized dashboard for updates.</li>
            </ul>
          </div>
          <div className="w-full rounded-2xl bg-white/5 p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-300">Secure</span>
            </div>
            <p className="text-sm text-gray-300">Enter your admin email and password to continue.</p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="block text-sm">
                <span className="text-gray-300">Email</span>
                <input
                  type="email"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="admin@extellsystems.com"
                  {...register('email', { required: true })}
                />
                {errors.email ? <p className="mt-1 text-xs text-red-300">Email is required.</p> : null}
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Password</span>
                <input
                  type="password"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="••••••••"
                  {...register('password', { required: true })}
                />
                {errors.password ? <p className="mt-1 text-xs text-red-300">Password is required.</p> : null}
              </label>
              {error ? <p className="text-sm text-red-300">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-emerald-500/30 transition hover:-trangray-y-[1px] hover:bg-emerald-400 disabled:trangray-y-0 disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-xs text-gray-400">Access restricted to authorized Extell admins.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
