import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, Eye, Edit, Printer, RefreshCw, Filter, Clock, User, ClipboardList } from 'lucide-react';
import { apiRequest, extractArray, getEHR } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const EHR = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getEHR();
      if (res.ok) {
        setRecords(extractArray(res));
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch EMR records', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={16} /> Electronic Health Records (EHR)
        </div>
        <div className="flex gap-2">
          <button onClick={fetchRecords} className="p-1.5 hover:bg-muted rounded text-primary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-primary py-1 px-3 text-[10px] flex items-center gap-1">
            <Plus size={12} /> New EMR Entry
          </button>
        </div>
      </div>

      <div className="bg-card border border-border p-3 rounded flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by UHID, Patient Name, or Doctor..." 
            className="hms-input pl-8 py-1.5 w-full text-xs"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="hms-btn-secondary py-1.5 px-4 text-xs flex items-center gap-1">
          <Filter size={12} /> Filters
        </button>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="hms-table w-full">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>Patient</th>
              <th>UHID</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Primary Diagnosis</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-[10px]">{r.id}</td>
                <td className="font-bold">{r.patientName}</td>
                <td>{r.uhid}</td>
                <td>{r.date}</td>
                <td>{r.doctor}</td>
                <td className="max-w-[200px] truncate">{r.diagnosis}</td>
                <td>
                  <span className={`px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase
                    ${r.status === 'Finalized' ? 'bg-hms-success/10 text-hms-success' : 'bg-yellow-500/10 text-yellow-600'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-muted rounded text-primary" title="View"><Eye size={12} /></button>
                    <button className="p-1 hover:bg-muted rounded text-primary" title="Edit"><Edit size={12} /></button>
                    <button className="p-1 hover:bg-muted rounded text-primary" title="Print"><Printer size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && !loading && (
          <div className="py-12 text-center text-muted-foreground text-xs italic">
            No EMR records found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default EHR;
