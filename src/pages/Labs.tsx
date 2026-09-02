import React, { useState, useEffect } from 'react';
import { 
  Calendar, Search, Plus, Edit, Trash2, Clock, CheckCircle2, 
  XCircle, User, UserPlus, Filter, RefreshCw, MoreVertical,
  CalendarDays, MapPin, Phone, AlertCircle, FileText, Printer,
  ChevronRight, ArrowRight, Check, X, Eye
} from 'lucide-react';
import { 
  extractArray, getLabs, 
  getApiV1DiagnosticsLab, getApiV1DiagnosticsLabByid, putApiV1DiagnosticsLabByid, deleteApiV1DiagnosticsLabByid,
  getApiV1DiagnosticsLabSearch, postApiV1DiagnosticsLabSampleByorderId, postApiV1DiagnosticsLabResultByorderId
} from "@/api/apiService";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Labs = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  
  // Detail State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<any>(null);

  const fetchLabs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getApiV1DiagnosticsLab({ page, limit: pagination.limit });
      if (res.ok) {
        // Handle nested data.data.content or data.content or samples/orders
        const d = res.data?.data || res.data;
        const content = d?.content || d?.samples || d?.orders || extractArray(res);
        setResults(content);
        
        const total = d?.totalElements ?? d?.total ?? 0;
        setPagination(prev => ({ ...prev, page, total }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: string | number) => {
    setLoading(true);
    try {
      const res = await getApiV1DiagnosticsLabByid(id);
      if (res.ok && res.data) {
        // Correctly access data from the response structure
        const detailData = res.data?.data || res.data;
        setSelectedLab(detailData);
        setIsDetailOpen(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await getApiV1DiagnosticsLabSearch({ 
        page: 1, 
        limit: pagination.limit 
      });
      if (res.ok) {
        const d = res.data?.data || res.data;
        const content = d?.content || d?.samples || d?.orders || extractArray(res);
        setResults(content);
        const total = d?.totalElements ?? d?.total ?? 0;
        setPagination(prev => ({ ...prev, page: 1, total }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <span>Laboratory Management</span>
        <button onClick={() => fetchLabs()} className="p-1 hover:bg-muted rounded text-primary">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3 text-xs">
        <label className="hms-form-label">Date:</label><input type="date" className="hms-input" defaultValue="2026-02-15" />
        <label className="hms-form-label">Department:</label><select className="hms-select"><option>All</option><option>Pathology</option><option>Biochemistry</option><option>Radiology</option><option>Microbiology</option></select>
        <label className="hms-form-label">Status:</label><select className="hms-select"><option>All</option><option>ORDERED</option><option>PROCESSING</option><option>COMPLETED</option></select>
        <button onClick={() => handleSearch()} className="hms-btn-primary">Search</button>
      </div>
      <table className="hms-table">
        <thead>
          <tr className="bg-[#cc0000] text-white">
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">S.No.</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Order No.</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">UHID</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Patient Name</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Test Name</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Sample</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Department</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Order Time</th>
            <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Status</th>
            <th className="text-white font-semibold py-1 px-2 text-left text-[11px]">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[11px]">
          {loading ? (
            <tr><td colSpan={10} className="text-center py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold uppercase text-[10px]">Loading Laboratory Data...</span>
              </div>
            </td></tr>
          ) : results.length > 0 ? (
            results.map((l, i) => (
              <tr key={l.id || i} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-1 px-2 border-r border-border">{(pagination.page - 1) * pagination.limit + i + 1}</td>
                <td className="py-1 px-2 border-r border-border font-bold text-primary">{l.orderNumber || l.id}</td>
                <td className="py-1 px-2 border-r border-border">{l.patient?.uhid || l.uhid || 'N/A'}</td>
                <td className="py-1 px-2 border-r border-border font-semibold uppercase">{l.patient?.fullName || l.patientName || l.name}</td>
                <td className="py-1 px-2 border-r border-border">
                  <div className="flex flex-col">
                    <span className="font-bold">{l.testName || l.test}</span>
                    <span className="text-[9px] text-muted-foreground uppercase">{l.testCode}</span>
                  </div>
                </td>
                <td className="py-1 px-2 border-r border-border uppercase">{l.sampleType || '-'}</td>
                <td className="py-1 px-2 border-r border-border">{l.department?.name || l.department || '-'}</td>
                <td className="py-1 px-2 border-r border-border">
                  <div className="flex flex-col">
                    <span>{l.orderTime ? new Date(l.orderTime).toLocaleDateString() : '-'}</span>
                    <span className="text-[9px] text-muted-foreground">{l.orderTime ? new Date(l.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                </td>
                <td className="py-1 px-2 border-r border-border">
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    l.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                    l.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="py-0.5 px-2">
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleViewDetail(l.id)}
                      className="w-5 h-5 flex items-center justify-center bg-[#ff0000] text-white rounded-sm shadow-sm hover:bg-[#cc0000] transition-colors" 
                      title="View Details"
                    >
                      <Eye size={10} />
                    </button>
                    <button className="w-5 h-5 flex items-center justify-center bg-[#28a745] text-white rounded-sm shadow-sm" title="Print"><Printer size={10} /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={10} className="py-12 text-center text-muted-foreground italic">No laboratory results found</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="bg-muted/30 p-2 flex items-center justify-between border-t border-border text-[10px] font-bold">
        <div className="text-muted-foreground uppercase">Total Records: {pagination.total}</div>
        <div className="flex gap-2">
          <button 
            disabled={pagination.page <= 1} 
            onClick={() => fetchLabs(pagination.page - 1)}
            className="px-3 py-1 bg-card border border-border disabled:opacity-50 hover:bg-primary hover:text-white transition-colors"
          >
            Previous
          </button>
          <span className="flex items-center px-4 bg-primary/10 text-primary rounded-sm">Page {pagination.page}</span>
          <button 
            disabled={pagination.page * pagination.limit >= pagination.total} 
            onClick={() => fetchLabs(pagination.page + 1)}
            className="px-3 py-1 bg-card border border-border disabled:opacity-50 hover:bg-primary hover:text-white transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] text-[12px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold border-b pb-2">Lab Test Details: {selectedLab?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedLab && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 border-r pr-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-bold">{selectedLab.patient?.fullName || selectedLab.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UHID:</span>
                  <span className="font-mono">{selectedLab.patient?.uhid || selectedLab.uhid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Test Name:</span>
                  <span className="font-bold text-primary">{selectedLab.testName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-blue-600">{selectedLab.status}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sample Type:</span>
                  <span className="font-bold uppercase">{selectedLab.sampleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Time:</span>
                  <span>{selectedLab.orderTime ? new Date(selectedLab.orderTime).toLocaleString() : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Result Time:</span>
                  <span>{selectedLab.resultTime ? new Date(selectedLab.resultTime).toLocaleString() : 'Pending'}</span>
                </div>
              </div>
              <div className="col-span-2 border-t pt-4 mt-2">
                <div className="font-bold mb-1">Result / Findings:</div>
                <div className="bg-muted/30 p-3 rounded border font-mono text-[11px] whitespace-pre-wrap">
                  {selectedLab.result || 'Results are still being processed...'}
                </div>
              </div>
              <div className="col-span-2">
                <div className="font-bold mb-1">Remarks:</div>
                <div className="bg-muted/30 p-2 rounded border text-[11px]">
                  {selectedLab.remarks || '-'}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Labs;
