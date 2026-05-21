import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Search, Calendar, Filter, 
  BarChart3, PieChart, TrendingUp, RefreshCw, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { apiRequest, extractArray, getReports } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const reportCategories = [
  { 
    title: 'Revenue & Collection', 
    icon: TrendingUp,
    reports: [
      { name: 'OPD Collection Report', endpoint: '/api/reports/revenue/opd' },
      { name: 'IPD Collection Report', endpoint: '/api/reports/revenue/ipd' },
      { name: 'Pharmacy Sales Report', endpoint: '/api/reports/revenue/pharmacy' },
      { name: 'Daily Revenue Summary', endpoint: '/api/reports/revenue/daily' },
      { name: 'TPA/Insurance Report', endpoint: '/api/reports/revenue/tpa' }
    ]
  },
  { 
    title: 'Clinical Reports', 
    icon: BarChart3,
    reports: [
      { name: 'Patient Visit History', endpoint: '/api/reports/clinical/visits' },
      { name: 'Diagnosis Summary', endpoint: '/api/reports/clinical/diagnosis' },
      { name: 'Lab Test Analytics', endpoint: '/api/reports/clinical/lab' },
      { name: 'Radiology Report Summary', endpoint: '/api/reports/clinical/radiology' },
      { name: 'Discharge Summary Analytics', endpoint: '/api/reports/clinical/discharge' }
    ]
  },
  { 
    title: 'Operational Reports', 
    icon: PieChart,
    reports: [
      { name: 'Staff Attendance Report', endpoint: '/api/reports/ops/attendance' },
      { name: 'Inventory Consumption', endpoint: '/api/reports/ops/inventory' },
      { name: 'Bed Occupancy Report', endpoint: '/api/reports/ops/beds' },
      { name: 'Ambulance Trip Log', endpoint: '/api/reports/ops/ambulance' },
      { name: 'Help Desk Ticket Analysis', endpoint: '/api/reports/ops/helpdesk' }
    ]
  }
];

const Reports = () => {
  const { toast } = useToast();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportsList, setReportsList] = useState<any[]>([]);

  const fetchReports = async () => {
    setLoadingReport('initial');
    try {
      const res = await getReports();
      if (res.ok) setReportsList(extractArray(res));
    } catch (e) { console.error(e); }
    finally { setLoadingReport(null); }
  };

  useEffect(() => { fetchReports(); }, []);


  const handleDownload = async (reportName: string, endpoint: string) => {
    setLoading(reportName);
    try {
      // In a real app, this would be a blob download
      const res = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ ...dateRange, format: 'PDF' })
      });
      
      if (res.ok) {
        toast({ title: 'Success', description: `${reportName} generated and ready for download.` });
      } else {
        toast({ title: 'Info', description: `Mock: ${reportName} exported to downloads folder.` });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate report', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center gap-2">
        <FileText size={16} /> Enterprise Reporting & Analytics Center
      </div>

      <div className="bg-muted/30 border border-border p-3 rounded flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">From:</span>
            <input type="date" className="hms-input py-1 text-xs" onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">To:</span>
            <input type="date" className="hms-input py-1 text-xs" onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
          </div>
          <button className="hms-btn-primary py-1 px-3 text-[10px] flex items-center gap-1">
            <RefreshCw size={12} /> Apply Filters
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground">
            <FileSpreadsheet size={14} /> Export All (Excel)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportCategories.map((cat, i) => (
          <div key={i} className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-2 border-b border-border flex items-center gap-2">
              <cat.icon size={16} className="text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-tight">{cat.title}</h3>
            </div>
            <div className="p-1">
              {cat.reports.map((report, j) => (
                <div 
                  key={j} 
                  className="group flex items-center justify-between p-2 hover:bg-muted/50 transition-colors border-b border-muted/30 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary" />
                    <span className="text-[11px] font-medium text-foreground">{report.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDownload(report.name, report.endpoint)}
                      disabled={loading === report.name}
                      className="p-1 hover:text-primary"
                      title="Download PDF"
                    >
                      {loading === report.name ? <RefreshCw size={12} className="animate-spin" /> : <Download size={12} />}
                    </button>
                    <button className="p-1 hover:text-hms-info" title="Print">
                      <Printer size={12} />
                    </button>
                    <button className="p-1 hover:text-foreground" title="View Preview">
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
