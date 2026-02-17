import React from 'react';
import { Eye, Printer } from 'lucide-react';

const labResults = [
  { sno: 1, invoiceNo: 'INV-301', uhid: 'U-1001', name: 'Mr. Rajesh Kumar', test: 'CBC', dept: 'Pathology', refDoctor: 'Dr. Alok Mehta', date: '15-Feb-2026', status: 'Completed' },
  { sno: 2, invoiceNo: 'INV-302', uhid: 'U-1002', name: 'Mrs. Sunita Devi', test: 'LFT', dept: 'Biochemistry', refDoctor: 'Dr. Priya Singh', date: '15-Feb-2026', status: 'Pending' },
  { sno: 3, invoiceNo: 'INV-303', uhid: 'U-1003', name: 'Mr. Amit Sharma', test: 'X-Ray Chest', dept: 'Radiology', refDoctor: 'Dr. Rahul Verma', date: '15-Feb-2026', status: 'In Progress' },
  { sno: 4, invoiceNo: 'INV-304', uhid: 'U-1004', name: 'Baby Riya', test: 'Blood Culture', dept: 'Microbiology', refDoctor: 'Dr. Neha Gupta', date: '15-Feb-2026', status: 'Pending' },
  { sno: 5, invoiceNo: 'INV-305', uhid: 'U-1005', name: 'Mr. Suresh Yadav', test: 'ECG', dept: 'Cardiology', refDoctor: 'Dr. Alok Mehta', date: '15-Feb-2026', status: 'Completed' },
];

const Labs = () => (
  <div>
    <div className="hms-section-header">Laboratory Management</div>
    <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3 text-xs">
      <label className="hms-form-label">Date:</label><input type="date" className="hms-input" defaultValue="2026-02-15" />
      <label className="hms-form-label">Department:</label><select className="hms-select"><option>All</option><option>Pathology</option><option>Biochemistry</option><option>Radiology</option><option>Microbiology</option></select>
      <label className="hms-form-label">Status:</label><select className="hms-select"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select>
      <button className="hms-btn-primary">Search</button>
    </div>
    <table className="hms-table">
      <thead><tr><th>S.No.</th><th>Invoice No.</th><th>UHID</th><th>Patient Name</th><th>Test</th><th>Department</th><th>Ref Doctor</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {labResults.map(l => (
          <tr key={l.sno}>
            <td>{l.sno}</td><td>{l.invoiceNo}</td><td>{l.uhid}</td><td>{l.name}</td><td>{l.test}</td><td>{l.dept}</td><td>{l.refDoctor}</td><td>{l.date}</td>
            <td><span className={`px-2 py-0.5 text-[10px] font-bold ${l.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : l.status === 'Pending' ? 'bg-hms-warning' : 'bg-hms-info text-primary-foreground'}`}>{l.status}</span></td>
            <td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Printer size={14} className="text-primary cursor-pointer" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Labs;
