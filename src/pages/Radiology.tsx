import React, { useState } from 'react';
import { Scan, Eye, Printer, Plus, Clock, CheckCircle2, Monitor, Image, FileText } from 'lucide-react';

const radiologyOrders = [
  { id: 'RAD-4001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', age: '45Y', modality: 'X-Ray', exam: 'Chest PA', priority: 'Routine', refDoctor: 'Dr. Alok Mehta', dept: 'General Medicine', ordered: '08:00 AM', scheduled: '09:00 AM', room: 'X-Ray Room 1', tech: 'Deepak', status: 'Completed' },
  { id: 'RAD-4002', uhid: 'U-1003', patient: 'Mr. Amit Sharma', age: '28Y', modality: 'CT Scan', exam: 'CT Brain (Plain + Contrast)', priority: 'Urgent', refDoctor: 'Dr. Rahul Verma', dept: 'Orthopedics', ordered: '08:30 AM', scheduled: '09:30 AM', room: 'CT Suite', tech: 'Rakesh', status: 'In Progress' },
  { id: 'RAD-4003', uhid: 'U-1005', patient: 'Mr. Suresh Yadav', age: '55Y', modality: 'USG', exam: 'USG Whole Abdomen', priority: 'Routine', refDoctor: 'Dr. Alok Mehta', dept: 'General Medicine', ordered: '09:00 AM', scheduled: '10:00 AM', room: 'USG Room 1', tech: 'Dr. Meena', status: 'Waiting' },
  { id: 'RAD-4004', uhid: 'U-1008', patient: 'Mrs. Kamla Devi', age: '60Y', modality: 'MRI', exam: 'MRI Knee (Both)', priority: 'Routine', refDoctor: 'Dr. Rahul Verma', dept: 'Orthopedics', ordered: '09:15 AM', scheduled: '11:00 AM', room: 'MRI Suite', tech: 'Ajay', status: 'Scheduled' },
  { id: 'RAD-4005', uhid: 'U-1012', patient: 'Mr. Suresh Pal', age: '38Y', modality: 'X-Ray', exam: 'X-Ray Lumbar Spine AP/Lat', priority: 'Routine', refDoctor: 'Dr. Priya Singh', dept: 'General Surgery', ordered: '09:30 AM', scheduled: '10:30 AM', room: 'X-Ray Room 2', tech: 'Deepak', status: 'Waiting' },
  { id: 'RAD-4006', uhid: 'U-2005', patient: 'Mrs. Savitri Devi', age: '65Y', modality: 'CT Scan', exam: 'HRCT Chest', priority: 'Emergency', refDoctor: 'Dr. Alok Mehta', dept: 'Pulmonology', ordered: '07:45 AM', scheduled: '08:15 AM', room: 'CT Suite', tech: 'Rakesh', status: 'Completed' },
  { id: 'RAD-4007', uhid: 'U-1020', patient: 'Mr. Dinesh Kumar', age: '60Y', modality: 'Mammography', exam: 'Bilateral Mammography', priority: 'Routine', refDoctor: 'Dr. Neha Gupta', dept: 'General Surgery', ordered: '10:00 AM', scheduled: '11:30 AM', room: 'Mammo Room', tech: 'Sr. Kavita', status: 'Scheduled' },
  { id: 'RAD-4008', uhid: 'U-1025', patient: 'Baby Arjun', age: '6M', modality: 'USG', exam: 'USG Brain (Cranial)', priority: 'Urgent', refDoctor: 'Dr. Neha Gupta', dept: 'Pediatrics', ordered: '10:15 AM', scheduled: '10:45 AM', room: 'USG Room 2', tech: 'Dr. Meena', status: 'Waiting' },
];

const radiologyReports = [
  { id: 'RRPT-5001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', exam: 'X-Ray Chest PA', findings: 'Bilateral clear lung fields. Normal cardiac silhouette. No pleural effusion.', impression: 'Normal chest X-ray', radiologist: 'Dr. A.K. Jain', dictatedAt: '09:30 AM', status: 'Final' },
  { id: 'RRPT-5002', uhid: 'U-2005', patient: 'Mrs. Savitri Devi', exam: 'HRCT Chest', findings: 'Bilateral ground-glass opacities in lower lobes. Minimal pleural effusion on right. No lymphadenopathy.', impression: 'Suggestive of interstitial lung disease. Correlate clinically.', radiologist: 'Dr. A.K. Jain', dictatedAt: '09:00 AM', status: 'Final' },
  { id: 'RRPT-5003', uhid: 'U-1003', patient: 'Mr. Amit Sharma', exam: 'CT Brain', findings: '-', impression: '-', radiologist: 'Dr. A.K. Jain', dictatedAt: '-', status: 'Pending Dictation' },
];

