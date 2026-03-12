import React, { useState, useEffect } from 'react';
import { 
  Truck, Phone, MapPin, Clock, CheckCircle2, AlertTriangle, 
  XCircle, Users, Activity, Navigation, Radio, Fuel, Search,
  Plus, Edit, Trash2, Settings, History, Wrench, ShieldCheck,
  MoreVertical, Eye, Printer, Download, RefreshCw, X
} from 'lucide-react';
import { 
  listAmbulances, createAmbulance, updateAmbulance, deleteAmbulance,
  listAmbulanceTrips, createAmbulanceTrip,
  listAmbulanceMaintenances, createAmbulanceMaintenance,
  listPatients, listUsers
} from '../api/apiService';

const statusColor = (s: string) => {
  if (s === 'Available' || s === 'Active' || s === 'Completed') return 'bg-hms-success text-hms-success-foreground';
  if (s === 'On Trip' || s === 'In Progress' || s === 'OnWay' || s === 'Requested' || s === 'Dispatched') return 'bg-primary text-primary-foreground';
  if (s === 'Maintenance' || s === 'Cancelled' || s === 'Repair') return 'bg-destructive text-destructive-foreground';
  return 'bg-muted text-muted-foreground';
};

type Tab = 'fleet' | 'trips' | 'tracking' | 'alerts' | 'maintenance';

const tabs: { key: Tab; label: string }[] = [
  { key: 'fleet', label: 'Fleet Overview' },
  { key: 'trips', label: 'Trip Log' },
  { key: 'tracking', label: 'Real-Time Tracking' },
  { key: 'maintenance', label: 'Maintenance Log' },
  { key: 'alerts', label: 'GPS Alerts' },
];

