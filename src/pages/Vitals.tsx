import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Wind, Droplets, Plus, X, Search, RefreshCw, Eye, History, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Printer } from 'lucide-react';
import { createVisitVitals, deleteVisitVitals, getGlobalVitals, getVisitVitals, getVitalIcon, getVitalsGlobal, getVitalsVisit, listDepartments, listVisits, updateVisitVitals } from "@/api/apiService";

type Tab = 'current' | 'history' | 'alerts' | 'configuration';

const tabs: { key: Tab; label: string }[] = [
  { key: 'current', label: 'Patient Vitals' },
  { key: 'history', label: 'Historical Trends' },
  { key: 'alerts', label: 'Abnormal Readings' },
  { key: 'configuration', label: 'Global Vitals' },
];

const Vitals = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('current');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [data, setData] = useState({
    globalVitals: [],
    visitVitals: [],
    visits: [],
    departments: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [globalRes, visitVitalsRes, visitsRes, deptsRes] = await Promise.all([
        getGlobalVitals(),
        getVisitVitals(),
        listVisits({ limit: 50 }),
        listDepartments()
      ]);

      const getArr = (res: any, key: string) => {
        if (!res.ok) return [];
        const d = res.data?.data || res.data;
        if (Array.isArray(d)) return d;
        if (d && typeof d === 'object') return d[key] || d.data || [];
        return [];
      };

      setData({
        globalVitals: getArr(globalRes, 'vitals'),
        visitVitals: getArr(visitVitalsRes, 'visitVitals'),
        visits: getArr(visitsRes, 'visits'),
        departments: getArr(deptsRes, 'departments')
      });
    } catch (error) {
      console.error('Error fetching vitals data:', error);
      toast({ title: 'Error', description: 'Failed to sync vitals data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem.id) {
        await updateVisitVitals(selectedItem.id, selectedItem);
        toast({ title: 'Success', description: 'Vitals updated' });
      } else {
        await createVisitVitals(selectedItem);
        toast({ title: 'Success', description: 'Vitals recorded' });
      }
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleDeleteVitals = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vital record?')) return;
    try {
      await deleteVisitVitals(id);
      toast({ title: 'Success', description: 'Vitals deleted' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Deletion failed', variant: 'destructive' });
    }
  };

  const getVitalIcon = (name: string) => {
    if (name.includes('Pressure')) return <Activity size={16} className="text-primary" />;
    if (name.includes('Heart')) return <Heart size={16} className="text-destructive" />;
    if (name.includes('Temperature')) return <Thermometer size={16} className="text-orange-500" />;
    if (name.includes('Respiratory')) return <Wind size={16} className="text-blue-500" />;
    if (name.includes('Oxygen') || name.includes('SpO2')) return <Droplets size={16} className="text-cyan-500" />;
    return <Activity size={16} />;
  };

  const isAbnormal = (name: string, value: any) => {
    const config: any = data.globalVitals.find((v: any) => v.name === name);
    if (!config || config.dataType !== 'number') return false;
    const val = parseFloat(value);
    return val < config.normalMin || val > config.normalMax;
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Activity size={16} /> Vitals & Clinical Monitoring</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search patient..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            setSelectedItem({ visitId: '', departmentId: '', vitals: {} });
            setShowModal('vitals');
          }}><Plus size={14} /> Record Vitals</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Today Recorded', value: Array.isArray(data.visitVitals) ? data.visitVitals.length : 0, color: 'text-primary' },
          { label: 'Abnormal Readings', value: Array.isArray(data.visitVitals) ? data.visitVitals.filter((vv: any) => Object.entries(vv.vitals || {}).some(([k, v]) => isAbnormal(k, v))).length : 0, color: 'text-destructive' },
          { label: 'Active Monitors', value: Array.isArray(data.globalVitals) ? data.globalVitals.length : 0, color: 'text-hms-success' },
          { label: 'Critical Alerts', value: 0, color: 'text-destructive' },
          { label: 'Patients in Queue', value: Array.isArray(data.visits) ? data.visits.filter((v: any) => v.visitStatus === 'Active').length : 0, color: 'text-hms-info' },
          { label: 'Compliance Rate', value: '98%', color: 'text-primary' },
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
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing Clinical Data...</span>
          </div>
        ) : (
          <>
            {tab === 'current' && (
              <table className="hms-table">
                <thead><tr><th>Patient</th><th>Department</th><th>Recorded At</th><th>Vitals Summary</th><th>Recorded By</th><th>Actions</th></tr></thead>
                <tbody>
                  {(Array.isArray(data.visitVitals) ? data.visitVitals : []).filter((vv: any) => vv.visitId?.patientId?.patientName?.toLowerCase().includes(search.toLowerCase())).map((vv: any) => (
                    <tr key={vv.id}>
                      <td>
                        <div className="font-bold">{vv.visitId?.patientId?.patientName}</div>
                        <div className="text-[10px] text-muted-foreground">UHID: {vv.visitId?.patientId?.uhid}</div>
                      </td>
                      <td>{vv.departmentId?.name}</td>
                      <td>{new Date(vv.createdAt).toLocaleString()}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(vv.vitals || {}).map(([name, value]: [string, any]) => (
                            <div key={name} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${isAbnormal(name, value) ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted text-muted-foreground'}`}>
                              {getVitalIcon(name)}
                              <span>{name}: {value}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>{vv.recordedBy?.name || 'Staff'}</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" onClick={() => {
                            setSelectedItem(vv);
                            setShowModal('vitals');
                          }}><Eye size={14} /></button>
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" onClick={() => handleDeleteVitals(vv.id)}><Trash2 size={14} /></button>
                          <button className="text-muted-foreground hover:bg-muted p-1 rounded" onClick={() => window.print()}><Printer size={14} /></button>
                          <button className="text-muted-foreground hover:bg-muted p-1 rounded"><History size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'configuration' && (
              <table className="hms-table">
                <thead><tr><th>Vital Name</th><th>Unit</th><th>Data Type</th><th>Normal Range</th><th>Status</th></tr></thead>
                <tbody>
                  {(Array.isArray(data.globalVitals) ? data.globalVitals : []).map((gv: any) => (
                    <tr key={gv.id}>
                      <td className="font-bold flex items-center gap-2">
                        {getVitalIcon(gv.name)} {gv.name}
                      </td>
                      <td>{gv.unit}</td>
                      <td><span className="text-[10px] font-mono uppercase">{gv.dataType}</span></td>
                      <td>{gv.normalMin} - {gv.normalMax}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${gv.isActive ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted'}`}>{gv.isActive ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'alerts' && (
              <div className="p-4 space-y-4">
                {data.visitVitals.filter((vv: any) => Object.entries(vv.vitals || {}).some(([k, v]) => isAbnormal(k, v))).map((vv: any) => (
                  <div key={vv.id} className="border border-destructive/20 bg-destructive/5 p-3 rounded flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-destructive" size={20} />
                      <div>
                        <div className="font-bold text-sm">{vv.visitId?.patientId?.patientName} (UHID: {vv.visitId?.patientId?.uhid})</div>
                        <div className="text-xs text-muted-foreground">Department: {vv.departmentId?.name} | Recorded: {new Date(vv.createdAt).toLocaleString()}</div>
                        <div className="flex gap-2 mt-1">
                          {Object.entries(vv.vitals || {}).filter(([k, v]) => isAbnormal(k, v)).map(([k, v]) => (
                            <span key={k} className="text-[10px] font-bold text-destructive underline decoration-dotted decoration-destructive/50">{k}: {v}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="hms-btn-secondary text-[10px]">Acknowledge</button>
                  </div>
                ))}
                {data.visitVitals.filter((vv: any) => Object.entries(vv.vitals || {}).some(([k, v]) => isAbnormal(k, v))).length === 0 && (
                  <div className="text-center py-10 text-muted-foreground text-xs uppercase font-bold tracking-widest">No abnormal readings detected</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'vitals' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Activity size={16} className="text-primary" /> {selectedItem?.id ? 'Update' : 'Record'} Patient Vitals</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateVitals} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Patient Visit</label>
                  <select className="hms-select w-full" required value={selectedItem?.visitId?.id || selectedItem?.visitId} onChange={e => setSelectedItem({...selectedItem, visitId: e.target.value})} disabled={!!selectedItem?.id}>
                    <option value="">-- Select Patient Visit --</option>
                    {data.visits.map((v: any) => (
                      <option key={v.id} value={v.id}>{v.patientId?.patientName} (UHID: {v.patientId?.uhid}) - {new Date(v.visitDate).toLocaleDateString()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Department</label>
                  <select className="hms-select w-full" required value={selectedItem?.departmentId?.id || selectedItem?.departmentId} onChange={e => setSelectedItem({...selectedItem, departmentId: e.target.value})} disabled={!!selectedItem?.id}>
                    <option value="">-- Select Department --</option>
                    {data.departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-muted/10 p-4 rounded border border-border">
                {data.globalVitals.map((gv: any) => (
                  <div key={gv.id}>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center justify-between">
                      <span>{gv.name} ({gv.unit})</span>
                      {selectedItem?.vitals?.[gv.name] && isAbnormal(gv.name, selectedItem.vitals[gv.name]) && (
                        <span className="text-[8px] text-destructive flex items-center gap-0.5"><AlertTriangle size={10} /> Abnormal</span>
                      )}
                    </label>
                    <input 
                      type={gv.dataType === 'number' ? 'number' : 'text'}
                      step="any"
                      className={`hms-input w-full ${selectedItem?.vitals?.[gv.name] && isAbnormal(gv.name, selectedItem.vitals[gv.name]) ? 'border-destructive/50 bg-destructive/5' : ''}`}
                      value={selectedItem?.vitals?.[gv.name] || ''}
                      onChange={e => setSelectedItem({
                        ...selectedItem,
                        vitals: { ...selectedItem.vitals, [gv.name]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Records</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vitals;
