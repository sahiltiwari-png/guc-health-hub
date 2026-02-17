import React, { useState } from 'react';
import { Search, Edit, Eye, Printer, Plus } from 'lucide-react';

const mockPatients = [
  { sno: 1, uhid: 'U-1001', name: 'Mr. Rajesh Kumar', age: '45Y', gender: 'Male', mobile: '9876543210', address: 'Sector 12, Noida', guardian: 'Suresh Kumar', regDate: '10-Jan-2023' },
  { sno: 2, uhid: 'U-1002', name: 'Mrs. Sunita Devi', age: '32Y', gender: 'Female', mobile: '8765432109', address: 'Lajpat Nagar, Delhi', guardian: 'Ramesh Kumar', regDate: '12-Jan-2023' },
  { sno: 3, uhid: 'U-1003', name: 'Mr. Amit Sharma', age: '28Y', gender: 'Male', mobile: '7654321098', address: 'Vaishali, Ghaziabad', guardian: 'Self', regDate: '14-Jan-2023' },
  { sno: 4, uhid: 'U-1004', name: 'Baby Riya', age: '2Y', gender: 'Female', mobile: '6543210987', address: 'Greater Noida', guardian: 'Anil Kumar', regDate: '15-Jan-2023' },
];

const PatientRegistration = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');

  return (
    <div>
      <div className="flex gap-1 mb-2 border-b border-border pb-1">
        <button onClick={() => setActiveTab('list')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Patient List</button>
        <button onClick={() => setActiveTab('new')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'new' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>New Registration</button>
      </div>

      {activeTab === 'list' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search by Name/UHID/Mobile..." />
            <button className="hms-btn-primary"><Search size={12} /> Search</button>
          </div>
          <table className="hms-table">
            <thead><tr><th>S.No.</th><th>UHID</th><th>Patient Name</th><th>Age</th><th>Gender</th><th>Mobile</th><th>Address</th><th>S/D/W/o</th><th>Reg Date</th><th>Actions</th></tr></thead>
            <tbody>
              {mockPatients.map(p => (
                <tr key={p.sno}><td>{p.sno}</td><td>{p.uhid}</td><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.mobile}</td><td>{p.address}</td><td>{p.guardian}</td><td>{p.regDate}</td><td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'new' && (
        <div>
          <div className="hms-section-header">New Patient Registration</div>
          <div className="bg-card border border-border p-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Patient Name:</label><select className="hms-select w-14"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Baby</option></select><input className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Mobile:</label><input className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Email:</label><input className="hms-input flex-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Age:</label><input className="hms-input w-12" placeholder="Y" /><input className="hms-input w-12" placeholder="M" /><input className="hms-input w-12" placeholder="D" /><select className="hms-select w-16"><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">DOB:</label><input type="date" className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Blood Group:</label><select className="hms-select flex-1"><option>--Select--</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">S/D/W/o Name:</label><select className="hms-select w-14"><option>Mr.</option><option>Mrs.</option></select><input className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Aadhar No:</label><input className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Occupation:</label><input className="hms-input flex-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Address:</label><textarea className="hms-input flex-1 h-12" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-28">Remarks:</label><textarea className="hms-input flex-1 h-12" /></div>
            </div>
            <div className="flex justify-end gap-2"><button className="hms-btn-primary">Register</button><button className="hms-btn-secondary">Reset</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
