import React, { useState, useEffect } from 'react';
import { Activity, Heart, Thermometer, Wind, Droplets, Plus, X, Search, RefreshCw, Eye, History, AlertTriangle, Trash2, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getApiV1ClinicalVitals, 
  postApiV1ClinicalVitals, 
  getApiV1ClinicalVitalsHistoryBypatientId,
  deleteVisitVitals, 
  getGlobalVitals, 
  listDepartments, 
  listVisits, 
  updateVisitVitals 
} from "@/api/apiService";

type Tab = 'current' | 'history' | 'alerts' | 'configuration';

const tabs: { key: Tab; label: string }[] = [
  { key: 'current', label: 'Patient Vitals' },
  { key: 'history', label: 'Historical Trends' },
  { key: 'alerts', label: 'Abnormal Readings' },
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
    departments: [],
    history: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [globalRes, clinicalVitalsRes, visitsRes, deptsRes] = await Promise.all([
        getGlobalVitals(),
        getApiV1ClinicalVitals(),
        listVisits({ limit: 50 }),
        listDepartments()
      ]);

      const getArr = (res: any, key: string) => {
        if (!res.ok) return [];
        // The new API pattern usually returns { success, data: { content: [] } } or { success, data: [] }
        const d = res.data?.content || res.data?.data || res.data;
        if (Array.isArray(d)) return d;
        if (d && typeof d === 'object') return d[key] || d.data || [];
        return [];
      };

      setData(prev => ({
        ...prev,
        globalVitals: getArr(globalRes, 'vitals'),
        visitVitals: getArr(clinicalVitalsRes, 'vitals'),
        visits: getArr(visitsRes, 'visits'),
        departments: getArr(deptsRes, 'departments')
      }));
    } catch (error) {
      console.error('Error fetching vitals data:', error);
      toast({ title: 'Error', description: 'Failed to sync vitals data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (patientId: string) => {
    try {
      const res = await getApiV1ClinicalVitalsHistoryBypatientId(patientId);
      if (res.ok) {
        const historyData = res.data?.content || res.data?.data || res.data || [];
        setData(prev => ({ ...prev, history: Array.isArray(historyData) ? historyData : [] }));
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    if (tab === 'history' && selectedPatientId) {
      fetchHistory(selectedPatientId);
    }
  }, [tab, selectedPatientId]);

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
        await postApiV1ClinicalVitals(selectedItem);
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
    const val = parseFloat(value);
    if (isNaN(val)) return false;

    // Default ranges if no global config exists
    const defaults: any = {
      'weight': { min: 30, max: 150 },
      'temperature': { min: 36, max: 38 },
      'pulseRate': { min: 60, max: 100 },
      'respiratoryRate': { min: 12, max: 20 },
      'spo2': { min: 94, max: 100 },
      'bloodPressure': { pattern: /^\d{2,3}\/\d{2,3}$/ }
    };

    if (name === 'bloodPressure' && typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 2) {
        const sys = parseInt(parts[0]);
        const dia = parseInt(parts[1]);
        return sys < 90 || sys > 140 || dia < 60 || dia > 90;
      }
      return false;
    }

    const config = data.globalVitals.find((v: any) => v.name?.toLowerCase().includes(name?.toLowerCase() || '')) || defaults[name];
    if (!config) return false;
    
    const min = config.normalMin !== undefined ? config.normalMin : config.min;
    const max = config.normalMax !== undefined ? config.normalMax : config.max;
    
    if (min !== undefined && val < min) return true;
    if (max !== undefined && val > max) return true;
    
    return false;
  };

  const getAbnormalVitals = (vv: any) => {
    const alerts = [];
    if (isAbnormal('weight', vv.weight)) alerts.push(`Weight: ${vv.weight}`);
    if (isAbnormal('temperature', vv.temperature)) alerts.push(`Temp: ${vv.temperature}`);
    if (isAbnormal('pulseRate', vv.pulseRate)) alerts.push(`Pulse: ${vv.pulseRate}`);
    if (isAbnormal('respiratoryRate', vv.respiratoryRate)) alerts.push(`Resp: ${vv.respiratoryRate}`);
    if (isAbnormal('spo2', vv.spo2)) alerts.push(`SpO2: ${vv.spo2}`);
    if (isAbnormal('bloodPressure', vv.bloodPressure)) alerts.push(`BP: ${vv.bloodPressure}`);
    return alerts;
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
            setSelectedItem({ 
              patientId: '', 
              recordedAt: new Date().toISOString(),
              weight: 0,
              height: 0,
              bloodPressure: '',
              temperature: 0,
              pulseRate: 0,
              respiratoryRate: 0,
              spo2: 0,
              remark: '',
              opdVisitId: null,
              admissionId: null
            });
            setShowModal('vitals');
          }}><Plus size={14} /> Record Vitals</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Today Recorded', value: Array.isArray(data.visitVitals) ? data.visitVitals.length : 0, color: 'text-primary' },
          { label: 'Abnormal Readings', value: Array.isArray(data.visitVitals) ? data.visitVitals.filter((vv: any) => getAbnormalVitals(vv).length > 0).length : 0, color: 'text-destructive' },
          { label: 'Active Monitors', value: 7, color: 'text-hms-success' },
          { label: 'Critical Alerts', value: Array.isArray(data.visitVitals) ? data.visitVitals.filter((vv: any) => (vv.spo2 > 0 && vv.spo2 < 90) || (vv.pulseRate > 0 && (vv.pulseRate < 40 || vv.pulseRate > 140))).length : 0, color: 'text-destructive' },
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
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Recorded At</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>BP</th>
                    <th>Temp</th>
                    <th>Pulse</th>
                    <th>Resp</th>
                    <th>SpO2</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(data.visitVitals) ? data.visitVitals : []).filter((vv: any) => {
                    const patientName = vv.patientId?.patientName || '';
                    const uhid = vv.patientId?.uhid || '';
                    const searchStr = search.toLowerCase();
                    return patientName.toLowerCase().includes(searchStr) || 
                           uhid.toLowerCase().includes(searchStr);
                  }).map((vv: any) => (
                    <tr key={vv.id}>
                      <td>
                        <div className="font-bold">{vv.patientId?.patientName || 'N/A'}</div>
                        <div className="text-[10px] text-muted-foreground">UHID: {vv.patientId?.uhid || 'N/A'}</div>
                      </td>
                      <td>{vv.recordedAt ? new Date(vv.recordedAt).toLocaleString() : 'N/A'}</td>
                      <td>{vv.weight} <span className="text-[10px] text-muted-foreground">kg</span></td>
                      <td>{vv.height} <span className="text-[10px] text-muted-foreground">cm</span></td>
                      <td>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isAbnormal('Blood Pressure', vv.bloodPressure) ? 'bg-destructive/10 text-destructive' : 'bg-muted'}`}>
                          {vv.bloodPressure || '-'}
                        </span>
                      </td>
                      <td>{vv.temperature}°C</td>
                      <td>{vv.pulseRate} <span className="text-[10px] text-muted-foreground">bpm</span></td>
                      <td>{vv.respiratoryRate}</td>
                      <td>{vv.spo2}%</td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" title="View/Edit" onClick={() => {
                            setSelectedItem(vv);
                            setShowModal('vitals');
                          }}><Eye size={14} /></button>
                          <button className="text-hms-info hover:bg-hms-info/10 p-1 rounded" title="History" onClick={() => {
                            setSelectedPatientId(vv.patientId?.id || vv.patientId);
                            setTab('history');
                          }}><History size={14} /></button>
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => handleDeleteVitals(vv.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'history' && (
              <div className="p-4">
                {!selectedPatientId ? (
                  <div className="text-center py-10 text-muted-foreground text-xs uppercase font-bold tracking-widest">
                    Select a patient from the list to view historical trends
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-muted/30 p-3 border border-border">
                      <h4 className="text-xs font-bold uppercase tracking-wider">Historical Vitals for Patient ID: {selectedPatientId}</h4>
                      <button className="hms-btn-secondary text-[10px]" onClick={() => setSelectedPatientId(null)}>Clear Selection</button>
                    </div>
                    <table className="hms-table">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Weight</th>
                          <th>Height</th>
                          <th>BP</th>
                          <th>Temp</th>
                          <th>Pulse</th>
                          <th>Resp</th>
                          <th>SpO2</th>
                          <th>Recorded By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.history.map((h: any) => (
                          <tr key={h.id}>
                            <td>{new Date(h.recordedAt).toLocaleString()}</td>
                            <td>{h.weight} kg</td>
                            <td>{h.height} cm</td>
                            <td>{h.bloodPressure}</td>
                            <td>{h.temperature}°C</td>
                            <td>{h.pulseRate}</td>
                            <td>{h.respiratoryRate}</td>
                            <td>{h.spo2}%</td>
                            <td>{h.recordedBy || 'System'}</td>
                          </tr>
                        ))}
                        {data.history.length === 0 && (
                          <tr><td colSpan={9} className="text-center py-4">No history found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {tab === 'alerts' && (
              <div className="p-4 space-y-4">
                {(Array.isArray(data.visitVitals) ? data.visitVitals : []).filter((vv: any) => getAbnormalVitals(vv).length > 0).map((vv: any) => (
                  <div key={vv.id} className="border border-destructive/20 bg-destructive/5 p-3 rounded flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-destructive" size={20} />
                      <div>
                        <div className="font-bold text-sm">{vv.patientId?.patientName} (UHID: {vv.patientId?.uhid})</div>
                        <div className="text-xs text-muted-foreground">Recorded: {new Date(vv.recordedAt).toLocaleString()}</div>
                        <div className="flex gap-2 mt-1">
                          {getAbnormalVitals(vv).map((alert: string) => (
                            <span key={alert} className="text-[10px] font-bold text-destructive underline decoration-dotted decoration-destructive/50">{alert}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="hms-btn-secondary text-[10px]">Acknowledge</button>
                  </div>
                ))}
                {data.visitVitals.filter((vv: any) => getAbnormalVitals(vv).length > 0).length === 0 && (
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
                  <select 
                    className="hms-select w-full" 
                    required 
                    value={selectedItem?.patientId?.id || selectedItem?.patientId || ''} 
                    onChange={e => {
                      const visit = data.visits.find((v: any) => v.patientId?.id === e.target.value || v.patientId === e.target.value);
                      setSelectedItem({
                        ...selectedItem, 
                        patientId: e.target.value,
                        opdVisitId: visit?.id,
                        // If it's an IPD visit, we might set admissionId instead, 
                        // but for now we'll assume visit is the primary link
                      })
                    }} 
                    disabled={!!selectedItem?.id}
                  >
                    <option value="">-- Select Patient --</option>
                    {data.visits.map((v: any) => (
                      <option key={v.id} value={v.patientId?.id || v.patientId}>
                        {v.patientId?.patientName} (UHID: {v.patientId?.uhid}) - {new Date(v.visitDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Recorded At</label>
                  <input 
                    type="datetime-local" 
                    className="hms-input w-full" 
                    required 
                    value={selectedItem?.recordedAt ? new Date(selectedItem.recordedAt).toISOString().slice(0, 16) : ''} 
                    onChange={e => setSelectedItem({...selectedItem, recordedAt: new Date(e.target.value).toISOString()})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 bg-muted/10 p-4 rounded border border-border">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input type="number" step="0.1" className="hms-input w-full" value={selectedItem?.weight || ''} onChange={e => setSelectedItem({...selectedItem, weight: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Height (cm)</label>
                  <input type="number" step="0.1" className="hms-input w-full" value={selectedItem?.height || ''} onChange={e => setSelectedItem({...selectedItem, height: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Blood Pressure</label>
                  <input type="text" className="hms-input w-full" placeholder="120/80" value={selectedItem?.bloodPressure || ''} onChange={e => setSelectedItem({...selectedItem, bloodPressure: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Temperature (°C)</label>
                  <input type="number" step="0.1" className="hms-input w-full" value={selectedItem?.temperature || ''} onChange={e => setSelectedItem({...selectedItem, temperature: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Pulse Rate (bpm)</label>
                  <input type="number" className="hms-input w-full" value={selectedItem?.pulseRate || ''} onChange={e => setSelectedItem({...selectedItem, pulseRate: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Resp. Rate</label>
                  <input type="number" className="hms-input w-full" value={selectedItem?.respiratoryRate || ''} onChange={e => setSelectedItem({...selectedItem, respiratoryRate: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">SpO2 (%)</label>
                  <input type="number" className="hms-input w-full" value={selectedItem?.spo2 || ''} onChange={e => setSelectedItem({...selectedItem, spo2: parseInt(e.target.value)})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Remark</label>
                  <input type="text" className="hms-input w-full" value={selectedItem?.remark || ''} onChange={e => setSelectedItem({...selectedItem, remark: e.target.value})} />
                </div>
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
