import React, { useState, useEffect } from 'react';
import { Droplets, Users, Clock, CheckCircle2, AlertTriangle, ThermometerSun, Search, Printer, Eye, Plus, Edit, Trash2, RefreshCw, X } from 'lucide-react';
import { createBloodComponent, createBloodDonation, createBloodDonor, createBloodInventory, createBloodRequest, deleteBloodDonor, deleteBloodInventory, deleteBloodRequest, getBloodDonors, getBloodInventory, getBloodRequests, issueBlood, listBloodComponents, listBloodDonations, listBloodDonors, listBloodGroups, listBloodInventory, listBloodRequests, getAutoPatients, listUsers, updateBloodDonor, updateBloodInventoryStatus, updateBloodRequest, updateBloodRequestStatus, extractArray } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const statusColor = (s: string) => {
  switch (s) {
    case 'Available':
    case 'Compatible':
    case 'Safe':
    case 'Approved':
    case 'Issued':
    case 'Eligible':
    case 'Completed': return 'bg-hms-success text-hms-success-foreground';
    case 'Pending':
    case 'Processing':
    case 'Recently Donated': return 'bg-hms-warning text-foreground';
    case 'Rejected':
    case 'Incompatible':
    case 'Unsafe':
    case 'Expired':
    case 'Discarded':
    case 'Deferred': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

type Tab = 'stock' | 'donors' | 'requests' | 'crossmatch' | 'expiry' | 'transfusion' | 'camps' | 'inventory' | 'donations';

const tabs: { key: Tab; label: string }[] = [
  { key: 'stock', label: 'Blood Stock' },
  { key: 'inventory', label: 'Inventory Items' },
  { key: 'donations', label: 'Donations' },
  { key: 'donors', label: 'Donor Registry' },
  { key: 'requests', label: 'Blood Requests' },
  { key: 'expiry', label: 'Expiry Alerts' },
  { key: 'camps', label: 'Donation Camps' },
];

const BloodBank = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('stock');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Data States
  const [data, setData] = useState({
    inventory: [],
    requests: [],
    donors: [],
    donations: [],
    groups: [],
    components: [],
    patients: [],
    doctors: []
  });

  // UI States
  const [showModal, setShowModal] = useState<string | null>(null); // 'request' | 'donor' | 'donation'
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, reqRes, donorRes, donRes, grpRes, compRes, patRes, docRes] = await Promise.all([
        getBloodInventory(),
        listBloodRequests(),
        listBloodDonors(),
        listBloodDonations(),
        listBloodGroups(),
        listBloodComponents(),
        getAutoPatients({ limit: 100 }),
        listUsers({ role: 'Doctor' })
      ]);

      setData({
        inventory: extractArray(invRes),
        requests: extractArray(reqRes),
        donors: extractArray(donorRes),
        donations: extractArray(donRes),
        groups: extractArray(grpRes),
        components: extractArray(compRes),
        patients: extractArray(patRes),
        doctors: extractArray(docRes)
      });
    } catch (error) {
      console.error('Error fetching blood bank data:', error);
      toast({ title: 'Error', description: 'Failed to sync blood bank data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBloodRequest(selectedItem);
      toast({ title: 'Success', description: 'Blood request submitted' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Request failed', variant: 'destructive' });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateBloodRequestStatus(id, status);
      toast({ title: 'Success', description: `Request ${status}` });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Update failed', variant: 'destructive' });
    }
  };

  const handleRegisterDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem.id) {
        await updateBloodDonor(selectedItem.id, selectedItem);
        toast({ title: 'Success', description: 'Donor updated successfully' });
      } else {
        await createBloodDonor(selectedItem);
        toast({ title: 'Success', description: 'Donor registered successfully' });
      }
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor?')) return;
    try {
      await deleteBloodDonor(id);
      toast({ title: 'Success', description: 'Donor deleted successfully' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Delete failed', variant: 'destructive' });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    try {
      await deleteBloodRequest(id);
      toast({ title: 'Success', description: 'Request deleted successfully' });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Delete failed', variant: 'destructive' });
    }
  };

  const handleUpdateInventoryStatus = async (id: string, status: string) => {
    try {
      await updateBloodInventoryStatus(id, status);
      toast({ title: 'Success', description: `Inventory status updated to ${status}` });
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Update failed', variant: 'destructive' });
    }
  };

  const handleRecordDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBloodDonation(selectedItem);
      toast({ title: 'Success', description: 'Donation recorded and component created' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to record donation', variant: 'destructive' });
    }
  };

  const handleIssueBlood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueBlood(selectedItem);
      toast({ title: 'Success', description: 'Blood issued successfully' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to issue blood', variant: 'destructive' });
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createBloodComponent(selectedItem);
      // After component is created, add it to inventory
      await createBloodInventory({
        componentId: res.data.id,
        bloodGroup: selectedItem.bloodGroup
      });
      toast({ title: 'Success', description: 'Component created and added to inventory' });
      setShowModal(null);
      fetchData();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Operation failed', variant: 'destructive' });
    }
  };

  // KPI Calculations
  const totalUnits = data.inventory.filter((i: any) => i.currentStatus === 'Available').length;
  const pendingRequests = data.requests.filter((r: any) => r.status === 'Pending').length;
  const criticalThreshold = 5;
  
  // Aggregate stock by group
  const stockByGroup = data.groups.map((g: any) => {
    const items = data.inventory.filter((i: any) => i.bloodGroup?.id === g.id && i.currentStatus === 'Available');
    return {
      name: g.name,
      total: items.length,
      components: {
        'Whole Blood': items.filter((i: any) => i.componentId?.componentType === 'Whole Blood').length,
        'PRBC': items.filter((i: any) => i.componentId?.componentType === 'PRBC').length,
        'Platelets': items.filter((i: any) => i.componentId?.componentType === 'Platelets').length,
        'FFP': items.filter((i: any) => i.componentId?.componentType === 'FFP').length,
        'Cryoprecipitate': items.filter((i: any) => i.componentId?.componentType === 'Cryoprecipitate').length,
      }
    };
  });

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Droplets size={16} /> Blood Bank Management</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input className="hms-input pl-7 w-48" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            setSelectedItem({ patientId: '', bloodGroup: '', componentType: 'Whole Blood', quantityUnits: 1 });
            setShowModal('request');
          }}><Plus size={14} /> New Request</button>
          <button className="hms-btn-secondary flex items-center gap-1" onClick={() => {
            setSelectedItem({ donorId: `D-${Date.now().toString().slice(-4)}`, firstName: '', lastName: '', gender: 'Male', bloodGroup: '' });
            setShowModal('donor');
          }}><Plus size={14} /> Register Donor</button>
          <button className="hms-btn-secondary" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-6 gap-2 my-1">
        {[
          { label: 'Total Units', value: totalUnits, color: 'text-primary' },
          { label: 'Pending Requests', value: pendingRequests, color: 'text-amber-500' },
          { label: 'Safe Screenings', value: data.donations.filter((d: any) => d.status === 'Tested').length, color: 'text-hms-success' },
          { label: 'Total Donors', value: data.donors.length, color: 'text-primary' },
          { label: 'Critical Groups', value: stockByGroup.filter(s => s.total < criticalThreshold).length, color: 'text-destructive' },
          { label: 'Today Issued', value: data.requests.filter((r: any) => r.status === 'Issued' && new Date(r.updatedAt).toDateString() === new Date().toDateString()).length, color: 'text-hms-info' },
        ].map((k, i) => (
          <div key={i} className="bg-card border border-border p-3 shadow-sm text-center">
            <div className={`text-xl font-bold ${k.color}`}>{k.value}</div>
            <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 opacity-50">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Syncing Blood Data...</span>
          </div>
        ) : (
          <>
            {tab === 'stock' && (
              <table className="hms-table">
                <thead><tr><th>Blood Group</th><th>Whole Blood</th><th>PRBC</th><th>Platelets</th><th>FFP</th><th>Cryo</th><th>Total Units</th><th>Status</th></tr></thead>
                <tbody>
                  {stockByGroup.map(s => (
                    <tr key={s.name}>
                      <td className="font-bold text-lg text-primary">{s.name}</td>
                      <td>{s.components['Whole Blood']}</td>
                      <td>{s.components['PRBC']}</td>
                      <td>{s.components['Platelets']}</td>
                      <td>{s.components['FFP']}</td>
                      <td>{s.components['Cryoprecipitate']}</td>
                      <td className="font-bold text-sm">{s.total}</td>
                      <td>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${s.total < criticalThreshold ? 'bg-destructive text-destructive-foreground' : 'bg-hms-success text-hms-success-foreground'}`}>
                          {s.total < criticalThreshold ? 'Critical' : 'Adequate'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'inventory' && (
              <table className="hms-table">
                <thead><tr><th>Bag Number</th><th>Group</th><th>Component</th><th>Expiry Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.inventory.filter((i: any) => 
                    i.bloodGroup?.name.toLowerCase().includes(search.toLowerCase()) || 
                    i.componentId?.componentType.toLowerCase().includes(search.toLowerCase()) ||
                    i.currentStatus.toLowerCase().includes(search.toLowerCase())
                  ).map((i: any) => (
                    <tr key={i.id}>
                      <td className="font-mono text-xs font-bold">{i.componentId?.donationId?.bagNumber || 'N/A'}</td>
                      <td className="font-bold text-primary">{i.bloodGroup?.name}</td>
                      <td><span className="text-[10px] border border-border px-1.5 py-0.5 rounded font-bold uppercase">{i.componentId?.componentType}</span></td>
                      <td>{new Date(i.componentId?.expiryDate).toLocaleDateString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(i.currentStatus)}`}>{i.currentStatus}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <select className="hms-select text-[10px] py-0.5" value={i.currentStatus} onChange={(e) => handleUpdateInventoryStatus(i.id, e.target.value)}>
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Issued">Issued</option>
                            <option value="Expired">Expired</option>
                            <option value="Discarded">Discarded</option>
                          </select>
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => {
                            if (confirm('Delete this inventory record?')) {
                              deleteBloodInventory(i.id).then(() => fetchData());
                            }
                          }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'donations' && (
              <table className="hms-table">
                <thead><tr><th>Donation #</th><th>Donor</th><th>Bag #</th><th>Group</th><th>Date</th><th>Quantity</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.donations.filter((d: any) => 
                    d.donationNumber.toLowerCase().includes(search.toLowerCase()) ||
                    d.bagNumber.toLowerCase().includes(search.toLowerCase()) ||
                    `${d.donorId?.firstName} ${d.donorId?.lastName}`.toLowerCase().includes(search.toLowerCase())
                  ).map((d: any) => (
                    <tr key={d.id}>
                      <td className="font-mono text-xs font-bold">{d.donationNumber}</td>
                      <td>{d.donorId?.firstName} {d.donorId?.lastName}</td>
                      <td className="font-mono text-xs font-bold">{d.bagNumber}</td>
                      <td className="font-bold text-primary">{d.bloodGroup?.name}</td>
                      <td>{new Date(d.donationDate).toLocaleDateString()}</td>
                      <td>{d.quantityML} ML</td>
                      <td>
                        <button className="hms-btn-primary text-[10px] px-2 py-0.5 flex items-center gap-1" onClick={() => {
                          setSelectedItem({ donationId: d.id, bloodGroup: d.bloodGroup?.id, componentType: 'Whole Blood', quantityML: d.quantityML, expiryDate: new Date(Date.now() + 35*24*60*60*1000).toISOString().split('T')[0] });
                          setShowModal('component');
                        }}><Plus size={10} /> Add Component</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'donors' && (
              <table className="hms-table">
                <thead><tr><th>Donor ID</th><th>Name</th><th>Sex</th><th>Group</th><th>Phone</th><th>Last Donation</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.donors.filter((d: any) => `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) || d.donorId.toLowerCase().includes(search.toLowerCase())).map((d: any) => (
                    <tr key={d.id}>
                      <td className="font-mono text-xs font-bold">{d.donorId}</td>
                      <td className="font-semibold">{d.firstName} {d.lastName}</td>
                      <td>{d.gender}</td>
                      <td className="font-bold text-primary">{d.bloodGroup?.name}</td>
                      <td>{d.phone}</td>
                      <td>{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : 'Never'}</td>
                      <td className="font-bold">{d.totalDonations}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(d.status)}`}>{d.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button className="text-primary hover:bg-primary/10 p-1 rounded" title="Edit" onClick={() => {
                            setSelectedItem(d);
                            setShowModal('donor');
                          }}><Edit size={14} /></button>
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => handleDeleteDonor(d.id)}><Trash2 size={14} /></button>
                          <button className="text-hms-success hover:bg-hms-success/10 p-1 rounded" title="Record Donation" onClick={() => {
                            setSelectedItem({ donorId: d.id, donationNumber: `DN-${Date.now().toString().slice(-4)}`, donationDate: new Date().toISOString().split('T')[0], bagNumber: '', bloodGroup: d.bloodGroup?.id });
                            setShowModal('donation');
                          }}><Plus size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'requests' && (
              <table className="hms-table">
                <thead><tr><th>Req ID</th><th>Patient</th><th>Group</th><th>Component</th><th>Units</th><th>Requested By</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {data.requests.filter((r: any) => 
                    r.patientId?.patientName?.toLowerCase().includes(search.toLowerCase()) ||
                    r.bloodGroup?.name.toLowerCase().includes(search.toLowerCase()) ||
                    r.status.toLowerCase().includes(search.toLowerCase())
                  ).map((r: any) => (
                    <tr key={r.id}>
                      <td className="font-mono text-[10px] font-bold">{r.id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="font-bold text-sm">{r.patientId?.patientName || r.patientId?.name || 'Unknown'}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold">UHID: {r.patientId?.uhid || r.patientId?.patientID || 'N/A'}</div>
                      </td>
                      <td className="font-bold text-primary">{r.bloodGroup?.name}</td>
                      <td><span className="text-[10px] border border-border px-1.5 py-0.5 rounded font-bold uppercase">{r.componentType}</span></td>
                      <td className="font-bold">{r.quantityUnits}</td>
                      <td>{r.requestedBy?.name || 'Doctor'}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${r.quantityUnits > 2 ? 'bg-destructive text-destructive-foreground' : 'bg-muted'}`}>{r.quantityUnits > 2 ? 'Urgent' : 'Routine'}</span></td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(r.status)}`}>{r.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {r.status === 'Pending' && (
                            <>
                              <button className="text-hms-success hover:bg-hms-success/10 p-1 rounded" title="Approve" onClick={() => handleUpdateStatus(r.id, 'Approved')}><CheckCircle2 size={14} /></button>
                              <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Reject" onClick={() => handleUpdateStatus(r.id, 'Rejected')}><X size={14} /></button>
                            </>
                          )}
                          {r.status === 'Approved' && (
                            <button className="hms-btn-primary text-[10px] px-2 py-0.5" onClick={() => {
                              const availableBags = data.inventory.filter((i: any) => i.bloodGroup?.id === r.bloodGroup?.id && i.componentId?.componentType === r.componentType && i.currentStatus === 'Available');
                              if (availableBags.length === 0) {
                                toast({ title: 'Stock Error', description: 'No available units matching this request', variant: 'destructive' });
                                return;
                              }
                              setSelectedItem({ requestId: r.id, inventoryId: availableBags[0].id, componentId: availableBags[0].componentId?.id, units: r.quantityUnits, bloodGroup: r.bloodGroup?.id, componentType: r.componentType });
                              setShowModal('issue');
                            }}>Issue Blood</button>
                          )}
                          <button className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Delete" onClick={() => handleDeleteRequest(r.id)}><Trash2 size={14} /></button>
                          <Printer size={14} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'expiry' && (
              <table className="hms-table">
                <thead><tr><th>Bag Number</th><th>Group</th><th>Component</th><th>Quantity</th><th>Expiry Date</th><th>Status</th></tr></thead>
                <tbody>
                  {data.components.filter((c: any) => new Date(c.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).map((c: any) => (
                    <tr key={c.id}>
                      <td className="font-mono text-xs font-bold">{c.donationId?.bagNumber || 'N/A'}</td>
                      <td className="font-bold text-primary">{c.donationId?.bloodGroup?.name || 'N/A'}</td>
                      <td><span className="text-[10px] border border-border px-1.5 py-0.5 rounded font-bold uppercase">{c.componentType}</span></td>
                      <td>{c.quantityML} ML</td>
                      <td className="text-destructive font-bold">{new Date(c.expiryDate).toLocaleDateString()}</td>
                      <td><span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusColor(c.status)}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'request' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Droplets size={16} className="text-primary" /> New Blood Request</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateRequest} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Select Patient</label>
                <select className="hms-select w-full" required value={selectedItem?.patientId} onChange={e => setSelectedItem({...selectedItem, patientId: e.target.value})}>
                  <option value="">-- Choose Patient --</option>
                  {data.patients.map((p: any) => <option key={p.id} value={p.id}>{p.patientName} ({p.uhid || p.patientID})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Blood Group</label>
                  <select className="hms-select w-full" required value={selectedItem?.bloodGroup} onChange={e => setSelectedItem({...selectedItem, bloodGroup: e.target.value})}>
                    <option value="">-- Select --</option>
                    {data.groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Component Type</label>
                  <select className="hms-select w-full" required value={selectedItem?.componentType} onChange={e => setSelectedItem({...selectedItem, componentType: e.target.value})}>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="PRBC">PRBC</option>
                    <option value="Platelets">Platelets</option>
                    <option value="FFP">FFP</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Quantity (Units)</label>
                <input type="number" className="hms-input w-full" required min="1" value={selectedItem?.quantityUnits} onChange={e => setSelectedItem({...selectedItem, quantityUnits: Number(e.target.value)})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 shadow-lg shadow-primary/20">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'donor' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Users size={16} className="text-primary" /> Register New Donor</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRegisterDonor} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">First Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.firstName} onChange={e => setSelectedItem({...selectedItem, firstName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Last Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.lastName} onChange={e => setSelectedItem({...selectedItem, lastName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Gender</label>
                  <select className="hms-select w-full" required value={selectedItem?.gender} onChange={e => setSelectedItem({...selectedItem, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Blood Group</label>
                  <select className="hms-select w-full" required value={selectedItem?.bloodGroup} onChange={e => setSelectedItem({...selectedItem, bloodGroup: e.target.value})}>
                    <option value="">-- Select --</option>
                    {data.groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Phone Number</label>
                <input className="hms-input w-full" required value={selectedItem?.phone} onChange={e => setSelectedItem({...selectedItem, phone: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 shadow-lg shadow-primary/20">{selectedItem?.id ? 'Update' : 'Register'} Donor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'donation' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Droplets size={16} className="text-hms-success" /> Record Blood Donation</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleRecordDonation} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Donation Number</label>
                  <input className="hms-input w-full" required value={selectedItem?.donationNumber} onChange={e => setSelectedItem({...selectedItem, donationNumber: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Bag Number</label>
                  <input className="hms-input w-full" required value={selectedItem?.bagNumber} onChange={e => setSelectedItem({...selectedItem, bagNumber: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Donation Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.donationDate} onChange={e => setSelectedItem({...selectedItem, donationDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Quantity (ML)</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem?.quantityML || 450} onChange={e => setSelectedItem({...selectedItem, quantityML: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 shadow-lg shadow-primary/20">Record Donation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'issue' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Issue Blood Unit</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleIssueBlood} className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground">Confirm issuing of blood component to the patient. This will update inventory status to 'Issued'.</p>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Select Inventory Bag</label>
                <select className="hms-select w-full" required value={selectedItem?.inventoryId} onChange={e => {
                  const inv = data.inventory.find((i: any) => i.id === e.target.value);
                  setSelectedItem({...selectedItem, inventoryId: e.target.value, componentId: inv?.componentId?.id});
                }}>
                  <option value="">-- Select Available Bag --</option>
                  {data.inventory.filter((i: any) => i.bloodGroup?.id === selectedItem?.bloodGroup && i.componentId?.componentType === selectedItem?.componentType && i.currentStatus === 'Available').map((i: any) => (
                    <option key={i.id} value={i.id}>{i.componentId?.donationId?.bagNumber} - {i.bloodGroup?.name} ({i.componentId?.componentType})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 shadow-lg shadow-primary/20">Confirm Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'component' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Create Blood Component</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateComponent} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Component Type</label>
                <select className="hms-select w-full" required value={selectedItem?.componentType} onChange={e => setSelectedItem({...selectedItem, componentType: e.target.value})}>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="PRBC">PRBC</option>
                  <option value="Platelets">Platelets</option>
                  <option value="FFP">FFP</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Quantity (ML)</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem?.quantityML} onChange={e => setSelectedItem({...selectedItem, quantityML: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Expiry Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.expiryDate} onChange={e => setSelectedItem({...selectedItem, expiryDate: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 shadow-lg shadow-primary/20">Create Component</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBank;

