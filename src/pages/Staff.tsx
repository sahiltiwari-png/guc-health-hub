import React, { useState, useEffect } from 'react';
import { Edit, Eye, Search, Plus, Users, Filter, X, Trash2, ChevronLeft, ChevronRight, RefreshCw, UserCheck, Shield, Network } from 'lucide-react';
import { listUsers, listRoles, deleteUser, updateUser } from '@/api/apiService';
import { useToast } from '@/components/ui/use-toast';
import AddStaff from './AddStaff';

type Tab = 'all' | 'doctors' | 'nurses' | 'hierarchy';

const Staff = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('all');
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<any | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchRoles = async () => {
    try {
      const res = await listRoles();
      setRoles(res.data || []);
    } catch (error: any) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const fetchStaff = async (page = 1) => {
    setIsLoading(true);
    try {
      const params: any = { page, limit, populate: 'role department_id managerId' };
      if (tab === 'doctors') params.roleName = 'Doctor';
      if (tab === 'nurses') params.roleName = 'Nurse';
      if (selectedRole) params.role = selectedRole;
      if (searchQuery) params.search = searchQuery;
      
      const res = await listUsers(params);
      setStaff(res.data || []);
      setTotalPages(Math.ceil((res.total || 0) / limit));
      setCurrentPage(page);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch staff.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchStaff(1);
  }, [tab, selectedRole, searchQuery]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteUser(id);
        toast({ title: "Success", description: "Staff member deleted successfully" });
        fetchStaff();
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Failed to delete staff", variant: "destructive" });
      }
    }
  };

  const getTeamUnder = (managerId: string) => {
    return staff.filter(s => s.managerId?._id === managerId);
  };

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="hms-section-header flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Users size={20} /> Staff & Team Management
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAdding(true)} className="hms-btn-primary flex items-center gap-2 h-8 px-4 text-xs font-bold uppercase">
            <Plus size={14} /> Add Staff
          </button>
          <button className="hms-btn-secondary h-8" onClick={() => fetchStaff()}><RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-card p-2 border border-border rounded-sm shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            className="hms-input pl-9 w-full h-8 text-xs" 
            placeholder="Search by Name, Email, ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select 
          className="hms-select w-40 h-8 text-xs font-bold"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>

        <div className="flex gap-0.5 p-0.5 bg-muted rounded-sm">
          {(['all', 'doctors', 'nurses', 'hierarchy'] as const).map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                tab === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto shadow-sm">
        {tab === 'hierarchy' ? (
          <div className="p-6 space-y-8">
            {staff.filter(s => !s.managerId).map(manager => (
              <div key={manager._id} className="space-y-4">
                <div className="flex items-center gap-3 bg-primary/5 p-3 border-l-4 border-primary rounded-r">
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {manager.name.charAt(0)}
                   </div>
                   <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {manager.name} <span className="text-[10px] px-2 py-0.5 bg-primary text-primary-foreground rounded-full uppercase">{manager.role?.name || manager.role}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{manager.department_id?.name} • MANAGER</div>
                   </div>
                </div>
                
                <div className="ml-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-l-2 border-dashed border-border pl-6 relative">
                   {getTeamUnder(manager._id).map(reportee => (
                      <div key={reportee._id} className="bg-card border border-border p-3 rounded shadow-sm hover:border-primary/50 transition-all group relative">
                         <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-dashed border-t-2 border-border"></div>
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs">
                               {reportee.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-bold text-xs">{reportee.name}</div>
                               <div className="text-[9px] text-muted-foreground font-bold uppercase">{reportee.role?.name || reportee.role}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                   {getTeamUnder(manager._id).length === 0 && (
                      <div className="text-[10px] text-muted-foreground italic py-2">No direct reports</div>
                   )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="hms-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Role/Dept</th>
                <th>Contact</th>
                <th>Managed By</th>
                <th>Teams</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s._id}>
                  <td className="font-bold text-primary uppercase tracking-tighter">{s.employee_id}</td>
                  <td>
                    <div className="font-bold">{s.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">{s.gender}</div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{s.role?.name || s.role}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{s.department_id?.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col text-[10px]">
                      <span className="font-bold">{s.email}</span>
                      <span className="text-muted-foreground">{s.phone}</span>
                    </div>
                  </td>
                  <td>
                    {s.managerId ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                          {s.managerId.name?.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold">{s.managerId.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase italic tracking-widest opacity-50">Head</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-primary" />
                      <span className="text-xs font-bold">{getTeamUnder(s._id).length}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      s.status === 'Active' || !s.status ? 'bg-hms-success/10 text-hms-success' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {s.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setViewingStaff(s)} className="p-1.5 hover:bg-primary/10 rounded text-primary" title="View Profile"><Eye size={14} /></button>
                      <button className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Edit Details"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 hover:bg-destructive/10 rounded text-destructive" title="Delete Staff"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isAdding && <AddStaff onAdd={() => { setIsAdding(false); fetchStaff(); }} onCancel={() => setIsAdding(false)} />}

      {/* Profile Viewer Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2 text-primary uppercase tracking-widest"><Shield size={16} /> Staff Profile Details</h3>
              <button onClick={() => setViewingStaff(null)}><X size={18} /></button>
            </div>
            <div className="p-6">
               <div className="flex gap-6 mb-6 pb-6 border-b border-border">
                  <div className="w-24 h-24 rounded bg-primary/10 flex items-center justify-center text-4xl text-primary font-bold">
                     {viewingStaff.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                     <h2 className="text-2xl font-bold">{viewingStaff.name}</h2>
                     <p className="text-sm font-bold text-primary uppercase tracking-widest">{viewingStaff.role?.name || viewingStaff.role}</p>
                     <p className="text-xs text-muted-foreground">{viewingStaff.department_id?.name} Department</p>
                     <div className="flex gap-2 pt-2">
                        <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold uppercase tracking-tighter">ID: {viewingStaff.employee_id}</span>
                        <span className="px-2 py-0.5 bg-hms-success/10 text-hms-success rounded text-[10px] font-bold uppercase tracking-tighter">{viewingStaff.status || 'Active'}</span>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Email', value: viewingStaff.email },
                    { label: 'Phone', value: viewingStaff.phone },
                    { label: 'Qualification', value: viewingStaff.qualification },
                    { label: 'Reports To', value: viewingStaff.managerId?.name || 'Top Management' },
                    { label: 'Joining Date', value: viewingStaff.joiningDate ? new Date(viewingStaff.joiningDate).toLocaleDateString() : 'N/A' },
                    { label: 'Team Size', value: `${getTeamUnder(viewingStaff._id).length} People` },
                  ].map((d, i) => (
                    <div key={i} className="space-y-0.5">
                       <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">{d.label}</span>
                       <p className="text-xs font-bold">{d.value}</p>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 flex gap-3">
                  <button className="hms-btn-primary flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase">
                     <UserCheck size={14} /> View Performance
                  </button>
                  <button className="hms-btn-secondary flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase">
                     <Network size={14} /> Org Chart
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
