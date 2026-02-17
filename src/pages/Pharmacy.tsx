import React from 'react';
import { Eye, Edit } from 'lucide-react';

const medicines = [
  { sno: 1, prescId: 'RX-001', uhid: 'U-1001', name: 'Mr. Rajesh Kumar', doctor: 'Dr. Alok Mehta', date: '15-Feb-2026', items: 3, total: 450, status: 'Dispensed' },
  { sno: 2, prescId: 'RX-002', uhid: 'U-1002', name: 'Mrs. Sunita Devi', doctor: 'Dr. Priya Singh', date: '15-Feb-2026', items: 5, total: 1200, status: 'Pending' },
  { sno: 3, prescId: 'RX-003', uhid: 'U-1003', name: 'Mr. Amit Sharma', doctor: 'Dr. Rahul Verma', date: '15-Feb-2026', items: 2, total: 300, status: 'Pending' },
];

const stockAlerts = [
  { name: 'Paracetamol 500mg', stock: 12, minStock: 50, expiry: '30-Mar-2026' },
  { name: 'Amoxicillin 250mg', stock: 8, minStock: 30, expiry: '15-Apr-2026' },
  { name: 'Cetrizine 10mg', stock: 5, minStock: 20, expiry: '28-Feb-2026' },
];

const Pharmacy = () => (
  <div>
    <div className="hms-section-header">Pharmacy Management</div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <h3 className="text-sm font-semibold mb-1">Prescriptions</h3>
        <table className="hms-table">
          <thead><tr><th>S.No.</th><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {medicines.map(m => (
              <tr key={m.sno}><td>{m.sno}</td><td>{m.prescId}</td><td>{m.uhid}</td><td>{m.name}</td><td>{m.doctor}</td><td>{m.date}</td><td>{m.items}</td><td>₹{m.total}</td>
                <td><span className={`px-2 py-0.5 text-[10px] font-bold ${m.status === 'Dispensed' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{m.status}</span></td>
                <td><Eye size={14} className="text-primary cursor-pointer" /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1">Low Stock Alerts</h3>
        <table className="hms-table">
          <thead><tr><th>Medicine</th><th>Current Stock</th><th>Min Stock</th><th>Expiry</th></tr></thead>
          <tbody>
            {stockAlerts.map((s, i) => (
              <tr key={i} className="text-destructive font-semibold"><td>{s.name}</td><td>{s.stock}</td><td>{s.minStock}</td><td>{s.expiry}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default Pharmacy;
