import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, Scissors, Bone, Heart, Brain, Activity, CircleDot,
  Baby, Microscope, Eye, Ear, SmilePlus, Pill, Shield, Bed,
  UtensilsCrossed, Wrench, FileText, CreditCard, SprayCan, Thermometer,
  Syringe, Zap, MonitorCheck, Droplets, Building2, DoorOpen, Users,
  ChefHat, Truck, AlertTriangle, Clock, CheckCircle2, XCircle, Search,
  BedDouble, Utensils, ShoppingCart, Timer, CircleDollarSign, LayoutGrid,
  RefreshCw
} from 'lucide-react';
import { getAutoDepartments, extractArray } from "@/api/apiService";

// ── Department Data ──
const clinicalDepts = [
  { name: 'General Medicine', icon: Stethoscope, hod: 'Dr. Rajesh Kumar', staff: 24, beds: 60, opd: 'Mon-Sat', status: 'Active' },
  { name: 'General Surgery', icon: Scissors, hod: 'Dr. Anita Sharma', staff: 18, beds: 40, opd: 'Mon-Fri', status: 'Active' },
  { name: 'Orthopedics', icon: Bone, hod: 'Dr. Vikram Singh', staff: 12, beds: 30, opd: 'Mon-Sat', status: 'Active' },
  { name: 'Cardiology', icon: Heart, hod: 'Dr. Suresh Menon', staff: 15, beds: 20, opd: 'Mon-Fri', status: 'Active' },
  { name: 'Neurology', icon: Brain, hod: 'Dr. Priya Nair', staff: 10, beds: 15, opd: 'Mon-Thu', status: 'Active' },
  { name: 'Nephrology', icon: Activity, hod: 'Dr. Arun Joshi', staff: 8, beds: 12, opd: 'Tue-Sat', status: 'Active' },
  { name: 'Gastroenterology', icon: CircleDot, hod: 'Dr. Meena Gupta', staff: 9, beds: 14, opd: 'Mon-Fri', status: 'Active' },
  { name: 'Gynecology & Obstetrics', icon: Baby, hod: 'Dr. Kavita Rao', staff: 20, beds: 35, opd: 'Mon-Sat', status: 'Active' },
  { name: 'Pediatrics', icon: Baby, hod: 'Dr. Sanjay Verma', staff: 16, beds: 25, opd: 'Mon-Sat', status: 'Active' },
  { name: 'Dermatology', icon: SmilePlus, hod: 'Dr. Neha Kapoor', staff: 6, beds: 0, opd: 'Mon-Fri', status: 'Active' },
  { name: 'ENT', icon: Ear, hod: 'Dr. Rakesh Bhatia', staff: 8, beds: 10, opd: 'Mon-Sat', status: 'Active' },
  { name: 'Ophthalmology', icon: Eye, hod: 'Dr. Sunita Devi', staff: 7, beds: 8, opd: 'Mon-Fri', status: 'Active' },
  { name: 'Psychiatry', icon: Brain, hod: 'Dr. Amit Saxena', staff: 5, beds: 10, opd: 'Mon-Wed-Fri', status: 'Active' },
  { name: 'Oncology', icon: Shield, hod: 'Dr. Ritu Agarwal', staff: 12, beds: 18, opd: 'Mon-Sat', status: 'Active' },
  { name: 'Urology', icon: Activity, hod: 'Dr. Pankaj Mishra', staff: 7, beds: 10, opd: 'Tue-Sat', status: 'Active' },
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

const tabs = [
  { id: 'clinical', label: 'Clinical', icon: Stethoscope },
  { id: 'support', label: 'Critical Care', icon: Thermometer },
  { id: 'diagnostic', label: 'Diagnostics', icon: Microscope },
  { id: 'admin', label: 'Admin & Services', icon: Wrench },
  { id: 'infrastructure', label: 'Rooms / Wards', icon: BedDouble },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'canteen', label: 'Canteen Mgmt', icon: Utensils },
];

const Departments = () => {
  const [activeTab, setActiveTab] = useState('clinical');
  const [search, setSearch] = useState('');
  const [infraTab, setInfraTab] = useState<'rooms' | 'wards'>('rooms');
  const [canteenView, setCanteenView] = useState<'tables' | 'orders' | 'menu'>('tables');
  const [departments, setDepartments] = useState<any[]>([]);
  const [infraData, setInfraData] = useState({ rooms: [], wards: [], kitchens: [] });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, wardsRes, bedsRes, kitchenRes] = await Promise.all([
        getAutoDepartments(),
        apiRequest('/api/v1/ipd/wards'),
        apiRequest('/api/v1/ipd/beds'),
        apiRequest('/api/v1/kitchen/schedule')
      ]);

      if (deptRes.ok) setDepartments(extractArray(deptRes));
      
      setInfraData({
        wards: wardsRes.ok ? extractArray(wardsRes) : [],
        rooms: bedsRes.ok ? extractArray(bedsRes) : [], // Mapping beds to "rooms" for now
        kitchens: kitchenRes.ok ? extractArray(kitchenRes) : []
      });

    } catch (e) { 
      console.error('Error fetching departments:', e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);


  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 size={16} />
          Department Management
        </div>
        <div className="flex items-center gap-2">
          <input
            className="hms-input w-48"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="hms-btn-primary">+ Add Department</button>
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
        {activeTab === 'clinical' && <ClinicalTable data={departments.filter(d => d.type === 'CLINICAL' || !d.type)} search={search} />}
        {activeTab === 'support' && <SupportTable data={departments.filter(d => d.type === 'SUPPORT')} search={search} />}
        {activeTab === 'diagnostic' && <DiagnosticTable data={departments.filter(d => d.type === 'DIAGNOSTIC')} search={search} />}
        {activeTab === 'admin' && <AdminTable data={departments.filter(d => d.type === 'ADMIN')} search={search} />}
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
    </div>
  );
};

const SummaryCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-card border border-border p-2 text-center">
    <div className="text-lg font-bold text-foreground">{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

const ClinicalTable = ({ data, search }: { data: any[]; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>Code</th><th>HOD</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Stethoscope size={13} className="text-primary" />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.hodName || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SupportTable = ({ data, search }: { data: any[]; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Unit</th><th>Code</th><th>Head</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Wrench size={13} className="text-primary" />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.hodName || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DiagnosticTable = ({ data, search }: { data: any[]; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>Code</th><th>HOD</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Microscope size={13} className="text-primary" />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.hodName || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AdminTable = ({ data, search }: { data: any[]; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Service</th><th>Code</th><th>Head</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          return (
            <tr key={d.id}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Building2 size={13} className="text-primary" />{d.name}</div></td>
              <td className="font-mono text-[10px]">{d.code}</td>
              <td>{d.hodName || 'N/A'}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${d.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted text-muted-foreground'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
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
