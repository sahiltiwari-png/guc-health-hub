import React, { useState } from 'react';
import { Scissors, Eye, Edit, Clock, CheckCircle, AlertTriangle, Printer, Calendar, Upload, FileVideo, FileImage } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { post } from "@/api/apiService";

const tabs = ['Dashboard','OT Schedule','Running Surgeries','OT Booking','Pre-Op Checklist','Surgery Media','Post-Op Notes','Equipment/Instruments','OT Utilization','Anesthesia Log'];

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Running': 'bg-green-700 text-white', 'Scheduled': 'bg-blue-700 text-white', 'Completed': 'bg-green-800 text-white', 'Preparing': 'bg-yellow-600 text-white', 'Cancelled': 'bg-red-700 text-white', 'Available': 'bg-green-700 text-white', 'Occupied': 'bg-red-700 text-white', 'Cleaning': 'bg-yellow-600 text-white', 'Emergency': 'bg-red-700 text-white', 'Elective': 'bg-blue-700 text-white', 'Done': 'bg-green-700 text-white', 'Pending': 'bg-yellow-600 text-white', 'GA': 'bg-purple-700 text-white', 'SA': 'bg-blue-700 text-white', 'LA': 'bg-green-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const otRooms = [
  { room: 'OT-1 (Major)', currentSurgery: 'Lap Cholecystectomy', patient: 'Mohan Lal', surgeon: 'Dr. Singh', anesthesia: 'GA', startTime: '09:00', estEnd: '11:30', elapsed: '1h 45m', status: 'Running' },
  { room: 'OT-2 (Major)', currentSurgery: 'CABG', patient: 'Rajesh Kumar', surgeon: 'Dr. Sharma', anesthesia: 'GA', startTime: '08:00', estEnd: '14:00', elapsed: '3h 45m', status: 'Running' },
  { room: 'OT-3 (Minor)', currentSurgery: '-', patient: '-', surgeon: '-', anesthesia: '-', startTime: '-', estEnd: '-', elapsed: '-', status: 'Cleaning' },
  { room: 'OT-4 (Minor)', currentSurgery: '-', patient: '-', surgeon: '-', anesthesia: '-', startTime: '-', estEnd: '-', elapsed: '-', status: 'Available' },
  { room: 'OT-5 (Emergency)', currentSurgery: 'Appendectomy', patient: 'Ravi Yadav', surgeon: 'Dr. Gupta', anesthesia: 'SA', startTime: '10:30', estEnd: '12:00', elapsed: '1h 15m', status: 'Running' },
  { room: 'OT-6 (Eye)', currentSurgery: '-', patient: '-', surgeon: '-', anesthesia: '-', startTime: '-', estEnd: '-', elapsed: '-', status: 'Available' },
];

const schedule = [
  { time: '08:00', room: 'OT-2', surgery: 'CABG', patient: 'Rajesh Kumar (P-1001)', surgeon: 'Dr. Sharma', anesthesiologist: 'Dr. Mehta', type: 'Elective', duration: '6 hrs', status: 'Running' },
  { time: '09:00', room: 'OT-1', surgery: 'Lap Cholecystectomy', patient: 'Mohan Lal (P-1005)', surgeon: 'Dr. Singh', anesthesiologist: 'Dr. Jain', type: 'Elective', duration: '2.5 hrs', status: 'Running' },
  { time: '10:30', room: 'OT-5', surgery: 'Appendectomy', patient: 'Ravi Yadav (P-0998)', surgeon: 'Dr. Gupta', anesthesiologist: 'Dr. Mehta', type: 'Emergency', duration: '1.5 hrs', status: 'Running' },
  { time: '12:00', room: 'OT-1', surgery: 'Hernia Repair', patient: 'Suresh Yadav (P-1007)', surgeon: 'Dr. Singh', anesthesiologist: 'Dr. Jain', type: 'Elective', duration: '1.5 hrs', status: 'Scheduled' },
  { time: '12:00', room: 'OT-3', surgery: 'Excision Biopsy', patient: 'Kavita Jain (P-1006)', surgeon: 'Dr. Verma', anesthesiologist: 'Dr. Kumar', type: 'Elective', duration: '1 hr', status: 'Preparing' },
  { time: '14:00', room: 'OT-4', surgery: 'Cataract Surgery', patient: 'Sunita Devi (P-1010)', surgeon: 'Dr. Agarwal', anesthesiologist: '-', type: 'Elective', duration: '45 min', status: 'Scheduled' },
  { time: '14:30', room: 'OT-2', surgery: 'Valve Replacement', patient: 'Deepak Verma (P-1000)', surgeon: 'Dr. Sharma', anesthesiologist: 'Dr. Mehta', type: 'Elective', duration: '5 hrs', status: 'Scheduled' },
];

