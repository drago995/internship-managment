import { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext(null);
const API_URL = 'http://localhost:8080';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload.message || 'Login failed');
      }

      const authData = payload.data || {};

      const jwtToken = authData.token;
      const userData = {
        id: authData.id,
        email: authData.email,
        role: authData.role,
      };

      if (!jwtToken) throw new Error('No token returned from server');

     
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      
      setToken(jwtToken);
      setUser(userData);

      console.log('Logged in as:', userData); // Debug log

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || String(error) };
    }
  };

  const register = async (registerData, role) => {
    try {
      const endpoint =
        role === 'STUDENT'
          ? '/auth/register/student'
          : '/auth/register/company';

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload.message || (payload.data && payload.data.error) || 'Registration failed');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || String(error) };
    }
  };

  const logout = () => {
    // Clear everything
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    
    console.log('Logged out'); // Debug log
    
    // Force page reload to clear all state
    window.location.href = '/login';
  };

  const hasRole = (role) => user?.role === role;
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, hasRole, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}