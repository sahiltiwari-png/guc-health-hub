import React, { useEffect, useState } from 'react';
import { 
  Users, Stethoscope, BedDouble, DollarSign, Activity, UserPlus, FileText,
  BarChart2, AlertCircle, Pill, FlaskConical, Calendar, Clock, 
  ClipboardList, CheckCircle, XCircle, TrendingUp, Package, HeartPulse,
  Building, Truck, Scan, Microscope, Droplets, Shield, CreditCard, 
  Baby, Skull, Award, UserCog, RotateCcw, KeyRound, Warehouse, 
  Monitor, UtensilsCrossed, Headphones, FileOutput, Scissors, Siren, 
  ChevronRight, MoreHorizontal, ArrowUp, ArrowDown, Phone, Mail, 
  Home, MapPin, CalendarCheck, Thermometer, BloodDrop, Weight,
  Zap, Database, Server, Wifi, Lock, Unlock, Bell, Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getAutoAssetsMasters, getAutoUsers, getAutoClinicals, 
  getAutoDashboardDoctor, getAutoDashboardPatient 
} from "@/api/apiService";

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
}

const MiniTable = ({ title, headers, rows, icon: Icon }: MiniTableProps) => (
  <div className="border border-border bg-card">
    <div className="hms-section-header flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} />}
        <span className="font-semibold">{title}</span>
      </div>
      <ChevronRight size={12} className="opacity-60" />
    </div>
    <div className="overflow-x-auto">
      <table className="hms-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="py-1 px-1.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="py-1 px-1.5">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>('RECEPTIONIST');
  const [stats, setStats] = useState({
    users: 0,
    patients: 0,
    assets: 0,
    appointments: 0,
    revenue: 0,
    activeBeds: 0,
    staffOnDuty: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<any[][]>([]);
  const [auditLogs, setAuditLogs] = useState<any[][]>([]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      console.log('[Dashboard] Fetching data for role:', role);
      
      // Role-specific data fetching
      if (role === 'DOCTOR' && user._id) {
        const docRes = await getAutoDashboardDoctor(user._id);
        if (docRes.ok && docRes.data) {
          setStats(prev => ({
            ...prev,
            appointments: docRes.data.appointments?.length || 0,
            pendingTasks: docRes.data.pendingProcedures?.length || 0
          }));
        } else if (!docRes.ok) {
          toast.error("Failed to fetch doctor dashboard data");
        }
      }

      // General data for all dashboards
      const [u, p, a, v] = await Promise.all([
        getAutoUsers(), 
        getAutoClinicals(), 
        getAutoAssetsMasters(),
        getAutoClinicals({ status: 'Waiting' })
      ]);
      
      if (!u.ok || !p.ok || !a.ok) {
        console.warn('[Dashboard] Some API calls failed');
      }

      setStats(prev => ({
        ...prev,
        users: u.ok ? (u.data?.total || u.data?.length || 0) : 0,
        patients: p.ok ? (p.data?.total || p.data?.length || 0) : 0,
        assets: a.ok ? (a.data?.total || a.data?.length || 0) : 0,
        appointments: role === 'SUPER_ADMIN' ? (v.ok ? (v.data?.total || v.data?.length || 0) : 0) : prev.appointments,
      }));

      if (u.ok && u.data) {
        const users = Array.isArray(u.data) ? u.data : (u.data.data || []);
        setRecentRegistrations(users.slice(0, 4).map((user: any) => [
          'Samrat', 'Noida', user.name || user.username, user.role || 'USER', 'Today'
        ]));
      }

      // Mock audit logs
      setAuditLogs([
        ['09:45 AM', 'admin', 'Login', '192.168.1.10'],
        ['09:42 AM', 'dr.sharma', 'Update Patient', '192.168.1.15'],
      ]);

    } catch (e: any) { 
      console.error('[Dashboard] Error fetching data:', e);
      setError(e.message || "An unexpected error occurred");
      toast.error("Failed to load dashboard data");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchDashboardData(); 
  }, []);

  useEffect(() => {
    if (user?.role) {
      const normalizedRole = user.role.toUpperCase() as UserRole;
      const validRoles: UserRole[] = ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'];
      setRole(validRoles.includes(normalizedRole) ? normalizedRole : 'RECEPTIONIST');
    }
  }, [user]);

  const SuperAdminDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Total Hospitals" value="1" icon={Building} trend={{ value: '+0', up: true }} />
        <StatCard label="Total Users" value={loading ? '...' : stats.users} icon={Users} trend={{ value: '+0', up: true }} />
        <StatCard label="Total Patients" value={loading ? '...' : stats.patients} icon={Users} trend={{ value: '+0', up: true }} />
        <StatCard label="Total Assets" value={loading ? '...' : stats.assets} icon={Package} trend={{ value: '+0', up: true }} />
        <StatCard label="Revenue (M)" value={`₹${stats.revenue}L`} icon={DollarSign} trend={{ value: '+0%', up: true }} />
        <StatCard label="Appointments" value={loading ? '...' : stats.appointments} icon={Calendar} trend={{ value: '+0', up: true }} />
        <StatCard label="Active Beds" value={`${stats.activeBeds}/50`} icon={BedDouble} color="text-green-600" />
        <StatCard label="Staff On Duty" value={stats.staffOnDuty} icon={UserCog} color="text-blue-600" />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Recent Registrations" 
            icon={UserPlus}
            headers={['Hospital', 'Branch', 'User', 'Role', 'Date']}
            rows={recentRegistrations.length > 0 ? recentRegistrations : [
              ['Samrat', 'Noida', 'Loading...', '...', '...'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="System Health" 
            icon={Server}
            headers={['Service', 'Status', 'Uptime', 'Load']}
            rows={[
              ['API Server', <span className="text-green-600">Online</span>, '99.9%', '45%'],
              ['Database', <span className="text-green-600">Healthy</span>, '99.8%', '32%'],
              ['Storage', <span className="text-yellow-600">Warning</span>, '100%', '78%'],
              ['Backup', <span className="text-green-600">Completed</span>, '-', '-'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="Branch Performance" 
            icon={Building2}
            headers={['Branch', 'Patients', 'Revenue', 'Status']}
            rows={[
              ['Noida', '4,521', '₹4.2L', <Star size={10} className="text-yellow-500" />],
              ['Delhi', '3,890', '₹3.8L', <Star size={10} className="text-yellow-500" />],
              ['Gurgaon', '2,450', '₹2.5L', ''],
              ['Ghaziabad', '1,589', '₹2.0L', ''],
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <MiniTable 
            title="Audit Logs" 
            icon={Shield}
            headers={['Time', 'User', 'Action', 'IP']}
            rows={[
              ['09:45 AM', 'admin', 'Login', '192.168.1.10'],
              ['09:42 AM', 'dr.sharma', 'Update Patient', '192.168.1.15'],
              ['09:40 AM', 'reception', 'Register Patient', '192.168.1.20'],
              ['09:35 AM', 'pharma', 'Dispense Medicine', '192.168.1.25'],
              ['09:30 AM', 'lab', 'Upload Report', '192.168.1.30'],
            ]}
          />
        </div>
        <div className="col-span-6">
          <MiniTable 
            title="Financial Summary" 
            icon={CreditCard}
            headers={['Type', 'Today', 'This Week', 'This Month']}
            rows={[
              ['OPD', '₹24,500', '₹1,56,800', '₹6,24,500'],
              ['IPD', '₹89,200', '₹5,42,100', '₹21,56,800'],
              ['Pharmacy', '₹12,450', '₹78,200', '₹3,12,400'],
              ['Lab', '₹8,900', '₹56,400', '₹2,24,500'],
            ]}
          />
        </div>
      </div>
    </div>
  );

  const DoctorDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Today's Appointments" value="24" icon={Calendar} trend={{ value: '+4', up: true }} />
        <StatCard label="Pending Prescriptions" value="8" icon={FileText} color="text-orange-600" />
        <StatCard label="Admitted Patients" value="5" icon={BedDouble} />
        <StatCard label="Surgeries Today" value="2" icon={Activity} color="text-red-600" />
        <StatCard label="Completed" value="12" icon={CheckCircle} color="text-green-600" />
        <StatCard label="In Queue" value="10" icon={Clock} />
        <StatCard label="Reports Pending" value="6" icon={FileText} color="text-blue-600" />
        <StatCard label="Avg Wait Time" value="18m" icon={Clock} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <MiniTable 
            title="Today's Appointments" 
            icon={CalendarCheck}
            headers={['Time', 'UHID', 'Patient', 'Age', 'Status']}
            rows={[
              ['09:00 AM', 'UH1234', 'Rajesh Kumar', '45', <span className="text-green-600">Completed</span>],
              ['09:30 AM', 'UH1235', 'Priya Singh', '32', <span className="text-green-600">Completed</span>],
              ['10:00 AM', 'UH1236', 'Amit Patel', '28', <span className="text-blue-600">In-Consultation</span>],
              ['10:30 AM', 'UH1237', 'Neha Sharma', '35', <span className="text-yellow-600">Waiting</span>],
              ['11:00 AM', 'UH1238', 'Rohan Verma', '52', <span className="text-yellow-600">Waiting</span>],
              ['11:30 AM', 'UH1239', 'Meera Joshi', '41', <span className="text-yellow-600">Waiting</span>],
            ]}
          />
        </div>
        <div className="col-span-6">
          <MiniTable 
            title="Admitted Patients" 
            icon={BedDouble}
            headers={['Bed', 'Patient', 'Age', 'Condition', 'Days']}
            rows={[
              ['ICU A1', 'Suresh Yadav', '62', <span className="text-red-600 font-bold">Critical</span>, '3'],
              ['General B3', 'Meera Joshi', '41', <span className="text-green-600">Stable</span>, '2'],
              ['ICU A2', 'Ramesh Gupta', '55', <span className="text-orange-600">Serious</span>, '1'],
              ['Private C1', 'Anita Singh', '38', <span className="text-green-600">Stable</span>, '4'],
              ['General D2', 'Vikram Sharma', '29', <span className="text-green-600">Improving</span>, '5'],
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Pending Reports" 
            icon={FileText}
            headers={['UHID', 'Patient', 'Test', 'Priority']}
            rows={[
              ['UH1234', 'Rajesh Kumar', 'Blood Count', <span className="text-orange-600">Normal</span>],
              ['UH1235', 'Priya Singh', 'CT Scan', <span className="text-red-600">Urgent</span>],
              ['UH1237', 'Neha Sharma', 'X-Ray', <span className="text-orange-600">Normal</span>],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="Today's Surgeries" 
            icon={Scissors}
            headers={['Time', 'OT', 'Patient', 'Procedure']}
            rows={[
              ['10:00 AM', 'OT 1', 'Ramesh Gupta', 'Appendectomy'],
              ['02:00 PM', 'OT 2', 'Suresh Yadav', 'Angioplasty'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell size={12} />
                <span className="font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full hms-btn-primary text-xs py-1 text-left">📝 New Prescription</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📋 Patient List</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">🔍 Search Patient</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📊 View Reports</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const NurseDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Patients to Monitor" value="12" icon={HeartPulse} />
        <StatCard label="Vitals Due" value="6" icon={Activity} color="text-orange-600" />
        <StatCard label="Medications Due" value="18" icon={Pill} color="text-red-600" />
        <StatCard label="Notes Pending" value="4" icon={ClipboardList} />
        <StatCard label="Vitals Taken" value="36" icon={CheckCircle} color="text-green-600" />
        <StatCard label="Medications Given" value="42" icon={Pill} color="text-green-600" />
        <StatCard label="Dressings Due" value="3" icon={Bandage} color="text-blue-600" />
        <StatCard label="IV Bags Due" value="2" icon={Droplets} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-7">
          <MiniTable 
            title="IPD Patients - Vitals Schedule" 
            icon={Thermometer}
            headers={['Bed', 'Patient', 'Last Vitals', 'Next Due', 'BP', 'Temp', 'SpO2', 'Status']}
            rows={[
              ['ICU A1', 'Suresh Yadav', '1hr ago', 'Now', '140/90', '101.2', '94%', <span className="text-red-600">Overdue</span>],
              ['General B3', 'Meera Joshi', '3hr ago', '1hr', '120/80', '98.6', '98%', <span className="text-yellow-600">Upcoming</span>],
              ['General C2', 'Rohan Verma', '30min ago', '3hr', '118/76', '98.4', '99%', <span className="text-green-600">On-time</span>],
              ['Private C1', 'Anita Singh', '2hr ago', '2hr', '125/82', '99.1', '97%', <span className="text-yellow-600">Upcoming</span>],
              ['ICU A2', 'Ramesh Gupta', '15min ago', '15min', '135/88', '100.5', '95%', <span className="text-red-600">Critical</span>],
              ['General D2', 'Vikram Sharma', '4hr ago', 'Now', '115/75', '98.2', '99%', <span className="text-red-600">Overdue</span>],
            ]}
          />
        </div>
        <div className="col-span-5">
          <MiniTable 
            title="Medications Due" 
            icon={Pill}
            headers={['Time', 'Patient', 'Bed', 'Medication', 'Dose']}
            rows={[
              ['Now', 'Suresh Yadav', 'ICU A1', 'Paracetamol', '500mg'],
              ['Now', 'Vikram Sharma', 'General D2', 'Vitamin D3', '1 tab'],
              ['10:00 AM', 'Meera Joshi', 'General B3', 'Antibiotic', '250mg'],
              ['10:30 AM', 'Anita Singh', 'Private C1', 'Painkiller', '1 tab'],
              ['11:00 AM', 'Ramesh Gupta', 'ICU A2', 'Insulin', '10 units'],
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Today's Tasks" 
            icon={ClipboardList}
            headers={['Task', 'Patient', 'Priority', 'Status']}
            rows={[
              ['Change Dressing', 'Suresh Yadav', <span className="text-red-600">High</span>, 'Pending'],
              ['Take Vitals', 'Vikram Sharma', <span className="text-orange-600">Medium</span>, 'Pending'],
              ['Assist Doctor', 'Meera Joshi', <span className="text-blue-600">Low</span>, 'Done'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="OPD Queue" 
            icon={Users}
            headers={['Token', 'Patient', 'Doctor', 'Status']}
            rows={[
              ['T001', 'Rajesh Kumar', 'Dr. Sharma', <span className="text-blue-600">In-Consultation</span>],
              ['T002', 'Priya Singh', 'Dr. Gupta', <span className="text-yellow-600">Waiting</span>],
              ['T003', 'Amit Patel', 'Dr. Sharma', <span className="text-yellow-600">Waiting</span>],
            ]}
          />
        </div>
        <div className="col-span-4">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={12} />
                <span className="font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full hms-btn-primary text-xs py-1 text-left">📊 Record Vitals</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">💊 Give Medication</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📝 Add Notes</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">🚨 Call Doctor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ReceptionistDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Today's Walk-ins" value="32" icon={UserPlus} trend={{ value: '+8', up: true }} />
        <StatCard label="Appointments" value="45" icon={Calendar} />
        <StatCard label="Registered" value="18" icon={Users} trend={{ value: '+5', up: true }} />
        <StatCard label="Token Queue" value="12" icon={Clock} />
        <StatCard label="Bills Generated" value="28" icon={FileText} color="text-green-600" />
        <StatCard label="Payments Received" value="₹45,200" icon={DollarSign} />
        <StatCard label="Pending Payments" value="3" icon={AlertCircle} color="text-orange-600" />
        <StatCard label="Avg Wait Time" value="12m" icon={Clock} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <MiniTable 
            title="Current Queue" 
            icon={Users}
            headers={['Token', 'Patient', 'Age', 'Doctor', 'Time', 'Status']}
            rows={[
              ['T001', 'Rajesh Kumar', '45', 'Dr. Sharma', '09:00', <span className="text-blue-600">In-Consultation</span>],
              ['T002', 'Priya Singh', '32', 'Dr. Gupta', '09:15', <span className="text-yellow-600">Waiting</span>],
              ['T003', 'Amit Patel', '28', 'Dr. Sharma', '09:30', <span className="text-yellow-600">Waiting</span>],
              ['T004', 'Neha Sharma', '35', 'Dr. Verma', '09:45', <span className="text-yellow-600">Waiting</span>],
              ['T005', 'Rohan Verma', '52', 'Dr. Gupta', '10:00', <span className="text-yellow-600">Waiting</span>],
            ]}
          />
        </div>
        <div className="col-span-7">
          <MiniTable 
            title="Today's Appointments" 
            icon={Calendar}
            headers={['Time', 'Patient', 'Age', 'Gender', 'Doctor', 'Dept', 'Status']}
            rows={[
              ['09:00 AM', 'Rajesh Kumar', '45', 'M', 'Dr. Sharma', 'Gen Med', <span className="text-green-600">Completed</span>],
              ['09:30 AM', 'Priya Singh', '32', 'F', 'Dr. Gupta', 'Gyne', <span className="text-green-600">Completed</span>],
              ['10:00 AM', 'Amit Patel', '28', 'M', 'Dr. Sharma', 'Gen Med', <span className="text-blue-600">In-Consultation</span>],
              ['10:30 AM', 'Neha Sharma', '35', 'F', 'Dr. Verma', 'Cardio', <span className="text-yellow-600">Waiting</span>],
              ['11:00 AM', 'Rohan Verma', '52', 'M', 'Dr. Gupta', 'Ortho', <span className="text-yellow-600">Waiting</span>],
              ['11:30 AM', 'Meera Joshi', '41', 'F', 'Dr. Sharma', 'Gen Med', <span className="text-yellow-600">Waiting</span>],
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Recent Registrations" 
            icon={UserPlus}
            headers={['UHID', 'Patient', 'Age', 'Gender', 'Time']}
            rows={[
              ['UH1250', 'Vikram Singh', '29', 'M', '09:45 AM'],
              ['UH1249', 'Anita Patel', '38', 'F', '09:30 AM'],
              ['UH1248', 'Ramesh Yadav', '55', 'M', '09:15 AM'],
              ['UH1247', 'Sunita Sharma', '42', 'F', '09:00 AM'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="Today's Payments" 
            icon={CreditCard}
            headers={['UHID', 'Patient', 'Amount', 'Mode', 'Status']}
            rows={[
              ['UH1234', 'Rajesh Kumar', '₹500', 'Cash', <span className="text-green-600">Paid</span>],
              ['UH1235', 'Priya Singh', '₹1,200', 'UPI', <span className="text-green-600">Paid</span>],
              ['UH1236', 'Amit Patel', '₹800', 'Card', <span className="text-orange-600">Pending</span>],
            ]}
          />
        </div>
        <div className="col-span-4">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={12} />
                <span className="font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full hms-btn-primary text-xs py-1 text-left">➕ New Patient</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📅 Book Appointment</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">🎫 Generate Token</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">💳 Generate Bill</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PharmacistDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Prescriptions" value="15" icon={FileText} trend={{ value: '+3', up: true }} />
        <StatCard label="Dispensed" value="42" icon={Pill} trend={{ value: '+8', up: true }} />
        <StatCard label="Low Stock" value="8" icon={AlertCircle} color="text-orange-600" />
        <StatCard label="Sales Today" value="₹8,450" icon={DollarSign} />
        <StatCard label="Returns" value="2" icon={XCircle} color="text-red-600" />
        <StatCard label="Pending Orders" value="3" icon={Package} color="text-blue-600" />
        <StatCard label="Expiring Soon" value="5" icon={Calendar} color="text-orange-600" />
        <StatCard label="Avg Dispense" value="2m" icon={Clock} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <MiniTable 
            title="Pending Prescriptions" 
            icon={FileText}
            headers={['Rx ID', 'UHID', 'Patient', 'Doctor', 'Priority', 'Time']}
            rows={[
              ['RX001', 'UH1234', 'Rajesh Kumar', 'Dr. Sharma', <span className="text-orange-600">Normal</span>, '09:15 AM'],
              ['RX002', 'UH1235', 'Priya Singh', 'Dr. Gupta', <span className="text-red-600">Urgent</span>, '09:30 AM'],
              ['RX003', 'UH1236', 'Amit Patel', 'Dr. Sharma', <span className="text-orange-600">Normal</span>, '09:45 AM'],
              ['RX004', 'UH1237', 'Neha Sharma', 'Dr. Verma', <span className="text-red-600">Urgent</span>, '10:00 AM'],
              ['RX005', 'UH1238', 'Rohan Verma', 'Dr. Gupta', <span className="text-orange-600">Normal</span>, '10:15 AM'],
            ]}
          />
        </div>
        <div className="col-span-6">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertCircle size={12} />
                <span className="font-semibold">Low Stock Alert</span>
              </div>
            </div>
            <table className="hms-table">
              <thead>
                <tr>
                  <th className="py-1 px-1.5">Medicine</th>
                  <th className="py-1 px-1.5">Stock</th>
                  <th className="py-1 px-1.5">Reorder</th>
                  <th className="py-1 px-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-1.5">Paracetamol 500mg</td>
                  <td className="py-1 px-1.5">12</td>
                  <td className="py-1 px-1.5">100</td>
                  <td className="py-1 px-1.5"><span className="text-red-600">Critical</span></td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5">Amoxicillin 250mg</td>
                  <td className="py-1 px-1.5">8</td>
                  <td className="py-1 px-1.5">50</td>
                  <td className="py-1 px-1.5"><span className="text-red-600">Critical</span></td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5">Insulin Injection</td>
                  <td className="py-1 px-1.5">5</td>
                  <td className="py-1 px-1.5">20</td>
                  <td className="py-1 px-1.5"><span className="text-red-600">Critical</span></td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5">Vitamin D3</td>
                  <td className="py-1 px-1.5">10</td>
                  <td className="py-1 px-1.5">50</td>
                  <td className="py-1 px-1.5"><span className="text-orange-600">Low</span></td>
                </tr>
                <tr>
                  <td className="py-1 px-1.5">Cough Syrup</td>
                  <td className="py-1 px-1.5">15</td>
                  <td className="py-1 px-1.5">30</td>
                  <td className="py-1 px-1.5"><span className="text-orange-600">Low</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Today's Dispenses" 
            icon={CheckCircle}
            headers={['Rx ID', 'Patient', 'Amount', 'Time']}
            rows={[
              ['RX000', 'Suresh Yadav', '₹450', '09:00 AM'],
              ['RX001', 'Meera Joshi', '₹850', '09:15 AM'],
              ['RX002', 'Rohan Verma', '₹320', '09:30 AM'],
              ['RX003', 'Anita Singh', '₹1,200', '09:45 AM'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="Expiring Soon" 
            icon={Calendar}
            headers={['Medicine', 'Batch', 'Expiry', 'Qty']}
            rows={[
              ['Aspirin 100mg', 'B1234', 'May 2026', '45'],
              ['Vitamin C', 'B5678', 'Jun 2026', '23'],
              ['Antacid Gel', 'B9012', 'Jul 2026', '15'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={12} />
                <span className="font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full hms-btn-primary text-xs py-1 text-left">💊 Dispense Medicine</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📦 Receive Stock</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">🔍 Search Medicine</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📊 Sales Report</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LabTechnicianDashboard = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-2">
        <StatCard label="Samples Received" value="28" icon={FlaskConical} trend={{ value: '+5', up: true }} />
        <StatCard label="Tests Pending" value="12" icon={ClipboardList} color="text-orange-600" />
        <StatCard label="Reports" value="8" icon={FileText} color="text-blue-600" />
        <StatCard label="Completed" value="35" icon={CheckCircle} color="text-green-600" />
        <StatCard label="In Progress" value="15" icon={Activity} />
        <StatCard label="Critical Results" value="3" icon={AlertCircle} color="text-red-600" />
        <StatCard label="QC Passed" value="98%" icon={CheckCircle} color="text-green-600" />
        <StatCard label="Avg TAT" value="45m" icon={Clock} />
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <MiniTable 
            title="Pending Tests" 
            icon={FlaskConical}
            headers={['Sample ID', 'UHID', 'Patient', 'Test', 'Priority', 'Collected', 'Status']}
            rows={[
              ['S001', 'UH1234', 'Rajesh Kumar', 'Blood Count', <span className="text-orange-600">Normal</span>, '09:00 AM', <span className="text-blue-600">Processing</span>],
              ['S002', 'UH1235', 'Priya Singh', 'CT Scan', <span className="text-red-600">Urgent</span>, '09:15 AM', <span className="text-yellow-600">Queued</span>],
              ['S003', 'UH1236', 'Amit Patel', 'X-Ray Chest', <span className="text-orange-600">Normal</span>, '09:30 AM', <span className="text-yellow-600">Queued</span>],
              ['S004', 'UH1237', 'Neha Sharma', 'Blood Sugar', <span className="text-red-600">Urgent</span>, '09:45 AM', <span className="text-blue-600">Processing</span>],
              ['S005', 'UH1238', 'Rohan Verma', 'Urine Test', <span className="text-orange-600">Normal</span>, '10:00 AM', <span className="text-yellow-600">Queued</span>],
            ]}
          />
        </div>
        <div className="col-span-6">
          <MiniTable 
            title="Reports to Approve" 
            icon={FileText}
            headers={['Report ID', 'UHID', 'Patient', 'Test', 'Result', 'Action']}
            rows={[
              ['R001', 'UH1239', 'Rohan Verma', 'Blood Sugar', '120 mg/dL', <button className="hms-btn-primary text-xs py-0 px-2">Approve</button>],
              ['R002', 'UH1240', 'Meera Joshi', 'Urine Test', 'Normal', <button className="hms-btn-primary text-xs py-0 px-2">Approve</button>],
              ['R003', 'UH1241', 'Vikram Singh', 'Blood Count', <span className="text-red-600">Abnormal</span>, <button className="hms-btn-primary text-xs py-0 px-2">Review</button>],
              ['R004', 'UH1242', 'Anita Patel', 'ECG', 'Normal', <button className="hms-btn-primary text-xs py-0 px-2">Approve</button>],
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <MiniTable 
            title="Today's Completed" 
            icon={CheckCircle}
            headers={['Sample', 'Patient', 'Test', 'Time']}
            rows={[
              ['S000', 'Suresh Yadav', 'Lipid Profile', '08:45 AM'],
              ['S001', 'Meera Joshi', 'LFT', '09:00 AM'],
              ['S002', 'Rohan Verma', 'KFT', '09:15 AM'],
              ['S003', 'Anita Singh', 'CBC', '09:30 AM'],
            ]}
          />
        </div>
        <div className="col-span-4">
          <MiniTable 
            title="Critical Results" 
            icon={AlertCircle}
            headers={['Sample', 'Patient', 'Test', 'Value']}
            rows={[
              ['S010', 'Ramesh Gupta', 'Troponin', <span className="text-red-600">Elevated</span>],
              ['S015', 'Suresh Yadav', 'WBC Count', <span className="text-red-600">High</span>],
              ['S020', 'Priya Singh', 'Platelets', <span className="text-red-600">Low</span>],
            ]}
          />
        </div>
        <div className="col-span-4">
          <div className="border border-border bg-card">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap size={12} />
                <span className="font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button className="w-full hms-btn-primary text-xs py-1 text-left">🧪 Run Test</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📝 Enter Results</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">✅ Approve Report</button>
              <button className="w-full hms-btn-secondary text-xs py-1 text-left">📊 QC Check</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard />;
      case 'DOCTOR':
        return <DoctorDashboard />;
      case 'NURSE':
        return <NurseDashboard />;
      case 'RECEPTIONIST':
        return <ReceptionistDashboard />;
      case 'PHARMACIST':
        return <PharmacistDashboard />;
      case 'LAB_TECHNICIAN':
        return <LabTechnicianDashboard />;
      default:
        return <ReceptionistDashboard />;
    }
  };

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{role.replace('_', ' ')} Dashboard</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Welcome, {user?.name || 'User'}</span>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

const Building2 = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
);

const Bandage = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 10.5a2 2 0 0 1 2 2 2 2 0 0 1 2-2 2 2 0 0 1-2-2 2 2 0 0 1-2 2"/>
    <rect x="5" y="8" width="14" height="8" rx="2"/>
    <line x1="4" x2="6" y1="8" y2="8"/>
    <line x1="4" x2="6" y1="16" y2="16"/>
    <line x1="18" x2="20" y1="8" y2="8"/>
    <line x1="18" x2="20" y1="16" y2="16"/>
  </svg>
);

export default Dashboard;
