import React, { useState, useEffect } from 'react';
import { Scan, Eye, Printer, Plus, Clock, X, Search, RefreshCw, Monitor } from 'lucide-react';
import { createRadiologyReport, createRadiologyStudy, getRadiologyImages, getRadiologyReports, getRadiologyStudies, listInvestigationOrders, getAutoPatients, listUsers, updateRadiologyStudyStatus } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

type Tab = 'orders' | 'reports' | 'equipment' | 'contrast' | 'pacs' | 'schedule' | 'dose';

const tabs: { key: Tab; label: string }[] = [
  { key: 'orders', label: 'Radiology Orders' },
  { key: 'reports', label: 'Reports & Dictation' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'contrast', label: 'Contrast Inventory' },
  { key: 'pacs', label: 'PACS/DICOM' },
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
    images: [],
    investigationOrders: [],
    patients: [],
    users: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [studyRes, reportRes, imgRes, invRes, patientRes, userRes] = await Promise.all([
        getRadiologyStudies(),
        getRadiologyReports(),
        getRadiologyImages(),
        listInvestigationOrders(),
        getAutoPatients(),
        listUsers({ role: 'Doctor' })
      ]);

      setData({
        studies: studyRes.data?.data || studyRes.data || studyRes || [],
        reports: reportRes.data?.data || reportRes.data || reportRes || [],
        images: imgRes.data?.data || imgRes.data || imgRes || [],
        investigationOrders: invRes.data?.data || invRes.data || invRes.orders || [],
        patients: patientRes.data?.data || patientRes.data || [],
        users: userRes.data?.data || userRes.data || []
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
      await updateRadiologyStudyStatus(id, status);
      toast({ title: 'Success', description: `Study updated to ${status}` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRadiologyReport(selectedItem);
      toast({ title: 'Success', description: 'Report saved' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Completed':
      case 'Reported':
      case 'Verified':
      case 'Final': return 'bg-hms-success text-hms-success-foreground';
      case 'In-Progress':
      case 'Draft':
      case 'Waiting': return 'bg-hms-warning text-foreground';
      case 'Scheduled':
      case 'Checked-In': return 'bg-hms-info text-primary-foreground';
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
            // In a real app, this would open an investigation order modal
            toast({ title: 'Info', description: 'Use Lab/Investigation module to create new Radiology orders' });
          }}><Plus size={14} /> New Order</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Studies', value: data.studies.length, color: 'text-primary' },
          { label: 'In Progress', value: data.studies.filter((s: any) => s.status === 'In-Progress').length, color: 'text-hms-warning' },
          { label: 'Pending Reports', value: data.studies.filter((s: any) => s.status === 'Completed').length, color: 'text-destructive' },
          { label: 'Completed', value: data.studies.filter((s: any) => s.status === 'Verified').length, color: 'text-hms-success' },
          { label: 'Waitlist', value: data.investigationOrders.filter((o: any) => o.investigationId?.category === 'Radiology' && o.orderStatus === 'Ordered').length, color: 'text-muted-foreground' },
          { label: 'Images Stored', value: data.images.length, color: 'text-primary' },
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
                <thead><tr><th>Patient</th><th>Investigation</th><th>Modality</th><th>Priority</th><th>Scheduled At</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.studies.filter((s: any) => s.investigationOrderId?.patientId?.patientName?.toLowerCase().includes(search.toLowerCase())).map((s: any) => (
                    <tr key={s._id}>
                      <td>
                        <div className="font-bold">{s.investigationOrderId?.patientId?.patientName}</div>
                        <div className="text-[10px] text-muted-foreground">UHID: {s.investigationOrderId?.patientId?.uhid}</div>
                      </td>
                      <td>{s.investigationOrderId?.investigationId?.name}</td>
                      <td><span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">{s.modality}</span></td>
                      <td><span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${s.investigationOrderId?.priority === 'Urgent' ? 'bg-destructive text-destructive-foreground' : 'bg-muted'}`}>{s.investigationOrderId?.priority}</span></td>
                      <td>{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : 'N/A'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(s.status)}`}>{s.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {s.status === 'Scheduled' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateStatus(s._id, 'In-Progress')}>Start Scan</button>
                          )}
                          {s.status === 'In-Progress' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => handleUpdateStatus(s._id, 'Completed')}>Finish Scan</button>
                          )}
                          {s.status === 'Completed' && (
                            <button className="hms-btn-secondary text-[10px] px-2 py-0.5" onClick={() => {
                              setSelectedItem({ radiologyStudyId: s._id, findings: '', impression: '', reportStatus: 'Draft' });
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
                <thead><tr><th>Patient</th><th>Exam</th><th>Findings</th><th>Impression</th><th>Reported By</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.reports.map((r: any) => (
                    <tr key={r._id}>
                      <td>{r.radiologyStudyId?.investigationOrderId?.patientId?.patientName}</td>
                      <td>{r.radiologyStudyId?.investigationOrderId?.investigationId?.name}</td>
                      <td className="text-[10px] max-w-xs truncate">{r.findings}</td>
                      <td className="text-[10px] max-w-xs truncate">{r.impression}</td>
                      <td>{r.reportedBy?.name || 'Radiologist'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(r.reportStatus)}`}>{r.reportStatus}</span></td>
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

            {tab === 'pacs' && (
              <div className="p-4 grid grid-cols-4 gap-4">
                {data.images.map((img: any) => (
                  <div key={img._id} className="border border-border p-2 bg-muted/20 text-center">
                    <Monitor size={32} className="mx-auto text-primary/40 mb-2" />
                    <div className="text-[10px] font-bold truncate">{img.radiologyStudyId?.investigationOrderId?.patientId?.patientName}</div>
                    <div className="text-[8px] text-muted-foreground uppercase">{img.imageType}</div>
                    <div className="mt-2 flex justify-center gap-2">
                      <button className="p-1 hover:bg-primary/10 rounded"><Eye size={12} /></button>
                      <button className="p-1 hover:bg-primary/10 rounded"><Printer size={12} /></button>
                    </div>
                  </div>
                ))}
                {data.images.length === 0 && <div className="col-span-4 text-center py-10 text-muted-foreground text-xs uppercase font-bold tracking-widest">No DICOM images available in PACS</div>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'report' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Scan size={16} className="text-primary" /> Radiology Dictation & Reporting</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateReport} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Clinical Findings</label>
                <textarea className="hms-input w-full min-h-[100px]" required value={selectedItem?.findings} onChange={e => setSelectedItem({...selectedItem, findings: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Impression</label>
                <textarea className="hms-input w-full min-h-[60px]" required value={selectedItem?.impression} onChange={e => setSelectedItem({...selectedItem, impression: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Radiologist</label>
                  <select className="hms-select w-full" required value={selectedItem?.reportedBy} onChange={e => setSelectedItem({...selectedItem, reportedBy: e.target.value})}>
                    <option value="">-- Select Radiologist --</option>
                    {data.users.map((u: any) => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Report Status</label>
                  <select className="hms-select w-full" required value={selectedItem?.reportStatus} onChange={e => setSelectedItem({...selectedItem, reportStatus: e.target.value})}>
                    <option value="Draft">Draft</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save & Finalize Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Radiology;
