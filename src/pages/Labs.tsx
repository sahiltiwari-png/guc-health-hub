import React, { useState, useEffect } from 'react';
import { Eye, Printer, RefreshCw } from 'lucide-react';
import { extractArray, getLabs } from "@/api/apiService";

const Labs = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await getLabs();
      if (res.ok) {
        setResults(extractArray(res));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <span>Laboratory Management</span>
        <button onClick={fetchLabs} className="p-1 hover:bg-muted rounded text-primary">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3 text-xs">
        <label className="hms-form-label">Date:</label><input type="date" className="hms-input" defaultValue="2026-02-15" />
        <label className="hms-form-label">Department:</label><select className="hms-select"><option>All</option><option>Pathology</option><option>Biochemistry</option><option>Radiology</option><option>Microbiology</option></select>
        <label className="hms-form-label">Status:</label><select className="hms-select"><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select>
        <button className="hms-btn-primary">Search</button>
      </div>
      <table className="hms-table">
        <thead><tr><th>S.No.</th><th>Invoice No.</th><th>UHID</th><th>Patient Name</th><th>Test</th><th>Department</th><th>Ref Doctor</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={10} className="text-center py-4">Loading...</td></tr>
          ) : results.length > 0 ? (
            results.map((l, i) => (
              <tr key={l.id || i}>
                <td>{i + 1}</td>
                <td>{l.invoiceNo || l.id}</td>
                <td>{l.uhid}</td>
                <td className="font-bold">{l.patientName || l.name}</td>
                <td>{l.testName || l.test}</td>
                <td>{l.department || l.dept}</td>
                <td>{l.doctor || l.refDoctor}</td>
                <td>{l.date ? new Date(l.date).toLocaleDateString() : '-'}</td>
                <td><span className={`px-2 py-0.5 text-[10px] font-bold ${l.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : l.status === 'Pending' ? 'bg-hms-warning' : 'bg-hms-info text-primary-foreground'}`}>{l.status}</span></td>
                <td className="flex gap-1"><Eye size={14} className="text-primary cursor-pointer" /><Printer size={14} className="text-primary cursor-pointer" /></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={10} className="text-center py-4 text-muted-foreground">No lab results found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Labs;
