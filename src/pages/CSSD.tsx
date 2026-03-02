import React, { useState } from 'react';
import { ShieldCheck, ThermometerSun, Clock, CheckCircle2, AlertTriangle, Eye, Printer, Plus, RotateCcw } from 'lucide-react';

const instrumentSets = [
  { id: 'SET-001', name: 'General Surgery Set', items: 45, department: 'General Surgery', lastSterilized: '15-Feb-2026 06:00', nextDue: '15-Feb-2026 18:00', sterilizeCount: 342, status: 'Sterile' },
  { id: 'SET-002', name: 'Ortho Implant Set', items: 32, department: 'Orthopedics', lastSterilized: '15-Feb-2026 07:00', nextDue: '15-Feb-2026 19:00', sterilizeCount: 289, status: 'Sterile' },
  { id: 'SET-003', name: 'OBG Delivery Set', items: 28, department: 'Gynecology', lastSterilized: '14-Feb-2026 18:00', nextDue: '15-Feb-2026 06:00', sterilizeCount: 456, status: 'In Use' },
  { id: 'SET-004', name: 'Eye Surgery Micro Set', items: 22, department: 'Ophthalmology', lastSterilized: '15-Feb-2026 08:00', nextDue: '15-Feb-2026 20:00', sterilizeCount: 178, status: 'Sterile' },
  { id: 'SET-005', name: 'Cardiac Catheterization Set', items: 18, department: 'Cardiology', lastSterilized: '15-Feb-2026 05:00', nextDue: '15-Feb-2026 17:00', sterilizeCount: 134, status: 'Processing' },
  { id: 'SET-006', name: 'Laparoscopy Set', items: 35, department: 'General Surgery', lastSterilized: '14-Feb-2026 20:00', nextDue: '15-Feb-2026 08:00', sterilizeCount: 267, status: 'Overdue' },
  { id: 'SET-007', name: 'ENT Microscopy Set', items: 15, department: 'ENT', lastSterilized: '15-Feb-2026 09:00', nextDue: '15-Feb-2026 21:00', sterilizeCount: 198, status: 'Sterile' },
  { id: 'SET-008', name: 'Neuro Surgery Set', items: 40, department: 'Neurosurgery', lastSterilized: '15-Feb-2026 04:00', nextDue: '15-Feb-2026 16:00', sterilizeCount: 95, status: 'Sterile' },
  { id: 'SET-009', name: 'Dressing Tray (x20)', items: 8, department: 'All Wards', lastSterilized: '15-Feb-2026 06:00', nextDue: '15-Feb-2026 12:00', sterilizeCount: 1245, status: 'In Use' },
];

const sterilizationCycles = [
  { id: 'CYC-5001', machine: 'Autoclave-1 (Steam)', load: 'SET-001, SET-008', startTime: '05:30 AM', endTime: '06:15 AM', temp: '134°C', pressure: '2.1 bar', duration: '45 min', biIndicator: 'Pass', chemIndicator: 'Pass', operator: 'Ramesh', status: 'Completed' },
  { id: 'CYC-5002', machine: 'Autoclave-2 (Steam)', load: 'SET-002, SET-007', startTime: '06:30 AM', endTime: '07:15 AM', temp: '134°C', pressure: '2.1 bar', duration: '45 min', biIndicator: 'Pass', chemIndicator: 'Pass', operator: 'Sunil', status: 'Completed' },
  { id: 'CYC-5003', machine: 'ETO Sterilizer', load: 'SET-004', startTime: '07:00 AM', endTime: '11:00 AM', temp: '55°C', pressure: '-', duration: '4 hrs', biIndicator: 'Pending', chemIndicator: 'Pass', operator: 'Ramesh', status: 'Completed' },
  { id: 'CYC-5004', machine: 'Autoclave-1 (Steam)', load: 'SET-005', startTime: '10:00 AM', endTime: '-', temp: '134°C', pressure: '2.0 bar', duration: '-', biIndicator: '-', chemIndicator: '-', operator: 'Sunil', status: 'In Progress' },
  { id: 'CYC-5005', machine: 'Plasma Sterilizer', load: 'Endoscopes', startTime: '08:00 AM', endTime: '09:00 AM', temp: '50°C', pressure: '-', duration: '60 min', biIndicator: 'Pass', chemIndicator: 'Pass', operator: 'Meena', status: 'Completed' },
];

