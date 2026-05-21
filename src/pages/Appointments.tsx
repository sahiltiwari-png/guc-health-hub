import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Plus, Edit, Trash2, Clock, CheckCircle2, 
  XCircle, User, UserPlus, Filter, RefreshCw, MoreVertical,
  CalendarDays, MapPin, Phone, AlertCircle, FileText, Printer,
  ChevronRight, ArrowRight, Check, X, Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAppointments, searchPatients, getAutoUsers, createAutoClinical, updateById, extractArray, updateAppointmentStatus,
  getApiV1Appointments, getApiV1AppointmentsByid, postApiV1Appointments, putApiV1AppointmentsByid, 
  deleteApiV1AppointmentsByid, patchApiV1AppointmentsByidStatus, getApiV1AppointmentsDaily, 
  getApiV1AppointmentsDoctorBydoctorId, getApiV1AppointmentsPatientBypatientId, getApiV1AppointmentsSearch
} from "@/api/apiService";

const statusColor = (s: string) => {
  const status = s?.toUpperCase();
  switch (status) {
    case 'BOOKED': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
    case 'WAITING': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'CHECKEDIN': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'IN_CONSULTATION': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'COMPLETED': return 'bg-hms-success text-hms-success-foreground border-transparent';
    case 'CANCELLED': return 'bg-destructive text-destructive-foreground border-transparent';
    case 'NO-SHOW': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-muted text-muted-foreground border-transparent';
  }
};

type Tab = 'all' | 'today' | 'upcoming' | 'completed' | 'cancelled' | 'availability';

