import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, UserPlus, Play, CheckCircle } from 'lucide-react';
import { getTokens, callToken, completeToken, listDepartments, listUsers } from '../api/apiService';
import { useToast } from '@/components/ui/use-toast';

const Queue = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    roomId: '',
    status: '',
    doctorId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tokenRes, deptRes, doctorRes] = await Promise.all([
        getTokens(filters),
        listDepartments(),
        listUsers({ role: 'Doctor' })
      ]);
      setTokens(tokenRes || []);
      setDepartments(deptRes.data || []);
      setDoctors(doctorRes.data || []);
    } catch (error) {
      console.error('Error fetching queue data:', error);
      toast({ title: 'Error', description: 'Failed to sync queue data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleCall = async (id: string) => {
    try {
      await callToken(id);
      toast({ title: 'Success', description: 'Patient called' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to call patient', variant: 'destructive' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeToken(id);
      toast({ title: 'Success', description: 'Visit completed' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to complete visit', variant: 'destructive' });
    }
  };

  const stats = [
    { label: 'Total in Queue', value: tokens.length, color: 'bg-primary text-primary-foreground' },
    { label: 'Waiting', value: tokens.filter((t: any) => t.status === 'Issued').length, color: 'bg-hms-warning text-foreground' },
    { label: 'In Progress', value: tokens.filter((t: any) => t.status === 'Called').length, color: 'bg-hms-info text-primary-foreground' },
    { label: 'Completed', value: tokens.filter((t: any) => t.status === 'Completed').length, color: 'bg-hms-success text-hms-success-foreground' },
  ];

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Users size={16} /> Patient Queue Management</div>
        <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
      </div>

      <div className="bg-card border border-border p-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Department:</label>
          <select className="hms-select min-w-[150px]">
            <option value="">All Departments</option>
            {departments.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Doctor:</label>
          <select className="hms-select min-w-[150px]" value={filters.doctorId} onChange={e => setFilters({...filters, doctorId: e.target.value})}>
            <option value="">All Doctors</option>
            {doctors.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Status:</label>
          <select className="hms-select min-w-[120px]" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="">All Status</option>
            <option value="Issued">Waiting</option>
            <option value="Called">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 my-1">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} px-4 py-3 shadow-sm text-center rounded-sm`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto">
        <table className="hms-table">
          <thead>
            <tr>
              <th>Token #</th>
              <th>Patient Name</th>
              <th>UHID</th>
              <th>Doctor</th>
              <th>Priority</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t: any) => (
              <tr key={t._id}>
                <td className="font-mono font-bold text-primary">#{t.tokenNumber}</td>
                <td className="font-semibold">{t.patientId?.patientName}</td>
                <td className="text-xs">{t.patientId?.uhid}</td>
                <td>{t.doctorId?.name}</td>
                <td>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${t.priority === 'Emergency' ? 'bg-destructive text-destructive-foreground' : t.priority === 'Urgent' ? 'bg-hms-warning' : 'bg-muted text-muted-foreground'}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="text-[10px]">{new Date(t.tokenDate).toLocaleTimeString()}</td>
                <td>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${t.status === 'Issued' ? 'bg-hms-warning' : t.status === 'Called' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-success text-hms-success-foreground'}`}>
                    {t.status === 'Issued' ? 'Waiting' : t.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {t.status === 'Issued' && (
                      <button className="hms-btn-primary flex items-center gap-1 text-[10px] px-2 py-1" onClick={() => handleCall(t._id)}>
                        <Play size={10} /> Call
                      </button>
                    )}
                    {t.status === 'Called' && (
                      <button className="hms-btn-success flex items-center gap-1 text-[10px] px-2 py-1 bg-hms-success text-hms-success-foreground" onClick={() => handleComplete(t._id)}>
                        <CheckCircle size={10} /> Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-muted-foreground italic text-sm">
                  No patients in the queue for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Queue;
