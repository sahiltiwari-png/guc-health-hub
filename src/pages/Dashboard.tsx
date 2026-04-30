
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

type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'LAB_TECHNICIAN';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; up: boolean };
  color?: string;
}

const StatCard: React.FC&lt;StatCardProps&gt; = ({ label, value, icon: Icon, trend, color }) =&gt; (
  &lt;div className="bg-card border border-border p-2.5 hover:border-primary/50 transition-colors"&gt;
    &lt;div className="flex items-start justify-between mb-1.5"&gt;
      &lt;div className="flex items-center gap-1.5"&gt;
        &lt;Icon size={16} className={color || 'text-primary opacity-70'} /&gt;
        &lt;p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide"&gt;{label}&lt;/p&gt;
      &lt;/div&gt;
      {trend &amp;&amp; (
        &lt;div className={`flex items-center gap-0.5 text-[9px] font-semibold ${trend.up ? 'text-green-600' : 'text-red-600'}`}&gt;
          {trend.up ? &lt;ArrowUp size={10} /&gt; : &lt;ArrowDown size={10} /&gt;}
          {trend.value}
        &lt;/div&gt;
      )}
    &lt;/div&gt;
    &lt;p className="text-lg font-bold text-foreground leading-tight"&gt;{value}&lt;/p&gt;
  &lt;/div&gt;
);

interface MiniTableProps {
  title: string;
  headers: string[];
  rows: any[][];
  icon?: React.ElementType;
}

const MiniTable: React.FC&lt;MiniTableProps&gt; = ({ title, headers, rows, icon: Icon }) =&gt; (
  &lt;div className="border border-border bg-card"&gt;
    &lt;div className="hms-section-header flex items-center justify-between"&gt;
      &lt;div className="flex items-center gap-1.5"&gt;
        {Icon &amp;&amp; &lt;Icon size={12} /&gt;}
        &lt;span className="font-semibold"&gt;{title}&lt;/span&gt;
      &lt;/div&gt;
      &lt;ChevronRight size={12} className="opacity-60" /&gt;
    &lt;/div&gt;
    &lt;div className="overflow-x-auto"&gt;
      &lt;table className="hms-table"&gt;
        &lt;thead&gt;
          &lt;tr&gt;
            {headers.map((h, i) =&gt; (
              &lt;th key={i} className="py-1 px-1.5"&gt;{h}&lt;/th&gt;
            ))}
          &lt;/tr&gt;
        &lt;/thead&gt;
        &lt;tbody&gt;
          {rows.map((row, i) =&gt; (
            &lt;tr key={i}&gt;
              {row.map((cell, j) =&gt; (
                &lt;td key={j} className="py-1 px-1.5"&gt;{cell}&lt;/td&gt;
              ))}
            &lt;/tr&gt;
          ))}
        &lt;/tbody&gt;
      &lt;/table&gt;
    &lt;/div&gt;
  &lt;/div&gt;
);

