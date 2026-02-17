import React from 'react';

const Reports = () => (
  <div>
    <div className="hms-section-header">Reports</div>
    <div className="grid grid-cols-3 gap-3">
      {[
        'OPD Collection Report', 'IPD Collection Report', 'Investigation Report',
        'Pharmacy Sales Report', 'Day Care Report', 'Discharge Summary Report',
        'Lab Test Report', 'TPA Report', 'Doctor-wise Collection',
        'Department-wise Report', 'Daily Revenue Report', 'Monthly Revenue Report',
      ].map((report, i) => (
        <div key={i} className="bg-card border border-border p-3 hover:bg-muted cursor-pointer flex items-center gap-2">
          <span className="text-xs font-semibold">{report}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Reports;
