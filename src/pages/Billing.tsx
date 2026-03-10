import React, { useEffect, useState } from 'react';
import { Printer, Eye } from 'lucide-react';
import { getReceipts } from '../api/apiService';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({ totalBilled: 0, collected: 0, discount: 0, dues: 0 });

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await getReceipts();
        const data = response.data || [];
        setBills(data);

        // Calculate summary
        const totals = data.reduce((acc: any, b: any) => ({
          totalBilled: acc.totalBilled + (b.fee || 0),
          collected: acc.collected + (b.status === 'Paid' ? (b.fee || 0) : 0),
          discount: acc.discount + (b.discountAmount || 0),
          dues: acc.dues + (b.status === 'Pending' ? (b.fee || 0) : 0),
        }), { totalBilled: 0, collected: 0, discount: 0, dues: 0 });
        
        setSummary(totals);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };
    fetchBills();
  }, []);

  return (
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
          { label: 'Total Billed', value: `₹${summary.totalBilled.toLocaleString()}` },
          { label: 'Collected', value: `₹${summary.collected.toLocaleString()}` },
          { label: 'Discount', value: `₹${summary.discount.toLocaleString()}` },
          { label: 'Dues', value: `₹${summary.dues.toLocaleString()}` },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-2 text-center">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <table className="hms-table">
        <thead><tr><th>S.No.</th><th>Bill No.</th><th>UHID</th><th>Patient</th><th>Dept</th><th>Doctor</th><th>Charge</th><th>Discount</th><th>Paid</th><th>Status</th><th>Mode</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {bills.map((b: any, i) => (
            <tr key={b._id}>
              <td>{i + 1}</td>
              <td>{b.receiptNumber}</td>
              <td>{b.patientId?.uhid}</td>
              <td className="font-semibold">{b.patientId?.patientName}</td>
              <td>{b.departmentId?.name}</td>
              <td>{b.doctorId?.name}</td>
              <td>₹{b.fee?.toLocaleString()}</td>
              <td>₹{b.discountAmount?.toLocaleString() || 0}</td>
              <td>₹{b.status === 'Paid' ? b.fee?.toLocaleString() : 0}</td>
              <td><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${b.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.status}</span></td>
              <td>{b.paymentMode}</td>
              <td>{new Date(b.createdAt).toLocaleDateString()}</td>
              <td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Printer size={14} className="text-primary cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Billing;
