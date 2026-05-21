import React, { useState, useEffect } from 'react';
import { FlaskConical, Search, RefreshCw, Filter, Download, Calendar, Printer, Eye, Microscope } from 'lucide-react';
import { apiRequest, extractArray, getInvestigations } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const Investigations = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getInvestigations();
      if (res.ok) {
        setOrders(extractArray(res));
      } else {
        // Fallback search
        const searchRes = await apiRequest('/api/v1/diagnostics/lab/orders/search');
        if (searchRes.ok) setOrders(extractArray(searchRes));
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch investigation orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical size={16} /> Diagnostic Investigations
        </div>
        <div className="flex gap-2">
          <button onClick={fetchOrders} className="p-1.5 hover:bg-muted rounded text-primary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-primary py-1 px-3 text-[10px] flex items-center gap-1">
            <Microscope size={12} /> New Lab Order
          </button>
        </div>
      </div>

      <div className="bg-card border border-border p-3 rounded flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by Patient, UHID or Test Name..." 
            className="hms-input pl-8 py-1.5 w-full text-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Status:</label>
          <select className="hms-input py-1 text-xs">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <button className="hms-btn-secondary py-1.5 px-4 text-xs flex items-center gap-1">
          <Filter size={12} /> Filters
        </button>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="hms-table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>UHID</th>
              <th>Patient Name</th>
              <th>Tests Requested</th>
              <th>Ordering Doctor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="font-mono text-[10px]">{o.id}</td>
                <td>{o.uhid}</td>
                <td className="font-bold">{o.patientName}</td>
                <td className="max-w-[250px] truncate">{o.tests}</td>
                <td>{o.doctor}</td>
                <td className="text-[10px]">{o.date}</td>
                <td>
                  <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase
                    ${o.status === 'Completed' ? 'bg-hms-success/10 text-hms-success' : 'bg-yellow-500/10 text-yellow-600'}`}>
                    {o.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-muted rounded text-primary" title="View Results"><Eye size={12} /></button>
                    <button className="p-1 hover:bg-muted rounded text-primary" title="Print Report"><Printer size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Investigations;
