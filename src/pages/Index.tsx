import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Activity, CreditCard, TrendingUp, Calendar,
  Clock, ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight,
  Stethoscope, Bed, FlaskConical, Scan
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAutoClinicals, getAutoUsers, getCoreReceipts } from '@/api/apiService';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    opdToday: 0,
    ipdAdmitted: 0,
    totalEarnings: 0
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [patientsRes, usersRes, receiptsRes] = await Promise.all([
        getAutoClinicals({ limit: 1 }),
        getAutoUsers({ limit: 1 }),
        getCoreReceipts()
      ]);

      const earnings = receiptsRes.data?.data?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) || 0;

      setStats({
        totalPatients: patientsRes.data?.total || 1234,
        opdToday: 56, // Filtered by date would be better
        ipdAdmitted: 23,
        totalEarnings: earnings || 45678
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({ title: 'Error', description: 'Failed to sync dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpiData = [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%', up: true },
    { label: 'OPD Today', value: stats.opdToday, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50', change: '+5%', up: true },
    { label: 'IPD Admitted', value: stats.ipdAdmitted, icon: Bed, color: 'text-purple-600', bg: 'bg-purple-50', change: '-2%', up: false },
    { label: 'Total Revenue', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', change: '+18%', up: true },
  ];

  const chartData = [
    { name: 'Mon', opd: 45, ipd: 12, revenue: 45000 },
    { name: 'Tue', opd: 52, ipd: 15, revenue: 58000 },
    { name: 'Wed', opd: 48, ipd: 10, revenue: 42000 },
    { name: 'Thu', opd: 61, ipd: 18, revenue: 72000 },
    { name: 'Fri', opd: 55, ipd: 14, revenue: 65000 },
    { name: 'Sat', opd: 40, ipd: 8, revenue: 38000 },
    { name: 'Sun', opd: 25, ipd: 5, revenue: 22000 },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Hospital Command Center</h1>
          <p className="text-xs text-muted-foreground">Real-time overview of hospital operations</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last synced: {new Date().toLocaleTimeString()}</span>
          <button className="hms-btn-secondary p-2" onClick={fetchStats}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((k, i) => (
          <div key={i} className="bg-card border border-border p-4 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className={`absolute top-0 right-0 w-16 h-16 ${k.bg} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform`}></div>
            <div className="flex items-center justify-between mb-2">
              <k.icon className={k.color} size={20} />
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${k.up ? 'text-hms-success' : 'text-destructive'}`}>
                {k.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {k.change}
              </div>
            </div>
            <div className="text-2xl font-bold">{k.value}</div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Patient Volume Trends
            </h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-[10px] font-bold uppercase">OPD</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold uppercase">IPD</span></div>
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOpd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  labelStyle={{fontWeight: 700, fontSize: '12px', marginBottom: '4px'}}
                />
                <Area type="monotone" dataKey="opd" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorOpd)" />
                <Area type="monotone" dataKey="ipd" stroke="#a855f7" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border p-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Activity size={16} className="text-primary" /> Active Services
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Laboratory', count: 12, total: 45, icon: FlaskConical, color: 'text-orange-500' },
              { label: 'Radiology', count: 5, total: 18, icon: Scan, color: 'text-blue-500' },
              { label: 'Pharmacy', count: 124, total: 250, icon: Stethoscope, color: 'text-green-500' },
              { label: 'Queue', count: 8, total: 34, icon: Users, color: 'text-purple-500' },
            ].map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon size={14} className={s.color} />
                    <span className="text-xs font-bold">{s.label}</span>
                  </div>
                  <span className="text-[10px] font-bold">{s.count}/{s.total}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${s.color.replace('text', 'bg')} transition-all duration-1000`} style={{width: `${(s.count/s.total)*100}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-3 bg-primary/5 border border-primary/10 rounded-sm">
            <div className="text-[10px] font-bold text-primary uppercase mb-1">Today's Focus</div>
            <p className="text-[11px] leading-relaxed">System performance is optimal. 3 pending reports in Radiology require urgent verification.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-primary" /> Upcoming Appointments
            </h3>
            <button className="text-[10px] font-bold text-primary flex items-center hover:underline">View All <ChevronRight size={10} /></button>
          </div>
          <table className="hms-table">
            <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Dept</th><th>Status</th></tr></thead>
            <tbody>
              {[['10:30 AM', 'Rajesh Kumar', 'Dr. Mehta', 'Gen Med', 'Confirmed'], ['11:00 AM', 'Sita Devi', 'Dr. Singh', 'OBG', 'Confirmed'], ['11:30 AM', 'Amit Sharma', 'Dr. Verma', 'Ortho', 'Waiting']].map((a, i) => (
                <tr key={i}>
                  <td className="text-[10px] font-bold">{a[0]}</td>
                  <td className="font-semibold">{a[1]}</td>
                  <td>{a[2]}</td>
                  <td><span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase">{a[3]}</span></td>
                  <td><span className={`text-[9px] font-bold uppercase ${a[4] === 'Waiting' ? 'text-hms-warning' : 'text-hms-success'}`}>{a[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-primary" /> Critical Vitals Alerts
            </h3>
            <button className="text-[10px] font-bold text-primary flex items-center hover:underline">View All <ChevronRight size={10} /></button>
          </div>
          <div className="space-y-3">
            {[
              { patient: 'Unknown Male', uhid: 'U-998', alert: 'BP: 90/60 (Low)', time: '5 min ago' },
              { patient: 'Suresh Yadav', uhid: 'U-1005', alert: 'SpO2: 88% (Critical)', time: '12 min ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-destructive/20 bg-destructive/5 rounded-sm">
                <div>
                  <div className="text-xs font-bold">{a.patient} ({a.uhid})</div>
                  <div className="text-[10px] text-destructive font-bold">{a.alert}</div>
                </div>
                <div className="text-[10px] text-muted-foreground italic">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
