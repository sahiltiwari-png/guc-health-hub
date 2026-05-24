import React, { useState, useEffect } from 'react';
import { Car, RefreshCw } from 'lucide-react';
import { extractArray, getParkingEntries, getApiV1ParkingDashboard, getApiV1ParkingEntries } from "@/api/apiService";

const Parking = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchParking = async () => {
    setLoading(true);
    try {
      const [dashRes, entRes] = await Promise.all([
        getApiV1ParkingDashboard(),
        getApiV1ParkingEntries()
      ]);
      if (dashRes.ok) setDashboard(dashRes.data?.data || dashRes.data);
      if (entRes.ok) setEntries(extractArray(entRes));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchParking(); }, []);

  return (
  <div>
    <div className="hms-section-header flex items-center justify-between">
      <div className="flex items-center gap-2"><Car size={14} /> Parking Management</div>
      <button onClick={fetchParking} className="p-1 hover:bg-muted rounded text-primary">
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
      </button>
    </div>
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
        {entries.map((p, i) => (
          <tr key={p.id || i}><td>{i + 1}</td><td>{p.vehicleNo}</td><td>{p.type}</td><td>{p.owner}</td><td>{p.uhid}</td><td>{p.inTime}</td><td>{p.outTime}</td><td>₹{p.charges}</td>
            <td><span className={`px-2 py-0.5 text-[10px] font-bold ${p.status === 'Parked' ? 'bg-hms-info text-primary-foreground' : p.status === 'Exited' ? 'bg-muted' : p.status === 'Staff' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{p.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default Parking;
