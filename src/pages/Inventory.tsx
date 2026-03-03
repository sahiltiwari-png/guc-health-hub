import React, { useState } from 'react';
import { Warehouse, Eye, Edit, Printer, CheckCircle, Clock, AlertTriangle, Trash2, ArrowRightLeft } from 'lucide-react';

const tabs = ['Dashboard','Item Master','Stock Register','Purchase Requisition','Purchase Orders','GRN','Issue/Return','Vendor Management','Stock Adjustment','Expiry Alert','Reports'];

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Active': 'bg-green-700 text-white', 'In Stock': 'bg-green-700 text-white', 'Low Stock': 'bg-yellow-600 text-white', 'Out of Stock': 'bg-red-700 text-white', 'Approved': 'bg-green-700 text-white', 'Pending': 'bg-yellow-600 text-white', 'Rejected': 'bg-red-700 text-white', 'Received': 'bg-green-700 text-white', 'Partial': 'bg-orange-600 text-white', 'Issued': 'bg-blue-700 text-white', 'Returned': 'bg-purple-700 text-white', 'Expiring Soon': 'bg-orange-600 text-white', 'Expired': 'bg-red-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const stockItems = [
  { code: 'ITM-001', name: 'Surgical Gloves (S)', category: 'Consumables', unit: 'Box (100pc)', stock: 450, minLevel: 100, maxLevel: 1000, reorder: 200, rate: '₹350', value: '₹1,57,500', location: 'Store-A/R1/S3', status: 'In Stock' },
  { code: 'ITM-002', name: 'N95 Mask', category: 'PPE', unit: 'Pcs', stock: 2500, minLevel: 500, maxLevel: 5000, reorder: 1000, rate: '₹45', value: '₹1,12,500', location: 'Store-A/R1/S5', status: 'In Stock' },
  { code: 'ITM-003', name: 'IV Cannula 20G', category: 'Consumables', unit: 'Pcs', stock: 180, minLevel: 200, maxLevel: 2000, reorder: 500, rate: '₹25', value: '₹4,500', location: 'Store-B/R2/S1', status: 'Low Stock' },
  { code: 'ITM-004', name: 'Gauze Roll (6")', category: 'Dressings', unit: 'Roll', stock: 800, minLevel: 200, maxLevel: 2000, reorder: 400, rate: '₹85', value: '₹68,000', location: 'Store-A/R2/S2', status: 'In Stock' },
  { code: 'ITM-005', name: 'Suture Vicryl 2-0', category: 'Sutures', unit: 'Pcs', stock: 0, minLevel: 50, maxLevel: 500, reorder: 100, rate: '₹280', value: '₹0', location: 'Store-B/R3/S1', status: 'Out of Stock' },
  { code: 'ITM-006', name: 'Syringe 5ml', category: 'Consumables', unit: 'Box (100pc)', stock: 320, minLevel: 100, maxLevel: 1000, reorder: 200, rate: '₹180', value: '₹57,600', location: 'Store-A/R1/S4', status: 'In Stock' },
  { code: 'ITM-007', name: 'Oxygen Cylinder (B-type)', category: 'Gases', unit: 'Cylinder', stock: 25, minLevel: 10, maxLevel: 50, reorder: 15, rate: '₹650', value: '₹16,250', location: 'Gas Plant', status: 'In Stock' },
  { code: 'ITM-008', name: 'ECG Paper Roll', category: 'Paper/Stationery', unit: 'Roll', stock: 45, minLevel: 20, maxLevel: 100, reorder: 30, rate: '₹120', value: '₹5,400', location: 'Store-A/R3/S2', status: 'In Stock' },
  { code: 'ITM-009', name: 'Blood Collection Tube (EDTA)', category: 'Lab Consumables', unit: 'Box (100pc)', stock: 15, minLevel: 20, maxLevel: 200, reorder: 50, rate: '₹450', value: '₹6,750', location: 'Lab Store', status: 'Low Stock' },
  { code: 'ITM-010', name: 'Foley Catheter 16Fr', category: 'Consumables', unit: 'Pcs', stock: 120, minLevel: 50, maxLevel: 500, reorder: 100, rate: '₹75', value: '₹9,000', location: 'Store-B/R1/S3', status: 'In Stock' },
];

