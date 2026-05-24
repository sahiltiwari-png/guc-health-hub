import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Scissors, Bone, Heart, Brain, Activity, CircleDot,
  Baby, Microscope, Eye, Ear, SmilePlus, Pill, Shield, Bed,
  UtensilsCrossed, Wrench, FileText, CreditCard, SprayCan, Thermometer,
  Syringe, Zap, MonitorCheck, Droplets, Building2, DoorOpen, Users,
  ChefHat, Truck, AlertTriangle, Clock, CheckCircle2, XCircle, Search,
  BedDouble, Utensils, ShoppingCart, Timer, CircleDollarSign, LayoutGrid,
  RefreshCw, Trash2, Edit, Save, Plus, X
} from 'lucide-react';
import { 
  getApiDepartments, 
  getApiDepartmentsSearch, 
  postApiDepartments, 
  putApiDepartmentsByid, 
  deleteApiDepartmentsByid,
  extractArray,
  apiRequest
} from "@/api/apiService";
import { toast } from "@/hooks/use-toast";

// ── Department Data ──
const clinicalDepts = [
  { name: 'General Medicine', icon: Stethoscope, hod: 'Dr. Rajesh Kumar', staff: 24, beds: 60, opd: 'Mon-Sat', status: 'Active', type: 'CLINICAL' },
  { name: 'General Surgery', icon: Scissors, hod: 'Dr. Anita Sharma', staff: 18, beds: 40, opd: 'Mon-Fri', status: 'Active', type: 'CLINICAL' },
  { name: 'Orthopedics', icon: Bone, hod: 'Dr. Vikram Singh', staff: 12, beds: 30, opd: 'Mon-Sat', status: 'Active', type: 'CLINICAL' },
  { name: 'Cardiology', icon: Heart, hod: 'Dr. Suresh Menon', staff: 15, beds: 20, opd: 'Mon-Fri', status: 'Active', type: 'CLINICAL' },
  { name: 'Neurology', icon: Brain, hod: 'Dr. Priya Nair', staff: 10, beds: 15, opd: 'Mon-Thu', status: 'Active', type: 'CLINICAL' },
];

const canteenOrders = [
  { id: 'ORD-1044', table: 'T-05', items: 'Thali x4, Roti x8, Dal, Rice', amount: 560, status: 'Served', time: '12:00 PM', type: 'Dine-in' },
  { id: 'ORD-1045', table: 'T-01', items: 'Paneer Butter Masala x2, Naan x6', amount: 420, status: 'Preparing', time: '12:15 PM', type: 'Dine-in' },
  { id: 'ORD-1046', table: 'T-03', items: 'Veg Thali x4', amount: 480, status: 'Preparing', time: '12:20 PM', type: 'Dine-in' },
  { id: 'ORD-1047', table: 'T-07', items: 'Biryani x6, Raita x6', amount: 720, status: 'Ready', time: '12:25 PM', type: 'Dine-in' },
  { id: 'ORD-1048', table: 'T-10', items: 'South Indian Combo x5', amount: 500, status: 'Preparing', time: '12:30 PM', type: 'Dine-in' },
  { id: 'ORD-1049', table: '-', items: 'Sandwich x2, Coffee x2', amount: 180, status: 'Ready', time: '12:28 PM', type: 'Takeaway' },
  { id: 'ORD-1050', table: '-', items: 'Patient Diet - Soft x10, Liquid x5', amount: 0, status: 'Dispatched', time: '12:10 PM', type: 'Ward Delivery' },
  { id: 'ORD-1051', table: '-', items: 'ICU Diet - Liquid x8', amount: 0, status: 'Preparing', time: '12:35 PM', type: 'Ward Delivery' },
];

