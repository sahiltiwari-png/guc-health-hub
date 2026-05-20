import React, { useState, useEffect } from 'react';
import { getBirths, extractArray } from "@/api/apiService";
import { Baby, Search, Printer, Eye, Plus, RefreshCw } from 'lucide-react';

const BirthReg = () => {
  const [births, setBirths] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBirths = async () => {
    setLoading(true);
    try {
      const res = await getBirths();
      if (res.ok) {
        setBirths(extractArray(res));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirths();
  }, []);

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Baby size={16} /> Birth Registration</div>
        <div className="flex items-center gap-2">
          <button className="hms-btn-secondary" onClick={fetchBirths}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
          <button className="hms-btn-primary">+ Register New Birth</button>
        </div>
      </div>

      <div className="bg-card border border-border p-3 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Mother Name:</label><input className="hms-input flex-1" /></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Father Name:</label><input className="hms-input flex-1" /></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">UHID:</label><input className="hms-input flex-1" /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Date of Birth:</label><input type="date" className="hms-input flex-1" /></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Time of Birth:</label><input type="time" className="hms-input flex-1" /></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Gender:</label><select className="hms-select flex-1"><option>Male</option><option>Female</option></select></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Weight (kg):</label><input className="hms-input flex-1" /></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Delivery Type:</label><select className="hms-select flex-1"><option>Normal</option><option>C-Section</option><option>Assisted</option></select></div>
          <div className="flex items-center gap-2"><label className="hms-form-label w-28">Doctor:</label><select className="hms-select flex-1"><option>Dr. Priya Singh</option><option>Dr. Neha Gupta</option></select></div>
        </div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Remarks:</label><textarea className="hms-input flex-1 h-16" /></div>
        <div className="flex justify-end gap-2"><button className="hms-btn-primary">Register</button><button className="hms-btn-secondary">Reset</button></div>
      </div>

      <div className="bg-card border border-border shadow-sm">
        <div className="hms-section-header text-xs">Recent Birth Records</div>
        <table className="hms-table">
          <thead>
            <tr>
              <th>Baby Name</th>
              <th>Mother</th>
              <th>Date/Time</th>
              <th>Gender</th>
              <th>Weight</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : births.length > 0 ? (
              births.map((b, i) => (
                <tr key={i}>
                  <td>{b.babyName || 'Baby of ' + b.motherName}</td>
                  <td>{b.motherName}</td>
                  <td>{new Date(b.dob).toLocaleDateString()} {b.tob}</td>
                  <td>{b.gender}</td>
                  <td>{b.weight} kg</td>
                  <td>
                    <div className="flex gap-2">
                      <Eye size={14} className="text-primary cursor-pointer" />
                      <Printer size={14} className="text-primary cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="text-center py-4 text-muted-foreground">No birth records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BirthReg;
