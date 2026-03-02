import React, { useState } from 'react';
import { Droplets, Users, Clock, CheckCircle2, AlertTriangle, ThermometerSun, Search, Printer, Eye, Plus } from 'lucide-react';

const bloodStock = [
  { group: 'A+', wholeBlood: 45, packedRBC: 32, platelets: 18, ffp: 25, cryo: 12 },
  { group: 'A-', wholeBlood: 8, packedRBC: 5, platelets: 3, ffp: 6, cryo: 2 },
  { group: 'B+', wholeBlood: 52, packedRBC: 38, platelets: 22, ffp: 30, cryo: 15 },
  { group: 'B-', wholeBlood: 6, packedRBC: 4, platelets: 2, ffp: 5, cryo: 1 },
  { group: 'O+', wholeBlood: 68, packedRBC: 45, platelets: 28, ffp: 35, cryo: 20 },
  { group: 'O-', wholeBlood: 12, packedRBC: 8, platelets: 5, ffp: 8, cryo: 3 },
  { group: 'AB+', wholeBlood: 15, packedRBC: 10, platelets: 8, ffp: 12, cryo: 5 },
  { group: 'AB-', wholeBlood: 3, packedRBC: 2, platelets: 1, ffp: 3, cryo: 1 },
];

const donors = [
  { id: 'D-1001', name: 'Ramesh Yadav', age: 32, gender: 'M', group: 'O+', phone: '9876543220', lastDonation: '12-Nov-2025', totalDonations: 8, status: 'Eligible' },
  { id: 'D-1002', name: 'Sunil Sharma', age: 28, gender: 'M', group: 'A+', phone: '9876543221', lastDonation: '05-Jan-2026', totalDonations: 4, status: 'Deferred' },
  { id: 'D-1003', name: 'Geeta Kumari', age: 35, gender: 'F', group: 'B+', phone: '9876543222', lastDonation: '20-Dec-2025', totalDonations: 6, status: 'Eligible' },
  { id: 'D-1004', name: 'Manoj Tiwari', age: 40, gender: 'M', group: 'AB+', phone: '9876543223', lastDonation: '15-Feb-2026', totalDonations: 12, status: 'Recently Donated' },
  { id: 'D-1005', name: 'Priya Gupta', age: 25, gender: 'F', group: 'O-', phone: '9876543224', lastDonation: '01-Sep-2025', totalDonations: 3, status: 'Eligible' },
  { id: 'D-1006', name: 'Ashok Kumar', age: 45, gender: 'M', group: 'B-', phone: '9876543225', lastDonation: '10-Oct-2025', totalDonations: 15, status: 'Eligible' },
];

const bloodRequests = [
  { id: 'BR-2001', patient: 'Mr. Vikram Singh', uhid: 'U-1002', ward: 'ICU-03', group: 'A+', component: 'Packed RBC', units: 2, doctor: 'Dr. Alok Mehta', date: '15-Feb-2026', priority: 'Urgent', crossMatch: 'Compatible', status: 'Issued' },
  { id: 'BR-2002', patient: 'Mrs. Kamla Devi', uhid: 'U-1008', ward: 'Ward-A/B-12', group: 'O+', component: 'Whole Blood', units: 1, doctor: 'Dr. Rahul Verma', date: '15-Feb-2026', priority: 'Routine', crossMatch: 'Pending', status: 'Processing' },
  { id: 'BR-2003', patient: 'Baby Riya', uhid: 'U-1004', ward: 'NICU-01', group: 'B+', component: 'Platelets', units: 1, doctor: 'Dr. Neha Gupta', date: '15-Feb-2026', priority: 'Emergency', crossMatch: 'Compatible', status: 'Issued' },
  { id: 'BR-2004', patient: 'Mr. Suresh Pal', uhid: 'U-1012', ward: 'OT-2', group: 'AB-', component: 'FFP', units: 3, doctor: 'Dr. Priya Singh', date: '15-Feb-2026', priority: 'Urgent', crossMatch: 'Incompatible', status: 'Rejected' },
  { id: 'BR-2005', patient: 'Mrs. Anita Devi', uhid: 'U-1015', ward: 'Ward-B/B-05', group: 'A-', component: 'Packed RBC', units: 1, doctor: 'Dr. Alok Mehta', date: '15-Feb-2026', priority: 'Routine', crossMatch: 'Pending', status: 'Pending' },
];

