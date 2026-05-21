import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Building2, UserCog, ShieldCheck, Database, Bell, Globe, Key, ListTree, CreditCard, Mail, Sliders } from 'lucide-react';
import { apiRequest } from '@/api/apiService';

const settingGroups = [
  {
    title: 'Hospital Administration',
    items: [
      { name: 'Hospital Profile', icon: Building2, desc: 'Manage basic hospital details and branding', endpoint: '/api/v1/hospital/profile' },
      { name: 'Department Setup', icon: ListTree, desc: 'Configure clinical and non-clinical departments', endpoint: '/api/departments' },
      { name: 'Ward & Bed Setup', icon: Globe, desc: 'Manage hospital infrastructure and bed mapping', endpoint: '/api/v1/ipd/wards' },
      { name: 'Doctor Setup', icon: UserCog, desc: 'Manage doctor profiles and specializations', endpoint: '/api/doctors' },
    ]
  },
  {
    title: 'Financial Configuration',
    items: [
      { name: 'TPA / Panel Setup', icon: ShieldCheck, desc: 'Configure insurance providers and panels', endpoint: '/api/v1/billing/tpa' },
      { name: 'Rate List Management', icon: CreditCard, desc: 'Set pricing for services and investigations', endpoint: '/api/v1/billing/service-charges' },
    ]
  },
  {
    title: 'System & Security',
    items: [
      { name: 'User Management', icon: UserCog, desc: 'Manage system users and access levels', endpoint: '/api/admin/users' },
      { name: 'Role & Permissions', icon: Key, desc: 'Define roles and associated permissions', endpoint: '/api/admin/roles' },
      { name: 'Backup & Restore', icon: Database, desc: 'Manage database backups and system recovery', endpoint: '/api/system/backup' },
      { name: 'System Configuration', icon: Sliders, desc: 'General system behavior and preferences', endpoint: '/api/system/config' },
    ]
  }
];

const Settings = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSettingClick = async (name: string, endpoint: string) => {
    setLoading(name);
    try {
      const res = await apiRequest(endpoint);
      // In a real app, this would open a modal or sub-page
      console.log(`Loaded settings for ${name}:`, res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="hms-section-header flex items-center gap-2">
        <SettingsIcon size={16} /> System Settings & Configuration
      </div>

      <div className="grid grid-cols-1 gap-6">
        {settingGroups.map((group, i) => (
          <div key={i} className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-wider border-b border-border pb-1">
              {group.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((item, j) => (
                <div 
                  key={j} 
                  onClick={() => handleSettingClick(item.name, item.endpoint)}
                  className="group bg-card border border-border p-3 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md rounded"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/5 rounded group-hover:bg-primary/10 transition-colors">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-xs font-bold">{item.name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  {loading === item.name && (
                    <div className="mt-2 text-[9px] text-primary animate-pulse font-bold uppercase">
                      Connecting to module...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
