import React, { useState } from 'react';
import { Package, Eye, Edit, Trash2, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, BarChart3, Printer } from 'lucide-react';

const tabs = ['Dashboard','Asset Register','Categories','Maintenance','Depreciation','Disposal','Vendors','Audit Trail'];

const assets = [
  { id: 'AST-001', name: 'Ventilator V500', category: 'Medical Equipment', location: 'ICU-1', purchaseDate: '2023-01-15', cost: '₹12,50,000', depreciation: '₹2,08,333', bookValue: '₹10,41,667', status: 'Active', condition: 'Good', warranty: '2026-01-15' },
  { id: 'AST-002', name: 'X-Ray Machine DR', category: 'Radiology', location: 'Radiology Dept', purchaseDate: '2022-06-20', cost: '₹45,00,000', depreciation: '₹11,25,000', bookValue: '₹33,75,000', status: 'Active', condition: 'Good', warranty: '2025-06-20' },
  { id: 'AST-003', name: 'CT Scanner 128-Slice', category: 'Radiology', location: 'CT Room', purchaseDate: '2021-03-10', cost: '₹2,50,00,000', depreciation: '₹75,00,000', bookValue: '₹1,75,00,000', status: 'Active', condition: 'Excellent', warranty: '2026-03-10' },
  { id: 'AST-004', name: 'ECG Machine 12-Lead', category: 'Cardiology', location: 'Cardiology OPD', purchaseDate: '2023-08-01', cost: '₹3,50,000', depreciation: '₹43,750', bookValue: '₹3,06,250', status: 'Active', condition: 'Good', warranty: '2025-08-01' },
  { id: 'AST-005', name: 'Autoclave 100L', category: 'CSSD', location: 'CSSD', purchaseDate: '2020-11-05', cost: '₹8,00,000', depreciation: '₹3,20,000', bookValue: '₹4,80,000', status: 'Under Maintenance', condition: 'Fair', warranty: 'Expired' },
  { id: 'AST-006', name: 'Patient Monitor MP60', category: 'Medical Equipment', location: 'ICU-2', purchaseDate: '2022-02-14', cost: '₹4,50,000', depreciation: '₹1,50,000', bookValue: '₹3,00,000', status: 'Active', condition: 'Good', warranty: '2025-02-14' },
  { id: 'AST-007', name: 'Defibrillator HeartStart', category: 'Emergency', location: 'Emergency Dept', purchaseDate: '2023-05-22', cost: '₹6,00,000', depreciation: '₹75,000', bookValue: '₹5,25,000', status: 'Active', condition: 'Excellent', warranty: '2026-05-22' },
  { id: 'AST-008', name: 'Ultrasound GE Logiq', category: 'Radiology', location: 'USG Room', purchaseDate: '2021-09-18', cost: '₹28,00,000', depreciation: '₹9,33,333', bookValue: '₹18,66,667', status: 'Active', condition: 'Good', warranty: '2024-09-18' },
];

const maintenance = [
  { id: 'MNT-001', asset: 'Ventilator V500', type: 'Preventive', scheduled: '2024-03-15', completed: '2024-03-15', cost: '₹15,000', technician: 'BioMed Solutions', next: '2024-06-15', status: 'Completed' },
  { id: 'MNT-002', asset: 'Autoclave 100L', type: 'Corrective', scheduled: '2024-03-10', completed: '-', cost: '₹45,000 (Est)', technician: 'MedTech Services', next: '-', status: 'In Progress' },
  { id: 'MNT-003', asset: 'X-Ray Machine DR', type: 'Preventive', scheduled: '2024-04-01', completed: '-', cost: '₹25,000 (Est)', technician: 'Philips Service', next: '2024-07-01', status: 'Scheduled' },
  { id: 'MNT-004', asset: 'CT Scanner 128-Slice', type: 'AMC Service', scheduled: '2024-03-20', completed: '2024-03-20', cost: 'Under AMC', technician: 'Siemens Healthineers', next: '2024-06-20', status: 'Completed' },
  { id: 'MNT-005', asset: 'ECG Machine 12-Lead', type: 'Calibration', scheduled: '2024-04-05', completed: '-', cost: '₹5,000', technician: 'BPL Medical', next: '2024-10-05', status: 'Scheduled' },
];

