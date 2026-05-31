import React, { useState, useEffect } from 'react';
import { 
  Car, RefreshCw, Plus, Search, Trash2, Edit, LogIn, LogOut, 
  Settings, LayoutDashboard, ChevronLeft, ChevronRight, X,
  CheckCircle2, AlertCircle, Info, Clock, DollarSign, MapPin
} from 'lucide-react';
import { 
  extractArray, 
  getApiV1ParkingDashboard, 
  getApiV1ParkingEntries, 
  getApiV1ParkingEntriesByid,
  deleteApiV1ParkingEntriesByid,
  postApiV1ParkingEntriesIn,
  postApiV1ParkingEntriesOutByid,
  getApiV1ParkingSlots,
  postApiV1ParkingSlots,
  getApiV1ParkingSlotsByid,
  putApiV1ParkingSlotsByid,
  deleteApiV1ParkingSlotsByid
} from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 
    'AVAILABLE': 'bg-green-100 text-green-700 border-green-200',
    'OCCUPIED': 'bg-red-100 text-red-700 border-red-200',
    'RESERVED': 'bg-blue-100 text-blue-700 border-blue-200',
    'MAINTENANCE': 'bg-gray-100 text-gray-700 border-gray-200',
    'PARKED': 'bg-blue-100 text-blue-700 border-blue-200',
    'EXITED': 'bg-slate-100 text-slate-700 border-slate-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${c[status] || 'bg-muted text-foreground'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

