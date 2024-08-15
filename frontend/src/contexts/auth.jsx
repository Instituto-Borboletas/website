import { createContext, useContext, useEffect, useState } from 'react';

import { crudApi } from '../utils/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser () {
    setIsLoading(true);
    try {
      const response = await crudApi('/users/me');
      setUser(response.data);
    } catch (err) {
      setUser(null);

      if (err.response.status === 401) {
        return;
      }

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function login (email, password) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await crudApi.post(`/users/login`, { email, password });
      setUser(response.data);
    } catch (err) {
      // TODO: check errors messages and display on login form
      if (err.response.status === 401) {
        setError('Email ou senha inválidos');
        return;
      }
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout () {
    try {
      await crudApi.post('/users/logout');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    fetchUser,
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
