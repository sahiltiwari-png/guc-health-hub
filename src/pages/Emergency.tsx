import React, { useState, useEffect } from 'react';
import { Siren, Eye, Edit, Clock, AlertTriangle, CheckCircle, Printer, Activity, RefreshCw, Trash2, Search, Filter } from 'lucide-react';
import { 
  getApiV1Emergency, 
  getApiV1EmergencyByid, 
  putApiV1EmergencyByid, 
  deleteApiV1EmergencyByid, 
  postApiV1EmergencyByidStatus, 
  postApiV1EmergencyByidTriage,
  postApiV1EmergencyRegister,
  getApiDepartmentsListAll,
  apiRequest,
  extractArray 
} from "@/api/apiService";
import { toast } from "sonner";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 
    'RED': 'bg-red-700 text-white', 
    'ORANGE': 'bg-orange-600 text-white', 
    'YELLOW': 'bg-yellow-500 text-black', 
    'GREEN': 'bg-green-700 text-white', 
    'BLACK': 'bg-black text-white', 
    'ACTIVE': 'bg-blue-700 text-white', 
    'DISCHARGED': 'bg-green-700 text-white', 
    'ADMITTED': 'bg-yellow-600 text-white', 
    'REFERRED': 'bg-purple-700 text-white', 
    'CRITICAL': 'bg-red-900 text-white', 
    'STABLE': 'bg-green-700 text-white', 
    'MLC': 'bg-red-700 text-white', 
    'NON-MLC': 'bg-green-700 text-white', 
    'OCCUPIED': 'bg-red-700 text-white', 
    'AVAILABLE': 'bg-green-700 text-white' 
  };
  const displayStatus = status?.toUpperCase() || '';
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[displayStatus] || 'bg-muted text-foreground'}`}>{displayStatus}</span>;
};

const traumaBays = [
  { bay: 'Trauma Bay 1', equipment: 'Ventilator, Monitor, Defibrillator', patient: 'Mohan Lal', status: 'OCCUPIED' },
  { bay: 'Trauma Bay 2', equipment: 'Monitor, Suction, Oxygen', patient: '-', status: 'AVAILABLE' },
  { bay: 'Trauma Bay 3', equipment: 'Ventilator, Monitor', patient: 'Rajesh Kumar', status: 'OCCUPIED' },
  { bay: 'Trauma Bay 4', equipment: 'Monitor, Oxygen', patient: '-', status: 'AVAILABLE' },
];

const Emergency = () => {
  const tabs = ['Dashboard','Active Cases','Triage','Trauma Bay','Resuscitation','MLC Register','Waiting Area','Shift Handover'];
  const [tab, setTab] = useState('Dashboard');
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [filters, setFilters] = useState({ triage: '', status: '', filter: '' });
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<number | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [searchPatientUhid, setSearchPatientUhid] = useState('');
  const [foundPatient, setFoundPatient] = useState<any>(null);
  const [registerForm, setRegisterForm] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    triage: 'GREEN',
    chiefComplaint: '',
    mlc: 'NON-MLC'
  });

  const fetchInitialData = async () => {
    try {
      const res = await getApiDepartmentsListAll();
      if (res.ok) setDepartments(extractArray(res));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCases = async (page = 0) => {
    setLoading(true);
    try {
      const queryParams: any = {
        page,
        size: pagination.size,
        ...filters
      };
      const res = await getApiV1Emergency(queryParams);
      if (res.ok) {
        setCases(extractArray(res));
        setPagination(prev => ({
          ...prev,
          page,
          total: res.data?.data?.totalElements || res.data?.totalElements || 0
        }));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load emergency cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchInitialData();
  }, [filters, tab]);

  const handleSearchPatient = async () => {
     if (!searchPatientUhid) return;
     setLoading(true);
     try {
       const res = await apiRequest(`/api/v1/patients/uhid/${searchPatientUhid}`);
       const patientData = res.data?.data || res.data;
       if (res.ok && patientData && (patientData.id || patientData.uhid)) {
         setFoundPatient(patientData);
         setRegisterForm(prev => ({ ...prev, patientId: patientData.id }));
         toast.success("Patient found!");
       } else {
         toast.error("Patient not found");
         setFoundPatient(null);
       }
     } catch (error) {
       toast.error("Error searching patient");
       setFoundPatient(null);
     } finally {
       setLoading(false);
     }
   };

  const handleRegisterSubmit = async () => {
    if (!registerForm.patientId) {
      toast.error("Please search and select a patient");
      return;
    }
    setLoading(true);
    try {
      const res = await postApiV1EmergencyRegister(
        { chiefComplaint: registerForm.chiefComplaint, triage: registerForm.triage },
        { 
          patientId: registerForm.patientId, 
          doctorId: registerForm.doctorId, 
          departmentId: registerForm.departmentId 
        }
      );
      if (res.ok) {
        toast.success("Emergency visit registered successfully");
        setShowRegisterModal(false);
        fetchCases(0);
        // Reset form
        setRegisterForm({
          patientId: '', doctorId: '', departmentId: '',
          triage: 'GREEN', chiefComplaint: '', mlc: 'NON-MLC'
        });
        setFoundPatient(null);
        setSearchPatientUhid('');
      } else {
        toast.error(res.data?.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Error registering visit");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id: number) => {
    setLoading(true);
    try {
      const res = await getApiV1EmergencyByid(id);
      if (res.ok && res.data?.data) {
        setSelectedCase(res.data.data);
        setShowEditModal(true);
      } else if (res.ok && res.data) {
        setSelectedCase(res.data);
        setShowEditModal(true);
      } else {
        toast.error("Failed to fetch case details");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error loading case details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await postApiV1EmergencyByidStatus(id, status);
      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        if (selectedCase && selectedCase.id === id) {
          setSelectedCase({ ...selectedCase, status });
        }
        fetchCases(pagination.page);
      }
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const handleUpdateTriage = async (id: number, triage: string) => {
    try {
      const res = await postApiV1EmergencyByidTriage(id, triage);
      if (res.ok) {
        toast.success(`Triage updated to ${triage}`);
        if (selectedCase && selectedCase.id === id) {
          setSelectedCase({ ...selectedCase, triage });
        }
        fetchCases(pagination.page);
      }
    } catch (e) {
      toast.error("Failed to update triage");
    }
  };

  const handleDelete = async () => {
    if (!caseToDelete) return;
    setLoading(true);
    try {
      const res = await deleteApiV1EmergencyByid(caseToDelete);
      if (res.ok) {
        toast.success("Record deleted successfully");
        setShowDeleteModal(false);
        setCaseToDelete(null);
        fetchCases(pagination.page);
      }
    } catch (e) {
      toast.error("Failed to delete record");
    } finally {
      setLoading(false);
    }
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-between p-2 bg-muted/10 border-t border-border">
      <span className="text-[10px] text-muted-foreground font-medium">
        Showing <span className="text-foreground font-bold">{Math.min(pagination.total, pagination.page * pagination.size + 1)}</span> to <span className="text-foreground font-bold">{Math.min(pagination.total, (pagination.page + 1) * pagination.size)}</span> of <span className="text-foreground font-bold">{pagination.total}</span> cases
      </span>
      <div className="flex gap-1">
        <button 
          disabled={pagination.page === 0 || loading} 
          onClick={() => fetchCases(pagination.page - 1)}
          className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50 flex items-center gap-1"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.size)))].map((_, i) => (
            <button 
              key={i}
              disabled={loading}
              onClick={() => fetchCases(i)}
              className={`w-6 h-6 text-[10px] font-bold rounded transition-all ${pagination.page === i ? 'bg-primary text-white shadow-sm' : 'hover:bg-muted text-muted-foreground'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          disabled={(pagination.page + 1) * pagination.size >= pagination.total || loading}
          onClick={() => fetchCases(pagination.page + 1)}
          className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50 flex items-center gap-1"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Stats calculation based on real data
  const stats = {
    active: cases.length,
    red: cases.filter(c => c.triage === 'RED').length,
    yellow: cases.filter(c => c.triage === 'YELLOW').length,
    green: cases.filter(c => c.triage === 'GREEN').length,
    mlc: cases.filter(c => c.mlc === 'MLC').length,
    waiting: cases.filter(c => c.status === 'WAITING').length
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Siren size={14} /> Emergency Department Management</div>
        <div className="flex gap-2">
          <button onClick={() => setShowRegisterModal(true)} className="hms-btn-primary py-1 px-3 text-[10px] flex items-center gap-1">
            <Siren size={10} /> Register Emergency
          </button>
          <button onClick={() => fetchCases(pagination.page)} className="hms-btn-secondary py-1 px-2 text-[10px] flex items-center gap-1">
            <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>
      
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto shrink-0">
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-1">
        {tab === 'Dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-3">
              {[
                { l: 'Active Cases', v: stats.active, s: `${cases.filter(c=>c.status==='CRITICAL').length} Critical`, c: 'blue' },
                { l: 'Red (Immediate)', v: stats.red, s: 'Immediate Care', c: 'red' },
                { l: 'Yellow (Urgent)', v: stats.yellow, s: '<60 min', c: 'yellow' },
                { l: 'Green (Minor)', v: stats.green, s: 'Walk-in', c: 'green' },
                { l: 'Black (Deceased)', v: cases.filter(c => c.triage === 'BLACK').length, s: 'Morgue/Expectant', c: 'slate' },
                { l: 'MLC Cases', v: stats.mlc, s: 'Police Notified', c: 'purple' },
                { l: 'Waiting', v: stats.waiting, s: 'Avg 12 min', c: 'slate' }
              ].map((k, i) => (
                <div key={i} className={`bg-card border-l-4 border-l-${k.c}-500 border border-border p-2 shadow-sm`}>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{k.l}</div>
                  <div className="text-xl font-bold">{k.v}</div>
                  <div className="text-[9px] text-muted-foreground">{k.s}</div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border mb-3 shadow-sm">
              <div className="hms-section-header text-[10px] py-1 bg-muted/30">Active Emergency Cases (Live)</div>
              <div className="overflow-x-auto">
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>ER No</th>
                      <th>Patient</th>
                      <th>Age/Sex</th>
                      <th>Triage</th>
                      <th>Complaint</th>
                      <th>Doctor</th>
                      <th>Arrival</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center py-10"><RefreshCw className="animate-spin mx-auto opacity-20" /></td></tr>
                    ) : cases.length > 0 ? (
                      cases.map(c => (
                        <tr key={c.id} className="hover:bg-muted/30">
                          <td className="font-mono text-[10px] font-bold">ER-{c.id}</td>
                          <td>
                            <div className="font-bold">{c.patient?.fullName || 'N/A'}</div>
                            <div className="text-[9px] text-muted-foreground">UHID: {c.patient?.uhid || 'N/A'}</div>
                          </td>
                          <td className="text-[10px]">{c.patient?.gender?.charAt(0)} / {new Date().getFullYear() - new Date(c.patient?.dateOfBirth).getFullYear()}Y</td>
                          <td><StatusBadge status={c.triage} /></td>
                          <td className="text-[10px] max-w-[180px] truncate">{c.chiefComplaint}</td>
                          <td className="text-[10px]">{c.assignedDoctor?.user?.fullName || 'Unassigned'}</td>
                          <td className="text-[10px]">{new Date(c.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td><StatusBadge status={c.status} /></td>
                          <td>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditClick(c.id)} className="p-1 hover:bg-primary/10 rounded">
                                <Edit size={12} className="text-primary" />
                              </button>
                              <button onClick={() => { setCaseToDelete(c.id); setShowDeleteModal(true); }} className="p-1 hover:bg-red-50 rounded">
                                <Trash2 size={12} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={9} className="text-center py-10 text-muted-foreground italic">No active cases found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <PaginationControls />
            </div>

            <div className="bg-card border border-border shadow-sm">
              <div className="hms-section-header text-[10px] py-1 bg-muted/30">Bay/Bed Status</div>
              <table className="hms-table">
                <thead><tr><th>Bay</th><th>Equipment</th><th>Patient</th><th>Status</th></tr></thead>
                <tbody>
                  {traumaBays.map(b => (
                    <tr key={b.bay} className="hover:bg-muted/30">
                      <td className="font-bold text-xs">{b.bay}</td>
                      <td className="text-[10px] text-muted-foreground">{b.equipment}</td>
                      <td className="text-xs">{b.patient}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Active Cases' && (
          <div className="animate-in slide-in-from-right-2 duration-300">
            <div className="flex flex-wrap gap-2 mb-2 p-1 bg-muted/20 rounded border border-border/50">
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-muted-foreground" />
                <select 
                  className="hms-select text-[10px] py-0.5" 
                  value={filters.triage} 
                  onChange={e => setFilters({...filters, triage: e.target.value})}
                >
                  <option value="">All Triage</option>
                  <option value="RED">Red</option>
                  <option value="YELLOW">Yellow</option>
                  <option value="GREEN">Green</option>
                  <option value="BLACK">Black</option>
                </select>
                <select 
                  className="hms-select text-[10px] py-0.5"
                  value={filters.status}
                  onChange={e => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="ADMITTED">Admitted</option>
                  <option value="OBSERVED">Observed</option>
                  <option value="DISCHARGED">Discharged</option>
                </select>
                <div className="relative">
                  <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    placeholder="Search complaint..." 
                    className="hms-input pl-6 text-[10px] py-0.5 w-40" 
                    value={filters.filter}
                    onChange={e => setFilters({...filters, filter: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <div className="bg-card border border-border shadow-sm rounded overflow-hidden">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>ER No</th>
                    <th>Patient</th>
                    <th>Age/Sex</th>
                    <th>Arrival</th>
                    <th>Triage</th>
                    <th>Chief Complaint</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => (
                    <tr key={c.id} className="hover:bg-muted/30">
                      <td className="font-mono text-[10px] font-bold">ER-{c.id}</td>
                      <td className="font-bold text-xs">{c.patient?.fullName}</td>
                      <td className="text-[10px]">{c.patient?.gender?.charAt(0)} / {new Date().getFullYear() - new Date(c.patient?.dateOfBirth).getFullYear()}Y</td>
                      <td className="text-[10px]">{new Date(c.arrivalTime).toLocaleTimeString()}</td>
                      <td><StatusBadge status={c.triage} /></td>
                      <td className="text-[10px] max-w-[200px]">{c.chiefComplaint}</td>
                      <td className="text-[10px]">{c.assignedDoctor?.user?.fullName || 'Pending'}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>
                        <div className="flex gap-2">
                          <Eye size={12} className="text-primary cursor-pointer hover:scale-110 transition-transform" />
                          <Edit 
                            size={12} 
                            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => handleEditClick(c.id)} 
                          />
                          <Trash2 
                            size={12} 
                            className="text-red-500 cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => { setCaseToDelete(c.id); setShowDeleteModal(true); }} 
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationControls />
            </div>
          </div>
        )}

        {tab === 'Triage' && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
              {[
                { color: 'RED', desc: 'Life-threatening, needs immediate intervention', time: '0 min', count: stats.red },
                { color: 'YELLOW', desc: 'Requires urgent care within 60 min', time: '60 min', count: stats.yellow },
                { color: 'GREEN', desc: 'Minor injuries/illness, can wait', time: '120 min', count: stats.green },
                { color: 'BLACK', desc: 'Deceased or expectant', time: 'N/A', count: cases.filter(c => c.triage === 'BLACK').length }
              ].map((t, i) => (
                <div key={i} className="bg-card border border-border p-3 shadow-sm rounded-lg hover:shadow-md transition-shadow">
                  <StatusBadge status={t.color} />
                  <div className="text-[10px] mt-2 text-muted-foreground leading-relaxed">{t.desc}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-[9px] font-bold uppercase text-muted-foreground">Target: {t.time}</div>
                    <div className="text-lg font-black text-foreground">{t.count}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border shadow-sm rounded overflow-hidden">
              <table className="hms-table">
                <thead><tr><th>ER No</th><th>Patient</th><th>Arrival</th><th>Triage Level</th><th>Chief Complaint</th><th>Time in ER</th><th>Update Triage</th></tr></thead>
                <tbody>
                  {cases.map(c => (
                    <tr key={c.id}>
                      <td className="font-mono text-[10px]">ER-{c.id}</td>
                      <td className="font-bold text-xs">{c.patient?.fullName}</td>
                      <td className="text-[10px]">{new Date(c.arrivalTime).toLocaleTimeString()}</td>
                      <td><StatusBadge status={c.triage} /></td>
                      <td className="text-[10px]">{c.chiefComplaint}</td>
                      <td className="text-[10px] font-mono">{Math.floor((new Date().getTime() - new Date(c.arrivalTime).getTime()) / 60000)}m</td>
                      <td>
                        <div className="flex gap-1">
                          {['RED', 'YELLOW', 'GREEN', 'BLACK'].map(lv => (
                            <button 
                              key={lv}
                              onClick={() => handleUpdateTriage(c.id, lv)}
                              className={`w-3 h-3 rounded-full border border-border hover:scale-125 transition-transform ${
                                lv === 'RED' ? 'bg-red-500' : lv === 'YELLOW' ? 'bg-yellow-500' : lv === 'GREEN' ? 'bg-green-500' : 'bg-black'
                              } ${c.triage === lv ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                              title={lv}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs keep original UI structure but with real data if available */}
        {tab === 'Resuscitation' && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cases.filter(c => c.triage === 'RED').length > 0 ? (
                cases.filter(c => c.triage === 'RED').map(c => (
                  <div key={c.id} className="bg-card border-2 border-red-700 p-3 shadow-lg rounded-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-1 bg-red-700 text-white text-[8px] font-bold uppercase">Critical</div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-black text-xs block">RESUS BAY-{c.id % 5 + 1}</span>
                        <span className="font-mono text-[9px] text-muted-foreground">ID: ER-{c.id}</span>
                      </div>
                      <div className="animate-pulse"><Activity size={16} className="text-red-600" /></div>
                    </div>
                    <div className="text-sm font-black mb-1">{c.patient?.fullName}</div>
                    <div className="text-[10px] text-muted-foreground mb-3 bg-muted/50 p-1 rounded italic">{c.chiefComplaint}</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-muted p-1 rounded flex justify-between"><strong>Arrival:</strong> <span>{new Date(c.arrivalTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div>
                      <div className="bg-muted p-1 rounded flex justify-between"><strong>Dr:</strong> <span>{c.assignedDoctor?.user?.fullName?.split(' ')[0] || 'TBD'}</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 hms-btn-primary text-[9px] py-1 bg-red-700 hover:bg-red-800 border-none">Vitals Monitor</button>
                      <button className="flex-1 hms-btn-secondary text-[9px] py-1">Labs</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-xl">
                  <Activity size={40} className="mx-auto mb-2 opacity-10" />
                  <p className="text-muted-foreground font-medium italic">No patients currently in Resuscitation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'Trauma Bay' && (
           <div className="animate-in fade-in duration-300">
            <table className="hms-table">
              <thead><tr><th>Bay</th><th>Equipment Available</th><th>Current Patient</th><th>ER No</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {traumaBays.map(b => (
                  <tr key={b.bay} className="hover:bg-muted/30">
                    <td className="font-bold text-xs">{b.bay}</td>
                    <td className="text-[10px] text-muted-foreground">{b.equipment}</td>
                    <td className="text-xs font-bold">{b.patient}</td>
                    <td className="font-mono text-[10px]">-</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td><button className="hms-btn-secondary py-0.5 px-2 text-[9px]">Assign</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'MLC Register' && (
          <div className="animate-in fade-in duration-300">
            <table className="hms-table">
              <thead><tr><th>MLC No</th><th>ER No</th><th>Patient</th><th>Arrival</th><th>Nature</th><th>Police Station</th><th>Doctor</th><th>Condition</th><th>Action</th></tr></thead>
              <tbody>
                {cases.filter(c => c.mlc === 'MLC').length > 0 ? (
                  cases.filter(c => c.mlc === 'MLC').map((c, i) => (
                    <tr key={c.id}>
                      <td className="font-bold text-[10px]">MLC-{100 + i}</td>
                      <td className="font-mono text-[10px]">ER-{c.id}</td>
                      <td className="font-bold text-xs">{c.patient?.fullName}</td>
                      <td className="text-[10px]">{new Date(c.arrivalTime).toLocaleString()}</td>
                      <td className="text-[10px]">{c.chiefComplaint}</td>
                      <td className="text-[10px]">Local PS</td>
                      <td className="text-[10px]">{c.assignedDoctor?.user?.fullName || 'TBD'}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td><div className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Printer size={12} className="text-muted-foreground cursor-pointer" /></div></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={9} className="text-center py-10 text-muted-foreground italic">No MLC cases found in current results</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl w-full max-w-md rounded-xl overflow-hidden scale-in-center">
            <div className="hms-section-header flex items-center justify-between py-2 px-4 bg-muted/50 border-b border-border">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Edit size={12} /> Quick Update: ER-{selectedCase.id}</span>
              <button onClick={() => setShowEditModal(false)} className="hover:bg-muted p-1 rounded-full"><Activity size={14} className="rotate-45" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Triage Level</label>
                  <select 
                    className="hms-select w-full" 
                    value={selectedCase.triage}
                    onChange={(e) => handleUpdateTriage(selectedCase.id, e.target.value)}
                  >
                    <option value="RED">RED (Immediate)</option>
                    <option value="YELLOW">YELLOW (Delayed)</option>
                    <option value="GREEN">GREEN (Minor)</option>
                    <option value="BLACK">BLACK (Deceased)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Visit Status</label>
                  <select 
                    className="hms-select w-full"
                    value={selectedCase.status}
                    onChange={(e) => handleUpdateStatus(selectedCase.id, e.target.value)}
                  >
                    <option value="WAITING">WAITING</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="OBSERVED">OBSERVED</option>
                    <option value="ADMITTED">ADMITTED</option>
                    <option value="DISCHARGED">DISCHARGED</option>
                    <option value="REFERRED">REFERRED</option>
                    <option value="DEATH">DEATH</option>
                  </select>
                </div>
              </div>
              <div className="bg-muted/30 p-3 rounded border border-border/50">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Patient Details</div>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-black text-foreground">
                      {selectedCase.patient?.firstName} {selectedCase.patient?.lastName}
                      {selectedCase.patient?.fullName && !selectedCase.patient?.firstName ? selectedCase.patient?.fullName : ''}
                    </div>
                    <div className="text-[10px] text-muted-foreground">UHID: {selectedCase.patient?.uhid} | {selectedCase.patient?.gender}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-red-600">{selectedCase.patient?.bloodGroup || 'N/A'}</div>
                    <div className="text-[9px] text-muted-foreground">Arrival: {new Date(selectedCase.arrivalTime).toLocaleTimeString()}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-border/30">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Complaint</div>
                  <div className="text-[11px] text-foreground leading-relaxed italic">"{selectedCase.chiefComplaint}"</div>
                </div>
                {selectedCase.assignedDoctor && (
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">Assigned Doctor</div>
                    <div className="text-[11px] font-bold text-primary">{selectedCase.assignedDoctor?.user?.fullName}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 bg-muted/20 border-t border-border flex justify-end">
              <button onClick={() => setShowEditModal(false)} className="hms-btn-primary px-6 py-1 text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Emergency Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl w-full max-w-lg rounded-xl overflow-hidden scale-in-center">
            <div className="hms-section-header flex items-center justify-between py-2 px-4 bg-primary text-white">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Siren size={14} /> New Emergency Registration</span>
              <button onClick={() => setShowRegisterModal(false)} className="hover:bg-white/10 p-1 rounded-full"><Activity size={14} className="rotate-45" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[80vh] overflow-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Search Patient (UHID)</label>
                <div className="flex gap-2">
                  <input 
                    className="hms-input flex-1" 
                    placeholder="Enter UHID (e.g., P-1001)..." 
                    value={searchPatientUhid}
                    onChange={e => setSearchPatientUhid(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchPatient()}
                  />
                  <button className="hms-btn-primary px-4 py-1.5" onClick={handleSearchPatient} disabled={loading}>
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                  </button>
                </div>
              </div>

              {foundPatient && (
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg animate-in slide-in-from-top-2">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-black text-green-700">
                        {foundPatient.firstName} {foundPatient.lastName} 
                        {foundPatient.fullName && !foundPatient.firstName ? foundPatient.fullName : ''}
                      </p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">UHID: {foundPatient.uhid}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-[8px] font-bold text-green-600 mt-1 uppercase">Verified</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-green-500/20 pt-2">
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-green-600/70 font-bold uppercase">Gender / Age</p>
                      <p className="text-[10px] font-bold text-green-800">
                        {foundPatient.gender} / {foundPatient.dateOfBirth ? (new Date().getFullYear() - new Date(foundPatient.dateOfBirth).getFullYear()) : 'N/A'}Y
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[8px] text-green-600/70 font-bold uppercase">Phone Number</p>
                      <p className="text-[10px] font-bold text-green-800">{foundPatient.phoneNumber}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] text-green-600/70 font-bold uppercase">Blood Group</p>
                      <p className="text-[10px] font-bold text-red-600">{foundPatient.bloodGroup || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Triage Level</label>
                  <select 
                    className="hms-select w-full"
                    value={registerForm.triage}
                    onChange={e => setRegisterForm({...registerForm, triage: e.target.value})}
                  >
                    <option value="RED">RED (Immediate)</option>
                    <option value="YELLOW">YELLOW (Delayed)</option>
                    <option value="GREEN">GREEN (Minor)</option>
                    <option value="BLACK">BLACK (Deceased)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                  <select 
                    className="hms-select w-full"
                    value={registerForm.departmentId}
                    onChange={e => setRegisterForm({...registerForm, departmentId: e.target.value})}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Chief Complaint</label>
                <textarea 
                  className="hms-textarea h-20" 
                  placeholder="Enter details about the emergency..."
                  value={registerForm.chiefComplaint}
                  onChange={e => setRegisterForm({...registerForm, chiefComplaint: e.target.value})}
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="mlc_check" 
                  className="rounded border-border text-primary focus:ring-primary"
                  checked={registerForm.mlc === 'MLC'}
                  onChange={e => setRegisterForm({...registerForm, mlc: e.target.checked ? 'MLC' : 'NON-MLC'})}
                />
                <label htmlFor="mlc_check" className="text-xs font-bold text-red-600 uppercase cursor-pointer flex items-center gap-1">
                  <AlertTriangle size={12} /> Medico-Legal Case (MLC)
                </label>
              </div>
            </div>
            <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-3">
              <button onClick={() => setShowRegisterModal(false)} className="hms-btn-secondary px-6 py-1.5 text-xs">Cancel</button>
              <button 
                onClick={handleRegisterSubmit} 
                className="hms-btn-primary px-8 py-1.5 text-xs"
                disabled={loading || !registerForm.patientId}
              >
                {loading ? "Registering..." : "Confirm Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl w-full max-w-sm rounded-xl overflow-hidden scale-in-center">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-black text-foreground mb-2">Confirm Deletion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this emergency record? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-muted/20 border-t border-border flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setCaseToDelete(null); }} 
                className="flex-1 hms-btn-secondary py-2 text-xs font-bold"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 text-xs font-bold shadow-sm transition-all"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
