import { createContext, useContext, useMemo, useState } from 'react';

// Frontend-only placeholder. No requests are made anywhere here — this exists
// so pages/components have a real shape to code against. Swap the bodies of
// login/signup for real API calls once auth endpoints exist.
const AuthContext = createContext(null);
const STORAGE_KEY = 'arc_user_v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const api = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login: async ({ email }) => {
        // Placeholder: pretend success and store a minimal profile locally.
        const fakeUser = { name: email.split('@')[0], email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return fakeUser;
      },
      signup: async ({ name, email }) => {
        const fakeUser = { name, email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
        setUser(fakeUser);
        return fakeUser;
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
