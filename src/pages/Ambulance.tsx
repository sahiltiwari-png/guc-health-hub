import React, { useState } from 'react';
import { Truck, Phone, MapPin, Clock, CheckCircle2, AlertTriangle, XCircle, Users, Activity } from 'lucide-react';

const ambulanceFleet = [
  { id: 'AMB-001', type: 'ALS (Advanced Life Support)', driver: 'Raju Singh', phone: '9876543210', status: 'Available', location: 'Hospital Parking', lastService: '2024-12-15', km: '45,230' },
  { id: 'AMB-002', type: 'BLS (Basic Life Support)', driver: 'Mohan Lal', phone: '9876543211', status: 'On Trip', location: 'Sector 62, Noida', lastService: '2024-12-20', km: '38,120' },
  { id: 'AMB-003', type: 'ALS (Advanced Life Support)', driver: 'Suresh Yadav', phone: '9876543212', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-05', km: '52,800' },
  { id: 'AMB-004', type: 'Patient Transport', driver: 'Dinesh Kumar', phone: '9876543213', status: 'On Trip', location: 'Greater Noida', lastService: '2024-11-28', km: '61,400' },
  { id: 'AMB-005', type: 'BLS (Basic Life Support)', driver: 'Pappu Ram', phone: '9876543214', status: 'Maintenance', location: 'Service Center', lastService: '2025-01-10', km: '29,500' },
  { id: 'AMB-006', type: 'Neonatal Ambulance', driver: 'Amit Chauhan', phone: '9876543215', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-02', km: '18,900' },
  { id: 'AMB-007', type: 'ALS (Advanced Life Support)', driver: 'Vijay Pratap', phone: '9876543216', status: 'On Trip', location: 'Delhi - Lajpat Nagar', lastService: '2024-12-28', km: '67,100' },
  { id: 'AMB-008', type: 'Dead Body Van', driver: 'Ramesh Gupta', phone: '9876543217', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-08', km: '12,300' },
];

const recentTrips = [
  { id: 'TRP-1001', ambulance: 'AMB-002', patient: 'Ramesh Verma', from: 'Sector 62, Noida', to: 'GUC Hospital', time: '10:30 AM', status: 'In Progress', type: 'Emergency' },
  { id: 'TRP-1002', ambulance: 'AMB-004', patient: 'Sita Devi', from: 'Greater Noida', to: 'GUC Hospital', time: '09:45 AM', status: 'In Progress', type: 'Transfer' },
  { id: 'TRP-1003', ambulance: 'AMB-007', patient: 'Anil Kumar', from: 'Delhi - Lajpat Nagar', to: 'GUC Hospital', time: '09:15 AM', status: 'In Progress', type: 'Emergency' },
  { id: 'TRP-1004', ambulance: 'AMB-001', patient: 'Meera Kumari', from: 'GUC Hospital', to: 'AIIMS Delhi', time: '08:00 AM', status: 'Completed', type: 'Transfer' },
  { id: 'TRP-1005', ambulance: 'AMB-003', patient: 'Suraj Pal', from: 'Sector 18, Noida', to: 'GUC Hospital', time: '07:30 AM', status: 'Completed', type: 'Emergency' },
];

const statusColor = (s: string) => {
  if (s === 'Available') return 'bg-hms-success text-hms-success-foreground';
  if (s === 'On Trip' || s === 'In Progress') return 'bg-primary text-primary-foreground';
  if (s === 'Maintenance') return 'bg-destructive text-destructive-foreground';
  if (s === 'Completed') return 'bg-muted text-foreground';
  return 'bg-muted text-muted-foreground';
};

const Ambulance = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'fleet' | 'trips'>('fleet');

  const available = ambulanceFleet.filter(a => a.status === 'Available').length;
  const onTrip = ambulanceFleet.filter(a => a.status === 'On Trip').length;
  const maintenance = ambulanceFleet.filter(a => a.status === 'Maintenance').length;

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Truck size={16} /> Ambulance Management</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary">+ New Trip</button>
          <button className="hms-btn-secondary">+ Add Vehicle</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-2 my-2">
        <div className="bg-card border border-border p-2 text-center">
          <div className="text-lg font-bold">{ambulanceFleet.length}</div>
          <div className="text-[10px] text-muted-foreground">Total Fleet</div>
        </div>
        <div className="bg-card border border-border p-2 text-center">
          <div className="text-lg font-bold" style={{ color: 'hsl(var(--hms-success))' }}>{available}</div>
          <div className="text-[10px] text-muted-foreground">Available</div>
        </div>
        <div className="bg-card border border-border p-2 text-center">
          <div className="text-lg font-bold text-primary">{onTrip}</div>
          <div className="text-[10px] text-muted-foreground">On Trip</div>
        </div>
        <div className="bg-card border border-border p-2 text-center">
          <div className="text-lg font-bold text-destructive">{maintenance}</div>
          <div className="text-[10px] text-muted-foreground">Maintenance</div>
        </div>
        <div className="bg-card border border-border p-2 text-center">
          <div className="text-lg font-bold">{recentTrips.length}</div>
          <div className="text-[10px] text-muted-foreground">Today's Trips</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-card border-b border-border">
        <button onClick={() => setTab('fleet')} className={`px-4 py-2 text-xs font-semibold border-b-2 ${tab === 'fleet' ? 'border-primary text-primary bg-muted' : 'border-transparent text-muted-foreground'}`}>
          Fleet Overview
        </button>
        <button onClick={() => setTab('trips')} className={`px-4 py-2 text-xs font-semibold border-b-2 ${tab === 'trips' ? 'border-primary text-primary bg-muted' : 'border-transparent text-muted-foreground'}`}>
          Trip Log
        </button>
      </div>

      <div className="bg-card border border-border">
        {tab === 'fleet' ? (
          <table className="hms-table">
            <thead><tr>
              <th>Vehicle ID</th><th>Type</th><th>Driver</th><th>Phone</th><th>Status</th><th>Location</th><th>Last Service</th><th>KM</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {ambulanceFleet.filter(a => a.id.toLowerCase().includes(search.toLowerCase()) || a.driver.toLowerCase().includes(search.toLowerCase())).map(a => (
                <tr key={a.id}>
                  <td className="font-semibold">{a.id}</td>
                  <td className="text-[10px]">{a.type}</td>
                  <td>{a.driver}</td>
                  <td><div className="flex items-center gap-1"><Phone size={10} />{a.phone}</div></td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${statusColor(a.status)}`}>{a.status}</span></td>
                  <td><div className="flex items-center gap-1"><MapPin size={10} />{a.location}</div></td>
                  <td>{a.lastService}</td>
                  <td>{a.km}</td>
                  <td>
                    <button className="hms-btn-secondary text-[10px] mr-1">Track</button>
                    <button className="hms-btn-secondary text-[10px]">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="hms-table">
            <thead><tr>
              <th>Trip ID</th><th>Ambulance</th><th>Patient</th><th>From</th><th>To</th><th>Time</th><th>Type</th><th>Status</th>
            </tr></thead>
            <tbody>
              {recentTrips.map(t => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.id}</td>
                  <td>{t.ambulance}</td>
                  <td>{t.patient}</td>
                  <td><div className="flex items-center gap-1"><MapPin size={10} />{t.from}</div></td>
                  <td><div className="flex items-center gap-1"><MapPin size={10} />{t.to}</div></td>
                  <td>{t.time}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${t.type === 'Emergency' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-info text-primary-foreground'}`}>{t.type}</span></td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${statusColor(t.status)}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Ambulance;
