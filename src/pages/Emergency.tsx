import React, { useState, useEffect } from 'react';
import { Siren, Eye, Edit, Clock, AlertTriangle, CheckCircle, Printer, Activity, RefreshCw } from 'lucide-react';
import { getERVisits, extractArray } from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Red': 'bg-red-700 text-white', 'Orange': 'bg-orange-600 text-white', 'Yellow': 'bg-yellow-500 text-black', 'Green': 'bg-green-700 text-white', 'Black': 'bg-black text-white', 'Active': 'bg-blue-700 text-white', 'Discharged': 'bg-green-700 text-white', 'Admitted': 'bg-yellow-600 text-white', 'Referred': 'bg-purple-700 text-white', 'Critical': 'bg-red-900 text-white', 'Stable': 'bg-green-700 text-white', 'MLC': 'bg-red-700 text-white', 'Non-MLC': 'bg-green-700 text-white', 'Occupied': 'bg-red-700 text-white', 'Available': 'bg-green-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const traumaBays = [
  { bay: 'Trauma Bay 1', equipment: 'Ventilator, Monitor, Defibrillator', patient: 'Mohan Lal', status: 'Occupied' },
  { bay: 'Trauma Bay 2', equipment: 'Monitor, Suction, Oxygen', patient: '-', status: 'Available' },
  { bay: 'Trauma Bay 3', equipment: 'Ventilator, Monitor', patient: 'Rajesh Kumar', status: 'Occupied' },
  { bay: 'Trauma Bay 4', equipment: 'Monitor, Oxygen', patient: '-', status: 'Available' },
];

