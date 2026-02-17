import React, { useState } from 'react';
import { Search, Edit, Eye, Printer, Plus } from 'lucide-react';

const mockIPD = [
  { sno: 1, ipdId: 'IPD-501', uhid: 'U-101', name: 'Mrs. Kamla Devi', age: '60Y', gender: 'Female', ward: 'Ward-A', bed: 'B-12', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', doa: '14-Feb-2026', status: 'Admitted' },
  { sno: 2, ipdId: 'IPD-502', uhid: 'U-102', name: 'Mr. Vikram Singh', age: '42Y', gender: 'Male', ward: 'ICU', bed: 'ICU-03', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', doa: '13-Feb-2026', status: 'Critical' },
  { sno: 3, ipdId: 'IPD-503', uhid: 'U-103', name: 'Mrs. Anita Kumari', age: '35Y', gender: 'Female', ward: 'Ward-B', bed: 'B-05', doctor: 'Dr. Priya Singh', dept: 'Gynecology', doa: '15-Feb-2026', status: 'Stable' },
  { sno: 4, ipdId: 'IPD-504', uhid: 'U-104', name: 'Mr. Rajan Kumar', age: '50Y', gender: 'Male', ward: 'Ward-C', bed: 'C-08', doctor: 'Dr. Alok Mehta', dept: 'Cardiology', doa: '12-Feb-2026', status: 'Stable' },
  { sno: 5, ipdId: 'IPD-505', uhid: 'U-105', name: 'Baby Arjun', age: '1Y', gender: 'Male', ward: 'NICU', bed: 'N-02', doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', doa: '16-Feb-2026', status: 'Under Observation' },
];

const IPD = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'admit' | 'discharge'>('list');

  return (
    <div>
      <div className="flex gap-1 mb-2 border-b border-border pb-1">
        {['list', 'admit', 'discharge'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-3 py-1 text-xs font-semibold capitalize ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {tab === 'list' ? 'IPD List' : tab === 'admit' ? 'New Admission' : 'Discharge'}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Patient..." />
            <select className="hms-select"><option>All Wards</option><option>Ward-A</option><option>Ward-B</option><option>Ward-C</option><option>ICU</option><option>NICU</option></select>
            <select className="hms-select"><option>All Status</option><option>Admitted</option><option>Critical</option><option>Stable</option><option>Discharged</option></select>
            <button className="hms-btn-primary"><Search size={12} /></button>
          </div>
          <table className="hms-table">
            <thead>
              <tr><th>S.No.</th><th>IPD ID</th><th>UHID</th><th>Patient Name</th><th>Age/Sex</th><th>Ward/Bed</th><th>Doctor</th><th>Department</th><th>DOA</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {mockIPD.map(p => (
                <tr key={p.sno}>
                  <td>{p.sno}</td><td>{p.ipdId}</td><td>{p.uhid}</td><td>{p.name}</td>
                  <td>{p.age}/{p.gender[0]}</td><td>{p.ward}/{p.bed}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.doa}</td>
                  <td className={p.status === 'Critical' ? 'text-destructive font-bold' : ''}>{p.status}</td>
                  <td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Edit size={14} className="text-primary cursor-pointer" /><Printer size={14} className="text-primary cursor-pointer" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'admit' && (
        <div>
          <div className="hms-section-header">New IPD Admission</div>
          <div className="bg-card border border-border p-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">UHID:</label><input className="hms-input flex-1" /><button className="hms-btn-primary">Search</button></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Patient Name:</label><input className="hms-input flex-1" /></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Mobile:</label><input className="hms-input flex-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Department:</label><select className="hms-select flex-1"><option>GENERAL MEDICINE</option><option>ORTHOPEDICS</option><option>GYNECOLOGY</option><option>CARDIOLOGY</option><option>PEDIATRICS</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Doctor:</label><select className="hms-select flex-1"><option>Dr. ALOK MEHTA</option><option>Dr. RAHUL VERMA</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Ward:</label><select className="hms-select flex-1"><option>Ward-A</option><option>Ward-B</option><option>Ward-C</option><option>ICU</option><option>NICU</option></select></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Bed No:</label><select className="hms-select flex-1"><option>B-01</option><option>B-02</option><option>B-03</option><option>B-04</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">TPA/Panel:</label><select className="hms-select flex-1"><option>--NA--</option><option>CGHS</option><option>ECHS</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Ref. By:</label><input className="hms-input flex-1" placeholder="SELF" /></div>
            </div>
            <div className="flex items-center gap-2"><label className="hms-form-label w-24">Diagnosis:</label><textarea className="hms-input flex-1 h-16" placeholder="Provisional Diagnosis" /></div>
            <div className="flex justify-end gap-2"><button className="hms-btn-primary">Admit</button><button className="hms-btn-secondary">Reset</button></div>
          </div>
        </div>
      )}

      {activeTab === 'discharge' && (
        <div>
          <div className="hms-section-header">Discharge Patient</div>
          <div className="bg-card border border-border p-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">IPD ID:</label><input className="hms-input flex-1" /><button className="hms-btn-primary">Search</button></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Discharge Type:</label><select className="hms-select flex-1"><option>Normal</option><option>DAMA</option><option>Absconded</option><option>Referred</option><option>Expired</option></select></div>
              <div className="flex items-center gap-2"><label className="hms-form-label w-24">Date:</label><input type="date" className="hms-input flex-1" /></div>
            </div>
            <div className="flex items-center gap-2"><label className="hms-form-label w-24">Summary:</label><textarea className="hms-input flex-1 h-20" placeholder="Discharge Summary" /></div>
            <div className="flex justify-end gap-2"><button className="hms-btn-primary">Discharge</button><button className="hms-btn-secondary">Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPD;
