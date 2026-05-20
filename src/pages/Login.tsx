import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as apiService from '@/api/apiService';
import { createLogin } from "@/api/apiService";

const Login = () => {
  const { login, setBranch } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [branch, setBranchLocal] = useState('Main Branch - Noida');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setBranch(branch);

    try {
      const response = await apiService.createLogin({ username, password });
      
      if (!response.ok || !response.data) {
        throw new Error('Invalid username or password');
      }

      const { user, token, hospitalId, branchId, roles } = response.data;
      
      login({ ...user, roles }, token, hospitalId, branchId);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card border border-border p-0 w-[450px] shadow-lg">
        <div className="bg-primary text-primary-foreground px-6 py-4 text-center">
          <h1 className="text-xl font-bold tracking-wide">Samrat HMS</h1>
          <p className="text-xs mt-1 opacity-90">
            Hospital Management Software
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="hms-form-label block mb-1">Branch</label>
            <select
              className="hms-select w-full"
              value={branch}
              onChange={(e) => setBranchLocal(e.target.value)}
              disabled={isLoading}
            >
              <option>Main Branch - Noida</option>
              <option>Branch 2 - Delhi</option>
              <option>Branch 3 - Gurgaon</option>
              <option>Branch 4 - Ghaziabad</option>
            </select>
          </div>

          <div>
            <label className="hms-form-label block mb-1">Username</label>
            <input
              type="text"
              className="hms-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className="hms-form-label block mb-1">Password</label>
            <input
              type="password"
              className="hms-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-xs font-semibold">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="hms-btn-primary w-full py-2 text-sm"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
