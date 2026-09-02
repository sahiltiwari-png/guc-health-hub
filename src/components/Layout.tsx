import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users, ClipboardList, Stethoscope, FlaskConical, BedDouble, CalendarDays,
  CreditCard, Car, Pill, FileText, BarChart3, Settings, LogOut, Menu,
  Baby, RotateCcw, Award, UserCog, Building2, ChevronDown, Shield, KeyRound, Truck,
  Droplets, Skull, ShieldCheck, Microscope, Scan, Package, UtensilsCrossed,
  Headphones, FileOutput, Scissors, Siren, Warehouse, Monitor, Activity, Search
} from 'lucide-react';

type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PHARMACIST' | 'LAB_TECHNICIAN';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const topNavItems: NavItem[] = [
  { label: 'OPD', path: '/opd', icon: Stethoscope, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'IPD', path: '/ipd', icon: BedDouble, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'Appointments', path: '/appointments', icon: CalendarDays, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'Queue', path: '/queue', icon: ClipboardList, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'Emergency', path: '/emergency', icon: Siren, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'OT', path: '/ot', icon: Scissors, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'ICU/Ward', path: '/icu-ward', icon: BedDouble, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'Investigations', path: '/investigations', icon: FlaskConical, roles: ['SUPER_ADMIN', 'DOCTOR', 'LAB_TECHNICIAN'] },
  { label: 'Day Care', path: '/daycare', icon: CalendarDays, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'Labs', path: '/labs', icon: FlaskConical, roles: ['SUPER_ADMIN', 'LAB_TECHNICIAN', 'DOCTOR'] },
  { label: 'Vitals', path: '/vitals', icon: Activity, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'EHR', path: '/ehr', icon: FileText, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'Laboratory', path: '/laboratory', icon: Microscope, roles: ['SUPER_ADMIN', 'LAB_TECHNICIAN'] },
  { label: 'Radiology', path: '/radiology', icon: Scan, roles: ['SUPER_ADMIN', 'LAB_TECHNICIAN', 'DOCTOR'] },
  { label: 'Pharmacy', path: '/pharmacy', icon: Pill, roles: ['SUPER_ADMIN', 'PHARMACIST', 'DOCTOR', 'NURSE'] },
  { label: 'Blood Bank', path: '/blood-bank', icon: Droplets, roles: ['SUPER_ADMIN', 'LAB_TECHNICIAN'] },
  { label: 'CSSD', path: '/cssd', icon: ShieldCheck, roles: ['SUPER_ADMIN', 'NURSE'] },
  { label: 'Billing', path: '/billing', icon: CreditCard, roles: ['SUPER_ADMIN', 'RECEPTIONIST'] },
  { label: 'Discharge', path: '/discharge', icon: FileOutput, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'Birth Reg', path: '/birth-reg', icon: Baby, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'] },
  { label: 'Death/PM', path: '/death-postmortem', icon: Skull, roles: ['SUPER_ADMIN', 'DOCTOR'] },
  { label: 'MIS', path: '/mis', icon: BarChart3, roles: ['SUPER_ADMIN'] },
  { label: 'Departments', path: '/departments', icon: Building2, roles: ['SUPER_ADMIN'] },
  { label: 'Ambulance', path: '/ambulance', icon: Truck, roles: ['SUPER_ADMIN', 'RECEPTIONIST', 'NURSE'] },
];

const sidebarItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: BarChart3, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'] },
  { label: 'Patient Reg', path: '/patient-registration', icon: Users, roles: ['SUPER_ADMIN', 'RECEPTIONIST'] },
  { label: 'Staff', path: '/staff', icon: UserCog, roles: ['SUPER_ADMIN'] },
  { label: 'Attendance', path: '/attendance', icon: ClipboardList, roles: ['SUPER_ADMIN'] },
  { label: 'Leave', path: '/leave', icon: CalendarDays, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'] },
  { label: 'Payroll', path: '/payroll', icon: CreditCard, roles: ['SUPER_ADMIN'] },
  { label: 'Bed Mgmt', path: '/bed-management', icon: BedDouble, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE'] },
  { label: 'Inventory', path: '/inventory', icon: Warehouse, roles: ['SUPER_ADMIN', 'PHARMACIST'] },
  { label: 'Assets', path: '/assets', icon: Package, roles: ['SUPER_ADMIN'] },
  { label: 'Equipment', path: '/equipment', icon: Monitor, roles: ['SUPER_ADMIN'] },
  { label: 'Diet/Kitchen', path: '/diet-kitchen', icon: UtensilsCrossed, roles: ['SUPER_ADMIN', 'NURSE'] },
  { label: 'Help Desk', path: '/helpdesk', icon: Headphones, roles: ['SUPER_ADMIN', 'RECEPTIONIST'] },
  { label: 'Branches', path: '/branches', icon: Building2, roles: ['SUPER_ADMIN'] },
  { label: 'Parking', path: '/parking', icon: Car, roles: ['SUPER_ADMIN', 'RECEPTIONIST'] },
  { label: 'Reports', path: '/reports', icon: FileText, roles: ['SUPER_ADMIN', 'DOCTOR'] },
  { label: 'Certificates', path: '/certificates', icon: Award, roles: ['SUPER_ADMIN', 'DOCTOR'] },
  { label: 'Revisit', path: '/revisit', icon: RotateCcw, roles: ['SUPER_ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
  { label: 'Audit Logs', path: '/audit-logs', icon: Shield, roles: ['SUPER_ADMIN'] },
  { label: '2FA Setup', path: '/2fa-setup', icon: KeyRound, roles: ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'] },
  { label: 'Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout, currentBranch, setBranch } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uhid, setUhid] = useState('');

  const getRole = () => {
    const r: any = user?.role;
    if (r?.name) return r.name;
    if (typeof r === 'string') return r;
    if (user?.roles && user.roles.length > 0) {
      const firstRole: any = user.roles[0];
      return typeof firstRole === 'string' ? firstRole : firstRole.name;
    }
    return 'RECEPTIONIST';
  };

  const rawRole = getRole();
  const userRole = (typeof rawRole === 'string' ? rawRole : 'RECEPTIONIST').toUpperCase() as UserRole;
  const validRoles: UserRole[] = ['SUPER_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'LAB_TECHNICIAN'];
  const normalizedRole = validRoles.includes(userRole) ? userRole : 'RECEPTIONIST';

  const filteredTopNav = topNavItems.filter(item => item.roles.includes(normalizedRole));
  const filteredSidebar = sidebarItems.filter(item => item.roles.includes(normalizedRole));

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            data-tour="branch-selector"
            className="bg-hms-nav text-hms-nav-foreground text-[10px] border border-muted-foreground/30 px-1 py-0.5 rounded-none"
            value={currentBranch}
            onChange={e => setBranch(e.target.value)}
          >
            <option>Main Branch - Noida</option>
            <option>Branch 2 - Delhi</option>
            <option>Branch 3 - Gurgaon</option>
            <option>Branch 4 - Ghaziabad</option>
          </select>
          <span className="font-medium">{user?.fullName || user?.name} ({normalizedRole.replace('_', ' ')})</span>
          <button onClick={logout} className="flex items-center gap-1 hover:text-destructive font-bold uppercase text-[10px]">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      <div className="bg-primary flex items-center gap-0 overflow-x-auto border-b border-white/10 shadow-sm">
        {filteredTopNav.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-tour={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-tight whitespace-nowrap transition-colors
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

      {/* NEW: UHID Search & Financial Summary Bar */}
      <div className="bg-muted/50 border-b border-border px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted-foreground">Enter UHID:</span>
            <div className="flex items-center">
              <input 
                type="text" 
                value={uhid}
                onChange={e => setUhid(e.target.value)}
                placeholder="Ex: U-2001"
                className="hms-input py-1 px-2 w-32 rounded-r-none border-r-0"
              />
              <button className="hms-btn-primary py-1 px-3 rounded-l-none flex items-center gap-1">
                <Search size={12} /> Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-bold text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-primary">OPD :</span>
            <span className="text-foreground">Rs.1500</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-destructive">Discount :</span>
            <span className="text-foreground">Rs.50/-</span>
          </div>
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-1">
            <span className="text-green-600">Collection :</span>
            <span className="text-foreground">Rs.1450/-</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-14 bg-hms-sidebar flex flex-col items-center py-2 gap-1 overflow-y-auto border-r border-border">
            {filteredSidebar.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  data-tour={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`flex flex-col items-center justify-center w-11 h-11 rounded text-[9px] leading-tight text-center transition-colors font-semibold uppercase
                    ${active
                      ? 'bg-primary-foreground text-primary shadow-inner border border-primary/20'
                      : 'text-hms-sidebar-foreground hover:bg-primary-foreground/10'
                    }`}
                >
                  <Icon size={16} />
                  <span className="mt-0.5 truncate w-full px-0.5">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      </div>

      <div className="bg-hms-nav text-hms-nav-foreground text-[10px] px-3 py-0.5 flex justify-between border-t border-white/5">
        <span className="font-medium">GUC Hospital Management Software v1.0.4</span>
        <span className="font-medium tracking-wider">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} | {normalizedRole.replace('_', ' ')}</span>
      </div>
    </div>
  );
};

export default Layout;
