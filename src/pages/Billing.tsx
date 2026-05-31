import React, { useState, useEffect } from 'react';
import { 
  getInvoices,
  getServiceCharges,
  cancelInvoice,
  deleteInstrument,
  updateInvoicePayment,
  searchInvoices,
  createInvoice,
  createServiceCharge,
  updateServiceCharge,
  deleteServiceCharge,
  getInvoiceById,
  extractArray,
  extractObject
} from "@/api/apiService";
import { Receipt, Search, Printer, Eye, Download, RefreshCw, Layers, Package, CreditCard, ChevronLeft, ChevronRight, X, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type Tab = 'invoices' | 'services';

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: 'invoices', label: 'Patient Invoices', icon: Receipt },
  { key: 'services', label: 'Service Charges', icon: CreditCard },
];

const Billing = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('invoices');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Data States
  const [data, setData] = useState({
    invoices: [],
    services: []
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

      if (search && activeTab === 'invoices') {
        const isInvoiceNum = search.toUpperCase().startsWith('INV-');
        res = await searchInvoices({ 
          ...params, 
          [isInvoiceNum ? 'invoiceNumber' : 'patientId']: search 
        });
      } else {
        switch (activeTab) {
          case 'invoices':
            res = await getInvoices(params);
            break;
          case 'services':
            res = await getServiceCharges(params);
            break;
        }
      }

      const content = extractArray(res);
      const d = res?.data?.data || res?.data;
      
      setData(prev => ({
        ...prev,
        [activeTab]: content
      }));

      if (d?.pageable || d?.totalPages) {
        setPagination({
          page: d.number || 0,
          size: d.size || 10,
          totalElements: d.totalElements || content.length,
          totalPages: d.totalPages || 1
        });
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === 'invoices') {
        fetchData(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedItem.patientId) {
        toast({ title: 'Error', description: 'Patient ID is required', variant: 'destructive' });
        return;
      }
      
      const res = await createInvoice(selectedItem, { 
        patientId: selectedItem.patientId,
        admissionId: selectedItem.admissionId 
      });
      
      if (res.ok) {
        toast({ title: 'Success', description: 'Invoice created successfully' });
        setShowModal(null);
        fetchData(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create invoice', variant: 'destructive' });
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createServiceCharge(selectedItem);
      if (res.ok) {
        toast({ title: 'Success', description: 'Service charge created successfully' });
        setShowModal(null);
        fetchData(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create service charge', variant: 'destructive' });
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateServiceCharge(selectedItem.id, selectedItem);
      if (res.ok) {
        toast({ title: 'Success', description: 'Service charge updated successfully' });
        setShowModal(null);
        fetchData(pagination.page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update service charge', variant: 'destructive' });
    }
  };

  const handleDeleteService = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this service charge?')) return;
    try {
      const res = await deleteServiceCharge(id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Service charge deleted successfully' });
        fetchData(pagination.page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service charge', variant: 'destructive' });
    }
  };

  const handleCancelInvoice = async (id: string | number) => {
    try {
      const res = await cancelInvoice(id);
      if (res.ok) {
        toast({ title: 'Success', description: 'Invoice cancelled successfully' });
        setShowModal(null);
        fetchData(pagination.page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel invoice', variant: 'destructive' });
    }
  };

  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedItem.paymentAmount || isNaN(Number(selectedItem.paymentAmount))) {
        toast({ title: 'Error', description: 'Please enter a valid amount', variant: 'destructive' });
        return;
      }
      
      const res = await updateInvoicePayment(selectedItem.id, { 
        amount: Number(selectedItem.paymentAmount), 
        method: selectedItem.paymentMethod || 'CASH' 
      });
      
      if (res.ok) {
        toast({ title: 'Success', description: 'Payment updated successfully' });
        setShowModal(null);
        fetchData(pagination.page);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update payment', variant: 'destructive' });
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
          <button className="hms-btn-primary flex items-center gap-1" onClick={() => {
            if (activeTab === 'invoices') {
              setSelectedItem({ invoiceNumber: `INV-${Date.now()}`, invoiceDate: new Date().toISOString().slice(0, 10), patientId: '', items: [], netAmount: 0 });
              setShowModal('create-invoice');
            } else {
              setSelectedItem({ name: '', category: 'Consultation', charge: 0, taxPercentage: 0, active: true });
              setShowModal('create-service');
            }
          }}>
            <Plus size={14} /> New {activeTab === 'invoices' ? 'Invoice' : 'Service Charge'}
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
                            <button title="View Details" onClick={async () => {
                              try {
                                setLoading(true);
                                const res = await getInvoiceById(inv.id);
                                const obj = extractObject(res);
                                if (obj) {
                                  setSelectedItem(obj);
                                  setShowModal('view-invoice');
                                }
                              } finally {
                                setLoading(false);
                              }
                            }}><Eye size={14} /></button>
                            <button title="Update Payment" onClick={() => {
                              setSelectedItem({ ...inv, paymentAmount: inv.dueAmount, paymentMethod: 'CASH' });
                              setShowModal('update-payment');
                            }} className="text-hms-success"><CheckCircle2 size={14} /></button>
                            <button title="Cancel Invoice" onClick={() => {
                              setSelectedItem(inv);
                              setShowModal('cancel-confirm');
                            }} className="text-destructive"><X size={14} /></button>
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
                        <td>
                          <div className="flex gap-2">
                            <button className="text-primary" onClick={() => {
                              setSelectedItem(s);
                              setShowModal('edit-service');
                            }}><Edit2 size={14} /></button>
                            <button className="text-destructive" onClick={() => handleDeleteService(s.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <Pagination />
          </>
        )}
      </div>

      {/* Modals */}
      {showModal === 'view-invoice' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Receipt size={16} className="text-primary" /> Invoice Details: {selectedItem.invoiceNumber}</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Patient Info</label>
                  <p className="text-sm font-bold">{selectedItem.patient?.fullName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{selectedItem.patient?.uhid}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Billing Date</label>
                  <p className="text-sm font-semibold">{new Date(selectedItem.invoiceDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Payment Status</label>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusColor(selectedItem.status)}`}>
                    {selectedItem.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="border border-border rounded-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="p-2 font-bold uppercase text-[10px]">Description</th>
                      <th className="p-2 font-bold uppercase text-[10px] text-right">Qty</th>
                      <th className="p-2 font-bold uppercase text-[10px] text-right">Price</th>
                      <th className="p-2 font-bold uppercase text-[10px] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="p-2">{item.serviceName}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">₹{item.unitPrice?.toLocaleString()}</td>
                        <td className="p-2 text-right font-semibold">₹{item.totalPrice?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-bold text-[10px]">Subtotal</span>
                    <span className="font-semibold">₹{selectedItem.grossAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground uppercase font-bold text-[10px]">Discount</span>
                    <span className="text-destructive font-semibold">-₹{selectedItem.discountAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-border">
                    <span className="font-bold uppercase text-[10px]">Total Amount</span>
                    <span className="font-bold text-lg text-primary">₹{selectedItem.netAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/10 flex justify-end gap-2">
              <button className="hms-btn-secondary" onClick={() => setShowModal(null)}>Close</button>
              <button className="hms-btn-primary flex items-center gap-2"><Printer size={14} /> Print Invoice</button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'update-payment' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><CreditCard size={16} className="text-primary" /> Update Invoice Payment</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdatePayment} className="p-4 space-y-4">
              <div className="bg-muted/30 p-3 rounded-sm border border-border/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Invoice Number</span>
                  <span className="text-xs font-mono font-bold">{selectedItem.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Pending Balance</span>
                  <span className="text-sm font-bold text-destructive">₹{selectedItem.dueAmount?.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Payment Amount (₹)</label>
                <input 
                  type="number" 
                  className="hms-input w-full font-bold text-lg" 
                  required 
                  max={selectedItem.dueAmount}
                  value={selectedItem.paymentAmount} 
                  onChange={e => setSelectedItem({...selectedItem, paymentAmount: e.target.value})} 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Payment Method</label>
                <select 
                  className="hms-select w-full" 
                  value={selectedItem.paymentMethod} 
                  onChange={e => setSelectedItem({...selectedItem, paymentMethod: e.target.value})}
                >
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD / POS</option>
                  <option value="UPI">UPI / QR CODE</option>
                  <option value="NET_BANKING">NET BANKING</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'cancel-confirm' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-sm shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-destructive/10">
              <h3 className="text-sm font-bold flex items-center gap-2 text-destructive"><Trash2 size={16} /> Cancel Invoice</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground">Are you sure you want to cancel invoice <span className="font-mono font-bold text-foreground">{selectedItem.invoiceNumber}</span>? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>No, Keep it</button>
                <button className="hms-btn-primary !bg-destructive flex-1" onClick={() => handleCancelInvoice(selectedItem.id)}>Yes, Cancel Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'create-invoice' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Create New Invoice</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateInvoice} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Invoice Number</label>
                  <input className="hms-input w-full" required value={selectedItem.invoiceNumber} readOnly />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Date</label>
                  <input type="date" className="hms-input w-full" required value={selectedItem.invoiceDate} onChange={e => setSelectedItem({...selectedItem, invoiceDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Patient ID</label>
                  <input className="hms-input w-full" required placeholder="UHID" value={selectedItem.patientId} onChange={e => setSelectedItem({...selectedItem, patientId: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Admission ID (Opt)</label>
                  <input className="hms-input w-full" placeholder="For IPD" value={selectedItem.admissionId} onChange={e => setSelectedItem({...selectedItem, admissionId: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Net Amount (₹)</label>
                <input type="number" className="hms-input w-full font-bold" required value={selectedItem.netAmount} onChange={e => setSelectedItem({...selectedItem, netAmount: Number(e.target.value)})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'create-service' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Plus size={16} className="text-primary" /> Add Service Charge</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateService} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Name</label>
                <input className="hms-input w-full" required placeholder="e.g. Consultation Fee" value={selectedItem.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
                  <select className="hms-select w-full" value={selectedItem.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}>
                    <option value="Consultation">Consultation</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Ward">Ward</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Charge (₹)</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem.charge} onChange={e => setSelectedItem({...selectedItem, charge: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Add Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'edit-service' && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Edit2 size={16} className="text-primary" /> Edit Service Charge</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateService} className="p-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Service Name</label>
                <input className="hms-input w-full" required placeholder="e.g. Consultation Fee" value={selectedItem.name} onChange={e => setSelectedItem({...selectedItem, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
                  <select className="hms-select w-full" value={selectedItem.category} onChange={e => setSelectedItem({...selectedItem, category: e.target.value})}>
                    <option value="Consultation">Consultation</option>
                    <option value="Lab Test">Lab Test</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Ward">Ward</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Charge (₹)</label>
                  <input type="number" className="hms-input w-full" required value={selectedItem.charge} onChange={e => setSelectedItem({...selectedItem, charge: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Status</label>
                <select className="hms-select w-full" value={selectedItem.active ? 'true' : 'false'} onChange={e => setSelectedItem({...selectedItem, active: e.target.value === 'true'})}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1">Update Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
