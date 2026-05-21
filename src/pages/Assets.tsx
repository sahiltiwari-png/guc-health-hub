

import React, { useState, useEffect } from 'react';
import { Package, Eye, Edit, Trash2, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, DollarSign, BarChart3, Printer } from 'lucide-react';
import { createAsset, createAssetCategory, createAssetDepreciation, createAssetDisposal, createAssetMaintenance, createAssetVendor, createAssetsMasters, deleteAsset, deleteAssetCategory, deleteAssetVendor, extractArray, getAssetAudits, getAssetCategories, getAssetDepreciations, getAssetDisposals, getAssetLocations, getAssetMaintenances, getAssetVendors, getAssets, getAssetsCategories, getAssetsLocations, getAssetsVendors, getAutoAssetsMasters } from "@/api/apiService";


const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { 
    'Active': 'bg-green-700 text-white', 
    'available': 'bg-green-700 text-white',
    'assigned': 'bg-blue-700 text-white',
    'Under Maintenance': 'bg-yellow-600 text-white', 
    'maintenance': 'bg-yellow-600 text-white',
    'Disposed': 'bg-red-700 text-white', 
    'disposed': 'bg-red-700 text-white',
    'Completed': 'bg-green-700 text-white', 
    'completed': 'bg-green-700 text-white',
    'In Progress': 'bg-blue-700 text-white', 
    'in_progress': 'bg-blue-700 text-white',
    'Scheduled': 'bg-yellow-600 text-white', 
    'scheduled': 'bg-yellow-600 text-white',
    'Good': 'bg-green-700 text-white', 
    'Excellent': 'bg-green-800 text-white', 
    'Fair': 'bg-yellow-600 text-white', 
    'Expired': 'bg-red-700 text-white' 
  };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${colors[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const Assets = () => {
  const tabs = ['Dashboard','Asset Register','Categories','Maintenance','Depreciation','Disposal','Vendors','Audit Trail'];
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    assets: [],
    categories: [],
    vendors: [],
    locations: [],
    maintenance: [],
    depreciation: [],
    disposals: [],
    audits: []
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState<any>({});

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await getAssets();
      if (res.ok) {
        const assets = extractArray(res);
        setData((prev: any) => ({ ...prev, assets }));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAssets(); }, []);


  const fetchData = async (currentTab: string) => {
    setLoading(true);
    try {
      switch (currentTab) {
        case 'Asset Register':
          const assetsRes = await getAssets();
          setData((prev: any) => ({ ...prev, assets: extractArray(assetsRes) }));
          break;
        case 'Categories':
          const categoriesRes = await getAssetCategories();
          setData((prev: any) => ({ ...prev, categories: extractArray(categoriesRes) }));
          break;
        case 'Vendors':
          const vendorsRes = await getAssetVendors();
          setData((prev: any) => ({ ...prev, vendors: extractArray(vendorsRes) }));
          break;
        case 'Maintenance':
          const maintenanceRes = await getAssetMaintenances();
          setData((prev: any) => ({ ...prev, maintenance: extractArray(maintenanceRes) }));
          break;
        case 'Depreciation':
          const depreciationRes = await getAssetDepreciations();
          setData((prev: any) => ({ ...prev, depreciation: extractArray(depreciationRes) }));
          break;
        case 'Disposal':
          const disposalsRes = await getAssetDisposals();
          setData((prev: any) => ({ ...prev, disposals: extractArray(disposalsRes) }));
          break;
        case 'Audit Trail':
          const auditsRes = await getAssetAudits();
          setData((prev: any) => ({ ...prev, audits: extractArray(auditsRes) }));
          break;
        case 'Dashboard':
          const [a, c, m] = await Promise.all([getAssets({ limit: 5 }), getAssetCategories(), getAssetMaintenances({ limit: 5 })]);
          setData((prev: any) => ({ 
            ...prev, 
            assets: extractArray(a), 
            categories: extractArray(c), 
            maintenance: extractArray(m),
            totalAssets: a.total || a.data?.total || 0
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
                    case 'Asset': await deleteAsset(id); break;
                    case 'Category': await deleteAssetCategory(id); break;
                    case 'Vendor': await deleteAssetVendor(id); break;
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
              case 'Asset':
                  await createAsset(formData);
                  break;
              case 'Category':
                  await createAssetCategory(formData);
                  break;
              case 'Vendor':
                  await createAssetVendor(formData);
                  break;
              case 'Maintenance':
                   await createAssetMaintenance(formData);
                   break;
               case 'Depreciation':
                   await createAssetDepreciation(formData);
                   break;
               case 'Disposal':
                   await createAssetDisposal(formData);
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
              {modalType === 'Asset' && (
                <>
                  <input className="hms-input w-full" placeholder="Asset Name" required onChange={e => setFormData({ ...formData, asset_name: e.target.value })} />
                  <input className="hms-input w-full" placeholder="Asset Code" required onChange={e => setFormData({ ...formData, asset_code: e.target.value })} />
                  <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                    <option value="">Select Category</option>
                    {data.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input type="date" className="hms-input w-full" onChange={e => setFormData({ ...formData, purchase_date: e.target.value })} />
                  <input type="number" className="hms-input w-full" placeholder="Purchase Cost" onChange={e => setFormData({ ...formData, purchase_cost: e.target.value })} />
                </>
              )}
              {modalType === 'Category' && (
                <>
                  <input className="hms-input w-full" placeholder="Category Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  <textarea className="hms-input w-full" placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </>
              )}
              {modalType === 'Vendor' && (
                 <>
                   <input className="hms-input w-full" placeholder="Vendor Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                   <input className="hms-input w-full" placeholder="Contact Person" onChange={e => setFormData({ ...formData, contact_person: e.target.value })} />
                   <input className="hms-input w-full" placeholder="Phone" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                   <input className="hms-input w-full" placeholder="Email" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                 </>
               )}
               {modalType === 'Maintenance' && (
                  <>
                    <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                      <option value="">Select Asset</option>
                      {data.assets.map((a: any) => <option key={a.id} value={a.id}>{a.asset_name}</option>)}
                    </select>
                    <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, maintenance_type: e.target.value })}>
                      <option value="">Select Type</option>
                      <option value="preventive">Preventive</option>
                      <option value="repair">Repair</option>
                      <option value="breakdown">Breakdown</option>
                    </select>
                    <input type="date" className="hms-input w-full" onChange={e => setFormData({ ...formData, maintenance_date: e.target.value })} />
                    <input type="number" className="hms-input w-full" placeholder="Cost" onChange={e => setFormData({ ...formData, cost: e.target.value })} />
                    <input className="hms-input w-full" placeholder="Technician Name" onChange={e => setFormData({ ...formData, technician_name: e.target.value })} />
                  </>
                )}
                {modalType === 'Depreciation' && (
                  <>
                    <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                      <option value="">Select Asset</option>
                      {data.assets.map((a: any) => <option key={a.id} value={a.id}>{a.asset_name}</option>)}
                    </select>
                    <input type="number" className="hms-input w-full" placeholder="Depreciation Amount" onChange={e => setFormData({ ...formData, depreciation_amount: e.target.value })} />
                    <input type="date" className="hms-input w-full" onChange={e => setFormData({ ...formData, depreciation_date: e.target.value })} />
                    <input type="number" className="hms-input w-full" placeholder="Book Value" onChange={e => setFormData({ ...formData, book_value: e.target.value })} />
                  </>
                )}
                {modalType === 'Disposal' && (
                  <>
                    <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, asset_id: e.target.value })}>
                      <option value="">Select Asset</option>
                      {data.assets.map((a: any) => <option key={a.id} value={a.id}>{a.asset_name}</option>)}
                    </select>
                    <select className="hms-select w-full" required onChange={e => setFormData({ ...formData, disposal_type: e.target.value })}>
                      <option value="">Select Type</option>
                      <option value="sold">Sold</option>
                      <option value="scrapped">Scrapped</option>
                      <option value="donated">Donated</option>
                      <option value="writeoff">Write-off</option>
                    </select>
                    <input type="date" className="hms-input w-full" onChange={e => setFormData({ ...formData, disposal_date: e.target.value })} />
                    <input type="number" className="hms-input w-full" placeholder="Disposal Amount" onChange={e => setFormData({ ...formData, disposal_amount: e.target.value })} />
                    <textarea className="hms-input w-full" placeholder="Remarks" onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
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
      <div className="hms-section-header flex items-center gap-2"><Package size={14} /> Assets Management System</div>
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
              { label: 'Total Assets', value: data.totalAssets || '0', icon: Package, sub: 'Total registered' },
              { label: 'Active', value: data.assets.filter((a: any) => a.status === 'available').length, icon: CheckCircle, sub: 'Operational' },
              { label: 'Under Maintenance', value: data.assets.filter((a: any) => a.status === 'maintenance').length, icon: Wrench, sub: 'Pending repair' },
              { label: 'Warranty Expiring', value: '0', icon: AlertTriangle, sub: 'Next 90 Days' },
              { label: 'Total Value', value: `₹${data.assets.reduce((sum: number, a: any) => sum + (a.purchase_cost || 0), 0).toLocaleString()}`, icon: TrendingUp, sub: 'Purchase Value' },
              { label: 'AMC Active', value: '0', icon: DollarSign, sub: 'Active contracts' },
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
              <div className="hms-section-header text-xs">Category-wise Asset Distribution</div>
              <table className="hms-table"><thead><tr><th>Category</th><th>Count</th><th>Description</th></tr></thead>
                <tbody>{data.categories.map((c: any, i: number) => <tr key={i}><td>{c.name}</td><td>-</td><td>{c.description}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Upcoming Maintenance</div>
              <table className="hms-table"><thead><tr><th>Asset</th><th>Type</th><th>Date</th><th>Vendor</th><th>Status</th></tr></thead>
                <tbody>{data.maintenance.filter((m: any) => m.status !== 'completed').map((m: any, i: number) => <tr key={i}><td>{m.asset_id?.asset_name}</td><td>{m.maintenance_type}</td><td>{formatDate(m.maintenance_date)}</td><td>{m.vendor_id?.name}</td><td><StatusBadge status={m.status} /></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && tab === 'Asset Register' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Asset ID/Name..." />
            <select className="hms-select"><option>All Categories</option>{data.categories.map((c: any) => <option key={c.id}>{c.name}</option>)}</select>
            <select className="hms-select"><option>All Status</option><option>Available</option><option>Maintenance</option><option>Disposed</option></select>
            <button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Asset')}>+ Add Asset</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Export</button>
          </div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Location</th><th>Purchase</th><th>Cost</th><th>Brand/Model</th><th>Serial No</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{data.assets.map((a: any) => <tr key={a.id}><td className="font-mono text-[10px]">{a.asset_code}</td><td>{a.asset_name}</td><td>{a.category_id?.name}</td><td>{a.location_id?.description}</td><td>{formatDate(a.purchase_date)}</td><td>₹{a.purchase_cost?.toLocaleString()}</td><td>{a.brand} {a.model}</td><td>{a.serial_number}</td><td><StatusBadge status={a.status} /></td><td className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Edit size={12} className="text-primary cursor-pointer" /><Trash2 size={12} className="text-red-500 cursor-pointer" onClick={() => handleDelete(a.id, 'Asset')} /><Wrench size={12} className="text-muted-foreground cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Categories' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Category')}>+ Add Category</button></div>
          <table className="hms-table"><thead><tr><th>S.No</th><th>Category Name</th><th>Description</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{data.categories.map((c: any, i: number) => <tr key={i}><td>{i + 1}</td><td>{c.name}</td><td>{c.description}</td><td>{c.is_active ? 'Active' : 'Inactive'}</td><td><div className="flex gap-1"><Edit size={12} className="text-primary cursor-pointer" /><Trash2 size={12} className="text-red-500 cursor-pointer" onClick={() => handleDelete(c.id, 'Category')} /></div></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Maintenance' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>All Types</option><option>preventive</option><option>repair</option><option>breakdown</option></select>
            <select className="hms-select"><option>All Status</option><option>scheduled</option><option>in_progress</option><option>completed</option></select>
            <button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Maintenance')}>+ Schedule Maintenance</button>
          </div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Asset</th><th>Type</th><th>Scheduled</th><th>Cost</th><th>Technician/Vendor</th><th>Next Due</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{data.maintenance.map((m: any) => <tr key={m.id}><td className="font-mono text-[10px]">{m.id.substring(0, 8)}</td><td>{m.asset_id?.asset_name}</td><td>{m.maintenance_type}</td><td>{formatDate(m.maintenance_date)}</td><td>₹{m.cost?.toLocaleString()}</td><td>{m.technician_name || m.vendor_id?.name}</td><td>{formatDate(m.next_maintenance_date)}</td><td><StatusBadge status={m.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Depreciation' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Depreciation')}>+ Add Depreciation</button></div>
          <table className="hms-table"><thead><tr><th>Asset</th><th>Original Value</th><th>Depreciation Date</th><th>Depreciation Amount</th><th>Book Value</th></tr></thead>
            <tbody>
              {data.depreciation.map((d: any, i: number) => <tr key={i}><td>{d.asset_id?.asset_name}</td><td>₹{d.asset_id?.purchase_cost?.toLocaleString()}</td><td>{formatDate(d.depreciation_date)}</td><td>₹{d.depreciation_amount?.toLocaleString()}</td><td>₹{d.book_value?.toLocaleString()}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Disposal' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Disposal')}>+ Record Disposal</button></div>
          <table className="hms-table"><thead><tr><th>Asset</th><th>Type</th><th>Disposal Date</th><th>Amount</th><th>Remarks</th><th>Action</th></tr></thead>
            <tbody>
              {data.disposals.map((d: any, i: number) => <tr key={i}><td>{d.asset_id?.asset_name}</td><td>{d.disposal_type}</td><td>{formatDate(d.disposal_date)}</td><td>₹{d.disposal_amount?.toLocaleString()}</td><td>{d.remarks}</td><td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Vendors' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto" onClick={() => handleAdd('Vendor')}>+ Add Vendor</button></div>
          <table className="hms-table"><thead><tr><th>Vendor Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>GST No</th><th>Action</th></tr></thead>
            <tbody>
              {data.vendors.map((v: any, i: number) => <tr key={i}><td>{v.name}</td><td>{v.contact_person}</td><td>{v.phone}</td><td>{v.email}</td><td>{v.gst_number}</td><td><div className="flex gap-1"><Eye size={12} className="text-primary cursor-pointer" /><Trash2 size={12} className="text-red-500 cursor-pointer" onClick={() => handleDelete(v.id, 'Vendor')} /></div></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === 'Audit Trail' && (
        <div>
          <table className="hms-table"><thead><tr><th>Date/Time</th><th>Asset</th><th>Verified By</th><th>Condition</th><th>Remarks</th></tr></thead>
            <tbody>
              {data.audits.map((a: any, i: number) => <tr key={i}><td>{formatDate(a.verification_date)}</td><td>{a.asset_id?.asset_name}</td><td>{a.verified_by?.name}</td><td>{a.condition}</td><td>{a.remarks}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Assets;
