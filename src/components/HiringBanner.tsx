import React from 'react';
import { X, Bell, Megaphone, AlertCircle, Calendar, Info, ExternalLink } from 'lucide-react';

const announcements = [
  {
    type: 'hiring',
    icon: Megaphone,
    title: '🎉 We Are Hiring!',
    message: 'Looking for experienced Cardiologists, Radiologists & Senior Nurses. Walk-in interviews on 1st & 3rd Saturday. Contact: hr@guchospital.com',
    badge: 'Careers',
    badgeColor: 'bg-primary text-primary-foreground',
    borderColor: 'border-l-4 border-l-primary',
    image: 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=400&h=120&fit=crop&q=80',
  },
  {
    type: 'alert',
    icon: AlertCircle,
    title: '⚠️ System Maintenance',
    message: 'Scheduled maintenance on 28-Feb-2026 from 11:00 PM to 2:00 AM. Please save your work.',
    badge: 'IT Notice',
    badgeColor: 'bg-yellow-500 text-foreground',
    borderColor: 'border-l-4 border-l-yellow-500',
    image: null,
  },
  {
    type: 'event',
    icon: Calendar,
    title: '📅 CME Program — Laparoscopic Surgery',
    message: 'Continuing Medical Education on 5-Mar-2026. All doctors are requested to register at the academic department.',
    badge: 'Event',
    badgeColor: 'bg-green-600 text-primary-foreground',
    borderColor: 'border-l-4 border-l-green-600',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=120&fit=crop&q=80',
  },
  {
    type: 'info',
    icon: Info,
    title: '📋 Updated NABH Guidelines',
    message: 'New documentation templates are available in the Documents section. All HODs must review by 10-Mar-2026.',
    badge: 'Compliance',
    badgeColor: 'bg-blue-600 text-primary-foreground',
    borderColor: 'border-l-4 border-l-blue-600',
    image: null,
  },
];

const HiringBanner = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center">
      <div className="bg-card w-[620px] border border-border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={14} />
            <span className="text-sm font-bold">📢 Announcements & Notices</span>
          </div>
          <button onClick={onClose} className="hover:opacity-80"><X size={14} /></button>
        </div>

        {/* Scrollable announcements */}
        <div className="p-3 space-y-2.5 max-h-[420px] overflow-y-auto">
          {announcements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`bg-card border border-border ${a.borderColor} overflow-hidden`}>
                {a.image && (
                  <div className="w-full h-[100px] overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <Icon size={14} className="mt-0.5 shrink-0 text-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 ${a.badgeColor}`}>{a.badge}</span>
                        <p className="text-xs font-bold text-foreground">{a.title}</p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">{a.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5 flex justify-between items-center bg-muted">
          <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded" /> Don't show again today
          </label>
          <button onClick={onClose} className="hms-btn-primary text-[11px] flex items-center gap-1">
            ✅ Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiringBanner;
