'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../hooks/useAdminAuth';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAdminAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      await login(values);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (event) => {
    event.preventDefault();
    try {
      setResetLoading(true);
      setResetError('');
      setResetMessage('');

      if (newPassword !== confirmNewPassword) {
        setResetError('New password and confirmation do not match.');
        return;
      }
      if (newPassword.length < 8) {
        setResetError('New password must be at least 8 characters long.');
        return;
      }

      const email = document.querySelector('input[type="email"]')?.value?.trim();
      if (!email) {
        setResetError('Enter your admin email in the login form first.');
        return;
      }

      const loginResponse = await login({ email, password: oldPassword });
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://extell-backend.onrender.com';
      const response = await fetch(`${apiBaseUrl}/api/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loginResponse.token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Password reset failed.');

      setResetMessage(data.message || 'Password updated successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setResetError(err?.response?.data?.message || err.message || 'Password reset failed.');
    } finally {
      setResetLoading(false);
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
              <li>o Role-based access for admins.</li>
              <li>o Encrypted sessions & multi-factor ready.</li>
              <li>o Centralized dashboard for updates.</li>
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
                <div className="relative mt-2">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 pr-12 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="oooooooo"
                    {...register('password', { required: true })}
                  />
                  <button type="button" onClick={() => setShowLoginPassword((visible) => !visible)} aria-label={showLoginPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                      <circle cx="12" cy="12" r="3" />
                      {showLoginPassword ? <path strokeLinecap="round" d="m4 4 16 16" /> : null}
                    </svg>
                  </button>
                </div>
                {errors.password ? <p className="mt-1 text-xs text-red-300">Password is required.</p> : null}
              </label>
              <button
                type="button"
                onClick={() => { setShowResetForm(true); setResetError(''); setResetMessage(''); }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Reset password
              </button>
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

      {showResetForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" role="dialog" aria-modal="true" aria-labelledby="reset-password-title">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 id="reset-password-title" className="text-xl font-semibold">Reset password</h2>
              <button type="button" onClick={() => setShowResetForm(false)} className="text-gray-400 hover:text-white" aria-label="Close reset password form">✕</button>
            </div>
            <form className="space-y-4" onSubmit={onResetPassword}>
              <label className="block text-sm">
                <span className="text-gray-300">Enter your old password</span>
                <div className="relative mt-2">
                  <input type={showOldPassword ? 'text' : 'password'} required autoComplete="current-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 pr-12 outline-none focus:border-blue-400" />
                  <button type="button" onClick={() => setShowOldPassword((visible) => !visible)} aria-label={showOldPassword ? 'Hide old password' : 'Show old password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" />{showOldPassword ? <path strokeLinecap="round" d="m4 4 16 16" /> : null}</svg>
                  </button>
                </div>
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Create new password</span>
                <div className="relative mt-2">
                  <input type={showNewPassword ? 'text' : 'password'} required minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 pr-12 outline-none focus:border-blue-400" />
                  <button type="button" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? 'Hide new password' : 'Show new password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" />{showNewPassword ? <path strokeLinecap="round" d="m4 4 16 16" /> : null}</svg>
                  </button>
                </div>
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Confirm new password</span>
                <div className="relative mt-2">
                  <input type={showConfirmPassword ? 'text' : 'password'} required autoComplete="new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 pr-12 outline-none focus:border-blue-400" />
                  <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" />{showConfirmPassword ? <path strokeLinecap="round" d="m4 4 16 16" /> : null}</svg>
                  </button>
                </div>
              </label>
              {resetError ? <p className="text-sm text-red-300">{resetError}</p> : null}
              {resetMessage ? <p className="text-sm text-green-300">{resetMessage}</p> : null}
              <button type="submit" disabled={resetLoading} className="w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-70">
                {resetLoading ? 'Updating password...' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LoginPage;


