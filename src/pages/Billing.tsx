import React, { useState, useEffect } from 'react';
import { 
  getApiV1Billing, 
  getApiV1BillingServiceCharges, 
  getApiV1BillingPackages, 
  getApiV1BillingGroups,
  deleteApiV1BillingByid
} from "@/api/apiService";
import { Receipt, Search, Printer, Eye, Download, RefreshCw, Layers, Package, CreditCard, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Tab = 'invoices' | 'services' | 'packages' | 'groups';

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: 'invoices', label: 'Patient Invoices', icon: Receipt },
  { key: 'services', label: 'Service Charges', icon: CreditCard },
  { key: 'packages', label: 'Billing Packages', icon: Package },
  { key: 'groups', label: 'Billing Groups', icon: Layers },
];

const Billing = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('invoices');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // Data States
  const [data, setData] = useState({
    invoices: [],
    services: [],
    packages: [],
    groups: []
  });

  // Pagination States
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      let res;
      const params = { page, size: pagination.size };

      switch (activeTab) {
        case 'invoices':
          res = await getApiV1Billing(params);
          break;
        case 'services':
          res = await getApiV1BillingServiceCharges(params);
          break;
        case 'packages':
          res = await getApiV1BillingPackages(params);
          break;
        case 'groups':
          res = await getApiV1BillingGroups(params);
          break;
      }

      if (res?.ok) {
        const d = res.data?.data || res.data;
        const content = d?.content || [];
        
        setData(prev => ({
          ...prev,
          [activeTab]: content
        }));

        if (d?.pageable) {
          setPagination({
            page: d.number || 0,
            size: d.size || 10,
            totalElements: d.totalElements || 0,
            totalPages: d.totalPages || 0
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast({ title: 'Error', description: `Failed to fetch ${activeTab}`, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, [activeTab]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await deleteApiV1BillingByid(id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Record deleted successfully' });
        fetchData(pagination.page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete record', variant: 'destructive' });
    }
  };

  const statusColor = (s: string) => {
    switch (s?.toUpperCase()) {
      case 'PAID': return 'bg-hms-success text-hms-success-foreground';
      case 'PARTIALLY_PAID': return 'bg-hms-warning text-foreground';
      case 'DUE':
      case 'UNPAID': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/10">
      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
        Showing {data[activeTab].length} of {pagination.totalElements} records
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {pagination.page + 1} of {pagination.totalPages}</span>
        <div className="flex gap-2">
          <button 
            disabled={pagination.page === 0} 
            onClick={() => fetchData(pagination.page - 1)}
            className="p-1 border border-border rounded hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            disabled={pagination.page >= pagination.totalPages - 1} 
            onClick={() => fetchData(pagination.page + 1)}
            className="p-1 border border-border rounded hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt size={16} />
          Billing & Finance Management
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
            <input
              className="hms-input pl-7 w-64"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="hms-btn-secondary" onClick={() => fetchData(pagination.page)}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-primary flex items-center gap-1">
            <Plus size={14} /> New {activeTab.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="flex border-b border-border bg-card">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 
                ${activeTab === t.key 
                  ? 'border-primary text-primary bg-primary/5' 
                  : 'border-transparent text-muted-foreground hover:bg-muted'}`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto flex flex-col shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 opacity-50">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Processing Financial Data...</span>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              {activeTab === 'invoices' && (
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Invoice No</th>
                      <th>Date</th>
                      <th>Patient</th>
                      <th>UHID</th>
                      <th>Amount</th>
                      <th>Paid</th>
                      <th>Due</th>
                      <th>Status</th>
                      <th>Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.invoices.map((inv: any) => (
                      <tr key={inv.id}>
                        <td className="font-mono text-[10px] font-bold">{inv.invoiceNumber}</td>
                        <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                        <td className="font-semibold">{inv.patient?.fullName || 'Walk-in'}</td>
                        <td>{inv.patient?.uhid || '-'}</td>
                        <td className="font-bold">₹{inv.netAmount?.toLocaleString()}</td>
                        <td className="text-hms-success font-bold">₹{inv.paidAmount?.toLocaleString()}</td>
                        <td className="text-destructive font-bold">₹{inv.dueAmount?.toLocaleString()}</td>
                        <td>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusColor(inv.status)}`}>
                            {inv.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td><span className="text-[10px] font-bold uppercase text-muted-foreground">{inv.paymentMethod || 'CASH'}</span></td>
                        <td>
                          <div className="flex gap-2 text-primary">
                            <Eye size={14} className="cursor-pointer" />
                            <Printer size={14} className="cursor-pointer" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'services' && (
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Charge (₹)</th>
                      <th>Tax (%)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.services.map((s: any) => (
                      <tr key={s.id}>
                        <td className="font-semibold">{s.name}</td>
                        <td><span className="text-[10px] font-bold uppercase bg-muted px-1.5 py-0.5 rounded">{s.category}</span></td>
                        <td className="font-bold">₹{s.charge?.toLocaleString()}</td>
                        <td>{s.taxPercentage}%</td>
                        <td>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${s.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted'}`}>
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td><button className="text-destructive" onClick={() => handleDelete(s.id)}><X size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'packages' && (
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Package Name</th>
                      <th>Description</th>
                      <th>Cost (₹)</th>
                      <th>Services</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.packages.map((p: any) => (
                      <tr key={p.id}>
                        <td className="font-semibold">{p.name}</td>
                        <td className="text-xs text-muted-foreground max-w-xs truncate">{p.description}</td>
                        <td className="font-bold text-primary">₹{p.totalCost?.toLocaleString()}</td>
                        <td className="text-[10px] font-bold uppercase">{p.itemsCount || 0} Items</td>
                        <td>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${p.active ? 'bg-hms-success text-hms-success-foreground' : 'bg-muted'}`}>
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td><Eye size={14} className="text-primary cursor-pointer" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'groups' && (
                <table className="hms-table">
                  <thead>
                    <tr>
                      <th>Group Name</th>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Charge Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.groups.map((g: any) => (
                      <tr key={g.id}>
                        <td className="font-semibold">{g.name}</td>
                        <td className="font-mono text-[10px] font-bold">{g.code}</td>
                        <td className="text-xs">{g.description}</td>
                        <td><span className="text-[10px] font-bold uppercase border border-border px-1.5 py-0.5 rounded">{g.chargeType}</span></td>
                        <td><button className="text-destructive" onClick={() => handleDelete(g.id)}><X size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {data[activeTab].length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                  <Layers size={48} className="mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No records found in {activeTab}</p>
                </div>
              )}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};

export default Billing;
