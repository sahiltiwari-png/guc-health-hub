import React, { useState, useEffect } from 'react';
import { Monitor, Eye, Edit, Trash2, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, BarChart3, Printer, ArrowLeftRight, FileText } from 'lucide-react';
import { 
  getEquipments, createEquipment, deleteEquipment,
  getEquipmentCategories, createEquipmentCategory,
  getEquipmentVendors,
  getEquipmentLocations, 
  getEquipmentMaintenanceSchedules, createEquipmentMaintenanceSchedule,
  getEquipmentMaintenanceLogs,
  getEquipmentCalibrationRecords,
  getEquipmentTransfers,
  getEquipmentBreakdowns, createEquipmentBreakdown,
  getEquipmentSpareParts,
  getEquipmentUsageLogs,
  getEquipmentDocuments
} from '../api/apiService';

const tabs = ['Dashboard','Equipment Register','Categories','Maintenance','Calibration','Breakdowns','Spare Parts','Transfers','Usage Logs','Documents','Vendors'];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { 
    'active': 'bg-green-700 text-white', 
    'inactive': 'bg-red-700 text-white',
    'under_maintenance': 'bg-yellow-600 text-white', 
    'scheduled': 'bg-blue-700 text-white',
    'completed': 'bg-green-700 text-white',
    'in_progress': 'bg-blue-700 text-white'
  };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${colors[status] || 'bg-muted text-foreground'}`}>{String(status || 'unknown').toUpperCase()}</span>;
};

const Equipment = () => {
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    equipments: [],
    categories: [],
    vendors: [],
    locations: [],
    maintenanceSchedules: [],
    maintenanceLogs: [],
    calibrationRecords: [],
    transfers: [],
    breakdowns: [],
    spareParts: [],
    usageLogs: [],
    documents: []
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState<any>({});

  const fetchData = async (currentTab: string) => {
    setLoading(true);
    try {
      switch (currentTab) {
        case 'Equipment Register':
          const eqRes = await getEquipments();
          setData((prev: any) => ({ ...prev, equipments: eqRes.data }));
          break;
        case 'Categories':
          const catRes = await getEquipmentCategories();
          setData((prev: any) => ({ ...prev, categories: catRes.data }));
          break;
        case 'Maintenance':
          const [schRes, logRes] = await Promise.all([getEquipmentMaintenanceSchedules(), getEquipmentMaintenanceLogs()]);
          setData((prev: any) => ({ ...prev, maintenanceSchedules: schRes.data, maintenanceLogs: logRes.data }));
          break;
        case 'Calibration':
          const calRes = await getEquipmentCalibrationRecords();
          setData((prev: any) => ({ ...prev, calibrationRecords: calRes.data }));
          break;
        case 'Breakdowns':
          const breakRes = await getEquipmentBreakdowns();
          setData((prev: any) => ({ ...prev, breakdowns: breakRes.data }));
          break;
        case 'Spare Parts':
          const spareRes = await getEquipmentSpareParts();
          setData((prev: any) => ({ ...prev, spareParts: spareRes.data }));
          break;
        case 'Transfers':
          const transRes = await getEquipmentTransfers();
          setData((prev: any) => ({ ...prev, transfers: transRes.data }));
          break;
        case 'Usage Logs':
          const usageRes = await getEquipmentUsageLogs();
          setData((prev: any) => ({ ...prev, usageLogs: usageRes.data }));
          break;
        case 'Documents':
          const docRes = await getEquipmentDocuments();
          setData((prev: any) => ({ ...prev, documents: docRes.data }));
          break;
        case 'Vendors':
          const venRes = await getEquipmentVendors();
          setData((prev: any) => ({ ...prev, vendors: venRes.data }));
          break;
        case 'Dashboard':
          const [e, c, m, b] = await Promise.all([
            getEquipments({ limit: 5 }), 
            getEquipmentCategories(), 
            getEquipmentMaintenanceSchedules({ limit: 5 }),
            getEquipmentBreakdowns({ limit: 5 })
          ]);
          setData((prev: any) => ({ 
            ...prev, 
            equipments: e.data, 
            categories: c.data, 
            maintenanceSchedules: m.data,
            breakdowns: b.data,
            totalEquipments: e.total
          }));
          break;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(tab);
  }, [tab]);

  const formatDate = (date: any) => date ? new Date(date).toLocaleDateString() : '-';

  const handleAdd = (type: string) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        switch (type) {
          case 'Equipment': await deleteEquipment(id); break;
        }
        fetchData(tab);
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      switch (modalType) {
        case 'Equipment':
          await createEquipment(formData);
          break;
        case 'Category':
          await createEquipmentCategory(formData);
          break;
        case 'Maintenance Schedule':
          await createEquipmentMaintenanceSchedule(formData);
          break;
        case 'Breakdown':
          await createEquipmentBreakdown(formData);
          break;
      }
      setShowModal(false);
      fetchData(tab);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border p-4 w-[400px]">
            <div className="hms-section-header mb-4">Add New {modalType}</div>
            <form onSubmit={handleSave} className="space-y-3">
              {modalType === 'Equipment' && (
                <>
                  <input className="hms-input w-full" placeholder="Equipment Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <input className="hms-input w-full" placeholder="Code" required onChange={e => setFormData({ ...formData, equipmentCode: e.target.value })} />
                  <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {data.categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <input className="hms-input w-full" placeholder="Brand" onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                  <input className="hms-input w-full" placeholder="Model" onChange={e => setFormData({ ...formData, model: e.target.value })} />
                </>
              )}
              {modalType === 'Breakdown' && (
                <>
                  <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, equipmentId: e.target.value })}>
                    <option value="">Select Equipment</option>
                    {data.equipments.map((eq: any) => <option key={eq._id} value={eq._id}>{eq.name}</option>)}
                  </select>
                  <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                    <option value="">Select Severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <textarea className="hms-input w-full" placeholder="Description" required onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </>
              )}
              {modalType === 'Category' && (
                <>
                  <input className="hms-input w-full" placeholder="Category Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <textarea className="hms-input w-full" placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="hms-btn-secondary">Cancel</button>
                <button type="submit" className="hms-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="hms-section-header flex items-center gap-2"><Monitor size={14} /> Equipment Management System</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>
        ))}
      </div>

      {loading && <div className="p-4 text-center text-xs">Loading...</div>}

      {!loading && tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[
              { label: 'Total Equipments', value: data.totalEquipments || '0', icon: Monitor, sub: 'Registered machines' },
              { label: 'Active', value: data.equipments.filter((e: any) => e.status === 'active').length, icon: CheckCircle, sub: 'Operational' },
              { label: 'Under Repair', value: data.equipments.filter((e: any) => e.status === 'under_maintenance').length, icon: Wrench, sub: 'Maintenance' },
              { label: 'Next Maintenance', value: data.maintenanceSchedules.length, icon: Clock, sub: 'Upcoming' },
              { label: 'Calibration Due', value: data.calibrationRecords.length, icon: AlertTriangle, sub: 'Validation needed' },
              { label: 'Total Value', value: `₹${data.equipments.reduce((sum: number, e: any) => sum + (e.purchaseCost || 0), 0).toLocaleString()}`, icon: TrendingUp, sub: 'Investment' },
            ].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><k.icon size={10} />{k.label}</div>
                <div className="text-sm font-bold">{k.value}</div>
                <div className="text-[9px] text-muted-foreground">{k.sub}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Category Distribution</div>
              <table className="hms-table"><thead><tr><th>Category</th><th>Description</th></tr></thead>
                <tbody>{data.categories.map((c: any, i: number) => <tr key={i}><td>{c.name}</td><td>{c.description}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Maintenance Alerts</div>
              <table className="hms-table"><thead><tr><th>Equipment</th><th>Next Due</th><th>Vendor</th></tr></thead>
                <tbody>{data.maintenanceSchedules.map((m: any, i: number) => <tr key={i}><td>{m.equipmentId?.name}</td><td>{formatDate(m.nextMaintenanceDate)}</td><td>{m.vendorId?.name}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && tab === 'Equipment Register' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search..." />
            <button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Equipment')}>+ Add Equipment</button>
          </div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Dept</th><th>Location</th><th>Brand/Model</th><th>Purchase</th><th>Cost</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{data.equipments.map((e: any) => <tr key={e._id}><td className="font-mono text-[10px]">{e.equipmentCode}</td><td>{e.name}</td><td>{e.categoryId?.name}</td><td>{e.departmentId?.name}</td><td>{e.locationId?.description}</td><td>{e.brand} {e.model}</td><td>{formatDate(e.purchaseDate)}</td><td>₹{e.purchaseCost?.toLocaleString()}</td><td><StatusBadge status={e.status} /></td><td className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Trash2 size={12} className="text-red-500 cursor-pointer" onClick={() => handleDelete(e._id, 'Equipment')} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Categories' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Category')}>+ Add Category</button></div>
          <table className="hms-table"><thead><tr><th>S.No</th><th>Category Name</th><th>Description</th></tr></thead>
            <tbody>{data.categories.map((c: any, i: number) => <tr key={i}><td>{i + 1}</td><td>{c.name}</td><td>{c.description}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Maintenance' && (
        <div className="space-y-4">
          <div>
            <div className="hms-section-header text-xs mb-2">Schedules</div>
            <table className="hms-table"><thead><tr><th>Equipment</th><th>Type</th><th>Frequency</th><th>Next Due</th><th>Vendor</th><th>Status</th></tr></thead>
              <tbody>{data.maintenanceSchedules.map((m: any) => <tr key={m._id}><td>{m.equipmentId?.name}</td><td>{m.maintenanceType}</td><td>{m.frequency}</td><td>{formatDate(m.nextMaintenanceDate)}</td><td>{m.vendorId?.name}</td><td><StatusBadge status={m.status} /></td></tr>)}</tbody>
            </table>
          </div>
          <div>
            <div className="hms-section-header text-xs mb-2">Logs</div>
            <table className="hms-table"><thead><tr><th>Equipment</th><th>Date</th><th>Engineer</th><th>Cost</th><th>Description</th></tr></thead>
              <tbody>{data.maintenanceLogs.map((l: any) => <tr key={l._id}><td>{l.equipmentId?.name}</td><td>{formatDate(l.maintenanceDate)}</td><td>{l.engineerName}</td><td>₹{l.cost?.toLocaleString()}</td><td>{l.description}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && tab === 'Calibration' && (
        <div>
          <table className="hms-table"><thead><tr><th>Equipment</th><th>Last Date</th><th>Next Due</th><th>Performed By</th><th>Cert No</th></tr></thead>
            <tbody>{data.calibrationRecords.map((c: any) => <tr key={c._id}><td>{c.equipmentId?.name}</td><td>{formatDate(c.calibrationDate)}</td><td>{formatDate(c.nextCalibrationDate)}</td><td>{c.performedBy}</td><td>{c.certificateNumber}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Breakdowns' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Breakdown')}>+ Report Breakdown</button></div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Equipment</th><th>Date Reported</th><th>Reported By</th><th>Severity</th><th>Description</th><th>Status</th></tr></thead>
            <tbody>{data.breakdowns.map((b: any) => <tr key={b._id}><td>{b._id.substring(0,8)}</td><td>{b.equipmentId?.name}</td><td>{formatDate(b.reportedDate)}</td><td>{b.reportedBy?.name}</td><td>{b.severity}</td><td>{b.description}</td><td><StatusBadge status={b.status} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Spare Parts' && (
        <div>
          <table className="hms-table"><thead><tr><th>Part Name</th><th>Part Number</th><th>Equipment</th><th>Quantity</th><th>Unit Price</th></tr></thead>
            <tbody>{data.spareParts.map((s: any) => <tr key={s._id}><td>{s.partName}</td><td>{s.partNumber}</td><td>{s.equipmentId?.name}</td><td>{s.quantity}</td><td>₹{s.unitPrice?.toLocaleString()}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Transfers' && (
        <div>
          <table className="hms-table"><thead><tr><th>Equipment</th><th>From</th><th>To</th><th>Date</th><th>Transferred By</th></tr></thead>
            <tbody>{data.transfers.map((t: any) => <tr key={t._id}><td>{t.equipmentId?.name}</td><td>{t.fromBranchId?.name}</td><td>{t.toBranchId?.name}</td><td>{formatDate(t.transferDate)}</td><td>{t.transferredBy?.name}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Usage Logs' && (
        <div>
          <table className="hms-table"><thead><tr><th>Equipment</th><th>Start Time</th><th>End Time</th><th>Duration</th><th>Operator</th></tr></thead>
            <tbody>{data.usageLogs.map((u: any) => <tr key={u._id}><td>{u.equipmentId?.name}</td><td>{formatDate(u.startTime)}</td><td>{formatDate(u.endTime)}</td><td>{u.duration} min</td><td>{u.operatorName}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Documents' && (
        <div>
          <table className="hms-table"><thead><tr><th>Document Name</th><th>Equipment</th><th>Type</th><th>Expiry Date</th><th>Action</th></tr></thead>
            <tbody>{data.documents.map((d: any) => <tr key={d._id}><td>{d.documentName}</td><td>{d.equipmentId?.name}</td><td>{d.documentType}</td><td>{formatDate(d.expiryDate)}</td><td><FileText size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Vendors' && (
        <div>
          <table className="hms-table"><thead><tr><th>Vendor Name</th><th>Contact</th><th>Phone</th><th>Email</th></tr></thead>
            <tbody>{data.vendors.map((v: any) => <tr key={v._id}><td>{v.name}</td><td>{v.contact_person}</td><td>{v.phone}</td><td>{v.email}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Equipment;
