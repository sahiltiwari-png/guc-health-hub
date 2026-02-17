import React, { useState } from 'react';
import { Search } from 'lucide-react';

const subModules = ['Daycare Dues', 'Daycare Bill', 'Daycare Collection', 'Inves Dues', 'Inves Bill', 'Inves Collection', 'OPD Coll/Dues', 'Birth Reg', 'Followup', 'Follow Manual', 'UHID Update', 'OPD Prescription', 'App', 'Inv Consolidated', 'OPD Claim', 'DayCare Claim', 'Inv. Claim'];

const daycareDues = [
  { sno: 1, billNo: 'DC-101', uhid: 'U-201', name: 'Mr. Rajan Patel', doctor: 'Dr. Alok Mehta', tpa: '-', total: 5000, submitted: 3000, discount: 0, due: 2000, date: '15-Feb-2026' },
  { sno: 2, billNo: 'DC-102', uhid: 'U-202', name: 'Mrs. Savita Kumari', doctor: 'Dr. Priya Singh', tpa: 'CGHS', total: 8000, submitted: 8000, discount: 500, due: 0, date: '14-Feb-2026' },
];

const DayCare = () => {
  const [activeModule, setActiveModule] = useState('Daycare Dues');

  return (
    <div>
      {/* Sub modules grid */}
      <div className="grid grid-cols-9 gap-1 mb-3">
        {subModules.map(m => (
          <button key={m} onClick={() => setActiveModule(m)} className={`px-1 py-2 text-[10px] font-semibold text-center border border-border ${activeModule === m ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="hms-section-header">Daycare Dues Report</div>
      <div className="bg-card border border-border p-3 mb-2 flex items-center gap-3">
        <label className="hms-form-label">Date From:</label>
        <input type="date" className="hms-input" defaultValue="2026-02-15" />
        <label className="hms-form-label">Date To:</label>
        <input type="date" className="hms-input" defaultValue="2026-02-15" />
        <button className="hms-btn-primary">Submit</button>
        <button className="hms-btn-secondary">Reset</button>
      </div>

      <div className="flex gap-1 mb-2">
        {['Copy', 'CSV', 'PDF', 'PDF'].map((b, i) => (
          <button key={i} className="hms-btn-secondary text-[10px] px-2 py-1">{b}</button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <label className="hms-form-label">Search:</label>
          <input className="hms-input w-40" />
        </div>
      </div>

      <table className="hms-table">
        <thead>
          <tr><th>S.No.</th><th>Bill No.</th><th>UHID</th><th>Name</th><th>Doctor</th><th>TPA</th><th>Total (Rs)</th><th>Submitted</th><th>Discount</th><th>DUE</th><th>Entry Date</th></tr>
        </thead>
        <tbody>
          {daycareDues.map(d => (
            <tr key={d.sno}>
              <td>{d.sno}</td><td>{d.billNo}</td><td>{d.uhid}</td><td>{d.name}</td><td>{d.doctor}</td><td>{d.tpa}</td><td>{d.total.toFixed(2)}</td><td>{d.submitted.toFixed(2)}</td><td>{d.discount.toFixed(2)}</td><td>{d.due.toFixed(2)}</td><td>{d.date}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={6}></td><td className="font-bold">Total (INR)</td><td className="font-bold">11000.00</td><td></td><td className="font-bold">2000.00</td><td></td>
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground mt-1">Showing 1 to 2 of 2 entries</p>
    </div>
  );
};

export default DayCare;
