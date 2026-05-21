import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, CreditCard, RefreshCw, Filter, Download, Calendar } from 'lucide-react';
import { apiRequest, extractArray, getMIS } from "@/api/apiService";

const MIS = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const fetchMISData = async () => {
    setLoading(true);
    try {
      const res = await getMIS();
      if (res.ok) {
          setSummary(res.data);
      } else {
          const statsRes = await apiRequest('/api/dashboard/stats');
          if (statsRes.ok) setSummary(statsRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMISData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} /> Management Information System (MIS)
        </div>
        <div className="flex gap-2">
          <button onClick={fetchMISData} className="p-1.5 hover:bg-muted rounded text-primary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="hms-btn-secondary py-1 px-3 text-[10px] flex items-center gap-1">
            <Download size={12} /> Export MIS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'OPD Summary', icon: Users, rows: [['Today', '156'], ['This Week', '892'], ['This Month', '3,456']] },
          { title: 'IPD Summary', icon: TrendingUp, rows: [['Current Admitted', '89'], ['Discharged Today', '12'], ['This Month', '234']] },
          { title: 'Revenue Summary', icon: CreditCard, rows: [['Today', '₹4,52,300'], ['This Week', '₹28,45,000'], ['This Month', '₹1,12,34,000']] },
        ].map((card, i) => (
          <div key={i} className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="bg-primary/5 p-2 border-b border-border flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-tight">{card.title}</span>
              <card.icon size={14} className="text-primary opacity-60" />
            </div>
            <div className="p-2 space-y-1">
              {card.rows.map(([label, val], j) => (
                <div key={j} className="flex justify-between text-xs py-1.5 border-b border-muted/30 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded shadow-sm">
          <div className="bg-muted/30 p-2 border-b border-border font-bold text-xs uppercase">Department-wise OPD</div>
          <div className="overflow-x-auto">
            <table className="hms-table w-full text-xs">
              <thead><tr><th>Department</th><th>Today</th><th>Week</th><th>Month</th></tr></thead>
              <tbody>
                {[['General Medicine', 45, 280, 1100], ['Orthopedics', 28, 160, 650], ['Gynecology', 22, 140, 580], ['Pediatrics', 18, 110, 420], ['Cardiology', 15, 90, 350]].map(([dept, ...vals], i) => (
                  <tr key={i}>
                    <td className="font-medium">{dept}</td>
                    {(vals as number[]).map((v, j) => <td key={j} className="font-bold">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-card border border-border rounded shadow-sm">
          <div className="bg-muted/30 p-2 border-b border-border font-bold text-xs uppercase">Collection Summary</div>
          <div className="overflow-x-auto">
            <table className="hms-table w-full text-xs">
              <thead><tr><th>Type</th><th>Cash</th><th>Card</th><th>UPI</th><th>TPA</th></tr></thead>
              <tbody>
                {[['OPD', '₹45K', '₹12K', '₹28K', '₹15K'], ['IPD', '₹1.2L', '₹45K', '₹80K', '₹2.5L'], ['Investigation', '₹35K', '₹18K', '₹22K', '₹10K'], ['Pharmacy', '₹25K', '₹8K', '₹15K', '₹5K']].map((row, i) => (
                  <tr key={i}>{row.map((v, j) => <td key={j} className="font-bold">{v}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MIS;
