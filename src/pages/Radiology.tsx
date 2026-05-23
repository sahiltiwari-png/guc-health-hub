import React, { useState, useEffect } from 'react';
import { Scan, Eye, Printer, Plus, Clock, X, Search, RefreshCw, Monitor } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getApiV1DiagnosticsRadiology, 
  postApiV1DiagnosticsRadiology, 
  getApiV1DiagnosticsRadiologyByid,
  putApiV1DiagnosticsRadiologyByid,
  deleteApiV1DiagnosticsRadiologyByid,
  getApiV1Radiology,
  getApiV1RadiologyScans,
  getApiV1Reports,
  listUsers,
  listVisits
} from "@/api/apiService";

type Tab = 'orders' | 'reports' | 'pacs';

const tabs: { key: Tab; label: string }[] = [
  { key: 'orders', label: 'Imaging Orders' },
  { key: 'reports', label: 'Radiology Reports' },
  { key: 'pacs', label: 'PACS Imaging' },
];

const Radiology = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('orders');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [data, setData] = useState({
    studies: [],
    reports: [],
    users: [],
    visits: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [diagRadioRes, radioFeedRes, scansFeedRes, reportsFeedRes, userRes, visitsRes] = await Promise.all([
        getApiV1DiagnosticsRadiology({ page: 1, limit: 100 }),
        getApiV1Radiology({ page: 0, size: 50 }),
        getApiV1RadiologyScans({ page: 0, size: 50 }),
        getApiV1Reports(),
        listUsers({ role: 'Doctor' }),
        listVisits({ limit: 50 })
      ]);

      const getArr = (res: any) => {
        if (!res?.ok) return [];
        const d = res.data?.content || res.data?.data?.content || res.data?.data || res.data || [];
        return Array.isArray(d) ? d : [];
      };

      // Merge all radiology sources
      const allRadiology = [
        ...getArr(diagRadioRes),
        ...getArr(radioFeedRes),
        ...getArr(scansFeedRes)
      ];

      // Remove duplicates based on ID if they exist across feeds
      const uniqueRadiology = Array.from(new Map(allRadiology.map(item => [item.id, item])).values());

      const reportsList = getArr(reportsFeedRes);
      const usersList = getArr(userRes);
      const visitsList = getArr(visitsRes);

      setData({
        studies: uniqueRadiology.filter((item: any) => item.status === 'ORDERED' || item.status === 'IN_PROGRESS' || item.status === 'SCHEDULED'),
        reports: [
          ...uniqueRadiology.filter((item: any) => item.status === 'COMPLETED' || item.status === 'REPORTED'),
          ...reportsList.filter((r: any) => r.type === 'RADIOLOGY' || r.modality) // Filter reports that are radiology-related
        ],
        users: usersList,
        visits: visitsList
      });
    } catch (error) {
      console.error('Error fetching radiology data:', error);
      toast({ title: 'Error', description: 'Failed to sync radiology data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const item = [...data.studies, ...data.reports].find((s: any) => s.id === id);
      if (!item) return;
      
      await putApiV1DiagnosticsRadiologyByid(id, { ...item, status });
      toast({ title: 'Success', description: `Study updated to ${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you'd have a form for this. For now, we'll use selectedItem
      await postApiV1DiagnosticsRadiology(selectedItem);
      toast({ title: 'Success', description: 'Radiology order created' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await putApiV1DiagnosticsRadiologyByid(selectedItem.id, {
        ...selectedItem,
        status: 'COMPLETED',
        reportTime: new Date().toISOString()
      });
      toast({ title: 'Success', description: 'Report saved' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'COMPLETED':
      case 'REPORTED':
      case 'FINAL': return 'bg-hms-success text-hms-success-foreground';
      case 'IN_PROGRESS':
      case 'DRAFT':
      case 'WAITING': return 'bg-hms-warning text-foreground';
      case 'SCHEDULED':
      case 'ORDERED': return 'bg-hms-info text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Scan size={16} /> Radiology & Imaging Management</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            setSelectedItem({
              patientId: '',
              doctorId: '',
              modality: 'X-RAY',
              procedureName: '',
              status: 'ORDERED',
              orderTime: new Date().toISOString()
            });
            setShowModal('newOrder');
          }}><Plus size={14} /> New Order</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Studies', value: data.studies.length + data.reports.length, color: 'text-primary' },
          { label: 'In Progress', value: data.studies.filter((s: any) => s.status === 'IN_PROGRESS').length, color: 'text-hms-warning' },
          { label: 'Ordered', value: data.studies.filter((s: any) => s.status === 'ORDERED').length, color: 'text-hms-info' },
          { label: 'Completed', value: data.reports.length, color: 'text-hms-success' },
          { label: 'Scheduled', value: data.studies.filter((s: any) => s.status === 'SCHEDULED').length, color: 'text-muted-foreground' },
          { label: 'PACS Studies', value: data.reports.filter((r: any) => r.imagesUrl).length, color: 'text-primary' },
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing Radiology Data...</span>
          </div>
        ) : (
          <>
            {tab === 'orders' && (
              <table className="hms-table">
                <thead><tr><th>Order #</th><th>Procedure</th><th>Modality</th><th>Patient</th><th>Order Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.studies.filter((s: any) => {
                    const patientName = s.patient?.fullName || s.patient?.firstName || '';
                    return s.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                           s.procedureName?.toLowerCase().includes(search.toLowerCase()) ||
                           patientName.toLowerCase().includes(search.toLowerCase());
                  }).map((s: any) => (
                    <tr key={s.id}>
                      <td className="font-mono text-xs font-bold">{s.orderNumber || 'PENDING'}</td>
                      <td>{s.procedureName}</td>
                      <td><span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">{s.modality}</span></td>
                      <td>
                        <div className="font-bold">
                          {s.patient ? (s.patient.fullName || `${s.patient.firstName || ''} ${s.patient.lastName || ''}`) : 'Unknown Patient'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          UHID: {s.patient?.uhid || 'N/A'}
                        </div>
                      </td>
                      <td>{new Date(s.orderTime).toLocaleString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {s.status === 'ORDERED' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateStatus(s.id, 'IN_PROGRESS')}>Start Scan</button>
                          )}
                          {s.status === 'IN_PROGRESS' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateStatus(s.id, 'COMPLETED')}>Finish Scan</button>
                          )}
                          {s.status === 'COMPLETED' && (
                            <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => {
                              setSelectedItem(s);
                              setShowModal('report');
                            }}>Write Report</button>
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
                <thead><tr><th>Order #</th><th>Procedure</th><th>Report</th><th>Impression</th><th>Patient</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.reports.filter((r: any) => {
                    const patientName = r.patient?.fullName || r.patient?.firstName || '';
                    return r.orderNumber?.toLowerCase().includes(search.toLowerCase()) || 
                           r.procedureName?.toLowerCase().includes(search.toLowerCase()) ||
                           patientName.toLowerCase().includes(search.toLowerCase());
                  }).map((r: any) => (
                    <tr key={r.id}>
                      <td className="font-mono text-xs font-bold">{r.orderNumber}</td>
                      <td>{r.procedureName}</td>
                      <td className="text-[10px] max-w-xs truncate">{r.report}</td>
                      <td className="text-[10px] max-w-xs truncate font-bold">{r.impression}</td>
                      <td>
                        <div className="font-bold">
                          {r.patient ? (r.patient.fullName || `${r.patient.firstName || ''} ${r.patient.lastName || ''}`) : 'Unknown Patient'}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          UHID: {r.patient?.uhid || 'N/A'}
                        </div>
                      </td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <Eye size={14} className="text-primary cursor-pointer" onClick={() => {
                            setSelectedItem(r);
                            setShowModal('viewReport');
                          }} />
                          <Printer size={14} className="text-muted-foreground cursor-pointer" onClick={() => window.print()} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'pacs' && (
              <div className="p-4 grid grid-cols-4 gap-4">
                {data.reports.filter(r => r.imagesUrl).map((img: any) => (
                  <div key={img.id} className="border border-border p-2 bg-muted/20 text-center">
                    <Monitor size={32} className="mx-auto text-primary/40 mb-2" />
                    <div className="text-[10px] font-bold truncate">
                      {img.patient ? (img.patient.fullName || img.patient.firstName || 'Unknown') : 'Unknown Patient'}
                    </div>
                    <div className="text-[8px] text-muted-foreground uppercase">{img.modality}</div>
                    <div className="mt-2 flex justify-center gap-2">
                      <button className="p-1 hover:bg-primary/10 rounded"><Eye size={12} /></button>
                      <button className="p-1 hover:bg-primary/10 rounded"><Printer size={12} /></button>
                    </div>
                  </div>
                ))}
                {data.reports.filter(r => r.imagesUrl).length === 0 && <div className="col-span-4 text-center py-10 text-muted-foreground text-xs uppercase font-bold tracking-widest">No DICOM images available in PACS</div>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'newOrder' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Create Radiology Order</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Patient</label>
                <select className="hms-select w-full" required value={selectedItem?.patientId} onChange={e => setSelectedItem({...selectedItem, patientId: e.target.value})}>
                  <option value="">-- Select Patient --</option>
                  {data.visits.map((v: any) => (
                    <option key={v.id} value={v.patientId?.id || v.patientId}>
                      {v.patientId?.patientName || v.patientId?.fullName} (UHID: {v.patientId?.uhid})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Procedure Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.procedureName} onChange={e => setSelectedItem({...selectedItem, procedureName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Modality</label>
                  <select className="hms-select w-full" value={selectedItem?.modality} onChange={e => setSelectedItem({...selectedItem, modality: e.target.value})}>
                    <option value="X-RAY">X-RAY</option>
                    <option value="CT-SCAN">CT-SCAN</option>
                    <option value="MRI">MRI</option>
                    <option value="ULTRASOUND">ULTRASOUND</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Ordering Doctor</label>
                <select className="hms-select w-full" required value={selectedItem?.doctorId} onChange={e => setSelectedItem({...selectedItem, doctorId: e.target.value})}>
                  <option value="">-- Select Doctor --</option>
                  {data.users.map((u: any) => <option key={u.id} value={u.id}>{u.fullName || u.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'report' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Scan size={16} className="text-primary" /> Radiology Reporting</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveReport} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Clinical Findings</label>
                <textarea className="hms-input w-full min-h-[100px]" required value={selectedItem?.report} onChange={e => setSelectedItem({...selectedItem, report: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Impression</label>
                <textarea className="hms-input w-full min-h-[60px]" required value={selectedItem?.impression} onChange={e => setSelectedItem({...selectedItem, impression: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Radiologist</label>
                  <select className="hms-select w-full" required value={selectedItem?.updatedBy} onChange={e => setSelectedItem({...selectedItem, updatedBy: e.target.value})}>
                    <option value="">-- Select Radiologist --</option>
                    {data.users.map((u: any) => <option key={u.id} value={u.id}>{u.fullName || u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Images URL (PACS Link)</label>
                  <input className="hms-input w-full" value={selectedItem?.imagesUrl} onChange={e => setSelectedItem({...selectedItem, imagesUrl: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Finalize Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'viewReport' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Scan size={16} className="text-primary" /> View Radiology Report</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold uppercase text-muted-foreground">Patient:</span>{' '}
                  {selectedItem?.patient ? (selectedItem.patient.fullName || `${selectedItem.patient.firstName} ${selectedItem.patient.lastName}`) : 'Unknown Patient'}
                </div>
                <div><span className="font-bold uppercase text-muted-foreground">UHID:</span> {selectedItem?.patient?.uhid || 'N/A'}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Procedure:</span> {selectedItem?.procedureName}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Modality:</span> {selectedItem?.modality}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Date:</span> {new Date(selectedItem?.reportTime).toLocaleString()}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Radiologist:</span> {selectedItem?.updatedBy || 'Staff'}</div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Findings</div>
                <p className="text-sm leading-relaxed">{selectedItem?.report}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded border border-border">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Impression</div>
                <p className="text-sm font-bold">{selectedItem?.impression}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Close</button>
                <button className="hms-btn-primary flex-1" onClick={() => window.print()}>Print Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Radiology;
