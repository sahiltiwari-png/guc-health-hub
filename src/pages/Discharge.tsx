import React, { useState, useEffect } from 'react';
import { FileOutput, Eye, Printer, CheckCircle, Clock, AlertTriangle, Edit, RefreshCw } from 'lucide-react';
import { getDischarges, apiRequest, extractArray } from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Pending': 'bg-yellow-600 text-white', 'Billing Done': 'bg-blue-700 text-white', 'Summary Ready': 'bg-green-700 text-white', 'Discharged': 'bg-green-800 text-white', 'LAMA': 'bg-red-700 text-white', 'Absconded': 'bg-red-900 text-white', 'Doctor Approval': 'bg-yellow-600 text-white', 'Cleared': 'bg-green-700 text-white', 'Pending Clearance': 'bg-yellow-600 text-white', 'Partial': 'bg-orange-600 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const Discharge = () => {
  const tabs = ['Dashboard','Pending Discharge','Discharged Today','Summary Templates','Billing Clearance','Follow-Up','LAMA/Absconded','Reports'];
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [discharges, setDischarges] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([
        getDischarges(),
        apiRequest('/api/v1/ipd/discharges/pending')
      ]);
      
      if (dRes.ok) setDischarges(extractArray(dRes));
      if (pRes.ok) setPending(extractArray(pRes));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayPending = pending.length > 0 ? pending : [
    { id: 'IPD-2001', patient: 'Rajesh Kumar', uhid: 'P-1001', ward: 'ICU-1', bed: 'B-03', admitted: '2024-03-10', days: 5, diagnosis: 'Acute MI', doctor: 'Dr. Sharma', billAmt: '₹2,45,000', deposit: '₹2,00,000', balance: '₹45,000', pharmacy: 'Cleared', lab: 'Cleared', billing: 'Pending Clearance', summary: 'Pending', status: 'Doctor Approval' },
    { id: 'IPD-2002', patient: 'Sita Devi', uhid: 'P-1002', ward: 'Ward-A', bed: 'B-12', admitted: '2024-03-12', days: 3, diagnosis: 'Fracture Femur', doctor: 'Dr. Gupta', billAmt: '₹85,000', deposit: '₹50,000', balance: '₹35,000', pharmacy: 'Cleared', lab: 'Pending', billing: 'Pending Clearance', summary: 'Pending', status: 'Pending' },
  ];

  const displayDischarged = discharges.length > 0 ? discharges : [
    { id: 'IPD-1995', patient: 'Ravi Yadav', uhid: 'P-0998', ward: 'Ward-C', time: '08:30', diagnosis: 'Appendectomy', doctor: 'Dr. Singh', totalBill: '₹65,000', paid: '₹65,000', type: 'Normal', followUp: '2024-03-22' },
  ];

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><FileOutput size={14} /> Discharge & Summary Management</div>
        <button onClick={fetchData} className="p-1 hover:bg-muted rounded text-primary">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Pending Discharge', v: displayPending.length, s: '2 Ready' },{ l: 'Discharged Today', v: displayDischarged.length, s: 'Normal' },{ l: 'Billing Pending', v: '3', s: '₹90,000 Due' },{ l: 'Summary Pending', v: '3', s: '2 > 24hrs' },{ l: 'LAMA This Month', v: '2', s: '0.8%' },{ l: 'Avg LOS', v: '4.2 Days', s: 'Target: 4.0' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Pending Discharge Summary</div>
              <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>Ward</th><th>Days</th><th>Pharmacy</th><th>Lab</th><th>Billing</th><th>Summary</th><th>Status</th></tr></thead>
                <tbody>{displayPending.map((p: any) => <tr key={p.id}><td className="font-mono text-[10px]">{p.id}</td><td>{p.patient || p.patientName}</td><td>{p.ward}</td><td>{p.days}</td><td><StatusBadge status={p.pharmacy || 'Pending'} /></td><td><StatusBadge status={p.lab || 'Pending'} /></td><td><StatusBadge status={p.billing || 'Pending'} /></td><td><StatusBadge status={p.summary || 'Pending'} /></td><td><StatusBadge status={p.status || 'Pending'} /></td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Discharged Today</div>
              <table className="hms-table"><thead><tr><th>IPD</th><th>Patient</th><th>Time</th><th>Diagnosis</th><th>Bill</th><th>Type</th><th>Follow-Up</th></tr></thead>
                <tbody>{displayDischarged.map((d: any) => <tr key={d.id}><td className="font-mono text-[10px]">{d.id}</td><td>{d.patient || d.patientName}</td><td>{d.time || d.dischargedAt}</td><td>{d.diagnosis}</td><td>{d.totalBill || d.amount}</td><td>{d.type || 'Normal'}</td><td>{d.followUp || '-'}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Pending Discharge' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Patient/IPD..." />
            <select className="hms-select"><option>All Wards</option><option>ICU-1</option><option>ICU-2</option><option>Ward-A</option><option>Ward-B</option><option>Private</option></select>
            <select className="hms-select"><option>All Status</option><option>Pending</option><option>Doctor Approval</option><option>Summary Ready</option></select>
          </div>
          <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>UHID</th><th>Ward/Bed</th><th>Admitted</th><th>Days</th><th>Diagnosis</th><th>Doctor</th><th>Bill Amt</th><th>Balance</th><th>Pharmacy</th><th>Lab</th><th>Billing</th><th>Summary</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{displayPending.map((p: any) => <tr key={p.id}><td className="font-mono text-[10px]">{p.id}</td><td>{p.patient}</td><td>{p.uhid}</td><td>{p.ward}/{p.bed}</td><td>{p.admitted}</td><td>{p.days}</td><td>{p.diagnosis}</td><td>{p.doctor}</td><td>{p.billAmt}</td><td className="font-bold">{p.balance}</td><td><StatusBadge status={p.pharmacy} /></td><td><StatusBadge status={p.lab} /></td><td><StatusBadge status={p.billing} /></td><td><StatusBadge status={p.summary} /></td><td><StatusBadge status={p.status} /></td><td className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Printer size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Discharged Today' && (
        <div>
          <table className="hms-table"><thead><tr><th>IPD No</th><th>Patient</th><th>UHID</th><th>Ward</th><th>Time</th><th>Diagnosis</th><th>Doctor</th><th>Total Bill</th><th>Paid</th><th>Type</th><th>Follow-Up</th><th>Action</th></tr></thead>
            <tbody>{displayDischarged.map((d: any) => <tr key={d.id}><td className="font-mono text-[10px]">{d.id}</td><td>{d.patient}</td><td>{d.uhid}</td><td>{d.ward}</td><td>{d.time}</td><td>{d.diagnosis}</td><td>{d.doctor}</td><td>{d.totalBill}</td><td>{d.paid}</td><td>{d.type}</td><td>{d.followUp}</td><td><Eye size={12} className="text-primary cursor-pointer" /> <Printer size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Summary Templates' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Template</button></div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Template Name</th><th>Department</th><th>Sections</th><th>Last Modified</th><th>Used (Month)</th><th>Action</th></tr></thead>
            <tbody>
              {[['ST-001','General Medicine Discharge','Medicine','History,Exam,Investigations,Treatment,Advice','2024-03-01','45'],['ST-002','Surgical Discharge','Surgery','Pre-Op,Procedure,Post-Op,Follow-Up','2024-02-28','32'],['ST-003','Obstetric Discharge','OBG','Delivery Details,Mother,Baby,Advice','2024-03-05','18'],['ST-004','Pediatric Discharge','Pediatrics','History,Growth,Treatment,Immunization','2024-02-20','22'],['ST-005','ICU Transfer/Discharge','Critical Care','ICU Course,Ventilator,Medications,Step-Down','2024-03-10','12']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Edit size={12} className="text-primary cursor-pointer" /> <Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Billing Clearance' && (
        <div>
          <table className="hms-table"><thead><tr><th>IPD</th><th>Patient</th><th>Ward</th><th>Total Bill</th><th>Deposit</th><th>Insurance</th><th>Balance</th><th>Pharmacy</th><th>Lab</th><th>Radiology</th><th>OT</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{displayPending.map((p: any) => <tr key={p.id}><td className="font-mono text-[10px]">{p.id}</td><td>{p.patient}</td><td>{p.ward}</td><td>{p.billAmt}</td><td>{p.deposit}</td><td>-</td><td className="font-bold">{p.balance}</td><td><StatusBadge status={p.pharmacy} /></td><td><StatusBadge status={p.lab} /></td><td><StatusBadge status="Cleared" /></td><td><StatusBadge status="Cleared" /></td><td><StatusBadge status={p.billing} /></td><td><button className="hms-btn-primary text-[10px] px-2 py-0.5">Clear</button></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Follow-Up' && (
        <div>
          <table className="hms-table"><thead><tr><th>IPD</th><th>Patient</th><th>UHID</th><th>Discharged</th><th>Diagnosis</th><th>Doctor</th><th>Follow-Up Date</th><th>Type</th><th>Attended</th><th>Action</th></tr></thead>
            <tbody>
              {[['IPD-1995','Ravi Yadav','P-0998','2024-03-15','Appendectomy','Dr. Singh','2024-03-22','OPD','Pending'],['IPD-1996','Sunita Kumari','P-0999','2024-03-15','Pneumonia','Dr. Sharma','2024-03-20','OPD','Pending'],['IPD-1990','Kishan Das','P-0995','2024-03-12','Fracture','Dr. Gupta','2024-03-19','OPD','Done'],['IPD-1988','Meera Devi','P-0993','2024-03-10','Hysterectomy','Dr. Verma','2024-03-17','OPD','Done']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 8 ? <StatusBadge status={c === 'Done' ? 'Cleared' : 'Pending'} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'LAMA/Absconded' && (
        <div>
          <table className="hms-table"><thead><tr><th>IPD</th><th>Patient</th><th>UHID</th><th>Ward</th><th>Date/Time</th><th>Diagnosis</th><th>Doctor</th><th>Type</th><th>Reason</th><th>Bill Status</th><th>Action</th></tr></thead>
            <tbody>
              {[['IPD-1985','Ramesh Gupta','P-0990','Ward-B','2024-03-08 14:30','Typhoid','Dr. Sharma','LAMA','Financial Constraints','Partial: ₹12,000 due'],['IPD-1980','Unknown Male','P-0988','Emergency','2024-03-05 03:00','Head Injury','Dr. Singh','Absconded','Unknown','Unpaid: ₹8,500']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 7 ? <StatusBadge status={c} /> : c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Reports' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Discharge Statistics (This Month)</div>
            <table className="hms-table"><thead><tr><th>Metric</th><th>Value</th></tr></thead>
              <tbody>{[['Total Discharges','234'],['Normal Discharge','228 (97.4%)'],['LAMA','4 (1.7%)'],['Absconded','1 (0.4%)'],['Death','1 (0.4%)'],['Avg Length of Stay','4.2 days'],['Avg Bill Amount','₹1,25,000'],['Summary TAT (Avg)','6.5 hours']].map((r, i) => <tr key={i}><td>{r[0]}</td><td className="font-bold">{r[1]}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Ward-wise Discharge</div>
            <table className="hms-table"><thead><tr><th>Ward</th><th>Discharged</th><th>Avg LOS</th><th>LAMA</th><th>Readmission%</th></tr></thead>
              <tbody>{[['General Ward',120,'3.5 days',2,'4.2%'],['ICU',28,'6.8 days',0,'8.5%'],['Private Ward',45,'4.1 days',1,'2.1%'],['Pediatric',22,'3.2 days',1,'5.0%'],['Maternity',19,'2.5 days',0,'1.0%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discharge;
