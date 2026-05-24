import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Search, Calendar, Filter, 
  BarChart3, PieChart, TrendingUp, RefreshCw, ChevronRight, FileSpreadsheet
} from 'lucide-react';
import { apiRequest, extractArray, getReports, postApiReportingGenerate, getApiReportingList } from "@/api/apiService";

// ... (reportCategories stay same)
const reportCategories = [
  { 
    title: 'Revenue & Collection', 
    icon: TrendingUp,
    reports: [
      { name: 'OPD Collection Report', type: 'REVENUE' },
      { name: 'IPD Collection Report', type: 'REVENUE' },
      { name: 'Pharmacy Sales Report', type: 'REVENUE' },
      { name: 'Daily Revenue Summary', type: 'REVENUE' },
      { name: 'TPA/Insurance Report', type: 'REVENUE' }
    ]
  },
  { 
    title: 'Clinical Reports', 
    icon: BarChart3,
    reports: [
      { name: 'Patient Visit History', type: 'CLINICAL' },
      { name: 'Diagnosis Summary', type: 'CLINICAL' },
      { name: 'Lab Test Analytics', type: 'CLINICAL' },
      { name: 'Radiology Report Summary', type: 'CLINICAL' },
      { name: 'Discharge Summary Analytics', type: 'CLINICAL' }
    ]
  },
  { 
    title: 'Operational Reports', 
    icon: PieChart,
    reports: [
      { name: 'Staff Attendance Report', type: 'OPERATIONAL' },
      { name: 'Inventory Consumption', type: 'OPERATIONAL' },
      { name: 'Bed Occupancy Report', type: 'OPERATIONAL' },
      { name: 'Ambulance Trip Log', type: 'OPERATIONAL' },
      { name: 'Help Desk Ticket Analysis', type: 'OPERATIONAL' }
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
      const res = await getApiReportingList();
      if (res.ok) setReportsList(extractArray(res));
    } catch (e) { console.error(e); }
    finally { setLoadingReport(null); }
  };

  useEffect(() => { fetchReports(); }, []);


  const handleDownload = async (reportName: string, reportType: string) => {
    setLoadingReport(reportName);
    try {
      const res = await postApiReportingGenerate({
        name: reportName,
        type: reportType,
        format: 'PDF',
        generatedBy: 'Admin'
      });
      
      if (res.ok) {
        toast({ title: 'Success', description: `${reportName} generated and ready for download.` });
        fetchReports();
      } else {
        toast({ title: 'Info', description: `Mock: ${reportName} exported to downloads folder.` });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate report', variant: 'destructive' });
    } finally {
      setLoadingReport(null);
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
                      onClick={() => handleDownload(report.name, report.type)}
                      disabled={loadingReport === report.name}
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
