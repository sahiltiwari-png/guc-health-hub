import React, { useState, useEffect } from 'react';
import { 
  getApiV1InventoryPharmacyDashboard,
  getApiV1InventoryPharmacyDispense,
  postApiV1InventoryPharmacyDispense,
  getApiV1InventoryPharmacyStock,
  postApiV1InventoryPharmacyStock,
  putApiV1InventoryPharmacyStockByid,
  deleteApiV1InventoryPharmacyStockByid,
  getApiV1InventoryPharmacyStockSearch,
  getApiV1InventoryPurchaseOrders,
  postApiV1InventoryPurchaseOrders,
  postApiV1InventoryPurchaseOrdersReceiveByid,
  getApiV1InventorySuppliers,
  postApiV1InventorySuppliers,
  putApiV1InventorySuppliersByid
} from "@/api/apiService";
import { 
  Pill, ClipboardList, Package, TrendingUp, AlertTriangle, CreditCard,
  Users, FileText, Eye, Printer, Search, BarChart3, ShieldCheck,
  Truck, Activity, Bell, Clock, ChevronDown, Download, ArrowLeftRight,
  BookOpen, Receipt, Layers, ShoppingCart, Wrench, UserCheck, Archive,
  Plus, X, History
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

/* ───────── STATUS BADGE ───────── */
const StatusBadge = ({ status }: { status: string }) => {
  const cls =
    status === 'Dispensed' || status === 'Paid' || status === 'OK' || status === 'Verified' || status === 'Complete' || status === 'Completed' || status === 'Approved' || status === 'Settled' || status === 'Received' || status === 'Active' || status === 'Delivered'
      ? 'bg-hms-success text-hms-success-foreground'
      : status === 'Pending' || status === 'Low' || status === 'Partial' || status === 'Pending Approval' || status === 'Pending QC' || status === 'Under Review' || status === 'In Transit'
        ? 'bg-hms-warning text-foreground'
        : status === 'In Progress'
          ? 'bg-hms-info text-hms-success-foreground'
          : status === 'Critical' || status === 'Insurance' || status === 'Rejected' || status === 'Inactive'
            ? 'bg-destructive text-destructive-foreground'
            : status === 'Partial Return'
              ? 'bg-hms-info text-hms-success-foreground'
              : 'bg-muted text-foreground';
  return <span className={`px-2 py-0.5 text-[10px] font-bold ${cls}`}>{status}</span>;
};

/* ───────── TAB PANELS ───────── */

const OverviewPanel = ({ dispenses, stocks }: { dispenses: any[], stocks: any[] }) => {
  const lowStock = stocks.filter(s => s.quantity < (s.reorderLevel || 10)).slice(0, 5);
  const expiryAlerts = stocks.filter(s => {
    if (!s.expiryDate) return false;
    const daysLeft = Math.ceil((new Date(s.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 60;
  }).slice(0, 5);

  return (
    <div className="space-y-3">
      <div>
        <div className="hms-section-header">Recent Dispense Activity</div>
        <table className="hms-table">
          <thead><tr><th>Dispense No</th><th>UHID</th><th>Patient</th><th>Medicine</th><th>Qty</th><th>Total (₹)</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {dispenses.length > 0 ? dispenses.slice(0, 5).map(d => (
              <tr key={d.id}>
                <td className="font-mono text-[10px]">{d.dispenseNumber}</td>
                <td>{d.patient?.uhid}</td>
                <td className="font-semibold">{d.patientName || d.patient?.fullName}</td>
                <td>{d.items?.[0]?.stock?.medicineName || 'N/A'}</td>
                <td>{d.items?.[0]?.quantity || 0}</td>
                <td className="font-bold">₹{d.totalAmount?.toLocaleString()}</td>
                <td>{new Date(d.dispenseDate).toLocaleDateString()}</td>
                <td><StatusBadge status={d.status || 'Completed'} /></td>
              </tr>
            )) : (
              <tr><td colSpan={8} className="text-center py-4">No recent dispenses found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="hms-section-header">Low Stock Items</div>
          <table className="hms-table">
            <thead><tr><th>Medicine</th><th>Stock</th><th>Min Stock</th><th>Category</th><th>Status</th></tr></thead>
            <tbody>
              {lowStock.length > 0 ? lowStock.map((i, idx) => (
                <tr key={idx}><td>{i.medicineName}</td><td className="text-destructive font-bold">{i.quantity}</td><td>{i.reorderLevel}</td><td>{i.category}</td><td><StatusBadge status="Low" /></td></tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No low stock items</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          <div className="hms-section-header">Expiry Alerts (Next 60 Days)</div>
          <table className="hms-table">
            <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Days Left</th><th>Status</th></tr></thead>
            <tbody>
              {expiryAlerts.length > 0 ? expiryAlerts.map((e, idx) => {
                const daysLeft = Math.ceil((new Date(e.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={idx} className={daysLeft <= 14 ? 'text-destructive font-semibold' : ''}>
                    <td>{e.medicineName}</td><td>{e.batchNumber}</td><td>{new Date(e.expiryDate).toLocaleDateString()}</td><td>{daysLeft}</td><td><StatusBadge status="Expiring" /></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No near-expiry items</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StockPanel = ({ stocks, onAddStock, onSearch, onEdit, onDelete }: { stocks: any[], onAddStock: () => void, onSearch: (q: string) => void, onEdit: (s: any) => void, onDelete: (id: string | number) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="hms-section-header flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span>Pharmacy Stock Summary</span>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input 
              className="hms-input pl-7 py-1 w-48 text-[10px]" 
              placeholder="Search by name/batch..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <button className="hms-btn-primary text-[10px] py-1" onClick={onAddStock}><Plus size={12} /> Add Stock</button>
      </div>
      <table className="hms-table">
      <thead><tr><th>S.No</th><th>Medicine</th><th>Category</th><th>Available Stock</th><th>Unit</th><th>Purchase Price</th><th>Selling Price</th><th>Value</th><th>Actions</th></tr></thead>
      <tbody>
        {stocks.length > 0 ? stocks.map((s, i) => (
          <tr key={s.id || i}>
            <td>{i + 1}</td>
            <td>
              <div className="font-semibold">{s.medicineName}</div>
              <div className="text-[9px] text-muted-foreground font-mono">Batch: {s.batchNumber}</div>
            </td>
            <td>{s.category || 'General'}</td>
            <td className={s.quantity < (s.reorderLevel || 50) ? 'text-destructive font-bold' : 'text-hms-success'}>{s.quantity}</td>
            <td>Units</td>
            <td>₹{s.unitPrice || 0}</td>
            <td>₹{s.mrp || 0}</td>
            <td>₹{(s.quantity * (s.unitPrice || 0)).toLocaleString()}</td>
            <td>
              <div className="flex gap-2">
                <Eye size={13} className="text-primary cursor-pointer hover:opacity-70" onClick={() => onEdit(s)} />
                <Wrench size={13} className="text-primary cursor-pointer hover:opacity-70" onClick={() => onEdit(s)} />
                <X size={13} className="text-destructive cursor-pointer hover:opacity-70" onClick={() => onDelete(s.id)} />
              </div>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={9} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No stock data found</td></tr>
        )}
      </tbody>
    </table>
  </div>
  );
};

const DispensingPanel = ({ dispenses }: { dispenses: any[] }) => (
  <div>
    <div className="hms-section-header">Medication Dispensing Feed</div>
    <table className="hms-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Dispense No</th>
          <th>Patient</th>
          <th>UHID</th>
          <th>Medicine & Qty</th>
          <th>Pharmacist</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {dispenses.length > 0 ? dispenses.map((d, i) => (
          <tr key={d.id || i}>
            <td>{i + 1}</td>
            <td className="font-mono text-[10px]">{d.dispenseNumber}</td>
            <td>{d.patientName || d.patient?.fullName || 'N/A'}</td>
            <td className="font-mono text-[10px]">{d.patient?.uhid || 'N/A'}</td>
            <td>
              <div className="font-semibold">{d.items?.[0]?.stock?.medicineName || 'N/A'}</div>
              <div className="text-[10px] text-muted-foreground">Qty: {d.items?.[0]?.quantity || 0}</div>
            </td>
            <td>{d.createdBy || 'N/A'}</td>
            <td>{d.dispenseDate ? new Date(d.dispenseDate).toLocaleDateString() : 'N/A'}</td>
            <td>₹{d.totalAmount || 0}</td>
            <td><StatusBadge status={d.status || 'Completed'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={9} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No active dispenses found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const PurchaseOrdersPanel = ({ orders, onReceive, onEdit }: { orders: any[], onReceive: (id: string | number) => void, onEdit: (o: any) => void }) => (
  <div>
    <div className="hms-section-header">Purchase Orders</div>
    <table className="hms-table">
      <thead><tr><th>PO No</th><th>Supplier</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {orders.length > 0 ? orders.map(o => (
          <tr key={o.id}>
            <td>{o.poNumber}</td>
            <td>{o.supplierName || o.supplierId?.supplierName}</td>
            <td>{new Date(o.orderDate || o.poDate).toLocaleDateString()}</td>
            <td>₹{o.totalAmount?.toLocaleString()}</td>
            <td><StatusBadge status={o.status} /></td>
            <td>
              <div className="flex gap-2">
                <Eye size={13} className="text-primary cursor-pointer hover:opacity-70" onClick={() => onEdit(o)} />
                {o.status !== 'Received' && (
                  <Download size={13} className="text-hms-success cursor-pointer hover:opacity-70" onClick={() => onReceive(o.id)} aria-label="Receive Stock" />
                )}
              </div>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={6} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No orders found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const SuppliersPanel = ({ suppliers, onEdit }: { suppliers: any[], onEdit: (s: any) => void }) => (
  <div>
    <div className="hms-section-header flex justify-between items-center">
      <span>Supplier Directory</span>
      <button className="hms-btn-primary text-[10px] py-1" onClick={() => onEdit({ name: '', phone: '', email: '', active: true })}><Plus size={12} /> Add Supplier</button>
    </div>
    <table className="hms-table">
      <thead><tr><th>Supplier Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {suppliers.length > 0 ? suppliers.map(s => (
          <tr key={s.id}>
            <td className="font-bold">{s.name || s.supplierName}</td>
            <td>{s.phone}</td>
            <td>{s.email}</td>
            <td><StatusBadge status={(s.active ?? s.isActive) ? 'Active' : 'Inactive'} /></td>
            <td>
              <div className="flex gap-2">
                <Wrench size={13} className="text-primary cursor-pointer hover:opacity-70" onClick={() => onEdit(s)} />
              </div>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4 text-muted-foreground uppercase text-[10px] font-bold">No suppliers found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

/* ───────── MAIN COMPONENT ───────── */

const Pharmacy = () => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'stock', label: 'Stock & Inventory', icon: Archive },
    { key: 'dispensing', label: 'Medication Dispensing', icon: Pill },
    { key: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { key: 'suppliers', label: 'Supplier Directory', icon: UserCheck },
  ];
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { toast } = useToast();
  
  // Data States
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [stocks, setStocks] = useState<any[]>([]);
  const [dispenses, setDispenses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  // Pagination States
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, stockRes, dispenseRes, poRes, supRes] = await Promise.all([
        getApiV1InventoryPharmacyDashboard(),
        getApiV1InventoryPharmacyStock({ page, size }),
        getApiV1InventoryPharmacyDispense({ page, size }),
        getApiV1InventoryPurchaseOrders({ page, size }),
        getApiV1InventorySuppliers({ page, size })
      ]);

      if (dashRes.ok) setDashboardStats(dashRes.data?.data || dashRes.data);
      
      const setPaginatedData = (res: any, setter: (data: any[]) => void) => {
        if (res.ok) {
          const d = res.data?.data || res.data;
          setter(d?.content || d || []);
          if (d?.totalPages) setTotalPages(d.totalPages);
        }
      };

      setPaginatedData(stockRes, setStocks);
      setPaginatedData(dispenseRes, setDispenses);
      setPaginatedData(poRes, setOrders);
      setPaginatedData(supRes, setSuppliers);

    } catch (e) {
      console.error('Error syncing pharmacy data:', e);
      toast({ title: 'Error', description: 'Failed to fetch pharmacy data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size, activeTab]);

  const kpiData = [
    { label: 'Total Rx Today', value: dashboardStats?.totalRxToday || '0', icon: ClipboardList, change: dashboardStats?.rxChange || '0% vs yesterday', color: 'bg-primary' },
    { label: 'Medicines Dispensed', value: dashboardStats?.medicinesDispensed || '0', icon: Pill, change: dashboardStats?.fulfilmentRate || '0% fulfilment', color: 'bg-hms-success' },
    { label: 'Low Stock Items', value: dashboardStats?.lowStockItems || '0', icon: AlertTriangle, change: dashboardStats?.criticalItems || '0 critical', color: 'bg-hms-warning' },
    { label: 'Expiring Soon', value: dashboardStats?.expiringSoon || '0', icon: Clock, change: 'Within 30 days', color: 'bg-destructive' },
    { label: 'Pending Bills', value: `₹${dashboardStats?.pendingBillsAmount || '0'}`, icon: CreditCard, change: `${dashboardStats?.pendingBillsCount || '0'} patients`, color: 'bg-hms-info' },
    { label: 'Revenue Today', value: `₹${dashboardStats?.revenueToday || '0'}`, icon: TrendingUp, change: dashboardStats?.revenueChange || '0% vs avg', color: 'bg-primary' },
  ];

  const handleSearch = async (query: string) => {
    if (!query) {
      fetchData();
      return;
    }
    setLoading(true);
    try {
      const res = await getApiV1InventoryPharmacyStockSearch({ name: query, page: 0, size });
      if (res.ok) {
        const d = res.data?.data || res.data;
        setStocks(d?.content || d || []);
        if (d?.totalPages) setTotalPages(d.totalPages);
      }
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (s: any) => {
    setSelectedItem(s);
    setShowModal('editStock');
  };

  const handleDeleteStock = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this stock item?')) return;
    try {
      await deleteApiV1InventoryPharmacyStockByid(id);
      toast({ title: 'Success', description: 'Stock deleted successfully' });
      fetchData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to delete stock', variant: 'destructive' });
    }
  };

  const handleReceivePO = async (id: string | number) => {
    if (!confirm('Receive all items from this purchase order into stock?')) return;
    try {
      await postApiV1InventoryPurchaseOrdersReceiveByid(id);
      toast({ title: 'Success', description: 'Purchase order received successfully' });
      fetchData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to receive PO', variant: 'destructive' });
    }
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (showModal === 'addStock') {
        await postApiV1InventoryPharmacyStock(selectedItem);
        toast({ title: 'Success', description: 'Stock added successfully' });
      } else {
        await putApiV1InventoryPharmacyStockByid(selectedItem.id, selectedItem);
        toast({ title: 'Success', description: 'Stock updated successfully' });
      }
      setShowModal(null);
      fetchData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save stock', variant: 'destructive' });
    }
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem.id) {
        await putApiV1InventorySuppliersByid(selectedItem.id, selectedItem);
        toast({ title: 'Success', description: 'Supplier updated successfully' });
      } else {
        await postApiV1InventorySuppliers(selectedItem);
        toast({ title: 'Success', description: 'Supplier added successfully' });
      }
      setShowModal(null);
      fetchData();
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to save supplier', variant: 'destructive' });
    }
  };

  const panelMap: Record<string, React.ReactNode> = {
    overview: <OverviewPanel dispenses={dispenses} stocks={stocks} />,
    stock: <StockPanel 
      stocks={stocks} 
      onSearch={handleSearch} 
      onEdit={handleEditStock}
      onDelete={handleDeleteStock}
      onAddStock={() => {
        setSelectedItem({
          medicineName: '',
          batchNumber: '',
          genericName: '',
          manufacturer: '',
          unitPrice: 0,
          mrp: 0,
          quantity: 0,
          expiryDate: new Date().toISOString().split('T')[0],
          reorderLevel: 10,
          category: 'General',
          active: true
        });
        setShowModal('addStock');
      }} 
    />,
    dispensing: <DispensingPanel dispenses={dispenses} />,
    'purchase-orders': <PurchaseOrdersPanel 
      orders={orders} 
      onReceive={handleReceivePO}
      onEdit={(o) => { setSelectedItem(o); setShowModal('viewPO'); }}
    />,
    suppliers: <SuppliersPanel 
      suppliers={suppliers} 
      onEdit={(s) => { setSelectedItem(s); setShowModal('editSupplier'); }}
    />,
  };

  const Pagination = () => (
    <div className="flex items-center justify-end gap-2 mt-4 pb-4">
      <button 
        disabled={page === 0} 
        onClick={() => setPage(p => p - 1)}
        className="hms-btn-secondary px-2 py-1 text-[10px] disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-[10px] font-bold">Page {page + 1} of {totalPages || 1}</span>
      <button 
        disabled={page >= totalPages - 1} 
        onClick={() => setPage(p => p + 1)}
        className="hms-btn-secondary px-2 py-1 text-[10px] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="hms-section-header flex items-center justify-between">
        <span className="flex items-center gap-2"><Pill size={16} /> Pharmacy Dashboard — GUC HMS</span>
        <span className="text-[10px] font-normal">{new Date().toLocaleDateString()} | Pharmacist: Ankit Gupta</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-2 my-2">
        {kpiData.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{k.label}</p>
                  <p className="text-base font-bold text-foreground">{k.value}</p>
                  <p className="text-[9px] text-muted-foreground">{k.change}</p>
                </div>
                <Icon size={22} className="text-primary opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation — module style */}
      <div className="bg-primary flex items-center gap-0 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setPage(0); // Reset page on tab change
              }}
              className={`flex items-center gap-1 px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors
                ${activeTab === t.key
                  ? 'bg-card text-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {panelMap[activeTab]}
        {['stock', 'dispensing', 'purchase-orders', 'suppliers'].includes(activeTab) && <Pagination />}
      </div>

      {/* Modals */}
      {(showModal === 'addStock' || showModal === 'editStock') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Pill size={16} className="text-primary" /> {showModal === 'addStock' ? 'Register New Pharmacy Stock' : 'Edit Pharmacy Stock'}</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveStock} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Medicine Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.medicineName} onChange={e => setSelectedItem({...selectedItem, medicineName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Batch Number</label>
                  <input className="hms-input w-full" required value={selectedItem?.batchNumber} onChange={e => setSelectedItem({...selectedItem, batchNumber: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Generic Name</label>
                  <input className="hms-input w-full" value={selectedItem?.genericName} onChange={e => setSelectedItem({...selectedItem, genericName: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Manufacturer</label>
                  <input className="hms-input w-full" value={selectedItem?.manufacturer} onChange={e => setSelectedItem({...selectedItem, manufacturer: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Unit Price (₹)</label>
                  <input type="number" step="0.01" className="hms-input w-full" required value={selectedItem?.unitPrice} onChange={e => setSelectedItem({...selectedItem, unitPrice: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">MRP (₹)</label>
                  <input type="number" step="0.01" className="hms-input w-full" required value={selectedItem?.mrp} onChange={e => setSelectedItem({...selectedItem, mrp: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Quantity</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem?.quantity} onChange={e => setSelectedItem({...selectedItem, quantity: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Reorder Level</label>
                  <input type="number" className="hms-input w-full" value={selectedItem?.reorderLevel} onChange={e => setSelectedItem({...selectedItem, reorderLevel: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Expiry Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem?.expiryDate} onChange={e => setSelectedItem({...selectedItem, expiryDate: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
                  <select className="hms-select w-full" value={selectedItem?.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}>
                    <option value="General">General</option>
                    <option value="Schedule H">Schedule H</option>
                    <option value="Critical">Critical</option>
                    <option value="Injectables">Injectables</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Register Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {showModal === 'editSupplier' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Truck size={16} className="text-primary" /> {selectedItem?.id ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveSupplier} className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Supplier Name</label>
                  <input className="hms-input w-full" required value={selectedItem?.name || selectedItem?.supplierName} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Phone</label>
                  <input className="hms-input w-full" value={selectedItem?.phone} onChange={e => setSelectedItem({...selectedItem, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Email</label>
                  <input className="hms-input w-full" value={selectedItem?.email} onChange={e => setSelectedItem({...selectedItem, email: e.target.value})} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedItem?.active ?? selectedItem?.isActive} onChange={e => setSelectedItem({...selectedItem, active: e.target.checked})} />
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Active Supplier</label>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View PO Modal */}
      {showModal === 'viewPO' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><ShoppingCart size={16} className="text-primary" /> Purchase Order: {selectedItem?.poNumber}</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div><span className="font-bold uppercase text-muted-foreground">Supplier:</span> {selectedItem?.supplierName || selectedItem?.supplierId?.supplierName}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Date:</span> {new Date(selectedItem?.orderDate || selectedItem?.poDate).toLocaleDateString()}</div>
                <div><span className="font-bold uppercase text-muted-foreground">Status:</span> <StatusBadge status={selectedItem?.status} /></div>
                <div><span className="font-bold uppercase text-muted-foreground">Total Amount:</span> ₹{selectedItem?.totalAmount?.toLocaleString()}</div>
              </div>
              <div className="hms-section-header">Order Items</div>
              <table className="hms-table">
                <thead><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {selectedItem?.items?.map((item: any, i: number) => (
                    <tr key={i}>
                      <td>{item.medicineName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.unitPrice}</td>
                      <td>₹{item.subtotal}</td>
                    </tr>
                  )) || <tr><td colSpan={4} className="text-center py-2">No items listed</td></tr>}
                </tbody>
              </table>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary w-full" onClick={() => setShowModal(null)}>Close</button>
                {selectedItem?.status !== 'Received' && (
                  <button type="button" className="hms-btn-primary w-full" onClick={() => { handleReceivePO(selectedItem.id); setShowModal(null); }}>Receive Stock</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
