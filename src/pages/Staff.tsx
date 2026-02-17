import React, { useState } from 'react';
import { Edit, Eye } from 'lucide-react';

const staffData = {
  doctors: [
    { id: 'D-001', name: 'Dr. Alok Mehta', dept: 'General Medicine', qualification: 'MBBS, MD', mobile: '9876543210', status: 'Active' },
    { id: 'D-002', name: 'Dr. Priya Singh', dept: 'Gynecology', qualification: 'MBBS, MS', mobile: '9876543211', status: 'Active' },
    { id: 'D-003', name: 'Dr. Rahul Verma', dept: 'Orthopedics', qualification: 'MBBS, MS', mobile: '9876543212', status: 'Active' },
    { id: 'D-004', name: 'Dr. Neha Gupta', dept: 'Pediatrics', qualification: 'MBBS, DCH', mobile: '9876543213', status: 'On Leave' },
    { id: 'D-005', name: 'Dr. Anil Kumar', dept: 'Cardiology', qualification: 'MBBS, DM', mobile: '9876543214', status: 'Active' },
  ],
  nurses: [
    { id: 'N-001', name: 'Priya Sharma', dept: 'ICU', shift: 'Morning', mobile: '8765432100', status: 'Active' },
    { id: 'N-002', name: 'Rekha Devi', dept: 'Ward-A', shift: 'Evening', mobile: '8765432101', status: 'Active' },
    { id: 'N-003', name: 'Anjali Kumari', dept: 'OT', shift: 'Night', mobile: '8765432102', status: 'Active' },
  ],
  technicians: [
    { id: 'T-001', name: 'Suresh Verma', dept: 'Pathology', designation: 'Lab Technician', mobile: '7654321000', status: 'Active' },
    { id: 'T-002', name: 'Manoj Kumar', dept: 'Radiology', designation: 'Radiographer', mobile: '7654321001', status: 'Active' },
  ],
  other: [
    { id: 'S-001', name: 'Ravi Kumar', dept: 'Reception', designation: 'Receptionist', mobile: '6543210000', status: 'Active' },
    { id: 'S-002', name: 'Ankit Gupta', dept: 'Pharmacy', designation: 'Pharmacist', mobile: '6543210001', status: 'Active' },
    { id: 'S-003', name: 'Meena Devi', dept: 'Accounts', designation: 'Accountant', mobile: '6543210002', status: 'Active' },
    { id: 'S-004', name: 'Ram Singh', dept: 'Security', designation: 'Guard', mobile: '6543210003', status: 'Active' },
    { id: 'S-005', name: 'Shyam Lal', dept: 'Housekeeping', designation: 'Attendant', mobile: '6543210004', status: 'Active' },
  ],
};

const Staff = () => {
  const [tab, setTab] = useState<'doctors' | 'nurses' | 'technicians' | 'other'>('doctors');

  return (
    <div>
      <div className="hms-section-header">Staff Management</div>
      <div className="flex gap-1 mb-2">
        {(['doctors', 'nurses', 'technicians', 'other'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1 text-xs font-semibold capitalize ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>{t}</button>
        ))}
        <button className="hms-btn-primary ml-auto">+ Add Staff</button>
      </div>

      {tab === 'doctors' && (
        <table className="hms-table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Qualification</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{staffData.doctors.map(d => (<tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.dept}</td><td>{d.qualification}</td><td>{d.mobile}</td><td>{d.status}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /></td></tr>))}</tbody>
        </table>
      )}
      {tab === 'nurses' && (
        <table className="hms-table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Shift</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{staffData.nurses.map(n => (<tr key={n.id}><td>{n.id}</td><td>{n.name}</td><td>{n.dept}</td><td>{n.shift}</td><td>{n.mobile}</td><td>{n.status}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /></td></tr>))}</tbody>
        </table>
      )}
      {tab === 'technicians' && (
        <table className="hms-table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{staffData.technicians.map(t => (<tr key={t.id}><td>{t.id}</td><td>{t.name}</td><td>{t.dept}</td><td>{t.designation}</td><td>{t.mobile}</td><td>{t.status}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /></td></tr>))}</tbody>
        </table>
      )}
      {tab === 'other' && (
        <table className="hms-table">
          <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Mobile</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{staffData.other.map(s => (<tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.dept}</td><td>{s.designation}</td><td>{s.mobile}</td><td>{s.status}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /></td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
};

export default Staff;
