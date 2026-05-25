import React, { useEffect, useState } from 'react';
import { 
  Search, Edit, Eye, Plus, Bed, History, MoveHorizontal, LogOut, 
  Filter, Building2, RefreshCw, AlertTriangle, CheckCircle2, XCircle,
  ClipboardList
} from 'lucide-react';
import { 
  getApiV1BedManagementBeds, 
  getApiV1BedManagementBedsAvailable,
  postApiV1BedManagementAssign,
  postApiV1BedManagementTransfer,
  postApiV1BedManagementReleaseBybedId,
  getApiV1BedManagementLifecycleBybedId,
  getApiDepartmentsListAll,
  apiRequest,
  extractArray
} from "@/api/apiService";
import { toast } from "sonner";

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-700 border-green-200",
    OCCUPIED: "bg-red-100 text-red-700 border-red-200",
    RESERVED: "bg-blue-100 text-blue-700 border-blue-200",
    CLEANING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    UNDER_MAINTENANCE: "bg-gray-100 text-gray-700 border-gray-200",
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles.AVAILABLE}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const BedManagement = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'admissions' | 'wards' | 'history'>('status');
  const [loading, setLoading] = useState(false);
  const [beds, setBeds] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 12, total: 0 });

  // Modals state
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [bedHistory, setBedHistory] = useState<any[]>([]);

  // Admit Form State
  const [admitForm, setAdmitForm] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    caseType: 'NORMAL',
    triage: 'GREEN',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    diagnosis: '',
    admissionReason: '',
    advanceAmount: 0
  });
  const [searchPatientUhid, setSearchPatientUhid] = useState('');
  const [foundPatient, setFoundPatient] = useState<any>(null);

  // Transfer Form State
  const [transferForm, setTransferForm] = useState({
    admissionId: '',
    newBedId: '',
    newWardId: ''
  });
  const [availableBeds, setAvailableBeds] = useState<any[]>([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    other: 0
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [deptRes, wardRes] = await Promise.all([
        getApiDepartmentsListAll(),
        apiRequest('/api/v1/ipd/wards')
      ]);
      
      if (deptRes.ok) setDepartments(extractArray(deptRes));
      if (wardRes.ok) setWards(extractArray(wardRes));
      
      fetchBeds(0);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load departments and wards");
    }
  };

  const fetchBeds = async (page = 0) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 100, // Fetch more for grouping
        search: searchTerm
      };
      if (selectedWard !== 'all') params.wardId = selectedWard;
      if (selectedDept !== 'all') params.departmentId = selectedDept;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const res = await getApiV1BedManagementBeds(params);
      if (res.ok) {
        const content = res.data?.data?.content || res.data?.content || [];
        setBeds(content);
        const total = res.data?.data?.totalElements || res.data?.totalElements || 0;
        setPagination(prev => ({ ...prev, page, total }));
        
        // Update stats
        const available = content.filter((b: any) => b.status === 'AVAILABLE').length;
        const occupied = content.filter((b: any) => b.status === 'OCCUPIED').length;
        setStats({
          total: total,
          available: available,
          occupied: occupied,
          other: total - available - occupied
        });
      }
    } catch (error) {
      toast.error("Error loading beds");
    } finally {
      setLoading(false);
    }
  };

  // Group beds by ward for the "column" view
  const bedsByWard = beds.reduce((acc: any, bed: any) => {
    const wardName = bed.ward?.name || 'Unassigned';
    if (!acc[wardName]) acc[wardName] = [];
    acc[wardName].push(bed);
    return acc;
  }, {});

  useEffect(() => {
    fetchBeds(0);
  }, [selectedWard, selectedDept, selectedStatus]);

  const handleReleaseBed = async (bedId: number) => {
    if (!confirm("Are you sure you want to release this bed?")) return;
    
    try {
      const res = await postApiV1BedManagementReleaseBybedId(bedId);
      if (res.ok) {
        toast.success("Bed released successfully");
        fetchBeds(pagination.page);
      } else {
        toast.error(res.data?.message || "Failed to release bed");
      }
    } catch (error) {
      toast.error("Error releasing bed");
    }
  };

  const handleViewHistory = async (bed: any) => {
    setSelectedBed(bed);
    setLoading(true);
    try {
      const res = await getApiV1BedManagementLifecycleBybedId(bed.id);
      if (res.ok) {
        setBedHistory(extractArray(res));
        setShowHistoryModal(true);
      }
    } catch (error) {
      toast.error("Error fetching bed history");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPatient = async () => {
    if (!searchPatientUhid) return;
    setLoading(true);
    try {
      const res = await apiRequest(`/api/v1/patients/uhid/${searchPatientUhid}`);
      if (res.ok && res.data) {
        setFoundPatient(res.data);
        setAdmitForm(prev => ({ ...prev, patientId: res.data.id }));
        toast.success("Patient found!");
      } else {
        toast.error("Patient not found");
      }
    } catch (error) {
      toast.error("Error searching patient");
    } finally {
      setLoading(false);
    }
  };

  const handleAdmitSubmit = async () => {
    if (!admitForm.patientId || !selectedBed) {
      toast.error("Please select a patient and a bed");
      return;
    }
    setLoading(true);
    try {
      const res = await postApiV1BedManagementAssign({
        ...admitForm,
        bedId: selectedBed.id,
        departmentId: admitForm.departmentId || selectedBed.ward?.department?.id
      });
      if (res.ok) {
        toast.success("Patient admitted successfully");
        setShowAdmitModal(false);
        fetchBeds(pagination.page);
        // Reset form
        setAdmitForm({
          patientId: '', doctorId: '', departmentId: '', caseType: 'NORMAL',
          triage: 'GREEN', guardianName: '', guardianPhone: '',
          guardianRelation: '', diagnosis: '', admissionReason: '', advanceAmount: 0
        });
        setFoundPatient(null);
        setSearchPatientUhid('');
      } else {
        toast.error(res.data?.message || "Failed to admit patient");
      }
    } catch (error) {
      toast.error("Error admitting patient");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async () => {
    if (!transferForm.newBedId || !selectedBed) {
      toast.error("Please select a new bed");
      return;
    }
    setLoading(true);
    try {
      // Assuming selectedBed is the one being transferred FROM, we need the admissionId
      // We'll need to find the active admission ID for this bed
      const res = await postApiV1BedManagementTransfer({
        admissionId: selectedBed.admissionId || selectedBed.id, // This needs to be the admission ID
        newBedId: transferForm.newBedId
      });
      if (res.ok) {
        toast.success("Transfer successful");
        setShowTransferModal(false);
        fetchBeds(pagination.page);
      } else {
        toast.error(res.data?.message || "Transfer failed");
      }
    } catch (error) {
      toast.error("Error transferring patient");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBeds = async (wardId: string) => {
    if (!wardId) return;
    try {
      const res = await getApiV1BedManagementBedsAvailable({ wardId });
      if (res.ok) {
        setAvailableBeds(extractArray(res));
      }
    } catch (error) {
      toast.error("Error fetching available beds");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Header - Responsive */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white border-b border-slate-200 px-4 md:px-6 py-3 shadow-sm gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 w-full md:w-auto">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 whitespace-nowrap">
            <Bed className="text-primary" size={24} /> Bed Management
          </h2>
          <nav className="flex flex-wrap gap-1">
            {[
              { id: 'status', label: 'Bed Status', icon: <Building2 size={16} /> },
              { id: 'admissions', label: 'Active', icon: <Plus size={16} /> },
              { id: 'wards', label: 'Wards', icon: <Filter size={16} /> },
              { id: 'history', label: 'History', icon: <History size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:sm font-semibold rounded-md transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button className="hms-btn-secondary flex items-center gap-2 text-[10px] md:text-xs py-1.5 px-3" onClick={() => fetchInitialData()}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> <span className="hidden xs:inline">Refresh</span>
          </button>
          <button className="hms-btn-primary flex items-center gap-2 text-[10px] md:text-xs py-1.5 px-3" onClick={() => setShowAdmitModal(true)}>
            <Plus size={14} /> <span className="hidden xs:inline">New Assignment</span>
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6 overflow-auto flex-1 space-y-6">
        {/* Stats Section - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Bed size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Total Beds</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Available</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stats.available}</p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <XCircle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Occupied</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stats.occupied}</p>
            </div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">Maintenance</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stats.other}</p>
            </div>
          </div>
        </div>

        {/* Filters - Responsive Wrap */}
        <div className="flex flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 md:gap-4 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
          <div className="relative flex-1 min-w-0 md:min-w-[240px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="hms-input pl-10 w-full" 
              placeholder="Bed / Patient Search..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchBeds(0)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto lg:flex lg:items-center lg:gap-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ward:</span>
              <select className="hms-select w-full sm:w-32 lg:w-40" value={selectedWard} onChange={e => setSelectedWard(e.target.value)}>
                <option value="all">All</option>
                {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dept:</span>
              <select className="hms-select w-full sm:w-32 lg:w-40" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                <option value="all">All</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <select className="hms-select w-full sm:w-32 lg:w-40" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="RESERVED">Reserved</option>
                <option value="CLEANING">Cleaning</option>
                <option value="UNDER_MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>
          <button className="hms-btn-primary flex items-center justify-center gap-2 px-6 py-2" onClick={() => fetchBeds(0)}>
            <Filter size={16} /> <span className="lg:hidden xl:inline">Apply Filters</span>
          </button>
        </div>

        {/* Bed Status Grouped by Ward - "Column" Layout */}
        {activeTab === 'status' && (
          <div className="space-y-8">
            {loading ? (
              <div className="py-20 text-center text-slate-500">
                <RefreshCw size={40} className="mx-auto mb-4 animate-spin opacity-20" />
                <p className="font-medium">Refreshing bed status...</p>
              </div>
            ) : Object.keys(bedsByWard).length > 0 ? (
              Object.entries(bedsByWard).map(([wardName, wardBeds]: [string, any]) => (
                <div key={wardName} className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                      {wardName} 
                      <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {wardBeds.length} Beds
                      </span>
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
                    {wardBeds.map((bed: any) => (
                      <div 
                        key={bed.id} 
                        className={`group relative bg-white rounded-xl border shadow-sm transition-all hover:scale-105 hover:shadow-md overflow-hidden flex flex-col cursor-pointer ${
                          bed.status === 'AVAILABLE' ? 'border-green-100' : 
                          bed.status === 'OCCUPIED' ? 'border-red-100' : 
                          'border-slate-100'
                        }`}
                        title={bed.status === 'OCCUPIED' ? `Patient: ${bed.patientName}` : 'Bed Available'}
                      >
                        {/* Compact Header */}
                        <div className={`px-2 py-1.5 flex justify-between items-center ${
                          bed.status === 'AVAILABLE' ? 'bg-green-50' : 
                          bed.status === 'OCCUPIED' ? 'bg-red-50' : 
                          'bg-slate-50'
                        }`}>
                          <span className="font-bold text-slate-800 text-xs">{bed.bedNumber}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            bed.status === 'AVAILABLE' ? 'bg-green-500' : 
                            bed.status === 'OCCUPIED' ? 'bg-red-500' : 
                            'bg-yellow-500'
                          } shadow-sm`} />
                        </div>
                        
                        {/* Body - Minimal */}
                        <div className="p-2 flex-1 flex flex-col justify-center items-center gap-1 min-h-[60px]">
                          {bed.status === 'OCCUPIED' ? (
                            <div className="text-center w-full">
                              <p className="font-bold text-slate-700 text-[10px] truncate leading-tight">{bed.patientName?.split(' ')[0]}</p>
                              <p className="text-[8px] text-slate-400 font-medium">{bed.ipdNumber || 'IPD-000'}</p>
                            </div>
                          ) : (
                            <Bed className="text-slate-200" size={20} />
                          )}
                        </div>

                        {/* Action Overlay on Hover */}
                        <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          {bed.status === 'AVAILABLE' ? (
                            <button 
                              className="w-full py-1 bg-white text-primary rounded text-[9px] font-bold hover:bg-slate-100"
                              onClick={() => { setSelectedBed(bed); setShowAdmitModal(true); }}
                            >
                              ADMIT
                            </button>
                          ) : (
                            <>
                              <button 
                                className="w-full py-1 bg-white text-primary rounded text-[9px] font-bold hover:bg-slate-100"
                                onClick={() => { setSelectedBed(bed); setShowTransferModal(true); }}
                              >
                                TRANSFER
                              </button>
                              <button 
                                className="w-full py-1 bg-white text-primary rounded text-[9px] font-bold hover:bg-slate-100"
                                onClick={() => handleReleaseBed(bed.id)}
                              >
                                RELEASE
                              </button>
                            </>
                          )}
                          <button 
                            className="w-full py-1 border border-white/50 text-white rounded text-[9px] font-bold hover:bg-white/10"
                            onClick={() => handleViewHistory(bed)}
                          >
                            HISTORY
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300 mx-auto max-w-2xl">
                <Bed size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-medium">No beds found for this filter</p>
                <button className="text-primary text-sm font-bold mt-2" onClick={() => {
                  setSelectedWard('all'); setSelectedDept('all'); setSelectedStatus('all'); setSearchTerm('');
                }}>Reset Filters</button>
              </div>
            )}
          </div>
        )}

        {/* Active Admissions View */}
        {activeTab === 'admissions' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="hms-table min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th>IPD Number</th>
                    <th>Patient Name</th>
                    <th>Ward/Bed</th>
                    <th>Admission Date</th>
                    <th>Triage</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beds.filter(b => b.status === 'OCCUPIED').length > 0 ? (
                    beds.filter(b => b.status === 'OCCUPIED').map((bed) => (
                      <tr key={bed.id} className="hover:bg-slate-50 transition-colors">
                        <td className="font-bold text-primary">{bed.ipdNumber || 'IPD-0000'}</td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{bed.patientName}</span>
                            <span className="text-[10px] text-slate-400">UHID: {bed.uhid || 'P-0000'}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{bed.bedNumber}</span>
                            <span className="text-[10px] text-slate-400">{bed.ward?.name}</span>
                          </div>
                        </td>
                        <td className="text-xs">
                          {bed.admissionDate ? new Date(bed.admissionDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bed.triage === 'RED' ? 'bg-red-100 text-red-700' : 
                            bed.triage === 'YELLOW' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {bed.triage || 'GREEN'}
                          </span>
                        </td>
                        <td><StatusBadge status={bed.status} /></td>
                        <td>
                          <div className="flex gap-2">
                            <button 
                              className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"
                              onClick={() => { setSelectedBed(bed); setShowTransferModal(true); }}
                              title="Transfer Patient"
                            >
                              <MoveHorizontal size={14} />
                            </button>
                            <button 
                              className="p-1.5 bg-slate-50 text-slate-600 rounded hover:bg-slate-600 hover:text-white transition-colors"
                              onClick={() => handleReleaseBed(bed.id)}
                              title="Release Bed"
                            >
                              <LogOut size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-20 text-slate-400">
                        <ClipboardList size={40} className="mx-auto mb-2 opacity-10" />
                        <p>No active admissions found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Wards & Units View - Responsive Grid */}
         {activeTab === 'wards' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
             {wards.length > 0 ? (
               wards.map((ward) => (
                 <div key={ward.id} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                   <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                       <Building2 size={24} />
                     </div>
                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${ward.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {ward.active ? 'ACTIVE' : 'INACTIVE'}
                     </span>
                   </div>
                   <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">{ward.name}</h3>
                   <p className="text-[10px] md:text-xs text-slate-500 mb-4 truncate">{ward.department?.name || 'General Department'}</p>
                   
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-xs md:text-sm">
                       <span className="text-slate-500">Capacity</span>
                       <span className="font-bold text-slate-800">{ward.capacity} Beds</span>
                     </div>
                     <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                       <div 
                        className="bg-primary h-full rounded-full transition-all" 
                        style={{ width: `${(ward.occupied / ward.capacity) * 100 || 0}%` }}
                       />
                     </div>
                     <div className="flex justify-between text-[8px] md:text-[10px] font-bold uppercase tracking-wider">
                       <span className="text-primary">{ward.occupied || 0} Occupied</span>
                       <span className="text-slate-400">{ward.capacity - (ward.occupied || 0)} Available</span>
                     </div>
                   </div>
                   
                   <button 
                    className="w-full mt-6 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all border border-slate-100"
                    onClick={() => {
                      setSelectedWard(ward.id.toString());
                      setActiveTab('status');
                    }}
                   >
                     View Beds
                   </button>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                 <Building2 size={40} className="mx-auto mb-2 opacity-10" />
                 <p>No wards found</p>
               </div>
             )}
           </div>
         )}

         {/* History View (Global) */}
         {activeTab === 'history' && (
           <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-10 text-center text-slate-400">
               <History size={48} className="mx-auto mb-4 opacity-10" />
               <p className="text-lg font-medium text-slate-500">Global Bed History</p>
               <p className="text-sm max-w-md mx-auto mt-2">This section will show a unified timeline of all bed assignments and transfers across the hospital.</p>
               <button 
                className="mt-6 hms-btn-primary"
                onClick={() => setActiveTab('status')}
               >
                 Back to Bed Status
               </button>
             </div>
           </div>
         )}

        {/* Pagination Controls */}
        {!loading && beds.length > 0 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-800 font-bold">{pagination.page * pagination.size + 1}</span> to <span className="text-slate-800 font-bold">{Math.min((pagination.page + 1) * pagination.size, pagination.total)}</span> of <span className="text-slate-800 font-bold">{pagination.total}</span> beds
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page === 0} 
                onClick={() => fetchBeds(pagination.page - 1)}
                className="hms-btn-secondary py-1 px-4 text-xs disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, Math.ceil(pagination.total / pagination.size)))].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => fetchBeds(i)}
                    className={`w-8 h-8 text-xs font-bold rounded-md transition-all ${pagination.page === i ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={(pagination.page + 1) * pagination.size >= pagination.total} 
                onClick={() => fetchBeds(pagination.page + 1)}
                className="hms-btn-secondary py-1 px-4 text-xs disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Modal */}
      {showHistoryModal && selectedBed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <History className="text-blue-400" size={20} />
                <div>
                  <h3 className="font-bold">Bed History: {selectedBed.bedNumber}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">{selectedBed.ward?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-auto">
              {bedHistory.length > 0 ? (
                <div className="space-y-4">
                  {bedHistory.map((item, idx) => (
                    <div key={item.id} className="relative pl-6 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-slate-800 text-sm">{item.patient?.fullName || 'Anonymous'}</p>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            item.status === 'ADMITTED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500">
                          <p>Admitted: <span className="font-bold text-slate-700">{new Date(item.admissionDate).toLocaleDateString()}</span></p>
                          <p>Discharged: <span className="font-bold text-slate-700">{item.dischargeDate ? new Date(item.dischargeDate).toLocaleDateString() : 'Active'}</span></p>
                          <p className="col-span-2">Reason: <span className="font-medium text-slate-700">{item.admissionReason || 'N/A'}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <History size={40} className="mx-auto mb-2 opacity-20" />
                  <p>No history found for this bed</p>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex justify-end">
              <button className="hms-btn-secondary px-6" onClick={() => setShowHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Admit Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Plus size={18} /> Assign Bed / New Admission</h3>
              <button onClick={() => {
                setShowAdmitModal(false);
                setFoundPatient(null);
                setSearchPatientUhid('');
              }}><XCircle size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-auto">
               <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3">
                 <Bed className="text-blue-600 shrink-0" size={20} />
                 <div>
                   <p className="text-xs font-bold text-blue-800">Target Bed: {selectedBed?.bedNumber || 'N/A'}</p>
                   <p className="text-[10px] text-blue-600">{selectedBed?.ward?.name} - {selectedBed?.ward?.department?.name}</p>
                 </div>
               </div>
               
               <div className="space-y-1">
                 <label className="text-[11px] font-bold text-slate-600">Search Patient (UHID)</label>
                 <div className="flex gap-2">
                   <input 
                    className="hms-input flex-1" 
                    placeholder="Enter UHID (e.g., P-1001)..." 
                    value={searchPatientUhid}
                    onChange={e => setSearchPatientUhid(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearchPatient()}
                   />
                   <button className="hms-btn-primary px-4" onClick={handleSearchPatient} disabled={loading}>
                    {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                   </button>
                 </div>
               </div>

               {foundPatient && (
                 <div className="bg-green-50 border border-green-100 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-sm font-bold text-green-800">{foundPatient.fullName}</p>
                       <p className="text-[10px] text-green-600">UHID: {foundPatient.uhid} | Phone: {foundPatient.phoneNumber}</p>
                     </div>
                     <span className="bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">VERIFIED</span>
                   </div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4 pt-2">
                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Guardian Name</label>
                   <input 
                    className="hms-input" 
                    placeholder="Name" 
                    value={admitForm.guardianName}
                    onChange={e => setAdmitForm({...admitForm, guardianName: e.target.value})}
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Guardian Phone</label>
                   <input 
                    className="hms-input" 
                    placeholder="Phone" 
                    value={admitForm.guardianPhone}
                    onChange={e => setAdmitForm({...admitForm, guardianPhone: e.target.value})}
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Relation</label>
                   <select 
                    className="hms-select"
                    value={admitForm.guardianRelation}
                    onChange={e => setAdmitForm({...admitForm, guardianRelation: e.target.value})}
                   >
                     <option value="">Select Relation</option>
                     <option value="Father">Father</option>
                     <option value="Mother">Mother</option>
                     <option value="Spouse">Spouse</option>
                     <option value="Brother">Brother</option>
                     <option value="Sister">Sister</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Triage</label>
                   <select 
                    className="hms-select"
                    value={admitForm.triage}
                    onChange={e => setAdmitForm({...admitForm, triage: e.target.value})}
                   >
                     <option value="GREEN">Green (Stable)</option>
                     <option value="YELLOW">Yellow (Serious)</option>
                     <option value="RED">Red (Critical)</option>
                   </select>
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[11px] font-bold text-slate-600">Admission Reason / Diagnosis</label>
                 <textarea 
                  className="hms-textarea h-20" 
                  placeholder="Enter details..."
                  value={admitForm.diagnosis}
                  onChange={e => setAdmitForm({...admitForm, diagnosis: e.target.value})}
                 ></textarea>
               </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
              <button className="hms-btn-secondary px-6" onClick={() => setShowAdmitModal(false)}>Cancel</button>
              <button 
                className="hms-btn-primary px-8" 
                onClick={handleAdmitSubmit}
                disabled={loading || !admitForm.patientId}
              >
                {loading ? "Processing..." : "Confirm Admission"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && selectedBed && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><MoveHorizontal size={18} /> Transfer Patient</h3>
              <button onClick={() => setShowTransferModal(false)}><XCircle size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
               <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                 <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">Current Patient</p>
                 <p className="text-sm font-bold text-blue-800">{selectedBed.patientName}</p>
                 <p className="text-[10px] text-blue-500">From Bed: {selectedBed.bedNumber} ({selectedBed.ward?.name})</p>
               </div>

               <div className="space-y-3">
                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Target Ward</label>
                   <select 
                    className="hms-select"
                    value={transferForm.newWardId}
                    onChange={e => {
                      setTransferForm({...transferForm, newWardId: e.target.value});
                      fetchAvailableBeds(e.target.value);
                    }}
                   >
                     <option value="">Select Ward</option>
                     {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                   </select>
                 </div>

                 <div className="space-y-1">
                   <label className="text-[11px] font-bold text-slate-600">Target Bed</label>
                   <select 
                    className="hms-select"
                    value={transferForm.newBedId}
                    onChange={e => setTransferForm({...transferForm, newBedId: e.target.value})}
                    disabled={!transferForm.newWardId}
                   >
                     <option value="">Select Bed</option>
                     {availableBeds.map(b => <option key={b.id} value={b.id}>{b.bedNumber} (₹{b.bedChargePerDay})</option>)}
                   </select>
                 </div>
               </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
              <button className="hms-btn-secondary px-6" onClick={() => setShowTransferModal(false)}>Cancel</button>
              <button 
                className="hms-btn-primary px-8" 
                onClick={handleTransferSubmit}
                disabled={loading || !transferForm.newBedId}
              >
                {loading ? "Processing..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