const Ambulance = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('fleet');
  const [loading, setLoading] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());
  
  // Data States
  const [data, setData] = useState({
    ambulances: [],
    trips: [],
    maintenances: [],
    patients: [],
    drivers: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null); // 'vehicle' | 'trip' | 'maintenance'
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ambRes, tripsRes, maintRes, patientsRes, driversRes] = await Promise.all([
        listAmbulances(),
        listAmbulanceTrips(),
        listAmbulanceMaintenances(),
        listPatients({ limit: 100 }),
        listUsers({ role: 'Driver' }) // Assuming role filter works
      ]);

      setData({
        ambulances: ambRes || [],
        trips: tripsRes || [],
        maintenances: maintRes || [],
        patients: patientsRes.data || [],
        drivers: driversRes.data || []
      });
    } catch (error) {
      console.error('Error fetching ambulance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem._id) {
        await updateAmbulance(selectedItem._id, selectedItem);
      } else {
        await createAmbulance(selectedItem);
      }
      setShowModal(null);
      fetchData();
    } catch (error) {
      alert('Error saving ambulance');
    }
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find the ambulance to get its current driver
      const ambulance = data.ambulances.find((a: any) => a._id === selectedItem.ambulanceId);
      const tripData = {
        ...selectedItem,
        driverId: ambulance?.driverId?._id || ambulance?.driverId // Ensure we have a driver ID
      };
      
      await createAmbulanceTrip(tripData);
      setShowModal(null);
      fetchData();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Error creating trip request. Please ensure all fields are filled.');
    }
  };

  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAmbulanceMaintenance(selectedItem);
      setShowModal(null);
      fetchData();
    } catch (error) {
      alert('Error saving maintenance record');
    }
  };

  const handleDeleteAmbulance = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteAmbulance(id);
      fetchData();
    } catch (error) {
      alert('Error deleting ambulance');
    }
  };

  const available = data.ambulances.filter((a: any) => a.isActive).length;
  const onTrip = data.trips.filter((t: any) => ['Requested', 'Dispatched', 'OnWay'].includes(t.status)).length;
  const maintenance = data.maintenances.filter((m: any) => m.type === 'Repair').length;

  const renderFleet = () => (
    <div className="space-y-3">
      <table className="hms-table">
        <thead><tr>
          <th>Vehicle No</th><th>Type</th><th>Driver</th><th>Contact</th><th>Status</th><th>Last Maint.</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {data.ambulances.filter((a: any) => a.vehicleNumber.toLowerCase().includes(search.toLowerCase())).map((a: any) => (
            <tr key={a._id}>
              <td className="font-mono font-bold text-primary">{a.vehicleNumber}</td>
              <td><span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-bold uppercase">{a.type}</span></td>
              <td className="font-semibold">{a.driverId?.name || 'Unassigned'}</td>
              <td>{a.contactNumber || a.driverId?.phone || '-'}</td>
              <td>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColor(a.isActive ? 'Available' : 'Maintenance')}`}>
                  {a.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>{new Date(a.updatedAt).toLocaleDateString()}</td>
              <td>
                <div className="flex gap-2">
                  <button className="text-primary hover:bg-primary/10 p-1 rounded" onClick={() => { setSelectedItem(a); setShowModal('vehicle'); }}><Edit size={14} /></button>
                  <button className="text-destructive hover:bg-destructive/10 p-1 rounded" onClick={() => handleDeleteAmbulance(a._id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
          {data.ambulances.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground italic">No vehicles found in fleet</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderTrips = () => (
    <div className="space-y-3">
      <table className="hms-table">
        <thead><tr>
          <th>Trip ID</th><th>Vehicle</th><th>Patient</th><th>From</th><th>To</th><th>Type</th><th>Status</th><th>Time</th><th>Actions</th>
        </tr></thead>
        <tbody>
          {data.trips.map((t: any) => (
            <tr key={t._id}>
              <td className="font-mono text-[10px]">{t._id.slice(-6).toUpperCase()}</td>
              <td className="font-bold">{t.ambulanceId?.vehicleNumber}</td>
              <td className="font-semibold">{t.patientId?.patientName || t.patientId?.name || 'Unknown'}</td>
              <td className="text-[10px] max-w-[150px] truncate">{t.fromLocation}</td>
              <td className="text-[10px] max-w-[150px] truncate">{t.toLocation}</td>
              <td><span className="text-[9px] border border-border px-1 py-0.5 rounded uppercase">{t.tripType}</span></td>
              <td><span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColor(t.status)}`}>{t.status}</span></td>
              <td className="text-[10px]">{new Date(t.requestedAt).toLocaleString()}</td>
              <td>
                <div className="flex gap-2">
                  <button className="text-primary hover:bg-primary/10 p-1 rounded" title="Update Status"><RefreshCw size={14} /></button>
                  <button className="text-muted-foreground hover:bg-muted p-1 rounded"><Printer size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
          {data.trips.length === 0 && <tr><td colSpan={9} className="text-center py-10 text-muted-foreground italic">No trip history records</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-3">
      <table className="hms-table">
        <thead><tr>
          <th>Date</th><th>Vehicle</th><th>Type</th><th>Description</th><th>Cost</th><th>Performed By</th>
        </tr></thead>
        <tbody>
          {data.maintenances.map((m: any) => (
            <tr key={m._id}>
              <td>{new Date(m.maintenanceDate).toLocaleDateString()}</td>
              <td className="font-bold">{m.ambulanceId?.vehicleNumber}</td>
              <td><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColor(m.type)}`}>{m.type}</span></td>
              <td className="text-[10px] max-w-[200px]">{m.description}</td>
              <td className="font-mono font-bold text-hms-success">₹{m.cost.toLocaleString()}</td>
              <td>{m.performedBy?.name || 'Staff'}</td>
            </tr>
          ))}
          {data.maintenances.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground italic">No maintenance records</td></tr>}
        </tbody>
      </table>
    </div>
  );

  const renderTracking = () => (
    <div className="p-4 bg-muted/10 min-h-[500px]">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 space-y-4">
          <div className="bg-card border border-border p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2"><Navigation size={14} className="text-primary" /> Live Fleet Status</h3>
            <div className="grid grid-cols-3 gap-3">
              {data.ambulances.map((a: any) => (
                <div key={a._id} className="border border-border p-3 rounded hover:border-primary transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-primary/10 p-2 rounded"><Truck size={18} className="text-primary" /></div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColor(a.isActive ? 'Available' : 'Maintenance')}`}>
                      {a.isActive ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold font-mono">{a.vehicleNumber}</h4>
                  <p className="text-[10px] text-muted-foreground mb-2">{a.type} Support</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Users size={10} /> {a.driverId?.name || 'N/A'}</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1"><MapPin size={10} /> Hospital Base</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <div className="bg-card border border-border p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2"><Clock size={14} className="text-hms-info" /> Active Requests</h3>
            <div className="space-y-2">
              {data.trips.filter((t: any) => t.status !== 'Completed' && t.status !== 'Cancelled').map((t: any) => (
                <div key={t._id} className="bg-primary/5 border-l-2 border-primary p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[9px] font-bold">#{t._id.slice(-4).toUpperCase()}</span>
                    <span className="text-[8px] bg-primary text-white px-1 py-0.5 rounded uppercase font-bold">{t.status}</span>
                  </div>
                  <p className="text-[10px] font-bold">{t.patientId?.patientName}</p>
                  <p className="text-[9px] text-muted-foreground">{t.fromLocation} → {t.toLocation}</p>
                </div>
              ))}
              {data.trips.filter((t: any) => t.status !== 'Completed' && t.status !== 'Cancelled').length === 0 && (
                <p className="text-[10px] text-center text-muted-foreground italic py-4">No active trips</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Truck size={16} /> Ambulance Management System</div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-hms-success text-hms-success-foreground px-2 py-0.5 flex items-center gap-1"><Radio size={10} className="animate-pulse" /> LIVE {liveTime.toLocaleTimeString('en-IN')}</span>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search vehicle..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => { setSelectedItem({ vehicleNumber: '', type: 'Basic', contactNumber: '', isActive: true }); setShowModal('vehicle'); }}><Plus size={14} /> Add Vehicle</button>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => { 
            setSelectedItem({ 
              ambulanceId: '', 
              patientId: '', 
              visitId: '', 
              fromLocation: 'Hospital Base', 
              toLocation: '', 
              tripType: 'Emergency' 
            }); 
            setShowModal('trip'); 
          }}><Navigation size={14} /> New Trip</button>
          <button className="hms-btn-secondary flex items-center gap-1" onClick={() => { 
            setSelectedItem({ 
              ambulanceId: '', 
              type: 'Routine', 
              description: '', 
              cost: 0,
              maintenanceDate: new Date().toISOString().split('T')[0]
            }); 
            setShowModal('maintenance'); 
          }}><Wrench size={14} /> Maint.</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'Total Fleet', value: data.ambulances.length, icon: Truck, color: 'text-primary' },
          { label: 'Available', value: available, icon: CheckCircle2, color: 'text-hms-success' },
          { label: 'On Trip', value: onTrip, icon: Activity, color: 'text-hms-info' },
          { label: 'Maintenance', value: maintenance, icon: Wrench, color: 'text-destructive' },
          { label: 'Total Trips', value: data.trips.length, icon: History, color: 'text-muted-foreground' },
          { label: 'Avg Speed', value: '42 km/h', icon: Navigation, color: 'text-primary' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-3 flex items-center gap-3 shadow-sm">
            <div className={`p-2 rounded-full bg-muted/20 ${k.color}`}><k.icon size={18} /></div>
            <div>
              <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
              <div className="text-[9px] font-bold uppercase text-muted-foreground">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border bg-card">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
            {t.key === 'fleet' && <Truck size={13} />}
            {t.key === 'trips' && <History size={13} />}
            {t.key === 'tracking' && <Navigation size={13} />}
            {t.key === 'maintenance' && <Wrench size={13} />}
            {t.key === 'alerts' && <AlertTriangle size={13} />}
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 flex-col gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-muted-foreground">Syncing Ambulance Data...</span>
          </div>
        ) : (
          <>
            {tab === 'fleet' && renderFleet()}
            {tab === 'trips' && renderTrips()}
            {tab === 'maintenance' && renderMaintenance()}
            {tab === 'tracking' && renderTracking()}
            {tab === 'alerts' && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground italic">
                <AlertTriangle size={48} className="mb-2 opacity-20" />
                <p>No active GPS alerts detected in the system.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Vehicle Modal */}
      {showModal === 'vehicle' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Truck size={16} className="text-primary" /> {selectedItem?._id ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveAmbulance} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Vehicle Number</label>
                  <input className="hms-input w-full font-mono" required value={selectedItem?.vehicleNumber} onChange={e => setSelectedItem({...selectedItem, vehicleNumber: e.target.value})} placeholder="DL-01-AMB-1234" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Vehicle Type</label>
                  <select className="hms-select w-full" value={selectedItem?.type} onChange={e => setSelectedItem({...selectedItem, type: e.target.value})}>
                    <option value="Basic">Basic Life Support</option>
                    <option value="Advanced">Advanced Life Support</option>
                    <option value="ICU">ICU Ambulance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Assign Driver</label>
                <select className="hms-select w-full" value={selectedItem?.driverId?._id || selectedItem?.driverId} onChange={e => setSelectedItem({...selectedItem, driverId: e.target.value})}>
                  <option value="">-- Select Driver --</option>
                  {data.drivers.map((d: any) => <option key={d._id} value={d._id}>{d.name} ({d.phone})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Direct Contact Number</label>
                <input className="hms-input w-full" value={selectedItem?.contactNumber} onChange={e => setSelectedItem({...selectedItem, contactNumber: e.target.value})} placeholder="Emergency contact..." />
              </div>
              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" checked={selectedItem?.isActive} onChange={e => setSelectedItem({...selectedItem, isActive: e.target.checked})} id="amb-active" />
                <label htmlFor="amb-active" className="text-xs font-semibold">Mark as Active & Available</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trip Modal */}
      {showModal === 'trip' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Navigation size={16} className="text-primary" /> New Trip Request</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveTrip} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Select Ambulance</label>
                  <select className="hms-select w-full" required value={selectedItem?.ambulanceId} onChange={e => setSelectedItem({...selectedItem, ambulanceId: e.target.value})}>
                    <option value="">-- Select --</option>
                    {data.ambulances.filter((a: any) => a.isActive).map((a: any) => <option key={a._id} value={a._id}>{a.vehicleNumber} ({a.type})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Trip Type</label>
                  <select className="hms-select w-full" value={selectedItem?.tripType} onChange={e => setSelectedItem({...selectedItem, tripType: e.target.value})}>
                    <option value="Emergency">Emergency</option>
                    <option value="Routine">Routine</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Select Patient</label>
                <select className="hms-select w-full" required value={selectedItem?.patientId} onChange={e => {
                  const patient = data.patients.find((p: any) => p._id === e.target.value);
                  setSelectedItem({...selectedItem, patientId: e.target.value, visitId: patient?.currentVisitId || '65f1a2b3c4d5e6f7a8b9c0d1'}); // Mock visit if not found
                }}>
                  <option value="">-- Select Patient --</option>
                  {data.patients.map((p: any) => <option key={p._id} value={p._id}>{p.patientName} ({p.patientID})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">From Location</label>
                  <input className="hms-input w-full" required value={selectedItem?.fromLocation} onChange={e => setSelectedItem({...selectedItem, fromLocation: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">To Location</label>
                  <input className="hms-input w-full" required value={selectedItem?.toLocation} onChange={e => setSelectedItem({...selectedItem, toLocation: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Dispatch Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showModal === 'maintenance' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Wrench size={16} className="text-primary" /> Log Maintenance</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveMaintenance} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Select Vehicle</label>
                  <select className="hms-select w-full" required value={selectedItem?.ambulanceId} onChange={e => setSelectedItem({...selectedItem, ambulanceId: e.target.value})}>
                    <option value="">-- Select --</option>
                    {data.ambulances.map((a: any) => <option key={a._id} value={a._id}>{a.vehicleNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Type</label>
                  <select className="hms-select w-full" value={selectedItem?.type} onChange={e => setSelectedItem({...selectedItem, type: e.target.value})}>
                    <option value="Routine">Routine Service</option>
                    <option value="Repair">Repair</option>
                    <option value="Accident">Accident Repair</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Cost (₹)</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem?.cost} onChange={e => setSelectedItem({...selectedItem, cost: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.maintenanceDate} onChange={e => setSelectedItem({...selectedItem, maintenanceDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Description</label>
                <textarea className="hms-input w-full h-20" required value={selectedItem?.description} onChange={e => setSelectedItem({...selectedItem, description: e.target.value})} placeholder="Describe the work done..." />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ambulance;

