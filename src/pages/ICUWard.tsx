import React, { useState, useEffect } from 'react';
import { BedDouble, Activity, AlertTriangle, Thermometer, RefreshCw, User, Droplets, Plus, Edit } from 'lucide-react';
import { 
  apiRequest, 
  extractArray, 
  getIcuDashboardStats,
  searchIcuAdmissions,
  recordIcuIntakeOutput,
  recordIcuMonitoring,
  admitIcuPatient,
  getAutoUsers,
  getAutoDepartments
} from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 
    'Occupied': 'bg-red-50 text-red-700 border-red-200', 
    'Vacant': 'bg-green-50 text-green-700 border-green-200', 
    'Reserved': 'bg-yellow-50 text-yellow-700 border-yellow-200', 
    'Critical': 'bg-red-600 text-white border-red-700', 
    'Stable': 'bg-blue-50 text-blue-700 border-blue-200', 
    'Improving': 'bg-indigo-50 text-indigo-700 border-indigo-200', 
    'On Ventilator': 'bg-purple-50 text-purple-700 border-purple-200',
    'Self': 'bg-slate-50 text-slate-700 border-slate-200'
  };
  return <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${c[status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{status}</span>;
};

const ICUWard = () => {
  const tabs = ['Dashboard','Admissions','Patient Monitor','Intake/Output'];
  const [tab, setTab] = useState('Dashboard');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [availableBeds, setAvailableBeds] = useState<any[]>([]);

  // Modals
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [showIoModal, setShowIoModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  // Forms
  const [monitoringForm, setMonitoringForm] = useState({
    heartRate: '', bloodPressure: '', respiratoryRate: '', temperature: '',
    spo2: '', map: '', ventilatorMode: '', peep: '', fio2: '',
    tidalVolume: '', gcsScore: '', pupilSize: '', sedationScale: '', notes: ''
  });
  const [ioForm, setIoForm] = useState({ intakeType: '', intakeAmount: '', intakeDescription: '', outputType: '', outputAmount: '', outputDescription: '', recordedBy: '' });
  const [admitForm, setAdmitForm] = useState({
    patientId: '',
    bedId: '',
    assignedDoctorId: '',
    severityIndex: 'Stable',
    diagnosis: '',
    isolationType: 'None'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, aRes, docRes, depRes, bRes] = await Promise.all([
        getIcuDashboardStats(),
        searchIcuAdmissions({ page: 0, size: 50 }),
        getAutoUsers({ role: 'DOCTOR' }),
        getAutoDepartments(),
        apiRequest('/api/v1/ipd/beds')
      ]);

      if (sRes.ok) setStats(sRes.data?.data);
      if (aRes.ok) setAdmissions(aRes.data?.data?.content || aRes.data?.content || []);
      if (docRes.ok) setDoctors(extractArray(docRes));
      if (depRes.ok) setDepartments(extractArray(depRes));
      if (bRes.ok) setAvailableBeds(extractArray(bRes).filter((b: any) => b.available && b.ward?.type === 'ICU'));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveMonitoring = async () => {
    if (!selectedAdmission?.id) return;
    setLoading(true);
    try {
      const res = await recordIcuMonitoring(selectedAdmission.id, monitoringForm);
      if (res.ok) {
        toast({ title: "Success", description: "Vitals recorded." });
        setShowMonitoringModal(false);
        fetchData();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSaveIo = async () => {
    if (!selectedAdmission?.id) return;
    setLoading(true);
    try {
      const res = await recordIcuIntakeOutput(selectedAdmission.id, ioForm);
      if (res.ok) {
        toast({ title: "Success", description: "I/O recorded." });
        setShowIoModal(false);
        fetchData();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdmit = async () => {
    setLoading(true);
    try {
      const res = await admitIcuPatient(admitForm);
      if (res.ok) {
        toast({ title: "Success", description: "Patient admitted to ICU." });
        setShowAdmitModal(false);
        fetchData();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full space-y-3 overflow-y-auto pb-4 pr-1">
      {/* Header */}
      <div className="flex items-center justify-between bg-card border border-border p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <BedDouble size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">ICU & Ward Management</h1>
            <p className="text-[10px] text-muted-foreground">Critical Care Unit Dashboard</p>
          </div>
        </div>
        <button 
          onClick={fetchData} 
          className="hms-btn-secondary p-1.5 rounded-full" 
          title="Refresh Data"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-card border border-border p-1 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            className={`px-3 py-1 text-[11px] font-semibold transition-all whitespace-nowrap ${
              tab === t 
                ? 'bg-primary text-white' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {tab === 'Dashboard' && (
          <div className="space-y-3 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { l: 'Total Beds', v: stats?.totalBeds || '0', i: <BedDouble size={16} />, c: 'text-blue-600' },
                { l: 'Occupied', v: stats?.occupiedBeds || '0', i: <User size={16} />, c: 'text-rose-600' },
                { l: 'Occupancy %', v: stats?.occupancyRate || '0%', i: <Activity size={16} />, c: 'text-amber-600' },
                { l: 'Critical', v: stats?.criticalPatients || '0', i: <AlertTriangle size={16} />, c: 'text-red-700' },
                { l: 'On Vent', v: stats?.ventilatorStats?.onVentilator || '0', i: <Thermometer size={16} />, c: 'text-purple-600' }
              ].map((k, i) => (
                <div key={i} className="bg-card border border-border p-2.5 hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`${k.c} opacity-70`}>{k.i}</div>
                    <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wide">{k.l}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground leading-tight">{k.v}</p>
                </div>
              ))}
            </div>

            {/* Simple Patient Overview in Dashboard */}
            <div className="border border-border bg-card">
              <div className="hms-section-header flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity size={12} />
                  <span className="font-semibold">Recent Critical Patients</span>
                </div>
                <button onClick={() => setTab('Admissions')} className="text-[10px] font-bold uppercase hover:underline opacity-80">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th className="px-3 py-2">Patient Name</th>
                      <th className="px-3 py-2 text-center">Bed</th>
                      <th className="px-3 py-2">Attending Doctor</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissions.slice(0, 5).map((a, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <div className="font-bold text-foreground">{a.patient?.fullName}</div>
                          <div className="text-[9px] text-muted-foreground font-mono">{a.patient?.uhid}</div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-[10px]">
                            {a.icuAdmission?.bed?.bedNumber || a.bed?.bedNumber}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{a.assignedDoctor?.user?.fullName || 'N/A'}</td>
                        <td className="px-3 py-2"><StatusBadge status={a.severityIndex || 'Stable'} /></td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => { setSelectedAdmission(a); setShowMonitoringModal(true); }} className="p-1 hover:bg-muted rounded text-primary" title="Vitals"><Activity size={12} /></button>
                            <button onClick={() => { setSelectedAdmission(a); setShowIoModal(true); }} className="p-1 hover:bg-muted rounded text-blue-600" title="I/O"><Droplets size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'Admissions' && (
          <div className="border border-border bg-card animate-in slide-in-from-right-1 duration-300">
            <div className="hms-section-header flex items-center justify-between">
              <span className="font-semibold">Current ICU Admissions</span>
              <button onClick={() => setShowAdmitModal(true)} className="hms-btn-secondary py-0.5 px-2 flex items-center gap-1 text-[10px] bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Plus size={12} /> Admit Patient
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th className="px-3 py-2">Bed No</th>
                    <th className="px-3 py-2">Patient Details</th>
                    <th className="px-3 py-2">Primary Doctor</th>
                    <th className="px-3 py-2">Admission Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">
                        <span className="text-primary font-bold text-sm">{a.icuAdmission?.bed?.bedNumber || a.bed?.bedNumber}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-bold text-foreground">{a.patient?.fullName}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{a.patient?.uhid}</div>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{a.assignedDoctor?.user?.fullName}</td>
                      <td className="px-3 py-2"><StatusBadge status={a.status} /></td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <button onClick={() => { setSelectedAdmission(a); setShowMonitoringModal(true); }} className="hms-btn-secondary p-1 flex items-center gap-1 text-[10px]"><Activity size={12}/> Vitals</button>
                          <button onClick={() => { setSelectedAdmission(a); setShowIoModal(true); }} className="hms-btn-secondary p-1 flex items-center gap-1 text-[10px] text-rose-600"><Droplets size={12}/> I/O</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Patient Monitor' && (
          <div className="border border-border bg-card animate-in slide-in-from-right-1 duration-300">
            <div className="hms-section-header">
              <span className="font-semibold">Live Vitals Monitoring</span>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th className="px-3 py-2">Bed</th>
                    <th className="px-3 py-2">Patient</th>
                    <th className="px-3 py-2">SpO2</th>
                    <th className="px-3 py-2">BP</th>
                    <th className="px-3 py-2">HR</th>
                    <th className="px-3 py-2">Temp</th>
                    <th className="px-3 py-2">Support</th>
                    <th className="px-3 py-2 text-right">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2 font-bold text-primary">{a.icuAdmission?.bed?.bedNumber || a.bed?.bedNumber}</td>
                      <td className="px-3 py-2 font-bold text-foreground">{a.patient?.fullName}</td>
                      <td className="px-3 py-2">
                        <span className={`text-sm font-bold ${parseInt(a.latestMonitoring?.spo2) < 94 ? 'text-red-600' : 'text-green-600'}`}>
                          {a.latestMonitoring?.spo2 || '--'}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[10px] font-mono text-muted-foreground">{a.latestMonitoring?.bloodPressure || '--'}</td>
                      <td className="px-3 py-2 text-[10px] font-mono text-muted-foreground">{a.latestMonitoring?.heartRate || '--'}</td>
                      <td className="px-3 py-2 text-[10px] font-mono text-muted-foreground">{a.latestMonitoring?.temperature || '--'}°C</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={a.latestMonitoring?.ventilatorMode ? 'On Ventilator' : 'Self'} />
                        {a.latestMonitoring?.ventilatorMode && <span className="ml-1 text-[9px] text-muted-foreground font-mono italic">({a.latestMonitoring.ventilatorMode})</span>}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => { setSelectedAdmission(a); setShowMonitoringModal(true); }} className="p-1 hover:bg-muted rounded text-primary"><Edit size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Intake/Output' && (
          <div className="border border-border bg-card animate-in slide-in-from-right-1 duration-300">
            <div className="hms-section-header">
              <span className="font-semibold">24h Fluid Balance Tracker</span>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th className="px-3 py-2">Bed</th>
                    <th className="px-3 py-2">Patient</th>
                    <th className="px-3 py-2">Intake</th>
                    <th className="px-3 py-2">Output</th>
                    <th className="px-3 py-2">Net Balance</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2 font-bold text-primary">{a.icuAdmission?.bed?.bedNumber || a.bed?.bedNumber}</td>
                      <td className="px-3 py-2 font-bold text-foreground">{a.patient?.fullName}</td>
                      <td className="px-3 py-2 text-blue-700 font-semibold">{a.totalIntake || 0} ml</td>
                      <td className="px-3 py-2 text-orange-700 font-semibold">{a.totalOutput || 0} ml</td>
                      <td className={`px-3 py-2 font-semibold ${(a.totalIntake || 0) - (a.totalOutput || 0) < 0 ? 'text-red-600' : 'text-green-700'}`}>
                        {(a.totalIntake || 0) - (a.totalOutput || 0)} ml
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => { setSelectedAdmission(a); setShowIoModal(true); }} className="hms-btn-primary px-2 py-1">Record Entry</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <Dialog open={showAdmitModal} onOpenChange={setShowAdmitModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border rounded-none">
          <div className="hms-section-header flex items-center gap-2">
            <Plus size={14} /> <span>Admit Patient to ICU</span>
          </div>
          <div className="p-4 space-y-3 bg-card">
            <div className="space-y-1">
              <label className="hms-form-label">Patient UHID / ID *</label>
              <input className="hms-input w-full" placeholder="Enter UHID..." value={admitForm.patientId} onChange={e => setAdmitForm({...admitForm, patientId: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="hms-form-label">Available ICU Bed *</label>
                <select className="hms-select w-full" value={admitForm.bedId} onChange={e => setAdmitForm({...admitForm, bedId: e.target.value})}>
                  <option value="">Select Bed...</option>
                  {availableBeds.map(b => <option key={b.id} value={b.id}>{b.bedNumber} ({b.bedType})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="hms-form-label">Assigned Doctor *</label>
                <select className="hms-select w-full" value={admitForm.assignedDoctorId} onChange={e => setAdmitForm({...admitForm, assignedDoctorId: e.target.value})}>
                  <option value="">Select Doctor...</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.user?.fullName || d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="hms-form-label">Severity Index</label>
                <select className="hms-select w-full" value={admitForm.severityIndex} onChange={e => setAdmitForm({...admitForm, severityIndex: e.target.value})}>
                  <option value="Stable">Stable</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="hms-form-label">Isolation Type</label>
                <select className="hms-select w-full" value={admitForm.isolationType} onChange={e => setAdmitForm({...admitForm, isolationType: e.target.value})}>
                  <option value="None">None</option>
                  <option value="Contact">Contact</option>
                  <option value="Airborne">Airborne</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="hms-form-label">Initial Diagnosis</label>
              <textarea className="hms-input w-full h-16" placeholder="Reason for ICU admission..." value={admitForm.diagnosis} onChange={e => setAdmitForm({...admitForm, diagnosis: e.target.value})} />
            </div>
          </div>
          <div className="p-3 bg-muted border-t border-border flex justify-end gap-2">
            <button className="hms-btn-secondary" onClick={() => setShowAdmitModal(false)}>Cancel</button>
            <button className="hms-btn-primary" onClick={handleAdmit} disabled={loading || !admitForm.patientId || !admitForm.bedId}>
              Admit Patient
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMonitoringModal} onOpenChange={setShowMonitoringModal}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border rounded-none">
          <div className="hms-section-header flex items-center gap-2">
            <Activity size={14} /> <span>Vitals Assessment</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3 bg-card">
            {[
              { id: 'heartRate', l: 'Heart Rate (bpm)', p: '72' },
              { id: 'bloodPressure', l: 'Blood Pressure', p: '120/80' },
              { id: 'respiratoryRate', l: 'Resp Rate', p: '18' },
              { id: 'temperature', l: 'Temp (°C)', p: '37.0' },
              { id: 'spo2', l: 'SpO2 (%)', p: '98' },
              { id: 'gcsScore', l: 'GCS Score', p: '15' }
            ].map(f => (
              <div key={f.id} className="space-y-1">
                <label className="hms-form-label">{f.l}</label>
                <input className="hms-input w-full font-mono" placeholder={f.p} value={(monitoringForm as any)[f.id]} onChange={e => setMonitoringForm({...monitoringForm, [f.id]: e.target.value})} />
              </div>
            ))}
            <div className="col-span-2 space-y-1">
              <label className="hms-form-label">Clinical Observation Notes</label>
              <textarea className="hms-input w-full h-16" value={monitoringForm.notes} onChange={e => setMonitoringForm({...monitoringForm, notes: e.target.value})} />
            </div>
          </div>
          <div className="p-3 bg-muted border-t border-border flex justify-end gap-2">
            <button className="hms-btn-secondary" onClick={() => setShowMonitoringModal(false)}>Cancel</button>
            <button className="hms-btn-primary" onClick={handleSaveMonitoring} disabled={loading}>
              Save Assessment
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* I/O Modal */}
      <Dialog open={showIoModal} onOpenChange={setShowIoModal}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border rounded-none">
          <div className="hms-section-header flex items-center gap-2">
            <Droplets size={14} /> <span>Fluid Balance</span>
          </div>
          <div className="p-4 space-y-4 bg-card">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="hms-form-label text-blue-600">Intake Type</label>
                <input className="hms-input w-full" placeholder="e.g. IV Fluids" value={ioForm.intakeType} onChange={e => setIoForm({...ioForm, intakeType: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="hms-form-label text-blue-600">Amount (ml)</label>
                <input className="hms-input w-full" type="number" placeholder="500" value={ioForm.intakeAmount} onChange={e => setIoForm({...ioForm, intakeAmount: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="hms-form-label text-orange-600">Output Type</label>
                <input className="hms-input w-full" placeholder="e.g. Urine" value={ioForm.outputType} onChange={e => setIoForm({...ioForm, outputType: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="hms-form-label text-orange-600">Amount (ml)</label>
                <input className="hms-input w-full" type="number" placeholder="200" value={ioForm.outputAmount} onChange={e => setIoForm({...ioForm, outputAmount: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="p-3 bg-muted border-t border-border flex justify-end gap-2">
            <button className="hms-btn-secondary" onClick={() => setShowIoModal(false)}>Cancel</button>
            <button className="hms-btn-primary bg-rose-600 hover:bg-rose-700" onClick={handleSaveIo} disabled={loading}>
              Update Balance
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ICUWard;
