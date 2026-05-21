import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, Download, Calendar, DollarSign, UserCheck, ClipboardList } from 'lucide-react';
import { apiRequest, extractArray } from '@/api/apiService';
import { useToast } from '@/components/ui/use-toast';

const subModules = ['Daycare Dues', 'Daycare Bill', 'Daycare Collection', 'Inves Dues', 'Inves Bill', 'Inves Collection', 'OPD Coll/Dues', 'Birth Reg', 'Followup', 'Follow Manual', 'UHID Update', 'OPD Prescription', 'App', 'Inv Consolidated', 'OPD Claim', 'DayCare Claim', 'Inv. Claim'];

const DayCare = () => {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState('Daycare Dues');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchDaycareData = async () => {
    setLoading(true);
    try {
      // Mapping daycare to clinical/billing endpoints
      const res = await apiRequest('/api/v1/billing/invoices/search', {
        queryParams: { type: 'DAYCARE' }
      });
      
      if (res.ok) {
        setData(extractArray(res));
      } else {
        // Mock fallback
        setData([
          { id: 'DC-101', uhid: 'U-201', patientName: 'Mr. Rajan Patel', doctor: 'Dr. Alok Mehta', tpa: '-', total: 5000, paid: 3000, discount: 0, due: 2000, date: '15-Feb-2026' },
          { id: 'DC-102', uhid: 'U-202', patientName: 'Mrs. Savita Kumari', doctor: 'Dr. Priya Singh', tpa: 'CGHS', total: 8000, paid: 8000, discount: 500, due: 0, date: '14-Feb-2026' },
        ]);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load daycare records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaycareData();
  }, [activeModule]);

  return (
    <div className="space-y-3">
      {/* Sub modules grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-1 mb-3">
        {subModules.map(m => (
          <button 
            key={m} 
            onClick={() => setActiveModule(m)} 
            className={`px-1 py-2 text-[9px] font-bold uppercase tracking-tighter text-center border transition-colors
              ${activeModule === m 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} /> {activeModule} Report
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDaycareData} className="p-1 hover:bg-muted rounded text-primary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-card border border-border p-3 mb-2 flex flex-wrap items-center gap-4 shadow-sm rounded">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">From:</label>
          <input type="date" className="hms-input py-1 text-xs" defaultValue="2026-02-15" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">To:</label>
          <input type="date" className="hms-input py-1 text-xs" defaultValue="2026-02-15" />
        </div>
        <div className="flex gap-2">
          <button className="hms-btn-primary py-1 px-4 text-xs font-bold uppercase">Submit</button>
          <button className="hms-btn-secondary py-1 px-4 text-xs font-bold uppercase">Reset</button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex gap-1">
          {['Copy', 'CSV', 'PDF', 'Print'].map((b, i) => (
            <button key={i} className="hms-btn-secondary text-[9px] font-bold uppercase px-3 py-1 border border-border">{b}</button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">Search:</label>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              className="hms-input pl-7 py-1 w-48 text-xs" 
              placeholder="Search records..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="hms-table w-full">
          <thead>
            <tr>
              <th>Bill No.</th>
              <th>UHID</th>
              <th>Patient Name</th>
              <th>Doctor</th>
              <th>TPA/Panel</th>
              <th>Total (Rs)</th>
              <th>Submitted</th>
              <th>Discount</th>
              <th>Due</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td className="font-mono text-[10px]">{d.id || d.billNo}</td>
                <td>{d.uhid}</td>
                <td className="font-bold">{d.patientName}</td>
                <td>{d.doctor}</td>
                <td>{d.tpa}</td>
                <td className="font-bold text-primary">₹{d.total}</td>
                <td className="text-green-600">₹{d.paid || d.submitted}</td>
                <td className="text-destructive">₹{d.discount}</td>
                <td className="font-bold bg-destructive/5 text-destructive">₹{d.due}</td>
                <td className="text-[10px]">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && !loading && (
          <div className="py-12 text-center text-muted-foreground text-xs italic">
            No daycare records found for this period.
          </div>
        )}
      </div>
    </div>
  );
};

export default DayCare;
