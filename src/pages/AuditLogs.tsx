import React, { useState } from 'react';
import { Shield, Search, Download, Filter, Eye, AlertTriangle, LogIn, LogOut, Edit, Trash2, Plus } from 'lucide-react';

const auditData = [
  { id: 1, timestamp: '25-Feb-2026 09:15:23', user: 'admin', role: 'Admin', action: 'LOGIN', module: 'Authentication', description: 'User logged in from IP 192.168.1.45', severity: 'info', ip: '192.168.1.45' },
  { id: 2, timestamp: '25-Feb-2026 09:18:45', user: 'admin', role: 'Admin', description: 'Updated bed allocation for Ward-A/B-12', action: 'UPDATE', module: 'IPD', severity: 'warning', ip: '192.168.1.45' },
  { id: 3, timestamp: '25-Feb-2026 09:22:10', user: 'Dr. Alok Mehta', role: 'Doctor', action: 'CREATE', module: 'OPD', description: 'New OPD registration - UHID: U-1006, Patient: Ramesh Yadav', severity: 'info', ip: '192.168.1.52' },
  { id: 4, timestamp: '25-Feb-2026 09:30:00', user: 'Ankit Gupta', role: 'Pharmacist', action: 'DISPENSE', module: 'Pharmacy', description: 'Dispensed 30 units Amoxicillin 500mg - Batch: AMX-2026-001', severity: 'info', ip: '192.168.1.60' },
  { id: 5, timestamp: '25-Feb-2026 09:35:12', user: 'Suresh Verma', role: 'Lab Tech', action: 'UPDATE', module: 'Lab', description: 'Lab report approved - Test: CBC, Patient: U-1002', severity: 'info', ip: '192.168.1.55' },
  { id: 6, timestamp: '25-Feb-2026 09:40:33', user: 'admin', role: 'Admin', action: 'DELETE', module: 'Settings', description: 'Deleted user account: temp_user_01', severity: 'error', ip: '192.168.1.45' },
  { id: 7, timestamp: '25-Feb-2026 09:45:00', user: 'Ravi Kumar', role: 'Receptionist', action: 'CREATE', module: 'Patient Reg', description: 'New patient registered - UHID: U-1007, Smt. Lakshmi Devi', severity: 'info', ip: '192.168.1.48' },
  { id: 8, timestamp: '25-Feb-2026 09:50:18', user: 'admin', role: 'Admin', action: 'UPDATE', module: 'Settings', description: 'Modified role permissions for Nurse role', severity: 'warning', ip: '192.168.1.45' },
  { id: 9, timestamp: '25-Feb-2026 10:00:00', user: 'Meena Devi', role: 'Accountant', action: 'CREATE', module: 'Billing', description: 'Invoice generated - INV-20260225-001, Amount: ₹15,500', severity: 'info', ip: '192.168.1.62' },
  { id: 10, timestamp: '25-Feb-2026 10:05:45', user: 'nurse', role: 'Nurse', action: 'UPDATE', module: 'IPD', description: 'Vitals updated for IPD-502, BP: 140/90, Temp: 101°F', severity: 'warning', ip: '192.168.1.50' },
  { id: 11, timestamp: '25-Feb-2026 10:12:00', user: 'admin', role: 'Admin', action: 'FAILED_LOGIN', module: 'Authentication', description: 'Failed login attempt from IP 10.0.0.99 - Username: unknown_user', severity: 'error', ip: '10.0.0.99' },
  { id: 12, timestamp: '25-Feb-2026 10:15:30', user: 'Dr. Priya Singh', role: 'Doctor', action: 'UPDATE', module: 'OPD', description: 'Prescription updated for UHID: U-1002, Added: Metformin 500mg', severity: 'info', ip: '192.168.1.53' },
];

const severityColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <LogIn size={12} />,
  LOGOUT: <LogOut size={12} />,
  CREATE: <Plus size={12} />,
  UPDATE: <Edit size={12} />,
  DELETE: <Trash2 size={12} />,
  DISPENSE: <Plus size={12} />,
  FAILED_LOGIN: <AlertTriangle size={12} />,
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const modules = ['All', ...new Set(auditData.map(a => a.module))];

  const filtered = auditData.filter(a => {
    const matchSearch = search === '' || 
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase());
    const matchModule = filterModule === 'All' || a.module === filterModule;
    const matchSeverity = filterSeverity === 'All' || a.severity === filterSeverity;
    return matchSearch && matchModule && matchSeverity;
  });

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2">
        <Shield size={14} /> Audit Logs & Activity Trail
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 my-3">
        {[
          { label: 'Total Events Today', value: '248', color: 'bg-primary text-primary-foreground' },
          { label: 'Login Events', value: '34', color: 'bg-card border border-border' },
          { label: 'Data Changes', value: '156', color: 'bg-card border border-border' },
          { label: 'Failed Attempts', value: '3', color: 'bg-card border border-border' },
          { label: 'Critical Alerts', value: '5', color: 'bg-card border border-border' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} p-2 text-center`}>
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] font-semibold uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-2 bg-card border border-border p-2">
        <Filter size={12} />
        <input className="hms-input flex-1" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="hms-select" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
          {modules.map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="hms-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option>All</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
        <button className="hms-btn-primary flex items-center gap-1"><Download size={12} /> Export</button>
      </div>

      {/* Table */}
      <table className="hms-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Timestamp</th>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Module</th>
            <th>Description</th>
            <th>IP Address</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((log, i) => (
            <tr key={log.id}>
              <td>{i + 1}</td>
              <td className="whitespace-nowrap">{log.timestamp}</td>
              <td className="font-semibold">{log.user}</td>
              <td>{log.role}</td>
              <td>
                <span className="flex items-center gap-1">
                  {actionIcons[log.action] || null} {log.action}
                </span>
              </td>
              <td>{log.module}</td>
              <td className="max-w-[300px] truncate">{log.description}</td>
              <td className="font-mono text-[10px]">{log.ip}</td>
              <td>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${severityColors[log.severity]}`}>
                  {log.severity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-2 text-[10px] text-muted-foreground bg-card border border-border p-2">
        <span>Showing {filtered.length} of {auditData.length} records</span>
        <span>Auto-refresh: Every 30 seconds | Retention: 90 days</span>
      </div>
    </div>
  );
};

export default AuditLogs;