const crossMatchLog = [
  { id: 'CM-301', patient: 'Mr. Vikram Singh', group: 'A+', donorBag: 'BAG-A1-045', component: 'Packed RBC', method: 'Gel Card', result: 'Compatible', techBy: 'Ravi Kumar', date: '15-Feb-2026 08:30' },
  { id: 'CM-302', patient: 'Baby Riya', group: 'B+', donorBag: 'BAG-B1-022', component: 'Platelets', method: 'Tube Method', result: 'Compatible', techBy: 'Sunita Devi', date: '15-Feb-2026 09:15' },
  { id: 'CM-303', patient: 'Mr. Suresh Pal', group: 'AB-', donorBag: 'BAG-AB2-003', component: 'FFP', method: 'Gel Card', result: 'Incompatible', techBy: 'Ravi Kumar', date: '15-Feb-2026 10:00' },
  { id: 'CM-304', patient: 'Mrs. Kamla Devi', group: 'O+', donorBag: 'BAG-O1-068', component: 'Whole Blood', method: 'Tube Method', result: 'Pending', techBy: 'Amit Chauhan', date: '15-Feb-2026 11:45' },
];

const expiryAlerts = [
  { bagId: 'BAG-A1-012', group: 'A+', component: 'Whole Blood', collected: '10-Jan-2026', expiry: '16-Feb-2026', daysLeft: 1, storage: 'Refrigerator-1' },
  { bagId: 'BAG-O1-034', group: 'O+', component: 'Platelets', collected: '13-Feb-2026', expiry: '18-Feb-2026', daysLeft: 3, storage: 'Agitator-2' },
  { bagId: 'BAG-B2-008', group: 'B-', component: 'FFP', collected: '20-Nov-2025', expiry: '20-Feb-2026', daysLeft: 5, storage: 'Freezer-1' },
  { bagId: 'BAG-AB1-005', group: 'AB+', component: 'Packed RBC', collected: '28-Jan-2026', expiry: '21-Feb-2026', daysLeft: 6, storage: 'Refrigerator-2' },
];

type Tab = 'stock' | 'donors' | 'requests' | 'crossmatch' | 'expiry' | 'transfusion' | 'camps';

const tabs: { key: Tab; label: string }[] = [
  { key: 'stock', label: 'Blood Stock' },
  { key: 'donors', label: 'Donor Registry' },
  { key: 'requests', label: 'Blood Requests' },
  { key: 'crossmatch', label: 'Cross Match' },
  { key: 'expiry', label: 'Expiry Alerts' },
  { key: 'transfusion', label: 'Transfusion Log' },
  { key: 'camps', label: 'Donation Camps' },
];

const transfusionLog = [
  { id: 'TRF-401', patient: 'Mr. Vikram Singh', uhid: 'U-1002', bag: 'BAG-A1-045', component: 'Packed RBC', units: 1, startTime: '09:00', endTime: '12:30', reaction: 'None', nurse: 'Sr. Meena', doctor: 'Dr. Alok Mehta', status: 'Completed' },
  { id: 'TRF-402', patient: 'Baby Riya', uhid: 'U-1004', bag: 'BAG-B1-022', component: 'Platelets', units: 1, startTime: '10:00', endTime: '11:30', reaction: 'None', nurse: 'Sr. Kavita', doctor: 'Dr. Neha Gupta', status: 'Completed' },
  { id: 'TRF-403', patient: 'Mrs. Kamla Devi', uhid: 'U-1008', bag: 'BAG-O1-068', component: 'Whole Blood', units: 1, startTime: '14:00', endTime: '-', reaction: '-', nurse: 'Sr. Meena', doctor: 'Dr. Rahul Verma', status: 'In Progress' },
];

