import React, { useState, useEffect } from 'react';
import { FlaskConical, Eye, Printer, Plus, Clock, X, Search, RefreshCw, Microscope, TestTube, FileText } from 'lucide-react';
import { createLabEntry, getAutoAssetsMasters, getLabTatMonitor, listLabOrders, listUsers, updateLabResultStatus, updateLabSampleStatus } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

type Tab = 'samples' | 'reports' | 'equipment' | 'testmaster' | 'qc' | 'outsource' | 'tat';

const tabs: { key: Tab; label: string }[] = [
  { key: 'samples', label: 'Sample Tracking' },
  { key: 'reports', label: 'Lab Reports' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'tat', label: 'TAT Monitor' },
  { key: 'testmaster', label: 'Test Master' },
  { key: 'qc', label: 'Quality Control' },
  { key: 'outsource', label: 'Outsourced Tests' },
];

const Laboratory = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('samples');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [data, setData] = useState({
    samples: [],
    results: [],
    equipments: [],
    tatData: [],
    testMasters: [],
    users: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [newOrder, setNewOrder] = useState({
    patientId: '',
    testName: '',
    testCode: '',
    sampleType: 'BLOOD',
    priority: 'NORMAL',
    remarks: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [labRes, assetRes, tatRes, userRes] = await Promise.all([
        listLabOrders(),
        getAutoAssetsMasters({ categoryName: 'Laboratory' }),
        getLabTatMonitor(),
        listUsers({ role: 'Doctor' })
      ]);

      const labContent = labRes.data?.content || labRes.data || [];
      
      setData({
        samples: labContent.filter((item: any) => item.status !== 'COMPLETED'),
        results: labContent.filter((item: any) => item.status === 'COMPLETED'),
        equipments: assetRes.data?.content || assetRes.data || [],
        tatData: tatRes.data?.content || tatRes.data || [],
        testMasters: [], // Can be fetched if needed, using lab list for now
        users: userRes.data?.content || userRes.data || []
      });
    } catch (error) {
      console.error('Error fetching laboratory data:', error);
      toast({ title: 'Error', description: 'Failed to sync laboratory data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLabEntry(newOrder);
      toast({ title: 'Success', description: 'New lab order created' });
      setShowModal(null);
      setNewOrder({
        patientId: '',
        testName: '',
        testCode: '',
        sampleType: 'BLOOD',
        priority: 'NORMAL',
        remarks: ''
      });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create order', variant: 'destructive' });
    }
  };

  const handleUpdateSampleStatus = async (id: string, status: string) => {
    try {
      await updateLabSampleStatus(id, status);
      toast({ title: 'Success', description: `Sample updated to ${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleCreateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultStr = selectedItem.parameters?.map((p: any) => `${p.parameterName} ${p.value} ${p.unit}`).join(', ');
      await updateLabResultStatus(selectedItem.id, { 
        status: 'COMPLETED',
        result: resultStr,
        resultTime: new Date().toISOString()
      });
      toast({ title: 'Success', description: 'Lab result saved' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleUpdateResultStatus = async (id: string, status: string) => {
    try {
      await updateLabResultStatus(id, status);
      toast({ title: 'Success', description: `Result updated to ${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Completed':
      case 'Verified':
      case 'Ready': return 'bg-hms-success text-hms-success-foreground';
      case 'Processing':
      case 'Received':
      case 'Draft':
      case 'Pending': return 'bg-hms-warning text-foreground';
      case 'Collected': return 'bg-hms-info text-primary-foreground';
      case 'Failed':
      case 'Rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><FlaskConical size={16} /> Laboratory Management System</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search order/test..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => setShowModal('newOrder')}><Plus size={14} /> New Order</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Orders', value: data.samples.length + data.results.length, color: 'text-primary' },
          { label: 'Processing', value: data.samples.filter((s: any) => s.status === 'PROCESSING').length, color: 'text-hms-warning' },
          { label: 'Reports Ready', value: data.results.length, color: 'text-hms-success' },
          { label: 'Pending Verify', value: data.results.filter((r: any) => r.status === 'COMPLETED').length, color: 'text-destructive' },
          { label: 'Active Devices', value: data.equipments.filter((e: any) => e.status === 'ASSIGNED' || e.status === 'AVAILABLE').length, color: 'text-primary' },
          { label: 'Waitlist', value: data.samples.filter((o: any) => o.status === 'PENDING').length, color: 'text-muted-foreground' },
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing Lab Data...</span>
          </div>
        ) : (
          <>
            {tab === 'samples' && (
              <table className="hms-table">
                <thead><tr><th>Order #</th><th>Test Name</th><th>Sample Type</th><th>Patient</th><th>Order Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.samples.filter((s: any) => 
                    s.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                    s.testName?.toLowerCase().includes(search.toLowerCase())
                  ).map((s: any) => (
                    <tr key={s.id}>
                      <td className="font-mono text-xs font-bold">{s.orderNumber}</td>
                      <td>{s.testName} <span className="text-[9px] text-muted-foreground">({s.testCode})</span></td>
                      <td>{s.sampleType}</td>
                      <td>{s.patient?.name || 'Walk-in'}</td>
                      <td>{new Date(s.orderTime || s.createdAt).toLocaleString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {s.status === 'PENDING' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateSampleStatus(s.id, 'COLLECTED')}>Collect</button>
                          )}
                          {s.status === 'COLLECTED' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateSampleStatus(s.id, 'PROCESSING')}>Process</button>
                          )}
                          {s.status === 'PROCESSING' && (
                            <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => {
                              setSelectedItem(s);
                              setShowModal('result');
                            }}>Enter Result</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'reports' && (
              <table className="hms-table">
                <thead><tr><th>Order #</th><th>Test Name</th><th>Result</th><th>Patient</th><th>Result Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.results.filter((r: any) => 
                    r.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                    r.testName?.toLowerCase().includes(search.toLowerCase())
                  ).map((r: any) => (
                    <tr key={r.id}>
                      <td className="font-mono text-xs font-bold">{r.orderNumber}</td>
                      <td>{r.testName}</td>
                      <td className="max-w-xs truncate font-medium text-primary">{r.result || 'Pending'}</td>
                      <td>{r.patient?.name || 'Walk-in'}</td>
                      <td>{r.resultTime ? new Date(r.resultTime).toLocaleString() : '-'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <Eye size={14} className="text-primary cursor-pointer" />
                          <Printer size={14} className="text-muted-foreground cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'tat' && (
              <table className="hms-table">
                <thead><tr><th>Order #</th><th>Test</th><th>Order Time</th><th>Collection</th><th>Result</th><th>TAT (Min)</th><th>Status</th></tr></thead>
                <tbody>
                  {data.tatData.map((t: any) => {
                    const orderTime = new Date(t.orderTime);
                    const resultTime = t.resultTime ? new Date(t.resultTime) : null;
                    const tat = resultTime ? Math.floor((resultTime.getTime() - orderTime.getTime()) / 60000) : '-';
                    return (
                      <tr key={t.id}>
                        <td className="font-mono text-[10px]">{t.orderNumber}</td>
                        <td>{t.testName}</td>
                        <td className="text-[10px]">{new Date(t.orderTime).toLocaleTimeString()}</td>
                        <td className="text-[10px]">{t.sampleCollectionTime ? new Date(t.sampleCollectionTime).toLocaleTimeString() : '-'}</td>
                        <td className="text-[10px]">{t.resultTime ? new Date(t.resultTime).toLocaleTimeString() : '-'}</td>
                        <td className="font-bold text-primary">{tat}</td>
                        <td>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${typeof tat === 'number' && tat > 60 ? 'bg-destructive/10 text-destructive' : 'bg-hms-success/10 text-hms-success'}`}>
                            {typeof tat === 'number' && tat > 60 ? 'DELAYED' : 'ON TIME'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tab === 'equipment' && (
              <table className="hms-table">
                <thead><tr><th>Analyzer</th><th>Brand/Model</th><th>Uptime</th><th>Today Samples</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.equipments.map((e: any) => (
                    <tr key={e._id || e.id}>
                      <td className="font-bold">{e.name}</td>
                      <td>{e.brand || e.manufacturer} {e.model || e.modelNumber}</td>
                      <td>99.2%</td>
                      <td>{Math.floor(Math.random()*50)}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${e.status === 'active' || e.status === 'AVAILABLE' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.status}</span></td>
                      <td><button className="text-primary hover:bg-primary/10 p-1 rounded"><Eye size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'testmaster' && (
              <table className="hms-table">
                <thead><tr><th>Test Name</th><th>Category</th><th>Price</th><th>Status</th></tr></thead>
                <tbody>
                  {data.testMasters.map((t: any) => (
                    <tr key={t._id}>
                      <td className="font-bold">{t.name}</td>
                      <td>{t.category}</td>
                      <td>₹{t.price}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${t.isActive ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted'}`}>{t.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'newOrder' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Create New Lab Order</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Patient ID</label>
                <input className="hms-input w-full" required value={newOrder.patientId} onChange={e => setNewOrder({...newOrder, patientId: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Test Name</label>
                  <input className="hms-input w-full" required value={newOrder.testName} onChange={e => setNewOrder({...newOrder, testName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Test Code</label>
                  <input className="hms-input w-full" required value={newOrder.testCode} onChange={e => setNewOrder({...newOrder, testCode: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Sample Type</label>
                  <select className="hms-input w-full" value={newOrder.sampleType} onChange={e => setNewOrder({...newOrder, sampleType: e.target.value})}>
                    <option value="BLOOD">BLOOD</option>
                    <option value="URINE">URINE</option>
                    <option value="SWAB">SWAB</option>
                    <option value="STOOL">STOOL</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Priority</label>
                  <select className="hms-input w-full" value={newOrder.priority} onChange={e => setNewOrder({...newOrder, priority: e.target.value})}>
                    <option value="NORMAL">NORMAL</option>
                    <option value="URGENT">URGENT</option>
                    <option value="STAT">STAT</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Remarks</label>
                <textarea className="hms-input w-full h-20" value={newOrder.remarks} onChange={e => setNewOrder({...newOrder, remarks: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'result' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><FlaskConical size={16} className="text-primary" /> Enter Laboratory Results</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateResult} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Add Parameter</label>
                  <div className="flex gap-2">
                    <input className="hms-input flex-1" placeholder="Name" id="p-name" />
                    <input className="hms-input w-20" placeholder="Val" id="p-val" />
                    <input className="hms-input w-16" placeholder="Unit" id="p-unit" />
                    <button type="button" className="hms-btn-secondary p-2" onClick={() => {
                      const name = (document.getElementById('p-name') as HTMLInputElement).value;
                      const val = (document.getElementById('p-val') as HTMLInputElement).value;
                      const unit = (document.getElementById('p-unit') as HTMLInputElement).value;
                      if (!name || !val) return;
                      setSelectedItem({
                        ...selectedItem,
                        parameters: [...selectedItem.parameters, { parameterName: name, value: val, unit: unit, normalRange: '', isAbnormal: false }]
                      });
                      (document.getElementById('p-name') as HTMLInputElement).value = '';
                      (document.getElementById('p-val') as HTMLInputElement).value = '';
                      (document.getElementById('p-unit') as HTMLInputElement).value = '';
                    }}><Plus size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="max-h-48 overflow-auto border border-border">
                <table className="hms-table mb-0">
                  <thead><tr><th>Parameter</th><th>Value</th><th>Unit</th><th>Abnormal</th></tr></thead>
                  <tbody>
                    {selectedItem?.parameters?.map((p: any, i: number) => (
                      <tr key={i}>
                        <td>{p.parameterName}</td>
                        <td>{p.value}</td>
                        <td>{p.unit}</td>
                        <td><input type="checkbox" checked={p.isAbnormal} onChange={e => {
                          const newParams = [...selectedItem.parameters];
                          newParams[i].isAbnormal = e.target.checked;
                          setSelectedItem({...selectedItem, parameters: newParams});
                        }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Result</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laboratory;