const equipmentStatus = [
  { id: 'REQ-01', name: 'Digital X-Ray (Siemens Ysio Max)', room: 'X-Ray Room 1', lastService: '01-Feb-2026', nextService: '01-May-2026', uptime: '99.2%', examToday: 12, totalExams: 45600, status: 'Operational' },
  { id: 'REQ-02', name: 'Digital X-Ray (Carestream DRX)', room: 'X-Ray Room 2', lastService: '15-Jan-2026', nextService: '15-Apr-2026', uptime: '98.8%', examToday: 8, totalExams: 32100, status: 'Operational' },
  { id: 'REQ-03', name: '128-Slice CT Scanner (GE Revolution)', room: 'CT Suite', lastService: '10-Feb-2026', nextService: '10-May-2026', uptime: '99.5%', examToday: 5, totalExams: 12400, status: 'Operational' },
  { id: 'REQ-04', name: '1.5T MRI (Siemens Magnetom)', room: 'MRI Suite', lastService: '20-Jan-2026', nextService: '20-Apr-2026', uptime: '98.5%', examToday: 2, totalExams: 8900, status: 'Operational' },
  { id: 'REQ-05', name: 'USG (GE Voluson E10)', room: 'USG Room 1', lastService: '05-Feb-2026', nextService: '05-May-2026', uptime: '99.0%', examToday: 6, totalExams: 28700, status: 'Operational' },
  { id: 'REQ-06', name: 'USG (Philips Affiniti 70)', room: 'USG Room 2', lastService: '25-Jan-2026', nextService: '25-Apr-2026', uptime: '97.5%', examToday: 3, totalExams: 15600, status: 'Under Maintenance' },
  { id: 'REQ-07', name: 'Mammography (Hologic Selenia)', room: 'Mammo Room', lastService: '28-Jan-2026', nextService: '28-Apr-2026', uptime: '99.1%', examToday: 1, totalExams: 4500, status: 'Operational' },
  { id: 'REQ-08', name: 'C-Arm (Siemens Cios Alpha)', room: 'OT-1', lastService: '01-Feb-2026', nextService: '01-May-2026', uptime: '99.3%', examToday: 2, totalExams: 6700, status: 'Operational' },
];

const contrastInventory = [
  { name: 'Iohexol 300mg/ml (100ml)', brand: 'Omnipaque', stock: 45, minStock: 20, expiry: '30-Jun-2026', supplier: 'GE Healthcare', status: 'Adequate' },
  { name: 'Gadolinium DTPA 15ml', brand: 'Magnevist', stock: 12, minStock: 10, expiry: '15-Aug-2026', supplier: 'Bayer', status: 'Low' },
  { name: 'Barium Sulfate Suspension 250ml', brand: 'E-Z-HD', stock: 30, minStock: 15, expiry: '20-Sep-2026', supplier: 'Bracco', status: 'Adequate' },
  { name: 'Iohexol 300mg/ml (50ml)', brand: 'Omnipaque', stock: 8, minStock: 15, expiry: '30-Jun-2026', supplier: 'GE Healthcare', status: 'Critical' },
];

type Tab = 'orders' | 'reports' | 'equipment' | 'contrast' | 'pacs' | 'schedule' | 'dose';

const tabs: { key: Tab; label: string }[] = [
  { key: 'orders', label: 'Radiology Orders' },
  { key: 'reports', label: 'Reports & Dictation' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'contrast', label: 'Contrast Inventory' },
  { key: 'pacs', label: 'PACS/DICOM' },
  { key: 'schedule', label: 'Room Schedule' },
  { key: 'dose', label: 'Radiation Dose' },
];