const Parking = () => {
  const { toast } = useToast();
  const tabs = ['Dashboard', 'Vehicle Entries', 'Parking Slots'];
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [allSlots, setAllSlots] = useState<any[]>([]); // For dropdowns

  // Filter States
  const [entryFilters, setEntriesFilters] = useState({ search: '', status: '', page: 0, size: 10 });
  const [slotFilters, setSlotFilters] = useState({ search: '', status: '', page: 0, size: 10 });
  const [entryPages, setEntryPages] = useState(1);
  const [slotPages, setSlotPages] = useState(1);

  // Modal States
  const [showModal, setShowModal] = useState<'entry' | 'exit' | 'slot' | 'delete-entry' | 'delete-slot' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'Dashboard') {
        const res = await getApiV1ParkingDashboard();
        if (res.ok) setDashboardData(res.data?.data || res.data);
      } else if (tab === 'Vehicle Entries') {
        const res = await getApiV1ParkingEntries(entryFilters);
        if (res.ok) {
          const data = res.data?.data || res.data;
          setEntries(data.content || []);
          setEntryPages(data.totalPages || 1);
        }
      } else if (tab === 'Parking Slots') {
        const res = await getApiV1ParkingSlots(slotFilters);
        if (res.ok) {
          const data = res.data?.data || res.data;
          setSlots(data.content || []);
          setSlotPages(data.totalPages || 1);
        }
      }
      
      // Always fetch slots for modals
      const allSlotsRes = await getApiV1ParkingSlots({ size: 100, status: 'AVAILABLE' });
      if (allSlotsRes.ok) setAllSlots(extractArray(allSlotsRes));

    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to sync parking data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [tab, entryFilters.page, slotFilters.page]);

  const handleEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postApiV1ParkingEntriesIn(formData);
      if (res.ok) {
        toast({ title: 'Success', description: 'Vehicle entry recorded' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Check-in failed', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleExit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem?.id) return;
    setLoading(true);
    try {
      const res = await postApiV1ParkingEntriesOutByid(selectedItem.id, { charges: formData.charges || 0 });
      if (res.ok) {
        toast({ title: 'Success', description: 'Vehicle exit recorded' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Check-out failed', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleSlotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (selectedItem?.id) {
        res = await putApiV1ParkingSlotsByid(selectedItem.id, formData);
      } else {
        res = await postApiV1ParkingSlots(formData);
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Slot ${selectedItem ? 'updated' : 'added'} successfully` });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleDeleteEntry = async () => {
    if (!selectedItem?.id) return;
    setLoading(true);
    try {
      const res = await deleteApiV1ParkingEntriesByid(selectedItem.id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Record deleted' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  const handleDeleteSlot = async () => {
    if (!selectedItem?.id) return;
    setLoading(true);
    try {
      const res = await deleteApiV1ParkingSlotsByid(selectedItem.id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Slot deleted' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Car size={16} /> Hospital Parking Management</div>
        <button onClick={fetchData} className="p-1.5 hover:bg-muted rounded text-primary transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-0 border-b border-border bg-card overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === t ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Dashboard' && (
        <div className="space-y-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'Total Capacity', v: dashboardData?.totalSlots || 0, i: Car, c: 'text-primary' },
              { l: 'Available Now', v: dashboardData?.availableSlots || 0, i: CheckCircle2, c: 'text-hms-success' },
              { l: 'Currently Occupied', v: dashboardData?.occupiedSlots || 0, i: AlertCircle, c: 'text-hms-warning' },
              { l: 'Daily Revenue', v: `₹${dashboardData?.dailyRevenue || 0}`, i: DollarSign, c: 'text-emerald-600' }
            ].map((k, i) => (
              <div key={i} className="bg-card border border-border p-4 shadow-sm hover:border-primary/50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg bg-muted/50 ${k.c}`}><k.i size={20} /></div>
                </div>
                <div className="text-2xl font-black">{k.v}</div>
                <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">{k.l}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border shadow-sm overflow-hidden">
              <div className="hms-section-header text-xs bg-muted/20 border-b border-border">Zone Distribution</div>
              <div className="p-0 overflow-x-auto">
                <table className="hms-table">
                  <thead><tr><th>Zone</th><th>Floor</th><th>Type</th><th>Occupancy</th></tr></thead>
                  <tbody>
                    {dashboardData?.zoneStats?.map((z: any, i: number) => (
                      <tr key={i}>
                        <td className="font-bold">{z.zone}</td>
                        <td>{z.floor}</td>
                        <td className="text-[10px] font-medium">{z.vehicleType}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(z.occupied / z.total) * 100}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold">{z.occupied}/{z.total}</span>
                          </div>
                        </td>
                      </tr>
                    )) || <tr><td colSpan={4} className="text-center py-8 text-muted-foreground italic">No zone data synced</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-card border border-border shadow-sm overflow-hidden">
              <div className="hms-section-header text-xs bg-muted/20 border-b border-border">Vehicle Type Stats</div>
              <div className="p-4 grid grid-cols-3 gap-4">
                {['TWO_WHEELER', 'FOUR_WHEELER', 'AMBULANCE'].map(type => (
                  <div key={type} className="text-center p-3 bg-muted/10 border border-border rounded-sm">
                    <div className="text-xs font-bold text-muted-foreground uppercase mb-1">{type.replace('_', ' ')}</div>
                    <div className="text-xl font-black text-primary">{dashboardData?.typeStats?.[type] || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Vehicle Entries' && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-wrap gap-2 bg-muted/20 p-2 border border-border rounded-sm">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input className="hms-input pl-7 w-48" placeholder="Vehicle No..." value={entryFilters.search} onChange={e => setEntriesFilters({...entryFilters, search: e.target.value, page: 0})} />
            </div>
            <select className="hms-select text-[10px]" value={entryFilters.status} onChange={e => setEntriesFilters({...entryFilters, status: e.target.value, page: 0})}>
              <option value="">All Status</option>
              <option value="PARKED">Parked</option>
              <option value="EXITED">Exited</option>
            </select>
            <button className="hms-btn-primary ml-auto h-8 px-4 flex items-center gap-2 text-[10px] uppercase font-bold" onClick={() => { setFormData({ vehicleType: 'FOUR_WHEELER' }); setShowModal('entry'); }}>
              <LogIn size={14} /> Record Entry
            </button>
          </div>

          <div className="bg-card border border-border shadow-sm overflow-hidden">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Type</th>
                  <th>Slot</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Charges</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="font-bold text-primary">{e.vehicleNumber}</td>
                    <td className="text-[10px] font-medium uppercase">{e.vehicleType?.replace('_', ' ')}</td>
                    <td className="text-[10px]">
                      <div className="flex flex-col">
                        <span className="font-bold">{e.slot?.slotNumber}</span>
                        <span className="text-muted-foreground uppercase text-[8px]">{e.slot?.zone} - F{e.slot?.floor}</span>
                      </div>
                    </td>
                    <td className="text-[10px] font-medium">{new Date(e.entryTime).toLocaleString()}</td>
                    <td className="text-[10px] font-medium">{e.exitTime ? new Date(e.exitTime).toLocaleString() : '--'}</td>
                    <td className="font-mono text-[11px] font-bold">₹{e.charges || 0}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        {e.status === 'PARKED' && (
                          <button className="p-1 hover:bg-hms-warning/10 text-hms-warning rounded" onClick={() => { setSelectedItem(e); setFormData({ charges: 0 }); setShowModal('exit'); }} title="Record Exit">
                            <LogOut size={14} />
                          </button>
                        )}
                        <button className="p-1 hover:bg-destructive/10 text-destructive rounded" onClick={() => { setSelectedItem(e); setShowModal('delete-entry'); }} title="Delete Record">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground italic">No parking entries found</td></tr>
                )}
              </tbody>
            </table>
            
            <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {entryFilters.page + 1} of {entryPages}</span>
              <div className="flex gap-1">
                <button disabled={entryFilters.page === 0} onClick={() => setEntriesFilters({...entryFilters, page: entryFilters.page - 1})} className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"><ChevronLeft size={14} /></button>
                <button disabled={entryFilters.page >= entryPages - 1} onClick={() => setEntriesFilters({...entryFilters, page: entryFilters.page + 1})} className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Parking Slots' && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-wrap gap-2 bg-muted/20 p-2 border border-border rounded-sm">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input className="hms-input pl-7 w-48" placeholder="Slot Number..." value={slotFilters.search} onChange={e => setSlotFilters({...slotFilters, search: e.target.value, page: 0})} />
            </div>
            <select className="hms-select text-[10px]" value={slotFilters.status} onChange={e => setSlotFilters({...slotFilters, status: e.target.value, page: 0})}>
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <button className="hms-btn-primary ml-auto h-8 px-4 flex items-center gap-2 text-[10px] uppercase font-bold" onClick={() => { setSelectedItem(null); setFormData({ status: 'AVAILABLE', allowedVehicleType: 'FOUR_WHEELER' }); setShowModal('slot'); }}>
              <Plus size={14} /> Add Slot
            </button>
          </div>

          <div className="bg-card border border-border shadow-sm overflow-hidden">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Slot No.</th>
                  <th>Zone</th>
                  <th>Floor</th>
                  <th>Type Allowed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(s => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="font-bold text-primary">{s.slotNumber}</td>
                    <td className="font-medium">{s.zone}</td>
                    <td className="text-[10px] font-bold">F{s.floor}</td>
                    <td className="text-[10px] font-medium uppercase">{s.allowedVehicleType?.replace('_', ' ')}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-primary/10 text-primary rounded" onClick={() => { setSelectedItem(s); setFormData(s); setShowModal('slot'); }} title="Edit Slot">
                          <Edit size={14} />
                        </button>
                        <button className="p-1 hover:bg-destructive/10 text-destructive rounded" onClick={() => { setSelectedItem(s); setShowModal('delete-slot'); }} title="Delete Slot">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {slots.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground italic">No parking slots configured</td></tr>
                )}
              </tbody>
            </table>
            
            <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {slotFilters.page + 1} of {slotPages}</span>
              <div className="flex gap-1">
                <button disabled={slotFilters.page === 0} onClick={() => setSlotFilters({...slotFilters, page: slotFilters.page - 1})} className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"><ChevronLeft size={14} /></button>
                <button disabled={slotFilters.page >= slotPages - 1} onClick={() => setSlotFilters({...slotFilters, page: slotFilters.page + 1})} className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showModal === 'entry' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><LogIn size={16} className="text-primary" /> Vehicle Check-In</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleEntry} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Car size={10} /> Vehicle Number</label>
                <input className="hms-input w-full font-black uppercase" required placeholder="e.g. MH 12 AB 1234" value={formData.vehicleNumber || ''} onChange={e => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Vehicle Type</label>
                  <select className="hms-select w-full" value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}>
                    <option value="FOUR_WHEELER">4 Wheeler (Car)</option>
                    <option value="TWO_WHEELER">2 Wheeler (Bike)</option>
                    <option value="AMBULANCE">Ambulance</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><MapPin size={10} /> Assign Slot</label>
                  <select className="hms-select w-full font-bold" required value={formData.slotId} onChange={e => setFormData({...formData, slotId: e.target.value})}>
                    <option value="">Select Available...</option>
                    {allSlots.map(s => <option key={s.id} value={s.id}>{s.slotNumber} ({s.zone})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 font-bold uppercase" disabled={loading}>Record Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'exit' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><LogOut size={16} className="text-hms-warning" /> Vehicle Check-Out</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleExit} className="p-4 space-y-4">
              <div className="text-center p-3 bg-muted/20 border border-dashed border-border rounded-sm">
                <div className="text-[10px] font-bold text-muted-foreground uppercase">Exiting Vehicle</div>
                <div className="text-xl font-black text-primary">{selectedItem?.vehicleNumber}</div>
                <div className="text-[9px] font-medium text-muted-foreground mt-1">In Time: {new Date(selectedItem?.entryTime).toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><DollarSign size={10} /> Parking Charges (₹)</label>
                <input type="number" className="hms-input w-full font-mono text-lg font-bold" required value={formData.charges} onChange={e => setFormData({...formData, charges: parseFloat(e.target.value)})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 font-bold uppercase bg-hms-warning border-hms-warning-foreground" disabled={loading}>Confirm Exit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'slot' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                {selectedItem ? <Edit size={16} className="text-primary" /> : <Plus size={16} className="text-primary" />}
                {selectedItem ? 'Edit Parking Slot' : 'Add New Slot'}
              </h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSlotSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Slot Number</label>
                  <input className="hms-input w-full font-bold" required placeholder="e.g. A-101" value={formData.slotNumber || ''} onChange={e => setFormData({...formData, slotNumber: e.target.value.toUpperCase()})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Zone</label>
                  <input className="hms-input w-full font-bold" required placeholder="e.g. North Wing" value={formData.zone || ''} onChange={e => setFormData({...formData, zone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Floor</label>
                  <input className="hms-input w-full" required placeholder="e.g. G, B1, 1" value={formData.floor || ''} onChange={e => setFormData({...formData, floor: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Vehicle Type</label>
                  <select className="hms-select w-full" value={formData.allowedVehicleType} onChange={e => setFormData({...formData, allowedVehicleType: e.target.value})}>
                    <option value="FOUR_WHEELER">4 Wheeler</option>
                    <option value="TWO_WHEELER">2 Wheeler</option>
                    <option value="AMBULANCE">Ambulance</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Initial Status</label>
                <select className="hms-select w-full" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="AVAILABLE">Available</option>
                  <option value="RESERVED">Reserved</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 font-bold uppercase" disabled={loading}>{selectedItem ? 'Update Slot' : 'Add Slot'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modals */}
      {(showModal === 'delete-entry' || showModal === 'delete-slot') && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm shadow-2xl rounded-sm animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase">Confirm Deletion</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Are you sure you want to permanently delete this {showModal === 'delete-entry' ? 'entry record' : 'parking slot'}? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button className="hms-btn-primary flex-1 font-bold uppercase bg-destructive border-destructive" onClick={showModal === 'delete-entry' ? handleDeleteEntry : handleDeleteSlot} disabled={loading}>
                  {loading ? <RefreshCw size={14} className="animate-spin mx-auto" /> : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parking;
