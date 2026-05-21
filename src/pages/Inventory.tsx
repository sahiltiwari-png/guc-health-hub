import React, { useState, useEffect } from 'react';
import { 
  Warehouse, Package, Truck, AlertTriangle, TrendingUp, Search, 
  Plus, Edit, Trash2, Download, RefreshCw, Layers, ShoppingCart, 
  UserCheck, Receipt, Clock, BarChart3, ChevronDown, Filter
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiRequest, extractArray, getAutoAssetsMasters, getGRNs, getInventory, getPharmacySuppliers, getPurchaseOrders, getStockAdjustments, getStockTransfers } from "@/api/apiService";

type Tab = 'dashboard' | 'stock' | 'po' | 'grn' | 'suppliers' | 'adjustments' | 'transfers';

const Inventory = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    stock: [],
    po: [],
    grn: [],
    suppliers: [],
    adjustments: [],
    transfers: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockRes, poRes, grnRes, supRes, invRes] = await Promise.all([
        getAutoAssetsMasters(),
        getPurchaseOrders(),
        getGRNs(),
        getPharmacySuppliers(),
        getInventory()
      ]);

      setData({
        stock: extractArray(invRes).length > 0 ? extractArray(invRes) : extractArray(stockRes),
        po: extractArray(poRes),
        grn: extractArray(grnRes),
        suppliers: extractArray(supRes),
        adjustments: [],
        transfers: []
      });
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({ title: 'Error', description: 'Failed to load inventory data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center gap-2">
        <Warehouse size={16} /> Inventory & Supply Chain Management
      </div>

      <div className="flex gap-0 border-b border-border overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'stock', label: 'Current Stock', icon: Package },
          { id: 'po', label: 'Purchase Orders', icon: ShoppingCart },
          { id: 'grn', label: 'GRN (Receipts)', icon: Receipt },
          { id: 'suppliers', label: 'Suppliers', icon: UserCheck },
          { id: 'adjustments', label: 'Stock Adjust', icon: Filter },
          { id: 'transfers', label: 'Transfers', icon: Truck },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-tight flex items-center gap-1 border-b-2 transition-colors
              ${activeTab === t.id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'}`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-3 space-y-3">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Items', value: '1,284', icon: Package, color: 'text-primary' },
                { label: 'Low Stock', value: '18', icon: AlertTriangle, color: 'text-destructive' },
                { label: 'Active POs', value: '12', icon: ShoppingCart, color: 'text-hms-info' },
                { label: 'Suppliers', value: '45', icon: UserCheck, color: 'text-hms-success' },
              ].map((k, i) => (
                <div key={i} className="bg-card border border-border p-3 shadow-sm rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{k.label}</span>
                    <k.icon size={14} className={k.color} />
                  </div>
                  <div className="text-xl font-bold">{k.value}</div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-card border border-border shadow-sm rounded">
            <div className="p-2 border-b border-border flex justify-between items-center bg-muted/20">
              <span className="text-xs font-bold uppercase tracking-wider">{activeTab} Details</span>
              <div className="flex gap-2">
                <button onClick={fetchData} className="p-1 hover:bg-muted rounded text-primary">
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
                <button className="hms-btn-primary py-1 px-3 text-[10px] flex items-center gap-1">
                  <Plus size={12} /> Add New
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-xs italic">
                  Syncing with inventory database...
                </div>
              ) : (
                <table className="hms-table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name/Description</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data[activeTab] || []).length > 0 ? (
                      data[activeTab].map((item: any) => (
                        <tr key={item.id}>
                          <td className="font-mono text-[10px]">{item.id}</td>
                          <td className="font-bold">{item.name || item.itemName}</td>
                          <td>{item.category || 'General'}</td>
                          <td className="font-bold">{item.quantity || item.qty || 0}</td>
                          <td>
                            <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase
                              ${(item.quantity || 0) < 10 ? 'bg-destructive/10 text-destructive' : 'bg-hms-success/10 text-hms-success'}`}>
                              {(item.quantity || 0) < 10 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-1">
                              <button className="p-1 hover:bg-muted rounded text-primary"><Edit size={12} /></button>
                              <button className="p-1 hover:bg-muted rounded text-destructive"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground text-xs italic">
                          No {activeTab} records found in this branch.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border border-border p-3 rounded shadow-sm">
            <h3 className="text-[10px] font-bold uppercase mb-2 text-primary border-b border-primary/10 pb-1 flex items-center gap-1">
              <Clock size={12} /> Recent Activity
            </h3>
            <div className="space-y-2">
              {[
                { time: '10:15 AM', msg: 'PO-2024-081 approved', type: 'info' },
                { time: '09:45 AM', msg: 'Paracetamol stock critical', type: 'error' },
                { time: '09:20 AM', msg: 'New GRN from Sun Pharma', type: 'success' },
                { time: '08:50 AM', msg: 'Stock transfer to Noida complete', type: 'info' },
              ].map((a, i) => (
                <div key={i} className="text-[10px] flex gap-2 border-b border-muted/50 pb-1 last:border-0">
                  <span className="text-muted-foreground font-mono">{a.time}</span>
                  <span className="font-medium">{a.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border p-3 rounded shadow-sm">
            <h3 className="text-[10px] font-bold uppercase mb-2 text-destructive border-b border-destructive/10 pb-1 flex items-center gap-1">
              <AlertTriangle size={12} /> Expiring Soon
            </h3>
            <div className="space-y-2">
              {[
                { item: 'Ceftriaxone 1g', date: '2024-06-15', qty: '450' },
                { item: 'Amoxicillin 500mg', date: '2024-06-20', qty: '120' },
                { item: 'Insulin Glargine', date: '2024-07-01', qty: '15' },
              ].map((e, i) => (
                <div key={i} className="text-[10px] flex justify-between items-center bg-muted/30 p-1.5 border-l-2 border-destructive">
                  <div>
                    <div className="font-bold">{e.item}</div>
                    <div className="text-muted-foreground italic">Exp: {e.date}</div>
                  </div>
                  <div className="font-bold text-destructive">{e.qty}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
