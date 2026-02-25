import React, { useState } from 'react';
import { X, Stethoscope, BedDouble, Car, Pill, Award, FlaskConical, CreditCard, BarChart3, Users, Baby, CalendarDays, ClipboardList, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

const features = [
  { icon: Stethoscope, title: 'OPD', description: 'Register & manage outpatient visits', nav: 'Top navigation bar → OPD tab' },
  { icon: BedDouble, title: 'IPD', description: 'Admit patients & manage wards', nav: 'Top navigation bar → IPD tab' },
  { icon: ClipboardList, title: 'Queue', description: 'View live patient queue status', nav: 'Top navigation bar → Queue tab' },
  { icon: FlaskConical, title: 'Investigations', description: 'Order & track lab investigations', nav: 'Top navigation bar → Investigations tab' },
  { icon: CalendarDays, title: 'Day Care', description: 'Manage day-care procedures', nav: 'Top navigation bar → Day Care tab' },
  { icon: FlaskConical, title: 'Labs', description: 'Lab test results & reports', nav: 'Top navigation bar → Labs tab' },
  { icon: Pill, title: 'Pharmacy', description: 'Dispense medicines & manage stock', nav: 'Top navigation bar → Pharmacy tab' },
  { icon: Baby, title: 'Birth Registration', description: 'Register newborn births', nav: 'Top navigation bar → Birth Reg tab' },
  { icon: CreditCard, title: 'Billing', description: 'Generate bills & collect payments', nav: 'Top navigation bar → Billing tab' },
  { icon: BarChart3, title: 'MIS Reports', description: 'View management dashboards', nav: 'Top navigation bar → MIS tab' },
  { icon: Users, title: 'Patient Registration', description: 'Register new patients with UHID', nav: 'Left sidebar → Patient Reg icon' },
  { icon: Car, title: 'Parking', description: 'Manage hospital parking slots', nav: 'Left sidebar → Parking icon' },
  { icon: Award, title: 'Certificates', description: 'Generate medical certificates', nav: 'Left sidebar → Certificates icon' },
];

const OnboardingStepper = ({ onComplete }: { onComplete: () => void }) => {
  const [page, setPage] = useState(0);
  const perPage = 5;
  const totalPages = Math.ceil(features.length / perPage);
  const current = features.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center">
      <div className="bg-card w-[520px] border border-border shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-4 py-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">🗺️ Quick Navigation Guide</h2>
            <p className="text-[10px] opacity-80">Where to find each module ({page + 1}/{totalPages})</p>
          </div>
          <button onClick={onComplete} className="hover:opacity-80"><X size={14} /></button>
        </div>

        {/* Feature List */}
        <div className="p-3 space-y-1.5">
          {current.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-center gap-3 border border-border bg-card hover:bg-muted px-3 py-2 transition-colors">
                <div className="w-8 h-8 bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground">{f.title}</p>
                  <p className="text-[10px] text-muted-foreground">{f.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <MapPin size={10} className="text-primary" />
                  <span className="text-[10px] font-semibold text-primary whitespace-nowrap">{f.nav}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="hms-btn-secondary disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === page ? 'bg-primary' : 'bg-border'}`} />
            ))}
          </div>
          {page < totalPages - 1 ? (
            <button onClick={() => setPage(page + 1)} className="hms-btn-primary flex items-center gap-1">
              Next <ChevronRight size={12} />
            </button>
          ) : (
            <button onClick={onComplete} className="hms-btn-success">
              ✅ Got It!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
