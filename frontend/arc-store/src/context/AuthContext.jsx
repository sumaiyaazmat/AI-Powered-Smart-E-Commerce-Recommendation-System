import { createContext, useContext, useMemo, useState } from 'react';
import { apiRequest } from '../services/api';

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

      // ============================
      // LOGIN
      // ============================
      login: async ({ email, password }) => {
        const data = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const loggedInUser = {
          customerId: data.Customer_ID,
          name: data.full_name,
          email: data.email,
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);

        return loggedInUser;
      },

      // ============================
      // SIGNUP
      // ============================
      signup: async ({ name, email, password }) => {
        const data = await apiRequest('/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            full_name: name,
            email,
            password,
          }),
        });

        const newUser = {
          customerId: data.Customer_ID,
          name: data.full_name,
          email: data.email,
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(newUser)
        );

        setUser(newUser);

        return newUser;
      },

      // ============================
      // LOGOUT
      // ============================
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={api}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);