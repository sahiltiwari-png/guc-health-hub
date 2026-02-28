import React, { useState } from 'react';
import {
  Stethoscope, Scissors, Bone, Heart, Brain, Activity, CircleDot,
  Baby, Microscope, Eye, Ear, SmilePlus, Pill, Shield, Bed,
  UtensilsCrossed, Wrench, FileText, CreditCard, SprayCan, Thermometer,
  Syringe, Zap, MonitorCheck, Droplets, Building2, DoorOpen, Users,
  ChefHat, Truck, AlertTriangle, Clock, CheckCircle2, XCircle, Search,
  BedDouble, Utensils, ShoppingCart, Timer, CircleDollarSign, LayoutGrid
} from 'lucide-react';

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

const supportDepts = [
  { name: 'OT (Operation Theatre)', icon: MonitorCheck, hod: 'Dr. Alok Tiwari', rooms: 8, status: 'Active', availability: '24/7' },
  { name: 'ICU', icon: Thermometer, hod: 'Dr. Neeraj Pandey', rooms: 20, status: 'Active', availability: '24/7' },
  { name: 'NICU', icon: Baby, hod: 'Dr. Smita Jain', rooms: 12, status: 'Active', availability: '24/7' },
  { name: 'PICU', icon: Baby, hod: 'Dr. Ravi Shankar', rooms: 8, status: 'Active', availability: '24/7' },
  { name: 'Emergency / Casualty', icon: AlertTriangle, hod: 'Dr. Deepak Yadav', rooms: 15, status: 'Active', availability: '24/7' },
  { name: 'Day Care', icon: Clock, hod: 'Dr. Pooja Mehta', rooms: 10, status: 'Active', availability: '8AM-8PM' },
];

const diagnosticDepts = [
  { name: 'Radiology', icon: Zap, hod: 'Dr. Kiran Desai', equipment: 'X-Ray, CT, MRI, USG', tests: 450, status: 'Active' },
  { name: 'Pathology / Laboratory', icon: Microscope, hod: 'Dr. Vinod Sharma', equipment: 'Hematology, Biochemistry', tests: 1200, status: 'Active' },
  { name: 'Microbiology Lab', icon: Microscope, hod: 'Dr. Asha Kulkarni', equipment: 'Culture, Sensitivity', tests: 380, status: 'Active' },
  { name: 'Blood Bank', icon: Droplets, hod: 'Dr. Manish Srivastava', equipment: 'Component Sep, Storage', tests: 150, status: 'Active' },
];

const adminDepts = [
  { name: 'Pharmacy', icon: Pill, head: 'Mr. Rajendra Prasad', staff: 15, status: 'Active' },
  { name: 'CSSD', icon: SprayCan, head: 'Mrs. Lata Kumari', staff: 10, status: 'Active' },
  { name: 'MRD', icon: FileText, head: 'Mr. Sunil Kumar', staff: 8, status: 'Active' },
  { name: 'Billing & Insurance', icon: CreditCard, head: 'Mr. Ashok Gupta', staff: 12, status: 'Active' },
  { name: 'Housekeeping', icon: SprayCan, head: 'Mr. Ram Bahadur', staff: 35, status: 'Active' },
  { name: 'Maintenance / Biomedical', icon: Wrench, head: 'Mr. Dinesh Pal', staff: 14, status: 'Active' },
];

