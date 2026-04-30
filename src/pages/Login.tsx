import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'LAB_TECHNICIAN';

const Login = () => {
  const { login, setBranch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [branch, setBranchLocal] = useState('Main Branch - Noida');
  const [selectedRole, setSelectedRole] = useState<UserRole>('RECEPTIONIST');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions: Array<{ label: string; value: UserRole; email: string }> = [
    { label: 'Super Admin', value: 'SUPER_ADMIN', email: 'admin@hospital.com' },
    { label: 'Doctor', value: 'DOCTOR', email: 'doctor@hospital.com' },
    { label: 'Nurse', value: 'NURSE', email: 'nurse@hospital.com' },
    { label: 'Receptionist', value: 'RECEPTIONIST', email: 'reception@hospital.com' },
    { label: 'Pharmacist', value: 'PHARMACIST', email: 'pharmacist@hospital.com' },
    { label: 'Lab Technician', value: 'LAB_TECHNICIAN', email: 'lab@hospital.com' }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setBranch(branch);

    try {
      const selectedRoleOption = roleOptions.find(r => r.value === selectedRole);
      const userData = {
        _id: 'user_' + selectedRole.toLowerCase(),
        email: selectedRoleOption?.email || email,
        role: selectedRole,
        name: selectedRoleOption?.label || 'User',
        branch: branch,
        hospitalId: 'hosp_001',
        branchId: 'branch_001'
      };

      login(
        userData,
        'demo_token_' + Date.now(),
        'hosp_001',
        'branch_001'
      );
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
            <label className="hms-form-label block mb-1">Select Role (Demo)</label>
            <select
              className="hms-select w-full"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              disabled={isLoading}
            >
              {roleOptions.map((role) => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>

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
            <label className="hms-form-label block mb-1">Email</label>
            <input
              type="email"
              className="hms-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
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
            {isLoading ? 'Logging in...' : 'Login as ' + (roleOptions.find(r => r.value === selectedRole)?.label || 'User')}
          </button>

          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Select a role above to see the dashboard (demo mode)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
