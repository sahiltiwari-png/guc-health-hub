import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users, ClipboardList, Stethoscope, FlaskConical, BedDouble, CalendarDays,
  CreditCard, Car, Pill, FileText, BarChart3, Settings, LogOut, Menu,
  Baby, RotateCcw, Award, UserCog, Building2, ChevronDown, Shield, KeyRound, Truck,
  Droplets, Skull, ShieldCheck, Microscope, Scan, Package, UtensilsCrossed,
  Headphones, FileOutput, Scissors, Siren, Warehouse, Monitor, Activity
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

  const userRole = (user?.role?.toUpperCase() || 'RECEPTIONIST') as UserRole;
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
          <span>{user?.name} ({normalizedRole.replace('_', ' ')})</span>
          <button onClick={logout} className="flex items-center gap-1 hover:text-destructive">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      <div className="bg-primary flex items-center gap-0 overflow-x-auto">
        {filteredTopNav.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-tour={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
        {sidebarOpen && (
          <div className="w-14 bg-hms-sidebar flex flex-col items-center py-2 gap-1 overflow-y-auto">
            {filteredSidebar.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  data-tour={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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

        <div className="flex-1 overflow-auto p-3">
          {children}
        </div>
      </div>

      <div className="bg-hms-nav text-hms-nav-foreground text-[10px] px-3 py-0.5 flex justify-between">
        <span>GUC Hospital Management Software v1.0</span>
        <span>{new Date().toLocaleDateString('en-IN')} | {normalizedRole.replace('_', ' ')}</span>
      </div>
    </div>
  );
};

export default Layout;
