import React, { useState, useEffect } from 'react';
import { getBillingInvoices, extractArray } from "@/api/apiService";
import { Receipt, Search, Printer, Eye, Download, Filter, RefreshCw } from 'lucide-react';

const Billing = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await getBillingInvoices();
      if (res.ok) {
        setBills(extractArray(res));
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter(b => 
    b.receiptNo?.toLowerCase().includes(search.toLowerCase()) || 
    b.patientId?.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={16} />
          Billing & Receipts
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              className="hms-input pl-8 w-64"
              placeholder="Search receipt or patient..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="hms-btn-secondary" onClick={fetchBills}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-primary">+ Create New Bill</button>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <table className="hms-table">
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Patient</th>
              <th>UHID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8">Loading receipts...</td></tr>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-[10px] font-bold">{b.receiptNo}</td>
                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="font-semibold">{b.patientId?.patientName || 'Walk-in'}</td>
                  <td>{b.patientId?.uhid || '-'}</td>
                  <td className="font-bold">₹{b.amount?.toLocaleString()}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      b.status === 'Paid' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning text-foreground'
                    }`}>
                      {b.status || 'Paid'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Eye size={14} className="text-primary cursor-pointer hover:opacity-80" />
                      <Printer size={14} className="text-primary cursor-pointer hover:opacity-80" />
                      <Download size={14} className="text-primary cursor-pointer hover:opacity-80" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No receipts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Billing;