const Radiology = () => {
  const [tab, setTab] = useState<Tab>('orders');
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Scan size={16} /> Radiology & Imaging Management</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search patient/exam..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary"><Plus size={12} /> New Order</button>
          <button className="hms-btn-secondary">PACS Viewer</button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-1 my-1">
        {[
          { label: 'Total Orders', value: radiologyOrders.length },
          { label: 'Completed', value: radiologyOrders.filter(r => r.status === 'Completed').length },
          { label: 'In Progress', value: 1, color: 'text-primary' },
          { label: 'Waiting', value: radiologyOrders.filter(r => r.status === 'Waiting').length, color: 'text-destructive' },
          { label: 'Scheduled', value: 2 },
          { label: 'Reports Done', value: 2 },
          { label: 'Pending Dict.', value: 1, color: 'text-destructive' },
          { label: 'Revenue', value: '₹1.2L' },
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
        {tab === 'orders' && (
          <table className="hms-table">
            <thead><tr><th>Order ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Modality</th><th>Examination</th><th>Priority</th><th>Ref Doctor</th><th>Ordered</th><th>Scheduled</th><th>Room</th><th>Tech</th><th>Status</th></tr></thead>
            <tbody>
              {radiologyOrders.filter(r => r.patient.toLowerCase().includes(search.toLowerCase())).map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.uhid}</td><td>{r.patient}</td><td>{r.age}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${r.modality === 'CT Scan' ? 'bg-primary text-primary-foreground' : r.modality === 'MRI' ? 'bg-hms-info text-primary-foreground' : 'bg-muted text-foreground'}`}>{r.modality}</span></td>
                  <td className="text-[10px]">{r.exam}</td>
                  <td><span className={`text-[10px] px-1 py-0.5 ${r.priority === 'Emergency' ? 'bg-destructive text-destructive-foreground' : r.priority === 'Urgent' ? 'bg-hms-warning' : 'bg-muted text-foreground'}`}>{r.priority}</span></td>
                  <td>{r.refDoctor}</td><td>{r.ordered}</td><td>{r.scheduled}</td><td className="text-[10px]">{r.room}</td><td>{r.tech}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : r.status === 'In Progress' ? 'bg-hms-info text-primary-foreground' : r.status === 'Waiting' ? 'bg-hms-warning' : 'bg-muted text-foreground'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'reports' && (
          <table className="hms-table">
            <thead><tr><th>Report ID</th><th>UHID</th><th>Patient</th><th>Exam</th><th>Findings</th><th>Impression</th><th>Radiologist</th><th>Dictated At</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {radiologyReports.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.uhid}</td><td>{r.patient}</td><td>{r.exam}</td>
                  <td className="text-[10px] max-w-[200px]">{r.findings}</td><td className="text-[10px] max-w-[150px]">{r.impression}</td>
                  <td>{r.radiologist}</td><td>{r.dictatedAt}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.status === 'Final' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{r.status}</span></td>
                  <td><Eye size={12} className="text-primary cursor-pointer inline mr-1" /><Printer size={12} className="text-primary cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'equipment' && (
          <table className="hms-table">
            <thead><tr><th>ID</th><th>Equipment</th><th>Room</th><th>Last Service</th><th>Next Service</th><th>Uptime</th><th>Today</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {equipmentStatus.map(e => (
                <tr key={e.id}>
                  <td className="font-semibold">{e.id}</td><td className="text-[10px]">{e.name}</td><td>{e.room}</td><td>{e.lastService}</td><td>{e.nextService}</td>
                  <td>{e.uptime}</td><td>{e.examToday}</td><td>{e.totalExams.toLocaleString()}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${e.status === 'Operational' ? 'bg-hms-success text-hms-success-foreground' : 'bg-destructive text-destructive-foreground'}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'contrast' && (
          <>
            <div className="p-1 text-[10px] bg-muted border-b border-border px-2">Contrast Media & Consumables Inventory</div>
            <table className="hms-table">
              <thead><tr><th>Item</th><th>Brand</th><th>Stock</th><th>Min Stock</th><th>Expiry</th><th>Supplier</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {contrastInventory.map((c, i) => (
                  <tr key={i}>
                    <td className="text-[10px]">{c.name}</td><td>{c.brand}</td><td>{c.stock}</td><td>{c.minStock}</td><td>{c.expiry}</td><td>{c.supplier}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 ${c.status === 'Adequate' ? 'bg-hms-success text-hms-success-foreground' : c.status === 'Critical' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{c.status}</span></td>
                    <td><button className="hms-btn-primary text-[10px]">Reorder</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'pacs' && (
          <div className="p-2 space-y-2">
            <div className="text-xs font-bold">PACS / DICOM Server Status</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'PACS Server', value: 'Online', ip: '192.168.1.100', storage: '12.5 TB / 20 TB', studies: '1,24,500' },
                { label: 'DICOM Router', value: 'Online', ip: '192.168.1.101', storage: '-', studies: '-' },
                { label: 'Backup Server', value: 'Online', ip: '192.168.1.102', storage: '12.5 TB / 20 TB', studies: '1,24,500' },
              ].map((s, i) => (
                <div key={i} className="border border-border p-2">
                  <div className="text-xs font-bold">{s.label}</div>
                  <div className="text-[10px]">Status: <span className="text-hms-success font-bold">{s.value}</span></div>
                  <div className="text-[10px]">IP: {s.ip}</div>
                  {s.storage !== '-' && <div className="text-[10px]">Storage: {s.storage}</div>}
                  {s.studies !== '-' && <div className="text-[10px]">Studies: {s.studies}</div>}
                </div>
              ))}
            </div>
            <div className="text-xs font-bold mt-2">Recent DICOM Transfers</div>
            <table className="hms-table">
              <thead><tr><th>Time</th><th>Source</th><th>Destination</th><th>Patient</th><th>Study</th><th>Images</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { time: '09:35 AM', src: 'CT Scanner', dst: 'PACS Server', pt: 'Mr. Amit Sharma', study: 'CT Brain', imgs: 256, s: 'Completed' },
                  { time: '09:20 AM', src: 'X-Ray Room 1', dst: 'PACS Server', pt: 'Mr. Rajesh Kumar', study: 'Chest PA', imgs: 2, s: 'Completed' },
                  { time: '08:45 AM', src: 'CT Scanner', dst: 'PACS Server', pt: 'Mrs. Savitri Devi', study: 'HRCT Chest', imgs: 512, s: 'Completed' },
                ].map((t, i) => (
                  <tr key={i}>
                    <td>{t.time}</td><td>{t.src}</td><td>{t.dst}</td><td>{t.pt}</td><td>{t.study}</td><td>{t.imgs}</td>
                    <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{t.s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'schedule' && (
          <div className="p-2">
            <div className="text-xs font-bold mb-1">Room-wise Schedule — 15-Feb-2026</div>
            <div className="grid grid-cols-2 gap-2">
              {['X-Ray Room 1', 'CT Suite', 'MRI Suite', 'USG Room 1'].map(room => (
                <div key={room} className="border border-border p-1.5">
                  <div className="text-xs font-bold bg-muted px-1 py-0.5 mb-1">{room}</div>
                  {radiologyOrders.filter(r => r.room === room).map(r => (
                    <div key={r.id} className="flex items-center justify-between text-[10px] border-b border-border py-0.5">
                      <span>{r.scheduled} — {r.patient}</span>
                      <span className={`px-1 py-0.5 ${r.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : r.status === 'In Progress' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{r.status}</span>
                    </div>
                  ))}
                  {radiologyOrders.filter(r => r.room === room).length === 0 && <div className="text-[10px] text-muted-foreground">No exams scheduled</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'dose' && (
          <div className="p-2">
            <div className="text-xs font-bold mb-1">Radiation Dose Monitoring</div>
            <table className="hms-table">
              <thead><tr><th>Patient</th><th>Exam</th><th>kVp</th><th>mAs</th><th>CTDIvol (mGy)</th><th>DLP (mGy·cm)</th><th>Effective Dose (mSv)</th><th>DRL Limit</th><th>Compliance</th></tr></thead>
              <tbody>
                {[
                  { p: 'Mr. Rajesh Kumar', e: 'X-Ray Chest PA', kvp: 120, mas: 5, ctdi: '-', dlp: '-', eff: '0.02', drl: '0.1 mSv', comp: 'Within' },
                  { p: 'Mrs. Savitri Devi', e: 'HRCT Chest', kvp: 120, mas: 150, ctdi: '8.5', dlp: '350', eff: '5.2', drl: '10 mSv', comp: 'Within' },
                  { p: 'Mr. Amit Sharma', e: 'CT Brain', kvp: 120, mas: 300, ctdi: '55', dlp: '850', eff: '1.8', drl: '2.5 mSv', comp: 'Within' },
                ].map((d, i) => (
                  <tr key={i}>
                    <td>{d.p}</td><td>{d.e}</td><td>{d.kvp}</td><td>{d.mas}</td><td>{d.ctdi}</td><td>{d.dlp}</td><td>{d.eff}</td><td className="text-[10px]">{d.drl}</td>
                    <td><span className="text-[10px] px-1.5 py-0.5 bg-hms-success text-hms-success-foreground">{d.comp}</span></td>
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

export default Radiology;
