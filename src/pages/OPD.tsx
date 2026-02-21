import React, { useState } from 'react';
import { Search, Edit, Printer, Trash2, Eye, Calendar, FileText, Image } from 'lucide-react';

const mockPatients = [
  { sno: 1, queue: 2, opdId: 'OP-7', uhid: 'U-7/2023', name: 'Mr. LOKESH', dept: 'GENERAL MEDICINE', doctor: 'Dr. ALOK MEHTA', type: 'Gen', fee: '450/-', mode: 'Cash', date: '15-Jan-2023', time: '04:08 PM' },
  { sno: 2, queue: 1, opdId: 'OP-6', uhid: 'U-2/2023', name: 'Ms. ASHA', dept: 'GYNAECOLOGY & OBSTETRICS', doctor: 'Dr. ARTI MEHTA', type: 'Gen', fee: '500/-', mode: 'Cash', date: '15-Jan-2023', time: '04:15 PM' },
  { sno: 3, queue: 1, opdId: 'OP-5', uhid: 'U-6/2023', name: 'Mr. SURESH ANAND', dept: 'GENERAL MEDICINE', doctor: 'Dr. ALOK MEHTA', type: 'Gen', fee: '500/-', mode: 'Cash', date: '15-Jan-2023', time: '04:30 PM' },
  { sno: 4, queue: 3, opdId: 'OP-4', uhid: 'U-4/2023', name: 'Mrs. SUNITA DEVI', dept: 'PEDIATRICS', doctor: 'Dr. NEHA GUPTA', type: 'Gen', fee: '400/-', mode: 'Cash', date: '15-Jan-2023', time: '04:45 PM' },
  { sno: 5, queue: 2, opdId: 'OP-3', uhid: 'U-3/2023', name: 'Baby RIYA', dept: 'PEDIATRICS', doctor: 'Dr. NEHA GUPTA', type: 'Gen', fee: '350/-', mode: 'Cash', date: '15-Jan-2023', time: '05:00 PM' },
];

