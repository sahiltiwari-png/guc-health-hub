import React from 'react';
import { Megaphone, X, Bell, AlertCircle, Calendar, Info } from 'lucide-react';

const announcements = [
  {
    type: 'hiring',
    icon: Megaphone,
    title: '🎉 We Are Hiring!',
    message: 'GUC Hospital is looking for experienced Cardiologists, Radiologists, and Senior Nurses. Walk-in interviews on 1st & 3rd Saturday of every month. Contact HR: hr@guchospital.com',
    color: 'bg-blue-50 border-blue-300',
  },
  {
    type: 'alert',
    icon: AlertCircle,
    title: '⚠️ System Maintenance Notice',
    message: 'Scheduled maintenance on 28-Feb-2026 from 11:00 PM to 2:00 AM. Please save your work before the downtime window.',
    color: 'bg-yellow-50 border-yellow-300',
  },
  {
    type: 'event',
    icon: Calendar,
    title: '📅 Upcoming CME Program',
    message: 'Continuing Medical Education on "Advances in Laparoscopic Surgery" on 5-Mar-2026. All doctors are requested to register at the academic department.',
    color: 'bg-green-50 border-green-300',
  },
  {
    type: 'info',
    icon: Info,
    title: '📋 New NABH Guidelines',
    message: 'Updated NABH documentation templates are now available in the Documents section. All HODs must review and acknowledge by 10-Mar-2026.',
    color: 'bg-purple-50 border-purple-300',
  },
];

const HiringBanner = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center">
      <div className="bg-card w-[600px] border border-border shadow-2xl">
        <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} />
            <span className="text-sm font-bold">Announcements & Notices</span>
          </div>
          <button onClick={onClose} className="hover:opacity-80"><X size={14} /></button>
        </div>

        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {announcements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`border p-3 ${a.color}`}>
                <div className="flex items-start gap-2">
                  <Icon size={16} className="mt-0.5 shrink-0 text-foreground" />
                  <div>
                    <p className="text-xs font-bold text-foreground">{a.title}</p>
                    <p className="text-[11px] text-foreground/80 mt-1">{a.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border px-4 py-2 flex justify-between items-center bg-muted">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <input type="checkbox" className="rounded" /> Don't show this again today
          </label>
          <button onClick={onClose} className="hms-btn-primary text-[11px]">Acknowledge & Close</button>
        </div>
      </div>
    </div>
  );
};

export default HiringBanner;
