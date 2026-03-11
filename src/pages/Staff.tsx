import React, { useState, useEffect } from 'react';
import { Edit, Eye, Search, Plus, Users, Filter, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { listUsers, listRoles, deleteUser, updateUser } from '@/api/apiService';
import { useToast } from '@/components/ui/use-toast';
import AddStaff from './AddStaff';

const Staff = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<'all' | 'doctor' | 'nurse' | 'technician' | 'other'>('all');
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingStaff, setViewingStaff] = useState<any | null>(null);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
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
      const params: any = {
        page,
        limit
      };
      if (tab !== 'all' && tab !== 'other') {
        params.role = tab;
      }
      if (selectedRole) {
        params.role = selectedRole;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const res = await listUsers(params);
      setStaff(res.data || []);
      setTotalEntries(res.total || 0);
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
  }, [tab, selectedRole]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStaff(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchStaff(newPage);
    }
  };

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

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateUser(id, { status: newStatus });
      toast({ title: "Success", description: `Staff member is now ${newStatus}` });
      fetchStaff();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update status", variant: "destructive" });
    }
  };

  const handleAddStaff = () => {
    setIsAdding(false);
    fetchStaff();
    toast({ title: "Success", description: "Staff member added successfully" });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between bg-card border-b border-border px-4 py-2 shadow-sm">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Users size={20} /> Staff Management
        </h2>
        <div className="flex items-center gap-3">
          {message.text && (
            <div className={`px-4 py-1 text-xs font-medium rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          <button onClick={() => setIsAdding(true)} className="hms-btn-primary flex items-center gap-2 h-8 px-4 text-xs font-bold">
            <Plus size={14} /> Add Staff
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-auto flex-1">
        {isAdding && <AddStaff onAdd={handleAddStaff} onCancel={() => setIsAdding(false)} />}

        {/* Dense Single-Row Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-card p-2 border border-border rounded-md shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                className="hms-input pl-9 w-64 h-8 text-xs" 
                placeholder="Search by Name, Email, Phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="hms-btn-primary px-4 h-8 flex items-center gap-2 text-[11px] font-bold">
              <Search size={14} /> Search
            </button>
          </form>

          <div className="h-6 w-px bg-border mx-1"></div>

          <select 
            className="hms-select w-40 h-8 text-xs font-semibold"
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setTab('all'); }}
          >
            <option value="">All Roles</option>
            {roles.map(r => (
              <option key={r._id} value={r.name}>{r.name}</option>
            ))}
          </select>

          <div className="h-6 w-px bg-border mx-1"></div>

          <div className="flex gap-0.5 p-0.5 bg-secondary/30 rounded-md">
            {(['all', 'doctor', 'nurse', 'technician', 'other'] as const).map(t => (
              <button 
                key={t} 
                onClick={() => { setTab(t); setSelectedRole(''); }} 
                className={`px-3 py-1 text-[10px] font-bold capitalize rounded-sm transition-all ${
                  tab === t 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {t === 'all' ? 'All' : t === 'doctor' ? 'Doctors' : t === 'nurse' ? 'Nurses' : t === 'technician' ? 'Techs' : 'Others'}
              </button>
            ))}
          </div>
        </div>

        {/* IPD Style Table */}
        <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
          <table className="hms-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Contact Details</th>
                <th>Role</th>
                <th>Department</th>
                <th>Hospital / Branch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? (
                staff.map((s, index) => (
                  <tr key={s._id}>
                    <td>{index + 1}</td>
                    <td className="font-medium text-primary uppercase tracking-tight">{s.employee_id}</td>
                    <td className="font-semibold">{s.name}</td>
                    <td>
                      <div className="flex flex-col text-[11px] gap-0">
                        <span className="font-medium text-gray-700">{s.email}</span>
                        <span className="text-muted-foreground">{s.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                        {typeof s.role === 'object' ? s.role?.name : s.role}
                      </span>
                    </td>
                    <td>{s.department_id?.name || 'N/A'}</td>
                    <td className="text-[10px] text-muted-foreground leading-tight">
                      {s.hospitalId?.name || 'N/A'} / {s.branchId?.name || 'N/A'}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleUpdateStatus(s._id, s.status || 'Active')}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all hover:scale-105 ${
                          s.status === 'Active' || !s.status 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {s.status || 'Active'}
                      </button>
                    </td>
                    <td className="flex gap-2">
                      <button 
                        onClick={() => setViewingStaff(s)}
                        title="View Profile" 
                        className="p-1 hover:bg-secondary rounded text-primary"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        title="Edit Details" 
                        className="p-1 hover:bg-secondary rounded text-primary"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(s._id)}
                        title="Delete Staff" 
                        className="p-1 hover:bg-secondary rounded text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading Records...' : 'No staff members found.'}
                  </td>
                </tr>
              )}
            </tbody>
        </table>

        {/* Pagination Controls */}
        {staff.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Showing <span className="font-bold text-foreground">{(currentPage - 1) * limit + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * limit, totalEntries)}</span> of <span className="font-bold text-foreground">{totalEntries}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-secondary focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft size={16} />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-xs font-bold focus:z-20 ring-1 ring-inset ring-border ${
                          currentPage === pageNum
                            ? 'z-10 bg-primary text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-secondary focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* View Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-primary text-white">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Eye size={16} /> Staff Details
              </h3>
              <button onClick={() => setViewingStaff(null)} className="p-1 hover:bg-white/20 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Name</p>
                <p className="font-bold text-sm text-gray-800">{viewingStaff.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Email</p>
                <p className="font-bold text-sm text-gray-800">{viewingStaff.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Phone</p>
                <p className="font-bold text-sm text-gray-800">{viewingStaff.phone || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Role</p>
                <p className="font-bold text-sm text-gray-800 capitalize">{typeof viewingStaff.role === 'object' ? viewingStaff.role?.name : viewingStaff.role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Department</p>
                <p className="font-bold text-sm text-gray-800">{viewingStaff.department_id?.name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Employee ID</p>
                <p className="font-bold text-sm text-gray-800 uppercase tracking-wider">{viewingStaff.employee_id}</p>
              </div>
              <div className="col-span-2 space-y-1 border-t pt-4">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Hospital / Branch</p>
                <p className="font-bold text-gray-800">{viewingStaff.hospitalId?.name || 'N/A'} - {viewingStaff.branchId?.name || 'N/A'}</p>
              </div>
              <div className="col-span-2 space-y-1 border-t pt-4">
                <p className="text-muted-foreground font-semibold uppercase text-[9px]">Address</p>
                <p className="font-bold text-gray-800">{viewingStaff.address || 'N/A'}</p>
              </div>
            </div>
            <div className="p-3 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setViewingStaff(null)} className="hms-btn-primary px-8 h-8 text-[11px]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
