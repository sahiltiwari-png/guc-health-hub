import React, { useEffect, useState } from 'react';
import { 
  Users, Stethoscope, BedDouble, DollarSign, Activity, UserPlus, FileText,
  BarChart2, AlertCircle, Pill, FlaskConical, Calendar, Clock, 
  ClipboardList, CheckCircle, XCircle, TrendingUp, Package, HeartPulse,
  Building, Truck, Scan, Microscope, Droplets, Shield, CreditCard, 
  Baby, Skull, Award, UserCog, RotateCcw, KeyRound, Warehouse, 
  Monitor, UtensilsCrossed, Headphones, FileOutput, Scissors, Siren, 
  ChevronRight, MoreHorizontal, ArrowUp, ArrowDown, Phone, Mail, 
  Home, MapPin, CalendarCheck, Thermometer, Droplet, Weight,
  Zap, Database, Server, Wifi, Lock, Unlock, Bell, Star, RefreshCw,
  Eye, Edit, LayoutDashboard, ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import NurseDashboard from './NurseDashboard';
import { 
  apiRequest, extractArray, getAssets, getPatients, getUsers, getDashboardStats, getBranches, 
  getAppointments, getIPDAdmissions, getBilling, getStaff,
  getApiV1ClinicalVitalsHistory, postApiV1ClinicalVitals
} from "@/api/apiService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'LAB_TECHNICIAN';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; up: boolean };
  color?: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color }: StatCardProps) => (
  <div className="bg-card border border-border p-2.5 hover:border-primary/50 transition-colors">
    <div className="flex items-start justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={16} className={color || 'text-primary opacity-70'} />
        <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-0.5 text-[9px] font-semibold ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
          {trend.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {trend.value}
        </div>
      )}
    </div>
    <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
  </div>
);

