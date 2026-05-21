import React, { useState, useEffect } from 'react';
import { Skull, FileText, Clock, Eye, Printer, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { extractArray, getDeaths, getMortuary, getPostmortem } from "@/api/apiService";

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

  const [deaths, setDeaths] = useState<any[]>([]);
  const [pmSchedule, setPmSchedule] = useState<any[]>([]);
  const [mortuary, setMortuary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, p, m] = await Promise.all([getDeaths(), getPostmortem(), getMortuary()]);
      if (d.ok) setDeaths(extractArray(d));
      if (p.ok) setPmSchedule(extractArray(p));
      if (m.ok) setMortuary(extractArray(m));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);


  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Skull size={16} /> Death & Postmortem Management</div>
        <div className="flex items-center gap-2">
          <input className="hms-input w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <button onClick={fetchData} className="p-1 hover:bg-muted rounded text-primary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-primary"><Plus size={12} /> Register Death</button>
          <button className="hms-btn-secondary"><Plus size={12} /> Schedule PM</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-1 my-1">
        {[
          { label: 'Total Deaths (Month)', value: deaths.length },
          { label: 'Today', value: deaths.filter((d: any) => d.dod === new Date().toISOString().split('T')[0]).length, color: 'text-destructive' },
          { label: 'PM Pending', value: pmSchedule.filter((p: any) => p.status !== 'Completed').length, color: 'text-primary' },
          { label: 'PM Completed', value: pmSchedule.filter((p: any) => p.status === 'Completed').length },
          { label: 'Certificates Pending', value: deaths.filter((d: any) => !d.certIssued).length, color: 'text-destructive' },
          { label: 'Mortuary Occupancy', value: `${mortuary.reduce((acc: number, m: any) => acc + (m.occupied || 0), 0)}/${mortuary.reduce((acc: number, m: any) => acc + (m.capacity || 0), 0)}` },
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
              {loading ? (
                <tr><td colSpan={14} className="text-center py-4">Loading...</td></tr>
              ) : deaths.length > 0 ? (
                deaths.filter((d: any) => (d.name || d.patientName || '').toLowerCase().includes(search.toLowerCase())).map((d: any) => (
                  <tr key={d.id}>
                    <td className="font-semibold">{d.id}</td><td>{d.name || d.patientName}</td><td>{d.uhid}</td><td>{d.age}</td><td>{d.gender}</td><td>{d.ward}</td>
                    <td>{d.dod}</td><td>{d.tod}</td><td className="text-[10px] max-w-[120px]">{d.cause}</td><td className="text-[10px]">{d.icdCode}</td><td>{d.doctor}</td>
                    <td><span className={`text-[10px] px-1 py-0.5 ${d.certIssued ? 'bg-hms-success text-hms-success-foreground' : 'bg-hms-warning'}`}>{d.certIssued ? 'Yes' : 'Pending'}</span></td>
                    <td>{d.pmRequired ? <span className="text-[10px] px-1 py-0.5 bg-destructive text-destructive-foreground">Required</span> : <span className="text-[10px] text-muted-foreground">No</span>}</td>
                    <td><Eye size={12} className="text-primary cursor-pointer inline mr-1" /><Printer size={12} className="text-primary cursor-pointer inline" /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={14} className="text-center py-4 text-muted-foreground">No death records found</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === 'postmortem' && (
          <table className="hms-table">
            <thead><tr><th>PM ID</th><th>Deceased</th><th>Death ID</th><th>Date</th><th>Time</th><th>Pathologist</th><th>Police Ref</th><th>Body Location</th><th>Status</th><th>Findings</th></tr></thead>
            <tbody>
              {pmSchedule.length > 0 ? (
                pmSchedule.map((p: any) => (
                  <tr key={p.id}>
                    <td className="font-semibold">{p.id}</td><td>{p.deceased || p.patientName}</td><td>{p.dthId || p.deathId}</td><td>{p.scheduledDate || p.date}</td><td>{p.time}</td>
                    <td>{p.pathologist}</td><td className="text-[10px]">{p.policeRef}</td><td>{p.bodyPreserved || p.location}</td>
                    <td><span className={`text-[10px] px-1.5 py-0.5 ${p.status === 'Completed' ? 'bg-hms-success text-hms-success-foreground' : p.status === 'Scheduled' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-warning'}`}>{p.status}</span></td>
                    <td className="text-[10px] max-w-[150px]">{p.findings}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={10} className="text-center py-4 text-muted-foreground">No postmortem schedules found</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === 'mortuary' && (
          <>
            <div className="p-1 text-[10px] bg-muted border-b border-border px-2">Mortuary Infrastructure Status</div>
            <table className="hms-table">
              <thead><tr><th>Unit</th><th>Capacity</th><th>Occupied</th><th>Available</th><th>Temperature</th><th>Status</th></tr></thead>
              <tbody>
                {mortuary.length > 0 ? (
                  mortuary.map((m: any) => (
                    <tr key={m.unit || m.id}>
                      <td className="font-semibold">{m.unit || m.name}</td><td>{m.capacity}</td><td>{m.occupied}</td><td>{(m.capacity || 0) - (m.occupied || 0)}</td><td>{m.temp || m.temperature}</td>
                      <td><span className={`text-[10px] px-1.5 py-0.5 ${m.status === 'Operational' || m.status === 'Available' ? 'bg-hms-success text-hms-success-foreground' : m.status === 'Full' ? 'bg-destructive text-destructive-foreground' : 'bg-hms-warning'}`}>{m.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="text-center py-4 text-muted-foreground">No mortuary units found</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {tab === 'release' && (
          <table className="hms-table">
            <thead><tr><th>Release ID</th><th>Deceased</th><th>Released To</th><th>ID Proof</th><th>Police NOC</th><th>Date</th><th>Time</th><th>Witnessed By</th></tr></thead>
            <tbody>
              <tr><td colSpan={8} className="text-center py-4 text-muted-foreground">No body release records found</td></tr>
            </tbody>
          </table>
        )}

        {tab === 'certificates' && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-border p-2">
                <div className="text-xs font-bold mb-2">Pending Death Certificates</div>
                {deaths.filter((d: any) => !d.certIssued).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-border py-1 text-xs">
                    <span>{d.id} - {d.name || d.patientName}</span>
                    <div><button className="hms-btn-primary text-[10px] mr-1">Generate</button><button className="hms-btn-secondary text-[10px]">View</button></div>
                  </div>
                ))}
              </div>
              <div className="border border-border p-2">
                <div className="text-xs font-bold mb-2">Issued Certificates</div>
                {deaths.filter((d: any) => d.certIssued).map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-border py-1 text-xs">
                    <span>{d.id} - {d.name || d.patientName} — Issued</span>
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