const categories = [
  { name: 'Medical Equipment', count: 245, value: '₹8.5 Cr', depreciated: '₹2.1 Cr' },
  { name: 'Radiology Equipment', count: 18, value: '₹12.3 Cr', depreciated: '₹3.8 Cr' },
  { name: 'Laboratory Instruments', count: 120, value: '₹3.2 Cr', depreciated: '₹1.1 Cr' },
  { name: 'Surgical Instruments', count: 850, value: '₹1.8 Cr', depreciated: '₹0.9 Cr' },
  { name: 'IT Equipment', count: 180, value: '₹1.5 Cr', depreciated: '₹0.8 Cr' },
  { name: 'Furniture & Fixtures', count: 520, value: '₹2.1 Cr', depreciated: '₹1.2 Cr' },
  { name: 'Vehicles (Ambulance)', count: 8, value: '₹1.6 Cr', depreciated: '₹0.6 Cr' },
  { name: 'HVAC & Electrical', count: 45, value: '₹3.8 Cr', depreciated: '₹1.5 Cr' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { 'Active': 'bg-green-700 text-white', 'Under Maintenance': 'bg-yellow-600 text-white', 'Disposed': 'bg-red-700 text-white', 'Completed': 'bg-green-700 text-white', 'In Progress': 'bg-blue-700 text-white', 'Scheduled': 'bg-yellow-600 text-white', 'Good': 'bg-green-700 text-white', 'Excellent': 'bg-green-800 text-white', 'Fair': 'bg-yellow-600 text-white', 'Expired': 'bg-red-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${colors[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const Assets = () => {
  const [tab, setTab] = useState('Dashboard');
  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Package size={14} /> Assets Management System</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>
        ))}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[
              { label: 'Total Assets', value: '1,986', icon: Package, sub: '₹34.8 Cr Total Value' },
              { label: 'Active', value: '1,812', icon: CheckCircle, sub: '91.2% Operational' },
              { label: 'Under Maintenance', value: '45', icon: Wrench, sub: '₹8.5L Pending Cost' },
              { label: 'Warranty Expiring', value: '23', icon: AlertTriangle, sub: 'Next 90 Days' },
              { label: 'Total Depreciation', value: '₹12.0 Cr', icon: TrendingUp, sub: '34.5% of Value' },
              { label: 'AMC Active', value: '156', icon: DollarSign, sub: '₹2.3 Cr/Year' },
            ].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><k.icon size={10} />{k.label}</div>
                <div className="text-sm font-bold">{k.value}</div>
                <div className="text-[9px] text-muted-foreground">{k.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Category-wise Asset Distribution</div>
              <table className="hms-table"><thead><tr><th>Category</th><th>Count</th><th>Value</th><th>Depreciated</th></tr></thead>
                <tbody>{categories.map((c, i) => <tr key={i}><td>{c.name}</td><td>{c.count}</td><td>{c.value}</td><td>{c.depreciated}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Upcoming Maintenance</div>
              <table className="hms-table"><thead><tr><th>Asset</th><th>Type</th><th>Date</th><th>Vendor</th><th>Status</th></tr></thead>
                <tbody>{maintenance.filter(m => m.status !== 'Completed').map((m, i) => <tr key={i}><td>{m.asset}</td><td>{m.type}</td><td>{m.scheduled}</td><td>{m.technician}</td><td><StatusBadge status={m.status} /></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Asset Register' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Asset ID/Name..." />
            <select className="hms-select"><option>All Categories</option>{categories.map(c => <option key={c.name}>{c.name}</option>)}</select>
            <select className="hms-select"><option>All Status</option><option>Active</option><option>Under Maintenance</option><option>Disposed</option></select>
            <select className="hms-select"><option>All Locations</option><option>ICU</option><option>OT</option><option>Radiology</option><option>Lab</option></select>
            <button className="hms-btn-primary ml-auto">+ Add Asset</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Export</button>
          </div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Location</th><th>Purchase</th><th>Cost</th><th>Depreciation</th><th>Book Value</th><th>Condition</th><th>Warranty</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{assets.map(a => <tr key={a.id}><td className="font-mono text-[10px]">{a.id}</td><td>{a.name}</td><td>{a.category}</td><td>{a.location}</td><td>{a.purchaseDate}</td><td>{a.cost}</td><td>{a.depreciation}</td><td>{a.bookValue}</td><td><StatusBadge status={a.condition} /></td><td><StatusBadge status={a.warranty === 'Expired' ? 'Expired' : a.warranty} /></td><td><StatusBadge status={a.status} /></td><td className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Edit size={12} className="text-primary cursor-pointer" /><Wrench size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Categories' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Category</button></div>
          <table className="hms-table"><thead><tr><th>S.No</th><th>Category Name</th><th>Total Assets</th><th>Total Value</th><th>Depreciated Value</th><th>Net Book Value</th><th>Depreciation Method</th><th>Rate(%)</th><th>Action</th></tr></thead>
            <tbody>{categories.map((c, i) => <tr key={i}><td>{i + 1}</td><td>{c.name}</td><td>{c.count}</td><td>{c.value}</td><td>{c.depreciated}</td><td>-</td><td>SLM</td><td>15%</td><td><Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Maintenance' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>All Types</option><option>Preventive</option><option>Corrective</option><option>AMC Service</option><option>Calibration</option></select>
            <select className="hms-select"><option>All Status</option><option>Scheduled</option><option>In Progress</option><option>Completed</option></select>
            <button className="hms-btn-primary ml-auto">+ Schedule Maintenance</button>
          </div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Asset</th><th>Type</th><th>Scheduled</th><th>Completed</th><th>Cost</th><th>Technician/Vendor</th><th>Next Due</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{maintenance.map(m => <tr key={m.id}><td className="font-mono text-[10px]">{m.id}</td><td>{m.asset}</td><td>{m.type}</td><td>{m.scheduled}</td><td>{m.completed}</td><td>{m.cost}</td><td>{m.technician}</td><td>{m.next}</td><td><StatusBadge status={m.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Depreciation' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[{ l: 'Total Purchase Value', v: '₹34.8 Cr' }, { l: 'Accumulated Depreciation', v: '₹12.0 Cr' }, { l: 'Net Book Value', v: '₹22.8 Cr' }, { l: 'This Year Depreciation', v: '₹3.2 Cr' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2"><div className="text-[10px] text-muted-foreground">{k.l}</div><div className="text-sm font-bold">{k.v}</div></div>
            ))}
          </div>
          <table className="hms-table"><thead><tr><th>Category</th><th>Method</th><th>Rate</th><th>Original Value</th><th>FY 2021-22</th><th>FY 2022-23</th><th>FY 2023-24</th><th>Accumulated</th><th>WDV</th></tr></thead>
            <tbody>
              {[['Medical Equipment','SLM','15%','₹8.5 Cr','₹1.27 Cr','₹1.27 Cr','₹1.27 Cr','₹3.82 Cr','₹4.68 Cr'],['Radiology','SLM','10%','₹12.3 Cr','₹1.23 Cr','₹1.23 Cr','₹1.23 Cr','₹3.69 Cr','₹8.61 Cr'],['IT Equipment','WDV','25%','₹1.5 Cr','₹37.5L','₹28.1L','₹21.1L','₹86.7L','₹63.3L']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Disposal' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Record Disposal</button></div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Asset</th><th>Category</th><th>Disposal Date</th><th>Reason</th><th>Book Value</th><th>Sale Value</th><th>Gain/Loss</th><th>Approved By</th><th>Action</th></tr></thead>
            <tbody>
              {[['DSP-001','Old X-Ray Machine','Radiology','2024-01-15','Obsolete','₹1,20,000','₹80,000','(₹40,000)','Dr. Admin'],['DSP-002','Bed Set (10 units)','Furniture','2024-02-20','Damaged','₹50,000','₹15,000','(₹35,000)','Mr. Kumar'],['DSP-003','Desktop PC (5 units)','IT Equipment','2024-03-01','Upgraded','₹25,000','₹10,000','(₹15,000)','IT Head']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Vendors' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Vendor</button></div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Vendor Name</th><th>Type</th><th>Contact</th><th>Phone</th><th>Email</th><th>Assets Supplied</th><th>AMC Active</th><th>Rating</th><th>Action</th></tr></thead>
            <tbody>
              {[['V-001','Philips Healthcare','OEM','Mr. Sharma','9876543210','sharma@philips.com','12','3','⭐⭐⭐⭐⭐'],['V-002','Siemens Healthineers','OEM','Ms. Gupta','8765432109','gupta@siemens.com','8','2','⭐⭐⭐⭐'],['V-003','BioMed Solutions','Service','Mr. Singh','7654321098','singh@biomed.com','0','15','⭐⭐⭐⭐'],['V-004','MedTech Services','Service','Mr. Patel','6543210987','patel@medtech.com','0','8','⭐⭐⭐']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Audit Trail' && (
        <div>
          <table className="hms-table"><thead><tr><th>Date/Time</th><th>Asset</th><th>Action</th><th>Field</th><th>Old Value</th><th>New Value</th><th>User</th><th>IP</th></tr></thead>
            <tbody>
              {[['2024-03-15 14:30','AST-005','Status Change','Status','Active','Under Maintenance','admin','192.168.1.10'],['2024-03-15 10:15','AST-007','New Entry','--','--','Created','admin','192.168.1.10'],['2024-03-14 16:45','AST-002','Location Change','Location','OPD Room','Radiology Dept','dr.sharma','192.168.1.25'],['2024-03-14 09:00','AST-003','AMC Renewed','AMC End','2024-03-10','2025-03-10','admin','192.168.1.10']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Assets;