const departmentRequests = [
  { id: 'REQ-801', department: 'OT-1', set: 'General Surgery Set', urgency: 'Urgent', requestedBy: 'Sr. Nurse Kavita', requestTime: '07:00 AM', requiredBy: '08:30 AM', status: 'Dispatched' },
  { id: 'REQ-802', department: 'OT-2', set: 'Ortho Implant Set', urgency: 'Routine', requestedBy: 'Sr. Nurse Priya', requestTime: '07:30 AM', requiredBy: '10:00 AM', status: 'Ready' },
  { id: 'REQ-803', department: 'Labour Room', set: 'OBG Delivery Set', urgency: 'Emergency', requestedBy: 'Sr. Nurse Sunita', requestTime: '09:45 AM', requiredBy: '10:00 AM', status: 'Dispatched' },
  { id: 'REQ-804', department: 'Ward-A', set: 'Dressing Tray (x10)', urgency: 'Routine', requestedBy: 'Staff Nurse Meera', requestTime: '06:00 AM', requiredBy: '07:00 AM', status: 'Dispatched' },
  { id: 'REQ-805', department: 'OT-3', set: 'Laparoscopy Set', urgency: 'Urgent', requestedBy: 'Sr. Nurse Kavita', requestTime: '10:00 AM', requiredBy: '11:00 AM', status: 'Processing' },
];

const machineStatus = [
  { machine: 'Autoclave-1 (Steam)', type: 'High Pressure Steam', capacity: '300L', lastCalibration: '01-Feb-2026', nextCalibration: '01-Mar-2026', cyclestoday: 3, totalCycles: 4520, status: 'Running' },
  { machine: 'Autoclave-2 (Steam)', type: 'High Pressure Steam', capacity: '300L', lastCalibration: '01-Feb-2026', nextCalibration: '01-Mar-2026', cyclestoday: 2, totalCycles: 3890, status: 'Idle' },
  { machine: 'ETO Sterilizer', type: 'Ethylene Oxide', capacity: '150L', lastCalibration: '15-Jan-2026', nextCalibration: '15-Feb-2026', cyclestoday: 1, totalCycles: 1245, status: 'Calibration Due' },
  { machine: 'Plasma Sterilizer', type: 'H2O2 Plasma', capacity: '50L', lastCalibration: '20-Jan-2026', nextCalibration: '20-Feb-2026', cyclestoday: 1, totalCycles: 678, status: 'Idle' },
  { machine: 'Washer Disinfector', type: 'Thermal Wash', capacity: '200L', lastCalibration: '05-Feb-2026', nextCalibration: '05-Mar-2026', cyclestoday: 5, totalCycles: 5670, status: 'Running' },
];

type Tab = 'sets' | 'cycles' | 'requests' | 'machines' | 'quality';

const tabs: { key: Tab; label: string }[] = [
  { key: 'sets', label: 'Instrument Sets' },
  { key: 'cycles', label: 'Sterilization Cycles' },
  { key: 'requests', label: 'Dept Requests' },
  { key: 'machines', label: 'Equipment Status' },
  { key: 'quality', label: 'Quality Control' },
];