interface MiniTableProps {
  title: string;
  headers: string[];
  rows: any[][];
  icon?: React.ElementType;
  actions?: (row: any, index: number) => React.ReactNode;
  rawRows?: any[];
  pagination?: {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const MiniTable = ({ title, headers, rows, icon: Icon, actions, rawRows, pagination }: MiniTableProps) => (
  <div className="border border-border bg-card flex flex-col h-full">
    <div className="hms-section-header flex items-center justify-between shrink-0">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} />}
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronRight size={12} className="opacity-60" />
    </div>
    <div className="overflow-x-auto flex-1">
      <table className="hms-table w-full">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="py-1 px-1.5">{h}</th>
            ))}
            {actions && <th className="py-1 px-1.5 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-1 px-1.5">{cell}</td>
              ))}
              {actions && (
                <td className="py-1 px-1.5 text-right">
                  {actions(rawRows ? rawRows[i] : row, i)}
                </td>
              )}
            </tr>
          )) : (
            <tr><td colSpan={headers.length + (actions ? 1 : 0)} className="text-center py-4 text-muted-foreground text-xs">No records found</td></tr>
          )}
        </tbody>
      </table>
    </div>
    {pagination && pagination.total > 0 && (
      <div className="p-1.5 border-t border-border flex items-center justify-between bg-muted/20 shrink-0">
        <span className="text-[9px] text-muted-foreground font-bold uppercase">Total: {pagination.total}</span>
        <div className="flex items-center gap-1">
          <button 
            disabled={pagination.page === 0}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[9px] font-bold w-12 text-center">Page {pagination.page + 1}</span>
          <button 
            disabled={(pagination.page + 1) * pagination.size >= pagination.total}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const getRole = () => {
    const r: any = user?.role;
    if (r?.name) return r.name;
    if (typeof r === 'string') return r;
    if (user?.roles && user.roles.length > 0) {
      const firstRole: any = user.roles[0];
      return typeof firstRole === 'string' ? firstRole : firstRole.name;
    }
    return 'RECEPTIONIST';
  };

  const role = getRole().toUpperCase();
  if (role === 'NURSE') return <NurseDashboard />;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    hospitals: 0,
    users: 0,
    patients: 0,
    assets: 0,
    appointments: 0,
    revenue: '₹0',
    activeBeds: '0/0',
    staffOnDuty: 0,
  });
  
  const [recentPatients, setRecentPatients] = useState<any[][]>([]);
  const [rawPatients, setRawPatients] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[][]>([]);
  const [recentStaff, setRecentStaff] = useState<any[][]>([]);

  // Pagination states
  const [patientPagination, setPatientPagination] = useState({ page: 0, size: 5, total: 0 });

  // Vitals states
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitalsData, setVitalsData] = useState({
    weight: '',
    height: '',
    bloodPressure: '',
    temperature: '',
    pulseRate: '',
    spo2: '',
    remark: ''
  });
  const [isSavingVitals, setIsSavingVitals] = useState(false);

  const fetchData = async (patientPage = 0) => {
    setLoading(true);
    try {
      const [saRes, uRes, pRes, aRes, bRes, appRes, ipdRes, billRes, staffRes] = await Promise.all([
        getDashboardStats(),
        getUsers(),
        getPatients({ page: patientPage, size: patientPagination.size }),
        getAssets(),
        getBranches(),
        getAppointments(),
        getIPDAdmissions(),
        getBilling(),
        getStaff()
      ]);

      if (saRes.ok && saRes.data?.stats) {
        const saData = saRes.data.stats;
        setStats({
          hospitals: saData.totalHospitals || extractArray(bRes).length,
          users: saData.totalUsers || extractArray(uRes).length,
          patients: saData.totalPatients || extractArray(pRes).length,
          assets: saData.totalAssets || extractArray(aRes).length,
          revenue: saData.revenue || '₹0',
          appointments: saData.appointments || extractArray(appRes).length,
          activeBeds: saData.activeBeds || '0/0',
          staffOnDuty: saData.staffOnDuty || extractArray(staffRes).filter((s: any) => s.isActive).length,
        });
      } else {
          // Fallback if saRes fails
          setStats({
              hospitals: extractArray(bRes).length,
              users: extractArray(uRes).length,
              patients: extractArray(pRes).length,
              assets: extractArray(aRes).length,
              revenue: '₹' + extractArray(billRes).reduce((acc: number, b: any) => acc + (b.amount || 0), 0),
              appointments: extractArray(appRes).length,
              activeBeds: '0/' + extractArray(ipdRes).length,
              staffOnDuty: extractArray(staffRes).filter((s: any) => s.isActive).length,
          });
      }

      const patientsArray = extractArray(pRes);
      setRawPatients(patientsArray);
      setRecentPatients(patientsArray.map((p: any) => [
        p.uhid || 'N/A', p.patientName || p.name || 'N/A', p.gender || '-', p.mobile || '-', p.age || '-'
      ]));
      
      const totalPatients = pRes.data?.data?.totalElements ?? pRes.data?.totalElements ?? patientsArray.length;
      setPatientPagination(prev => ({ ...prev, page: patientPage, total: totalPatients }));

      setRecentAppointments(extractArray(appRes).slice(0, 5).map((a: any) => [
        a.appointmentNo || a.id?.toString().slice(-6) || 'N/A', a.patientName || 'N/A', a.doctorName || 'N/A', a.status || 'Pending'
      ]));
      setRecentStaff(extractArray(staffRes).slice(0, 5).map((s: any) => [
        s.employeeId || s.id?.toString().slice(-6) || 'N/A', s.name || s.fullName || 'N/A', s.department || 'N/A', s.status || 'Active'
      ]));

    } catch (e) {
      console.error('[Dashboard] Error fetching data:', e);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVitals = async (patient: any) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      const res = await getApiV1ClinicalVitalsHistory({ patientId: patient.id });
      if (res.ok) {
        const history = extractArray(res);
        const latest = history[0] || {};
        setVitalsData({
          weight: latest.weight?.toString() || '',
          height: latest.height?.toString() || '',
          bloodPressure: latest.bloodPressure || '',
          temperature: latest.temperature?.toString() || '',
          pulseRate: latest.pulseRate?.toString() || '',
          spo2: latest.spo2?.toString() || '',
          remark: ''
        });
      } else {
        setVitalsData({
          weight: '', height: '', bloodPressure: '', temperature: '', pulseRate: '', spo2: '', remark: ''
        });
      }
      setShowVitalsModal(true);
    } catch (error) {
      toast.error("Failed to fetch patient vitals");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVitals = async () => {
    if (!selectedPatient) return;
    setIsSavingVitals(true);
    try {
      const res = await postApiV1ClinicalVitals({
        patientId: selectedPatient.id,
        weight: parseFloat(vitalsData.weight),
        height: parseFloat(vitalsData.height),
        bloodPressure: vitalsData.bloodPressure,
        temperature: parseFloat(vitalsData.temperature),
        pulseRate: parseInt(vitalsData.pulseRate),
        spo2: parseInt(vitalsData.spo2),
        remark: vitalsData.remark,
        recordedAt: new Date().toISOString()
      });

      if (res.ok) {
        toast.success("Vitals saved successfully");
        setShowVitalsModal(false);
      } else {
        toast.error(res.data?.message || "Failed to save vitals");
      }
    } catch (error) {
      toast.error("An error occurred while saving vitals");
    } finally {
      setIsSavingVitals(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full space-y-3 overflow-y-auto pb-4 pr-1">
      {/* Header */}
      <div className="flex items-center justify-between bg-card border border-border p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <LayoutDashboard size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Super Admin Command Center</h1>
            <p className="text-[10px] text-muted-foreground">Real-time HMS Analytics & Oversight</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-primary">System Health: 98.2%</span>
            <span className="text-[9px] text-muted-foreground">{new Date().toLocaleDateString()}</span>
          </div>
          <button onClick={() => fetchData()} className="hms-btn-secondary p-1.5 rounded-full" title="Refresh Dashboard">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <StatCard label="Total Hospitals" value={stats.hospitals} icon={Building} trend={{ value: '12%', up: true }} />
        <StatCard label="Active Users" value={stats.users} icon={Users} trend={{ value: '5%', up: true }} />
        <StatCard label="Total Patients" value={stats.patients} icon={HeartPulse} trend={{ value: '18%', up: true }} />
        <StatCard label="Total Assets" value={stats.assets} icon={Warehouse} color="text-amber-600" />
        <StatCard label="Daily Revenue" value={stats.revenue} icon={DollarSign} color="text-green-600" trend={{ value: '24%', up: true }} />
        <StatCard label="Appointments" value={stats.appointments} icon={CalendarCheck} color="text-blue-600" />
        <StatCard label="Active Beds" value={stats.activeBeds} icon={BedDouble} color="text-purple-600" />
        <StatCard label="Staff on Duty" value={stats.staffOnDuty} icon={UserCog} color="text-cyan-600" />
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-3 flex flex-col">
          <div className="flex-1">
            <MiniTable 
              title="Recent Patient Registrations" 
              headers={['UHID', 'Name', 'Gender', 'Contact', 'Age']} 
              rows={recentPatients}
              rawRows={rawPatients}
              icon={UserPlus}
              pagination={{
                page: patientPagination.page,
                size: patientPagination.size,
                total: patientPagination.total,
                onPageChange: (newPage) => fetchData(newPage)
              }}
              actions={(patient) => (
                <div className="flex items-center justify-end gap-1">
                  <button 
                    onClick={() => handleOpenVitals(patient)}
                    className="p-1 hover:bg-primary/10 text-primary rounded transition-colors"
                    title="View/Edit Vitals"
                  >
                    <Activity size={14} />
                  </button>
                  <button 
                    className="p-1 hover:bg-hms-info/10 text-hms-info rounded transition-colors"
                    title="View Patient"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <MiniTable 
              title="Today's Appointments" 
              headers={['ID', 'Patient', 'Doctor', 'Status']} 
              rows={recentAppointments}
              icon={Clock}
            />
            <MiniTable 
              title="Active Staff Members" 
              headers={['ID', 'Name', 'Dept', 'Status']} 
              rows={recentStaff}
              icon={UserCog}
            />
          </div>
        </div>

        {/* Right Column: Alerts & Status */}
        <div className="space-y-3">
           {/* Critical Alerts */}
           <div className="bg-card border border-destructive/30 rounded shadow-sm overflow-hidden">
            <div className="bg-destructive text-destructive-foreground px-3 py-1.5 text-[10px] font-bold uppercase flex items-center gap-2">
              <AlertCircle size={12} /> System Critical Alerts
            </div>
            <div className="p-2 space-y-2">
              <div className="flex items-start gap-2 p-2 bg-destructive/5 border-l-2 border-destructive">
                <Siren size={14} className="text-destructive mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-destructive">ICU Bed Shortage</p>
                  <p className="text-[9px] text-muted-foreground">Only 2 beds available in Branch 01</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-hms-warning/5 border-l-2 border-hms-warning">
                <Activity size={14} className="text-hms-warning mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-hms-warning">Equipment Maintenance Due</p>
                  <p className="text-[9px] text-muted-foreground">3 CT Scanners require calibration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Module Health */}
          <div className="bg-card border border-border rounded shadow-sm p-3">
            <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
              <Shield size={14} className="text-primary" /> Module Integration Status
            </h3>
            <div className="space-y-2.5">
              {[
                { label: 'OPD / IPD', status: 'Healthy', val: 98 },
                { label: 'Pharmacy', status: 'Healthy', val: 95 },
                { label: 'Lab / Radiology', status: 'Warning', val: 76, color: 'bg-hms-warning' },
                { label: 'Billing & Finance', status: 'Healthy', val: 92 },
                { label: 'Ambulance GPS', status: 'Offline', val: 0, color: 'bg-destructive' },
              ].map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold uppercase">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className={m.val > 80 ? 'text-hms-success' : m.val > 50 ? 'text-hms-warning' : 'text-destructive'}>{m.status}</span>
                  </div>
                  <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                    <div className={`${m.color || 'bg-hms-success'} h-full transition-all duration-500`} style={{ width: `${m.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Modal */}
      <Dialog open={showVitalsModal} onOpenChange={setShowVitalsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="text-primary" size={16} /> Patient Vitals: {selectedPatient?.patientName || selectedPatient?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Weight (kg)</Label>
              <Input type="number" value={vitalsData.weight} onChange={e => setVitalsData({...vitalsData, weight: e.target.value})} placeholder="70.5" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Height (cm)</Label>
              <Input type="number" value={vitalsData.height} onChange={e => setVitalsData({...vitalsData, height: e.target.value})} placeholder="170" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">BP (SYS/DIA)</Label>
              <Input value={vitalsData.bloodPressure} onChange={e => setVitalsData({...vitalsData, bloodPressure: e.target.value})} placeholder="120/80" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Temp (°C)</Label>
              <Input type="number" value={vitalsData.temperature} onChange={e => setVitalsData({...vitalsData, temperature: e.target.value})} placeholder="37.0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pulse (bpm)</Label>
              <Input type="number" value={vitalsData.pulseRate} onChange={e => setVitalsData({...vitalsData, pulseRate: e.target.value})} placeholder="72" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">SpO2 (%)</Label>
              <Input type="number" value={vitalsData.spo2} onChange={e => setVitalsData({...vitalsData, spo2: e.target.value})} placeholder="98" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Remarks</Label>
              <Input value={vitalsData.remark} onChange={e => setVitalsData({...vitalsData, remark: e.target.value})} placeholder="Patient stable..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVitalsModal(false)} className="text-[10px] h-8">Cancel</Button>
            <Button onClick={handleSaveVitals} disabled={isSavingVitals} className="text-[10px] h-8 hms-btn-primary">
              {isSavingVitals ? 'Saving...' : 'Save Vitals'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
