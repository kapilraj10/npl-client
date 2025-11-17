import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../service/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await AuthAPI.register(email, password);
      setSuccess('Account created. You can now log in.');
      setTimeout(() => nav('/login', { replace: true }), 1000);
    } catch (e) {
      try {
        const msg = e.message ? JSON.parse(e.message).message : 'Registration failed';
        setError(msg);
      } catch {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[60vh] bg-[#0C0F14] text-white grid place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-xl font-semibold">Create Account</h1>
        <p className="mt-1 text-sm text-gray-300">Register to access personalized features.</p>
        {error && <div className="mt-3 rounded-md bg-rose-500/10 p-2 text-sm text-rose-300">{error}</div>}
        {success && <div className="mt-3 rounded-md bg-emerald-500/10 p-2 text-sm text-emerald-300">{success}</div>}
        <div className="mt-4 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Email</span>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Password</span>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-gray-300">Confirm Password</span>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2" />
          </label>
        </div>
        <button type="submit" disabled={loading} className="mt-5 inline-flex w-full justify-center rounded-md bg-linear-to-r from-[#D90429] to-rose-600 px-4 py-2 font-semibold hover:from-rose-600 hover:to-[#D90429] disabled:opacity-60">{loading ? 'Creating...' : 'Sign Up'}</button>
      </form>
    </section>
  );
}
