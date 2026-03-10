import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { login as apiLogin } from '@/api/apiService';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [branch, setBranch] = useState('Main Branch - Noida');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = await apiLogin(email, password);
      login(userData.user, userData.token); // Assuming useAuth's login handles this
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="bg-card border border-border p-0 w-[420px] shadow-lg">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4 text-center">
          <h1 className="text-xl font-bold tracking-wide">GUC HMS</h1>
          <p className="text-xs mt-1 opacity-90">Hospital Management Software</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="hms-form-label block mb-1">Branch</label>
            <select
              className="hms-select w-full"
              value={branch}
              onChange={e => setBranch(e.target.value)}
              disabled={isLoading}
            >
              <option>Main Branch - Noida</option>
              <option>Branch 2 - Delhi</option>
              <option>Branch 3 - Gurgaon</option>
              <option>Branch 4 - Ghaziabad</option>
            </select>
          </div>

          <div>
            <label className="hms-form-label block mb-1">Email</label>
            <input
              type="email"
              className="hms-input w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="hms-form-label block mb-1">Password</label>
            <input
              type="password"
              className="hms-input w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-destructive text-xs font-semibold">{error}</p>}

          <button type="submit" className="hms-btn-primary w-full py-2 text-sm" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Default Credentials: admin/admin123 | doctor/doctor123 | nurse/nurse123 | reception/reception123 | labtech/labtech123 | pharma/pharma123 | accountant/account123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