const Emergency = () => {
  const tabs = ['Dashboard','Active Cases','Triage','Trauma Bay','Resuscitation','MLC Register','Waiting Area','Shift Handover'];
  const [tab, setTab] = useState('Dashboard');
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await getERVisits();
      if (res.ok) {
        setCases(extractArray(res));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const activeCases = cases.length > 0 ? cases : [
    { id: 'ER-001', patient: 'Unknown Male', age: '~35/M', arrival: '05:30', mode: 'Ambulance', triage: 'Red', complaint: 'RTA - Head Injury, Unconscious', bp: '90/60', hr: '120', spo2: '88%', gcs: '6', doctor: 'Dr. Singh', bed: 'Resus-1', mlc: 'MLC', status: 'Critical' },
    { id: 'ER-002', patient: 'Ramesh Yadav', age: '52/M', arrival: '06:15', mode: 'Self', triage: 'Orange', complaint: 'Chest Pain, Sweating, Breathlessness', bp: '160/100', hr: '110', spo2: '94%', gcs: '15', doctor: 'Dr. Sharma', bed: 'Bay-1', mlc: 'Non-MLC', status: 'Active' },
  ];

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Siren size={14} /> Emergency Department Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-7 gap-2 mb-3">
            {[{ l: 'Active Cases', v: '7', s: '2 Critical' },{ l: 'Red (Immediate)', v: '2', s: 'Resus Bay' },{ l: 'Orange (Urgent)', v: '2', s: '<30 min' },{ l: 'Yellow', v: '2', s: '<60 min' },{ l: 'Green (Minor)', v: '1', s: 'Walk-in' },{ l: 'MLC Cases', v: '3', s: 'Police Informed' },{ l: 'Waiting', v: '4', s: 'Avg 12 min' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border mb-2">
            <div className="hms-section-header text-xs">Active Emergency Cases (Live)</div>
            <table className="hms-table"><thead><tr><th>ER No</th><th>Patient</th><th>Age</th><th>Triage</th><th>Complaint</th><th>BP</th><th>HR</th><th>SpO2</th><th>GCS</th><th>Doctor</th><th>Bed</th><th>MLC</th><th>Status</th></tr></thead>
              <tbody>{activeCases.map(c => <tr key={c.id}><td className="font-mono text-[10px]">{c.id}</td><td>{c.patient}</td><td>{c.age}</td><td><StatusBadge status={c.triage} /></td><td className="text-[10px] max-w-[180px]">{c.complaint}</td><td>{c.bp}</td><td>{c.hr}</td><td className={c.spo2 && parseInt(c.spo2) < 95 ? 'text-red-600 font-bold' : ''}>{c.spo2}</td><td className={parseInt(c.gcs) <= 8 ? 'text-red-600 font-bold' : ''}>{c.gcs}</td><td>{c.doctor}</td><td>{c.bed}</td><td><StatusBadge status={c.mlc} /></td><td><StatusBadge status={c.status} /></td></tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Bay/Bed Status</div>
            <table className="hms-table"><thead><tr><th>Bay</th><th>Equipment</th><th>Patient</th><th>Status</th></tr></thead>
              <tbody>{traumaBays.map(b => <tr key={b.bay}><td className="font-bold">{b.bay}</td><td className="text-[10px]">{b.equipment}</td><td>{b.patient}</td><td><StatusBadge status={b.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Active Cases' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>All Triage</option><option>Red</option><option>Orange</option><option>Yellow</option><option>Green</option></select>
            <select className="hms-select"><option>All Status</option><option>Critical</option><option>Active</option><option>Admitted</option><option>Discharged</option></select>
            <select className="hms-select"><option>All MLC</option><option>MLC</option><option>Non-MLC</option></select>
            <button className="hms-btn-primary ml-auto">+ Register Patient</button>
          </div>
          <table className="hms-table"><thead><tr><th>ER No</th><th>Patient</th><th>Age/Sex</th><th>Arrival</th><th>Mode</th><th>Triage</th><th>Chief Complaint</th><th>Vitals</th><th>GCS</th><th>Doctor</th><th>Bed</th><th>MLC</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{activeCases.map(c => <tr key={c.id}><td className="font-mono text-[10px]">{c.id}</td><td>{c.patient}</td><td>{c.age}</td><td>{c.arrival}</td><td>{c.mode}</td><td><StatusBadge status={c.triage} /></td><td className="text-[10px] max-w-[150px]">{c.complaint}</td><td className="text-[10px]">BP:{c.bp} HR:{c.hr} SpO2:{c.spo2}</td><td>{c.gcs}</td><td>{c.doctor}</td><td>{c.bed}</td><td><StatusBadge status={c.mlc} /></td><td><StatusBadge status={c.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Triage' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[{ color: 'Red (Immediate)', desc: 'Life-threatening, needs immediate intervention', time: '0 min', count: 2 },{ color: 'Orange (Very Urgent)', desc: 'Serious condition, attend within 10 min', time: '10 min', count: 2 },{ color: 'Yellow (Urgent)', desc: 'Requires urgent care within 60 min', time: '60 min', count: 2 },{ color: 'Green (Standard)', desc: 'Minor injuries/illness, can wait', time: '120 min', count: 1 }].map((t, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <StatusBadge status={t.color.split(' ')[0]} />
                <div className="text-[10px] mt-1">{t.desc}</div>
                <div className="text-xs mt-1">Target: {t.time} | Current: <span className="font-bold">{t.count}</span></div>
              </div>
            ))}
          </div>
          <table className="hms-table"><thead><tr><th>ER No</th><th>Patient</th><th>Arrival</th><th>Triage Level</th><th>Chief Complaint</th><th>Vitals</th><th>Triage By</th><th>Time to Doctor</th></tr></thead>
            <tbody>{activeCases.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.patient}</td><td>{c.arrival}</td><td><StatusBadge status={c.triage} /></td><td>{c.complaint}</td><td className="text-[10px]">BP:{c.bp} HR:{c.hr}</td><td>Triage Nurse</td><td>2 min</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Trauma Bay' && (
        <div>
          <table className="hms-table"><thead><tr><th>Bay</th><th>Equipment Available</th><th>Current Patient</th><th>ER No</th><th>Injury Type</th><th>Team</th><th>Status</th></tr></thead>
            <tbody>{traumaBays.map(b => <tr key={b.bay}><td className="font-bold">{b.bay}</td><td className="text-[10px]">{b.equipment}</td><td>{b.patient}</td><td>-</td><td>-</td><td>-</td><td><StatusBadge status={b.status} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Resuscitation' && (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {activeCases.filter(c => c.triage === 'Red').map(c => (
              <div key={c.id} className="bg-card border-2 border-red-700 p-2">
                <div className="flex justify-between items-center mb-1"><span className="font-bold text-xs">{c.bed} — {c.id}</span><StatusBadge status="Critical" /></div>
                <div className="text-xs"><strong>{c.patient}</strong> ({c.age})</div>
                <div className="text-[10px] text-muted-foreground mb-1">{c.complaint}</div>
                <div className="grid grid-cols-5 gap-1 text-[10px] bg-muted p-1">
                  <div><strong>BP:</strong> {c.bp}</div>
                  <div><strong>HR:</strong> {c.hr}</div>
                  <div><strong>SpO2:</strong> <span className="text-red-600 font-bold">{c.spo2}</span></div>
                  <div><strong>GCS:</strong> <span className="text-red-600 font-bold">{c.gcs}</span></div>
                  <div><strong>Dr:</strong> {c.doctor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'MLC Register' && (
        <div>
          <table className="hms-table"><thead><tr><th>MLC No</th><th>ER No</th><th>Patient</th><th>Age/Sex</th><th>Date/Time</th><th>Nature</th><th>Brought By</th><th>Police Station</th><th>FIR No</th><th>Doctor</th><th>Condition</th><th>Action</th></tr></thead>
            <tbody>
              {[['MLC-045','ER-001','Unknown Male','~35/M','2024-03-15 05:30','RTA - Head Injury','108 Ambulance','Sector 63 PS','Pending','Dr. Singh','Critical'],['MLC-046','ER-004','Suresh Kumar','45/M','2024-03-15 07:30','Poisoning','Family','Noida PS','24/2024','Dr. Singh','Critical'],['MLC-047','ER-007','Anil Gupta','40/M','2024-03-15 09:00','Assault - Stab Wound','Police PCR','Sector 58 PS','28/2024','Dr. Gupta','Stable']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 10 ? <StatusBadge status={c} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /> <Printer size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Waiting Area' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[{ l: 'Currently Waiting', v: '4' },{ l: 'Avg Wait Time', v: '12 min' },{ l: 'Longest Wait', v: '25 min' },{ l: 'Seen in <10 min', v: '85%' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2"><div className="text-[10px] text-muted-foreground">{k.l}</div><div className="text-sm font-bold">{k.v}</div></div>
            ))}
          </div>
          <table className="hms-table"><thead><tr><th>Token</th><th>Patient</th><th>Arrival</th><th>Triage</th><th>Complaint</th><th>Waiting Since</th><th>Action</th></tr></thead>
            <tbody>
              {[['W-01','Meena Devi','08:00','Green','Fever, Body Ache','25 min'],['W-02','Ravi Shankar','08:15','Green','Knee Pain','10 min'],['W-03','Pooja Kumari','08:20','Yellow','Severe Headache','5 min'],['W-04','Ajay Mishra','08:25','Green','Cough, Cold','2 min']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 3 ? <StatusBadge status={c} /> : c}</td>)}<td><button className="hms-btn-primary text-[10px] px-2 py-0.5">Call</button></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Shift Handover' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Create Handover</button></div>
          <table className="hms-table"><thead><tr><th>Date</th><th>Shift</th><th>Outgoing Doctor</th><th>Incoming Doctor</th><th>Active Cases</th><th>Critical</th><th>Pending Actions</th><th>MLC Cases</th><th>Status</th></tr></thead>
            <tbody>
              {[['2024-03-15','Night → Morning','Dr. Singh','Dr. Mehta','5','2','CT Head for ER-001, Blood Report for ER-004','3','Completed'],['2024-03-14','Evening → Night','Dr. Mehta','Dr. Singh','3','1','Follow-up X-Ray ER-095','1','Completed'],['2024-03-14','Morning → Evening','Dr. Gupta','Dr. Mehta','4','0','Discharge ER-090, ER-091','2','Completed']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 6 ? 'text-[10px] max-w-[200px]' : ''}>{j === 8 ? <StatusBadge status="Stable" /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Emergency;
