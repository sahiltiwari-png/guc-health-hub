import React, { useState } from 'react';
import { Skull, FileText, Clock, Eye, Printer, Plus, AlertTriangle } from 'lucide-react';

const deathRecords = [
  { id: 'DTH-001', name: 'Mr. Hari Prasad', uhid: 'U-2001', age: 78, gender: 'M', ward: 'ICU-02', dod: '14-Feb-2026', tod: '03:45 AM', cause: 'Cardiac Arrest', doctor: 'Dr. Alok Mehta', icdCode: 'I46.9', certIssued: true, pmRequired: false },
  { id: 'DTH-002', name: 'Mrs. Savitri Devi', uhid: 'U-2005', age: 65, gender: 'F', ward: 'Ward-A/B-08', dod: '14-Feb-2026', tod: '11:20 AM', cause: 'Sepsis / Multi-organ Failure', doctor: 'Dr. Rahul Verma', icdCode: 'A41.9', certIssued: true, pmRequired: false },
  { id: 'DTH-003', name: 'Mr. Ratan Lal', uhid: 'U-2012', age: 45, gender: 'M', ward: 'Emergency', dod: '15-Feb-2026', tod: '01:30 AM', cause: 'Road Traffic Accident - Head Injury', doctor: 'Dr. Priya Singh', icdCode: 'S06.9', certIssued: false, pmRequired: true },
  { id: 'DTH-004', name: 'Baby Mohit (Stillborn)', uhid: 'U-2018', age: 0, gender: 'M', ward: 'Labour Room', dod: '15-Feb-2026', tod: '06:15 AM', cause: 'Intrauterine Death', doctor: 'Dr. Neha Gupta', icdCode: 'P95', certIssued: false, pmRequired: false },
  { id: 'DTH-005', name: 'Mr. Kishan Pal', uhid: 'U-2020', age: 52, gender: 'M', ward: 'ICU-05', dod: '15-Feb-2026', tod: '09:00 AM', cause: 'Suspected Poisoning', doctor: 'Dr. Alok Mehta', icdCode: 'T65.9', certIssued: false, pmRequired: true },
];

const postmortemSchedule = [
  { id: 'PM-101', deceased: 'Mr. Ratan Lal', dthId: 'DTH-003', scheduledDate: '15-Feb-2026', time: '02:00 PM', pathologist: 'Dr. S.K. Mishra', policeRef: 'FIR-2026/345', bodyPreserved: 'Mortuary-Freezer 2', status: 'Scheduled', findings: '-' },
  { id: 'PM-102', deceased: 'Mr. Kishan Pal', dthId: 'DTH-005', scheduledDate: '16-Feb-2026', time: '10:00 AM', pathologist: 'Dr. S.K. Mishra', policeRef: 'FIR-2026/348', bodyPreserved: 'Mortuary-Freezer 3', status: 'Pending Police NOC', findings: '-' },
  { id: 'PM-100', deceased: 'Mr. Gopal Das', dthId: 'DTH-098', scheduledDate: '13-Feb-2026', time: '11:00 AM', pathologist: 'Dr. S.K. Mishra', policeRef: 'FIR-2026/340', bodyPreserved: 'Released', status: 'Completed', findings: 'Blunt force trauma to head consistent with fall' },
];

const mortuaryStatus = [
  { unit: 'Freezer-1', capacity: 4, occupied: 3, temp: '-4°C', status: 'Operational' },
  { unit: 'Freezer-2', capacity: 4, occupied: 4, temp: '-4°C', status: 'Full' },
  { unit: 'Freezer-3', capacity: 4, occupied: 2, temp: '-4°C', status: 'Operational' },
  { unit: 'Embalming Room', capacity: 1, occupied: 0, temp: 'N/A', status: 'Available' },
  { unit: 'PM Table-1', capacity: 1, occupied: 0, temp: 'N/A', status: 'Available' },
  { unit: 'PM Table-2', capacity: 1, occupied: 0, temp: 'N/A', status: 'Under Maintenance' },
];

const bodyReleaseLog = [
  { id: 'REL-501', deceased: 'Mr. Gopal Das', releasedTo: 'Shri Ram Das (Son)', idProof: 'Aadhaar - XXXX4567', policeNOC: 'Yes', date: '14-Feb-2026', time: '04:00 PM', witnessedBy: 'Sr. Meena' },
  { id: 'REL-500', deceased: 'Mrs. Geeta Rani', releasedTo: 'Shri Mohan Lal (Husband)', idProof: 'Aadhaar - XXXX7890', policeNOC: 'N/A', date: '13-Feb-2026', time: '11:00 AM', witnessedBy: 'Dr. Rahul Verma' },
];

type Tab = 'deaths' | 'postmortem' | 'mortuary' | 'release' | 'certificates';

