import { createContext, useContext, useState } from 'react';
import { crudApi } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login (email, password, userType) {
    setLoading(true);
    setError(null);

    try {
      const response = await crudApi(`/users/${userType}/login`, { email, password });
      setUser(response.data.user);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout () {
  }

  const value = {
    user,
    loading,
    error,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth () {
  return useContext(AuthContext);
}
