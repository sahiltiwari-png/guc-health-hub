import React, { useState } from 'react';
import {
  Pill, ClipboardList, Package, TrendingUp, AlertTriangle, CreditCard,
  Users, FileText, Eye, Printer, Search, BarChart3, ShieldCheck,
  Truck, Activity, Bell, Clock, ChevronDown, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

/* ───────── DUMMY DATA ───────── */

const kpiCards = [
  { label: 'Total Rx Today', value: '187', icon: ClipboardList, change: '+12 vs yesterday', color: 'bg-primary' },
  { label: 'Medicines Dispensed', value: '1,243', icon: Pill, change: '98% fulfilment', color: 'bg-hms-success' },
  { label: 'Low Stock Items', value: '14', icon: AlertTriangle, change: '3 critical', color: 'bg-hms-warning' },
  { label: 'Expiring Soon', value: '23', icon: Clock, change: 'Within 30 days', color: 'bg-destructive' },
  { label: 'Pending Bills', value: '₹45,200', icon: CreditCard, change: '8 patients', color: 'bg-hms-info' },
  { label: 'Revenue Today', value: '₹1,82,500', icon: TrendingUp, change: '+8% vs avg', color: 'bg-primary' },
];

const prescriptionQueue = [
  { id: 'RX-2026-001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', age: '45Y', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', diagnosis: 'Acute Fever', items: 4, time: '09:15 AM', status: 'Pending' },
  { id: 'RX-2026-002', uhid: 'U-1002', patient: 'Mrs. Sunita Devi', age: '32Y', doctor: 'Dr. Priya Singh', dept: 'Gynecology', diagnosis: 'PCOD', items: 6, time: '09:30 AM', status: 'In Progress' },
  { id: 'RX-2026-003', uhid: 'U-1003', patient: 'Mr. Amit Sharma', age: '28Y', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', diagnosis: 'Knee Pain', items: 3, time: '09:45 AM', status: 'Dispensed' },
  { id: 'RX-2026-004', uhid: 'U-1004', patient: 'Baby Riya', age: '2Y', doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', diagnosis: 'Cold & Cough', items: 5, time: '10:00 AM', status: 'Pending' },
  { id: 'RX-2026-005', uhid: 'U-1005', patient: 'Mr. Suresh Yadav', age: '55Y', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', diagnosis: 'Diabetes Type-2', items: 7, time: '10:15 AM', status: 'Pending' },
  { id: 'RX-2026-006', uhid: 'U-1006', patient: 'Mrs. Kamla Devi', age: '60Y', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', diagnosis: 'Arthritis', items: 4, time: '10:30 AM', status: 'In Progress' },
];

const inventoryData = [
  { sno: 1, name: 'Paracetamol 500mg', batch: 'B-2026-A01', category: 'Analgesic', stock: 1200, minStock: 500, unit: 'Tabs', mrp: 2.5, expiry: '15-Dec-2027', supplier: 'Cipla Ltd', status: 'OK' },
  { sno: 2, name: 'Amoxicillin 250mg', batch: 'B-2026-A02', category: 'Antibiotic', stock: 8, minStock: 30, unit: 'Caps', mrp: 12, expiry: '15-Apr-2026', supplier: 'Sun Pharma', status: 'Low' },
  { sno: 3, name: 'Cetrizine 10mg', batch: 'B-2026-A03', category: 'Anti-allergy', stock: 5, minStock: 20, unit: 'Tabs', mrp: 3, expiry: '28-Feb-2026', supplier: 'Dr. Reddy', status: 'Critical' },
  { sno: 4, name: 'Metformin 500mg', batch: 'B-2026-A04', category: 'Anti-diabetic', stock: 850, minStock: 200, unit: 'Tabs', mrp: 5, expiry: '30-Jun-2027', supplier: 'USV Pvt Ltd', status: 'OK' },
  { sno: 5, name: 'Atorvastatin 10mg', batch: 'B-2026-A05', category: 'Lipid Lowering', stock: 15, minStock: 50, unit: 'Tabs', mrp: 8, expiry: '15-Mar-2026', supplier: 'Ranbaxy', status: 'Low' },
  { sno: 6, name: 'Omeprazole 20mg', batch: 'B-2026-A06', category: 'Antacid', stock: 600, minStock: 100, unit: 'Caps', mrp: 6, expiry: '20-Sep-2027', supplier: 'Cipla Ltd', status: 'OK' },
  { sno: 7, name: 'Azithromycin 500mg', batch: 'B-2026-A07', category: 'Antibiotic', stock: 45, minStock: 40, unit: 'Tabs', mrp: 65, expiry: '10-Aug-2026', supplier: 'Alkem Labs', status: 'OK' },
  { sno: 8, name: 'Insulin Glargine', batch: 'B-2026-A08', category: 'Anti-diabetic', stock: 3, minStock: 10, unit: 'Vials', mrp: 850, expiry: '05-Mar-2026', supplier: 'Novo Nordisk', status: 'Critical' },
];

const dispensingLog = [
  { id: 'D-001', rxId: 'RX-2026-003', patient: 'Mr. Amit Sharma', uhid: 'U-1003', medicine: 'Diclofenac 50mg x 10', pharmacist: 'Ankit Gupta', time: '09:50 AM', payStatus: 'Paid', amount: '₹120' },
  { id: 'D-002', rxId: 'RX-2026-001', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', medicine: 'Paracetamol 500mg x 20', pharmacist: 'Ankit Gupta', time: '09:25 AM', payStatus: 'Paid', amount: '₹50' },
  { id: 'D-003', rxId: 'RX-2026-002', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', medicine: 'Metformin 500mg x 30', pharmacist: 'Renu Singh', time: '09:40 AM', payStatus: 'Pending', amount: '₹150' },
  { id: 'D-004', rxId: 'RX-2026-006', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', medicine: 'Calcium + Vit D3 x 30', pharmacist: 'Renu Singh', time: '10:35 AM', payStatus: 'Insurance', amount: '₹280' },
];

const billingData = [
  { billNo: 'PH-B-001', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', items: 4, gross: 450, discount: 0, net: 450, mode: 'Cash', insurance: '-', status: 'Paid' },
  { billNo: 'PH-B-002', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', items: 6, gross: 1200, discount: 120, net: 1080, mode: 'Card', insurance: 'Star Health', status: 'Partial' },
  { billNo: 'PH-B-003', patient: 'Mr. Amit Sharma', uhid: 'U-1003', items: 3, gross: 300, discount: 0, net: 300, mode: 'UPI', insurance: '-', status: 'Paid' },
  { billNo: 'PH-B-004', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', items: 4, gross: 950, discount: 50, net: 900, mode: 'Insurance', insurance: 'ICICI Lombard', status: 'Pending' },
];

const doctorPrescriptions = [
  { doctor: 'Dr. Alok Mehta', dept: 'General Medicine', totalRx: 52, topDrug: 'Paracetamol 500mg', generic: '72%', branded: '28%', avgItems: 4.2 },
  { doctor: 'Dr. Priya Singh', dept: 'Gynecology', totalRx: 38, topDrug: 'Folic Acid 5mg', generic: '65%', branded: '35%', avgItems: 5.1 },
  { doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', totalRx: 41, topDrug: 'Diclofenac 50mg', generic: '58%', branded: '42%', avgItems: 3.8 },
  { doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', totalRx: 29, topDrug: 'Amoxicillin Syrup', generic: '80%', branded: '20%', avgItems: 3.5 },
  { doctor: 'Dr. Sanjay Kapoor', dept: 'Cardiology', totalRx: 34, topDrug: 'Atorvastatin 10mg', generic: '55%', branded: '45%', avgItems: 5.8 },
];

const expiryAlerts = [
  { name: 'Cetrizine 10mg', batch: 'B-2026-A03', expiry: '28-Feb-2026', stock: 5, daysLeft: 7, action: 'Return/Destroy' },
  { name: 'Insulin Glargine', batch: 'B-2026-A08', expiry: '05-Mar-2026', stock: 3, daysLeft: 12, action: 'Use Priority' },
  { name: 'Atorvastatin 10mg', batch: 'B-2026-A05', expiry: '15-Mar-2026', stock: 15, daysLeft: 22, action: 'Use Priority' },
  { name: 'Amoxicillin 250mg', batch: 'B-2026-A02', expiry: '15-Apr-2026', stock: 8, daysLeft: 53, action: 'Monitor' },
  { name: 'Clopidogrel 75mg', batch: 'B-2026-C11', expiry: '20-Apr-2026', stock: 22, daysLeft: 58, action: 'Monitor' },
];

const vendorData = [
  { vendor: 'Cipla Ltd', contact: '9876543210', orders: 12, pending: 2, lastOrder: '18-Feb-2026', amount: '₹45,000', rating: '4.5/5' },
  { vendor: 'Sun Pharma', contact: '9876543211', orders: 8, pending: 1, lastOrder: '15-Feb-2026', amount: '₹32,000', rating: '4.2/5' },
  { vendor: 'Dr. Reddy', contact: '9876543212', orders: 6, pending: 0, lastOrder: '12-Feb-2026', amount: '₹28,500', rating: '4.0/5' },
  { vendor: 'Novo Nordisk', contact: '9876543213', orders: 3, pending: 1, lastOrder: '10-Feb-2026', amount: '₹1,25,000', rating: '4.8/5' },
];

const auditLogs = [
  { time: '10:35 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-006 - Calcium + Vit D3 x 30 to Mrs. Kamla Devi', module: 'Dispensing' },
  { time: '10:20 AM', user: 'Admin', action: 'Stock Update', detail: 'Added 500 units of Paracetamol 500mg (Batch B-2026-A01)', module: 'Inventory' },
  { time: '10:05 AM', user: 'Renu Singh', action: 'Dispensed', detail: 'RX-2026-002 - Metformin 500mg x 30 to Mrs. Sunita Devi', module: 'Dispensing' },
  { time: '09:50 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-003 - Diclofenac 50mg x 10 to Mr. Amit Sharma', module: 'Dispensing' },
  { time: '09:30 AM', user: 'Admin', action: 'Price Update', detail: 'Amoxicillin 250mg MRP changed ₹10 → ₹12', module: 'Inventory' },
  { time: '09:15 AM', user: 'System', action: 'Alert', detail: 'Low stock alert triggered for Insulin Glargine (3 units)', module: 'Alerts' },
];

/* Charts Data */
const doctorWiseChart = [
  { name: 'Dr. Alok', rx: 52 }, { name: 'Dr. Priya', rx: 38 }, { name: 'Dr. Rahul', rx: 41 },
  { name: 'Dr. Neha', rx: 29 }, { name: 'Dr. Sanjay', rx: 34 },
];

const stockUsageChart = [
  { name: 'Mon', dispensed: 180, received: 50 }, { name: 'Tue', dispensed: 210, received: 0 },
  { name: 'Wed', dispensed: 195, received: 120 }, { name: 'Thu', dispensed: 230, received: 0 },
  { name: 'Fri', dispensed: 250, received: 80 }, { name: 'Sat', dispensed: 160, received: 200 },
  { name: 'Sun', dispensed: 90, received: 0 },
];

const categoryPieData = [
  { name: 'Analgesic', value: 28 }, { name: 'Antibiotic', value: 22 },
  { name: 'Anti-diabetic', value: 18 }, { name: 'Cardiac', value: 15 },
  { name: 'Anti-allergy', value: 10 }, { name: 'Others', value: 7 },
];

const PIE_COLORS = ['hsl(0,100%,50%)', 'hsl(0,100%,40%)', 'hsl(30,90%,50%)', 'hsl(200,80%,50%)', 'hsl(120,40%,45%)', 'hsl(0,0%,55%)'];

const salesTrendChart = [
  { name: 'Week 1', sales: 125000, returns: 3200 }, { name: 'Week 2', sales: 142000, returns: 4100 },
  { name: 'Week 3', sales: 138000, returns: 2800 }, { name: 'Week 4', sales: 155000, returns: 3500 },
];

const tabs = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'dispensing', label: 'Dispensing', icon: Pill },
  { key: 'billing', label: 'Billing & Insurance', icon: CreditCard },
  { key: 'doctor-analytics', label: 'Doctor Analytics', icon: Activity },
  { key: 'expiry', label: 'Expiry & Compliance', icon: ShieldCheck },
  { key: 'vendors', label: 'Vendors', icon: Truck },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'audit', label: 'Audit Logs', icon: FileText },
];

/* ───────── STATUS BADGE ───────── */
const StatusBadge = ({ status }: { status: string }) => {
  const cls =
    status === 'Dispensed' || status === 'Paid' || status === 'OK'
      ? 'bg-hms-success text-hms-success-foreground'
      : status === 'Pending' || status === 'Low' || status === 'Partial'
        ? 'bg-hms-warning text-foreground'
        : status === 'In Progress'
          ? 'bg-hms-info text-hms-success-foreground'
          : status === 'Critical' || status === 'Insurance'
            ? 'bg-destructive text-destructive-foreground'
            : 'bg-muted text-foreground';
  return <span className={`px-2 py-0.5 text-[10px] font-bold ${cls}`}>{status}</span>;
};

/* ───────── TAB PANELS ───────── */

const OverviewPanel = () => (
  <div className="space-y-3">
    {/* Charts Row */}
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Doctor-wise Prescriptions (This Month)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={doctorWiseChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="rx" fill="hsl(0,100%,50%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Stock Movement (This Week)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stockUsageChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="dispensed" stroke="hsl(0,100%,50%)" strokeWidth={2} />
            <Line type="monotone" dataKey="received" stroke="hsl(120,40%,45%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Dispensing by Category</h4>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 9 }}>
              {categoryPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Live Prescription Queue */}
    <div>
      <div className="hms-section-header">Live Prescription Queue</div>
      <table className="hms-table">
        <thead>
          <tr><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Dept</th><th>Diagnosis</th><th>Items</th><th>Time</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {prescriptionQueue.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.uhid}</td><td>{p.patient}</td><td>{p.age}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.diagnosis}</td><td>{p.items}</td><td>{p.time}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Low Stock + Expiry Summary */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="hms-section-header">Low Stock Items</div>
        <table className="hms-table">
          <thead><tr><th>Medicine</th><th>Stock</th><th>Min Stock</th><th>Supplier</th><th>Status</th></tr></thead>
          <tbody>
            {inventoryData.filter(i => i.status !== 'OK').map((i, idx) => (
              <tr key={idx}><td>{i.name}</td><td className="text-destructive font-bold">{i.stock}</td><td>{i.minStock}</td><td>{i.supplier}</td><td><StatusBadge status={i.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="hms-section-header">Expiry Alerts (Next 60 Days)</div>
        <table className="hms-table">
          <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Days Left</th><th>Action</th></tr></thead>
          <tbody>
            {expiryAlerts.slice(0, 4).map((e, idx) => (
              <tr key={idx} className={e.daysLeft <= 14 ? 'text-destructive font-semibold' : ''}><td>{e.name}</td><td>{e.batch}</td><td>{e.expiry}</td><td>{e.daysLeft}</td><td>{e.action}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PrescriptionsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Rx ID / Patient..." />
      <select className="hms-select"><option>All Doctors</option>{doctorPrescriptions.map(d => <option key={d.doctor}>{d.doctor}</option>)}</select>
      <select className="hms-select"><option>All Status</option><option>Pending</option><option>In Progress</option><option>Dispensed</option></select>
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Prescription Management</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Department</th><th>Diagnosis</th><th>Items</th><th>Date/Time</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {prescriptionQueue.map((p, i) => (
          <tr key={p.id}><td>{i + 1}</td><td>{p.id}</td><td>{p.uhid}</td><td>{p.patient}</td><td>{p.age}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.diagnosis}</td><td>{p.items}</td><td>21-Feb-2026 {p.time}</td>
            <td><StatusBadge status={p.status} /></td>
            <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InventoryPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Medicine..." />
      <select className="hms-select"><option>All Categories</option><option>Analgesic</option><option>Antibiotic</option><option>Anti-diabetic</option><option>Cardiac</option></select>
      <select className="hms-select"><option>All Status</option><option>OK</option><option>Low</option><option>Critical</option></select>
      <button className="hms-btn-primary">Search</button>
      <button className="hms-btn-success">+ Add Medicine</button>
    </div>
    <div className="hms-section-header">Medicine Inventory</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Medicine Name</th><th>Batch No</th><th>Category</th><th>Stock</th><th>Min Stock</th><th>Unit</th><th>MRP (₹)</th><th>Expiry</th><th>Supplier</th><th>Status</th></tr></thead>
      <tbody>
        {inventoryData.map(i => (
          <tr key={i.sno} className={i.status === 'Critical' ? 'text-destructive font-semibold' : ''}>
            <td>{i.sno}</td><td>{i.name}</td><td>{i.batch}</td><td>{i.category}</td>
            <td className={i.stock < i.minStock ? 'text-destructive font-bold' : ''}>{i.stock}</td>
            <td>{i.minStock}</td><td>{i.unit}</td><td>{i.mrp}</td><td>{i.expiry}</td><td>{i.supplier}</td>
            <td><StatusBadge status={i.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DispensingPanel = () => (
  <div>
    <div className="hms-section-header">Dispensing Tracking</div>
    <table className="hms-table">
      <thead><tr><th>ID</th><th>Rx ID</th><th>Patient</th><th>UHID</th><th>Medicine & Qty</th><th>Pharmacist</th><th>Time</th><th>Amount</th><th>Payment</th></tr></thead>
      <tbody>
        {dispensingLog.map(d => (
          <tr key={d.id}><td>{d.id}</td><td>{d.rxId}</td><td>{d.patient}</td><td>{d.uhid}</td><td>{d.medicine}</td><td>{d.pharmacist}</td><td>{d.time}</td><td>{d.amount}</td>
            <td><StatusBadge status={d.payStatus} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BillingPanel = () => (
  <div>
    <div className="hms-section-header">Pharmacy Billing & Insurance</div>
    <table className="hms-table">
      <thead><tr><th>Bill No</th><th>Patient</th><th>UHID</th><th>Items</th><th>Gross (₹)</th><th>Discount (₹)</th><th>Net (₹)</th><th>Mode</th><th>Insurance</th><th>Status</th></tr></thead>
      <tbody>
        {billingData.map(b => (
          <tr key={b.billNo}><td>{b.billNo}</td><td>{b.patient}</td><td>{b.uhid}</td><td>{b.items}</td><td>{b.gross}</td><td>{b.discount}</td><td>{b.net}</td><td>{b.mode}</td><td>{b.insurance}</td>
            <td><StatusBadge status={b.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DoctorAnalyticsPanel = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Prescriptions by Doctor</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={doctorWiseChart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="rx" fill="hsl(0,100%,50%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Generic vs Branded Usage</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={[{ name: 'Generic', value: 66 }, { name: 'Branded', value: 34 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label style={{ fontSize: 10 }}>
              <Cell fill="hsl(120,40%,45%)" />
              <Cell fill="hsl(0,100%,50%)" />
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="hms-section-header">Doctor-wise Prescription Details</div>
    <table className="hms-table">
      <thead><tr><th>Doctor</th><th>Department</th><th>Total Rx</th><th>Top Drug</th><th>Generic %</th><th>Branded %</th><th>Avg Items/Rx</th></tr></thead>
      <tbody>
        {doctorPrescriptions.map(d => (
          <tr key={d.doctor}><td>{d.doctor}</td><td>{d.dept}</td><td>{d.totalRx}</td><td>{d.topDrug}</td><td>{d.generic}</td><td>{d.branded}</td><td>{d.avgItems}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExpiryPanel = () => (
  <div>
    <div className="hms-section-header">Expiry & Compliance Monitoring</div>
    <table className="hms-table">
      <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry Date</th><th>Stock</th><th>Days Left</th><th>Recommended Action</th></tr></thead>
      <tbody>
        {expiryAlerts.map((e, i) => (
          <tr key={i} className={e.daysLeft <= 14 ? 'text-destructive font-bold' : e.daysLeft <= 30 ? 'text-foreground font-semibold' : ''}>
            <td>{e.name}</td><td>{e.batch}</td><td>{e.expiry}</td><td>{e.stock}</td><td>{e.daysLeft}</td><td>{e.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-3">
      <div className="hms-section-header">Compliance Logs</div>
      <div className="bg-card border border-border p-2 space-y-1 text-xs">
        <p>✅ Schedule H drug register updated — 20-Feb-2026</p>
        <p>✅ Narcotic drug register verified — 18-Feb-2026</p>
        <p>⚠️ Drug license renewal due — 15-Mar-2026</p>
        <p>✅ Temperature log (2-8°C Cold Storage) — Normal — 21-Feb-2026</p>
      </div>
    </div>
  </div>
);

const VendorsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <button className="hms-btn-success">+ New Purchase Order</button>
      <button className="hms-btn-primary">GRN Entry</button>
    </div>
    <div className="hms-section-header">Vendor / Supplier Management</div>
    <table className="hms-table">
      <thead><tr><th>Vendor</th><th>Contact</th><th>Total Orders</th><th>Pending</th><th>Last Order</th><th>Amount</th><th>Rating</th></tr></thead>
      <tbody>
        {vendorData.map(v => (
          <tr key={v.vendor}><td>{v.vendor}</td><td>{v.contact}</td><td>{v.orders}</td><td>{v.pending}</td><td>{v.lastOrder}</td><td>{v.amount}</td><td>{v.rating}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReportsPanel = () => (
  <div className="space-y-3">
    <div className="bg-card border border-border p-2">
      <h4 className="text-xs font-bold mb-1">Weekly Sales Trend</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={salesTrendChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="sales" fill="hsl(0,100%,50%)" name="Sales (₹)" />
          <Bar dataKey="returns" fill="hsl(0,0%,60%)" name="Returns (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="hms-section-header">Quick Reports</div>
    <div className="grid grid-cols-3 gap-2">
      {['Daily Sales Report', 'Weekly Summary', 'Monthly Revenue', 'Stock Consumption', 'Fast Moving Items', 'Slow Moving Items',
        'Profit Margin Report', 'Expiry Loss Report', 'Doctor-wise Sales'].map((r, i) => (
        <div key={i} className="bg-card border border-border p-2 hover:bg-muted cursor-pointer flex items-center gap-2">
          <Download size={12} className="text-primary" />
          <span className="text-xs font-semibold">{r}</span>
        </div>
      ))}
    </div>
  </div>
);

const AlertsPanel = () => (
  <div>
    <div className="hms-section-header">Alerts & Notifications</div>
    <div className="bg-card border border-border p-2 space-y-1.5">
      <p className="text-xs">🔴 <strong>CRITICAL:</strong> Insulin Glargine stock at 3 units (Min: 10) — Reorder immediately</p>
      <p className="text-xs">🔴 <strong>CRITICAL:</strong> Cetrizine 10mg expires in 7 days — 5 units remaining</p>
      <p className="text-xs">🟡 <strong>LOW STOCK:</strong> Amoxicillin 250mg — 8 units (Min: 30)</p>
      <p className="text-xs">🟡 <strong>LOW STOCK:</strong> Atorvastatin 10mg — 15 units (Min: 50)</p>
      <p className="text-xs">🟡 <strong>EXPIRY:</strong> Insulin Glargine expires in 12 days</p>
      <p className="text-xs">🔵 <strong>PAYMENT:</strong> 8 pending pharmacy bills totaling ₹45,200</p>
      <p className="text-xs">🔵 <strong>INSURANCE:</strong> 2 claims pending approval (Star Health, ICICI Lombard)</p>
      <p className="text-xs">⚠️ <strong>HIGH-RISK:</strong> Schedule H drug dispensing requires double verification</p>
      <p className="text-xs">✅ Drug license valid till 15-Mar-2026 — Renewal reminder sent</p>
    </div>
  </div>
);

const AuditPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-40" placeholder="Search logs..." />
      <select className="hms-select"><option>All Modules</option><option>Dispensing</option><option>Inventory</option><option>Alerts</option></select>
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary">Filter</button>
    </div>
    <div className="hms-section-header">Audit Logs</div>
    <table className="hms-table">
      <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th><th>Module</th></tr></thead>
      <tbody>
        {auditLogs.map((a, i) => (
          <tr key={i}><td>{a.time}</td><td>{a.user}</td><td>{a.action}</td><td className="max-w-xs truncate">{a.detail}</td><td>{a.module}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ───────── MAIN COMPONENT ───────── */

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const panelMap: Record<string, React.ReactNode> = {
    overview: <OverviewPanel />,
    prescriptions: <PrescriptionsPanel />,
    inventory: <InventoryPanel />,
    dispensing: <DispensingPanel />,
    billing: <BillingPanel />,
    'doctor-analytics': <DoctorAnalyticsPanel />,
    expiry: <ExpiryPanel />,
    vendors: <VendorsPanel />,
    reports: <ReportsPanel />,
    alerts: <AlertsPanel />,
    audit: <AuditPanel />,
  };

  return (
    <div>
      {/* Header */}
      <div className="hms-section-header flex items-center justify-between">
        <span className="flex items-center gap-2"><Pill size={16} /> Pharmacy Dashboard — GUC HMS</span>
        <span className="text-[10px] font-normal">21-Feb-2026 | Pharmacist: Ankit Gupta</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-2 my-2">
        {kpiCards.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{k.label}</p>
                  <p className="text-base font-bold text-foreground">{k.value}</p>
                  <p className="text-[9px] text-muted-foreground">{k.change}</p>
                </div>
                <Icon size={22} className="text-primary opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-0 border-b border-border bg-card overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-colors
                ${activeTab === t.key
                  ? 'border-primary text-primary bg-card'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {panelMap[activeTab]}
      </div>
    </div>
  );
};

export default Pharmacy;