const canteenMenu = [
  { item: 'Veg Thali', price: 120, category: 'Main', available: true },
  { item: 'Non-Veg Thali', price: 150, category: 'Main', available: true },
  { item: 'Paneer Butter Masala', price: 140, category: 'Main', available: true },
  { item: 'Biryani (Veg/Non-Veg)', price: 120, category: 'Main', available: true },
  { item: 'South Indian Combo', price: 100, category: 'Main', available: true },
  { item: 'Roti (per pc)', price: 10, category: 'Bread', available: true },
  { item: 'Naan (per pc)', price: 20, category: 'Bread', available: true },
  { item: 'Dal Fry', price: 60, category: 'Side', available: true },
  { item: 'Raita', price: 30, category: 'Side', available: true },
  { item: 'Tea', price: 15, category: 'Beverage', available: true },
  { item: 'Coffee', price: 20, category: 'Beverage', available: true },
  { item: 'Cold Drink', price: 30, category: 'Beverage', available: false },
  { item: 'Sandwich', price: 50, category: 'Snack', available: true },
  { item: 'Samosa (2 pcs)', price: 30, category: 'Snack', available: true },
];

const canteenTables = [
  { id: 'T-01', seats: 4, status: 'Occupied', guest: 'John Doe', orderNo: 'ORD-1045', since: '12:15 PM' },
  { id: 'T-02', seats: 2, status: 'Available', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-03', seats: 4, status: 'Occupied', guest: 'Jane Smith', orderNo: 'ORD-1046', since: '12:20 PM' },
  { id: 'T-04', seats: 6, status: 'Reserved', guest: 'Dr. Kumar', orderNo: '-', since: '1:00 PM' },
  { id: 'T-05', seats: 4, status: 'Occupied', guest: 'Staff Group', orderNo: 'ORD-1044', since: '12:00 PM' },
  { id: 'T-06', seats: 2, status: 'Available', guest: '-', orderNo: '-', since: '-' },
];

const Departments = () => {
  const tabs = [
    { id: 'clinical', label: 'Clinical', icon: Stethoscope },
    { id: 'support', label: 'Critical Care', icon: Thermometer },
    { id: 'diagnostic', label: 'Diagnostics', icon: Microscope },
    { id: 'admin', label: 'Admin & Services', icon: Wrench },
    { id: 'infrastructure', label: 'Rooms / Wards', icon: BedDouble },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
    { id: 'canteen', label: 'Canteen Mgmt', icon: Utensils },
  ];
  const [activeTab, setActiveTab] = useState('clinical');
  const [search, setSearch] = useState('');
  const [infraTab, setInfraTab] = useState<'rooms' | 'wards'>('rooms');
  const [canteenView, setCanteenView] = useState<'tables' | 'orders' | 'menu'>('tables');
  const [departments, setDepartments] = useState<any[]>([]);
  const [infraData, setInfraData] = useState({ rooms: [], wards: [], kitchens: [] });
  const [loading, setLoading] = useState(false);
  
  // Pagination & Modal state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
    location: '',
    contactNumber: '',
    email: '',
    totalBeds: 0,
    availableBeds: 0,
    active: true
  });

  const fetchData = async (p = page, q = search) => {
    setLoading(true);
    try {
      let deptRes;
      if (q) {
        deptRes = await getApiDepartmentsSearch({ query: q, page: p, size });
      } else {
        deptRes = await getApiDepartments({ page: p, size });
      }

      const [wardsRes, bedsRes, kitchenRes] = await Promise.all([
        apiRequest('/api/v1/ipd/wards'),
        apiRequest('/api/v1/ipd/beds'),
        apiRequest('/api/v1/kitchen/schedule')
      ]);

      if (deptRes.ok) {
        setDepartments(extractArray(deptRes));
        if (deptRes.data?.data?.totalPages) {
          setTotalPages(deptRes.data.data.totalPages);
        }
      }
      
      setInfraData({
        wards: wardsRes.ok ? extractArray(wardsRes) : [],
        rooms: bedsRes.ok ? extractArray(bedsRes) : [],
        kitchens: kitchenRes.ok ? extractArray(kitchenRes) : []
      });

      if (!deptRes.ok || extractArray(deptRes).length === 0) {
        if (!q && p === 0) {
          setDepartments(clinicalDepts.map((d, i) => ({ 
            id: `mock-${i}`, 
            name: d.name, 
            code: d.name.substring(0, 3).toUpperCase(),
            active: true, 
            headOfDepartment: d.hod,
            totalBeds: d.beds,
            type: d.type
          })));
        }
      }

    } catch (e) { 
      console.error('Error fetching departments:', e); 
      toast({ title: "Error", description: "Failed to fetch departments", variant: "destructive" });
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [page, size]);

  const handleSearch = () => {
    setPage(0);
    fetchData(0, search);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (editingDept) {
        res = await putApiDepartmentsByid(editingDept.id, formData);
      } else {
        res = await postApiDepartments(formData);
      }

      if (res.ok) {
        toast({ title: "Success", description: `Department ${editingDept ? 'updated' : 'created'} successfully` });
        setShowModal(false);
        setEditingDept(null);
        setFormData({
          name: '', code: '', description: '', headOfDepartment: '',
          location: '', contactNumber: '', email: '', totalBeds: 0, availableBeds: 0, active: true
        });
        fetchData();
      } else {
        toast({ title: "Error", description: res.data?.message || "Operation failed", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    setLoading(true);
    try {
      const res = await deleteApiDepartmentsByid(id);
      if (res.ok) {
        toast({ title: "Deleted", description: "Department removed successfully" });
        fetchData();
      } else {
        toast({ title: "Error", description: "Failed to delete department", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (dept: any) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      headOfDepartment: dept.headOfDepartment || '',
      location: dept.location || '',
      contactNumber: dept.contactNumber || '',
      email: dept.email || '',
      totalBeds: dept.totalBeds || 0,
      availableBeds: dept.availableBeds || 0,
      active: dept.active ?? true
    });
    setShowModal(true);
  };


  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={16} />
          Department Management
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="hms-input w-48 pr-8"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
          </div>
          <button 
            className="hms-btn-primary flex items-center gap-1"
            onClick={() => {
              setEditingDept(null);
              setFormData({
                name: '', code: '', description: '', headOfDepartment: '',
                location: '', contactNumber: '', email: '', totalBeds: 0, availableBeds: 0, active: true
              });
              setShowModal(true);
            }}
          >
            <Plus size={14} /> Add Department
          </button>
          <button className="hms-btn-secondary p-2" onClick={() => fetchData()}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Module-style Top Navigation */}
      <div className="bg-primary flex items-center gap-0 overflow-x-auto mt-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold whitespace-nowrap transition-all border-b-2
                ${active
                  ? 'bg-card text-primary border-primary'
                  : 'text-primary-foreground/80 border-transparent hover:bg-primary-foreground/10'
                }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-2 my-2">
        <SummaryCard label="Total Depts" value={departments.length} />
        <SummaryCard label="Clinical" value={departments.filter(d => d.type === 'CLINICAL').length} />
        <SummaryCard label="Support" value={departments.filter(d => d.type === 'SUPPORT').length} />
        <SummaryCard label="Diagnostic" value={departments.filter(d => d.type === 'DIAGNOSTIC').length} />
        <SummaryCard label="Total Wards" value={infraData.wards.length} />
        <SummaryCard label="Total Beds" value={infraData.rooms.length} />
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border">
        {activeTab === 'clinical' && <ClinicalTable data={departments.filter(d => d.type === 'CLINICAL' || !d.type)} onEdit={openEdit} onDelete={handleDelete} />}
        {activeTab === 'support' && <SupportTable data={departments.filter(d => d.type === 'SUPPORT')} onEdit={openEdit} onDelete={handleDelete} />}
        {activeTab === 'diagnostic' && <DiagnosticTable data={departments.filter(d => d.type === 'DIAGNOSTIC')} onEdit={openEdit} onDelete={handleDelete} />}
        {activeTab === 'admin' && <AdminTable data={departments.filter(d => d.type === 'ADMIN')} onEdit={openEdit} onDelete={handleDelete} />}
        {activeTab === 'infrastructure' && (
          <div>
            <div className="flex gap-0 border-b border-border">
              {(['rooms', 'wards'] as const).map(t => (
                <button key={t} onClick={() => setInfraTab(t)}
                  className={`px-3 py-1.5 text-xs font-semibold capitalize ${infraTab === t ? 'bg-muted text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
                  {t}
                </button>
              ))}
            </div>
            {infraTab === 'rooms' && <RoomsTable data={infraData.rooms} />}
            {infraTab === 'wards' && <WardsTable data={infraData.wards} />}
          </div>
        )}
        {activeTab === 'kitchen' && <KitchenTable data={infraData.kitchens} />}
        {activeTab === 'canteen' && <CanteenDashboard view={canteenView} setView={setCanteenView} />}
      </div>

      {/* Pagination */}
      {['clinical', 'support', 'diagnostic', 'admin'].includes(activeTab) && totalPages > 1 && (
        <div className="flex items-center justify-between p-2 border-t border-border bg-card">
          <div className="text-[10px] text-muted-foreground">
            Page {page + 1} of {totalPages}
          </div>
          <div className="flex gap-1">
            <button 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="hms-btn-secondary px-2 py-1 text-[10px] disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
              className="hms-btn-secondary px-2 py-1 text-[10px] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border w-[500px] shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="hms-section-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={16} />
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </div>
              <button onClick={() => setShowModal(false)} className="hover:text-primary"><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Dept Name *</label>
                  <input 
                    required 
                    className="hms-input w-full" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Code (Auto-gen)</label>
                  <input 
                    className="hms-input w-full" 
                    placeholder="e.g. CARD"
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">HOD Name</label>
                  <input 
                    className="hms-input w-full" 
                    value={formData.headOfDepartment} 
                    onChange={e => setFormData({...formData, headOfDepartment: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Email</label>
                  <input 
                    type="email"
                    className="hms-input w-full" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Contact</label>
                  <input 
                    className="hms-input w-full" 
                    value={formData.contactNumber} 
                    onChange={e => setFormData({...formData, contactNumber: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Location</label>
                  <input 
                    className="hms-input w-full" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Total Beds</label>
                  <input 
                    type="number"
                    className="hms-input w-full" 
                    value={formData.totalBeds} 
                    onChange={e => setFormData({...formData, totalBeds: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input 
                    type="checkbox" 
                    id="active"
                    checked={formData.active} 
                    onChange={e => setFormData({...formData, active: e.target.checked})} 
                  />
                  <label htmlFor="active" className="text-[11px] font-semibold">Active Status</label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                <textarea 
                  className="hms-input w-full h-16 resize-none" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button type="button" onClick={() => setShowModal(false)} className="hms-btn-secondary px-4">Cancel</button>
                <button type="submit" disabled={loading} className="hms-btn-primary px-4 flex items-center gap-1">
                  {loading ? <RefreshCw size={12} className="animate-spin" /> : <Save size={14} />}
                  {editingDept ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border p-2 text-center">
    <div className="text-lg font-bold text-foreground">{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

const ClinicalTable = ({ data, onEdit, onDelete }: { data: any[]; onEdit: (d: any) => void; onDelete: (id: string) => void }) => {
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>Code</th><th>HOD</th><th>Beds</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5 font-semibold text-primary"><Stethoscope size={13} />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.headOfDepartment || 'N/A'}</td>
              <td>{d.totalBeds || 0}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(d)} className="hms-btn-secondary p-1 text-primary"><Edit size={12} /></button>
                  <button onClick={() => onDelete(d.id)} className="hms-btn-secondary p-1 text-destructive"><Trash2 size={12} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SupportTable = ({ data, onEdit, onDelete }: { data: any[]; onEdit: (d: any) => void; onDelete: (id: string) => void }) => {
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Unit</th><th>Code</th><th>Head</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5 font-semibold text-primary"><Wrench size={13} />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.headOfDepartment || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(d)} className="hms-btn-secondary p-1 text-primary"><Edit size={12} /></button>
                  <button onClick={() => onDelete(d.id)} className="hms-btn-secondary p-1 text-destructive"><Trash2 size={12} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DiagnosticTable = ({ data, onEdit, onDelete }: { data: any[]; onEdit: (d: any) => void; onDelete: (id: string) => void }) => {
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>Code</th><th>HOD</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5 font-semibold text-primary"><Microscope size={13} />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.headOfDepartment || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(d)} className="hms-btn-secondary p-1 text-primary"><Edit size={12} /></button>
                  <button onClick={() => onDelete(d.id)} className="hms-btn-secondary p-1 text-destructive"><Trash2 size={12} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AdminTable = ({ data, onEdit, onDelete }: { data: any[]; onEdit: (d: any) => void; onDelete: (id: string) => void }) => {
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Service</th><th>Code</th><th>Head</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {data.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5 font-semibold text-primary"><Building2 size={13} />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.headOfDepartment || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(d)} className="hms-btn-secondary p-1 text-primary"><Edit size={12} /></button>
                  <button onClick={() => onDelete(d.id)} className="hms-btn-secondary p-1 text-destructive"><Trash2 size={12} /></button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const RoomsTable = ({ data }: { data: any[] }) => (
  <table className="hms-table">
    <thead><tr><th>Bed No</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
    <tbody>
      {data.map((r, i) => (
        <tr key={r.id}>
          <td className="font-mono font-bold text-primary">{r.bedNumber}</td>
          <td><span className="text-[10px] px-1.5 py-0.5 bg-muted rounded uppercase">{r.bedType}</span></td>
          <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${r.available ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{r.available ? 'Available' : 'Occupied'}</span></td>
          <td><button className="hms-btn-secondary text-[10px]">Manage</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const WardsTable = ({ data }: { data: any[] }) => (
  <table className="hms-table">
    <thead><tr><th>#</th><th>Ward Name</th><th>Type</th><th>Capacity</th><th>Status</th></tr></thead>
    <tbody>
      {data.map((w, i) => (
        <tr key={w.id}>
          <td>{i + 1}</td><td>{w.name}</td><td>{w.wardType}</td><td>{w.capacity} Beds</td>
          <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">Active</span></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const KitchenTable = ({ data }: { data: any[] }) => (
  <div>
    <div className="hms-section-header text-xs">Kitchen / Dietary Services Schedule</div>
    <table className="hms-table">
      <thead><tr><th>#</th><th>Task / Item</th><th>Time</th><th>Status</th></tr></thead>
      <tbody>
        {data.map((k, i) => (
          <tr key={i}>
            <td>{i + 1}</td><td>{k.taskName || k.itemName || 'Meal Prep'}</td><td>{k.scheduledTime || 'N/A'}</td>
            <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">Scheduled</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Canteen Management Dashboard ──
const CanteenDashboard = ({ view, setView }: { view: string; setView: (v: any) => void }) => {
  const occupied = canteenTables.filter(t => t.status === 'Occupied').length;
  const available = canteenTables.filter(t => t.status === 'Available').length;
  const reserved = canteenTables.filter(t => t.status === 'Reserved').length;
  const preparing = canteenOrders.filter(o => o.status === 'Preparing').length;
  const ready = canteenOrders.filter(o => o.status === 'Ready').length;
  const todayRevenue = canteenOrders.reduce((a, o) => a + o.amount, 0);

  return (
    <div>
      {/* Canteen Summary */}
      <div className="grid grid-cols-6 gap-2 p-2">
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold text-foreground">{canteenTables.length}</div>
          <div className="text-[10px] text-muted-foreground">Total Tables</div>
        </div>
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold text-destructive">{occupied}</div>
          <div className="text-[10px] text-muted-foreground">Occupied</div>
        </div>
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold" style={{ color: 'hsl(var(--hms-success))' }}>{available}</div>
          <div className="text-[10px] text-muted-foreground">Available</div>
        </div>
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold text-primary">{reserved}</div>
          <div className="text-[10px] text-muted-foreground">Reserved</div>
        </div>
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold text-foreground">{canteenOrders.length}</div>
          <div className="text-[10px] text-muted-foreground">Active Orders</div>
        </div>
        <div className="bg-muted border border-border p-2 text-center">
          <div className="text-lg font-bold text-foreground">₹{todayRevenue}</div>
          <div className="text-[10px] text-muted-foreground">Today Revenue</div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-0 border-b border-border">
        {([
          { id: 'tables', label: 'Table Layout', icon: LayoutGrid },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'menu', label: 'Menu Items', icon: Utensils },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold ${view === t.id ? 'bg-muted text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
            <t.icon size={12} />{t.label}
          </button>
        ))}
      </div>

      {view === 'tables' && <CanteenTablesView />}
      {view === 'orders' && <CanteenOrdersView />}
      {view === 'menu' && <CanteenMenuView />}
    </div>
  );
};

const statusColor = (s: string) => {
  if (s === 'Occupied') return 'bg-destructive/15 text-destructive border-destructive/30';
  if (s === 'Available') return 'bg-hms-success/15 text-hms-success border-hms-success/30';
  if (s === 'Reserved') return 'bg-primary/15 text-primary border-primary/30';
  if (s === 'Cleaning') return 'bg-hms-warning/15 text-hms-warning border-hms-warning/30';
  return 'bg-muted text-muted-foreground';
};

const CanteenTablesView = () => (
  <div className="p-3">
    <div className="text-xs font-semibold mb-2 text-muted-foreground">Main Canteen — Ground Floor | Capacity: 200 seats | Timing: 7AM-10PM | In-Charge: Mr. Harish</div>
    <div className="grid grid-cols-4 gap-2">
      {canteenTables.map(t => (
        <div key={t.id} className={`border rounded p-2 text-xs ${statusColor(t.status)}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-sm">{t.id}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded border font-semibold">{t.status}</span>
          </div>
          <div className="text-[10px] space-y-0.5">
            <div>Seats: {t.seats}</div>
            {t.guest !== '-' && <div>Guest: {t.guest}</div>}
            {t.orderNo !== '-' && <div>Order: {t.orderNo}</div>}
            {t.since !== '-' && <div>Since: {t.since}</div>}
          </div>
          {t.status === 'Occupied' && (
            <button className="mt-1.5 w-full text-[10px] py-0.5 bg-primary text-primary-foreground rounded">View Bill</button>
          )}
          {t.status === 'Available' && (
            <button className="mt-1.5 w-full text-[10px] py-0.5 bg-primary text-primary-foreground rounded">Assign</button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const orderStatusColor = (s: string) => {
  if (s === 'Preparing') return 'bg-hms-warning text-hms-warning-foreground';
  if (s === 'Ready') return 'bg-primary text-primary-foreground';
  if (s === 'Served') return 'bg-hms-success text-hms-success-foreground';
  if (s === 'Dispatched') return 'bg-hms-info text-hms-info-foreground';
  return 'bg-muted text-muted-foreground';
};

const CanteenOrdersView = () => (
  <div>
    <table className="hms-table">
      <thead><tr>
        <th>Order ID</th><th>Table</th><th>Type</th><th>Items</th><th>Amount</th><th>Status</th><th>Time</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {canteenOrders.map(o => (
          <tr key={o.id}>
            <td className="font-semibold">{o.id}</td>
            <td>{o.table}</td>
            <td><span className="text-[10px] px-1 py-0.5 bg-muted rounded">{o.type}</span></td>
            <td className="text-[10px] max-w-[200px] truncate">{o.items}</td>
            <td className="font-semibold">{o.amount > 0 ? `₹${o.amount}` : 'N/C'}</td>
            <td><span className={`text-[10px] px-1.5 py-0.5 ${orderStatusColor(o.status)}`}>{o.status}</span></td>
            <td>{o.time}</td>
            <td>
              {o.status === 'Preparing' && <button className="hms-btn-primary text-[10px]">Mark Ready</button>}
              {o.status === 'Ready' && <button className="hms-btn-primary text-[10px]">Mark Served</button>}
              {o.status === 'Served' && <button className="hms-btn-secondary text-[10px]">Print Bill</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CanteenMenuView = () => (
  <div>
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Item</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {canteenMenu.map((m, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td className="font-semibold">{m.item}</td>
            <td><span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{m.category}</span></td>
            <td>₹{m.price}</td>
            <td>
              {m.available
                ? <span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">Yes</span>
                : <span className="text-[10px] px-1.5 py-0.5 bg-destructive text-destructive-foreground">No</span>
              }
            </td>
            <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">Toggle</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Departments;
