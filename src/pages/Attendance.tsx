import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Smartphone, RefreshCw, CheckCircle, XCircle, AlertCircle, Play, Square } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { extractArray, getApiV1HrAttendance, getApiV1HrLeaves, getApiV1HrPayroll, apiRequest } from "@/api/apiService";

const Attendance = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves' | 'payroll'>('attendance');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'attendance') {
        const res = await getApiV1HrAttendance();
        if (res.ok) {
          const data = extractArray(res);
          setHistory(data);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayRec = data.find((r: any) => {
            const rDate = new Date(r.date || r.createdAt);
            rDate.setHours(0, 0, 0, 0);
            return rDate.getTime() === today.getTime();
          });
          setTodayRecord(todayRec);
        }
      } else if (activeTab === 'leaves') {
        const res = await getApiV1HrLeaves();
        if (res.ok) setLeaves(extractArray(res));
      } else if (activeTab === 'payroll') {
        const res = await getApiV1HrPayroll();
        if (res.ok) setPayroll(extractArray(res));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/hr/attendance/clock-in', { method: 'POST' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Clocked in successfully' });
        fetchHistory();
      } else {
        throw new Error(res.data?.message || 'Clock-in failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Clock-in failed', variant: 'destructive' });
      // Mock fallback for UI testing
      const newRecord = { id: Date.now().toString(), date: new Date(), clockIn: { time: new Date(), device: navigator.userAgent.split(') ')[0] + ')' }, status: 'Present' };
      setHistory([newRecord, ...history]);
      setTodayRecord(newRecord);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/hr/attendance/clock-out', { method: 'POST' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Clocked out successfully' });
        fetchHistory();
      } else {
        throw new Error(res.data?.message || 'Clock-out failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Clock-out failed', variant: 'destructive' });
      // Mock fallback
      const updatedRecord = { ...todayRecord, clockOut: { time: new Date(), device: navigator.userAgent.split(') ')[0] + ')' }, workHours: 8 };
      setHistory(history.map(h => h.id === updatedRecord.id ? updatedRecord : h));
      setTodayRecord(updatedRecord);
    } finally {
      setLoading(false);
    }
  };

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
                  disabled={loading || (todayRecord && todayRecord.clockIn?.time)}
                  onClick={handleClockIn}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-bold uppercase text-xs transition-all ${
                    todayRecord && todayRecord.clockIn?.time 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Play size={14} /> Clock In
                </button>
                <button 
                  disabled={loading || !todayRecord || (todayRecord && todayRecord.clockOut?.time)}
                  onClick={handleClockOut}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-sm font-bold uppercase text-xs transition-all ${
                    !todayRecord || (todayRecord && todayRecord.clockOut?.time)
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
                    <span className="font-bold">{todayRecord.clockIn?.time ? new Date(todayRecord.clockIn.time).toLocaleTimeString() : '--:--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground uppercase font-bold">Shift End:</span>
                    <span className="font-bold">{todayRecord.clockOut?.time ? new Date(todayRecord.clockOut.time).toLocaleTimeString() : '--:--'}</span>
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
                { label: 'Present This Month', value: history.filter(h => h.status === 'Present').length, icon: CheckCircle, color: 'text-hms-success' },
                { label: 'Late Arrivals', value: history.filter(h => h.status === 'Late').length, icon: AlertCircle, color: 'text-hms-warning' },
                { label: 'Leaves Taken', value: history.filter(h => h.status === 'On-Leave').length, icon: Calendar, color: 'text-hms-info' },
                { label: 'Absents', value: history.filter(h => h.status === 'Absent').length, icon: XCircle, color: 'text-destructive' },
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
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Work Hours</th>
                  <th>Status</th>
                  <th>Device/IP</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h: any) => (
                  <tr key={h.id}>
                    <td className="font-bold">{new Date(h.date || h.createdAt).toLocaleDateString()}</td>
                    <td className="font-mono text-xs">{h.clockIn?.time ? new Date(h.clockIn.time).toLocaleTimeString() : '-'}</td>
                    <td className="font-mono text-xs">{h.clockOut?.time ? new Date(h.clockOut.time).toLocaleTimeString() : '-'}</td>
                    <td className="font-bold text-primary">{h.workHours ? h.workHours.toFixed(2) : '0.00'}h</td>
                    <td>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                        h.status === 'Present' ? 'bg-hms-success/10 text-hms-success' :
                        h.status === 'Late' ? 'bg-hms-warning/10 text-hms-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="text-[10px] text-muted-foreground">{h.clockIn?.device || 'Desktop'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-card border border-border flex-1 overflow-auto">
          <table className="hms-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l: any) => (
                <tr key={l.id}>
                  <td className="font-bold">{l.leaveType}</td>
                  <td>{new Date(l.startDate).toLocaleDateString()}</td>
                  <td>{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="font-bold">{l.totalDays}</td>
                  <td className="text-xs">{l.reason}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      l.status === 'Approved' ? 'bg-hms-success/10 text-hms-success' :
                      l.status === 'Pending' ? 'bg-hms-warning/10 text-hms-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className="bg-card border border-border flex-1 overflow-auto">
          <table className="hms-table">
            <thead>
              <tr>
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
                  <td className="font-bold">{p.month} {p.year}</td>
                  <td>{p.basicSalary}</td>
                  <td className="text-hms-success">+{p.allowances}</td>
                  <td className="text-destructive">-{p.deductions}</td>
                  <td className="font-bold text-primary">{p.netSalary}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      p.status === 'Paid' ? 'bg-hms-success/10 text-hms-success' : 'bg-hms-warning/10 text-hms-warning'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;