const Appointments = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('all');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  
  // Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null); // 'appointment' | 'status' | 'cancel'
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams: any = { page: pagination.page, size: pagination.size };
      if (tab === 'today') queryParams.date = new Date().toISOString().split('T')[0];
      if (tab === 'completed') queryParams.status = 'COMPLETED';
      if (tab === 'cancelled') queryParams.status = 'CANCELLED';
      
      const [aRes, pRes, dRes] = await Promise.all([
        getApiV1Appointments(queryParams),
        searchPatients(),
        getAutoUsers({ role: 'DOCTOR' })
      ]);

      if (aRes.ok) {
        const content = aRes.data?.data?.content || aRes.data?.content || extractArray(aRes);
        setAppointments(content);
        const total = aRes.data?.data?.totalElements ?? aRes.data?.totalElements ?? 0;
        setPagination(prev => ({ ...prev, total }));
      }
      if (pRes.ok) {
        setPatients(extractArray(pRes));
      }
      if (dRes.ok) {
        setDoctors(extractArray(dRes));
      }
      
      // Mocking availability as there might not be a direct endpoint for it in clinicalDetails
      setAvailability([
        { id: '1', doctorId: { name: 'Dr. Sharma', role: 'Doctor' }, dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
      ]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({ title: 'Error', description: 'Failed to sync appointment data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  useEffect(() => {
    fetchData();
  }, [tab, pagination.page]);

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedItem.id) {
        const res = await putApiV1AppointmentsByid(selectedItem.id, selectedItem);
        if (res.ok) {
          toast({ title: 'Success', description: 'Appointment updated successfully' });
          fetchData();
        } else {
          throw new Error(res.data?.message || 'Update failed');
        }
      } else {
        const res = await postApiV1Appointments(selectedItem);
        if (res.ok) {
          toast({ title: 'Success', description: 'Appointment booked successfully' });
          fetchData();
        } else {
          throw new Error(res.data?.message || 'Booking failed');
        }
      }
      setShowModal(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Action failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await patchApiV1AppointmentsByidStatus(id, { status });
      if (res.ok) {
        toast({ title: 'Status Updated', description: `Appointment marked as ${status}` });
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Update failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Update failed', variant: 'destructive' });
    }
  };

  const handleCancelAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem.cancellationReason) {
      toast({ title: 'Required', description: 'Please provide a reason for cancellation', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await patchApiV1AppointmentsByidStatus(selectedItem.id, { 
        status: 'CANCELLED', 
        cancellationReason: selectedItem.cancellationReason 
      });
      if (res.ok) {
        toast({ title: 'Cancelled', description: 'Appointment has been cancelled' });
        fetchData();
        setShowModal(null);
      } else {
        throw new Error(res.data?.message || 'Cancellation failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Cancellation failed', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment record?')) return;
    try {
      const res = await deleteApiV1AppointmentsByid(id);
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Appointment record removed' });
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Delete failed');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Delete failed', variant: 'destructive' });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const res = await getApiV1AppointmentsSearch({ 
        patientName: search, // or other filters
        page: 0, 
        size: pagination.size 
      });
      if (res.ok) {
        const content = res.data?.data?.content || res.data?.content || extractArray(res);
        setAppointments(content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(a => 
    (a.patientName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (a.tokenNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (a.doctorName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (a.id?.toString() || '').includes(search.toLowerCase())
  ) : [];

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Header & Search */}
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> Appointment Management</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input 
              className="hms-input pl-7 w-60" 
              placeholder="Search by UHID, Name or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            className="hms-btn-primary flex items-center gap-1"
            onClick={() => {
              setSelectedItem({
                patientId: '',
                doctorId: '',
                appointmentDate: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                endTime: '09:30',
                consultationType: 'OPD',
                reason: ''
              });
              setShowModal('appointment');
            }}
          >
            <Plus size={14} /> Book Appointment
          </button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Today', value: Array.isArray(appointments) ? appointments.filter(a => a.visitTime && new Date(a.visitTime).toDateString() === new Date().toDateString()).length : 0, color: 'text-primary', icon: CalendarDays },
          { label: 'Confirmed', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'CONFIRMED').length : 0, color: 'text-hms-success', icon: CheckCircle2 },
          { label: 'Pending', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'WAITING').length : 0, color: 'text-amber-500', icon: Clock },
          { label: 'Completed', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'COMPLETED').length : 0, color: 'text-purple-500', icon: Check },
          { label: 'Cancelled', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'CANCELLED').length : 0, color: 'text-destructive', icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-3 flex items-center gap-4 shadow-sm hover:border-primary/50 transition-colors">
            <div className={`p-2 rounded-lg bg-muted/30 ${stat.color}`}><stat.icon size={20} /></div>
            <div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card px-2">
        {(['all', 'today', 'upcoming', 'completed', 'cancelled', 'availability'] as Tab[]).map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${tab === t ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-card border border-border overflow-auto min-h-[400px] flex flex-col shadow-sm rounded-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50 flex-1">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Syncing Appointments...</span>
          </div>
        ) : tab === 'availability' ? (
          <div className="p-4 flex-1">
            <div className="grid grid-cols-3 gap-4">
              {availability.map((avail: any) => (
                <div key={avail.id} className="border border-border p-4 rounded-lg bg-muted/5 hover:border-primary transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {avail.doctorId?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold group-hover:text-primary transition-colors">{avail.doctorId?.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">{avail.doctorId?.role || 'Doctor'}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-hms-success/10 text-hms-success px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
                  </div>
                  <div className="space-y-2 border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Calendar size={10} /> Day</span>
                      <span className="font-bold">{avail.dayOfWeek}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Clock size={10} /> Shift</span>
                      <span className="font-bold text-primary">{avail.startTime} - {avail.endTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1"><MapPin size={10} /> Branch</span>
                      <span className="font-bold">{avail.branchId?.name || 'Main'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="hms-table w-full border-collapse">
              <thead>
                <tr className="bg-[#cc0000] text-white">
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">S.No.</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Appt. ID</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Patient Details</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Doctor</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Date & Time</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Type</th>
                  <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Status</th>
                  <th className="text-white font-semibold py-1 px-2 text-left text-[11px]">Process</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {filteredAppointments.map((apt, i) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-1 px-2 border-r border-border text-center text-muted-foreground font-mono">
                      {pagination.page * pagination.size + i + 1}
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="font-bold text-primary font-mono text-[11px]">{apt.tokenNumber || `APT-${apt.id}`}</div>
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">Ref: #{apt.id}</div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary">
                          {apt.patientName?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div className="font-bold text-[11px] uppercase truncate max-w-[120px]">{apt.patientName || 'Unknown'}</div>
                          <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                            <Phone size={8} /> {apt.mobile || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="font-semibold text-[11px]">{apt.doctorName || '-'}</div>
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">{apt.departmentName || 'General'}</div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="font-bold text-[11px] flex items-center gap-1 text-muted-foreground">
                        <Calendar size={10} /> 
                        {apt.visitTime ? new Date(apt.visitTime).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-[10px] text-primary font-bold flex items-center gap-1">
                        <Clock size={10} /> 
                        {apt.visitTime ? new Date(apt.visitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (apt.slot || 'N/A')}
                      </div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <span className="text-[9px] border border-border px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{apt.visitType || 'OPD'}</span>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase border ${statusColor(apt.status)}`}>
                        {apt.status || 'BOOKED'}
                      </span>
                    </td>
                    <td className="py-0.5 px-2">
                      <div className="flex items-center gap-1">
                        {apt.status === 'WAITING' && (
                          <button 
                            className="w-5 h-5 flex items-center justify-center bg-green-600 text-white rounded-sm shadow-sm hover:bg-green-700 transition-colors" 
                            title="Confirm"
                            onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')}
                          >
                            <CheckCircle2 size={10} />
                          </button>
                        )}
                        <button 
                          className="w-5 h-5 flex items-center justify-center bg-[#ff0000] text-white rounded-sm shadow-sm hover:bg-[#cc0000] transition-colors" 
                          title="View"
                          onClick={() => { setSelectedItem(apt); setShowModal('appointment'); }}
                        >
                          <Eye size={10} />
                        </button>
                        <button 
                          className="w-5 h-5 flex items-center justify-center bg-[#17a2b8] text-white rounded-sm shadow-sm hover:bg-[#138496] transition-colors" 
                          title="Edit"
                          onClick={() => { setSelectedItem(apt); setShowModal('appointment'); }}
                        >
                          <Edit size={10} />
                        </button>
                        <button className="w-5 h-5 flex items-center justify-center bg-[#28a745] text-white rounded-sm shadow-sm" title="Print"><Printer size={10} /></button>
                        <button 
                          className="w-5 h-5 flex items-center justify-center bg-[#dc3545] text-white rounded-sm shadow-sm hover:bg-[#c82333] transition-colors" 
                          title="Cancel"
                          onClick={() => { setSelectedItem(apt); setShowModal('cancel'); }}
                        >
                          <XCircle size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Calendar size={48} className="opacity-10" />
                        <p className="text-sm font-semibold italic">No appointments found for this selection</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-card border border-border p-2 flex items-center justify-between text-[10px] font-bold">
        <div className="text-muted-foreground uppercase tracking-wider">Total Appointments: {pagination.total}</div>
        <div className="flex gap-2">
          <button 
            disabled={pagination.page === 0} 
            onClick={() => {
              const newPage = pagination.page - 1;
              setPagination(prev => ({ ...prev, page: newPage }));
              fetchData();
            }}
            className="px-3 py-1 bg-muted hover:bg-primary hover:text-white transition-colors disabled:opacity-50 uppercase tracking-tighter"
          >
            Previous
          </button>
          <span className="flex items-center px-4 bg-primary/10 text-primary rounded-sm">Page {pagination.page + 1}</span>
          <button 
            disabled={(pagination.page + 1) * pagination.size >= pagination.total} 
            onClick={() => {
              const newPage = pagination.page + 1;
              setPagination(prev => ({ ...prev, page: newPage }));
              fetchData();
            }}
            className="px-3 py-1 bg-muted hover:bg-primary hover:text-white transition-colors disabled:opacity-50 uppercase tracking-tighter"
          >
            Next
          </button>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal === 'appointment' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Calendar size={16} className="text-primary" /> {selectedItem?.id ? 'Reschedule Appointment' : 'Book New Appointment'}</h3>
              <button onClick={() => setShowModal(null)} className="hover:text-destructive transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Select Patient</label>
                  <select 
                    className="hms-select w-full font-semibold" 
                    required 
                    value={selectedItem?.patientId?.id || selectedItem?.patientId} 
                    onChange={e => setSelectedItem({...selectedItem, patientId: e.target.value})}
                    disabled={!!selectedItem?.id}
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Doctor</label>
                  <select 
                    className="hms-select w-full font-semibold" 
                    required 
                    value={selectedItem?.doctorId?.id || selectedItem?.doctorId} 
                    onChange={e => setSelectedItem({...selectedItem, doctorId: e.target.value})}
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.role || 'Doctor'})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Type</label>
                  <select 
                    className="hms-select w-full" 
                    value={selectedItem?.consultationType} 
                    onChange={e => setSelectedItem({...selectedItem, consultationType: e.target.value})}
                  >
                    <option value="OPD">OPD Consultation</option>
                    <option value="FollowUp">Follow-Up Visit</option>
                    <option value="VideoConsultation">Video Consultation</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Date</label>
                  <input 
                    type="date" 
                    className="hms-input w-full" 
                    required 
                    value={selectedItem?.appointmentDate ? new Date(selectedItem.appointmentDate).toISOString().split('T')[0] : ''} 
                    onChange={e => setSelectedItem({...selectedItem, appointmentDate: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Start</label>
                    <input type="time" className="hms-input w-full" required value={selectedItem?.startTime} onChange={e => setSelectedItem({...selectedItem, startTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">End</label>
                    <input type="time" className="hms-input w-full" required value={selectedItem?.endTime} onChange={e => setSelectedItem({...selectedItem, endTime: e.target.value})} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Reason for Visit</label>
                  <textarea 
                    className="hms-input w-full h-20 resize-none" 
                    value={selectedItem?.reason} 
                    onChange={e => setSelectedItem({...selectedItem, reason: e.target.value})} 
                    placeholder="Briefly describe the symptoms or reason..."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" className="hms-btn-secondary flex-1 py-2.5" onClick={() => setShowModal(null)}>Cancel</button>
                <button 
                  type="submit" 
                  className="hms-btn-primary flex-1 py-2.5 shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : selectedItem?.id ? 'Update Appointment' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showModal === 'cancel' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-destructive/5 text-destructive">
              <h3 className="text-sm font-bold flex items-center gap-2"><AlertCircle size={16} /> Cancel Appointment</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCancelAppointment} className="p-6 space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded text-[11px] text-destructive font-semibold">
                Warning: This action will mark the appointment as cancelled and notify the patient.
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Cancellation Reason</label>
                <textarea 
                  className="hms-input w-full h-24 resize-none border-destructive/30 focus:border-destructive" 
                  required 
                  value={selectedItem?.cancellationReason} 
                  onChange={e => setSelectedItem({...selectedItem, cancellationReason: e.target.value})}
                  placeholder="Why is this appointment being cancelled?"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="hms-btn-secondary flex-1 py-2" onClick={() => setShowModal(null)}>Go Back</button>
                <button 
                  type="submit" 
                  className="hms-btn-primary bg-destructive hover:bg-destructive/90 text-white flex-1 py-2 border-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
