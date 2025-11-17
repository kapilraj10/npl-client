import React, { useEffect, useMemo, useState } from 'react';
import AuthContext from './AuthContext';

const TOKEN_KEY = 'npl_token_v1';
const USER_KEY = 'npl_user_v1';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
  });

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY);
  }, [user]);

  const value = useMemo(() => ({ token, setToken, user, setUser, logout: () => { setToken(null); setUser(null); } }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
