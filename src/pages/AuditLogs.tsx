import React, { useState, useEffect } from 'react';
import { Shield, Search, Download, Filter, Eye, AlertTriangle, LogIn, LogOut, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';
import { getAuditLogs } from '../api/apiService';
import { useToast } from '@/components/ui/use-toast';

const severityColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  critical: 'bg-red-600 text-white',
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({ search, module: filterModule, severity: filterSeverity });
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({ title: 'Error', description: 'Failed to sync audit logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, filterModule, filterSeverity]);

  const modules = ['All', ...new Set(logs.map((a: any) => a.module))];

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Shield size={16} /> Audit Logs & Activity Trail</div>
        <button className="hms-btn-secondary" onClick={fetchLogs}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 my-1">
        {[
          { label: 'Total Events', value: logs.length, color: 'bg-primary text-primary-foreground' },
          { label: 'Login Events', value: logs.filter((l: any) => l.action.includes('LOGIN')).length, color: 'bg-card border border-border' },
          { label: 'Data Changes', value: logs.filter((l: any) => ['CREATE', 'UPDATE', 'DELETE'].includes(l.action)).length, color: 'bg-card border border-border' },
          { label: 'Failed Attempts', value: logs.filter((l: any) => l.severity === 'error' || l.severity === 'critical').length, color: 'bg-card border border-border text-destructive' },
          { label: 'Critical Alerts', value: logs.filter((l: any) => l.severity === 'critical').length, color: 'bg-card border border-border text-destructive font-bold' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} p-3 text-center rounded-sm shadow-sm`}>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-card border border-border p-2">
        <Filter size={12} className="text-muted-foreground" />
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
          <input className="hms-input pl-7 w-full" placeholder="Search logs by user, action or description..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="hms-select min-w-[120px]" value={filterModule} onChange={e => setFilterModule(e.target.value)}>
          {modules.map(m => <option key={m}>{m}</option>)}
        </select>
        <select className="hms-select min-w-[100px]" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
          <option value="All">All Severity</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="critical">Critical</option>
        </select>
        <button className="hms-btn-secondary flex items-center gap-1"><Download size={12} /> Export</button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border flex-1 overflow-auto">
        <table className="hms-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Module</th>
              <th>Description</th>
              <th>IP Address</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log._id}>
                <td className="whitespace-nowrap text-[10px] font-mono">{new Date(log.timestamp).toLocaleString()}</td>
                <td>
                  <div className="font-semibold text-xs">{log.user?.name || 'System'}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{log.user?.role || 'Service'}</div>
                </td>
                <td>
                  <span className="flex items-center gap-1 font-bold text-[10px] uppercase">
                    {actionIcons[log.action] || null} {log.action}
                  </span>
                </td>
                <td className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{log.module}</td>
                <td className="max-w-[400px] truncate text-xs" title={log.description}>{log.description}</td>
                <td className="font-mono text-[10px]">{log.ipAddress}</td>
                <td>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${severityColors[log.severity]}`}>
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted-foreground italic text-sm">
                  No activity logs found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-card border border-border p-2">
        <span>Showing {logs.length} activity records</span>
        <span className="flex items-center gap-1"><Shield size={10} className="text-hms-success" /> Immutable Security Audit Trail Active</span>
      </div>
    </div>
  );
};

export default AuditLogs;
