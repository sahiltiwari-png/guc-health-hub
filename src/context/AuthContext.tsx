import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  _id: string;
  email: string;
  role: string;
  name: string;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  currentBranch: string;
  setBranch: (branch: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('hms_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [currentBranch, setCurrentBranch] = useState('Main Branch - Noida');

  const login = (userData: User, token: string) => {
    const fullUser = { ...userData, branch: currentBranch };
    setUser(fullUser);
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(fullUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, currentBranch, setBranch: setCurrentBranch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
