import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Users, Stethoscope, BedDouble, FlaskConical, CreditCard, ClipboardList,
  CalendarDays, Pill, TrendingUp, AlertCircle
} from 'lucide-react';

const stats = [
  { label: 'Total Patients', value: '12,847', icon: Users, change: '+23 today' },
  { label: 'OPD Today', value: '156', icon: Stethoscope, change: '42 pending' },
  { label: 'IPD Admitted', value: '89', icon: BedDouble, change: '12 discharged' },
  { label: 'Lab Tests', value: '234', icon: FlaskConical, change: '18 pending' },
  { label: 'Revenue Today', value: '₹4,52,300', icon: CreditCard, change: '+12%' },
  { label: 'Queue Waiting', value: '34', icon: ClipboardList, change: '5 departments' },
  { label: 'Day Care', value: '28', icon: CalendarDays, change: '6 completed' },
  { label: 'Pharmacy Orders', value: '89', icon: Pill, change: '12 pending' },
];

const recentOPD = [
  { sno: 1, uhid: 'U-1001', name: 'Mr. Rajesh Kumar', age: '45Y', gender: 'Male', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', time: '09:15 AM' },
  { sno: 2, uhid: 'U-1002', name: 'Mrs. Sunita Devi', age: '32Y', gender: 'Female', doctor: 'Dr. Priya Singh', dept: 'Gynecology', time: '09:30 AM' },
  { sno: 3, uhid: 'U-1003', name: 'Mr. Amit Sharma', age: '28Y', gender: 'Male', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', time: '09:45 AM' },
  { sno: 4, uhid: 'U-1004', name: 'Baby Riya', age: '2Y', gender: 'Female', doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', time: '10:00 AM' },
  { sno: 5, uhid: 'U-1005', name: 'Mr. Suresh Yadav', age: '55Y', gender: 'Male', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', time: '10:15 AM' },
];

const recentIPD = [
  { sno: 1, ipdId: 'IPD-501', name: 'Mrs. Kamla Devi', age: '60Y', bed: 'Ward-A/B-12', doctor: 'Dr. Rahul Verma', doa: '14-Feb-2026', status: 'Admitted' },
  { sno: 2, ipdId: 'IPD-502', name: 'Mr. Vikram Singh', age: '42Y', bed: 'ICU-03', doctor: 'Dr. Alok Mehta', doa: '13-Feb-2026', status: 'Critical' },
  { sno: 3, ipdId: 'IPD-503', name: 'Mrs. Anita Kumari', age: '35Y', bed: 'Ward-B/B-05', doctor: 'Dr. Priya Singh', doa: '15-Feb-2026', status: 'Stable' },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-card border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.change}</p>
                </div>
                <Icon size={28} className="text-primary opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent OPD */}
      <div className="mb-4">
        <div className="hms-section-header">Today's OPD Patients</div>
        <table className="hms-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>UHID</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOPD.map(p => (
              <tr key={p.sno}>
                <td>{p.sno}</td>
                <td>{p.uhid}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.doctor}</td>
                <td>{p.dept}</td>
                <td>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent IPD */}
      <div className="mb-4">
        <div className="hms-section-header">Current IPD Patients</div>
        <table className="hms-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>IPD ID</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Bed/Ward</th>
              <th>Doctor</th>
              <th>Date of Admission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentIPD.map(p => (
              <tr key={p.sno}>
                <td>{p.sno}</td>
                <td>{p.ipdId}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.bed}</td>
                <td>{p.doctor}</td>
                <td>{p.doa}</td>
                <td className={p.status === 'Critical' ? 'text-destructive font-bold' : ''}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alerts */}
      <div>
        <div className="hms-section-header flex items-center gap-2">
          <AlertCircle size={14} /> Alerts & Notifications
        </div>
        <div className="bg-card border border-border p-2 space-y-1">
          <p className="text-xs">⚠️ 5 Lab reports pending approval</p>
          <p className="text-xs">⚠️ 3 IPD patients due for discharge today</p>
          <p className="text-xs">⚠️ Low stock alert: Paracetamol 500mg (12 units remaining)</p>
          <p className="text-xs">⚠️ 2 Emergency cases in last 1 hour</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