const OPD = () => {
  const [searchUhid, setSearchUhid] = useState('');
  const [tableSearch, setTableSearch] = useState('');

  return (
    <div>
      {/* UHID Search Bar */}
      <div className="flex items-center gap-2 mb-2 bg-card border border-border p-2">
        <label className="hms-form-label">Enter UHID:</label>
        <input className="hms-input w-28 bg-[hsl(var(--hms-warning)/0.3)]" value={searchUhid} onChange={e => setSearchUhid(e.target.value)} placeholder="UHID" />
        <button className="hms-btn-primary flex items-center gap-1"><Search size={12} /> Search</button>
        <div className="ml-auto text-xs font-semibold text-primary">
          OPD : Rs.1500 &nbsp; Discount : Rs.50/- &nbsp; Collection : Rs.1450/-
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-card border border-border p-3 mb-2">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Date & Time :</label>
              <input type="date" className="hms-input w-32" defaultValue="2023-01-15" />
              <input type="time" className="hms-input w-28" defaultValue="16:04" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Mobile :</label>
              <input className="hms-input flex-1" placeholder="Mobile Number" />
              <label className="hms-form-label">Panel:</label>
              <select className="hms-select w-24"><option>--NA--</option><option>CGHS</option><option>ECHS</option><option>Star Health</option></select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Department :</label>
              <select className="hms-select flex-1">
                <option>GENERAL MEDICINE</option><option>ORTHOPEDICS</option><option>GYNECOLOGY</option><option>PEDIATRICS</option><option>CARDIOLOGY</option><option>ENT</option><option>DERMATOLOGY</option><option>DIAGNOSTIC UNIT</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Patient Name :</label>
              <select className="hms-select w-20"><option>-- Selec</option><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Baby</option></select>
              <input className="hms-input flex-1" placeholder="Patient Name" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Gender :</label>
              <select className="hms-select w-24"><option>Male</option><option>Female</option><option>Other</option></select>
              <label className="hms-form-label">Marital :</label>
              <select className="hms-select w-24"><option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option></select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Address :</label>
              <textarea className="hms-input flex-1 h-10 resize" placeholder="Patient Address" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Blood Group :</label>
              <select className="hms-select w-16"><option>NA</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
              <label className="hms-form-label">Source :</label>
              <select className="hms-select flex-1"><option>ADV HOARDINGS</option><option>WALK-IN</option><option>REFERENCE</option><option>ONLINE</option></select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Referred By / Dr.:</label>
              <input className="hms-input w-32" defaultValue="SELF" />
              <input className="hms-input flex-1" placeholder="Ref Mobile" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-28 text-right">Patient Image :</label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center"><Image size={16} className="text-muted-foreground" /></div>
                <input type="file" className="text-xs" accept="image/*" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Email :</label>
              <input className="hms-input w-32" placeholder="Email" />
              <select className="hms-select w-20"><option>Aadhar</option><option>PAN</option><option>Voter ID</option></select>
              <input className="hms-input flex-1" placeholder="ID Number" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Card No. :</label>
              <input className="hms-input w-24" placeholder="Card No." />
              <label className="hms-form-label">Service</label>
              <input className="hms-input w-16" placeholder="Sr. No" />
              <label className="hms-form-label">Rank</label>
              <input className="hms-input w-16" placeholder="Rank" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Doctor :</label>
              <select className="hms-select flex-1"><option>-- Select Doctor --</option><option>Dr. ALOK MEHTA</option><option>Dr. PRIYA SINGH</option><option>Dr. RAHUL VERMA</option><option>Dr. NEHA GUPTA</option><option>Dr. ARTI MEHTA</option></select>
              <select className="hms-select w-20"><option>Slot III</option><option>Slot I</option><option>Slot II</option></select>
              <input className="hms-input w-20" placeholder="OPD Fee" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">S/D/W o :</label>
              <select className="hms-select w-20"><option>-- Selec</option><option>S/o</option><option>D/o</option><option>W/o</option></select>
              <input className="hms-input flex-1" placeholder="S/D/W o" />
              <select className="hms-select w-28"><option>-- Select Relati</option><option>Father</option><option>Mother</option><option>Spouse</option><option>Guardian</option></select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">DOB/Age :</label>
              <input className="hms-input w-28" placeholder="dd/mm/yyyy" />
              <input className="hms-input w-14" placeholder="Age(Y)" />
              <input className="hms-input w-14" placeholder="Age(M)" />
              <input className="hms-input w-14" placeholder="Age(D)" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Resident :</label>
              <select className="hms-select w-20"><option>India</option><option>NRI</option></select>
              <label className="hms-form-label">State :</label>
              <select className="hms-select w-32"><option>-- Select State --</option><option>Delhi</option><option>UP</option><option>Haryana</option><option>Rajasthan</option></select>
              <label className="hms-form-label">City :</label>
              <select className="hms-select flex-1"><option>-- Select City --</option><option>Noida</option><option>Delhi</option><option>Gurgaon</option></select>
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Discount :</label>
              <input type="checkbox" className="mr-1" />
              <input className="hms-input w-12" placeholder="%" />
              <input className="hms-input w-20" placeholder="Discount" />
              <label className="hms-form-label">Remark :</label>
              <input className="hms-input flex-1" placeholder="Remark" />
            </div>
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-24 text-right">Payment :</label>
              <select className="hms-select w-28"><option>Cash</option><option>Card</option><option>UPI</option><option>TPA</option></select>
              <div className="flex-1" />
              <button className="hms-btn-primary px-8 py-2 text-sm font-bold">Register</button>
            </div>
          </div>
        </div>
      </div>

      {/* Export buttons + Search */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-1">
          <button className="hms-btn-secondary text-xs px-2 py-1">Copy</button>
          <button className="hms-btn-secondary text-xs px-2 py-1">CSV</button>
          <button className="hms-btn-secondary text-xs px-2 py-1">PDF</button>
          <button className="hms-btn-secondary text-xs px-2 py-1">PDF</button>
        </div>
        <div className="flex items-center gap-1">
          <label className="hms-form-label">Search:</label>
          <input className="hms-input w-40" value={tableSearch} onChange={e => setTableSearch(e.target.value)} />
        </div>
      </div>

      {/* OPD List Table */}
      <table className="hms-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Queue</th>
            <th>OPD ID</th>
            <th>UHID</th>
            <th>Patient Name</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Type</th>
            <th>Fee</th>
            <th>Mode</th>
            <th>Process</th>
          </tr>
        </thead>
        <tbody>
          {mockPatients.filter(p => !tableSearch || p.name.toLowerCase().includes(tableSearch.toLowerCase()) || p.uhid.toLowerCase().includes(tableSearch.toLowerCase())).map(p => (
            <tr key={p.sno}>
              <td>{p.sno} <FileText size={12} className="inline text-primary ml-1 cursor-pointer" /></td>
              <td>{p.queue} <span className="text-destructive cursor-pointer ml-1">✕</span></td>
              <td>{p.opdId} <Printer size={12} className="inline text-primary ml-1 cursor-pointer" /></td>
              <td>{p.uhid}</td>
              <td><Edit size={12} className="inline text-primary mr-1 cursor-pointer" />{p.name}</td>
              <td>{p.dept}</td>
              <td>{p.doctor}</td>
              <td>{p.type}</td>
              <td><Edit size={10} className="inline text-primary mr-1 cursor-pointer" />{p.fee}</td>
              <td>{p.mode}</td>
              <td className="flex gap-1">
                <span className="w-5 h-5 bg-primary text-primary-foreground flex items-center justify-center text-xs cursor-pointer" title="View"><Eye size={10} /></span>
                <span className="w-5 h-5 bg-[hsl(var(--hms-success))] text-[hsl(var(--hms-success-foreground))] flex items-center justify-center text-xs cursor-pointer" title="Print"><Printer size={10} /></span>
                <span className="w-5 h-5 bg-[hsl(var(--hms-info))] text-primary-foreground flex items-center justify-center text-xs cursor-pointer" title="Edit"><Edit size={10} /></span>
                <span className="w-5 h-5 bg-destructive text-destructive-foreground flex items-center justify-center text-xs cursor-pointer" title="Delete"><Trash2 size={10} /></span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-muted-foreground mt-1">Showing 1 to {mockPatients.length} of {mockPatients.length} entries</div>
    </div>
  );
};

export default OPD;
