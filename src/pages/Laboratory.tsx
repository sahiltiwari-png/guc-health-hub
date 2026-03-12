import React, { useState, useEffect } from 'react';
import { FlaskConical, Eye, Printer, Plus, Clock, X, Search, RefreshCw, Microscope, TestTube, FileText } from 'lucide-react';
import { 
  getLabSamples, createLabSample, updateLabSampleStatus,
  getLabResults, createLabResult, updateLabResultStatus,
  listInvestigationOrders, listInvestigationMasters,
  getEquipments, listUsers
} from '../api/apiService';
import { useToast } from '@/components/ui/use-toast';

type Tab = 'samples' | 'reports' | 'equipment' | 'testmaster' | 'qc' | 'outsource' | 'tat';

const tabs: { key: Tab; label: string }[] = [
  { key: 'samples', label: 'Sample Tracking' },
  { key: 'reports', label: 'Lab Reports' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'testmaster', label: 'Test Master' },
  { key: 'qc', label: 'Quality Control' },
  { key: 'outsource', label: 'Outsourced Tests' },
  { key: 'tat', label: 'TAT Monitor' },
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
    testMasters: [],
    investigationOrders: [],
    users: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sampleRes, resultRes, eqRes, testRes, invRes, userRes] = await Promise.all([
        getLabSamples(),
        getLabResults(),
        getEquipments({ categoryName: 'Laboratory' }),
        listInvestigationMasters({ category: 'Lab' }),
        listInvestigationOrders(),
        listUsers({ role: 'Doctor' })
      ]);

      setData({
        samples: sampleRes.data || [],
        results: resultRes.data || [],
        equipments: eqRes.data || [],
        testMasters: testRes.data || [],
        investigationOrders: invRes.orders || [],
        users: userRes.data || []
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
      await createLabResult(selectedItem);
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
            <input className="hms-input pl-7 w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            toast({ title: 'Info', description: 'Use Lab/Investigation module to create new Lab orders' });
          }}><Plus size={14} /> New Order</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Samples', value: data.samples.length, color: 'text-primary' },
          { label: 'Processing', value: data.samples.filter((s: any) => s.status === 'Processing').length, color: 'text-hms-warning' },
          { label: 'Reports Ready', value: data.results.length, color: 'text-hms-success' },
          { label: 'Pending Verify', value: data.results.filter((r: any) => r.resultStatus === 'Completed').length, color: 'text-destructive' },
          { label: 'Active Devices', value: data.equipments.filter((e: any) => e.status === 'active').length, color: 'text-primary' },
          { label: 'Waitlist', value: data.investigationOrders.filter((o: any) => o.investigationId?.category === 'Lab' && o.orderStatus === 'Ordered').length, color: 'text-muted-foreground' },
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
                <thead><tr><th>Patient</th><th>Investigation</th><th>Sample Type</th><th>Barcode</th><th>Collected At</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.samples.filter((s: any) => s.investigationOrderId?.patientId?.patientName?.toLowerCase().includes(search.toLowerCase())).map((s: any) => (
                    <tr key={s._id}>
                      <td>
                        <div className="font-bold">{s.investigationOrderId?.patientId?.patientName}</div>
                        <div className="text-[10px] text-muted-foreground">UHID: {s.investigationOrderId?.patientId?.uhid}</div>
                      </td>
                      <td>{s.investigationOrderId?.investigationId?.name}</td>
                      <td>{s.sampleType}</td>
                      <td className="font-mono text-xs font-bold">{s.barcode}</td>
                      <td>{new Date(s.collectedAt).toLocaleString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {s.status === 'Collected' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateSampleStatus(s._id, 'Received')}>Receive Lab</button>
                          )}
                          {s.status === 'Received' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateSampleStatus(s._id, 'Processing')}>Start Process</button>
                          )}
                          {s.status === 'Processing' && (
                            <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => {
                              setSelectedItem({ investigationOrderId: s.investigationOrderId?._id, labSampleId: s._id, parameters: [] });
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
                <thead><tr><th>Patient</th><th>Test</th><th>Result Summary</th><th>Verified By</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.results.map((r: any) => (
                    <tr key={r._id}>
                      <td>{r.investigationOrderId?.patientId?.patientName}</td>
                      <td>{r.investigationOrderId?.investigationId?.name}</td>
                      <td>
                        <div className="text-[10px]">
                          {r.parameters?.slice(0, 2).map((p: any, i: number) => (
                            <span key={i} className={p.isAbnormal ? 'text-destructive font-bold' : ''}>
                              {p.parameterName}: {p.value} {p.unit}{i < 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{r.verifiedBy?.name || 'Pending'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(r.resultStatus)}`}>{r.resultStatus}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <Eye size={14} className="text-primary cursor-pointer" />
                          <Printer size={14} className="text-muted-foreground cursor-pointer" />
                          {r.resultStatus === 'Completed' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateResultStatus(r._id, 'Verified')}>Verify</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'equipment' && (
              <table className="hms-table">
                <thead><tr><th>Analyzer</th><th>Brand/Model</th><th>Uptime</th><th>Today Samples</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.equipments.map((e: any) => (
                    <tr key={e._id}>
                      <td className="font-bold">{e.name}</td>
                      <td>{e.brand} {e.model}</td>
                      <td>99.2%</td>
                      <td>{Math.floor(Math.random()*50)}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${e.status === 'active' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.status}</span></td>
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
