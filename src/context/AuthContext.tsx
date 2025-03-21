import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  socialAuth: (provider: 'github' | 'google') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);
  
  // Check for OAuth redirect callbacks
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('token');
    const authUser = urlParams.get('user');
    const provider = urlParams.get('provider');
    
    if (authToken && authUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(authUser));
        
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', decodeURIComponent(authUser));
        
        toast.success(`Signed in with ${provider || 'social login'}`);
        
        // Clean URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error('Error processing auth callback:', error);
        toast.error('Authentication failed');
      }
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success(response.message || 'Login successful');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.register({ username, email, password });
      
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        toast.success(response.message || 'Registration successful');
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  
  const socialAuth = (provider: 'github' | 'google'): void => {
    // Redirect to the backend OAuth route
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    toast.success('Logged out successfully');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      register, 
      logout,
      socialAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};