const preOpChecklist = [
  { item: 'Consent Form Signed', responsible: 'Surgeon', status: 'Done' },
  { item: 'Anesthesia Fitness', responsible: 'Anesthesiologist', status: 'Done' },
  { item: 'Blood Group & Cross Match', responsible: 'Lab', status: 'Done' },
  { item: 'NPO Status (8 hrs)', responsible: 'Nursing', status: 'Done' },
  { item: 'Pre-Op Investigations (CBC, RFT, LFT)', responsible: 'Lab', status: 'Done' },
  { item: 'ECG/Chest X-Ray', responsible: 'Cardiology/Radiology', status: 'Done' },
  { item: 'IV Line Secured', responsible: 'Nursing', status: 'Pending' },
  { item: 'Surgical Site Marking', responsible: 'Surgeon', status: 'Pending' },
  { item: 'Blood Reserved (2 Units)', responsible: 'Blood Bank', status: 'Done' },
  { item: 'Antibiotic Prophylaxis', responsible: 'Surgeon', status: 'Pending' },
];

const OTManagement = () => {
  const [tab, setTab] = useState('Dashboard');
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [surgeryMedia, setSurgeryMedia] = useState([
    { id: 1, patient: 'Rajesh Kumar', surgery: 'CABG', type: 'Video', name: 'cabg_procedure_start.mp4', url: '#', date: '2024-03-15' },
    { id: 2, patient: 'Mohan Lal', surgery: 'Lap Chole', type: 'Image', name: 'gallbladder_view.jpg', url: '#', date: '2024-03-15' },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      // Use the newly integrated S3 upload endpoint
      const response = await axios.post('/api/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newMedia = {
        id: Date.now(),
        patient: 'Active Surgery',
        surgery: 'Ongoing',
        type: file.type.startsWith('video/') ? 'Video' : 'Image',
        name: file.name,
        url: response.data.fileUrl,
        date: new Date().toISOString().split('T')[0]
      };

      setSurgeryMedia([newMedia, ...surgeryMedia]);
      toast({
        title: "Upload Successful",
        description: "Media uploaded to S3 for government verification.",
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Could not upload media to S3.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Scissors size={14} /> Operation Theatre Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Total OTs', v: '6', s: '3 Running' },{ l: 'Surgeries Today', v: '7', s: '3 Running, 4 Scheduled' },{ l: 'Emergency', v: '1', s: 'OT-5' },{ l: 'Avg Duration', v: '2.8 hrs', s: 'This Week' },{ l: 'Utilization', v: '72%', s: 'Target 80%' },{ l: 'Cancellations', v: '1', s: 'This Week' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border mb-2">
            <div className="hms-section-header text-xs">OT Room Status (Live)</div>
            <table className="hms-table"><thead><tr><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Anesthesia</th><th>Start</th><th>Est. End</th><th>Elapsed</th><th>Status</th></tr></thead>
              <tbody>{otRooms.map(r => <tr key={r.room}><td className="font-bold">{r.room}</td><td>{r.currentSurgery}</td><td>{r.patient}</td><td>{r.surgeon}</td><td>{r.anesthesia !== '-' ? <StatusBadge status={r.anesthesia} /> : '-'}</td><td>{r.startTime}</td><td>{r.estEnd}</td><td>{r.elapsed}</td><td><StatusBadge status={r.status} /></td></tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Today's Schedule</div>
            <table className="hms-table"><thead><tr><th>Time</th><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Type</th><th>Duration</th><th>Status</th></tr></thead>
              <tbody>{schedule.map((s, i) => <tr key={i}><td>{s.time}</td><td>{s.room}</td><td>{s.surgery}</td><td>{s.patient}</td><td>{s.surgeon}</td><td><StatusBadge status={s.type} /></td><td>{s.duration}</td><td><StatusBadge status={s.status} /></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'OT Schedule' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input type="date" className="hms-input" />
            <select className="hms-select"><option>All OT Rooms</option>{otRooms.map(r => <option key={r.room}>{r.room}</option>)}</select>
            <select className="hms-select"><option>All Surgeons</option><option>Dr. Sharma</option><option>Dr. Singh</option><option>Dr. Gupta</option></select>
            <button className="hms-btn-primary ml-auto">+ Book OT</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Print Schedule</button>
          </div>
          <table className="hms-table"><thead><tr><th>Time</th><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Anesthesiologist</th><th>Type</th><th>Duration</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{schedule.map((s, i) => <tr key={i}><td>{s.time}</td><td>{s.room}</td><td>{s.surgery}</td><td>{s.patient}</td><td>{s.surgeon}</td><td>{s.anesthesiologist}</td><td><StatusBadge status={s.type} /></td><td>{s.duration}</td><td><StatusBadge status={s.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /> <Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Running Surgeries' && (
        <div>
          <table className="hms-table"><thead><tr><th>Room</th><th>Surgery</th><th>Patient</th><th>Surgeon</th><th>Anesthesia</th><th>Start</th><th>Est End</th><th>Elapsed</th><th>Vitals</th><th>Blood Used</th><th>Status</th></tr></thead>
            <tbody>{otRooms.filter(r => r.status === 'Running').map(r => <tr key={r.room}><td className="font-bold">{r.room}</td><td>{r.currentSurgery}</td><td>{r.patient}</td><td>{r.surgeon}</td><td><StatusBadge status={r.anesthesia} /></td><td>{r.startTime}</td><td>{r.estEnd}</td><td className="font-bold">{r.elapsed}</td><td className="text-[10px]">BP:120/80 HR:72 SpO2:99%</td><td>0 Units</td><td><StatusBadge status={r.status} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'OT Booking' && (
        <div className="bg-card border border-border p-3">
          <div className="grid grid-cols-4 gap-3">
            {[['Patient UHID','P-'],['Patient Name',''],['IPD Number','IPD-'],['Surgery Name',''],['Surgeon',''],['Anesthesiologist',''],['Preferred OT Room',''],['Preferred Date',''],['Estimated Duration',''],['Surgery Type','Elective'],['Priority','Normal'],['Special Requirements','']].map(([label, ph], i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <label className="hms-form-label">{label}</label>
                {label === 'Surgery Type' ? <select className="hms-select"><option>Elective</option><option>Emergency</option></select> :
                 label === 'Priority' ? <select className="hms-select"><option>Normal</option><option>Urgent</option><option>Emergency</option></select> :
                 label === 'Preferred Date' ? <input type="date" className="hms-input" /> :
                 <input className="hms-input" placeholder={ph as string} />}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3"><button className="hms-btn-primary">Book OT</button><button className="hms-btn-secondary">Check Availability</button></div>
        </div>
      )}

      {tab === 'Pre-Op Checklist' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>Select Patient</option><option>Suresh Yadav (P-1007) - Hernia Repair</option><option>Kavita Jain (P-1006) - Excision Biopsy</option></select>
          </div>
          <table className="hms-table"><thead><tr><th>S.No</th><th>Checklist Item</th><th>Responsible</th><th>Status</th><th>Time</th><th>Verified By</th></tr></thead>
            <tbody>{preOpChecklist.map((c, i) => <tr key={i}><td>{i + 1}</td><td>{c.item}</td><td>{c.responsible}</td><td><StatusBadge status={c.status} /></td><td>{c.status === 'Done' ? '08:30' : '-'}</td><td>{c.status === 'Done' ? 'Staff Nurse' : '-'}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Surgery Media' && (
        <div className="space-y-4">
          <div className="bg-card border border-border p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold">Upload Surgery Media</h3>
              <p className="text-[10px] text-muted-foreground">Upload images or videos for government verification (S3 Storage)</p>
            </div>
            <div className="flex items-center gap-2">
              <label className={`hms-btn-primary cursor-pointer flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Upload Media'}
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
              </label>
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden">
            <div className="hms-section-header text-xs">Media Archive</div>
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Surgery</th>
                  <th>Type</th>
                  <th>Filename</th>
                  <th>Upload Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {surgeryMedia.map((m) => (
                  <tr key={m.id}>
                    <td>{m.patient}</td>
                    <td>{m.surgery}</td>
                    <td>
                      <span className="flex items-center gap-1 text-[10px]">
                        {m.type === 'Video' ? <FileVideo size={12} className="text-blue-500" /> : <FileImage size={12} className="text-green-500" />}
                        {m.type}
                      </span>
                    </td>
                    <td className="font-mono text-[10px]">{m.name}</td>
                    <td>{m.date}</td>
                    <td>
                      <a href={m.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-[10px] font-bold">
                        View S3
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Post-Op Notes' && (
        <div>
          <table className="hms-table"><thead><tr><th>Date</th><th>Patient</th><th>Surgery</th><th>Surgeon</th><th>Findings</th><th>Procedure</th><th>Complications</th><th>Blood Loss</th><th>Duration</th><th>Action</th></tr></thead>
            <tbody>
              {[['2024-03-14','Ravi Yadav','Appendectomy','Dr. Gupta','Inflamed Appendix','Open Appendectomy','None','100ml','1h 15m'],['2024-03-14','Sunita Kumari','C-Section','Dr. Verma','CPD','LSCS','None','300ml','45m'],['2024-03-13','Deepak Kumar','Hernia Repair','Dr. Singh','Right Inguinal Hernia','Mesh Repair','None','50ml','1h 30m']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /> <Printer size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Equipment/Instruments' && (
        <div>
          <table className="hms-table"><thead><tr><th>Set Name</th><th>Items</th><th>OT Room</th><th>Sterilization</th><th>Last Used</th><th>Condition</th><th>Status</th></tr></thead>
            <tbody>
              {[['General Surgery Set','45 instruments','OT-1','2024-03-15 07:00','2024-03-14','Good','Available'],['Lap Cholecystectomy Set','22 instruments','OT-1','2024-03-15 07:00','In Use','Good','Occupied'],['Cardiac Surgery Set','68 instruments','OT-2','2024-03-15 06:30','In Use','Good','Occupied'],['Minor Surgery Set','18 instruments','OT-3','Pending','2024-03-15','Good','Cleaning'],['Eye Surgery Set','32 instruments','OT-6','2024-03-15 07:00','2024-03-14','Good','Available']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 6 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'OT Utilization' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Room-wise Utilization (This Month)</div>
            <table className="hms-table"><thead><tr><th>Room</th><th>Total Hrs</th><th>Used Hrs</th><th>Utilization</th><th>Surgeries</th><th>Cancellations</th></tr></thead>
              <tbody>{[['OT-1 (Major)','240','185','77%','45','2'],['OT-2 (Major)','240','198','82.5%','28','1'],['OT-3 (Minor)','240','156','65%','62','3'],['OT-4 (Minor)','240','142','59%','55','4'],['OT-5 (Emergency)','720','210','29%','35','0'],['OT-6 (Eye)','240','168','70%','82','2']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Surgeon-wise Statistics</div>
            <table className="hms-table"><thead><tr><th>Surgeon</th><th>Surgeries</th><th>Avg Duration</th><th>Complications</th><th>Cancellations</th></tr></thead>
              <tbody>{[['Dr. Sharma (Cardiac)','12','4.5 hrs','0','0'],['Dr. Singh (General)','28','1.8 hrs','1','1'],['Dr. Gupta (Ortho)','22','2.2 hrs','0','2'],['Dr. Verma (OBG)','18','1.2 hrs','0','0'],['Dr. Agarwal (Eye)','35','0.8 hrs','0','1']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Anesthesia Log' && (
        <div>
          <table className="hms-table"><thead><tr><th>Date</th><th>Patient</th><th>Surgery</th><th>Type</th><th>Agent</th><th>Dose</th><th>Anesthesiologist</th><th>ASA Grade</th><th>Intubation</th><th>Duration</th><th>Complications</th><th>Recovery</th></tr></thead>
            <tbody>
              {[['2024-03-15','Rajesh Kumar','CABG','GA','Sevoflurane+O2','2%','Dr. Mehta','III','ETT 7.5','3h 45m (ongoing)','None','--'],['2024-03-15','Mohan Lal','Lap Chole','GA','Propofol+Sevo','200mg+2%','Dr. Jain','II','LMA #4','1h 45m (ongoing)','None','--'],['2024-03-15','Ravi Yadav','Appendectomy','SA','Bupivacaine 0.5%','3ml','Dr. Mehta','I','N/A','1h 15m (ongoing)','None','--'],['2024-03-14','Sunita Kumari','C-Section','SA','Bupivacaine 0.5%','2.5ml','Dr. Kumar','I','N/A','45m','None','Smooth']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 3 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OTManagement;
