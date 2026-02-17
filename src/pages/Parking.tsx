import React from 'react';
import { Car } from 'lucide-react';

const parkingData = [
  { sno: 1, vehicleNo: 'UP-16-AB-1234', type: 'Car', owner: 'Mr. Rajesh Kumar', uhid: 'U-1001', inTime: '09:00 AM', outTime: '-', charges: 50, status: 'Parked' },
  { sno: 2, vehicleNo: 'DL-01-CD-5678', type: 'Bike', owner: 'Mr. Amit Sharma', uhid: 'U-1003', inTime: '09:30 AM', outTime: '-', charges: 20, status: 'Parked' },
  { sno: 3, vehicleNo: 'UP-14-EF-9012', type: 'Car', owner: 'Staff - Dr. Alok Mehta', uhid: '-', inTime: '08:00 AM', outTime: '-', charges: 0, status: 'Staff' },
  { sno: 4, vehicleNo: 'HR-26-GH-3456', type: 'Car', owner: 'Mrs. Sunita Devi', uhid: 'U-1002', inTime: '08:45 AM', outTime: '11:30 AM', charges: 50, status: 'Exited' },
  { sno: 5, vehicleNo: 'UP-16-IJ-7890', type: 'Ambulance', owner: 'Hospital', uhid: '-', inTime: '06:00 AM', outTime: '-', charges: 0, status: 'Reserved' },
];

const Parking = () => (
  <div>
    <div className="hms-section-header flex items-center gap-2"><Car size={14} /> Parking Management</div>
    <div className="grid grid-cols-4 gap-2 mb-3">
      {[
        { label: 'Total Slots', value: '100' },
        { label: 'Occupied', value: '67' },
        { label: 'Available', value: '33' },
        { label: 'Staff Parking', value: '15' },
      ].map((s, i) => (
        <div key={i} className="bg-card border border-border p-2 text-center">
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3">
      <label className="hms-form-label">Vehicle No:</label><input className="hms-input w-32" />
      <label className="hms-form-label">Type:</label><select className="hms-select"><option>All</option><option>Car</option><option>Bike</option><option>Ambulance</option></select>
      <button className="hms-btn-primary">Search</button>
      <button className="hms-btn-success ml-auto">+ New Entry</button>
    </div>

    <table className="hms-table">
      <thead><tr><th>S.No.</th><th>Vehicle No.</th><th>Type</th><th>Owner</th><th>UHID</th><th>In Time</th><th>Out Time</th><th>Charges</th><th>Status</th></tr></thead>
      <tbody>
        {parkingData.map(p => (
          <tr key={p.sno}><td>{p.sno}</td><td>{p.vehicleNo}</td><td>{p.type}</td><td>{p.owner}</td><td>{p.uhid}</td><td>{p.inTime}</td><td>{p.outTime}</td><td>₹{p.charges}</td>
            <td><span className={`px-2 py-0.5 text-[10px] font-bold ${p.status === 'Parked' ? 'bg-hms-info text-primary-foreground' : p.status === 'Exited' ? 'bg-muted' : p.status === 'Staff' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{p.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Parking;
