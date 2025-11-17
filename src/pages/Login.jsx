import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthAPI } from '../service/api';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken, setUser } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await AuthAPI.login(email, password);
      setToken(token);
      setUser(user);
      if (user?.role === 'admin') {
        const dest = from && from.startsWith('/admin') ? from : '/admin';
        nav(dest, { replace: true });
      } else {
        nav('/live', { replace: true });
      }
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[60vh] bg-[#0C0F14] text-white grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-300">Sign in to access the admin panel.</p>
        {error && <div className="mt-3 rounded-md bg-rose-500/10 p-2 text-sm text-rose-300">{error}</div>}
        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Email</span>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Password</span>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="mt-5 inline-flex w-full justify-center rounded-md bg-linear-to-r from-[#D90429] to-rose-600 px-4 py-2 font-semibold hover:from-rose-600 hover:to-[#D90429] disabled:opacity-60">{loading ? 'Signing in...' : 'Sign In'}</button>
        <p className="mt-3 text-xs text-gray-400">No account? <a href="/register" className="text-amber-300 hover:text-amber-200">Sign up</a></p>
      </form>
    </section>
  );
}
