import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  username: string;
  role: string;
  name: string;
  branch: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  currentBranch: string;
  setBranch: (branch: string) => void;
}

const users: Record<string, { password: string; role: string; name: string }> = {
  admin: { password: 'admin123', role: 'Admin', name: 'Administrator' },
  doctor: { password: 'doctor123', role: 'Doctor', name: 'Dr. Alok Mehta' },
  nurse: { password: 'nurse123', role: 'Nurse', name: 'Nurse Priya Sharma' },
  reception: { password: 'reception123', role: 'Receptionist', name: 'Ravi Kumar' },
  labtech: { password: 'labtech123', role: 'Lab Technician', name: 'Suresh Verma' },
  pharma: { password: 'pharma123', role: 'Pharmacist', name: 'Ankit Gupta' },
  accountant: { password: 'account123', role: 'Accountant', name: 'Meena Devi' },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentBranch, setCurrentBranch] = useState('Main Branch - Noida');

  const login = (username: string, password: string) => {
    const u = users[username];
    if (u && u.password === password) {
      setUser({ username, role: u.role, name: u.name, branch: currentBranch });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

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
