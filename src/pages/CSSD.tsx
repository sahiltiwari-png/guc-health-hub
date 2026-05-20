import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Eye, Plus, X, Search, RefreshCw } from 'lucide-react';
import { createInstrument, createInstrumentBatch, createSterilizationCycle, getEquipments, getInstrumentBatches, getInstruments, getIssuedInstruments, getSterilizationCycles, issueInstrument, listDepartments, listUsers, returnInstrument, updateSterilizationCycle, extractArray } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

type Tab = 'sets' | 'batches' | 'cycles' | 'requests' | 'machines' | 'quality';

const tabs: { key: Tab; label: string }[] = [
  { key: 'sets', label: 'Instruments' },
  { key: 'batches', label: 'Batches' },
  { key: 'cycles', label: 'Sterilization Cycles' },
  { key: 'requests', label: 'Issuance/Returns' },
  { key: 'machines', label: 'Equipment Status' },
];

const CSSD = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('sets');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [data, setData] = useState({
    instruments: [],
    batches: [],
    cycles: [],
    issues: [],
    users: [],
    departments: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [insRes, batRes, cycRes, issRes, userRes, depRes, eqRes] = await Promise.all([
        getInstruments(),
        getInstrumentBatches(),
        getSterilizationCycles(),
        getIssuedInstruments(),
        listUsers({ role: 'Doctor' }),
        listDepartments(),
        getEquipments({ categoryName: 'Sterilization' })
      ]);

      setData({
        instruments: insRes.data?.data || insRes.data || insRes || [],
        batches: batRes.data?.data || batRes.data || batRes || [],
        cycles: cycRes.data?.data || cycRes.data || cycRes || [],
        issues: issRes.data?.data || issRes.data || issRes || [],
        users: extractArray(userRes),
        departments: extractArray(depRes),
        equipments: extractArray(eqRes)
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

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInstrumentBatch(selectedItem);
      toast({ title: 'Success', description: 'Batch created' });
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
      await updateSterilizationCycle(id, { status: 'Completed', endTime: new Date() });
      toast({ title: 'Success', description: 'Cycle completed' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueInstrument(selectedItem);
      toast({ title: 'Success', description: 'Instrument issued' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await returnInstrument(id);
      toast({ title: 'Success', description: 'Instrument returned' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: 'Return failed', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Ready':
      case 'Sterile':
      case 'Completed':
      case 'Active':
      case 'Returned': return 'bg-hms-success text-hms-success-foreground';
      case 'Pending':
      case 'Processing':
      case 'Issued':
      case 'In Use': return 'bg-hms-warning text-foreground';
      case 'Failed':
      case 'Expired':
      case 'Overdue': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><ShieldCheck size={16} /> CSSD & Core Management</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            setSelectedItem({ name: '', category: '', code: '' });
            setShowModal('instrument');
          }}><Plus size={14} /> New Instrument</button>
          <button className="hms-btn-secondary flex items-center gap-1" onClick={() => {
            setSelectedItem({ batchNumber: `BAT-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`, instruments: [], sterilizationDate: new Date().toISOString().split('T')[0], expiryDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] });
            setShowModal('batch');
          }}><Plus size={14} /> New Batch</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Instruments', value: data.instruments.length, color: 'text-primary' },
          { label: 'Ready Batches', value: data.batches.filter((b: any) => b.status === 'Ready').length, color: 'text-hms-success' },
          { label: 'Active Cycles', value: data.cycles.filter((c: any) => c.status === 'Pending').length, color: 'text-hms-warning' },
          { label: 'Issued Units', value: data.issues.filter((i: any) => i.status === 'Issued').length, color: 'text-hms-info' },
          { label: 'Expired Batches', value: data.batches.filter((b: any) => new Date(b.expiryDate) < new Date()).length, color: 'text-destructive' },
          { label: 'Total Cycles', value: data.cycles.length, color: 'text-primary' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-3 shadow-sm text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-border bg-card">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
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
                <thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Created At</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.instruments.filter((i: any) => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase())).map((i: any) => (
                    <tr key={i.id}>
                      <td className="font-mono text-xs font-bold">{i.code}</td>
                      <td className="font-semibold">{i.name}</td>
                      <td>{i.category}</td>
                      <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${i.isActive ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted'}`}>{i.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button className="text-primary hover:bg-primary/10 p-1 rounded"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'batches' && (
              <table className="hms-table">
                <thead><tr><th>Batch #</th><th>Instruments</th><th>Sterilized Date</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.batches.filter((b: any) => b.batchNumber.toLowerCase().includes(search.toLowerCase())).map((b: any) => (
                    <tr key={b.id}>
                      <td className="font-mono text-xs font-bold">{b.batchNumber}</td>
                      <td>
                        <div className="text-[10px]">
                          {b.instruments?.map((inst: any, idx: number) => (
                            <div key={idx}>{inst.instrumentId?.name} (x{inst.quantity})</div>
                          ))}
                        </div>
                      </td>
                      <td>{new Date(b.sterilizationDate).toLocaleDateString()}</td>
                      <td className={new Date(b.expiryDate) < new Date() ? 'text-destructive font-bold' : ''}>{new Date(b.expiryDate).toLocaleDateString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(b.status)}`}>{b.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => {
                            setSelectedItem({ batchId: b.id, cycleNumber: Math.floor(Math.random()*10000), machineUsed: '', startTime: new Date().toISOString().slice(0, 16) });
                            setShowModal('cycle');
                          }}>Start Cycle</button>
                          <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => {
                            setSelectedItem({ batchId: b.id, issuedTo: '', issuedFor: 'Surgery', issuedQuantity: 1 });
                            setShowModal('issue');
                          }}>Issue</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'cycles' && (
              <table className="hms-table">
                <thead><tr><th>Cycle #</th><th>Batch #</th><th>Machine</th><th>Start Time</th><th>End Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.cycles.map((c: any) => (
                    <tr key={c.id}>
                      <td className="font-bold">{c.cycleNumber}</td>
                      <td className="font-mono text-xs">{c.batchId?.batchNumber}</td>
                      <td>{c.machineUsed}</td>
                      <td>{new Date(c.startTime).toLocaleString()}</td>
                      <td>{c.endTime ? new Date(c.endTime).toLocaleString() : '-'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(c.status)}`}>{c.status}</span></td>
                      <td>
                        {c.status === 'Pending' && (
                          <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleCompleteCycle(c.id)}>Complete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'requests' && (
              <table className="hms-table">
                <thead><tr><th>Issued To</th><th>Batch #</th><th>For</th><th>Qty</th><th>Issued At</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.issues.map((i: any) => (
                    <tr key={i.id}>
                      <td className="font-semibold">{i.issuedTo?.name || 'Staff'}</td>
                      <td className="font-mono text-xs">{i.batchId?.batchNumber}</td>
                      <td>{i.issuedFor}</td>
                      <td>{i.issuedQuantity}</td>
                      <td>{new Date(i.issuedAt).toLocaleString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(i.status)}`}>{i.status}</span></td>
                      <td>
                        {i.status === 'Issued' && (
                          <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => handleReturn(i.id)}>Return</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'machines' && (
              <table className="hms-table">
                <thead><tr><th>Machine</th><th>Brand/Model</th><th>Uptime</th><th>Today Exams</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {(data as any).equipments?.map((e: any) => (
                    <tr key={e.id}>
                      <td className="font-bold">{e.name}</td>
                      <td>{e.brand} {e.model}</td>
                      <td>99.5%</td>
                      <td>5</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${e.status === 'active' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.status}</span></td>
                      <td>
                        <button className="text-primary hover:bg-primary/10 p-1 rounded" title="Maintenance"><Eye size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {(data as any).equipments?.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-muted-foreground italic">No machines found</td></tr>}
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
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Instrument</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'batch' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Create Instrument Batch</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateBatch} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Batch Number</label>
                <input className="hms-input w-full" required value={selectedItem?.batchNumber} onChange={e => setSelectedItem({...selectedItem, batchNumber: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Add Instrument</label>
                <div className="flex gap-2">
                  <select className="hms-select flex-1" id="inst-select">
                    <option value="">-- Choose Instrument --</option>
                    {data.instruments.map((i: any) => <option key={i.id} value={i.id}>{i.name} ({i.code})</option>)}
                  </select>
                  <input type="number" className="hms-input w-16" defaultValue="1" id="inst-qty" />
                  <button type="button" className="hms-btn-secondary p-2" onClick={() => {
                    const id = (document.getElementById('inst-select') as HTMLSelectElement).value;
                    const qty = parseInt((document.getElementById('inst-qty') as HTMLInputElement).value);
                    if (!id) return;
                    const inst = data.instruments.find((i: any) => i.id === id);
                    setSelectedItem({
                      ...selectedItem,
                      instruments: [...(selectedItem.instruments || []), { instrumentId: id, quantity: qty, name: (inst as any).name }]
                    });
                  }}><Plus size={14} /></button>
                </div>
              </div>
              <div className="max-h-32 overflow-auto border border-border p-2 bg-muted/10">
                {selectedItem?.instruments?.map((i: any, idx: number) => (
                  <div key={idx} className="text-[10px] flex justify-between py-1 border-b border-border last:border-0">
                    <span>{i.name}</span>
                    <span className="font-bold">x{i.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Sterilization Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.sterilizationDate} onChange={e => setSelectedItem({...selectedItem, sterilizationDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Expiry Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.expiryDate} onChange={e => setSelectedItem({...selectedItem, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Create Batch</button>
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
                  <input type="number" className="hms-input w-full" required value={selectedItem?.cycleNumber} onChange={e => setSelectedItem({...selectedItem, cycleNumber: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Machine Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.machineUsed} onChange={e => setSelectedItem({...selectedItem, machineUsed: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Start Time</label>
                <input type="datetime-local" className="hms-input w-full" required value={selectedItem?.startTime} onChange={e => setSelectedItem({...selectedItem, startTime: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Start Cycle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'issue' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Issue Instrument Batch</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleIssue} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Issue To (Doctor/Staff)</label>
                <select className="hms-select w-full" required value={selectedItem?.issuedTo} onChange={e => setSelectedItem({...selectedItem, issuedTo: e.target.value})}>
                  <option value="">-- Select Person --</option>
                  {data.users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Issued For</label>
                  <select className="hms-select w-full" required value={selectedItem?.issuedFor} onChange={e => setSelectedItem({...selectedItem, issuedFor: e.target.value})}>
                    <option value="Surgery">Surgery</option>
                    <option value="IPD">IPD</option>
                    <option value="OPD">OPD</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Quantity</label>
                  <input type="number" className="hms-input w-full" required min="1" value={selectedItem?.issuedQuantity} onChange={e => setSelectedItem({...selectedItem, issuedQuantity: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Issue Units</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSSD;
