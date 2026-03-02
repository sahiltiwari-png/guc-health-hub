import React, { useState, useEffect } from 'react';
import { Truck, Phone, MapPin, Clock, CheckCircle2, AlertTriangle, XCircle, Users, Activity, Navigation, Radio, Fuel } from 'lucide-react';

const ambulanceFleet = [
  { id: 'AMB-001', type: 'ALS (Advanced Life Support)', driver: 'Raju Singh', phone: '9876543210', status: 'Available', location: 'Hospital Parking', lastService: '2024-12-15', km: '45,230', fuel: 85, lat: '28.5855', lng: '77.3100', speed: 0 },
  { id: 'AMB-002', type: 'BLS (Basic Life Support)', driver: 'Mohan Lal', phone: '9876543211', status: 'On Trip', location: 'Sector 62, Noida', lastService: '2024-12-20', km: '38,120', fuel: 62, lat: '28.6273', lng: '77.3654', speed: 45 },
  { id: 'AMB-003', type: 'ALS (Advanced Life Support)', driver: 'Suresh Yadav', phone: '9876543212', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-05', km: '52,800', fuel: 90, lat: '28.5855', lng: '77.3100', speed: 0 },
  { id: 'AMB-004', type: 'Patient Transport', driver: 'Dinesh Kumar', phone: '9876543213', status: 'On Trip', location: 'Greater Noida', lastService: '2024-11-28', km: '61,400', fuel: 45, lat: '28.4744', lng: '77.5040', speed: 35 },
  { id: 'AMB-005', type: 'BLS (Basic Life Support)', driver: 'Pappu Ram', phone: '9876543214', status: 'Maintenance', location: 'Service Center', lastService: '2025-01-10', km: '29,500', fuel: 20, lat: '28.5700', lng: '77.3200', speed: 0 },
  { id: 'AMB-006', type: 'Neonatal Ambulance', driver: 'Amit Chauhan', phone: '9876543215', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-02', km: '18,900', fuel: 78, lat: '28.5855', lng: '77.3100', speed: 0 },
  { id: 'AMB-007', type: 'ALS (Advanced Life Support)', driver: 'Vijay Pratap', phone: '9876543216', status: 'On Trip', location: 'Delhi - Lajpat Nagar', lastService: '2024-12-28', km: '67,100', fuel: 55, lat: '28.5700', lng: '77.2400', speed: 60 },
  { id: 'AMB-008', type: 'Dead Body Van', driver: 'Ramesh Gupta', phone: '9876543217', status: 'Available', location: 'Hospital Parking', lastService: '2025-01-08', km: '12,300', fuel: 95, lat: '28.5855', lng: '77.3100', speed: 0 },
];

const recentTrips = [
  { id: 'TRP-1001', ambulance: 'AMB-002', patient: 'Ramesh Verma', from: 'Sector 62, Noida', to: 'GUC Hospital', time: '10:30 AM', eta: '12 min', distance: '8.5 km', status: 'In Progress', type: 'Emergency' },
  { id: 'TRP-1002', ambulance: 'AMB-004', patient: 'Sita Devi', from: 'Greater Noida', to: 'GUC Hospital', time: '09:45 AM', eta: '25 min', distance: '22 km', status: 'In Progress', type: 'Transfer' },
  { id: 'TRP-1003', ambulance: 'AMB-007', patient: 'Anil Kumar', from: 'Delhi - Lajpat Nagar', to: 'GUC Hospital', time: '09:15 AM', eta: '18 min', distance: '15 km', status: 'In Progress', type: 'Emergency' },
  { id: 'TRP-1004', ambulance: 'AMB-001', patient: 'Meera Kumari', from: 'GUC Hospital', to: 'AIIMS Delhi', time: '08:00 AM', eta: '-', distance: '28 km', status: 'Completed', type: 'Transfer' },
  { id: 'TRP-1005', ambulance: 'AMB-003', patient: 'Suraj Pal', from: 'Sector 18, Noida', to: 'GUC Hospital', time: '07:30 AM', eta: '-', distance: '5.2 km', status: 'Completed', type: 'Emergency' },
];

const gpsAlerts = [
  { time: '10:32 AM', vehicle: 'AMB-002', alert: 'Approaching destination — ETA 12 min', severity: 'info' },
  { time: '10:28 AM', vehicle: 'AMB-007', alert: 'Exceeded speed limit (60 km/h in 40 zone)', severity: 'warning' },
  { time: '10:15 AM', vehicle: 'AMB-004', alert: 'Fuel level below 50%', severity: 'warning' },
  { time: '10:05 AM', vehicle: 'AMB-002', alert: 'Route deviation detected — recalculating', severity: 'warning' },
  { time: '09:50 AM', vehicle: 'AMB-005', alert: 'Engine diagnostic: Service overdue', severity: 'critical' },
  { time: '09:30 AM', vehicle: 'AMB-007', alert: 'Trip started — Emergency pickup', severity: 'info' },
  { time: '09:15 AM', vehicle: 'AMB-002', alert: 'Trip started — Emergency pickup', severity: 'info' },
];

const statusColor = (s: string) => {
  if (s === 'Available') return 'bg-hms-success text-hms-success-foreground';
  if (s === 'On Trip' || s === 'In Progress') return 'bg-primary text-primary-foreground';
  if (s === 'Maintenance') return 'bg-destructive text-destructive-foreground';
  if (s === 'Completed') return 'bg-muted text-foreground';
  return 'bg-muted text-muted-foreground';
};

type Tab = 'fleet' | 'trips' | 'tracking' | 'alerts' | 'maintenance';

const tabs: { key: Tab; label: string }[] = [
  { key: 'fleet', label: 'Fleet Overview' },
  { key: 'trips', label: 'Trip Log' },
  { key: 'tracking', label: 'Real-Time Tracking' },
  { key: 'alerts', label: 'GPS Alerts' },
  { key: 'maintenance', label: 'Maintenance Log' },
];

const Ambulance = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('tracking');
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const available = ambulanceFleet.filter(a => a.status === 'Available').length;
  const onTrip = ambulanceFleet.filter(a => a.status === 'On Trip').length;
  const maintenance = ambulanceFleet.filter(a => a.status === 'Maintenance').length;

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Truck size={16} /> Ambulance Management & Real-Time Tracking</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-hms-success text-hms-success-foreground px-2 py-0.5 flex items-center gap-1"><Radio size={10} className="animate-pulse" /> LIVE {liveTime.toLocaleTimeString('en-IN')}</span>
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary">+ New Trip</button>
          <button className="hms-btn-secondary">+ Add Vehicle</button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-7 gap-1 my-1">
        {[
          { label: 'Total Fleet', value: ambulanceFleet.length },
          { label: 'Available', value: available, color: '' },
          { label: 'On Trip', value: onTrip, color: 'text-primary' },
          { label: 'Maintenance', value: maintenance, color: 'text-destructive' },
          { label: "Today's Trips", value: recentTrips.length },
          { label: 'Active Alerts', value: gpsAlerts.filter(a => a.severity !== 'info').length, color: 'text-destructive' },
          { label: 'Avg Response', value: '8 min' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-1.5 text-center">
            <div className={`text-lg font-bold ${k.color || ''}`}>{k.value}</div>
            <div className="text-[9px] text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-primary overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${tab === t.key ? 'bg-card text-foreground' : 'text-primary-foreground hover:bg-primary-foreground/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border">
        {tab === 'tracking' && (
          <div className="p-2">
            <div className="grid grid-cols-3 gap-2">
              {/* Live Vehicle Status Panel */}
              <div className="col-span-2">
                <div className="text-xs font-bold mb-1 flex items-center gap-1"><Navigation size={12} /> Live Vehicle Positions</div>
                <div className="border border-border bg-muted/30 p-2" style={{ minHeight: 300 }}>
                  {/* Simulated map grid */}
                  <div className="grid grid-cols-4 gap-1">
                    {ambulanceFleet.map(a => (
                      <div key={a.id} className={`border p-1.5 text-[10px] ${a.status === 'On Trip' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold">{a.id}</span>
                          <span className={`px-1 py-0.5 ${statusColor(a.status)}`}>{a.status}</span>
                        </div>
                        <div className="text-muted-foreground">{a.driver}</div>
                        <div className="flex items-center gap-0.5"><MapPin size={8} />{a.location}</div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="flex items-center gap-0.5"><Activity size={8} />{a.speed} km/h</span>
                          <span className="flex items-center gap-0.5"><Fuel size={8} />{a.fuel}%</span>
                        </div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">GPS: {a.lat}°N, {a.lng}°E</div>
                        {a.status === 'On Trip' && (
                          <div className="mt-1">
                            <div className="w-full bg-muted h-1"><div className="bg-primary h-1" style={{ width: `${60 + Math.random() * 30}%` }}></div></div>
                            <div className="text-[9px] text-primary font-semibold mt-0.5">
                              ETA: {recentTrips.find(t => t.ambulance === a.id)?.eta || '-'}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Trips Sidebar */}
              <div>
                <div className="text-xs font-bold mb-1 flex items-center gap-1"><Clock size={12} /> Active Trips</div>
                <div className="space-y-1">
                  {recentTrips.filter(t => t.status === 'In Progress').map(t => (
                    <div key={t.id} className="border border-primary p-1.5 text-[10px] bg-primary/5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold">{t.id}</span>
                        <span className={`px-1 py-0.5 ${t.type === 'Emergency' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-info text-primary-foreground'}`}>{t.type}</span>
                      </div>
                      <div><strong>Vehicle:</strong> {t.ambulance}</div>
                      <div><strong>Patient:</strong> {t.patient}</div>
                      <div className="flex items-center gap-0.5"><MapPin size={8} />{t.from} → {t.to}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span><strong>Distance:</strong> {t.distance}</span>
                        <span className="text-primary font-bold">ETA: {t.eta}</span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        <button className="hms-btn-primary text-[9px] py-0.5 px-1.5">Track</button>
                        <button className="hms-btn-secondary text-[9px] py-0.5 px-1.5">Call Driver</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-bold mt-2 mb-1 flex items-center gap-1"><AlertTriangle size={12} /> Recent Alerts</div>
                <div className="space-y-0.5">
                  {gpsAlerts.slice(0, 4).map((a, i) => (
                    <div key={i} className={`text-[10px] px-1.5 py-1 border-l-2 ${a.severity === 'critical' ? 'border-destructive bg-destructive/5' : a.severity === 'warning' ? 'border-hms-warning bg-hms-warning/5' : 'border-hms-info bg-hms-info/5'}`}>
                      <span className="font-semibold">{a.time}</span> [{a.vehicle}] {a.alert}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'fleet' && (
          <table className="hms-table">
            <thead><tr>
              <th>Vehicle ID</th><th>Type</th><th>Driver</th><th>Phone</th><th>Status</th><th>Location</th><th>Speed</th><th>Fuel</th><th>Last Service</th><th>KM</th><th>Actions</th>
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
                  <td>{a.speed} km/h</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="w-12 bg-muted h-1.5"><div className={`h-1.5 ${a.fuel > 50 ? 'bg-hms-success' : a.fuel > 25 ? 'bg-hms-warning' : 'bg-destructive'}`} style={{ width: `${a.fuel}%` }}></div></div>
                      <span className="text-[10px]">{a.fuel}%</span>
                    </div>
                  </td>
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
        )}

        {tab === 'trips' && (
          <table className="hms-table">
            <thead><tr>
              <th>Trip ID</th><th>Ambulance</th><th>Patient</th><th>From</th><th>To</th><th>Time</th><th>Distance</th><th>ETA</th><th>Type</th><th>Status</th>
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
                  <td>{t.distance}</td>
                  <td className={t.eta !== '-' ? 'text-primary font-bold' : ''}>{t.eta}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${t.type === 'Emergency' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-info text-primary-foreground'}`}>{t.type}</span></td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${statusColor(t.status)}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'alerts' && (
          <div className="p-2">
            <table className="hms-table">
              <thead><tr><th>Time</th><th>Vehicle</th><th>Alert</th><th>Severity</th></tr></thead>
              <tbody>
                {gpsAlerts.map((a, i) => (
                  <tr key={i}>
                    <td>{a.time}</td><td className="font-semibold">{a.vehicle}</td><td>{a.alert}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 ${a.severity === 'critical' ? 'bg-destructive text-destructive-foreground' : a.severity === 'warning' ? 'bg-hms-warning' : 'bg-hms-info text-primary-foreground'}`}>{a.severity.toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'maintenance' && (
          <table className="hms-table">
            <thead><tr><th>Vehicle</th><th>Type</th><th>Last Service</th><th>Next Service</th><th>KM at Service</th><th>Service Center</th><th>Cost (₹)</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { v: 'AMB-005', type: 'Full Service', last: '10-Jan-2026', next: '10-Apr-2026', km: '29,200', center: 'Tata Motors Noida', cost: '₹18,500', s: 'In Service' },
                { v: 'AMB-001', type: 'Oil Change', last: '15-Dec-2024', next: '15-Mar-2025', km: '44,800', center: 'Hospital Workshop', cost: '₹3,200', s: 'Completed' },
                { v: 'AMB-004', type: 'Tyre Replacement', last: '28-Nov-2024', next: '-', km: '60,000', center: 'MRF Tyre Center', cost: '₹12,000', s: 'Completed' },
                { v: 'AMB-007', type: 'AC Repair', last: '28-Dec-2024', next: '-', km: '66,500', center: 'Hospital Workshop', cost: '₹5,500', s: 'Completed' },
              ].map((m, i) => (
                <tr key={i}>
                  <td className="font-semibold">{m.v}</td><td>{m.type}</td><td>{m.last}</td><td>{m.next}</td><td>{m.km}</td><td>{m.center}</td><td>{m.cost}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${m.s === 'In Service' ? 'bg-hms-warning' : 'bg-hms-success text-hms-success-foreground'}`}>{m.s}</span></td>
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
