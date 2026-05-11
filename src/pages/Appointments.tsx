import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Plus, Edit, Trash2, Clock, CheckCircle2, 
  XCircle, User, UserPlus, Filter, RefreshCw, MoreVertical,
  CalendarDays, MapPin, Phone, AlertCircle, FileText, Printer,
  ChevronRight, ArrowRight, Check, X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAutoClinicals, getAutoPatients, getAutoUsers, createAutoClinical, updateById
} from "@/api/apiService";

const statusColor = (s: string) => {
  switch (s) {
    case 'Booked': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
    case 'CheckedIn': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'In-Consultation': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Completed': return 'bg-hms-success text-hms-success-foreground border-transparent';
    case 'Cancelled': return 'bg-destructive text-destructive-foreground border-transparent';
    case 'No-Show': return 'bg-gray-100 text-gray-700 border-gray-200';
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
      const queryParams: any = {};
      if (tab === 'today') queryParams.date = new Date().toISOString().split('T')[0];
      if (tab === 'completed') queryParams.status = 'Completed';
      if (tab === 'cancelled') queryParams.status = 'Cancelled';
      
      const [aRes, pRes, dRes] = await Promise.all([
        getAutoClinicals(queryParams),
        getAutoPatients(),
        getAutoUsers({ role: 'DOCTOR' })
      ]);

      if (aRes.ok) {
        const data = aRes.data?.data || aRes.data;
        setAppointments(Array.isArray(data) ? data : (data?.clinicalDetails || []));
      }
      if (pRes.ok) {
        const data = pRes.data?.data || pRes.data;
        setPatients(Array.isArray(data) ? data : (data?.patients || []));
      }
      if (dRes.ok) {
        const data = dRes.data?.data || dRes.data;
        setDoctors(Array.isArray(data) ? data : (data?.users || data?.data || []));
      }
      
      // Mocking availability as there might not be a direct endpoint for it in clinicalDetails
      setAvailability([
        { _id: '1', doctorId: { name: 'Dr. Sharma', role: 'Doctor' }, dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' },
      ]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({ title: 'Error', description: 'Failed to sync appointment data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab]);

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedItem._id) {
        const res = await updateById(selectedItem._id, selectedItem);
        if (res.ok) {
          toast({ title: 'Success', description: 'Appointment updated successfully' });
          fetchData();
        } else {
          throw new Error(res.data?.message || 'Update failed');
        }
      } else {
        const res = await createAutoClinical(selectedItem);
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
      const res = await updateById(id, { status });
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
      const res = await updateById(selectedItem._id, { status: 'Cancelled', remark: selectedItem.cancellationReason });
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
      setAppointments(appointments.filter(a => a._id !== id));
      toast({ title: 'Deleted', description: 'Appointment record removed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Delete failed', variant: 'destructive' });
    }
  };

  const filteredAppointments = Array.isArray(appointments) ? appointments.filter(a => 
    a.patientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.appointmentNumber?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctorId?.name?.toLowerCase().includes(search.toLowerCase())
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
          { label: 'Total Today', value: Array.isArray(appointments) ? appointments.filter(a => new Date(a.appointmentDate).toDateString() === new Date().toDateString()).length : 0, color: 'text-primary', icon: CalendarDays },
          { label: 'Confirmed', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'Confirmed').length : 0, color: 'text-hms-success', icon: CheckCircle2 },
          { label: 'Pending', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'Booked').length : 0, color: 'text-amber-500', icon: Clock },
          { label: 'Checked In', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'CheckedIn').length : 0, color: 'text-purple-500', icon: UserPlus },
          { label: 'Cancelled', value: Array.isArray(appointments) ? appointments.filter(a => a.status === 'Cancelled').length : 0, color: 'text-destructive', icon: XCircle },
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
      <div className="flex-1 bg-card border border-border overflow-auto min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold uppercase tracking-widest">Syncing Appointments...</span>
          </div>
        ) : tab === 'availability' ? (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4">
              {availability.map((avail: any) => (
                <div key={avail._id} className="border border-border p-4 rounded-lg bg-muted/5 hover:border-primary transition-all group">
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
          <table className="hms-table w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="w-10">S.No</th>
                <th>Appt. ID</th>
                <th>Patient Details</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt, i) => (
                <tr key={apt._id} className="group hover:bg-muted/30 transition-colors">
                  <td className="text-center text-muted-foreground font-mono">{i + 1}</td>
                  <td>
                    <div className="font-bold text-primary font-mono text-[11px]">{apt.appointmentNumber}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-bold">Ref: {apt._id.slice(-6).toUpperCase()}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {apt.patientId?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{apt.patientId?.name || 'N/A'}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Phone size={8} /> {apt.patientId?.phone || 'No Contact'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-semibold text-sm">{apt.doctorId?.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">{apt.doctorId?.role || 'Consultant'}</div>
                  </td>
                  <td>
                    <div className="font-bold text-sm flex items-center gap-1"><Calendar size={12} className="text-muted-foreground" /> {new Date(apt.appointmentDate).toLocaleDateString()}</div>
                    <div className="text-[11px] text-primary font-bold flex items-center gap-1"><Clock size={12} /> {apt.startTime} - {apt.endTime}</div>
                  </td>
                  <td>
                    <span className="text-[10px] border border-border px-2 py-0.5 rounded font-bold uppercase tracking-wider">{apt.consultationType}</span>
                  </td>
                  <td>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${statusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {apt.status === 'Booked' && (
                        <button 
                          className="p-1.5 text-hms-success hover:bg-hms-success/10 rounded" 
                          title="Confirm"
                          onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button 
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded" 
                          title="Check In"
                          onClick={() => handleStatusUpdate(apt._id, 'CheckedIn')}
                        >
                          <UserPlus size={14} />
                        </button>
                      )}
                      <button 
                        className="p-1.5 text-primary hover:bg-primary/10 rounded" 
                        title="Edit"
                        onClick={() => { setSelectedItem(apt); setShowModal('appointment'); }}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded" 
                        title="Cancel"
                        onClick={() => { setSelectedItem(apt); setShowModal('cancel'); }}
                      >
                        <XCircle size={14} />
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
        )}
      </div>

      {/* Appointment Modal */}
      {showModal === 'appointment' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Calendar size={16} className="text-primary" /> {selectedItem?._id ? 'Reschedule Appointment' : 'Book New Appointment'}</h3>
              <button onClick={() => setShowModal(null)} className="hover:text-destructive transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveAppointment} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Select Patient</label>
                  <select 
                    className="hms-select w-full font-semibold" 
                    required 
                    value={selectedItem?.patientId?._id || selectedItem?.patientId} 
                    onChange={e => setSelectedItem({...selectedItem, patientId: e.target.value})}
                    disabled={!!selectedItem?._id}
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.phone})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block tracking-wider">Doctor</label>
                  <select 
                    className="hms-select w-full font-semibold" 
                    required 
                    value={selectedItem?.doctorId?._id || selectedItem?.doctorId} 
                    onChange={e => setSelectedItem({...selectedItem, doctorId: e.target.value})}
                  >
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.role || 'Doctor'})</option>)}
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
                  {isSubmitting ? 'Processing...' : selectedItem?._id ? 'Update Appointment' : 'Confirm Booking'}
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
