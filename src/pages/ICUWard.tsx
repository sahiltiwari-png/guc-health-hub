import React, { useState, useEffect } from 'react';
import { BedDouble, Eye, Edit, AlertTriangle, CheckCircle, Clock, Activity, Thermometer, Heart, RefreshCw } from 'lucide-react';
import { apiRequest, extractArray } from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Occupied': 'bg-red-700 text-white', 'Vacant': 'bg-green-700 text-white', 'Reserved': 'bg-yellow-600 text-white', 'Cleaning': 'bg-blue-700 text-white', 'Maintenance': 'bg-orange-600 text-white', 'Critical': 'bg-red-900 text-white', 'Stable': 'bg-green-700 text-white', 'Improving': 'bg-blue-700 text-white', 'On Ventilator': 'bg-red-700 text-white', 'Weaning': 'bg-yellow-600 text-white', 'Self': 'bg-green-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const ICUWard = () => {
  const tabs = ['Dashboard','Bed Map','Patient Monitor','Ventilator Tracker','Nursing Notes','Intake/Output','Ward Transfer','Census Report'];
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [wards, setWards] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wRes, bRes, pRes] = await Promise.all([
        apiRequest('/api/v1/ipd/wards'),
        apiRequest('/api/v1/ipd/beds'),
        apiRequest('/api/v1/ipd/admissions')
      ]);

      if (wRes.ok) setWards(extractArray(wRes));
      if (bRes.ok) setBeds(extractArray(bRes));
      if (pRes.ok) setPatients(extractArray(pRes));

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayWards = wards.length > 0 ? wards : [
    { ward: 'General Ward-A', total: 30, occupied: 26, vacant: 3, reserved: 1, cleaning: 0 },
    { ward: 'General Ward-B', total: 30, occupied: 22, vacant: 8, reserved: 0, cleaning: 0 },
    { ward: 'Semi-Private', total: 20, occupied: 15, vacant: 4, reserved: 1, cleaning: 0 },
    { ward: 'Private Deluxe', total: 10, occupied: 8, vacant: 1, reserved: 1, cleaning: 0 },
    { ward: 'ICU-1', total: 10, occupied: 9, vacant: 1, reserved: 0, cleaning: 0 },
    { ward: 'NICU', total: 8, occupied: 6, vacant: 2, reserved: 0, cleaning: 0 },
  ];
  const displayPatients = patients.length > 0 ? patients : [
    { bed: 'ICU1-B01', patient: 'Rajesh Kumar', uhid: 'P-1001', age: '58/M', diagnosis: 'Acute MI - Post CABG', doctor: 'Dr. Sharma', day: 5, ventilator: 'On Ventilator', mode: 'SIMV', fio2: '60%', peep: '8', spo2: '97%', bp: '118/72', hr: '82', temp: '37.2°C', rr: '16', gcs: '10T', urine: '1200ml', condition: 'Critical' },
    { bed: 'ICU1-B02', patient: 'Sita Devi', uhid: 'P-1002', age: '62/F', diagnosis: 'Sepsis - ARDS', doctor: 'Dr. Gupta', day: 3, ventilator: 'On Ventilator', mode: 'ACVC', fio2: '50%', peep: '10', spo2: '94%', bp: '90/60', hr: '110', temp: '38.5°C', rr: '22', gcs: '12', urine: '800ml', condition: 'Critical' },
  ];

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><BedDouble size={14} /> ICU / Ward Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Total Beds', v: '179', s: '10 Wards' },{ l: 'Occupied', v: '139', s: '77.7%' },{ l: 'Vacant', v: '28', s: '15.6%' },{ l: 'ICU Patients', v: '9', s: '3 Critical' },{ l: 'On Ventilator', v: '4', s: '1 Weaning' },{ l: 'Discharges Today', v: '3', s: '5 Pending' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">ICU Patient Vitals (Live)</div>
              <table className="hms-table"><thead><tr><th>Bed</th><th>Patient</th><th>Diagnosis</th><th>Vent</th><th>SpO2</th><th>BP</th><th>HR</th><th>Temp</th><th>GCS</th><th>Condition</th></tr></thead>
                <tbody>{displayPatients.map(p => <tr key={p.bed}><td className="font-bold">{p.bed}</td><td>{p.patient}</td><td className="text-[10px] max-w-[120px]">{p.diagnosis}</td><td><StatusBadge status={p.ventilator} /></td><td className={p.spo2 && parseInt(p.spo2) < 95 ? 'text-red-600 font-bold' : ''}>{p.spo2}</td><td>{p.bp}</td><td>{p.hr}</td><td className={p.temp && parseFloat(p.temp) > 38 ? 'text-red-600 font-bold' : ''}>{p.temp}</td><td>{p.gcs}</td><td><StatusBadge status={p.condition} /></td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Ward Occupancy</div>
              <table className="hms-table"><thead><tr><th>Ward</th><th>Total</th><th>Occupied</th><th>Vacant</th><th>Reserved</th><th>Occupancy%</th></tr></thead>
                <tbody>{displayWards.map(w => <tr key={w.ward}><td>{w.ward}</td><td>{w.total}</td><td>{w.occupied}</td><td className="font-bold text-green-700">{w.vacant}</td><td>{w.reserved}</td><td>{Math.round(w.occupied / w.total * 100)}%</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Bed Map' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>All Wards</option>{displayWards.map(w => <option key={w.ward}>{w.ward}</option>)}</select>
            <div className="flex gap-3 ml-4 text-[10px] items-center">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-700 inline-block"></span> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-700 inline-block"></span> Vacant</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-600 inline-block"></span> Reserved</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-700 inline-block"></span> Cleaning</span>
            </div>
          </div>
          <table className="hms-table"><thead><tr><th>Ward</th><th>Total</th><th>Occupied</th><th>Vacant</th><th>Reserved</th><th>Cleaning</th><th>Occupancy</th></tr></thead>
            <tbody>{displayWards.map(w => <tr key={w.ward}><td className="font-bold">{w.ward}</td><td>{w.total}</td><td>{w.occupied}</td><td className="font-bold text-green-700">{w.vacant}</td><td>{w.reserved}</td><td>{w.cleaning}</td><td>{Math.round(w.occupied / w.total * 100)}%</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Patient Monitor' && (
        <div>
          <table className="hms-table"><thead><tr><th>Bed</th><th>Patient</th><th>Age/Sex</th><th>Diagnosis</th><th>Day</th><th>SpO2</th><th>BP</th><th>HR</th><th>Temp</th><th>RR</th><th>GCS</th><th>Urine(24h)</th><th>Ventilator</th><th>Condition</th></tr></thead>
            <tbody>{icuPatients.filter(p => p.patient !== '-').map(p => <tr key={p.bed}><td className="font-bold">{p.bed}</td><td>{p.patient}</td><td>{p.age}</td><td className="text-[10px]">{p.diagnosis}</td><td>{p.day}</td><td className={parseInt(p.spo2) < 95 ? 'text-red-600 font-bold' : ''}>{p.spo2}</td><td>{p.bp}</td><td>{p.hr}</td><td className={parseFloat(p.temp) > 38 ? 'text-red-600 font-bold' : ''}>{p.temp}</td><td>{p.rr}</td><td>{p.gcs}</td><td>{p.urine}</td><td><StatusBadge status={p.ventilator} /></td><td><StatusBadge status={p.condition} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Ventilator Tracker' && (
        <div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[{ l: 'Total Ventilators', v: '12' },{ l: 'In Use', v: '4' },{ l: 'Available', v: '7' },{ l: 'Under Maintenance', v: '1' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2"><div className="text-[10px] text-muted-foreground">{k.l}</div><div className="text-sm font-bold">{k.v}</div></div>
            ))}
          </div>
          <table className="hms-table"><thead><tr><th>Ventilator ID</th><th>Model</th><th>Location</th><th>Patient</th><th>Mode</th><th>FiO2</th><th>PEEP</th><th>TV</th><th>RR Set</th><th>Days on Vent</th><th>Status</th></tr></thead>
            <tbody>
              {[['V-001','Drager Evita V500','ICU1-B01','Rajesh Kumar','SIMV','60%','8','450ml','14','5','In Use'],['V-002','Hamilton C6','ICU1-B02','Sunita Devi','PC-AC','80%','12','400ml','18','3','In Use'],['V-003','Drager Evita V500','ICU1-B03','Mohan Gupta','CPAP','40%','5','Self','Self','7 (Weaning)','In Use'],['V-004','Medtronic PB980','ICU1-B06','Deepak Verma','VC-AC','70%','10','500ml','16','4','In Use'],['V-005','Hamilton C6','ICU-2','--','--','--','--','--','--','--','Available'],['V-006','Drager Evita V300','Maintenance','--','--','--','--','--','--','--','Maintenance']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 10 ? <StatusBadge status={c === 'In Use' ? 'Occupied' : c === 'Available' ? 'Vacant' : 'Maintenance'} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Nursing Notes' && (
        <div>
          <div className="flex gap-2 mb-2"><select className="hms-select"><option>Select Patient</option>{icuPatients.filter(p => p.patient !== '-').map(p => <option key={p.bed}>{p.patient} ({p.bed})</option>)}</select><button className="hms-btn-primary ml-auto">+ Add Note</button></div>
          <table className="hms-table"><thead><tr><th>Time</th><th>Patient</th><th>Bed</th><th>Note</th><th>Vitals Recorded</th><th>Nurse</th><th>Shift</th></tr></thead>
            <tbody>
              {[['06:00','Rajesh Kumar','ICU1-B01','Patient stable. Vent settings unchanged. BP stable.','BP:120/72 HR:78 SpO2:97%','Sr. Nurse Geeta','Night'],['06:00','Sunita Devi','ICU1-B02','Temp spike to 39.1°C. Dr. Singh informed. Blood culture sent.','BP:100/62 HR:115 SpO2:92%','Sr. Nurse Geeta','Night'],['08:00','Deepak Verma','ICU1-B06','Urine output decreased. Noradrenaline increased to 0.3mcg/kg/min.','BP:85/50 HR:125 SpO2:94%','Staff Nurse Priti','Morning'],['10:00','Mohan Gupta','ICU1-B03','Weaning trial started. Patient comfortable on CPAP.','BP:132/82 HR:74 SpO2:98%','Staff Nurse Priti','Morning']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 3 ? 'text-[10px] max-w-[250px]' : ''}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Intake/Output' && (
        <div>
          <div className="flex gap-2 mb-2"><select className="hms-select"><option>Select Patient</option></select></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Intake (24 hrs)</div>
              <table className="hms-table"><thead><tr><th>Time</th><th>Type</th><th>Route</th><th>Volume</th><th>Nurse</th></tr></thead>
                <tbody>{[['06:00','NS 0.9%','IV','500ml','Geeta'],['08:00','Ryle\'s Feed','RT','200ml','Priti'],['10:00','DNS 5%','IV','500ml','Priti'],['12:00','Ryle\'s Feed','RT','200ml','Priti'],['14:00','RL','IV','500ml','Rani']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
              </table>
              <div className="p-2 text-xs font-bold">Total Intake: 1900ml</div>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Output (24 hrs)</div>
              <table className="hms-table"><thead><tr><th>Time</th><th>Type</th><th>Volume</th><th>Color/Nature</th><th>Nurse</th></tr></thead>
                <tbody>{[['06:00','Urine','300ml','Clear Yellow','Geeta'],['08:00','Ryle\'s Aspirate','50ml','Greenish','Priti'],['10:00','Urine','250ml','Clear','Priti'],['12:00','Drain','100ml','Serosanguinous','Priti'],['14:00','Urine','350ml','Clear','Rani']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
              </table>
              <div className="p-2 text-xs font-bold">Total Output: 1050ml | Balance: +850ml</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Ward Transfer' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Request Transfer</button></div>
          <table className="hms-table"><thead><tr><th>Request ID</th><th>Patient</th><th>From Ward/Bed</th><th>To Ward/Bed</th><th>Reason</th><th>Requested By</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {[['TR-001','Mohan Gupta','ICU1-B03','Ward-A/B-15','Step Down - Improving','Dr. Gupta','2024-03-15 10:00','Pending',''],['TR-002','Priya Sharma','ICU1-B04','Maternity/B-08','Stable - Shift to Ward','Dr. Verma','2024-03-15 09:30','Pending',''],['TR-003','Kishan Das','Ward-B/B-10','Ward-A/B-02','Patient Request','Ward Nurse','2024-03-15 08:00','Completed','']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 7 ? <StatusBadge status={c === 'Completed' ? 'Stable' : 'Reserved'} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Census Report' && (
        <div>
          <div className="flex gap-2 mb-2"><input type="date" className="hms-input" /><button className="hms-btn-secondary">Generate</button></div>
          <table className="hms-table"><thead><tr><th>Ward</th><th>Midnight Census</th><th>Admissions</th><th>Transfers In</th><th>Transfers Out</th><th>Discharges</th><th>Deaths</th><th>Current Census</th><th>Occupancy%</th></tr></thead>
            <tbody>{[['General Ward-A',25,2,1,0,1,0,27,'90%'],['General Ward-B',23,1,0,1,0,0,23,'77%'],['ICU-1',5,0,0,0,0,0,5,'62.5%'],['ICU-2',4,1,0,0,0,0,5,'83%'],['Private Ward',14,2,0,1,1,0,14,'70%'],['Maternity',13,1,0,0,0,0,14,'70%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ICUWard;