const CSSD = () => {
  const [tab, setTab] = useState<Tab>('sets');
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><ShieldCheck size={16} /> CSSD Management (Central Sterile Supply Department)</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary"><Plus size={12} /> New Cycle</button>
          <button className="hms-btn-secondary"><RotateCcw size={12} /> Re-process</button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1 my-1">
        {[
          { label: 'Total Sets', value: instrumentSets.length },
          { label: 'Sterile Ready', value: instrumentSets.filter(s => s.status === 'Sterile').length, color: '' },
          { label: 'In Use', value: instrumentSets.filter(s => s.status === 'In Use').length, color: 'text-primary' },
          { label: 'Processing', value: instrumentSets.filter(s => s.status === 'Processing').length },
          { label: 'Overdue', value: instrumentSets.filter(s => s.status === 'Overdue').length, color: 'text-destructive' },
          { label: 'Cycles Today', value: sterilizationCycles.length },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-1.5 text-center">
            <div className={`text-lg font-bold ${k.color || ''}`}>{k.value}</div>
            <div className="text-[9px] text-muted-foreground">{k.label}</div>
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
        {tab === 'sets' && (
          <table className="hms-table">
            <thead><tr><th>Set ID</th><th>Name</th><th>Items</th><th>Department</th><th>Last Sterilized</th><th>Next Due</th><th>Total Cycles</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {instrumentSets.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map(s => (
                <tr key={s.id}>
                  <td className="font-semibold">{s.id}</td><td>{s.name}</td><td>{s.items}</td><td>{s.department}</td><td className="text-[10px]">{s.lastSterilized}</td><td className="text-[10px]">{s.nextDue}</td><td>{s.sterilizeCount}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${s.status === 'Sterile' ? 'bg-hms-success text-hms-success-foreground' : s.status === 'Overdue' ? 'bg-destructive text-destructive-foreground' : s.status === 'In Use' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{s.status}</span></td>
                  <td><button className="hms-btn-primary text-[10px] mr-1">Process</button><button className="hms-btn-secondary text-[10px]">History</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'cycles' && (
          <table className="hms-table">
            <thead><tr><th>Cycle ID</th><th>Machine</th><th>Load</th><th>Start</th><th>End</th><th>Temp</th><th>Pressure</th><th>Duration</th><th>BI</th><th>CI</th><th>Operator</th><th>Status</th></tr></thead>
            <tbody>
              {sterilizationCycles.map(c => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.id}</td><td className="text-[10px]">{c.machine}</td><td className="text-[10px]">{c.load}</td><td>{c.startTime}</td><td>{c.endTime}</td>
                  <td>{c.temp}</td><td>{c.pressure}</td><td>{c.duration}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${c.biIndicator === 'Pass' ? 'bg-hms-success text-hms-success-foreground' : c.biIndicator === 'Pending' ? 'bg-hms-warning' : ''}`}>{c.biIndicator}</span></td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${c.chemIndicator === 'Pass' ? 'bg-hms-success text-hms-success-foreground' : ''}`}>{c.chemIndicator}</span></td>
                  <td>{c.operator}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${c.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-info text-primary-foreground'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'requests' && (
          <table className="hms-table">
            <thead><tr><th>Req ID</th><th>Department</th><th>Set Required</th><th>Urgency</th><th>Requested By</th><th>Request Time</th><th>Required By</th><th>Status</th></tr></thead>
            <tbody>
              {departmentRequests.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.department}</td><td>{r.set}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.urgency === 'Emergency' ? 'bg-destructive text-destructive-foreground' : r.urgency === 'Urgent' ? 'bg-hms-warning' : 'bg-muted text-foreground'}`}>{r.urgency}</span></td>
                  <td>{r.requestedBy}</td><td>{r.requestTime}</td><td>{r.requiredBy}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.status === 'Dispatched' ? 'bg-hms-success text-hms-success-foreground' : r.status === 'Ready' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'machines' && (
          <table className="hms-table">
            <thead><tr><th>Machine</th><th>Type</th><th>Capacity</th><th>Last Calibration</th><th>Next Calibration</th><th>Cycles Today</th><th>Total Cycles</th><th>Status</th></tr></thead>
            <tbody>
              {machineStatus.map(m => (
                <tr key={m.machine}>
                  <td className="font-semibold">{m.machine}</td><td className="text-[10px]">{m.type}</td><td>{m.capacity}</td><td>{m.lastCalibration}</td><td>{m.nextCalibration}</td><td>{m.cyclestoday}</td><td>{m.totalCycles}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${m.status === 'Running' ? 'bg-hms-success text-hms-success-foreground' : m.status === 'Idle' ? 'bg-muted text-foreground' : 'bg-destructive text-destructive-foreground'}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'quality' && (
          <div className="p-2 space-y-2">
            <div className="text-xs font-bold">Quality Assurance Checklist — 15-Feb-2026</div>
            <table className="hms-table">
              <thead><tr><th>S.No</th><th>Parameter</th><th>Standard</th><th>Observed</th><th>Result</th><th>Checked By</th></tr></thead>
              <tbody>
                {[
                  { p: 'Autoclave BI Test (Geobacillus)', std: 'No Growth in 24h', obs: 'No Growth', res: 'Pass' },
                  { p: 'Chemical Indicator Strip', std: 'Color Change to Dark', obs: 'Dark Brown', res: 'Pass' },
                  { p: 'Bowie-Dick Test', std: 'Uniform Color Change', obs: 'Uniform', res: 'Pass' },
                  { p: 'ETO Residue Test', std: '< 25 ppm', obs: '18 ppm', res: 'Pass' },
                  { p: 'Water Quality (Autoclave)', std: 'Conductivity < 15 µS', obs: '12 µS', res: 'Pass' },
                  { p: 'Packaging Integrity', std: 'No tears/moisture', obs: 'Intact', res: 'Pass' },
                  { p: 'Storage Area Temp/Humidity', std: '18-22°C / 35-70% RH', obs: '20°C / 45% RH', res: 'Pass' },
                ].map((q, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td><td>{q.p}</td><td className="text-[10px]">{q.std}</td><td className="text-[10px]">{q.obs}</td>
                    <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{q.res}</span></td>
                    <td>Ramesh Kumar</td>
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

export default CSSD;
