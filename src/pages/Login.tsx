
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'LAB_TECHNICIAN';

const Login = () =&gt; {
  const { login, setBranch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [branch, setBranchLocal] = useState('Main Branch - Noida');
  const [selectedRole, setSelectedRole] = useState&lt;UserRole&gt;('RECEPTIONIST');
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions: Array&lt;{ label: string; value: UserRole; email: string }&gt; = [
    { label: 'Super Admin', value: 'SUPER_ADMIN', email: 'admin@hospital.com' },
    { label: 'Doctor', value: 'DOCTOR', email: 'doctor@hospital.com' },
    { label: 'Nurse', value: 'NURSE', email: 'nurse@hospital.com' },
    { label: 'Receptionist', value: 'RECEPTIONIST', email: 'reception@hospital.com' },
    { label: 'Pharmacist', value: 'PHARMACIST', email: 'pharmacist@hospital.com' },
    { label: 'Lab Technician', value: 'LAB_TECHNICIAN', email: 'lab@hospital.com' }
  ];

  const handleLogin = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setBranch(branch);

    try {
      const selectedRoleOption = roleOptions.find(r =&gt; r.value === selectedRole);
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
    &lt;div className="min-h-screen flex items-center justify-center bg-muted"&gt;
      &lt;div className="bg-card border border-border p-0 w-[450px] shadow-lg"&gt;
        &lt;div className="bg-primary text-primary-foreground px-6 py-4 text-center"&gt;
          &lt;h1 className="text-xl font-bold tracking-wide"&gt;Samrat HMS&lt;/h1&gt;
          &lt;p className="text-xs mt-1 opacity-90"&gt;
            Hospital Management Software
          &lt;/p&gt;
        &lt;/div&gt;

        &lt;form onSubmit={handleLogin} className="p-6 space-y-4"&gt;
          &lt;div&gt;
            &lt;label className="hms-form-label block mb-1"&gt;Select Role (Demo)&lt;/label&gt;
            &lt;select
              className="hms-select w-full"
              value={selectedRole}
              onChange={(e) =&gt; setSelectedRole(e.target.value as UserRole)}
              disabled={isLoading}
            &gt;
              {roleOptions.map((role) =&gt; (
                &lt;option key={role.value} value={role.value}&gt;{role.label}&lt;/option&gt;
              ))}
            &lt;/select&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label className="hms-form-label block mb-1"&gt;Branch&lt;/label&gt;
            &lt;select
              className="hms-select w-full"
              value={branch}
              onChange={(e) =&gt; setBranchLocal(e.target.value)}
              disabled={isLoading}
            &gt;
              &lt;option&gt;Main Branch - Noida&lt;/option&gt;
              &lt;option&gt;Branch 2 - Delhi&lt;/option&gt;
              &lt;option&gt;Branch 3 - Gurgaon&lt;/option&gt;
              &lt;option&gt;Branch 4 - Ghaziabad&lt;/option&gt;
            &lt;/select&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label className="hms-form-label block mb-1"&gt;Email&lt;/label&gt;
            &lt;input
              type="email"
              className="hms-input w-full"
              value={email}
              onChange={(e) =&gt; setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            /&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label className="hms-form-label block mb-1"&gt;Password&lt;/label&gt;
            &lt;input
              type="password"
              className="hms-input w-full"
              value={password}
              onChange={(e) =&gt; setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
            /&gt;
          &lt;/div&gt;

          {error &amp;&amp; (
            &lt;p className="text-destructive text-xs font-semibold"&gt;
              {error}
            &lt;/p&gt;
          )}

          &lt;button
            type="submit"
            className="hms-btn-primary w-full py-2 text-sm"
            disabled={isLoading}
          &gt;
            {isLoading ? 'Logging in...' : 'Login as ' + (roleOptions.find(r =&gt; r.value === selectedRole)?.label || 'User')}
          &lt;/button&gt;

          &lt;div className="mt-4 border-t border-border pt-3"&gt;
            &lt;p className="text-[10px] text-muted-foreground text-center"&gt;
              Select a role above to see the dashboard (demo mode)
            &lt;/p&gt;
          &lt;/div&gt;
        &lt;/form&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};

export default Login;