const DeathPostmortem = () => {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'deaths', label: 'Death Registry' },
    { key: 'postmortem', label: 'Postmortem Schedule' },
    { key: 'mortuary', label: 'Mortuary Status' },
    { key: 'release', label: 'Body Release Log' },
    { key: 'certificates', label: 'Death Certificates' },
  ];
  const [tab, setTab] = useState<Tab>('deaths');
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Skull size={16} /> Death & Postmortem Management</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary"><Plus size={12} /> Register Death</button>
          <button className="hms-btn-secondary"><Plus size={12} /> Schedule PM</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-1 my-1">
        {[
          { label: 'Total Deaths (Month)', value: 12 },
          { label: 'Today', value: 3, color: 'text-destructive' },
          { label: 'PM Pending', value: 2, color: 'text-primary' },
          { label: 'PM Completed', value: 1 },
          { label: 'Certificates Pending', value: 3, color: 'text-destructive' },
          { label: 'Mortuary Occupancy', value: '9/12' },
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
        {tab === 'deaths' && (
          <table className="hms-table">
            <thead><tr><th>Death ID</th><th>Patient</th><th>UHID</th><th>Age</th><th>Sex</th><th>Ward</th><th>Date</th><th>Time</th><th>Cause of Death</th><th>ICD</th><th>Doctor</th><th>Cert</th><th>PM</th><th>Actions</th></tr></thead>
            <tbody>
              {deathRecords.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
                <tr key={d.id}>
                  <td className="font-semibold">{d.id}</td><td>{d.name}</td><td>{d.uhid}</td><td>{d.age}</td><td>{d.gender}</td><td>{d.ward}</td>
                  <td>{d.dod}</td><td>{d.tod}</td><td className="text-[10px] max-w-[120px]">{d.cause}</td><td className="text-[10px]">{d.icdCode}</td><td>{d.doctor}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${d.certIssued ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{d.certIssued ? 'Yes' : 'Pending'}</span></td>
                  <td>{d.pmRequired ? <span className="text-[10px] px-1 py-0.5 bg-destructive text-destructive-foreground">Required</span> : <span className="text-[10px] text-muted-foreground">No</span>}</td>
                  <td><Eye size={12} className="text-primary cursor-pointer inline mr-1" /><Printer size={12} className="text-primary cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'postmortem' && (
          <table className="hms-table">
            <thead><tr><th>PM ID</th><th>Deceased</th><th>Death ID</th><th>Date</th><th>Time</th><th>Pathologist</th><th>Police Ref</th><th>Body Location</th><th>Status</th><th>Findings</th></tr></thead>
            <tbody>
              {postmortemSchedule.map(p => (
                <tr key={p.id}>
                  <td className="font-semibold">{p.id}</td><td>{p.deceased}</td><td>{p.dthId}</td><td>{p.scheduledDate}</td><td>{p.time}</td>
                  <td>{p.pathologist}</td><td className="text-[10px]">{p.policeRef}</td><td>{p.bodyPreserved}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${p.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : p.status === 'Scheduled' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{p.status}</span></td>
                  <td className="text-[10px] max-w-[150px]">{p.findings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'mortuary' && (
          <>
            <div className="p-1 text-[10px] bg-muted border-b border-border px-2">Mortuary Infrastructure Status</div>
            <table className="hms-table">
              <thead><tr><th>Unit</th><th>Capacity</th><th>Occupied</th><th>Available</th><th>Temperature</th><th>Status</th></tr></thead>
              <tbody>
                {mortuaryStatus.map(m => (
                  <tr key={m.unit}>
                    <td className="font-semibold">{m.unit}</td><td>{m.capacity}</td><td>{m.occupied}</td><td>{m.capacity - m.occupied}</td><td>{m.temp}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 ${m.status === 'Operational' || m.status === 'Available' ? 'bg-hms-success text-hms-success-foreground' : m.status === 'Full' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'release' && (
          <table className="hms-table">
            <thead><tr><th>Release ID</th><th>Deceased</th><th>Released To</th><th>ID Proof</th><th>Police NOC</th><th>Date</th><th>Time</th><th>Witnessed By</th></tr></thead>
            <tbody>
              {bodyReleaseLog.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.deceased}</td><td>{r.releasedTo}</td><td className="text-[10px]">{r.idProof}</td>
                  <td>{r.policeNOC}</td><td>{r.date}</td><td>{r.time}</td><td>{r.witnessedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'certificates' && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-border p-2">
                <div className="text-xs font-bold mb-2">Pending Death Certificates</div>
                {deathRecords.filter(d => !d.certIssued).map(d => (
                  <div key={d.id} className="flex items-center justify-between border-b border-border py-1 text-xs">
                    <span>{d.id} - {d.name}</span>
                    <div><button className="hms-btn-primary text-[10px] mr-1">Generate</button><button className="hms-btn-secondary text-[10px]">View</button></div>
                  </div>
                ))}
              </div>
              <div className="border border-border p-2">
                <div className="text-xs font-bold mb-2">Issued Certificates</div>
                {deathRecords.filter(d => d.certIssued).map(d => (
                  <div key={d.id} className="flex items-center justify-between border-b border-border py-1 text-xs">
                    <span>{d.id} - {d.name} — Issued</span>
                    <div><Printer size={12} className="text-primary cursor-pointer inline" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeathPostmortem;
