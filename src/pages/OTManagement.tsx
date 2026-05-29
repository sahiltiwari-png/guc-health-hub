import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Eye, 
  Edit, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Printer, 
  Calendar, 
  Upload, 
  FileVideo, 
  FileImage, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { 
  getOtDashboardStats,
  searchOtBookings,
  getOtBookingById,
  createOtBooking,
  updateOtBooking,
  startOtSurgery,
  completeOtSurgery,
  cancelOtSurgery,
  extractArray,
  getAutoUsers,
  getAutoDepartments
} from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 
    'RUNNING': 'bg-green-700 text-white', 
    'SCHEDULED': 'bg-blue-700 text-white', 
    'COMPLETED': 'bg-green-800 text-white', 
    'PREPARING': 'bg-yellow-600 text-white', 
    'CANCELLED': 'bg-red-700 text-white', 
    'IN_PROGRESS': 'bg-green-700 text-white',
    'Available': 'bg-green-700 text-white', 
    'Occupied': 'bg-red-700 text-white', 
    'Cleaning': 'bg-yellow-600 text-white', 
    'Emergency': 'bg-red-700 text-white', 
    'Elective': 'bg-blue-700 text-white', 
    'Done': 'bg-green-700 text-white', 
    'Pending': 'bg-yellow-600 text-white', 
    'GA': 'bg-purple-700 text-white', 
    'SA': 'bg-blue-700 text-white', 
    'LA': 'bg-green-700 text-white' 
  };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const preOpChecklist = [
  { item: 'Consent Form Signed', responsible: 'Surgeon', status: 'Done' },
  { item: 'Anesthesia Fitness', responsible: 'Anesthesiologist', status: 'Done' },
  { item: 'Blood Group & Cross Match', responsible: 'Lab', status: 'Done' },
  { item: 'NPO Status (8 hrs)', responsible: 'Nursing', status: 'Done' },
  { item: 'Pre-Op Investigations (CBC, RFT, LFT)', responsible: 'Lab', status: 'Done' },
  { item: 'ECG/Chest X-Ray', responsible: 'Cardiology/Radiology', status: 'Done' },
  { item: 'IV Line Secured', responsible: 'Nursing', status: 'Pending' },
  { item: 'Surgical Site Marking', responsible: 'Surgeon', status: 'Pending' },
  { item: 'Blood Reserved (2 Units)', responsible: 'Blood Bank', status: 'Done' },
  { item: 'Antibiotic Prophylaxis', responsible: 'Surgeon', status: 'Pending' },
];

