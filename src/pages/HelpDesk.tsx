import React, { useState } from 'react';
import { Headphones, Eye, Edit, MessageSquare, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { extractArray, getHelpdeskTickets } from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 'Open': 'bg-blue-700 text-white', 'In Progress': 'bg-yellow-600 text-white', 'Resolved': 'bg-green-700 text-white', 'Closed': 'bg-muted text-foreground', 'Escalated': 'bg-red-700 text-white', 'High': 'bg-red-700 text-white', 'Medium': 'bg-yellow-600 text-white', 'Low': 'bg-green-700 text-white', 'Critical': 'bg-red-900 text-white', 'Overdue': 'bg-red-700 text-white', 'Within SLA': 'bg-green-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const tickets = [
  { id: 'TKT-001', subject: 'AC not working in Ward-A', category: 'Maintenance', dept: 'Facilities', priority: 'High', raised: 'Nurse Station A', assigned: 'Maintenance Team', created: '2024-03-15 08:30', sla: '4 hrs', due: '2024-03-15 12:30', status: 'In Progress' },
  { id: 'TKT-002', subject: 'HIS login failure for Dr. Sharma', category: 'IT Support', dept: 'IT', priority: 'Critical', raised: 'Dr. Sharma', assigned: 'IT Help Desk', created: '2024-03-15 09:00', sla: '1 hr', due: '2024-03-15 10:00', status: 'Escalated' },
  { id: 'TKT-003', subject: 'Bed repair needed B-15 Ward-C', category: 'Biomedical', dept: 'Biomedical', priority: 'Medium', raised: 'Ward-C Nurse', assigned: 'BioMed Team', created: '2024-03-15 07:45', sla: '8 hrs', due: '2024-03-15 15:45', status: 'Open' },
  { id: 'TKT-004', subject: 'Printer not working at Billing', category: 'IT Support', dept: 'IT', priority: 'Medium', raised: 'Billing Counter', assigned: 'IT Support', created: '2024-03-14 16:00', sla: '4 hrs', due: '2024-03-14 20:00', status: 'Overdue' },
  { id: 'TKT-005', subject: 'Water leakage in OT corridor', category: 'Housekeeping', dept: 'Facilities', priority: 'High', raised: 'OT Staff', assigned: 'Plumbing Team', created: '2024-03-15 06:30', sla: '2 hrs', due: '2024-03-15 08:30', status: 'Resolved' },
  { id: 'TKT-006', subject: 'Oxygen pipeline pressure low in ICU', category: 'Biomedical', dept: 'Biomedical', priority: 'Critical', raised: 'ICU Duty Doctor', assigned: 'Gas Plant Team', created: '2024-03-15 05:00', sla: '30 min', due: '2024-03-15 05:30', status: 'Resolved' },
  { id: 'TKT-007', subject: 'CCTV camera down - Parking Area', category: 'Security', dept: 'Security', priority: 'Low', raised: 'Security Guard', assigned: 'IT Infra', created: '2024-03-14 22:00', sla: '24 hrs', due: '2024-03-15 22:00', status: 'Open' },
  { id: 'TKT-008', subject: 'Lab report delay complaint', category: 'Patient Complaint', dept: 'Laboratory', priority: 'High', raised: 'Patient P-1045', assigned: 'Lab Manager', created: '2024-03-15 10:00', sla: '2 hrs', due: '2024-03-15 12:00', status: 'In Progress' },
];