const Dashboard = () =&gt; {
  const { user } = useAuth();
  const [role, setRole] = useState&lt;UserRole&gt;('RECEPTIONIST');

  useEffect(() =&gt; {
    if (user?.role) {
      const normalizedRole = user.role.toUpperCase() as UserRole;
      const validRoles: UserRole[] = ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'];
      setRole(validRoles.includes(normalizedRole) ? normalizedRole : 'RECEPTIONIST');
    }
  }, [user]);

  const SuperAdminDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Total Hospitals" value="12" icon={Building} trend={{ value: '+1', up: true }} /&gt;
        &lt;StatCard label="Total Users" value="245" icon={Users} trend={{ value: '+12', up: true }} /&gt;
        &lt;StatCard label="Total Patients" value="12,450" icon={Users} trend={{ value: '+245', up: true }} /&gt;
        &lt;StatCard label="Revenue (M)" value="₹12.5L" icon={DollarSign} trend={{ value: '+8.2%', up: true }} /&gt;
        &lt;StatCard label="Appointments" value="1,245" icon={Calendar} trend={{ value: '+15%', up: true }} /&gt;
        &lt;StatCard label="Active Beds" value="42/50" icon={BedDouble} color="text-green-600" /&gt;
        &lt;StatCard label="Staff On Duty" value="89" icon={UserCog} color="text-blue-600" /&gt;
        &lt;StatCard label="Pending Tasks" value="24" icon={AlertCircle} color="text-orange-600" /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Recent Registrations" 
            icon={UserPlus}
            headers={['Hospital', 'Branch', 'User', 'Role', 'Date']}
            rows={[
              ['Samrat', 'Noida', 'Dr. Sharma', 'DOCTOR', 'Today'],
              ['Samrat', 'Delhi', 'Nurse Priya', 'NURSE', 'Today'],
              ['Apollo', 'Gurgaon', 'Rohit', 'RECEPTIONIST', 'Yesterday'],
              ['Fortis', 'Noida', 'Amit', 'PHARMACIST', 'Yesterday'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="System Health" 
            icon={Server}
            headers={['Service', 'Status', 'Uptime', 'Load']}
            rows={[
              ['API Server', &lt;span className="text-green-600"&gt;Online&lt;/span&gt;, '99.9%', '45%'],
              ['Database', &lt;span className="text-green-600"&gt;Healthy&lt;/span&gt;, '99.8%', '32%'],
              ['Storage', &lt;span className="text-yellow-600"&gt;Warning&lt;/span&gt;, '100%', '78%'],
              ['Backup', &lt;span className="text-green-600"&gt;Completed&lt;/span&gt;, '-', '-'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Branch Performance" 
            icon={Building2}
            headers={['Branch', 'Patients', 'Revenue', 'Status']}
            rows={[
              ['Noida', '4,521', '₹4.2L', &lt;Star size={10} className="text-yellow-500" /&gt;],
              ['Delhi', '3,890', '₹3.8L', &lt;Star size={10} className="text-yellow-500" /&gt;],
              ['Gurgaon', '2,450', '₹2.5L', ''],
              ['Ghaziabad', '1,589', '₹2.0L', ''],
            ]}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
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
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Financial Summary" 
            icon={CreditCard}
            headers={['Type', 'Today', 'This Week', 'This Month']}
            rows={[
              ['OPD', '₹24,500', '₹1,56,800', '₹6,24,500'],
              ['IPD', '₹89,200', '₹5,42,100', '₹21,56,800'],
              ['Pharmacy', '₹12,450', '₹78,200', '₹3,12,400'],
              ['Lab', '₹8,900', '₹56,400', '₹2,24,500'],
            ]}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const DoctorDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Today's Appointments" value="24" icon={Calendar} trend={{ value: '+4', up: true }} /&gt;
        &lt;StatCard label="Pending Prescriptions" value="8" icon={FileText} color="text-orange-600" /&gt;
        &lt;StatCard label="Admitted Patients" value="5" icon={BedDouble} /&gt;
        &lt;StatCard label="Surgeries Today" value="2" icon={Activity} color="text-red-600" /&gt;
        &lt;StatCard label="Completed" value="12" icon={CheckCircle} color="text-green-600" /&gt;
        &lt;StatCard label="In Queue" value="10" icon={Clock} /&gt;
        &lt;StatCard label="Reports Pending" value="6" icon={FileText} color="text-blue-600" /&gt;
        &lt;StatCard label="Avg Wait Time" value="18m" icon={Clock} /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Today's Appointments" 
            icon={CalendarCheck}
            headers={['Time', 'UHID', 'Patient', 'Age', 'Status']}
            rows={[
              ['09:00 AM', 'UH1234', 'Rajesh Kumar', '45', &lt;span className="text-green-600"&gt;Completed&lt;/span&gt;],
              ['09:30 AM', 'UH1235', 'Priya Singh', '32', &lt;span className="text-green-600"&gt;Completed&lt;/span&gt;],
              ['10:00 AM', 'UH1236', 'Amit Patel', '28', &lt;span className="text-blue-600"&gt;In-Consultation&lt;/span&gt;],
              ['10:30 AM', 'UH1237', 'Neha Sharma', '35', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['11:00 AM', 'UH1238', 'Rohan Verma', '52', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['11:30 AM', 'UH1239', 'Meera Joshi', '41', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Admitted Patients" 
            icon={BedDouble}
            headers={['Bed', 'Patient', 'Age', 'Condition', 'Days']}
            rows={[
              ['ICU A1', 'Suresh Yadav', '62', &lt;span className="text-red-600 font-bold"&gt;Critical&lt;/span&gt;, '3'],
              ['General B3', 'Meera Joshi', '41', &lt;span className="text-green-600"&gt;Stable&lt;/span&gt;, '2'],
              ['ICU A2', 'Ramesh Gupta', '55', &lt;span className="text-orange-600"&gt;Serious&lt;/span&gt;, '1'],
              ['Private C1', 'Anita Singh', '38', &lt;span className="text-green-600"&gt;Stable&lt;/span&gt;, '4'],
              ['General D2', 'Vikram Sharma', '29', &lt;span className="text-green-600"&gt;Improving&lt;/span&gt;, '5'],
            ]}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Pending Reports" 
            icon={FileText}
            headers={['UHID', 'Patient', 'Test', 'Priority']}
            rows={[
              ['UH1234', 'Rajesh Kumar', 'Blood Count', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;],
              ['UH1235', 'Priya Singh', 'CT Scan', &lt;span className="text-red-600"&gt;Urgent&lt;/span&gt;],
              ['UH1237', 'Neha Sharma', 'X-Ray', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Today's Surgeries" 
            icon={Scissors}
            headers={['Time', 'OT', 'Patient', 'Procedure']}
            rows={[
              ['10:00 AM', 'OT 1', 'Ramesh Gupta', 'Appendectomy'],
              ['02:00 PM', 'OT 2', 'Suresh Yadav', 'Angioplasty'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;Bell size={12} /&gt;
                &lt;span className="font-semibold"&gt;Quick Actions&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-2 space-y-1"&gt;
              &lt;button className="w-full hms-btn-primary text-xs py-1 text-left"&gt;📝 New Prescription&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📋 Patient List&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;🔍 Search Patient&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📊 View Reports&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const NurseDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Patients to Monitor" value="12" icon={HeartPulse} /&gt;
        &lt;StatCard label="Vitals Due" value="6" icon={Activity} color="text-orange-600" /&gt;
        &lt;StatCard label="Medications Due" value="18" icon={Pill} color="text-red-600" /&gt;
        &lt;StatCard label="Notes Pending" value="4" icon={ClipboardList} /&gt;
        &lt;StatCard label="Vitals Taken" value="36" icon={CheckCircle} color="text-green-600" /&gt;
        &lt;StatCard label="Medications Given" value="42" icon={Pill} color="text-green-600" /&gt;
        &lt;StatCard label="Dressings Due" value="3" icon={Bandage} color="text-blue-600" /&gt;
        &lt;StatCard label="IV Bags Due" value="2" icon={Droplets} color="text-purple-600" /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-7"&gt;
          &lt;MiniTable 
            title="IPD Patients - Vitals Schedule" 
            icon={Thermometer}
            headers={['Bed', 'Patient', 'Last Vitals', 'Next Due', 'BP', 'Temp', 'SpO2', 'Status']}
            rows={[
              ['ICU A1', 'Suresh Yadav', '1hr ago', 'Now', '140/90', '101.2', '94%', &lt;span className="text-red-600"&gt;Overdue&lt;/span&gt;],
              ['General B3', 'Meera Joshi', '3hr ago', '1hr', '120/80', '98.6', '98%', &lt;span className="text-yellow-600"&gt;Upcoming&lt;/span&gt;],
              ['General C2', 'Rohan Verma', '30min ago', '3hr', '118/76', '98.4', '99%', &lt;span className="text-green-600"&gt;On-time&lt;/span&gt;],
              ['Private C1', 'Anita Singh', '2hr ago', '2hr', '125/82', '99.1', '97%', &lt;span className="text-yellow-600"&gt;Upcoming&lt;/span&gt;],
              ['ICU A2', 'Ramesh Gupta', '15min ago', '15min', '135/88', '100.5', '95%', &lt;span className="text-red-600"&gt;Critical&lt;/span&gt;],
              ['General D2', 'Vikram Sharma', '4hr ago', 'Now', '115/75', '98.2', '99%', &lt;span className="text-red-600"&gt;Overdue&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-5"&gt;
          &lt;MiniTable 
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
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Today's Tasks" 
            icon={ClipboardList}
            headers={['Task', 'Patient', 'Priority', 'Status']}
            rows={[
              ['Change Dressing', 'Suresh Yadav', &lt;span className="text-red-600"&gt;High&lt;/span&gt;, 'Pending'],
              ['Take Vitals', 'Vikram Sharma', &lt;span className="text-orange-600"&gt;Medium&lt;/span&gt;, 'Pending'],
              ['Assist Doctor', 'Meera Joshi', &lt;span className="text-blue-600"&gt;Low&lt;/span&gt;, 'Done'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="OPD Queue" 
            icon={Users}
            headers={['Token', 'Patient', 'Doctor', 'Status']}
            rows={[
              ['T001', 'Rajesh Kumar', 'Dr. Sharma', &lt;span className="text-blue-600"&gt;In-Consultation&lt;/span&gt;],
              ['T002', 'Priya Singh', 'Dr. Gupta', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['T003', 'Amit Patel', 'Dr. Sharma', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;Zap size={12} /&gt;
                &lt;span className="font-semibold"&gt;Quick Actions&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-2 space-y-1"&gt;
              &lt;button className="w-full hms-btn-primary text-xs py-1 text-left"&gt;📊 Record Vitals&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;💊 Give Medication&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📝 Add Notes&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;🚨 Call Doctor&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const ReceptionistDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Today's Walk-ins" value="32" icon={UserPlus} trend={{ value: '+8', up: true }} /&gt;
        &lt;StatCard label="Appointments" value="45" icon={Calendar} /&gt;
        &lt;StatCard label="Registered" value="18" icon={Users} trend={{ value: '+5', up: true }} /&gt;
        &lt;StatCard label="Token Queue" value="12" icon={Clock} /&gt;
        &lt;StatCard label="Bills Generated" value="28" icon={FileText} color="text-green-600" /&gt;
        &lt;StatCard label="Payments Received" value="₹45,200" icon={DollarSign} /&gt;
        &lt;StatCard label="Pending Payments" value="3" icon={AlertCircle} color="text-orange-600" /&gt;
        &lt;StatCard label="Avg Wait Time" value="12m" icon={Clock} /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-5"&gt;
          &lt;MiniTable 
            title="Current Queue" 
            icon={Users}
            headers={['Token', 'Patient', 'Age', 'Doctor', 'Time', 'Status']}
            rows={[
              ['T001', 'Rajesh Kumar', '45', 'Dr. Sharma', '09:00', &lt;span className="text-blue-600"&gt;In-Consultation&lt;/span&gt;],
              ['T002', 'Priya Singh', '32', 'Dr. Gupta', '09:15', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['T003', 'Amit Patel', '28', 'Dr. Sharma', '09:30', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['T004', 'Neha Sharma', '35', 'Dr. Verma', '09:45', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['T005', 'Rohan Verma', '52', 'Dr. Gupta', '10:00', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-7"&gt;
          &lt;MiniTable 
            title="Today's Appointments" 
            icon={Calendar}
            headers={['Time', 'Patient', 'Age', 'Gender', 'Doctor', 'Dept', 'Status']}
            rows={[
              ['09:00 AM', 'Rajesh Kumar', '45', 'M', 'Dr. Sharma', 'Gen Med', &lt;span className="text-green-600"&gt;Completed&lt;/span&gt;],
              ['09:30 AM', 'Priya Singh', '32', 'F', 'Dr. Gupta', 'Gyne', &lt;span className="text-green-600"&gt;Completed&lt;/span&gt;],
              ['10:00 AM', 'Amit Patel', '28', 'M', 'Dr. Sharma', 'Gen Med', &lt;span className="text-blue-600"&gt;In-Consultation&lt;/span&gt;],
              ['10:30 AM', 'Neha Sharma', '35', 'F', 'Dr. Verma', 'Cardio', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['11:00 AM', 'Rohan Verma', '52', 'M', 'Dr. Gupta', 'Ortho', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
              ['11:30 AM', 'Meera Joshi', '41', 'F', 'Dr. Sharma', 'Gen Med', &lt;span className="text-yellow-600"&gt;Waiting&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Recent Registrations" 
            icon={UserPlus}
            headers={['UHID', 'Patient', 'Age', 'Gender', 'Time']}
            rows={[
              ['UH1250', 'Vikram Singh', '29', 'M', '09:45 AM'],
              ['UH1249', 'Anita Patel', '38', 'F', '09:30 AM'],
              ['UH1248', 'Ramesh Yadav', '55', 'M', '09:15 AM'],
              ['UH1247', 'Sunita Sharma', '42', 'F', '09:00 AM'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Today's Payments" 
            icon={CreditCard}
            headers={['UHID', 'Patient', 'Amount', 'Mode', 'Status']}
            rows={[
              ['UH1234', 'Rajesh Kumar', '₹500', 'Cash', &lt;span className="text-green-600"&gt;Paid&lt;/span&gt;],
              ['UH1235', 'Priya Singh', '₹1,200', 'UPI', &lt;span className="text-green-600"&gt;Paid&lt;/span&gt;],
              ['UH1236', 'Amit Patel', '₹800', 'Card', &lt;span className="text-orange-600"&gt;Pending&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;Zap size={12} /&gt;
                &lt;span className="font-semibold"&gt;Quick Actions&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-2 space-y-1"&gt;
              &lt;button className="w-full hms-btn-primary text-xs py-1 text-left"&gt;➕ New Patient&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📅 Book Appointment&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;🎫 Generate Token&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;💳 Generate Bill&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const PharmacistDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Prescriptions" value="15" icon={FileText} trend={{ value: '+3', up: true }} /&gt;
        &lt;StatCard label="Dispensed" value="42" icon={Pill} trend={{ value: '+8', up: true }} /&gt;
        &lt;StatCard label="Low Stock" value="8" icon={AlertCircle} color="text-orange-600" /&gt;
        &lt;StatCard label="Sales Today" value="₹8,450" icon={DollarSign} /&gt;
        &lt;StatCard label="Returns" value="2" icon={XCircle} color="text-red-600" /&gt;
        &lt;StatCard label="Pending Orders" value="3" icon={Package} color="text-blue-600" /&gt;
        &lt;StatCard label="Expiring Soon" value="5" icon={Calendar} color="text-orange-600" /&gt;
        &lt;StatCard label="Avg Dispense" value="2m" icon={Clock} /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Pending Prescriptions" 
            icon={FileText}
            headers={['Rx ID', 'UHID', 'Patient', 'Doctor', 'Priority', 'Time']}
            rows={[
              ['RX001', 'UH1234', 'Rajesh Kumar', 'Dr. Sharma', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '09:15 AM'],
              ['RX002', 'UH1235', 'Priya Singh', 'Dr. Gupta', &lt;span className="text-red-600"&gt;Urgent&lt;/span&gt;, '09:30 AM'],
              ['RX003', 'UH1236', 'Amit Patel', 'Dr. Sharma', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '09:45 AM'],
              ['RX004', 'UH1237', 'Neha Sharma', 'Dr. Verma', &lt;span className="text-red-600"&gt;Urgent&lt;/span&gt;, '10:00 AM'],
              ['RX005', 'UH1238', 'Rohan Verma', 'Dr. Gupta', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '10:15 AM'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-6"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;AlertCircle size={12} /&gt;
                &lt;span className="font-semibold"&gt;Low Stock Alert&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;table className="hms-table"&gt;
              &lt;thead&gt;
                &lt;tr&gt;
                  &lt;th className="py-1 px-1.5"&gt;Medicine&lt;/th&gt;
                  &lt;th className="py-1 px-1.5"&gt;Stock&lt;/th&gt;
                  &lt;th className="py-1 px-1.5"&gt;Reorder&lt;/th&gt;
                  &lt;th className="py-1 px-1.5"&gt;Status&lt;/th&gt;
                &lt;/tr&gt;
              &lt;/thead&gt;
              &lt;tbody&gt;
                &lt;tr&gt;
                  &lt;td className="py-1 px-1.5"&gt;Paracetamol 500mg&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;12&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;100&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;&lt;span className="text-red-600"&gt;Critical&lt;/span&gt;&lt;/td&gt;
                &lt;/tr&gt;
                &lt;tr&gt;
                  &lt;td className="py-1 px-1.5"&gt;Amoxicillin 250mg&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;8&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;50&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;&lt;span className="text-red-600"&gt;Critical&lt;/span&gt;&lt;/td&gt;
                &lt;/tr&gt;
                &lt;tr&gt;
                  &lt;td className="py-1 px-1.5"&gt;Insulin Injection&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;5&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;20&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;&lt;span className="text-red-600"&gt;Critical&lt;/span&gt;&lt;/td&gt;
                &lt;/tr&gt;
                &lt;tr&gt;
                  &lt;td className="py-1 px-1.5"&gt;Vitamin D3&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;10&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;50&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;&lt;span className="text-orange-600"&gt;Low&lt;/span&gt;&lt;/td&gt;
                &lt;/tr&gt;
                &lt;tr&gt;
                  &lt;td className="py-1 px-1.5"&gt;Cough Syrup&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;15&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;30&lt;/td&gt;
                  &lt;td className="py-1 px-1.5"&gt;&lt;span className="text-orange-600"&gt;Low&lt;/span&gt;&lt;/td&gt;
                &lt;/tr&gt;
              &lt;/tbody&gt;
            &lt;/table&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Today's Dispenses" 
            icon={CheckCircle}
            headers={['Rx ID', 'Patient', 'Amount', 'Time']}
            rows={[
              ['RX000', 'Suresh Yadav', '₹450', '09:00 AM'],
              ['RX001', 'Meera Joshi', '₹850', '09:15 AM'],
              ['RX002', 'Rohan Verma', '₹320', '09:30 AM'],
              ['RX003', 'Anita Singh', '₹1,200', '09:45 AM'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Expiring Soon" 
            icon={Calendar}
            headers={['Medicine', 'Batch', 'Expiry', 'Qty']}
            rows={[
              ['Aspirin 100mg', 'B1234', 'May 2026', '45'],
              ['Vitamin C', 'B5678', 'Jun 2026', '23'],
              ['Antacid Gel', 'B9012', 'Jul 2026', '15'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;Zap size={12} /&gt;
                &lt;span className="font-semibold"&gt;Quick Actions&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-2 space-y-1"&gt;
              &lt;button className="w-full hms-btn-primary text-xs py-1 text-left"&gt;💊 Dispense Medicine&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📦 Receive Stock&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;🔍 Search Medicine&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📊 Sales Report&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const LabTechnicianDashboard = () =&gt; (
    &lt;div className="space-y-3"&gt;
      &lt;div className="grid grid-cols-8 gap-2"&gt;
        &lt;StatCard label="Samples Received" value="28" icon={FlaskConical} trend={{ value: '+5', up: true }} /&gt;
        &lt;StatCard label="Tests Pending" value="12" icon={ClipboardList} color="text-orange-600" /&gt;
        &lt;StatCard label="Reports" value="8" icon={FileText} color="text-blue-600" /&gt;
        &lt;StatCard label="Completed" value="35" icon={CheckCircle} color="text-green-600" /&gt;
        &lt;StatCard label="In Progress" value="15" icon={Activity} /&gt;
        &lt;StatCard label="Critical Results" value="3" icon={AlertCircle} color="text-red-600" /&gt;
        &lt;StatCard label="QC Passed" value="98%" icon={CheckCircle} color="text-green-600" /&gt;
        &lt;StatCard label="Avg TAT" value="45m" icon={Clock} /&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Pending Tests" 
            icon={FlaskConical}
            headers={['Sample ID', 'UHID', 'Patient', 'Test', 'Priority', 'Collected', 'Status']}
            rows={[
              ['S001', 'UH1234', 'Rajesh Kumar', 'Blood Count', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '09:00 AM', &lt;span className="text-blue-600"&gt;Processing&lt;/span&gt;],
              ['S002', 'UH1235', 'Priya Singh', 'CT Scan', &lt;span className="text-red-600"&gt;Urgent&lt;/span&gt;, '09:15 AM', &lt;span className="text-yellow-600"&gt;Queued&lt;/span&gt;],
              ['S003', 'UH1236', 'Amit Patel', 'X-Ray Chest', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '09:30 AM', &lt;span className="text-yellow-600"&gt;Queued&lt;/span&gt;],
              ['S004', 'UH1237', 'Neha Sharma', 'Blood Sugar', &lt;span className="text-red-600"&gt;Urgent&lt;/span&gt;, '09:45 AM', &lt;span className="text-blue-600"&gt;Processing&lt;/span&gt;],
              ['S005', 'UH1238', 'Rohan Verma', 'Urine Test', &lt;span className="text-orange-600"&gt;Normal&lt;/span&gt;, '10:00 AM', &lt;span className="text-yellow-600"&gt;Queued&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-6"&gt;
          &lt;MiniTable 
            title="Reports to Approve" 
            icon={FileText}
            headers={['Report ID', 'UHID', 'Patient', 'Test', 'Result', 'Action']}
            rows={[
              ['R001', 'UH1239', 'Rohan Verma', 'Blood Sugar', '120 mg/dL', &lt;button className="hms-btn-primary text-xs py-0 px-2"&gt;Approve&lt;/button&gt;],
              ['R002', 'UH1240', 'Meera Joshi', 'Urine Test', 'Normal', &lt;button className="hms-btn-primary text-xs py-0 px-2"&gt;Approve&lt;/button&gt;],
              ['R003', 'UH1241', 'Vikram Singh', 'Blood Count', &lt;span className="text-red-600"&gt;Abnormal&lt;/span&gt;, &lt;button className="hms-btn-primary text-xs py-0 px-2"&gt;Review&lt;/button&gt;],
              ['R004', 'UH1242', 'Anita Patel', 'ECG', 'Normal', &lt;button className="hms-btn-primary text-xs py-0 px-2"&gt;Approve&lt;/button&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="grid grid-cols-12 gap-2"&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Today's Completed" 
            icon={CheckCircle}
            headers={['Sample', 'Patient', 'Test', 'Time']}
            rows={[
              ['S000', 'Suresh Yadav', 'Lipid Profile', '08:45 AM'],
              ['S001', 'Meera Joshi', 'LFT', '09:00 AM'],
              ['S002', 'Rohan Verma', 'KFT', '09:15 AM'],
              ['S003', 'Anita Singh', 'CBC', '09:30 AM'],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;MiniTable 
            title="Critical Results" 
            icon={AlertCircle}
            headers={['Sample', 'Patient', 'Test', 'Value']}
            rows={[
              ['S010', 'Ramesh Gupta', 'Troponin', &lt;span className="text-red-600"&gt;Elevated&lt;/span&gt;],
              ['S015', 'Suresh Yadav', 'WBC Count', &lt;span className="text-red-600"&gt;High&lt;/span&gt;],
              ['S020', 'Priya Singh', 'Platelets', &lt;span className="text-red-600"&gt;Low&lt;/span&gt;],
            ]}
          /&gt;
        &lt;/div&gt;
        &lt;div className="col-span-4"&gt;
          &lt;div className="border border-border bg-card"&gt;
            &lt;div className="hms-section-header flex items-center justify-between"&gt;
              &lt;div className="flex items-center gap-1.5"&gt;
                &lt;Zap size={12} /&gt;
                &lt;span className="font-semibold"&gt;Quick Actions&lt;/span&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div className="p-2 space-y-1"&gt;
              &lt;button className="w-full hms-btn-primary text-xs py-1 text-left"&gt;🧪 Run Test&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📝 Enter Results&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;✅ Approve Report&lt;/button&gt;
              &lt;button className="w-full hms-btn-secondary text-xs py-1 text-left"&gt;📊 QC Check&lt;/button&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );

  const renderDashboard = () =&gt; {
    switch (role) {
      case 'SUPER_ADMIN':
        return &lt;SuperAdminDashboard /&gt;;
      case 'DOCTOR':
        return &lt;DoctorDashboard /&gt;;
      case 'NURSE':
        return &lt;NurseDashboard /&gt;;
      case 'RECEPTIONIST':
        return &lt;ReceptionistDashboard /&gt;;
      case 'PHARMACIST':
        return &lt;PharmacistDashboard /&gt;;
      case 'LAB_TECHNICIAN':
        return &lt;LabTechnicianDashboard /&gt;;
      default:
        return &lt;ReceptionistDashboard /&gt;;
    }
  };

  return (
    &lt;div&gt;
      &lt;div className="mb-2.5 flex items-center justify-between"&gt;
        &lt;div className="flex items-center gap-3"&gt;
          &lt;h2 className="text-xl font-bold"&gt;{role.replace('_', ' ')} Dashboard&lt;/h2&gt;
          &lt;span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"&gt;
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          &lt;/span&gt;
        &lt;/div&gt;
        &lt;div className="flex items-center gap-2"&gt;
          &lt;span className="text-xs text-muted-foreground"&gt;Welcome, {user?.name || 'User'}&lt;/span&gt;
          &lt;div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold"&gt;
            {(user?.name || 'U').charAt(0).toUpperCase()}
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      {renderDashboard()}
    &lt;/div&gt;
  );
};

const Building2 = ({ size = 24 }: { size?: number }) =&gt; (
  &lt;svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"&gt;
    &lt;rect width="16" height="20" x="4" y="2" rx="2" ry="2"/&gt;
    &lt;path d="M9 22v-4h6v4"/&gt;
    &lt;path d="M8 6h.01"/&gt;
    &lt;path d="M16 6h.01"/&gt;
    &lt;path d="M12 6h.01"/&gt;
    &lt;path d="M12 10h.01"/&gt;
    &lt;path d="M12 14h.01"/&gt;
    &lt;path d="M16 10h.01"/&gt;
    &lt;path d="M16 14h.01"/&gt;
    &lt;path d="M8 10h.01"/&gt;
    &lt;path d="M8 14h.01"/&gt;
  &lt;/svg&gt;
);

const Bandage = ({ size = 24 }: { size?: number }) =&gt; (
  &lt;svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"&gt;
    &lt;path d="M10 10.5a2 2 0 0 1 2 2 2 2 0 0 1 2-2 2 2 0 0 1-2-2 2 2 0 0 1-2 2"/&gt;
    &lt;rect x="5" y="8" width="14" height="8" rx="2"/&gt;
    &lt;line x1="4" x2="6" y1="8" y2="8"/&gt;
    &lt;line x1="4" x2="6" y1="16" y2="16"/&gt;
    &lt;line x1="18" x2="20" y1="8" y2="8"/&gt;
    &lt;line x1="18" x2="20" y1="16" y2="16"/&gt;
  &lt;/svg&gt;
);

export default Dashboard;