const donationCamps = [
  { id: 'CAMP-01', name: 'Noida Blood Drive', location: 'Sector 62 Community Center', date: '20-Feb-2026', organizer: 'Rotary Club', target: 100, collected: 0, status: 'Upcoming' },
  { id: 'CAMP-02', name: 'GUC Annual Camp', location: 'Hospital Auditorium', date: '10-Feb-2026', organizer: 'GUC Hospital', target: 50, collected: 48, status: 'Completed' },
  { id: 'CAMP-03', name: 'Corporate Drive - TCS', location: 'TCS Noida Office', date: '25-Feb-2026', organizer: 'TCS CSR', target: 75, collected: 0, status: 'Upcoming' },
];

const BloodBank = () => {
  const [tab, setTab] = useState<Tab>('stock');
  const [search, setSearch] = useState('');

  const totalUnits = bloodStock.reduce((s, b) => s + b.wholeBlood + b.packedRBC + b.platelets + b.ffp + b.cryo, 0);
  const criticalGroups = bloodStock.filter(b => b.wholeBlood < 10).length;

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Droplets size={16} /> Blood Bank Management</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="hms-btn-primary"><Plus size={12} /> New Request</button>
          <button className="hms-btn-secondary"><Plus size={12} /> Register Donor</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-1 my-1">
        {[
          { label: 'Total Units', value: totalUnits, color: '' },
          { label: 'Critical Groups', value: criticalGroups, color: 'text-destructive' },
          { label: 'Pending Requests', value: 2, color: 'text-primary' },
          { label: 'Today Issued', value: 3, color: '' },
          { label: 'Expiring (7d)', value: expiryAlerts.length, color: 'text-destructive' },
          { label: 'Registered Donors', value: donors.length, color: '' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-1.5 text-center">
            <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[9px] text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-primary overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${tab === t.key ? 'bg-card text-foreground' : 'text-primary-foreground hover:bg-primary-foreground/10'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border">
        {tab === 'stock' && (
          <>
            <div className="p-1 text-[10px] text-muted-foreground bg-muted border-b border-border px-2">Component-wise stock by blood group (units available)</div>
            <table className="hms-table">
              <thead><tr><th>Blood Group</th><th>Whole Blood</th><th>Packed RBC</th><th>Platelets</th><th>FFP</th><th>Cryoprecipitate</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {bloodStock.map(b => {
                  const total = b.wholeBlood + b.packedRBC + b.platelets + b.ffp + b.cryo;
                  const critical = b.wholeBlood < 10;
                  return (
                    <tr key={b.group}>
                      <td className="font-bold text-sm">{b.group}</td>
                      <td>{b.wholeBlood}</td><td>{b.packedRBC}</td><td>{b.platelets}</td><td>{b.ffp}</td><td>{b.cryo}</td>
                      <td className="font-bold">{total}</td>
                      <td><span className={`text-[10px] px-1.5 py-0.5 ${critical ? 'bg-destructive text-destructive-foreground' : 'bg-hms-success text-hms-success-foreground'}`}>{critical ? 'CRITICAL' : 'Adequate'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-1 text-[10px] text-muted-foreground px-2 border-t border-border">Storage Temp: Refrigerators 2-6°C ✓ | Freezers -30°C ✓ | Platelet Agitators 20-24°C ✓</div>
          </>
        )}

        {tab === 'donors' && (
          <table className="hms-table">
            <thead><tr><th>Donor ID</th><th>Name</th><th>Age</th><th>Sex</th><th>Group</th><th>Phone</th><th>Last Donation</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {donors.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
                <tr key={d.id}>
                  <td className="font-semibold">{d.id}</td><td>{d.name}</td><td>{d.age}</td><td>{d.gender}</td>
                  <td className="font-bold">{d.group}</td><td>{d.phone}</td><td>{d.lastDonation}</td><td>{d.totalDonations}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${d.status === 'Eligible' ? 'bg-hms-success text-hms-success-foreground' : d.status === 'Deferred' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{d.status}</span></td>
                  <td><button className="hms-btn-secondary text-[10px] mr-1">View</button><button className="hms-btn-primary text-[10px]">Collect</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'requests' && (
          <table className="hms-table">
            <thead><tr><th>Req ID</th><th>Patient</th><th>UHID</th><th>Ward</th><th>Group</th><th>Component</th><th>Units</th><th>Doctor</th><th>Priority</th><th>Cross Match</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bloodRequests.map(r => (
                <tr key={r.id}>
                  <td className="font-semibold">{r.id}</td><td>{r.patient}</td><td>{r.uhid}</td><td>{r.ward}</td>
                  <td className="font-bold">{r.group}</td><td>{r.component}</td><td>{r.units}</td><td>{r.doctor}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.priority === 'Emergency' ? 'bg-destructive text-destructive-foreground' : r.priority === 'Urgent' ? 'bg-hms-warning' : 'bg-muted text-foreground'}`}>{r.priority}</span></td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.crossMatch === 'Compatible' ? 'bg-hms-success text-hms-success-foreground' : r.crossMatch === 'Incompatible' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{r.crossMatch}</span></td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${r.status === 'Issued' ? 'bg-hms-success text-hms-success-foreground' : r.status === 'Rejected' ? 'bg-destructive text-destructive-foreground' : r.status === 'Processing' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{r.status}</span></td>
                  <td><Eye size={12} className="text-primary cursor-pointer inline" /> <Printer size={12} className="text-primary cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'crossmatch' && (
          <table className="hms-table">
            <thead><tr><th>CM ID</th><th>Patient</th><th>Group</th><th>Donor Bag</th><th>Component</th><th>Method</th><th>Result</th><th>Technician</th><th>Date/Time</th></tr></thead>
            <tbody>
              {crossMatchLog.map(c => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.id}</td><td>{c.patient}</td><td className="font-bold">{c.group}</td><td>{c.donorBag}</td><td>{c.component}</td><td>{c.method}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${c.result === 'Compatible' ? 'bg-hms-success text-hms-success-foreground' : c.result === 'Incompatible' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{c.result}</span></td>
                  <td>{c.techBy}</td><td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'expiry' && (
          <>
            <div className="p-1 text-[10px] bg-destructive/10 text-destructive border-b border-border px-2 font-semibold">⚠ Blood bags expiring within 7 days — take immediate action</div>
            <table className="hms-table">
              <thead><tr><th>Bag ID</th><th>Group</th><th>Component</th><th>Collected</th><th>Expiry</th><th>Days Left</th><th>Storage</th><th>Action</th></tr></thead>
              <tbody>
                {expiryAlerts.map(e => (
                  <tr key={e.bagId}>
                    <td className="font-semibold">{e.bagId}</td><td className="font-bold">{e.group}</td><td>{e.component}</td><td>{e.collected}</td><td className="text-destructive font-semibold">{e.expiry}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 font-bold ${e.daysLeft <= 2 ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{e.daysLeft}d</span></td>
                    <td>{e.storage}</td>
                    <td><button className="hms-btn-primary text-[10px] mr-1">Issue</button><button className="hms-btn-secondary text-[10px]">Discard</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'transfusion' && (
          <table className="hms-table">
            <thead><tr><th>TRF ID</th><th>Patient</th><th>UHID</th><th>Bag</th><th>Component</th><th>Units</th><th>Start</th><th>End</th><th>Reaction</th><th>Nurse</th><th>Doctor</th><th>Status</th></tr></thead>
            <tbody>
              {transfusionLog.map(t => (
                <tr key={t.id}>
                  <td className="font-semibold">{t.id}</td><td>{t.patient}</td><td>{t.uhid}</td><td>{t.bag}</td><td>{t.component}</td><td>{t.units}</td>
                  <td>{t.startTime}</td><td>{t.endTime}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${t.reaction === 'None' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{t.reaction}</span></td>
                  <td>{t.nurse}</td><td>{t.doctor}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${t.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-info text-primary-foreground'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'camps' && (
          <table className="hms-table">
            <thead><tr><th>Camp ID</th><th>Name</th><th>Location</th><th>Date</th><th>Organizer</th><th>Target</th><th>Collected</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {donationCamps.map(c => (
                <tr key={c.id}>
                  <td className="font-semibold">{c.id}</td><td>{c.name}</td><td>{c.location}</td><td>{c.date}</td><td>{c.organizer}</td><td>{c.target}</td><td>{c.collected}</td>
                  <td><span className={`text-[10px] px-1.5 py-0.5 ${c.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-info text-primary-foreground'}`}>{c.status}</span></td>
                  <td><button className="hms-btn-secondary text-[10px]">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BloodBank;
