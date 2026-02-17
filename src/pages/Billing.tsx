import React from 'react';
import { Printer, Eye } from 'lucide-react';

const bills = [
  { sno: 1, billNo: 'B-1001', uhid: 'U-1001', name: 'Mr. Rajesh Kumar', type: 'OPD', doctor: 'Dr. Alok Mehta', charge: 500, discount: 50, paid: 450, due: 0, mode: 'Cash', date: '15-Feb-2026' },
  { sno: 2, billNo: 'B-1002', uhid: 'U-1002', name: 'Mrs. Sunita Devi', type: 'Investigation', doctor: 'Dr. Priya Singh', charge: 2600, discount: 0, paid: 2600, due: 0, mode: 'UPI', date: '15-Feb-2026' },
  { sno: 3, billNo: 'B-1003', uhid: 'U-1003', name: 'Mr. Amit Sharma', type: 'IPD', doctor: 'Dr. Rahul Verma', charge: 15000, discount: 1000, paid: 10000, due: 4000, mode: 'Card', date: '14-Feb-2026' },
  { sno: 4, billNo: 'B-1004', uhid: 'U-1004', name: 'Baby Riya', type: 'Pharmacy', doctor: 'Dr. Neha Gupta', charge: 450, discount: 0, paid: 450, due: 0, mode: 'Cash', date: '15-Feb-2026' },
];

const Billing = () => (
  <div>
    <div className="hms-section-header">Billing & Collections</div>
    <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3">
      <label className="hms-form-label">Date From:</label><input type="date" className="hms-input" defaultValue="2026-02-15" />
      <label className="hms-form-label">Date To:</label><input type="date" className="hms-input" defaultValue="2026-02-15" />
      <label className="hms-form-label">Type:</label><select className="hms-select"><option>All</option><option>OPD</option><option>IPD</option><option>Investigation</option><option>Pharmacy</option><option>Day Care</option></select>
      <button className="hms-btn-primary">Search</button>
    </div>

    <div className="grid grid-cols-4 gap-2 mb-3">
      {[
        { label: 'Total Billed', value: '₹18,550' },
        { label: 'Collected', value: '₹13,500' },
        { label: 'Discount', value: '₹1,050' },
        { label: 'Dues', value: '₹4,000' },
      ].map((s, i) => (
        <div key={i} className="bg-card border border-border p-2 text-center">
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <table className="hms-table">
      <thead><tr><th>S.No.</th><th>Bill No.</th><th>UHID</th><th>Patient</th><th>Type</th><th>Doctor</th><th>Charge</th><th>Discount</th><th>Paid</th><th>Due</th><th>Mode</th><th>Date</th><th>Actions</th></tr></thead>
      <tbody>
        {bills.map(b => (
          <tr key={b.sno}><td>{b.sno}</td><td>{b.billNo}</td><td>{b.uhid}</td><td>{b.name}</td><td>{b.type}</td><td>{b.doctor}</td><td>₹{b.charge}</td><td>₹{b.discount}</td><td>₹{b.paid}</td><td className={b.due > 0 ? 'text-destructive font-bold' : ''}>₹{b.due}</td><td>{b.mode}</td><td>{b.date}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Printer size={14} className="text-primary cursor-pointer" /></td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Billing;
