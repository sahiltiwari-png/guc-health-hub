import React, { useState } from 'react';
import { FlaskConical, Eye, Printer, Plus, Clock, CheckCircle2, AlertTriangle, Microscope, TestTube, FileText } from 'lucide-react';

const sampleTracking = [
  { id: 'SMP-6001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', age: '45Y', sample: 'Blood (EDTA)', test: 'CBC, ESR', collectedBy: 'Tech. Ravi', collectedAt: '08:15 AM', receivedLab: '08:30 AM', dept: 'Hematology', barcode: 'BC-6001', status: 'Processing' },
  { id: 'SMP-6002', uhid: 'U-1002', patient: 'Mrs. Sunita Devi', age: '32Y', sample: 'Blood (Plain)', test: 'LFT, KFT, Lipid Profile', collectedBy: 'Tech. Amit', collectedAt: '08:20 AM', receivedLab: '08:35 AM', dept: 'Biochemistry', barcode: 'BC-6002', status: 'Processing' },
  { id: 'SMP-6003', uhid: 'U-1003', patient: 'Mr. Amit Sharma', age: '28Y', sample: 'Urine (Mid-stream)', test: 'Routine/Microscopy', collectedBy: 'Tech. Ravi', collectedAt: '08:30 AM', receivedLab: '08:45 AM', dept: 'Pathology', barcode: 'BC-6003', status: 'Completed' },
  { id: 'SMP-6004', uhid: 'U-1004', patient: 'Baby Riya', age: '2Y', sample: 'Blood (EDTA)', test: 'Blood Culture', collectedBy: 'Tech. Sunita', collectedAt: '09:00 AM', receivedLab: '09:20 AM', dept: 'Microbiology', barcode: 'BC-6004', status: 'Incubation' },
  { id: 'SMP-6005', uhid: 'U-1005', patient: 'Mr. Suresh Yadav', age: '55Y', sample: 'Blood (Citrate)', test: 'PT/INR, aPTT', collectedBy: 'Tech. Ravi', collectedAt: '09:15 AM', receivedLab: '09:30 AM', dept: 'Hematology', barcode: 'BC-6005', status: 'Completed' },
  { id: 'SMP-6006', uhid: 'U-1012', patient: 'Mr. Suresh Pal', age: '38Y', sample: 'Sputum', test: 'AFB Smear, Culture', collectedBy: 'Self-collected', collectedAt: '07:00 AM', receivedLab: '08:00 AM', dept: 'Microbiology', barcode: 'BC-6006', status: 'Processing' },
  { id: 'SMP-6007', uhid: 'U-1015', patient: 'Mrs. Anita Devi', age: '40Y', sample: 'Blood (Plain)', test: 'Thyroid Profile', collectedBy: 'Tech. Amit', collectedAt: '09:30 AM', receivedLab: '09:45 AM', dept: 'Biochemistry', barcode: 'BC-6007', status: 'Pending Collection' },
  { id: 'SMP-6008', uhid: 'U-1020', patient: 'Mr. Dinesh Kumar', age: '60Y', sample: 'Stool', test: 'Occult Blood, Ova/Cyst', collectedBy: 'Self-collected', collectedAt: '06:30 AM', receivedLab: '08:00 AM', dept: 'Pathology', barcode: 'BC-6008', status: 'Completed' },
];

const labReports = [
  { id: 'RPT-7001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', test: 'CBC', result: 'Hb: 12.5, WBC: 8200, Plt: 2.5L', normalRange: 'Hb: 13-17, WBC: 4k-11k', flag: 'Low Hb', doctor: 'Dr. Alok Mehta', verifiedBy: 'Dr. S.K. Mishra', date: '15-Feb-2026', status: 'Verified' },
  { id: 'RPT-7002', uhid: 'U-1003', patient: 'Mr. Amit Sharma', test: 'Urine R/M', result: 'Pus Cells: 2-4, RBC: Nil, Albumin: Nil', normalRange: 'Pus: 0-5, RBC: Nil', flag: 'Normal', doctor: 'Dr. Rahul Verma', verifiedBy: 'Dr. S.K. Mishra', date: '15-Feb-2026', status: 'Verified' },
  { id: 'RPT-7003', uhid: 'U-1005', patient: 'Mr. Suresh Yadav', test: 'PT/INR', result: 'PT: 18.5s, INR: 1.8', normalRange: 'PT: 11-15s, INR: 0.8-1.2', flag: 'High INR', doctor: 'Dr. Alok Mehta', verifiedBy: 'Pending', date: '15-Feb-2026', status: 'Pending Verification' },
  { id: 'RPT-7004', uhid: 'U-1008', patient: 'Mr. Dinesh Kumar', test: 'Stool Occult Blood', result: 'Positive', normalRange: 'Negative', flag: 'Abnormal', doctor: 'Dr. Rahul Verma', verifiedBy: 'Pending', date: '15-Feb-2026', status: 'Pending Verification' },
];

