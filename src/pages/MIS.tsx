import React from 'react';

const MIS = () => (
  <div>
    <div className="hms-section-header">Management Information System (MIS)</div>
    <div className="grid grid-cols-3 gap-3 mb-3">
      {[
        { title: 'OPD Summary', rows: [['Today', '156'], ['This Week', '892'], ['This Month', '3,456']] },
        { title: 'IPD Summary', rows: [['Current Admitted', '89'], ['Discharged Today', '12'], ['This Month', '234']] },
        { title: 'Revenue Summary', rows: [['Today', '₹4,52,300'], ['This Week', '₹28,45,000'], ['This Month', '₹1,12,34,000']] },
      ].map((card, i) => (
        <div key={i} className="bg-card border border-border">
          <div className="hms-section-header">{card.title}</div>
          <div className="p-2">
            {card.rows.map(([label, val], j) => (
              <div key={j} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                <span>{label}</span><span className="font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border">
        <div className="hms-section-header">Department-wise OPD</div>
        <table className="hms-table">
          <thead><tr><th>Department</th><th>Today</th><th>Week</th><th>Month</th></tr></thead>
          <tbody>
            {[['General Medicine', 45, 280, 1100], ['Orthopedics', 28, 160, 650], ['Gynecology', 22, 140, 580], ['Pediatrics', 18, 110, 420], ['Cardiology', 15, 90, 350]].map(([dept, ...vals], i) => (
              <tr key={i}><td>{dept}</td>{(vals as number[]).map((v, j) => <td key={j}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-card border border-border">
        <div className="hms-section-header">Collection Summary</div>
        <table className="hms-table">
          <thead><tr><th>Type</th><th>Cash</th><th>Card</th><th>UPI</th><th>TPA</th></tr></thead>
          <tbody>
            {[['OPD', '₹45K', '₹12K', '₹28K', '₹15K'], ['IPD', '₹1.2L', '₹45K', '₹80K', '₹2.5L'], ['Investigation', '₹35K', '₹18K', '₹22K', '₹10K'], ['Pharmacy', '₹25K', '₹8K', '₹15K', '₹5K']].map((row, i) => (
              <tr key={i}>{row.map((v, j) => <td key={j}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default MIS;