const infrastructureData = {
  rooms: [
    { floor: 'Ground', type: 'General Ward', total: 20, occupied: 16, available: 4 },
    { floor: 'Ground', type: 'Private Room', total: 10, occupied: 8, available: 2 },
    { floor: '1st', type: 'General Ward', total: 25, occupied: 20, available: 5 },
    { floor: '1st', type: 'Semi-Private', total: 15, occupied: 12, available: 3 },
    { floor: '2nd', type: 'Deluxe Room', total: 12, occupied: 10, available: 2 },
    { floor: '2nd', type: 'Suite', total: 5, occupied: 3, available: 2 },
    { floor: '3rd', type: 'ICU', total: 20, occupied: 18, available: 2 },
    { floor: '3rd', type: 'NICU', total: 12, occupied: 10, available: 2 },
    { floor: '4th', type: 'OT', total: 8, occupied: 5, available: 3 },
    { floor: '4th', type: 'Recovery', total: 10, occupied: 6, available: 4 },
  ],
  wards: [
    { name: 'Male General Ward', floor: 'Ground', beds: 30, nurse: 'Sr. Nurse Kamla', status: 'Active' },
    { name: 'Female General Ward', floor: 'Ground', beds: 30, nurse: 'Sr. Nurse Rekha', status: 'Active' },
    { name: 'Pediatric Ward', floor: '1st', beds: 20, nurse: 'Sr. Nurse Sunita', status: 'Active' },
    { name: 'Maternity Ward', floor: '1st', beds: 25, nurse: 'Sr. Nurse Geeta', status: 'Active' },
    { name: 'Surgical Ward', floor: '2nd', beds: 25, nurse: 'Sr. Nurse Anita', status: 'Active' },
    { name: 'Orthopedic Ward', floor: '2nd', beds: 20, nurse: 'Sr. Nurse Meera', status: 'Active' },
  ],
  kitchens: [
    { floor: 'Ground', name: 'Main Kitchen', capacity: '500 meals/day', head: 'Chef Ramesh', status: 'Active', timing: '5AM-10PM' },
    { floor: '1st', name: 'Pantry - Floor 1', capacity: '150 meals/day', head: 'Mr. Suresh', status: 'Active', timing: '6AM-9PM' },
    { floor: '2nd', name: 'Pantry - Floor 2', capacity: '150 meals/day', head: 'Mr. Mohan', status: 'Active', timing: '6AM-9PM' },
    { floor: '3rd', name: 'ICU Pantry', capacity: '80 meals/day', head: 'Mrs. Savitri', status: 'Active', timing: '24/7' },
    { floor: '4th', name: 'Pantry - Floor 4', capacity: '100 meals/day', head: 'Mr. Kishan', status: 'Active', timing: '6AM-9PM' },
  ],
};

