import React, { useState, useEffect } from 'react';
import { CreditCard, Download, RefreshCw, CheckCircle, Clock, AlertTriangle, FileText, TrendingUp, Search, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getMonthName } from "@/api/apiService";

type Tab = 'my-payrolls' | 'history';

const Payroll = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('my-payrolls');
  const [loading, setLoading] = useState(false);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    userId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const mockPayrolls = [
        { _id: '1', month: 4, year: 2026, totalEarnings: 50000, totalDeductions: 5000, netSalary: 45000, paymentStatus: 'Paid', paymentDate: new Date() },
      ];
      const mockHistory = [
        { _id: '1', userId: { name: 'Dr. Sharma', employee_id: 'EMP001' }, month: 4, year: 2026, totalEarnings: 80000, totalDeductions: 8000, netSalary: 72000, paymentStatus: 'Processed' },
      ];
      if (tab === 'my-payrolls') {
        setPayrolls(mockPayrolls);
      } else {
        setHistory(mockHistory);
      }
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, filters.month, filters.year]);

  const handleGeneratePayroll = async () => {
    const userId = prompt('Enter Employee User ID:');
    if (!userId) return;
    
    setLoading(true);
    try {
      toast({ title: 'Success', description: 'Payroll generated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Generation failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (m: number) => {
    return new Date(2000, m - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><CreditCard size={16} /> Payroll & Financial Management</div>
        <div className="flex items-center gap-2">
          {tab === 'history' && (
            <button className="hms-btn-primary flex items-center gap-1 h-8 text-[10px] font-bold uppercase" onClick={handleGeneratePayroll}>
              <RefreshCw size={14} /> Run Payroll
            </button>
          )}
          <button className="hms-btn-secondary h-8" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Net Payable', value: `₹${payrolls.reduce((acc, curr) => acc + (curr.netSalary || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-hms-success' },
          { label: 'Processed', value: payrolls.filter(p => p.paymentStatus === 'Processed').length, icon: CheckCircle, color: 'text-hms-info' },
          { label: 'Pending', value: payrolls.filter(p => p.paymentStatus === 'Pending').length, icon: Clock, color: 'text-hms-warning' },
          { label: 'Deductions', value: `₹${payrolls.reduce((acc, curr) => acc + (curr.totalDeductions || 0), 0).toLocaleString()}`, icon: AlertTriangle, color: 'text-destructive' },
        ].map((s, i) => (
          <div key={i} className={`bg-card border border-border p-4 shadow-sm flex items-center gap-4 rounded-sm`}>
            <div className={`p-3 rounded-full bg-muted/50 ${s.color}`}><s.icon size={20} /></div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-border bg-card shadow-sm">
        {[
          { key: 'my-payrolls', label: 'My Payslips' },
          { key: 'history', label: 'Staff Payroll History' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'history' && (
        <div className="flex items-center gap-4 bg-card p-2 border border-border rounded-sm">
           <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Month:</label>
              <select className="hms-select h-8 text-[11px]" value={filters.month} onChange={e => setFilters({...filters, month: parseInt(e.target.value)})}>
                 {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{getMonthName(m)}</option>
                 ))}
              </select>
           </div>
           <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold uppercase text-muted-foreground">Year:</label>
              <select className="hms-select h-8 text-[11px]" value={filters.year} onChange={e => setFilters({...filters, year: parseInt(e.target.value)})}>
                 {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                 ))}
              </select>
           </div>
           <div className="flex-1"></div>
           <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input className="hms-input pl-7 h-8 w-48 text-[11px]" placeholder="Search employee..." />
           </div>
        </div>
      )}

      <div className="bg-card border border-border flex-1 overflow-auto shadow-sm">
        <table className="hms-table">
          <thead>
            <tr>
              {tab === 'history' && <th>Employee</th>}
              <th>Month/Year</th>
              <th>Earnings</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(tab === 'my-payrolls' ? payrolls : history).map((p: any) => (
              <tr key={p._id}>
                {tab === 'history' && (
                  <td>
                    <div className="font-bold text-sm">{p.userId?.name}</div>
                    <div className="text-[10px] text-muted-foreground">ID: {p.userId?.employee_id}</div>
                  </td>
                )}
                <td className="font-bold text-primary">
                  {getMonthName(p.month)} {p.year}
                </td>
                <td className="text-xs font-semibold">₹{p.totalEarnings?.toLocaleString()}</td>
                <td className="text-xs font-semibold text-destructive">₹{p.totalDeductions?.toLocaleString()}</td>
                <td className="text-sm font-bold text-hms-success">₹{p.netSalary?.toLocaleString()}</td>
                <td>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                    p.paymentStatus === 'Paid' ? 'bg-hms-success/10 text-hms-success' :
                    p.paymentStatus === 'Processed' ? 'bg-hms-info/10 text-hms-info' :
                    'bg-hms-warning/10 text-hms-warning'
                  }`}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td className="text-[10px] text-muted-foreground">
                  {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Pending'}
                </td>
                <td>
                   <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-primary/10 rounded text-primary" title="Download Payslip">
                        <Download size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="View Breakdown">
                        <FileText size={14} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
            {(tab === 'my-payrolls' ? payrolls : history).length === 0 && (
              <tr>
                <td colSpan={tab === 'history' ? 8 : 7} className="text-center py-10 text-muted-foreground italic text-sm">
                  No payroll records found for this selection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
