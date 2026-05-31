import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getApiV1HrLeaves, 
  postApiV1HrLeaves, 
  putApiV1HrLeavesByidStatus, 
  extractArray 
} from "@/api/apiService";

type Tab = 'my-leaves' | 'requests';

const Leave = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('my-leaves');
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    leaveType: 'SICK',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: ''
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (targetPage = page) => {
    setLoading(true);
    try {
      // Use the generic HR leaves API which is paginated
      const res = await getApiV1HrLeaves({ page: targetPage, size });
      
      if (res.ok) {
        const data = res.data?.data || res.data;
        const content = extractArray(res);
        setTotalPages(data?.totalPages || 1);
        
        // For simplicity in this view, we split based on tab if needed, 
        // but typically 'requests' would be all leaves for an admin
        if (tab === 'my-leaves') {
          setLeaves(content);
        } else {
          setRequests(content);
        }
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast({ title: 'Error', description: 'Failed to fetch leaves', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchData(0);
  }, [tab]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postApiV1HrLeaves(formData);
      if (res.ok) {
        toast({ title: 'Success', description: 'Leave application submitted' });
        setShowModal(null);
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Failed to submit');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessLeave = async (id: string, status: string) => {
    setLoading(true);
    try {
      const res = await putApiV1HrLeavesByidStatus(id, { status });
      if (res.ok) {
        toast({ title: 'Success', description: `Leave ${status.toLowerCase()} successfully` });
        fetchData();
      } else {
        throw new Error(res.data?.message || 'Failed to update status');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderPagination = () => (
    <div className="flex justify-between items-center mt-4 px-2">
      <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {page + 1} of {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={page === 0 || loading} onClick={() => { setPage(p => p - 1); fetchData(page - 1); }} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Previous</button>
        <button disabled={page >= totalPages - 1 || loading} onClick={() => { setPage(p => p + 1); fetchData(page + 1); }} className="hms-btn-secondary py-1 px-3 text-[10px] disabled:opacity-50">Next</button>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Leaves', value: leaves.length, icon: Calendar, color: 'text-primary' },
    { label: 'Pending Requests', value: leaves.filter(l => l.status === 'Pending').length, icon: Clock, color: 'text-hms-warning' },
    { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length, icon: CheckCircle, color: 'text-hms-success' },
    { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Calendar size={16} /> Leave Management</div>
        <div className="flex items-center gap-2">
          <button className="hms-btn-primary flex items-center gap-1 h-8 text-[10px] font-bold uppercase" onClick={() => setShowModal('apply')}>
            <Plus size={14} /> Apply Leave
          </button>
          <button className="hms-btn-secondary h-8" onClick={fetchData}><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-card border border-border p-4 shadow-sm flex items-center gap-4 rounded-sm`}>
            <div className={`p-3 rounded-full bg-muted/50 ${s.color}`}><s.icon size={20} /></div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-border bg-card shadow-sm">
        {[
          { key: 'my-leaves', label: 'My Leave Applications' },
          { key: 'requests', label: 'Leave Requests to Approve' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${tab === t.key ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:bg-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border flex-1 overflow-auto shadow-sm">
        {tab === 'my-leaves' ? (
          <table className="hms-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Total Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l: any) => (
                <tr key={l.id}>
                  <td className="font-bold text-primary">{l.leaveType}</td>
                  <td className="text-xs">{new Date(l.startDate).toLocaleDateString()}</td>
                  <td className="text-xs">{new Date(l.endDate).toLocaleDateString()}</td>
                  <td className="font-bold">{l.totalDays} Days</td>
                  <td className="max-w-[200px] truncate" title={l.reason}>{l.reason}</td>
                  <td>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                      l.status === 'APPROVED' || l.status === 'Approved' ? 'bg-hms-success/10 text-hms-success' :
                      l.status === 'PENDING' || l.status === 'Pending' ? 'bg-hms-warning/10 text-hms-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="text-[10px] text-muted-foreground">{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td className="text-[10px] italic text-muted-foreground">{l.comment || '-'}</td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-muted-foreground italic text-sm">No leave applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="hms-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id}>
                  <td>
                    <div className="font-bold text-sm">{r.employee?.user?.fullName}</div>
                    <div className="text-[10px] text-muted-foreground">ID: {r.employee?.employeeCode}</div>
                  </td>
                  <td className="font-bold text-primary uppercase text-[10px]">{r.leaveType}</td>
                  <td className="text-[10px]">
                    <div className="flex flex-col">
                      <span>{new Date(r.startDate).toLocaleDateString()}</span>
                      <span className="text-muted-foreground">to {new Date(r.endDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="font-bold">{r.totalDays}</td>
                  <td className="max-w-[200px] truncate" title={r.reason}>{r.reason}</td>
                  <td className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    {r.status === 'PENDING' || r.status === 'Pending' ? (
                      <div className="flex gap-1">
                        <button className="hms-btn-success p-1 px-2 text-[10px] font-bold uppercase flex items-center gap-1 bg-hms-success text-hms-success-foreground" onClick={() => handleProcessLeave(r.id, 'APPROVED')}>
                          <CheckCircle size={12} /> Appr.
                        </button>
                        <button className="hms-btn-destructive p-1 px-2 text-[10px] font-bold uppercase flex items-center gap-1 bg-destructive text-destructive-foreground" onClick={() => handleProcessLeave(r.id, 'REJECTED')}>
                          <XCircle size={12} /> Rej.
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${
                        r.status === 'APPROVED' || r.status === 'Approved' ? 'bg-hms-success/10 text-hms-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {r.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground italic text-sm">No pending leave requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {renderPagination()}

      {/* Apply Modal */}
      {showModal === 'apply' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-sm font-bold flex items-center gap-2"><Calendar size={16} className="text-primary" /> Apply for Leave</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleApplyLeave} className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Leave Type</label>
                  <select className="hms-select w-full" value={formData.leaveType} onChange={e => setFormData({...formData, leaveType: e.target.value})}>
                    <option value="Sick">Sick Leave</option>
                    <option value="Casual">Casual Leave</option>
                    <option value="Earned">Earned Leave</option>
                    <option value="Maternity">Maternity Leave</option>
                    <option value="Paternity">Paternity Leave</option>
                    <option value="Loss-of-Pay">Loss-of-Pay</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Start Date</label>
                    <input type="date" required className="hms-input w-full" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">End Date</label>
                    <input type="date" required className="hms-input w-full" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Reason for Leave</label>
                  <textarea required className="hms-input w-full min-h-[100px] py-2" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Describe your reason..."></textarea>
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Attachments (Optional)</label>
                   <div className="border-2 border-dashed border-border p-4 text-center rounded bg-muted/20">
                      <FileText className="mx-auto text-muted-foreground mb-2" size={24} />
                      <p className="text-[10px] text-muted-foreground">Click or drag files to upload medical certificates or documents</p>
                   </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1" disabled={loading}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
