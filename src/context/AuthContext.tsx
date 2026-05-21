import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string | number;
  username?: string;
  email?: string;
  role: string;
  roles?: any[];
  name: string;
  fullName?: string;
  phoneNumber?: string;
  branch?: string;
  hospitalId?: string | number;
  branchId?: string | number;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any, token: string, hospitalId?: string | number, branchId?: string | number) => void;
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

  const login = (userData: any, token: string, hospitalId?: string | number, branchId?: string | number) => {
    // Determine a single primary role string from the complex structure
    let primaryRole = 'RECEPTIONIST';
    
    // Case 1: user.role is a string
    if (typeof userData.role === 'string') {
      primaryRole = userData.role;
    } 
    // Case 2: user.roles is an array of strings
    else if (Array.isArray(userData.roles) && userData.roles.length > 0 && typeof userData.roles[0] === 'string') {
      primaryRole = userData.roles[0];
    }
    // Case 3: user.roles is an array of objects (new structure)
    else if (Array.isArray(userData.roles) && userData.roles.length > 0 && typeof userData.roles[0] === 'object') {
      primaryRole = userData.roles[0].name || 'RECEPTIONIST';
    }
    // Case 4: legacy role object
    else if (userData.role && typeof userData.role === 'object') {
      primaryRole = userData.role.name || 'RECEPTIONIST';
    }

    const fullUser: User = { 
      ...userData, 
      name: userData.fullName || userData.name || userData.username || 'User',
      role: primaryRole.toUpperCase(), 
      branch: currentBranch, 
      hospitalId: hospitalId || userData.hospitalId, 
      branchId: branchId || userData.branchId 
    };
    
    setUser(fullUser);
    localStorage.setItem('hms_token', token);
    localStorage.setItem('hms_user', JSON.stringify(fullUser));
    if (hospitalId || userData.hospitalId) localStorage.setItem('hospital_id', String(hospitalId || userData.hospitalId));
    if (branchId || userData.branchId) localStorage.setItem('branch_id', String(branchId || userData.branchId));
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