const OTManagement = () => {
  const tabs = ['Dashboard','OT Schedule','Running Surgeries','OT Booking','Post-Op Notes'];
  const [tab, setTab] = useState('Dashboard');
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [dashboardBookings, setDashboardBookings] = useState<any[]>([]);

  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    surgeonId: '',
    anesthetistId: '',
    departmentId: '',
    procedureName: '',
    scheduleDate: '',
    durationInMinutes: '',
    otRoomNumber: '',
    anesthesiaType: '',
    scrubNurse: '',
    circulatingNurse: '',
    preOpInstructions: '',
    priority: 'NORMAL',
    notes: '',
    videoRecordingUrl: ''
  });

  useEffect(() => {
    if (selectedBooking) {
      setBookingForm({
        patientId: selectedBooking.patient?.id || '',
        surgeonId: selectedBooking.surgeon?.id || '',
        anesthetistId: selectedBooking.anesthetist?.id || '',
        departmentId: selectedBooking.department?.id || '',
        procedureName: selectedBooking.procedureName || '',
        scheduleDate: selectedBooking.scheduleDate ? selectedBooking.scheduleDate.substring(0, 16) : '',
        durationInMinutes: selectedBooking.durationInMinutes || '',
        otRoomNumber: selectedBooking.otRoomNumber || '',
        anesthesiaType: selectedBooking.anesthesiaType || '',
        scrubNurse: selectedBooking.scrubNurse || '',
        circulatingNurse: selectedBooking.circulatingNurse || '',
        preOpInstructions: selectedBooking.preOpInstructions || '',
        priority: selectedBooking.priority || 'NORMAL',
        notes: selectedBooking.notes || '',
        videoRecordingUrl: selectedBooking.videoRecordingUrl || ''
      });
    } else {
      setBookingForm({
        patientId: '',
        surgeonId: '',
        anesthetistId: '',
        departmentId: '',
        procedureName: '',
        scheduleDate: '',
        durationInMinutes: '',
        otRoomNumber: '',
        anesthesiaType: '',
        scrubNurse: '',
        circulatingNurse: '',
        preOpInstructions: '',
        priority: 'NORMAL',
        notes: '',
        videoRecordingUrl: ''
      });
    }
  }, [selectedBooking]);

  const handleSaveBooking = async () => {
    setLoading(true);
    try {
      let res;
      if (isEditing && selectedBooking?.id) {
        res = await updateOtBooking(selectedBooking.id, bookingForm);
      } else {
        res = await createOtBooking(bookingForm);
      }

      if (res.ok) {
        toast({ title: "Success", description: `OT Booking ${isEditing ? 'updated' : 'created'} successfully.` });
        setTab('OT Schedule');
        refreshViews();
      } else {
        toast({ title: "Error", description: "Failed to save booking.", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // Search Filters
  const [filters, setFilters] = useState({
    surgeonId: '',
    departmentId: '',
    status: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchDashboardStats = async () => {
    try {
      const [sRes, bRes] = await Promise.all([
        getOtDashboardStats(),
        searchOtBookings({
          start: new Date().toISOString().split('T')[0] + 'T00:00:00',
          end: new Date().toISOString().split('T')[0] + 'T23:59:59',
          page: 0,
          size: 50
        })
      ]);
      if (sRes.ok) setStats(sRes.data?.data || sRes.data);
      if (bRes.ok) {
        const data = bRes.data?.data || bRes.data;
        setDashboardBookings(data?.content || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const [sRes, dRes] = await Promise.all([
        getAutoUsers({ role: 'DOCTOR' }),
        getAutoDepartments()
      ]);
      if (sRes.ok) setSurgeons(extractArray(sRes));
      if (dRes.ok) setDepartments(extractArray(dRes));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchBookings = async (p = 0, statusOverride?: string) => {
    setLoading(true);
    
    // Clean up filters to remove empty strings, null, or undefined values for the URL
    const queryParams = Object.fromEntries(
      Object.entries({
        surgeonId: filters.surgeonId || undefined,
        departmentId: filters.departmentId || undefined,
        status: statusOverride || filters.status || undefined,
        start: filters.date ? `${filters.date}T00:00:00` : undefined,
        end: filters.date ? `${filters.date}T23:59:59` : undefined,
        page: p,
        size: 10
      }).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
    );

    try {
      const res = await searchOtBookings(queryParams);
      if (res.ok) {
        const data = res.data?.data || res.data;
        setBookings(data?.content || []);
        setTotalPages(data?.totalPages || 0);
        setPage(p);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await getOtBookingById(id);
      if (res.ok) {
        const data = res.data?.data || res.data;
        setSelectedBooking(data);
        setIsEditing(false);
        setTab('OT Booking');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await getOtBookingById(id);
      if (res.ok) {
        const data = res.data?.data || res.data;
        setSelectedBooking(data);
        setIsEditing(true);
        setTab('OT Booking');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'start' | 'complete' | 'cancel', id: number) => {
    if (action === 'complete') {
      setSelectedBooking({ id });
      setActionNotes('');
      setShowCompleteModal(true);
      return;
    }
    if (action === 'cancel') {
      setSelectedBooking({ id });
      setActionReason('');
      setShowCancelModal(true);
      return;
    }

    try {
      let res;
      if (action === 'start') {
        res = await startOtSurgery(id);
      }

      if (res?.ok) {
        toast({ title: "Success", description: `Surgery ${action}ed successfully.` });
        refreshViews();
      } else {
        toast({ title: "Error", description: `Failed to ${action} surgery.`, variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteSurgery = async () => {
    if (!selectedBooking?.id) return;
    setLoading(true);
    try {
      const res = await completeOtSurgery(selectedBooking.id, { postOpNotes: actionNotes });
      if (res.ok) {
        toast({ title: "Success", description: "Surgery completed successfully." });
        setShowCompleteModal(false);
        refreshViews();
      } else {
        toast({ title: "Error", description: "Failed to complete surgery.", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSurgery = async () => {
    if (!selectedBooking?.id) return;
    setLoading(true);
    try {
      const res = await cancelOtSurgery(selectedBooking.id, { reason: actionReason });
      if (res.ok) {
        toast({ title: "Success", description: "Surgery cancelled successfully." });
        setShowCancelModal(false);
        refreshViews();
      } else {
        toast({ title: "Error", description: "Failed to cancel surgery.", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshViews = () => {
    if (tab === 'Running Surgeries') handleSearchBookings(page, 'RUNNING');
    else if (tab === 'Post-Op Notes') handleSearchBookings(page, 'COMPLETED');
    else handleSearchBookings(page);
    fetchDashboardStats();
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (tab === 'Dashboard') {
      handleSearchBookings(0);
    } else if (tab === 'OT Schedule') {
      handleSearchBookings(0);
    } else if (tab === 'Running Surgeries') {
      handleSearchBookings(0, 'RUNNING');
    } else if (tab === 'Post-Op Notes') {
      handleSearchBookings(0, 'COMPLETED');
    }
  }, [tab, filters]);

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Scissors size={14} /> Operation Theatre Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[
              { l: 'Total OTs', v: stats?.totalOTs || '0', s: `${stats?.runningOTs || 0} Running` },
              { l: 'Surgeries Today', v: stats?.surgeriesToday?.total || '0', s: `${stats?.surgeriesToday?.running || 0} Running, ${stats?.surgeriesToday?.scheduled || 0} Scheduled` },
              { l: 'Emergency', v: stats?.emergency?.count || '0', s: stats?.emergency?.locations?.join(', ') || 'None' },
              { l: 'Avg Duration', v: stats?.avgDuration || '0 hrs', s: 'This Week' },
              { l: 'Utilization', v: stats?.utilization || '0%', s: `Target ${stats?.utilizationTarget || '80%'}` },
              { l: 'Cancellations', v: stats?.cancellationsThisWeek || '0', s: 'This Week' }
            ].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border mb-2">
            <div className="hms-section-header text-xs">OT Room Status (Live)</div>
            <table className="hms-table"><thead><tr><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Anesthesia</th><th>Start</th><th>Est. End</th><th>Status</th></tr></thead>
              <tbody>
                {dashboardBookings.filter(b => b.status === 'RUNNING').map((b, i) => (
                  <tr key={i}>
                    <td className="font-bold">{b.otRoomNumber || 'N/A'}</td>
                    <td>{b.procedureName || 'N/A'}</td>
                    <td>{b.patient?.fullName || 'N/A'}</td>
                    <td>{b.surgeon?.user?.fullName || 'N/A'}</td>
                    <td>{b.anesthesiaType ? <StatusBadge status={b.anesthesiaType} /> : '-'}</td>
                    <td>{b.surgeryStartTime ? new Date(b.surgeryStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td>{b.surgeryEndTime ? new Date(b.surgeryEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
                {dashboardBookings.filter(b => b.status === 'RUNNING').length === 0 && (
                  <tr><td colSpan={8} className="text-center py-4 text-muted-foreground">No surgeries currently running</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Today's Schedule</div>
            <table className="hms-table"><thead><tr><th>Time</th><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Status</th></tr></thead>
              <tbody>
                {dashboardBookings.length > 0 ? dashboardBookings.map((s, i) => (
                  <tr key={i}>
                    <td>{s.scheduleDate ? new Date(s.scheduleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                    <td>{s.otRoomNumber || 'N/A'}</td>
                    <td>{s.procedureName || 'N/A'}</td>
                    <td>{s.patient?.fullName || 'N/A'}</td>
                    <td>{s.surgeon?.user?.fullName || 'N/A'}</td>
                    <td><StatusBadge status={s.status || 'SCHEDULED'} /></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-4 text-muted-foreground">No bookings found for today</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'OT Schedule' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input 
              type="date" 
              className="hms-input" 
              value={filters.date}
              onChange={e => setFilters({...filters, date: e.target.value})}
            />
            <select 
              className="hms-select"
              value={filters.departmentId}
              onChange={e => setFilters({...filters, departmentId: e.target.value})}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select 
              className="hms-select"
              value={filters.surgeonId}
              onChange={e => setFilters({...filters, surgeonId: e.target.value})}
            >
              <option value="">All Surgeons</option>
              {surgeons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select 
              className="hms-select"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PREPARING">Preparing</option>
              <option value="RUNNING">Running</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button className="hms-btn-primary ml-auto" onClick={() => handleSearchBookings(0)}>
              {loading ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />} Search
            </button>
            <button className="hms-btn-primary" onClick={() => { setIsEditing(false); setSelectedBooking(null); setTab('OT Booking'); }}>+ Book OT</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Print Schedule</button>
          </div>
          <table className="hms-table"><thead><tr><th>Time</th><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Type</th><th>Duration</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((s, i) => (
                <tr key={i}>
                  <td>{s.scheduleDate ? new Date(s.scheduleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                  <td>{s.otRoomNumber || 'N/A'}</td>
                  <td>{s.procedureName || 'N/A'}</td>
                  <td>{s.patient?.fullName || 'N/A'}</td>
                  <td>{s.surgeon?.user?.fullName || 'N/A'}</td>
                  <td><StatusBadge status={s.status || 'SCHEDULED'} /></td>
                  <td>{s.durationInMinutes ? `${s.durationInMinutes} min` : 'N/A'}</td>
                  <td><StatusBadge status={s.status || 'SCHEDULED'} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-primary cursor-pointer" title="View" onClick={() => handleViewDetails(s.id)} /> 
                      <Edit size={12} className="text-primary cursor-pointer" title="Edit" onClick={() => handleEditDetails(s.id)} />
                      {s.status === 'SCHEDULED' && <button onClick={() => handleAction('start', s.id)} className="text-[10px] text-green-600 font-bold hover:underline">Start</button>}
                      {s.status === 'RUNNING' && <button onClick={() => handleAction('complete', s.id)} className="text-[10px] text-blue-600 font-bold hover:underline">Complete</button>}
                      {['SCHEDULED', 'RUNNING', 'PREPARING'].includes(s.status) && <button onClick={() => handleAction('cancel', s.id)} className="text-[10px] text-red-600 font-bold hover:underline">Cancel</button>}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="text-center py-4 text-muted-foreground">No bookings found</td></tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <button disabled={page === 0} onClick={() => handleSearchBookings(page - 1)} className="hms-btn-secondary py-1 text-[10px]">Prev</button>
              <span className="text-[10px]">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => handleSearchBookings(page + 1)} className="hms-btn-secondary py-1 text-[10px]">Next</button>
            </div>
          )}
        </div>
      )}

      {tab === 'Running Surgeries' && (
        <div>
          <table className="hms-table"><thead><tr><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Anesthesia</th><th>Start</th><th>Est End</th><th>Vitals</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i}>
                  <td className="font-bold">{b.otRoomNumber || 'N/A'}</td>
                  <td>{b.procedureName || 'N/A'}</td>
                  <td>{b.patient?.fullName || 'N/A'}</td>
                  <td>{b.surgeon?.user?.fullName || 'N/A'}</td>
                  <td>{b.anesthesiaType ? <StatusBadge status={b.anesthesiaType} /> : '-'}</td>
                  <td>{b.surgeryStartTime ? new Date(b.surgeryStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td>{b.surgeryEndTime ? new Date(b.surgeryEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="text-[10px]">BP:120/80 HR:72 SpO2:99%</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Eye size={12} className="text-primary cursor-pointer" onClick={() => handleViewDetails(b.id)} />
                      <button onClick={() => handleAction('complete', b.id)} className="hms-btn-primary py-0.5 text-[10px]">Complete</button>
                      <button onClick={() => handleAction('cancel', b.id)} className="text-[10px] text-red-600 font-bold hover:underline">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={10} className="text-center py-4 text-muted-foreground">No surgeries currently running</td></tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <button disabled={page === 0} onClick={() => handleSearchBookings(page - 1, 'RUNNING')} className="hms-btn-secondary py-1 text-[10px]">Prev</button>
              <span className="text-[10px]">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => handleSearchBookings(page + 1, 'RUNNING')} className="hms-btn-secondary py-1 text-[10px]">Next</button>
            </div>
          )}
        </div>
      )}

      {tab === 'OT Booking' && (
        <div className="bg-card border border-border p-3">
          <div className="hms-section-header text-xs mb-3">
            {isEditing ? (selectedBooking ? 'Edit OT Booking' : 'New OT Booking') : 'View OT Booking'}
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Patient ID *</label>
              <input 
                className="hms-input" 
                value={bookingForm.patientId} 
                onChange={e => setBookingForm({...bookingForm, patientId: e.target.value})} 
                placeholder="Patient ID" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Surgeon *</label>
              <select 
                className="hms-select" 
                value={bookingForm.surgeonId} 
                onChange={e => setBookingForm({...bookingForm, surgeonId: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select Surgeon</option>
                {surgeons.map(s => <option key={s.id} value={s.id}>{s.user?.fullName || s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Anesthetist</label>
              <select 
                className="hms-select" 
                value={bookingForm.anesthetistId} 
                onChange={e => setBookingForm({...bookingForm, anesthetistId: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select Anesthetist</option>
                {surgeons.map(s => <option key={s.id} value={s.id}>{s.user?.fullName || s.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Department</label>
              <select 
                className="hms-select" 
                value={bookingForm.departmentId} 
                onChange={e => setBookingForm({...bookingForm, departmentId: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Procedure Name *</label>
              <input 
                className="hms-input" 
                value={bookingForm.procedureName} 
                onChange={e => setBookingForm({...bookingForm, procedureName: e.target.value})} 
                placeholder="e.g. Lap Cholecystectomy" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Schedule Date & Time *</label>
              <input 
                type="datetime-local" 
                className="hms-input" 
                value={bookingForm.scheduleDate} 
                onChange={e => setBookingForm({...bookingForm, scheduleDate: e.target.value})} 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Duration (Min) *</label>
              <input 
                type="number" 
                className="hms-input" 
                value={bookingForm.durationInMinutes} 
                onChange={e => setBookingForm({...bookingForm, durationInMinutes: e.target.value})} 
                placeholder="e.g. 120" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">OT Room Number</label>
              <input 
                className="hms-input" 
                value={bookingForm.otRoomNumber} 
                onChange={e => setBookingForm({...bookingForm, otRoomNumber: e.target.value})} 
                placeholder="e.g. OT-1" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Anesthesia Type</label>
              <select 
                className="hms-select" 
                value={bookingForm.anesthesiaType} 
                onChange={e => setBookingForm({...bookingForm, anesthesiaType: e.target.value})}
                disabled={!isEditing}
              >
                <option value="">Select Type</option>
                <option value="GA">GA</option>
                <option value="SA">SA</option>
                <option value="LA">LA</option>
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="hms-form-label">Priority</label>
              <select 
                className="hms-select" 
                value={bookingForm.priority} 
                onChange={e => setBookingForm({...bookingForm, priority: e.target.value})}
                disabled={!isEditing}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            <div className="flex flex-col gap-0.5 col-span-2">
              <label className="hms-form-label">Pre-Op Instructions</label>
              <textarea 
                className="hms-input h-10" 
                value={bookingForm.preOpInstructions} 
                onChange={e => setBookingForm({...bookingForm, preOpInstructions: e.target.value})} 
                placeholder="Instructions..." 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5 col-span-2">
              <label className="hms-form-label">Internal Notes</label>
              <textarea 
                className="hms-input h-10" 
                value={bookingForm.notes} 
                onChange={e => setBookingForm({...bookingForm, notes: e.target.value})} 
                placeholder="Internal notes..." 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5 col-span-2">
              <label className="hms-form-label">Scrub Nurse</label>
              <input 
                className="hms-input" 
                value={bookingForm.scrubNurse} 
                onChange={e => setBookingForm({...bookingForm, scrubNurse: e.target.value})} 
                placeholder="Scrub nurse name" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5 col-span-2">
              <label className="hms-form-label">Circulating Nurse</label>
              <input 
                className="hms-input" 
                value={bookingForm.circulatingNurse} 
                onChange={e => setBookingForm({...bookingForm, circulatingNurse: e.target.value})} 
                placeholder="Circulating nurse name" 
                disabled={!isEditing}
              />
            </div>
            <div className="flex flex-col gap-0.5 col-span-4">
              <label className="hms-form-label">Video Recording URL (S3)</label>
              <input 
                className="hms-input" 
                value={bookingForm.videoRecordingUrl} 
                onChange={e => setBookingForm({...bookingForm, videoRecordingUrl: e.target.value})} 
                placeholder="https://..." 
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {isEditing && (
              <button className="hms-btn-primary" onClick={handleSaveBooking} disabled={loading}>
                {loading ? 'Saving...' : (selectedBooking ? 'Update Booking' : 'Book OT')}
              </button>
            )}
            <button className="hms-btn-secondary" onClick={() => { setTab('OT Schedule'); setSelectedBooking(null); }}>
              {isEditing ? 'Cancel' : 'Back to Schedule'}
            </button>
          </div>
        </div>
      )}

      {tab === 'Post-Op Notes' && (
        <div>
          <table className="hms-table"><thead><tr><th>Date</th><th>Patient</th><th>Surgery</th><th>Surgeon</th><th>Post-Op Notes</th><th>Complications</th><th>Action</th></tr></thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i}>
                  <td>{b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>{b.patient?.fullName || 'N/A'}</td>
                  <td>{b.procedureName || 'N/A'}</td>
                  <td>{b.surgeon?.user?.fullName || 'N/A'}</td>
                  <td>{b.postOpNotes || 'N/A'}</td>
                  <td>{b.recoveryStatus || 'None'}</td>
                   <td><Eye size={12} className="text-primary cursor-pointer" onClick={() => handleViewDetails(b.id)} /> <Printer size={12} className="text-muted-foreground cursor-pointer" /></td>
                 </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="text-center py-4 text-muted-foreground">No completed surgeries found</td></tr>
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-2">
              <button disabled={page === 0} onClick={() => handleSearchBookings(page - 1, 'COMPLETED')} className="hms-btn-secondary py-1 text-[10px]">Prev</button>
              <span className="text-[10px]">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => handleSearchBookings(page + 1, 'COMPLETED')} className="hms-btn-secondary py-1 text-[10px]">Next</button>
            </div>
          )}
        </div>
      )}

      {/* Complete Surgery Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={18} />
              Complete Surgery
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="hms-form-label mb-1">Post-Op Notes *</label>
            <textarea
              className="hms-input min-h-[100px]"
              placeholder="Enter findings, procedure details, and recovery instructions..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <button className="hms-btn-secondary" onClick={() => setShowCompleteModal(false)}>Cancel</button>
            <button 
              className="hms-btn-primary" 
              onClick={handleCompleteSurgery}
              disabled={loading || !actionNotes.trim()}
            >
              {loading ? 'Completing...' : 'Mark as Completed'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Surgery Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle size={18} />
              Cancel Surgery
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="hms-form-label mb-1">Reason for Cancellation *</label>
            <textarea
              className="hms-input min-h-[100px]"
              placeholder="Enter reason for cancelling this procedure..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <button className="hms-btn-secondary" onClick={() => setShowCancelModal(false)}>Go Back</button>
            <button 
              className="hms-btn-primary bg-red-600 hover:bg-red-700 border-red-700" 
              onClick={handleCancelSurgery}
              disabled={loading || !actionReason.trim()}
            >
              {loading ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OTManagement;
