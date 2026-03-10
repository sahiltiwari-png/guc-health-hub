
import React, { useEffect, useState } from 'react';
import { Users, Stethoscope, BedDouble, DollarSign, Activity, UserPlus, FileText, BarChart2, AlertCircle } from 'lucide-react';
import { getDashboardStats, listVisits, getIPDAdmissions } from '../api/apiService';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentOPD, setRecentOPD] = useState([]);
  const [recentIPD, setRecentIPD] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getDashboardStats();
        const formattedStats = [
          { label: 'Total Patients', value: statsData.totalPatients.toLocaleString(), icon: Users },
          { label: 'OPD Today', value: statsData.opdToday.toLocaleString(), icon: Stethoscope },
          { label: 'IPD Admitted', value: statsData.ipdAdmitted.toLocaleString(), icon: BedDouble },
          { label: 'Total Earnings', value: `₹${statsData.totalEarnings.toLocaleString()}`, icon: DollarSign },
        ];
        setStats(formattedStats);

        const opdVisitsResponse = await listVisits({ visitType: 'OPD', limit: 5 });
        setRecentOPD(opdVisitsResponse.data || []);

        const ipdAdmissions = await getIPDAdmissions();
        setRecentIPD(ipdAdmissions.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

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
            {recentOPD.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td>{p.patientId?.uhid}</td>
                <td className="font-semibold">{p.patientId?.patientName}</td>
                <td>{p.patientId?.age}</td>
                <td>{p.patientId?.gender}</td>
                <td>{p.doctorId?.name}</td>
                <td>{p.departmentName}</td>
                <td>{p.visitTime}</td>
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
            {recentIPD.map((p, index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                <td className="font-medium text-primary">{p.admissionNumber}</td>
                <td className="font-semibold">{p.patientId?.patientName}</td>
                <td>{p.patientId?.age}</td>
                <td>{p.bedId?.ward} / {p.bedId?.bedNumber}</td>
                <td>{p.treatingDoctors?.map(d => d.name).join(', ')}</td>
                <td>{new Date(p.admissionDate).toLocaleDateString()}</td>
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
