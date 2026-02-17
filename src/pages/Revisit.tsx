import React from 'react';
import { Search } from 'lucide-react';

const revisitData = [
  { sno: 1, uhid: 'U-1001', name: 'Mr. Rajesh Kumar', lastVisit: '10-Feb-2026', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', nextVisit: '17-Feb-2026' },
  { sno: 2, uhid: 'U-1002', name: 'Mrs. Sunita Devi', lastVisit: '08-Feb-2026', doctor: 'Dr. Priya Singh', dept: 'Gynecology', nextVisit: '18-Feb-2026' },
];

const Revisit = () => (
  <div>
    <div className="hms-section-header">Revisit / Follow-up</div>
    <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3">
      <label className="hms-form-label">Date:</label><input type="date" className="hms-input" defaultValue="2026-02-17" />
      <label className="hms-form-label">Doctor:</label><select className="hms-select"><option>All</option><option>Dr. Alok Mehta</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <table className="hms-table">
      <thead><tr><th>S.No.</th><th>UHID</th><th>Patient Name</th><th>Last Visit</th><th>Doctor</th><th>Department</th><th>Next Visit</th><th>Action</th></tr></thead>
      <tbody>
        {revisitData.map(r => (
          <tr key={r.sno}><td>{r.sno}</td><td>{r.uhid}</td><td>{r.name}</td><td>{r.lastVisit}</td><td>{r.doctor}</td><td>{r.dept}</td><td>{r.nextVisit}</td><td><button className="hms-btn-primary text-[10px] px-2 py-0.5">Create OPD</button></td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Revisit;
