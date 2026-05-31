import React, { useState, useEffect } from 'react';
import { createInstrument, createSterilizationCycle, extractArray, extractObject, getInstruments, getInstrumentById, getSterilizationCycles, getSterilizationCycleById, updateInstrument, updateSterilizationCycle, updateSterilizationCycleGeneral, deleteInstrument, deleteSterilizationCycle } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Clock, Eye, Plus, X, Search, RefreshCw, Edit2, Trash2 } from 'lucide-react';

type Tab = 'sets' | 'cycles';

const tabs: { key: Tab; label: string }[] = [
  { key: 'sets', label: 'Instruments' },
  { key: 'cycles', label: 'Sterilization Cycles' },
];

const CSSD = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('sets');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Data States
  const [data, setData] = useState<any>({
    instruments: [],
    cycles: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [insRes, cycRes] = await Promise.all([
        getInstruments(),
        getSterilizationCycles()
      ]);

      setData({
        instruments: extractArray(insRes),
        cycles: extractArray(cycRes)
      });
    } catch (error) {
      console.error('Error fetching CSSD data:', error);
      toast({ title: 'Error', description: 'Failed to sync CSSD data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInstrument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInstrument(selectedItem);
      toast({ title: 'Success', description: 'Instrument added' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSterilizationCycle(selectedItem);
      toast({ title: 'Success', description: 'Cycle started' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleCompleteCycle = async (id: string) => {
    try {
      await updateSterilizationCycle(id, 'SUCCESS');
      toast({ title: 'Success', description: 'Cycle completed' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleViewInstrument = async (id: string) => {
    try {
      setLoading(true);
      const res = await getInstrumentById(id);
      setSelectedItem(extractObject(res));
      setShowModal('view-instrument');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch instrument details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditInstrument = async (id: string) => {
    try {
      setLoading(true);
      const res = await getInstrumentById(id);
      setSelectedItem(extractObject(res));
      setShowModal('edit-instrument');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch instrument details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstrument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateInstrument(selectedItem.id, selectedItem);
      toast({ title: 'Success', description: 'Instrument updated' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Update failed', variant: 'destructive' });
    }
  };

  const handleViewCycle = async (id: string) => {
    try {
      setLoading(true);
      const res = await getSterilizationCycleById(id);
      setSelectedItem(extractObject(res));
      setShowModal('view-cycle');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch cycle details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstrument = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this instrument?')) return;
    try {
      await deleteInstrument(id);
      toast({ title: 'Success', description: 'Instrument deleted' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleDeleteCycle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sterilization cycle?')) return;
    try {
      await deleteSterilizationCycle(id);
      toast({ title: 'Success', description: 'Cycle deleted' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Ready':
      case 'Sterile':
      case 'STERILE':
      case 'Completed':
      case 'COMPLETED':
      case 'Active':
      case 'Returned': return 'bg-hms-success text-hms-success-foreground';
      case 'Pending':
      case 'Processing':
      case 'IN_PROGRESS':
      case 'IN_STERILIZATION':
      case 'Issued':
      case 'In Use': return 'bg-hms-warning text-foreground';
      case 'Failed':
      case 'Expired':
      case 'Overdue':
      case 'DIRTY':
      case 'MAINTENANCE':
      case 'DECOMMISSIONED': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 p-1 md:p-2">
      <div className="hms-section-header flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 py-2">
        <div className="flex items-center gap-2 min-w-max"><ShieldCheck size={16} /> CSSD & Core Management</div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input 
              className="hms-input pl-7 w-full md:w-48 !bg-white !text-slate-900 border-white/20" 
              placeholder="Search instruments/cycles..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button className="hms-btn-primary !bg-white !text-primary flex items-center gap-1 whitespace-nowrap shadow-sm hover:!bg-slate-50" onClick={() => {
            setSelectedItem({ name: '', category: '', code: '', description: '', status: 'DIRTY', readyForUse: false });
            setShowModal('instrument');
          }}><Plus size={14} /> New Instrument</button>
          <button className="hms-btn-secondary !bg-white !text-slate-700 flex items-center gap-1 whitespace-nowrap shadow-sm hover:!bg-slate-50 border-none" onClick={() => {
            setSelectedItem({ cycleNumber: `CYC-${Math.floor(Math.random()*10000)}`, loadName: '', sterilizationMethod: 'Steam', temperature: 121, pressure: 15, startTime: new Date().toISOString().slice(0, 16) });
            setShowModal('cycle');
          }}><Plus size={14} /> New Cycle</button>
          <button className="hms-btn-secondary !bg-white !text-slate-700 p-1.5 shadow-sm hover:!bg-slate-50 border-none" onClick={fetchData} title="Refresh Data"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 my-1">
        {[
          { label: 'Total Instruments', value: data.instruments.length, color: 'text-primary' },
          { label: 'Sterile Units', value: data.instruments.filter((i: any) => i.status === 'STERILE').length, color: 'text-hms-success' },
          { label: 'In Sterilization', value: data.cycles.filter((c: any) => c.status === 'IN_PROGRESS').length, color: 'text-hms-warning' },
          { label: 'Total Cycles', value: data.cycles.length, color: 'text-primary' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-3 shadow-sm text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-border bg-card overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 md:px-6 py-2.5 text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 opacity-50">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing CSSD Data...</span>
          </div>
        ) : (
          <>
            {tab === 'sets' && (
              <table className="hms-table">
                <thead><tr><th>Code</th><th>Name</th><th>Description</th><th>Status</th><th>Ready</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.instruments.filter((i: any) => i.name?.toLowerCase().includes(search.toLowerCase()) || i.code?.toLowerCase().includes(search.toLowerCase())).map((i: any) => (
                    <tr key={i.id}>
                      <td className="font-mono text-xs font-bold">{i.code}</td>
                      <td className="font-semibold">{i.name}</td>
                      <td className="max-w-[200px] truncate text-[10px]">{i.description}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(i.status)}`}>{i.status}</span></td>
                      <td>{i.readyForUse ? '✅' : '❌'}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" title="View" onClick={() => handleViewInstrument(i.id)}><Eye size={14} /></button>
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" title="Edit" onClick={() => handleEditInstrument(i.id)}><Edit2 size={14} /></button>
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => handleDeleteInstrument(i.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.instruments.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground italic text-xs uppercase tracking-widest">No instruments found</td></tr>}
                </tbody>
              </table>
            )}

            {tab === 'cycles' && (
              <table className="hms-table">
                <thead><tr><th>Cycle #</th><th>Load Name</th><th>Method</th><th>Temp/Press</th><th>Start Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.cycles.filter((c: any) => 
                    c.cycleNumber?.toLowerCase().includes(search.toLowerCase()) || 
                    c.loadName?.toLowerCase().includes(search.toLowerCase()) ||
                    c.sterilizationMethod?.toLowerCase().includes(search.toLowerCase())
                  ).map((c: any) => (
                    <tr key={c.id}>
                      <td className="font-bold">{c.cycleNumber}</td>
                      <td>{c.loadName}</td>
                      <td>{c.sterilizationMethod}</td>
                      <td>{c.temperature}°C / {c.pressure}psi</td>
                      <td>{new Date(c.startTime).toLocaleString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(c.status)}`}>{c.status}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" title="View" onClick={() => handleViewCycle(c.id)}><Eye size={14} /></button>
                          {c.status === 'IN_PROGRESS' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleCompleteCycle(c.id)}>Complete</button>
                          )}
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => handleDeleteCycle(c.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.cycles.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground italic text-xs uppercase tracking-widest">No cycles found</td></tr>}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'instrument' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Add New Instrument</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateInstrument} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Name</label>
                <input className="hms-input w-full" required value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
                  <input className="hms-input w-full" required value={selectedItem?.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Code</label>
                  <input className="hms-input w-full" required value={selectedItem?.code} onChange={e => setSelectedItem({...selectedItem, code: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Description</label>
                <textarea className="hms-input w-full" value={selectedItem?.description} onChange={e => setSelectedItem({...selectedItem, description: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Instrument</button>
              </div>
            </form>
          </div>
        </div>
      )}



      {showModal === 'cycle' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Clock size={16} className="text-primary" /> Start Sterilization Cycle</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateCycle} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Cycle Number</label>
                  <input className="hms-input w-full" required value={selectedItem?.cycleNumber} onChange={e => setSelectedItem({...selectedItem, cycleNumber: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Load Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.loadName} onChange={e => setSelectedItem({...selectedItem, loadName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Method</label>
                  <select className="hms-select w-full" value={selectedItem?.sterilizationMethod} onChange={e => setSelectedItem({...selectedItem, sterilizationMethod: e.target.value})}>
                    <option value="Steam">Steam</option>
                    <option value="EO">EO (Ethylene Oxide)</option>
                    <option value="Plasma">Plasma</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Temp (°C)</label>
                  <input type="number" step="0.1" className="hms-input w-full" value={selectedItem?.temperature} onChange={e => setSelectedItem({...selectedItem, temperature: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Pressure (psi)</label>
                  <input type="number" step="0.1" className="hms-input w-full" value={selectedItem?.pressure} onChange={e => setSelectedItem({...selectedItem, pressure: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Start Time</label>
                  <input type="datetime-local" className="hms-input w-full" required value={selectedItem?.startTime} onChange={e => setSelectedItem({...selectedItem, startTime: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Start Cycle</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal === 'view-instrument' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Eye size={16} className="text-primary" /> Instrument Details</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Name</label>
                  <p className="text-sm font-semibold">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Code</label>
                  <p className="text-sm font-mono">{selectedItem.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Category</label>
                  <p className="text-sm">{selectedItem.category}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Status</label>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(selectedItem.status)}`}>{selectedItem.status}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Description</label>
                <p className="text-sm">{selectedItem.description || 'No description provided'}</p>
              </div>
              <div className="pt-2">
                <button className="hms-btn-secondary w-full" onClick={() => setShowModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'edit-instrument' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Edit2 size={16} className="text-primary" /> Edit Instrument</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateInstrument} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Name</label>
                <input className="hms-input w-full" required value={selectedItem?.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
                  <input className="hms-input w-full" required value={selectedItem?.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Code</label>
                  <input className="hms-input w-full" required value={selectedItem?.code} onChange={e => setSelectedItem({...selectedItem, code: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Status</label>
                <select className="hms-select w-full" value={selectedItem?.status} onChange={e => setSelectedItem({...selectedItem, status: e.target.value})}>
                  <option value="STERILE">STERILE</option>
                  <option value="DIRTY">DIRTY</option>
                  <option value="IN_STERILIZATION">IN_STERILIZATION</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Description</label>
                <textarea className="hms-input w-full" value={selectedItem?.description} onChange={e => setSelectedItem({...selectedItem, description: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Update Instrument</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'view-cycle' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Eye size={16} className="text-primary" /> Cycle Details</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Cycle Number</label>
                  <p className="text-sm font-bold">{selectedItem.cycleNumber}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Load Name</label>
                  <p className="text-sm">{selectedItem.loadName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Method</label>
                  <p className="text-sm">{selectedItem.sterilizationMethod}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Status</label>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(selectedItem.status)}`}>{selectedItem.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Temperature</label>
                  <p className="text-sm">{selectedItem.temperature}°C</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Pressure</label>
                  <p className="text-sm">{selectedItem.pressure} psi</p>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground block">Start Time</label>
                <p className="text-sm">{new Date(selectedItem.startTime).toLocaleString()}</p>
              </div>
              {selectedItem.endTime && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">End Time</label>
                  <p className="text-sm">{new Date(selectedItem.endTime).toLocaleString()}</p>
                </div>
              )}
              {selectedItem.result && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block">Result</label>
                  <p className="text-sm font-semibold">{selectedItem.result}</p>
                </div>
              )}
              <div className="pt-2">
                <button className="hms-btn-secondary w-full" onClick={() => setShowModal(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSSD;
