import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users, ClipboardList, Stethoscope, FlaskConical, BedDouble, CalendarDays,
  CreditCard, Car, Pill, FileText, BarChart3, Settings, LogOut, Menu,
  Baby, RotateCcw, Award, UserCog, Building2, ChevronDown
} from 'lucide-react';

const topNavItems = [
  { label: 'OPD', path: '/opd', icon: Stethoscope },
  { label: 'IPD', path: '/ipd', icon: BedDouble },
  { label: 'Queue', path: '/queue', icon: ClipboardList },
  { label: 'Investigations', path: '/investigations', icon: FlaskConical },
  { label: 'Day Care', path: '/daycare', icon: CalendarDays },
  { label: 'Labs', path: '/labs', icon: FlaskConical },
  { label: 'Pharmacy', path: '/pharmacy', icon: Pill },
  { label: 'Birth Reg', path: '/birth-reg', icon: Baby },
  { label: 'Billing', path: '/billing', icon: CreditCard },
  { label: 'MIS', path: '/mis', icon: BarChart3 },
];

const sidebarItems = [
  { label: 'Dashboard', path: '/', icon: BarChart3 },
  { label: 'Patient Reg', path: '/patient-registration', icon: Users },
  { label: 'Staff', path: '/staff', icon: UserCog },
  { label: 'Parking', path: '/parking', icon: Car },
  { label: 'Branches', path: '/branches', icon: Building2 },
  { label: 'Reports', path: '/reports', icon: FileText },
  { label: 'Certificates', path: '/certificates', icon: Award },
  { label: 'Revisit', path: '/revisit', icon: RotateCcw },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, currentBranch, setBranch } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="bg-hms-nav text-hms-nav-foreground flex items-center justify-between px-2 py-1 text-xs">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-primary/20 rounded">
            <Menu size={16} />
          </button>
          <span className="font-bold text-sm">GUC HMS</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-[10px]">{currentBranch}</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="bg-hms-nav text-hms-nav-foreground text-[10px] border border-muted-foreground/30 px-1 py-0.5 rounded-none"
            value={currentBranch}
            onChange={e => setBranch(e.target.value)}
          >
            <option>Main Branch - Noida</option>
            <option>Branch 2 - Delhi</option>
            <option>Branch 3 - Gurgaon</option>
            <option>Branch 4 - Ghaziabad</option>
          </select>
          <span>{user?.name} ({user?.role})</span>
          <button onClick={logout} className="flex items-center gap-1 hover:text-destructive">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="bg-primary flex items-center gap-0 overflow-x-auto">
        {topNavItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors
                ${active
                  ? 'bg-card text-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
            >
              <Icon size={14} />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-14 bg-hms-sidebar flex flex-col items-center py-2 gap-1 overflow-y-auto">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={`flex flex-col items-center justify-center w-11 h-11 rounded text-[9px] leading-tight text-center transition-colors
                    ${active
                      ? 'bg-primary-foreground text-primary'
                      : 'text-hms-sidebar-foreground hover:bg-primary-foreground/10'
                    }`}
                >
                  <Icon size={16} />
                  <span className="mt-0.5 truncate w-full">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-hms-nav text-hms-nav-foreground text-[10px] px-3 py-0.5 flex justify-between">
        <span>GUC Hospital Management Software v1.0</span>
        <span>{new Date().toLocaleDateString('en-IN')} | {user?.role}</span>
      </div>
    </div>
  );
};

export default Layout;
