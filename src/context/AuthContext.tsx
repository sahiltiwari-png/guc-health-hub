import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  username?: string;
  email?: string;
  role: string;
  roles?: string[];
  name: string;
  branch?: string;
  hospitalId?: string;
  branchId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string, hospitalId?: string, branchId?: string) => void;
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
  const [currentBranch, setCurrentBranch] = useState(() => {
    return localStorage.getItem('current_branch') || 'Main Branch - Noida';
  });

  const login = (userData: User, token: string, hospitalId?: string, branchId?: string) => {
    // Determine a single primary role string
    let primaryRole = 'RECEPTIONIST';
    if (userData.role && typeof userData.role === 'string') {
      primaryRole = userData.role;
    } else if (userData.role && (userData.role as any).name) {
      primaryRole = (userData.role as any).name;
    } else if (userData.roles && userData.roles.length > 0) {
      const r = userData.roles[0];
      primaryRole = typeof r === 'string' ? r : (r as any).name;
    }

    const fullUser = { ...userData, role: primaryRole, branch: currentBranch, hospitalId, branchId };
    setUser(fullUser);
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(fullUser));
    if (hospitalId) localStorage.setItem('hospital_id', hospitalId);
    if (branchId) localStorage.setItem('branch_id', branchId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hospital_id');
    localStorage.removeItem('branch_id');
  };

  const setBranch = (branch: string) => {
    setCurrentBranch(branch);
    localStorage.setItem('current_branch', branch);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, currentBranch, setBranch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
