import React from 'react';

const Settings = () => (
  <div>
    <div className="hms-section-header">Settings</div>
    <div className="grid grid-cols-3 gap-3">
      {[
        'Hospital Profile', 'Department Setup', 'Ward & Bed Setup',
        'Doctor Setup', 'TPA / Panel Setup', 'Rate List Management',
        'User Management', 'Role & Permissions', 'Backup & Restore',
        'Print Settings', 'SMS / Email Settings', 'System Configuration',
      ].map((setting, i) => (
        <div key={i} className="bg-card border border-border p-3 hover:bg-muted cursor-pointer">
          <span className="text-xs font-semibold">{setting}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Settings;
