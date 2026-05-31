import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Smartphone, RefreshCw, CheckCircle, XCircle, AlertCircle, Play, Square, Plus, Filter, User, DollarSign, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  extractArray, 
  getApiV1HrAttendance, 
  getApiV1HrLeaves, 
  getApiV1HrPayroll, 
  postApiV1HrAttendanceClockIn,
  postApiV1HrAttendanceClockOutByid,
  postApiV1HrLeaves,
  putApiV1HrLeavesByidStatus,
  postApiV1HrPayroll
} from "@/api/apiService";

const Attendance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'payroll'>('attendance');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState<'leave' | 'payroll' | null>(null);
  const [payrollData, setPayrollData] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    allowances: 0,
    deductions: 0
  });
  
  // Pagination States
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (targetPage = page) => {
    setLoading(true);
    try {
      let res;
      if (activeTab === 'attendance') {
        res = await getApiV1HrAttendance({ page: targetPage, size });
      } else if (activeTab === 'leaves') {
        res = await getApiV1HrLeaves({ page: targetPage, size });
      } else if (activeTab === 'payroll') {
        res = await getApiV1HrPayroll({ page: targetPage, size });
      }

      if (res && res.ok) {
        const data = res.data?.data || res.data;
        const content = extractArray(res);
        setTotalPages(data?.totalPages || 1);

        if (activeTab === 'attendance') {
          setHistory(content);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayRec = content.find((r: any) => {
            const rDate = new Date(r.date || r.createdAt);
            rDate.setHours(0, 0, 0, 0);
            return rDate.getTime() === today.getTime();
          });
          setTodayRecord(todayRec);
        } else if (activeTab === 'leaves') {
          setLeaves(content);
        } else if (activeTab === 'payroll') {
          setPayroll(content);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchData(0);
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await postApiV1HrAttendanceClockIn({
        remark: 'Clocked in from web panel'
      });
      if (res.ok) {
        toast({ title: 'Success', description: 'Clocked in successfully' });
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Clock-in failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Clock-in failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!todayRecord?.id) return;
    setLoading(true);
    try {
      const res = await postApiV1HrAttendanceClockOutByid(todayRecord.id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Clocked out successfully' });
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Clock-out failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Clock-out failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await putApiV1HrLeavesByidStatus(id, { status });
      if (res.ok) {
        toast({ title: 'Success', description: `Leave ${status.toLowerCase()} successfully` });
        fetchData();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update leave status', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postApiV1HrPayroll({
        ...payrollData,
        netSalary: Number(payrollData.basicSalary) + Number(payrollData.allowances) - Number(payrollData.deductions)
      });
      if (res.ok) {
        toast({ title: 'Success', description: 'Payroll record generated successfully' });
        setShowModal(null);
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Failed to generate payroll');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => (
    <div className="flex justify-between items-center mt-4 px-2">
      <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {page + 1} of {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={page === 0 || loading} onClick={() => { setPage(p => p - 1); fetchData(page - 1); }} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Previous</button>
        <button disabled={page >= totalPages - 1 || loading} onClick={() => { setPage(p => p + 1); fetchData(page + 1); }} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Next</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Clock size={16} /> Attendance & HR Management</div>
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('attendance')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-sm ${activeTab === 'attendance' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>Attendance</button>
          <button onClick={() => setActiveTab('leaves')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-sm ${activeTab === 'leaves' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>Leaves</button>
          <button onClick={() => setActiveTab('payroll')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-sm ${activeTab === 'payroll' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>Payroll</button>
          <button className="hms-btn-secondary p-1" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {activeTab === 'attendance' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Clock Card */}
            <div className="bg-card border border-border p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
              <div className="text-4xl font-mono font-bold text-primary">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              
              <div className="flex gap-4 w-full pt-4">
                <button 
                  disabled={loading || (todayRecord && (todayRecord.clockIn || todayRecord.clockInTime))}
                  onClick={handleClockIn}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-bold uppercase text-xs transition-all ${
                    todayRecord && (todayRecord.clockIn || todayRecord.clockInTime)
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Play size={14} /> Clock In
                </button>
                <button 
                  disabled={loading || !todayRecord || (todayRecord && (todayRecord.clockOut || todayRecord.clockOutTime))}
                  onClick={handleClockOut}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-bold uppercase text-xs transition-all ${
                    !todayRecord || (todayRecord && (todayRecord.clockOut || todayRecord.clockOutTime))
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  }`}
                >
                  <Square size={14} /> Clock Out
                </button>
              </div>

              {todayRecord && (
                <div className="w-full mt-4 p-3 bg-muted/30 border border-border rounded text-[11px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground uppercase font-bold">Shift Start:</span>
                    <span className="font-bold">{(todayRecord.clockIn || todayRecord.clockInTime) ? new Date(todayRecord.clockIn || todayRecord.clockInTime).toLocaleTimeString() : '--:--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground uppercase font-bold">Shift End:</span>
                    <span className="font-bold">{(todayRecord.clockOut || todayRecord.clockOutTime) ? new Date(todayRecord.clockOut || todayRecord.clockOutTime).toLocaleTimeString() : '--:--'}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground uppercase font-bold">Total Hours:</span>
                    <span className="text-primary font-bold">{todayRecord.workHours ? todayRecord.workHours.toFixed(2) : '0.00'} hrs</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: 'Present Records', value: history.filter(h => h.status === 'PRESENT' || h.status === 'Present').length, icon: CheckCircle, color: 'text-hms-success' },
                { label: 'Absents', value: history.filter(h => h.status === 'ABSENT' || h.status === 'Absent').length, icon: XCircle, color: 'text-destructive' },
                { label: 'Late Arrivals', value: history.filter(h => h.status === 'LATE' || h.status === 'Late').length, icon: AlertCircle, color: 'text-hms-warning' },
                { label: 'Total Logs', value: history.length, icon: Clock, color: 'text-hms-info' },
              ].map((s, i) => (
                <div key={i} className="bg-card border border-border p-4 shadow-sm flex items-center gap-4">
                  <div className={`p-3 rounded-full bg-muted/50 ${s.color}`}>
                    <s.icon size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History Table */}
          <div className="bg-card border border-border flex-1 overflow-auto shadow-sm">
            <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-primary" /> Attendance History
              </h3>
            </div>
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h: any) => (
                  <tr key={h.id}>
                    <td>
                      <div className="font-bold text-xs">{h.employee?.user?.fullName || 'N/A'}</div>
                      <div className="text-[9px] text-muted-foreground uppercase">{h.employee?.employeeCode}</div>
                    </td>
                    <td className="font-bold">{new Date(h.clockIn || h.createdAt).toLocaleDateString()}</td>
                    <td className="font-mono text-xs">{(h.clockIn || h.clockInTime) ? new Date(h.clockIn || h.clockInTime).toLocaleTimeString() : '-'}</td>
                    <td className="font-mono text-xs">{(h.clockOut || h.clockOutTime) ? new Date(h.clockOut || h.clockOutTime).toLocaleTimeString() : '-'}</td>
                    <td>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                        h.status === 'PRESENT' || h.status === 'Present' ? 'bg-hms-success/10 text-hms-success' :
                        h.status === 'LATE' || h.status === 'Late' ? 'bg-hms-warning/10 text-hms-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="text-[10px] text-muted-foreground italic">{h.remark || '-'}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground italic">No attendance records found</td></tr>
                )}
              </tbody>
            </table>
            {renderPagination()}
          </div>
        </>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-card border border-border flex-1 overflow-auto flex flex-col">
          <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-primary" /> Leave Requests
            </h3>
            <button onClick={() => setShowModal('leave')} className="hms-btn-primary h-7 px-3 text-[10px] uppercase font-bold flex items-center gap-1">
              <Plus size={12} /> Apply Leave
            </button>
          </div>
          <table className="hms-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l: any) => (
                <tr key={l.id}>
                  <td>
                    <div className="font-bold text-xs">{l.employee?.user?.fullName}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">{l.employee?.employeeCode}</div>
                  </td>
                  <td className="font-bold text-[10px] uppercase">{l.leaveType}</td>
                  <td>{new Date(l.startDate).toLocaleDateString()}</td>
                  <td>{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="text-[10px] max-w-xs truncate">{l.reason}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      l.status === 'APPROVED' || l.status === 'Approved' ? 'bg-hms-success/10 text-hms-success' :
                      l.status === 'PENDING' || l.status === 'Pending' ? 'bg-hms-warning/10 text-hms-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {(l.status === 'PENDING' || l.status === 'Pending') && (
                        <>
                          <button onClick={() => handleUpdateLeaveStatus(l.id, 'APPROVED')} className="text-hms-success hover:bg-hms-success/10 p-1 rounded" title="Approve"><Check size={14} /></button>
                          <button onClick={() => handleUpdateLeaveStatus(l.id, 'REJECTED')} className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Reject"><X size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground italic">No leave requests found</td></tr>
              )}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-card border border-border flex-1 overflow-auto flex flex-col">
          <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={14} className="text-primary" /> Payroll Management
            </h3>
            <button onClick={() => setShowModal('payroll')} className="hms-btn-primary h-7 px-3 text-[10px] uppercase font-bold flex items-center gap-1">
              <Plus size={12} /> Generate Payroll
            </button>
          </div>
          <table className="hms-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Month/Year</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Payable</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <div className="font-bold text-xs">{p.employee?.user?.fullName}</div>
                    <div className="text-[9px] text-muted-foreground uppercase">{p.employee?.employeeCode}</div>
                  </td>
                  <td className="font-bold">{p.month}/{p.year}</td>
                  <td className="font-mono text-xs">₹{p.basicSalary?.toLocaleString()}</td>
                  <td className="text-hms-success font-mono text-xs">+{p.allowances?.toLocaleString()}</td>
                  <td className="text-destructive font-mono text-xs">-{p.deductions?.toLocaleString()}</td>
                  <td className="font-bold text-primary font-mono text-xs">₹{p.netSalary?.toLocaleString()}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      p.status === 'PAID' || p.status === 'Paid' ? 'bg-hms-success/10 text-hms-success' : 'bg-hms-warning/10 text-hms-warning'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {payroll.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground italic">No payroll records found</td></tr>
              )}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      )}

      {/* Generate Payroll Modal */}
      {showModal === 'payroll' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><DollarSign size={16} className="text-primary" /> Generate Staff Payroll</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleGeneratePayroll} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Employee ID</label>
                  <input className="hms-input w-full" required placeholder="EMP-123" value={payrollData.employeeId} onChange={e => setPayrollData({...payrollData, employeeId: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Month</label>
                    <select className="hms-select w-full" value={payrollData.month} onChange={e => setPayrollData({...payrollData, month: parseInt(e.target.value)})}>
                      {Array.from({length: 12}, (_, i) => <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', {month: 'long'})}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Year</label>
                    <input type="number" className="hms-input w-full" value={payrollData.year} onChange={e => setPayrollData({...payrollData, year: parseInt(e.target.value)})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Basic Salary</label>
                  <input type="number" className="hms-input w-full font-mono" required value={payrollData.basicSalary} onChange={e => setPayrollData({...payrollData, basicSalary: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Allowances</label>
                  <input type="number" className="hms-input w-full font-mono" value={payrollData.allowances} onChange={e => setPayrollData({...payrollData, allowances: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Deductions</label>
                  <input type="number" className="hms-input w-full font-mono text-destructive" value={payrollData.deductions} onChange={e => setPayrollData({...payrollData, deductions: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="bg-muted/30 p-3 border border-border rounded-sm flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground">Calculated Net Salary:</span>
                <span className="text-lg font-mono font-bold text-primary">₹{(Number(payrollData.basicSalary) + Number(payrollData.allowances) - Number(payrollData.deductions)).toLocaleString()}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1" disabled={loading}>Process & Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