const HelpDesk = () => {
  const tabs = ['Dashboard','All Tickets','Open Tickets','Escalations','Knowledge Base','SLA Report','Staff Performance','Settings'];
  const [tab, setTab] = useState('Dashboard');
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getHelpdeskTickets();
      if (res.ok) setTicketsList(extractArray(res));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><Headphones size={14} /> Help Desk & Ticketing System</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Total Today', v: '24', s: '8 New' },{ l: 'Open', v: '8', s: '3 Unassigned' },{ l: 'In Progress', v: '6', s: '2 Near SLA' },{ l: 'Escalated', v: '2', s: 'Critical' },{ l: 'Resolved', v: '6', s: 'Avg 2.5 hrs' },{ l: 'Overdue', v: '2', s: 'SLA Breached' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Category-wise Distribution</div>
              <table className="hms-table"><thead><tr><th>Category</th><th>Open</th><th>In Progress</th><th>Resolved</th><th>SLA%</th></tr></thead>
                <tbody>{[['IT Support',3,2,12,'85%'],['Maintenance',2,1,8,'92%'],['Biomedical',1,1,5,'90%'],['Housekeeping',1,1,15,'95%'],['Patient Complaint',1,1,4,'78%'],['Security',1,0,3,'100%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Recent Critical/Escalated</div>
              <table className="hms-table"><thead><tr><th>Ticket</th><th>Subject</th><th>Priority</th><th>Status</th><th>Due</th></tr></thead>
                <tbody>{tickets.filter(t => t.priority === 'Critical' || t.status === 'Escalated').map(t => <tr key={t.id}><td className="font-mono text-[10px]">{t.id}</td><td>{t.subject}</td><td><StatusBadge status={t.priority} /></td><td><StatusBadge status={t.status} /></td><td>{t.due}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(tab === 'All Tickets' || tab === 'Open Tickets') && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Ticket ID/Subject..." />
            <select className="hms-select"><option>All Categories</option><option>IT Support</option><option>Maintenance</option><option>Biomedical</option><option>Housekeeping</option><option>Patient Complaint</option><option>Security</option></select>
            <select className="hms-select"><option>All Priority</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select>
            <select className="hms-select"><option>All Status</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>Escalated</option><option>Overdue</option></select>
            <button className="hms-btn-primary ml-auto">+ Raise Ticket</button>
          </div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Subject</th><th>Category</th><th>Dept</th><th>Priority</th><th>Raised By</th><th>Assigned</th><th>Created</th><th>SLA</th><th>Due</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{(tab === 'Open Tickets' ? tickets.filter(t => t.status === 'Open' || t.status === 'In Progress') : tickets).map(t => <tr key={t.id}><td className="font-mono text-[10px]">{t.id}</td><td className="max-w-[180px] truncate">{t.subject}</td><td>{t.category}</td><td>{t.dept}</td><td><StatusBadge status={t.priority} /></td><td>{t.raised}</td><td>{t.assigned}</td><td className="text-[10px]">{t.created}</td><td>{t.sla}</td><td className="text-[10px]">{t.due}</td><td><StatusBadge status={t.status} /></td><td className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><MessageSquare size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Escalations' && (
        <div>
          <table className="hms-table"><thead><tr><th>Ticket</th><th>Subject</th><th>Escalated From</th><th>Escalated To</th><th>Reason</th><th>Time</th><th>Level</th><th>Status</th></tr></thead>
            <tbody>
              {[['TKT-002','HIS login failure','IT Help Desk','IT Manager','SLA Breach - Critical','2024-03-15 10:15','Level 2','Open'],['TKT-004','Printer not working','IT Support','IT Manager','SLA Breached 12hrs+','2024-03-15 08:00','Level 2','In Progress']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 7 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Knowledge Base' && (
        <div>
          <div className="flex mb-2"><input className="hms-input w-64" placeholder="Search Knowledge Base..." /><button className="hms-btn-primary ml-auto">+ Add Article</button></div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Views</th><th>Helpful</th><th>Last Updated</th><th>Author</th></tr></thead>
            <tbody>
              {[['KB-001','How to reset HIS password','IT Support','245','92%','2024-03-01','IT Admin'],['KB-002','AC troubleshooting guide','Maintenance','128','85%','2024-02-15','Maintenance Head'],['KB-003','Oxygen pipeline emergency protocol','Biomedical','312','98%','2024-01-20','Safety Officer'],['KB-004','Patient complaint handling SOP','Patient Care','189','90%','2024-02-28','QA Team']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'SLA Report' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">SLA Compliance (This Month)</div>
            <table className="hms-table"><thead><tr><th>Priority</th><th>Total</th><th>Within SLA</th><th>Breached</th><th>Compliance</th></tr></thead>
              <tbody>{[['Critical',8,7,1,'87.5%'],['High',24,21,3,'87.5%'],['Medium',45,42,3,'93.3%'],['Low',18,18,0,'100%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Average Resolution Time</div>
            <table className="hms-table"><thead><tr><th>Category</th><th>Target</th><th>Actual Avg</th><th>Status</th></tr></thead>
              <tbody>{[['IT Support','2 hrs','1.8 hrs','Within SLA'],['Maintenance','4 hrs','3.5 hrs','Within SLA'],['Biomedical','2 hrs','2.3 hrs','Overdue'],['Housekeeping','1 hr','0.8 hrs','Within SLA']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 3 ? <StatusBadge status={c} /> : c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Staff Performance' && (
        <div>
          <table className="hms-table"><thead><tr><th>Staff</th><th>Department</th><th>Assigned</th><th>Resolved</th><th>Avg Time</th><th>SLA%</th><th>Rating</th></tr></thead>
            <tbody>
              {[['Ravi Kumar','IT Support','45','42','1.5 hrs','95%','⭐⭐⭐⭐⭐'],['Sunil Singh','Maintenance','38','35','3.2 hrs','92%','⭐⭐⭐⭐'],['Anil Verma','Biomedical','22','20','2.1 hrs','90%','⭐⭐⭐⭐'],['Geeta Sharma','Housekeeping','55','54','0.7 hrs','98%','⭐⭐⭐⭐⭐']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Settings' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">SLA Configuration</div>
            <table className="hms-table"><thead><tr><th>Priority</th><th>Response Time</th><th>Resolution Time</th><th>Escalation After</th></tr></thead>
              <tbody>{[['Critical','15 min','1 hr','30 min'],['High','30 min','4 hrs','2 hrs'],['Medium','1 hr','8 hrs','4 hrs'],['Low','2 hrs','24 hrs','12 hrs']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Escalation Matrix</div>
            <table className="hms-table"><thead><tr><th>Level</th><th>Escalated To</th><th>Time Trigger</th><th>Notification</th></tr></thead>
              <tbody>{[['Level 1','Team Lead','After SLA 50%','Email + SMS'],['Level 2','Department Head','After SLA 100%','Email + SMS + Call'],['Level 3','Admin/Director','After SLA 200%','All Channels']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;
