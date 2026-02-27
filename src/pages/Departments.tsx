import React, { useState } from 'react';
import {
  Stethoscope, Scissors, Bone, Heart, Brain, Activity, CircleDot,
  Baby, Microscope, Eye, Ear, SmilePlus, Pill, Shield, Bed,
  UtensilsCrossed, Wrench, FileText, CreditCard, SprayCan, Thermometer,
  Syringe, Zap, MonitorCheck, Droplets, Building2, DoorOpen, Users,
  ChefHat, Truck, AlertTriangle, Clock, CheckCircle2, XCircle, Search
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
  canteen: [
    { name: 'Staff Canteen', floor: 'Ground', capacity: 80, timing: '7AM-10PM', head: 'Mr. Harish' },
    { name: 'Visitor Canteen', floor: 'Ground', capacity: 120, timing: '8AM-9PM', head: 'Mr. Bharat' },
    { name: 'Doctor\'s Lounge Cafe', floor: '2nd', capacity: 30, timing: '24/7', head: 'Mr. Yash' },
  ],
};

const tabs = [
  { id: 'clinical', label: 'Clinical Departments' },
  { id: 'support', label: 'Critical Care & Support' },
  { id: 'diagnostic', label: 'Diagnostics & Labs' },
  { id: 'admin', label: 'Admin & Services' },
  { id: 'infrastructure', label: 'Rooms / Wards / Beds' },
  { id: 'kitchen', label: 'Kitchen & Canteen' },
];

const Departments = () => {
  const [activeTab, setActiveTab] = useState('clinical');
  const [search, setSearch] = useState('');
  const [infraTab, setInfraTab] = useState<'rooms' | 'wards' | 'canteen'>('rooms');

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
            placeholder="Search departments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="hms-btn-primary">+ Add Department</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-card border-b border-border overflow-x-auto mt-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-muted'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-2 my-2">
        <SummaryCard label="Clinical Depts" value={clinicalDepts.length} color="bg-primary" />
        <SummaryCard label="Support Units" value={supportDepts.length} color="bg-hms-sidebar" />
        <SummaryCard label="Diagnostic Labs" value={diagnosticDepts.length} color="bg-hms-info" />
        <SummaryCard label="Admin Services" value={adminDepts.length} color="bg-hms-success" />
        <SummaryCard label="Total Beds" value={infrastructureData.rooms.reduce((a, r) => a + r.total, 0)} color="bg-hms-warning" />
        <SummaryCard label="Available Beds" value={infrastructureData.rooms.reduce((a, r) => a + r.available, 0)} color="bg-hms-success" />
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
              {(['rooms', 'wards', 'canteen'] as const).map(t => (
                <button key={t} onClick={() => setInfraTab(t)}
                  className={`px-3 py-1.5 text-xs font-semibold capitalize ${infraTab === t ? 'bg-muted text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}>
                  {t}
                </button>
              ))}
            </div>
            {infraTab === 'rooms' && <RoomsTable />}
            {infraTab === 'wards' && <WardsTable />}
            {infraTab === 'canteen' && <CanteenTable />}
          </div>
        )}
        {activeTab === 'kitchen' && <KitchenTable />}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-card border border-border p-2 text-center">
    <div className={`text-lg font-bold text-foreground`}>{value}</div>
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

const CanteenTable = () => (
  <table className="hms-table">
    <thead><tr><th>#</th><th>Name</th><th>Floor</th><th>Capacity</th><th>Timing</th><th>In-Charge</th></tr></thead>
    <tbody>
      {infrastructureData.canteen.map((c, i) => (
        <tr key={i}>
          <td>{i + 1}</td><td>{c.name}</td><td>{c.floor}</td><td>{c.capacity} seats</td><td>{c.timing}</td><td>{c.head}</td>
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

export default Departments;
