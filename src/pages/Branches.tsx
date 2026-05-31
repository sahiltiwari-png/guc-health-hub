import React, { useEffect, useState } from 'react';
import { Building2, Edit, RefreshCw, Plus, X, Trash2, MapPin, Phone, Code, CheckCircle, XCircle } from 'lucide-react';
import { 
  getApiV1Branches, 
  postApiV1Branches, 
  putApiV1BranchesByid, 
  deleteApiV1BranchesByid,
  extractArray 
} from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const Branches = () => {
  const { toast } = useToast();
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    phone: '',
    active: true
  });

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getApiV1Branches();
      if (res.ok) {
        setBranches(extractArray(res));
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({ title: 'Error', description: 'Failed to fetch branches', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (showModal === 'edit' && selectedBranch) {
        res = await putApiV1BranchesByid(selectedBranch.id, formData);
      } else {
        res = await postApiV1Branches(formData);
      }

      if (res.ok) {
        toast({ title: 'Success', description: `Branch ${showModal === 'edit' ? 'updated' : 'created'} successfully` });
        setShowModal(null);
        fetchBranches();
      } else {
        toast({ title: 'Error', description: res.data?.message || 'Operation failed', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    setLoading(true);
    try {
      const res = await deleteApiV1BranchesByid(id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Branch deleted successfully' });
        fetchBranches();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete branch', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (branch: any) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      phone: branch.phone,
      active: branch.active
    });
    setShowModal('edit');
  };

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Building2 size={16} /> Branch Management</div>
        <button className="p-1.5 hover:bg-muted rounded text-primary transition-colors" onClick={fetchBranches}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex justify-between items-center bg-card p-3 border border-border shadow-sm">
        <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hospital Branches</div>
        <button 
          className="hms-btn-primary flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase"
          onClick={() => {
            setSelectedBranch(null);
            setFormData({ name: '', code: '', address: '', phone: '', active: true });
            setShowModal('create');
          }}
        >
          <Plus size={14} /> Add New Branch
        </button>
      </div>

      <div className="bg-card border border-border shadow-sm overflow-hidden">
        <table className="hms-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Branch Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && branches.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12"><RefreshCw size={24} className="animate-spin mx-auto text-primary" /></td></tr>
            ) : branches.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted-foreground italic">No branches found in the system.</td></tr>
            ) : branches.map((b) => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                <td className="font-mono text-[10px] font-bold text-primary">{b.code}</td>
                <td className="font-bold">{b.name}</td>
                <td className="text-xs max-w-[200px] truncate">{b.address}</td>
                <td className="text-xs font-medium">{b.phone}</td>
                <td>
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full flex items-center gap-1 w-fit ${b.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {b.active ? <CheckCircle size={10} /> : <XCircle size={10} />}
                    {b.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(b)} className="p-1.5 hover:bg-primary/10 rounded text-primary transition-colors" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 hover:bg-destructive/10 rounded text-destructive transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} className="text-primary" /> 
                {showModal === 'edit' ? 'Edit Branch Details' : 'Register New Branch'}
              </h3>
              <button onClick={() => setShowModal(null)} className="hover:text-primary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Code size={10} /> Branch Code
                  </label>
                  <input 
                    className="hms-input w-full font-mono uppercase font-bold" 
                    required 
                    placeholder="e.g. B001" 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Building2 size={10} /> Branch Name
                  </label>
                  <input 
                    className="hms-input w-full font-bold" 
                    required 
                    placeholder="e.g. City Center Branch" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                  <MapPin size={10} /> Full Address
                </label>
                <textarea 
                  className="hms-input w-full h-20 text-xs" 
                  required 
                  placeholder="Street, City, Zip Code..." 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <Phone size={10} /> Contact Phone
                  </label>
                  <input 
                    className="hms-input w-full" 
                    required 
                    placeholder="+91 XXXXX XXXXX" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div className="flex items-center gap-2 h-10 px-3 bg-muted/20 border border-border rounded">
                  <input 
                    type="checkbox" 
                    id="branchActive" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    checked={formData.active}
                    onChange={e => setFormData({...formData, active: e.target.checked})}
                  />
                  <label htmlFor="branchActive" className="text-[10px] font-bold uppercase text-slate-700 cursor-pointer">Active Status</label>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <button type="button" className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 font-bold uppercase" disabled={loading}>
                  {showModal === 'edit' ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