const purchaseOrders = [
  { id: 'PO-2024-045', vendor: 'MedSupply India', items: 8, totalAmt: '₹2,45,000', date: '2024-03-10', delivery: '2024-03-17', received: '5/8', status: 'Partial' },
  { id: 'PO-2024-046', vendor: 'SurgiCare Ltd', items: 5, totalAmt: '₹1,80,000', date: '2024-03-12', delivery: '2024-03-19', received: '0/5', status: 'Pending' },
  { id: 'PO-2024-047', vendor: 'PharmaChem Corp', items: 12, totalAmt: '₹4,50,000', date: '2024-03-14', delivery: '2024-03-21', received: '0/12', status: 'Approved' },
  { id: 'PO-2024-044', vendor: 'GasTech Solutions', items: 3, totalAmt: '₹85,000', date: '2024-03-08', delivery: '2024-03-12', received: '3/3', status: 'Received' },
];

const Inventory = () => {
  const [tab, setTab] = useState('Dashboard');
  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Warehouse size={14} /> Inventory & Store Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Total Items', v: '2,845', s: '18 Categories' },{ l: 'Total Stock Value', v: '₹1.8 Cr', s: 'At Cost' },{ l: 'Low Stock Items', v: '23', s: 'Below Reorder' },{ l: 'Out of Stock', v: '5', s: 'Critical' },{ l: 'Pending POs', v: '3', s: '₹8.75L Value' },{ l: 'Expiring (<30d)', v: '12', s: '₹45,000 Value' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Low Stock / Out of Stock Alerts</div>
              <table className="hms-table"><thead><tr><th>Item</th><th>Code</th><th>Current</th><th>Min Level</th><th>Reorder Qty</th><th>Status</th></tr></thead>
                <tbody>{stockItems.filter(s => s.status !== 'In Stock').map(s => <tr key={s.code}><td>{s.name}</td><td className="font-mono text-[10px]">{s.code}</td><td className="font-bold">{s.stock}</td><td>{s.minLevel}</td><td>{s.reorder}</td><td><StatusBadge status={s.status} /></td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Recent Purchase Orders</div>
              <table className="hms-table"><thead><tr><th>PO No</th><th>Vendor</th><th>Items</th><th>Amount</th><th>Delivery</th><th>Status</th></tr></thead>
                <tbody>{purchaseOrders.map(p => <tr key={p.id}><td className="font-mono text-[10px]">{p.id}</td><td>{p.vendor}</td><td>{p.items}</td><td>{p.totalAmt}</td><td>{p.delivery}</td><td><StatusBadge status={p.status} /></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Item Master' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Item Code/Name..." />
            <select className="hms-select"><option>All Categories</option><option>Consumables</option><option>PPE</option><option>Dressings</option><option>Sutures</option><option>Gases</option><option>Lab Consumables</option></select>
            <select className="hms-select"><option>All Status</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select>
            <button className="hms-btn-primary ml-auto">+ Add Item</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Export</button>
          </div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Unit</th><th>Stock</th><th>Min</th><th>Max</th><th>Reorder</th><th>Rate</th><th>Value</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{stockItems.map(s => <tr key={s.code}><td className="font-mono text-[10px]">{s.code}</td><td>{s.name}</td><td>{s.category}</td><td>{s.unit}</td><td className={s.stock <= s.minLevel ? 'text-red-600 font-bold' : ''}>{s.stock}</td><td>{s.minLevel}</td><td>{s.maxLevel}</td><td>{s.reorder}</td><td>{s.rate}</td><td>{s.value}</td><td className="text-[10px]">{s.location}</td><td><StatusBadge status={s.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /> <Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Stock Register' && (
        <div>
          <div className="flex gap-2 mb-2"><input className="hms-input w-48" placeholder="Search Item..." /><select className="hms-select"><option>All Stores</option><option>Store-A (Main)</option><option>Store-B (Surgical)</option><option>Lab Store</option><option>Gas Plant</option></select></div>
          <table className="hms-table"><thead><tr><th>Date</th><th>Item</th><th>Code</th><th>Type</th><th>Qty In</th><th>Qty Out</th><th>Balance</th><th>Batch</th><th>Expiry</th><th>Reference</th><th>By</th></tr></thead>
            <tbody>
              {[['2024-03-15','Surgical Gloves (S)','ITM-001','GRN',200,0,450,'BT-2024-03','2026-03-15','GRN-245','Store Keeper'],['2024-03-15','IV Cannula 20G','ITM-003','Issue',0,20,180,'-','-','ISS-102 (ICU)','Nurse Geeta'],['2024-03-14','N95 Mask','ITM-002','Issue',0,100,2500,'-','-','ISS-101 (OT)','OT Nurse'],['2024-03-14','Gauze Roll','ITM-004','GRN',300,0,800,'BT-2024-02','2025-12-31','GRN-244','Store Keeper'],['2024-03-13','Syringe 5ml','ITM-006','Issue',0,50,320,'-','-','ISS-100 (Ward-A)','Ward Nurse'],['2024-03-13','Suture Vicryl 2-0','ITM-005','Issue',0,10,0,'-','-','ISS-099 (OT)','OT Nurse']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 3 ? (c === 'GRN' ? 'text-green-700 font-bold' : 'text-blue-700 font-bold') : ''}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Purchase Requisition' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Create Requisition</button></div>
          <table className="hms-table"><thead><tr><th>PR No</th><th>Date</th><th>Department</th><th>Items</th><th>Requested By</th><th>Priority</th><th>Status</th><th>PO Generated</th><th>Action</th></tr></thead>
            <tbody>
              {[['PR-2024-089','2024-03-15','ICU','5','Sr. Nurse Geeta','Urgent','Approved','PO-2024-047'],['PR-2024-088','2024-03-14','OT','3','OT In-Charge','Normal','Approved','PO-2024-046'],['PR-2024-087','2024-03-13','Ward-A','8','Ward Nurse','Normal','Pending','-'],['PR-2024-086','2024-03-12','Laboratory','4','Lab Tech','Normal','Approved','PO-2024-045']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 6 ? <StatusBadge status={c} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Purchase Orders' && (
        <div>
          <div className="flex gap-2 mb-2"><select className="hms-select"><option>All Status</option><option>Pending</option><option>Approved</option><option>Partial</option><option>Received</option></select><button className="hms-btn-primary ml-auto">+ Create PO</button></div>
          <table className="hms-table"><thead><tr><th>PO No</th><th>Vendor</th><th>Items</th><th>Total Amount</th><th>PO Date</th><th>Expected Delivery</th><th>Received</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{purchaseOrders.map(p => <tr key={p.id}><td className="font-mono text-[10px]">{p.id}</td><td>{p.vendor}</td><td>{p.items}</td><td>{p.totalAmt}</td><td>{p.date}</td><td>{p.delivery}</td><td>{p.received}</td><td><StatusBadge status={p.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /> <Printer size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'GRN' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Create GRN</button></div>
          <table className="hms-table"><thead><tr><th>GRN No</th><th>Date</th><th>PO Ref</th><th>Vendor</th><th>Items Received</th><th>Invoice No</th><th>Invoice Amt</th><th>QC Status</th><th>Received By</th><th>Action</th></tr></thead>
            <tbody>
              {[['GRN-245','2024-03-15','PO-2024-045','MedSupply India','5/8','INV-MS-2024-112','₹1,45,000','Passed','Store Keeper'],['GRN-244','2024-03-14','PO-2024-044','GasTech Solutions','3/3','INV-GT-2024-089','₹85,000','Passed','Store Keeper'],['GRN-243','2024-03-12','PO-2024-043','PharmaChem Corp','10/10','INV-PC-2024-445','₹3,20,000','Passed','Store Keeper']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 7 ? <StatusBadge status={c === 'Passed' ? 'Approved' : 'Pending'} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Issue/Return' && (
        <div>
          <div className="flex gap-2 mb-2"><select className="hms-select"><option>All Types</option><option>Issue</option><option>Return</option></select><button className="hms-btn-primary ml-auto">+ New Issue</button><button className="hms-btn-secondary">+ Return</button></div>
          <table className="hms-table"><thead><tr><th>Voucher</th><th>Date</th><th>Type</th><th>Department</th><th>Items</th><th>Total Value</th><th>Requested By</th><th>Issued By</th><th>Status</th></tr></thead>
            <tbody>
              {[['ISS-102','2024-03-15','Issue','ICU','3','₹2,500','Nurse Geeta','Store Keeper','Issued'],['ISS-101','2024-03-14','Issue','OT','5','₹8,200','OT Nurse','Store Keeper','Issued'],['RET-015','2024-03-14','Return','Ward-B','2','₹1,200','Ward Nurse','Store Keeper','Returned'],['ISS-100','2024-03-13','Issue','Ward-A','4','₹3,800','Ward Nurse','Store Keeper','Issued']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 2 ? <StatusBadge status={c} /> : j === 8 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Vendor Management' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Vendor</button></div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Vendor Name</th><th>Category</th><th>Contact</th><th>Phone</th><th>GST No</th><th>POs (YTD)</th><th>Value (YTD)</th><th>Delivery Rating</th><th>Payment Terms</th><th>Action</th></tr></thead>
            <tbody>
              {[['VND-001','MedSupply India','Consumables','Mr. Rajan','9876543210','27AABCM1234A1Z5','12','₹18,50,000','92%','Net 30'],['VND-002','SurgiCare Ltd','Surgical','Ms. Priya','8765432109','07AABCS5678B2Z3','8','₹12,00,000','88%','Net 45'],['VND-003','PharmaChem Corp','Chemicals','Mr. Kumar','7654321098','09AABCP9012C3Z1','15','₹25,00,000','95%','Net 30'],['VND-004','GasTech Solutions','Medical Gases','Mr. Patel','6543210987','24AABCG3456D4Z9','6','₹5,10,000','98%','Advance']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /> <Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Stock Adjustment' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ New Adjustment</button></div>
          <table className="hms-table"><thead><tr><th>Adj No</th><th>Date</th><th>Item</th><th>Code</th><th>System Qty</th><th>Physical Qty</th><th>Difference</th><th>Reason</th><th>Approved By</th><th>Status</th></tr></thead>
            <tbody>
              {[['ADJ-018','2024-03-15','Surgical Gloves (S)','ITM-001','455','450','-5','Damaged','Store Manager','Approved'],['ADJ-017','2024-03-10','N95 Mask','ITM-002','2510','2500','-10','Expired/Disposed','Store Manager','Approved'],['ADJ-016','2024-03-05','Gauze Roll','ITM-004','795','800','+5','Counting Error (Prev)','Store Manager','Approved']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 6 ? <span className={c.startsWith('-') ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{c}</span> : j === 9 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Expiry Alert' && (
        <div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[{ l: 'Expired', v: '3 Items', s: '₹8,500 Value' },{ l: 'Expiring (<30 days)', v: '12 Items', s: '₹45,000 Value' },{ l: 'Expiring (<90 days)', v: '28 Items', s: '₹1,20,000 Value' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2"><div className="text-[10px] text-muted-foreground">{k.l}</div><div className="text-sm font-bold">{k.v}</div><div className="text-[9px] text-muted-foreground">{k.s}</div></div>
            ))}
          </div>
          <table className="hms-table"><thead><tr><th>Item</th><th>Code</th><th>Batch</th><th>Qty</th><th>Expiry Date</th><th>Days Left</th><th>Value</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {[['Hand Sanitizer 500ml','ITM-025','BT-2023-06','15','2024-03-10','-5','₹3,000','Store-A','Expired'],['Povidone Iodine','ITM-030','BT-2023-08','8','2024-03-20','5','₹2,400','Store-B','Expiring Soon'],['Surgical Tape','ITM-018','BT-2023-12','25','2024-04-15','31','₹5,000','Store-A','Expiring Soon'],['Hydrogen Peroxide','ITM-035','BT-2024-01','10','2024-03-05','-10','₹1,500','Store-B','Expired']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 8 ? <StatusBadge status={c} /> : j === 5 ? <span className={parseInt(c) < 0 ? 'text-red-600 font-bold' : 'text-orange-600 font-bold'}>{c}</span> : c}</td>)}<td><button className="hms-btn-secondary text-[10px] px-2 py-0.5">Dispose</button></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Reports' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Category-wise Stock Value</div>
            <table className="hms-table"><thead><tr><th>Category</th><th>Items</th><th>Value</th><th>% of Total</th></tr></thead>
              <tbody>{[['Consumables',850,'₹45,00,000','25%'],['PPE',120,'₹18,00,000','10%'],['Surgical',280,'₹35,00,000','19%'],['Lab Consumables',180,'₹22,00,000','12%'],['Dressings',150,'₹12,00,000','7%'],['Gases',25,'₹8,00,000','4%'],['Others',1240,'₹40,00,000','23%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Monthly Consumption Report</div>
            <table className="hms-table"><thead><tr><th>Month</th><th>Issues</th><th>Value</th><th>GRN</th><th>GRN Value</th><th>Wastage</th></tr></thead>
              <tbody>{[['Jan 2024','1,245','₹28,00,000','18','₹32,00,000','₹1,20,000'],['Feb 2024','1,180','₹26,50,000','15','₹28,00,000','₹95,000'],['Mar 2024 (MTD)','580','₹14,00,000','8','₹15,50,000','₹45,000']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