const equipmentList = [
  { id: 'EQ-01', name: 'Hematology Analyzer (Sysmex XN-1000)', dept: 'Hematology', calibrated: '01-Feb-2026', nextCalib: '01-Mar-2026', qcStatus: 'Pass', samplesProcessed: 12450, status: 'Online' },
  { id: 'EQ-02', name: 'Chemistry Analyzer (Vitros 5600)', dept: 'Biochemistry', calibrated: '05-Feb-2026', nextCalib: '05-Mar-2026', qcStatus: 'Pass', samplesProcessed: 18900, status: 'Online' },
  { id: 'EQ-03', name: 'Coagulation Analyzer (STA Compact)', dept: 'Hematology', calibrated: '10-Feb-2026', nextCalib: '10-Mar-2026', qcStatus: 'Pass', samplesProcessed: 4560, status: 'Online' },
  { id: 'EQ-04', name: 'Blood Culture System (BacT/ALERT)', dept: 'Microbiology', calibrated: '15-Jan-2026', nextCalib: '15-Feb-2026', qcStatus: 'Due', samplesProcessed: 2340, status: 'Calibration Due' },
  { id: 'EQ-05', name: 'ELISA Reader', dept: 'Serology', calibrated: '20-Jan-2026', nextCalib: '20-Feb-2026', qcStatus: 'Pass', samplesProcessed: 6780, status: 'Online' },
  { id: 'EQ-06', name: 'ABG Analyzer (GEM Premier 4000)', dept: 'Critical Care Lab', calibrated: '12-Feb-2026', nextCalib: '12-Mar-2026', qcStatus: 'Pass', samplesProcessed: 890, status: 'Online' },
];