// Canteen Management Data
const canteenTables = [
  { id: 'T-01', seats: 4, status: 'Occupied', guest: 'Dr. Sharma + 3', orderNo: 'ORD-1045', since: '12:15 PM' },
  { id: 'T-02', seats: 6, status: 'Available', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-03', seats: 4, status: 'Occupied', guest: 'Nurse Staff (4)', orderNo: 'ORD-1046', since: '12:20 PM' },
  { id: 'T-04', seats: 2, status: 'Reserved', guest: 'Dr. Menon', orderNo: '-', since: '12:30 PM' },
  { id: 'T-05', seats: 8, status: 'Occupied', guest: 'Visitor Group', orderNo: 'ORD-1044', since: '12:00 PM' },
  { id: 'T-06', seats: 4, status: 'Available', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-07', seats: 6, status: 'Occupied', guest: 'Admin Team', orderNo: 'ORD-1047', since: '12:25 PM' },
  { id: 'T-08', seats: 4, status: 'Cleaning', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-09', seats: 2, status: 'Available', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-10', seats: 6, status: 'Occupied', guest: 'Lab Staff (5)', orderNo: 'ORD-1048', since: '12:30 PM' },
  { id: 'T-11', seats: 4, status: 'Available', guest: '-', orderNo: '-', since: '-' },
  { id: 'T-12', seats: 8, status: 'Reserved', guest: 'Meeting Lunch', orderNo: '-', since: '1:00 PM' },
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
              className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors
                ${active
                  ? 'bg-card text-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
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
        <SummaryCard label="Clinical Depts" value={clinicalDepts.length} />
        <SummaryCard label="Support Units" value={supportDepts.length} />
        <SummaryCard label="Diagnostic Labs" value={diagnosticDepts.length} />
        <SummaryCard label="Admin Services" value={adminDepts.length} />
        <SummaryCard label="Total Beds" value={infrastructureData.rooms.reduce((a, r) => a + r.total, 0)} />
        <SummaryCard label="Available Beds" value={infrastructureData.rooms.reduce((a, r) => a + r.available, 0)} />
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border">
        {activeTab === 'clinical' && <ClinicalTable data={clinicalDepts} search={search} />}
        {activeTab === 'support' && <SupportTable data={supportDepts} search={search} />}
        {activeTab === 'diagnostic' && <DiagnosticTable data={diagnosticDepts} search={search} />}
        {activeTab === 'admin' && <AdminTable data={adminDepts} search={search} />}
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
            {infraTab === 'rooms' && <RoomsTable />}
            {infraTab === 'wards' && <WardsTable />}
          </div>
        )}
        {activeTab === 'kitchen' && <KitchenTable />}
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

const ClinicalTable = ({ data, search }: { data: typeof clinicalDepts; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>HOD</th><th>Staff</th><th>Beds</th><th>OPD Days</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          const Icon = d.icon;
          return (
            <tr key={d.name}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Icon size={13} className="text-primary" />{d.name}</div></td>
              <td>{d.hod}</td><td>{d.staff}</td><td>{d.beds}</td><td>{d.opd}</td>
              <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{d.status}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SupportTable = ({ data, search }: { data: typeof supportDepts; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Unit</th><th>Head</th><th>Rooms/Beds</th><th>Availability</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          const Icon = d.icon;
          return (
            <tr key={d.name}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Icon size={13} className="text-primary" />{d.name}</div></td>
              <td>{d.hod}</td><td>{d.rooms}</td><td>{d.availability}</td>
              <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{d.status}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DiagnosticTable = ({ data, search }: { data: typeof diagnosticDepts; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Department</th><th>HOD</th><th>Equipment</th><th>Avg Tests/Day</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          const Icon = d.icon;
          return (
            <tr key={d.name}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Icon size={13} className="text-primary" />{d.name}</div></td>
              <td>{d.hod}</td><td className="text-[10px]">{d.equipment}</td><td>{d.tests}</td>
              <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{d.status}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const AdminTable = ({ data, search }: { data: typeof adminDepts; search: string }) => {
  const filtered = data.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <table className="hms-table">
      <thead><tr>
        <th>#</th><th>Service</th><th>Head</th><th>Staff</th><th>Status</th><th>Actions</th>
      </tr></thead>
      <tbody>
        {filtered.map((d, i) => {
          const Icon = d.icon;
          return (
            <tr key={d.name}>
              <td>{i + 1}</td>
              <td><div className="flex items-center gap-1.5"><Icon size={13} className="text-primary" />{d.name}</div></td>
              <td>{d.head}</td><td>{d.staff}</td>
              <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{d.status}</span></td>
              <td><button className="hms-btn-secondary text-[10px] mr-1">Edit</button><button className="hms-btn-secondary text-[10px]">View</button></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const RoomsTable = () => (
  <table className="hms-table">
    <thead><tr><th>Floor</th><th>Room Type</th><th>Total</th><th>Occupied</th><th>Available</th><th>Occupancy %</th></tr></thead>
    <tbody>
      {infrastructureData.rooms.map((r, i) => (
        <tr key={i}>
          <td>{r.floor}</td><td>{r.type}</td><td>{r.total}</td>
          <td className="text-destructive font-semibold">{r.occupied}</td>
          <td className="font-semibold" style={{ color: 'hsl(var(--hms-success))' }}>{r.available}</td>
          <td>
            <div className="flex items-center gap-1">
              <div className="w-16 h-2 bg-muted rounded-sm overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(r.occupied / r.total) * 100}%` }} />
              </div>
              <span className="text-[10px]">{Math.round((r.occupied / r.total) * 100)}%</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const WardsTable = () => (
  <table className="hms-table">
    <thead><tr><th>#</th><th>Ward Name</th><th>Floor</th><th>Total Beds</th><th>In-Charge</th><th>Status</th></tr></thead>
    <tbody>
      {infrastructureData.wards.map((w, i) => (
        <tr key={i}>
          <td>{i + 1}</td><td>{w.name}</td><td>{w.floor}</td><td>{w.beds}</td><td>{w.nurse}</td>
          <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{w.status}</span></td>
        </tr>
      ))}
    </tbody>
  </table>
);

const KitchenTable = () => (
  <div>
    <div className="hms-section-header text-xs">Kitchen / Dietary Services (Floor-wise)</div>
    <table className="hms-table">
      <thead><tr><th>#</th><th>Floor</th><th>Kitchen Name</th><th>Capacity</th><th>In-Charge</th><th>Timing</th><th>Status</th></tr></thead>
      <tbody>
        {infrastructureData.kitchens.map((k, i) => (
          <tr key={i}>
            <td>{i + 1}</td><td>{k.floor}</td><td>{k.name}</td><td>{k.capacity}</td><td>{k.head}</td><td>{k.timing}</td>
            <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{k.status}</span></td>
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
