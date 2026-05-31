import React, { useState, useEffect } from 'react';
import { Headphones, Eye, Edit, MessageSquare, Clock, CheckCircle, AlertTriangle, XCircle, RefreshCw, Plus, X, User, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { 
  extractArray, 
  getApiV1HelpdeskDashboard, 
  getApiV1HelpdeskTickets, 
  postApiV1HelpdeskTickets, 
  getApiV1HelpdeskTicketsByid,
  putApiV1HelpdeskTicketsByidStatus,
  putApiV1HelpdeskTicketsByidAssign,
  getStaff
} from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const StatusBadge = ({ status }: { status: string }) => {
  const c: Record<string, string> = { 
    'OPEN': 'bg-blue-700 text-white', 
    'IN_PROGRESS': 'bg-yellow-600 text-white', 
    'RESOLVED': 'bg-green-700 text-white', 
    'CLOSED': 'bg-muted text-foreground', 
    'ESCALATED': 'bg-red-700 text-white', 
    'HIGH': 'bg-red-700 text-white', 
    'MEDIUM': 'bg-yellow-600 text-white', 
    'LOW': 'bg-green-700 text-white', 
    'CRITICAL': 'bg-red-900 text-white', 
    'OVERDUE': 'bg-red-700 text-white', 
    'WITHIN_SLA': 'bg-green-700 text-white' 
  };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${c[status] || 'bg-muted text-foreground'}`}>{status.replace('_', ' ')}</span>;
};

const HelpDesk = () => {
  const { toast } = useToast();
  const tabs = ['Dashboard', 'Tickets'];
  const [tab, setTab] = useState('Dashboard');
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState<any[]>([]);

  // Filters & Pagination
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    page: 0,
    size: 10
  });
  const [totalPages, setTotalPages] = useState(0);

  // Modals
  const [showModal, setShowModal] = useState<'create' | 'view' | 'assign' | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    category: 'IT_SUPPORT'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'Dashboard') {
        const dRes = await getApiV1HelpdeskDashboard();
        if (dRes.ok) setDashboardData(dRes.data?.data || dRes.data);
      }
      
      const tRes = await getApiV1HelpdeskTickets({
        ...filters,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        category: filters.category || undefined
      });
      
      if (tRes.ok) {
        const data = tRes.data?.data || tRes.data;
        setTicketsList(data.content || []);
        setTotalPages(data.totalPages || 0);
      }

      const sRes = await getStaff({ size: 100 });
      if (sRes.ok) setStaffList(extractArray(sRes));

    } catch (e) { 
      console.error(e); 
      toast({ title: 'Error', description: 'Failed to sync with helpdesk server', variant: 'destructive' });
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [tab, filters.page, filters.status, filters.priority, filters.category]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await postApiV1HelpdeskTickets(newTicket);
      if (res.ok) {
        toast({ title: 'Success', description: 'Ticket raised successfully' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Failed to raise ticket', variant: 'destructive' }); }
  };

  const handleUpdateStatus = async (id: any, status: string) => {
    try {
      const res = await putApiV1HelpdeskTicketsByidStatus(id, { status });
      if (res.ok) {
        toast({ title: 'Success', description: `Ticket marked as ${status.replace('_', ' ')}` });
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Update failed', variant: 'destructive' }); }
  };

  const handleAssignTicket = async (id: any, userId: any) => {
    try {
      const res = await putApiV1HelpdeskTicketsByidAssign(id, { userId });
      if (res.ok) {
        toast({ title: 'Success', description: 'Ticket assigned successfully' });
        setShowModal(null);
        fetchData();
      }
    } catch (e) { toast({ title: 'Error', description: 'Assignment failed', variant: 'destructive' }); }
  };

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Headphones size={14} /> Help Desk & Ticketing System</div>
        <button onClick={fetchData} className="p-1 hover:bg-muted rounded text-primary">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto no-scrollbar">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div className="space-y-3 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { l: 'Open Tickets', v: dashboardData?.openTickets || 0, s: 'Action Required', c: 'text-blue-600' },
              { l: 'In Progress', v: dashboardData?.inProgressTickets || 0, s: 'Active Tasks', c: 'text-yellow-600' },
              { l: 'Resolved Today', v: dashboardData?.resolvedToday || 0, s: 'Completed', c: 'text-green-600' },
              { l: 'Overdue', v: dashboardData?.overdueTickets || 0, s: 'SLA Breached', c: 'text-red-600' },
              { l: 'Avg Resolution', v: dashboardData?.avgResolutionTime || '2.4h', s: 'Performance', c: 'text-purple-600' },
              { l: 'SLA Score', v: dashboardData?.slaScore || '94%', s: 'Compliance', c: 'text-emerald-600' }
            ].map((k, i) => (
              <div key={i} className="bg-card border border-border p-3 shadow-sm hover:border-primary/50 transition-colors">
                <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{k.l}</div>
                <div className={`text-xl font-black ${k.c}`}>{k.v}</div>
                <div className="text-[9px] text-muted-foreground font-medium">{k.s}</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="bg-card border border-border shadow-sm overflow-hidden">
              <div className="hms-section-header text-xs bg-muted/30">Category Distribution</div>
              <div className="p-0 overflow-x-auto">
                <table className="hms-table">
                  <thead><tr><th>Category</th><th>Total</th><th>Pending</th><th>Compliance</th></tr></thead>
                  <tbody>
                    {dashboardData?.categoryDistribution?.map((r: any, i: number) => (
                      <tr key={i}>
                        <td className="font-bold text-xs">{r.category?.replace('_', ' ')}</td>
                        <td>{r.total}</td>
                        <td className="text-destructive font-bold">{r.pending}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${r.compliance}%` }}></div>
                            </div>
                            <span className="text-[10px] font-bold">{r.compliance}%</span>
                          </div>
                        </td>
                      </tr>
                    )) || <tr><td colSpan={4} className="text-center py-8 text-muted-foreground italic">No category data available</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-card border border-border shadow-sm overflow-hidden">
              <div className="hms-section-header text-xs bg-muted/30">Recent High Priority Tickets</div>
              <div className="p-0 overflow-x-auto">
                <table className="hms-table">
                  <thead><tr><th>ID</th><th>Subject</th><th>Priority</th><th>Status</th></tr></thead>
                  <tbody>
                    {ticketsList.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').slice(0, 5).map(t => (
                      <tr key={t.id}>
                        <td className="font-mono text-[10px] font-bold">#{t.id?.toString().slice(-4).toUpperCase()}</td>
                        <td className="max-w-[150px] truncate font-medium">{t.title}</td>
                        <td><StatusBadge status={t.priority} /></td>
                        <td><StatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                    {ticketsList.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-muted-foreground italic">No high priority tickets</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Tickets' && (
        <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-wrap gap-2 bg-muted/20 p-2 border border-border rounded-sm">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
              <input 
                className="hms-input pl-7 w-48" 
                placeholder="Search Subject..." 
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value, page: 0})}
              />
            </div>
            <select className="hms-select text-[10px]" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value, page: 0})}>
              <option value="">All Categories</option>
              <option value="IT_SUPPORT">IT Support</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="SOFTWARE">Software</option>
              <option value="HARDWARE">Hardware</option>
              <option value="NETWORK">Network</option>
            </select>
            <select className="hms-select text-[10px]" value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value, page: 0})}>
              <option value="">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select className="hms-select text-[10px]" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value, page: 0})}>
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="hms-btn-primary ml-auto h-8 px-3 flex items-center gap-1 text-[10px] uppercase font-bold" onClick={() => setShowModal('create')}>
              <Plus size={14} /> Raise Ticket
            </button>
          </div>

          <div className="bg-card border border-border shadow-sm overflow-hidden">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Raised By</th>
                  <th>Assigned</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ticketsList.map(t => (
                  <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                    <td className="font-mono text-[10px] font-bold">#{t.id?.toString().slice(-4).toUpperCase()}</td>
                    <td className="max-w-[200px] truncate font-medium">{t.title}</td>
                    <td className="text-[10px] font-bold text-muted-foreground">{t.category?.replace('_', ' ')}</td>
                    <td><StatusBadge status={t.priority} /></td>
                    <td>
                      <div className="text-[10px] font-bold">{t.raisedBy?.fullName || 'SYSTEM'}</div>
                      <div className="text-[8px] text-muted-foreground uppercase">{t.raisedBy?.department?.name || 'ADMIN'}</div>
                    </td>
                    <td>
                      {t.assignedTo ? (
                        <div className="flex items-center gap-1">
                          <User size={10} className="text-primary" />
                          <span className="text-[10px] font-medium">{t.assignedTo.fullName}</span>
                        </div>
                      ) : (
                        <button className="text-[9px] text-primary hover:underline font-bold" onClick={() => { setSelectedTicket(t); setShowModal('assign'); }}>Unassigned</button>
                      )}
                    </td>
                    <td className="text-[10px] font-medium">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-primary/10 rounded-sm text-primary" onClick={() => { setSelectedTicket(t); setShowModal('view'); }}>
                          <Eye size={14} />
                        </button>
                        <button className="p-1 hover:bg-muted rounded-sm text-muted-foreground">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {ticketsList.length === 0 && (
                  <tr><td colSpan={9} className="text-center py-12 text-muted-foreground italic">No tickets found matching your filters</td></tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="p-3 border-t border-border bg-muted/10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Page {filters.page + 1} of {totalPages || 1}</span>
              <div className="flex gap-1">
                <button 
                  disabled={filters.page === 0} 
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>
                <button 
                  disabled={filters.page >= totalPages - 1} 
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  className="p-1.5 border border-border rounded hover:bg-muted disabled:opacity-50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showModal === 'create' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Headphones size={16} className="text-primary" /> Raise IT/Maintenance Ticket</h3>
              <button onClick={() => setShowModal(null)} className="hover:text-primary transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Subject / Title</label>
                <input className="hms-input w-full font-bold" required placeholder="Describe the issue in 1 line..." value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Category</label>
                  <select className="hms-select w-full" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})}>
                    <option value="IT_SUPPORT">IT Support</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="HARDWARE">Hardware</option>
                    <option value="NETWORK">Network</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Priority</label>
                  <select className="hms-select w-full" value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                <textarea className="hms-input w-full h-32 text-xs" required placeholder="Provide detailed information about the issue, location, and urgency..." value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="hms-btn-secondary flex-1 font-bold uppercase" onClick={() => setShowModal(null)}>Cancel</button>
                <button type="submit" className="hms-btn-primary flex-1 font-bold uppercase" disabled={loading}>Raise Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal === 'view' && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Ticket ID: #{selectedTicket.id?.toString().slice(-6).toUpperCase()}</span>
                <h3 className="text-sm font-black uppercase">{selectedTicket.title}</h3>
              </div>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-muted/30 p-2 rounded-sm">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Status</div>
                  <div className="mt-1"><StatusBadge status={selectedTicket.status} /></div>
                </div>
                <div className="bg-muted/30 p-2 rounded-sm">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Priority</div>
                  <div className="mt-1"><StatusBadge status={selectedTicket.priority} /></div>
                </div>
                <div className="bg-muted/30 p-2 rounded-sm">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Raised On</div>
                  <div className="text-[10px] font-bold mt-1">{new Date(selectedTicket.createdAt).toLocaleString()}</div>
                </div>
                <div className="bg-muted/30 p-2 rounded-sm">
                  <div className="text-[9px] font-bold uppercase text-muted-foreground">Assigned To</div>
                  <div className="text-[10px] font-bold mt-1">{selectedTicket.assignedTo?.fullName || 'Unassigned'}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">Issue Description</div>
                <div className="p-3 bg-muted/10 border border-border rounded-sm text-xs leading-relaxed italic">
                  "{selectedTicket.description}"
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                {selectedTicket.status === 'OPEN' && (
                  <button className="hms-btn-primary flex-1 py-2 text-[10px] uppercase font-bold bg-yellow-600 border-yellow-700" onClick={() => handleUpdateStatus(selectedTicket.id, 'IN_PROGRESS')}>Start Work</button>
                )}
                {selectedTicket.status === 'IN_PROGRESS' && (
                  <button className="hms-btn-primary flex-1 py-2 text-[10px] uppercase font-bold bg-green-700 border-green-800" onClick={() => handleUpdateStatus(selectedTicket.id, 'RESOLVED')}>Mark Resolved</button>
                )}
                {!selectedTicket.assignedTo && (
                  <button className="hms-btn-primary flex-1 py-2 text-[10px] uppercase font-bold" onClick={() => setShowModal('assign')}>Assign Staff</button>
                )}
                <button className="hms-btn-secondary flex-1 py-2 text-[10px] uppercase font-bold" onClick={() => setShowModal(null)}>Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'assign' && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm shadow-2xl rounded-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase">Assign Support Staff</h3>
              <button onClick={() => setShowModal(null)}><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Select Staff Member</label>
                <select className="hms-select w-full font-bold" onChange={(e) => handleAssignTicket(selectedTicket.id, e.target.value)}>
                  <option value="">Select Staff...</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} - {s.department?.name || 'Support'}</option>
                  ))}
                </select>
              </div>
              <div className="text-[9px] text-muted-foreground italic">
                Staff member will be notified immediately of this assignment.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpDesk;
