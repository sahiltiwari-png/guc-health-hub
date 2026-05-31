import React, { useState, useEffect } from 'react';
import { FileOutput, Eye, Printer, CheckCircle, Clock, AlertTriangle, Edit, RefreshCw, X } from 'lucide-react';
import { 
  getDischarges, 
  apiRequest, 
  extractArray,
  getApiV1IpdDischargedToday,
  postApiV1IpdDischargeByadmissionId,
  postApiV1ClinicalDischargeSummary,
  getApiV1ClinicalDischargeSummaryAdmissionByadmissionId,
  getIPDAdmissions
} from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Pending': 'bg-yellow-600 text-white', 'Billing Done': 'bg-blue-700 text-white', 'Summary Ready': 'bg-green-700 text-white', 'Discharged': 'bg-green-800 text-white', 'LAMA': 'bg-red-700 text-white', 'Absconded': 'bg-red-900 text-white', 'Doctor Approval': 'bg-yellow-600 text-white', 'Cleared': 'bg-green-700 text-white', 'Pending Clearance': 'bg-yellow-600 text-white', 'Partial': 'bg-orange-600 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const Discharge = () => {
  const { toast } = useToast();
  const tabs = ['Dashboard','Pending Discharge','Discharged Today'];
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [discharges, setDischarges] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>({
    dischargeDiagnosis: '',
    summaryOfCase: '',
    treatmentGiven: '',
    medicationsAtDischarge: '',
    followUpInstructions: '',
    dischargeType: 'NORMAL'
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (targetPage = page) => {
    setLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([
        getApiV1IpdDischargedToday({ page: targetPage, size: 10 }),
        getIPDAdmissions({ status: 'ADMITTED', limit: 100 })
      ]);
      
      if (dRes.ok) {
        const d = dRes.data?.data || dRes.data;
        setDischarges(d?.content || []);
        setTotalPages(d?.totalPages || 1);
      }
      if (pRes.ok) setPending(extractArray(pRes));
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPending = pending.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.patient?.fullName?.toLowerCase().includes(query) ||
      p.patientName?.toLowerCase().includes(query) ||
      p.ipdNumber?.toLowerCase().includes(query) ||
      p.id?.toString().includes(query)
    );
  });

  useEffect(() => {
    fetchData(page);
  }, [page, tab]);

  const handlePrint = (data: any) => {
    toast({ title: 'Printing...', description: 'Preparing discharge summary for print' });
    // In a real app, this would open a print-friendly window or generate a PDF
    console.log('Printing discharge summary:', data);
    window.print();
  };

  const handleDischarge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    setLoading(true);
    try {
      // 1. Create Discharge Summary
      const summaryRes = await postApiV1ClinicalDischargeSummary({
        ...summaryData,
        admissionId: selectedAdmission.id,
        dischargeTime: new Date().toISOString()
      });

      if (!summaryRes.ok) throw new Error('Failed to create discharge summary');

      // 2. Perform actual discharge
      const dischargeRes = await postApiV1IpdDischargeByadmissionId(selectedAdmission.id);
      
      if (dischargeRes.ok) {
        toast({ title: 'Success', description: 'Patient discharged successfully' });
        setShowModal(null);
        setSummaryData({
          dischargeDiagnosis: '',
          summaryOfCase: '',
          treatmentGiven: '',
          medicationsAtDischarge: '',
          followUpInstructions: '',
          dischargeType: 'NORMAL'
        });
        fetchData();
      } else {
        throw new Error('Failed to discharge patient');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Operation failed', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><FileOutput size={14} /> Discharge & Summary Management</div>
        <button onClick={() => fetchData()} className="p-1 hover:bg-muted rounded text-primary">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[{ l: 'Pending Discharge', v: pending.length, s: 'Active Admissions' },{ l: 'Discharged Today', v: discharges.length, s: 'Normal' },{ l: 'Total Admissions', v: pending.length + discharges.length, s: 'Current Month' },{ l: 'Avg Length of Stay', v: 'Calculated', s: 'Based on History' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs text-primary font-bold">Pending Discharge Summary</div>
              <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>Ward</th><th>Status</th></tr></thead>
                <tbody>{pending.map((p: any) => <tr key={p.id}><td className="font-mono text-[10px]">{p.ipdNumber || p.id}</td><td className="font-bold">{p.patient?.fullName || p.patientName}</td><td>{p.bed?.ward?.name}</td><td><StatusBadge status="Pending" /></td></tr>)}
                {pending.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">No pending admissions</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs text-primary font-bold">Discharged Today</div>
              <table className="hms-table"><thead><tr><th>IPD</th><th>Patient</th><th>Time</th><th>Type</th></tr></thead>
                <tbody>{discharges.map((d: any) => <tr key={d.id}><td className="font-mono text-[10px]">{d.ipdNumber || d.id}</td><td className="font-bold">{d.patient?.fullName}</td><td>{new Date(d.dischargeDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td><StatusBadge status={d.status || 'NORMAL'} /></td></tr>)}
                {discharges.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">No discharges today</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Pending Discharge' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input 
              className="hms-input w-48" 
              placeholder="Search Patient/IPD..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select className="hms-select"><option>All Wards</option><option>ICU-1</option><option>ICU-2</option><option>Ward-A</option><option>Ward-B</option><option>Private</option></select>
            <select className="hms-select"><option>All Status</option><option>Pending</option><option>Doctor Approval</option><option>Summary Ready</option></select>
          </div>
          <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>UHID</th><th>Ward/Bed</th><th>Admitted</th><th>Diagnosis</th><th>Doctor</th><th>Action</th></tr></thead>
            <tbody>{filteredPending.map((p: any) => (
              <tr key={p.id}>
                <td className="font-mono text-[10px]">{p.ipdNumber || p.id}</td>
                <td className="font-bold">{p.patient?.fullName || p.patientName}</td>
                <td className="text-[10px]">{p.patient?.uhid}</td>
                <td>{p.bed?.ward?.name}/{p.bed?.bedNumber}</td>
                <td>{new Date(p.admissionDate).toLocaleDateString()}</td>
                <td>{p.diagnosis || '-'}</td>
                <td>{p.primaryDoctor?.user?.fullName}</td>
                <td className="flex gap-1">
                  <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => {
                    setSelectedAdmission(p);
                    setShowModal('discharge');
                  }}>Discharge</button>
                  <Eye size={12} className="text-primary cursor-pointer mt-1" onClick={() => {
                    setSelectedAdmission(p);
                    setShowModal('discharge');
                  }} />
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr><td colSpan={8} className="text-center py-4 text-muted-foreground">No pending discharges found</td></tr>
            )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Discharged Today' && (
        <div>
          <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>UHID</th><th>Discharged At</th><th>Type</th><th>Action</th></tr></thead>
            <tbody>{discharges.map((d: any) => (
              <tr key={d.id}>
                <td className="font-mono text-[10px]">{d.ipdNumber || d.id}</td>
                <td className="font-bold">{d.patient?.fullName}</td>
                <td>{d.patient?.uhid}</td>
                <td>{new Date(d.dischargeDate).toLocaleString()}</td>
                <td><StatusBadge status={d.status || 'NORMAL'} /></td>
                <td>
                  <div className="flex gap-2">
                    <Eye size={12} className="text-primary cursor-pointer" onClick={async () => {
                      const res = await getApiV1ClinicalDischargeSummaryAdmissionByadmissionId(d.id);
                      if (res.ok) {
                        setSummaryData(res.data?.data || res.data);
                        setShowModal('viewSummary');
                      }
                    }} />
                    <Printer size={12} className="text-muted-foreground cursor-pointer" onClick={() => handlePrint(d)} />
                  </div>
                </td>
              </tr>
            ))}
            {discharges.length === 0 && (
              <tr><td colSpan={6} className="text-center py-4 text-muted-foreground">No discharges recorded today</td></tr>
            )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-2 px-2">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Previous</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discharge Modal */}
      {showModal === 'discharge' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><FileOutput size={16} className="text-primary" /> Prepare Discharge Summary</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleDischarge} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Patient</label>
                  <div className="text-sm font-bold">{selectedAdmission?.patient?.fullName} ({selectedAdmission?.patient?.uhid})</div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Discharge Type</label>
                  <select className="hms-select w-full" value={summaryData.dischargeType} onChange={e => setSummaryData({...summaryData, dischargeType: e.target.value})}>
                    <option value="NORMAL">Normal</option>
                    <option value="LAMA">LAMA</option>
                    <option value="ABSCONDED">Absconded</option>
                    <option value="DEATH">Death</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Discharge Diagnosis</label>
                <input className="hms-input w-full" required value={summaryData.dischargeDiagnosis} onChange={e => setSummaryData({...summaryData, dischargeDiagnosis: e.target.value})} />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Summary of Case</label>
                <textarea className="hms-input w-full h-24" required value={summaryData.summaryOfCase} onChange={e => setSummaryData({...summaryData, summaryOfCase: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Treatment Given</label>
                  <textarea className="hms-input w-full h-20" value={summaryData.treatmentGiven} onChange={e => setSummaryData({...summaryData, treatmentGiven: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Medications at Discharge</label>
                  <textarea className="hms-input w-full h-20" value={summaryData.medicationsAtDischarge} onChange={e => setSummaryData({...summaryData, medicationsAtDischarge: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Follow-up Instructions</label>
                <input className="hms-input w-full" value={summaryData.followUpInstructions} onChange={e => setSummaryData({...summaryData, followUpInstructions: e.target.value})} />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Complete Discharge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Summary Modal */}
      {showModal === 'viewSummary' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm p-6 space-y-4">
             <div className="flex justify-between items-center border-b border-border pb-2">
               <h3 className="text-sm font-bold uppercase tracking-wider">Discharge Summary</h3>
               <button onClick={() => setShowModal(null)}><X size={18} /></button>
             </div>
             <div className="grid grid-cols-2 gap-4 text-xs">
                <div><span className="text-muted-foreground font-bold uppercase">Diagnosis:</span> {summaryData.dischargeDiagnosis}</div>
                <div><span className="text-muted-foreground font-bold uppercase">Type:</span> {summaryData.dischargeType}</div>
                <div className="col-span-2"><span className="text-muted-foreground font-bold uppercase block mb-1">Case Summary:</span> {summaryData.summaryOfCase}</div>
                <div><span className="text-muted-foreground font-bold uppercase block mb-1">Treatment:</span> {summaryData.treatmentGiven}</div>
                <div><span className="text-muted-foreground font-bold uppercase block mb-1">Medications:</span> {summaryData.medicationsAtDischarge}</div>
                <div className="col-span-2 bg-muted/30 p-2 border border-border"><span className="text-muted-foreground font-bold uppercase">Follow-up:</span> {summaryData.followUpInstructions}</div>
             </div>
             <div className="flex gap-2">
               <button className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Close</button>
               <button className="hms-btn-primary flex-1 flex items-center justify-center gap-2" onClick={() => handlePrint(summaryData)}><Printer size={14} /> Print Summary</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discharge;