const testMaster = [
  { code: 'T-001', name: 'Complete Blood Count (CBC)', dept: 'Hematology', sample: 'EDTA Blood', tat: '2 hrs', price: 350, method: 'Automated', outsourced: false },
  { code: 'T-002', name: 'Liver Function Test (LFT)', dept: 'Biochemistry', sample: 'Plain Blood', tat: '4 hrs', price: 850, method: 'Automated', outsourced: false },
  { code: 'T-003', name: 'Kidney Function Test (KFT)', dept: 'Biochemistry', sample: 'Plain Blood', tat: '4 hrs', price: 650, method: 'Automated', outsourced: false },
  { code: 'T-004', name: 'Thyroid Profile (T3/T4/TSH)', dept: 'Biochemistry', sample: 'Plain Blood', tat: '6 hrs', price: 950, method: 'CLIA', outsourced: false },
  { code: 'T-005', name: 'Blood Culture & Sensitivity', dept: 'Microbiology', sample: 'Blood Culture Bottle', tat: '48-72 hrs', price: 1200, method: 'Automated', outsourced: false },
  { code: 'T-006', name: 'HbA1c', dept: 'Biochemistry', sample: 'EDTA Blood', tat: '4 hrs', price: 550, method: 'HPLC', outsourced: false },
  { code: 'T-007', name: 'Vitamin D (25-OH)', dept: 'Biochemistry', sample: 'Plain Blood', tat: '24 hrs', price: 1500, method: 'CLIA', outsourced: true },
  { code: 'T-008', name: 'CT Guided Biopsy (Histopath)', dept: 'Histopathology', sample: 'Tissue', tat: '5-7 days', price: 3500, method: 'Manual', outsourced: true },
];

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
  const [tab, setTab] = useState<Tab>('samples');
  const [search, setSearch] = useState('');

  const completed = sampleTracking.filter(s => s.status === 'Completed').length;
  const processing = sampleTracking.filter(s => s.status === 'Processing').length;

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><FlaskConical size={16} /> Laboratory Management System</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search patient/sample..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary"><Plus size={12} /> New Sample</button>
          <button className="hms-btn-secondary">Export</button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1 my-1">
        {[
          { label: 'Total Samples', value: sampleTracking.length },
          { label: 'Completed', value: completed },
          { label: 'Processing', value: processing, color: 'text-primary' },
          { label: 'Pending', value: 1, color: 'text-destructive' },
          { label: 'Reports Ready', value: labReports.length },
          { label: 'Pending Verify', value: 2, color: 'text-destructive' },
          { label: 'Abnormal', value: 2, color: 'text-destructive' },
          { label: 'Revenue', value: '₹34.5K' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-1 text-center">
            <div className={`text-base font-bold ${k.color || ''}`}>{k.value}</div>
            <div className="text-[8px] text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-0 bg-primary overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${tab === t.key ? 'bg-card text-foreground' : 'text-primary-foreground hover:bg-primary-foreground/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border">
        {tab === 'samples' && (
          <table className="hms-table">
            <thead><tr><th>Sample ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Sample Type</th><th>Test</th><th>Collected By</th><th>Collected At</th><th>Received</th><th>Dept</th><th>Barcode</th><th>Status</th></tr></thead>
            <tbody>
              {sampleTracking.filter(s => s.patient.toLowerCase().includes(search.toLowerCase())).map(s => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.id}</td><td>{s.uhid}</td><td>{s.patient}</td><td>{s.age}</td>
                  <td className="text-[10px]">{s.sample}</td><td className="text-[10px]">{s.test}</td><td>{s.collectedBy}</td><td>{s.collectedAt}</td><td>{s.receivedLab}</td>
                  <td>{s.dept}</td><td className="text-[10px] font-mono">{s.barcode}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${s.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : s.status === 'Processing' ? 'bg-hms-info text-primary-foreground' : s.status === 'Incubation' ? 'bg-hms-warning' : 'bg-muted text-foreground'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reports' && (
          <table className="hms-table">
            <thead><tr><th>Report ID</th><th>UHID</th><th>Patient</th><th>Test</th><th>Result</th><th>Normal Range</th><th>Flag</th><th>Doctor</th><th>Verified By</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {labReports.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.uhid}</td><td>{r.patient}</td><td>{r.test}</td>
                  <td className="text-[10px] max-w-[150px]">{r.result}</td><td className="text-[10px] max-w-[120px]">{r.normalRange}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${r.flag === 'Normal' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{r.flag}</span></td>
                  <td>{r.doctor}</td><td>{r.verifiedBy}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.status === 'Verified' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{r.status}</span></td>
                  <td><Eye size={12} className="text-primary cursor-pointer inline mr-1" /><Printer size={12} className="text-primary cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'equipment' && (
          <table className="hms-table">
            <thead><tr><th>ID</th><th>Equipment</th><th>Department</th><th>Last Calibrated</th><th>Next Calibration</th><th>QC</th><th>Samples Processed</th><th>Status</th></tr></thead>
            <tbody>
              {equipmentList.map(e => (
                <tr key={e.id}>
                  <td className="font-semibold">{e.id}</td><td className="text-[10px]">{e.name}</td><td>{e.dept}</td><td>{e.calibrated}</td><td>{e.nextCalib}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${e.qcStatus === 'Pass' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.qcStatus}</span></td>
                  <td>{e.samplesProcessed.toLocaleString()}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${e.status === 'Online' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'testmaster' && (
          <table className="hms-table">
            <thead><tr><th>Code</th><th>Test Name</th><th>Department</th><th>Sample</th><th>TAT</th><th>Price (₹)</th><th>Method</th><th>Outsourced</th></tr></thead>
            <tbody>
              {testMaster.map(t => (
                <tr key={t.code}>
                  <td className="font-semibold">{t.code}</td><td>{t.name}</td><td>{t.dept}</td><td className="text-[10px]">{t.sample}</td><td>{t.tat}</td><td>₹{t.price}</td><td>{t.method}</td>
                  <td>{t.outsourced ? <span className="text-[10px] px-1 py-0.5 bg-hms-warning">Yes</span> : <span className="text-[10px] text-muted-foreground">No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'qc' && (
          <div className="p-2 space-y-2">
            <div className="text-xs font-bold">Daily QC Results — 15-Feb-2026</div>
            <table className="hms-table">
              <thead><tr><th>Analyzer</th><th>Parameter</th><th>Level</th><th>Target</th><th>Observed</th><th>SD</th><th>CV%</th><th>Westgard</th><th>Result</th></tr></thead>
              <tbody>
                {[
                  { a: 'Sysmex XN-1000', p: 'WBC', l: 'L1', t: '5.2', o: '5.1', sd: '0.15', cv: '2.9%', w: '1-2s', r: 'Accept' },
                  { a: 'Sysmex XN-1000', p: 'Hb', l: 'L2', t: '14.5', o: '14.3', sd: '0.3', cv: '2.1%', w: '1-2s', r: 'Accept' },
                  { a: 'Vitros 5600', p: 'Glucose', l: 'L1', t: '95', o: '93', sd: '2.5', cv: '2.6%', w: '1-2s', r: 'Accept' },
                  { a: 'Vitros 5600', p: 'Creatinine', l: 'L2', t: '4.8', o: '5.2', sd: '0.2', cv: '4.2%', w: '2-2s', r: 'Warning' },
                  { a: 'STA Compact', p: 'PT', l: 'L1', t: '12.5', o: '12.4', sd: '0.3', cv: '2.4%', w: '1-2s', r: 'Accept' },
                ].map((q, i) => (
                  <tr key={i}>
                    <td className="text-[10px]">{q.a}</td><td>{q.p}</td><td>{q.l}</td><td>{q.t}</td><td>{q.o}</td><td>{q.sd}</td><td>{q.cv}</td><td>{q.w}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 ${q.r === 'Accept' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{q.r}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'outsource' && (
          <table className="hms-table">
            <thead><tr><th>S.No</th><th>Test</th><th>Lab</th><th>Patient</th><th>Sent Date</th><th>Expected</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { t: 'Vitamin D', lab: 'SRL Diagnostics', p: 'Mrs. Anita Devi', sent: '14-Feb-2026', exp: '15-Feb-2026', s: 'Report Received' },
                { t: 'CT Biopsy Histopath', lab: 'Tata Memorial Path Lab', p: 'Mr. Ram Prasad', sent: '10-Feb-2026', exp: '17-Feb-2026', s: 'In Process' },
                { t: 'Genetic Panel (BRCA)', lab: 'MedGenome', p: 'Mrs. Geeta Rani', sent: '05-Feb-2026', exp: '25-Feb-2026', s: 'In Process' },
              ].map((o, i) => (
                <tr key={i}>
                  <td>{i + 1}</td><td>{o.t}</td><td>{o.lab}</td><td>{o.p}</td><td>{o.sent}</td><td>{o.exp}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${o.s === 'Report Received' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-info text-primary-foreground'}`}>{o.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'tat' && (
          <div className="p-2">
            <div className="text-xs font-bold mb-1">Turnaround Time Analysis — Today</div>
            <table className="hms-table">
              <thead><tr><th>Department</th><th>Avg TAT</th><th>Target TAT</th><th>Within Target</th><th>Breached</th><th>Compliance %</th></tr></thead>
              <tbody>
                {[
                  { d: 'Hematology', avg: '1h 45m', target: '2h', within: 28, breached: 2, comp: '93%' },
                  { d: 'Biochemistry', avg: '3h 30m', target: '4h', within: 35, breached: 5, comp: '88%' },
                  { d: 'Microbiology', avg: '36h', target: '48h', within: 8, breached: 1, comp: '89%' },
                  { d: 'Pathology', avg: '1h 15m', target: '2h', within: 12, breached: 0, comp: '100%' },
                  { d: 'Serology', avg: '5h', target: '6h', within: 10, breached: 1, comp: '91%' },
                ].map((t, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{t.d}</td><td>{t.avg}</td><td>{t.target}</td><td>{t.within}</td>
                    <td className={t.breached > 0 ? 'text-destructive font-bold' : ''}>{t.breached}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 font-bold ${parseInt(t.comp) >= 90 ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{t.comp}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Laboratory;
