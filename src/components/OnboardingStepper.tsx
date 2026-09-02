import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const tourSteps = [
  {
    target: '[data-tour="sidebar-dashboard"]',
    fallbackTarget: '.sidebar-nav',
    title: 'Dashboard',
    description: 'Your central command center — view KPIs, patient stats, and daily summaries at a glance.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="nav-opd"]',
    title: 'OPD Module',
    description: 'Register & manage outpatient visits. Click here to access OPD tokens, consultations, and prescriptions.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tour="nav-ipd"]',
    title: 'IPD Module',
    description: 'Admit patients, assign beds, and manage ward-level activities from this tab.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tour="nav-queue"]',
    title: 'Live Queue',
    description: 'Monitor the real-time patient queue. See who\'s waiting, who\'s being seen, and estimated wait times.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tour="nav-pharmacy"]',
    title: 'Pharmacy',
    description: 'Dispense medicines, manage stock levels, and track prescriptions — all in one place.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tour="nav-billing"]',
    title: 'Billing',
    description: 'Generate bills, collect payments, and manage insurance claims efficiently.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tour="sidebar-patient-reg"]',
    title: 'Patient Registration',
    description: 'Register new patients and generate unique UHID numbers. Find this in the left sidebar.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="sidebar-parking"]',
    title: 'Parking Management',
    description: 'Manage hospital parking slots and vehicle tracking from the sidebar.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="sidebar-certificates"]',
    title: 'Certificates',
    description: 'Generate medical certificates, fitness certificates, and more from here.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="sidebar-audit"]',
    title: 'Audit Logs',
    description: 'Track every action — logins, record changes, and access history for compliance.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="sidebar-2fa"]',
    title: '2FA Security',
    description: 'Set up Two-Factor Authentication to secure your account with an extra layer of protection.',
    position: 'right' as const,
  },
  {
    target: '[data-tour="branch-selector"]',
    title: 'Branch Selector',
    description: 'Switch between hospital branches instantly. All data updates to reflect the selected branch.',
    position: 'bottom' as const,
  },
];

interface Rect {
  top: number; left: number; width: number; height: number;
}

const OnboardingStepper = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(-1); // -1 = welcome screen
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [arrowDir, setArrowDir] = useState<'top' | 'left' | 'bottom' | 'right'>('top');
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = tourSteps[step];

  const updatePosition = useCallback(() => {
    if (step < 0 || !currentStep) return;
    const el = document.querySelector(currentStep.target) ||
               (currentStep.fallbackTarget ? document.querySelector(currentStep.fallbackTarget) : null);
    if (!el) { setTargetRect(null); return; }

    const rect = el.getBoundingClientRect();
    const pad = 6;
    setTargetRect({ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 });

    // Calculate tooltip position
    const tooltipW = 320;
    const tooltipH = 160;
    const gap = 16;
    let top = 0, left = 0, aDir: typeof arrowDir = 'top';

    switch (currentStep.position) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        aDir = 'top';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.right + gap;
        aDir = 'left';
        break;
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tooltipH - 12));

    setTooltipStyle({ top, left, width: tooltipW });
    setArrowDir(aDir);

    // Arrow pointing at element
    if (aDir === 'top') {
      setArrowStyle({ top: -8, left: Math.max(20, Math.min(rect.left + rect.width / 2 - left, tooltipW - 20)) });
    } else {
      setArrowStyle({ left: -8, top: Math.max(20, Math.min(rect.top + rect.height / 2 - top, tooltipH - 20)) });
    }
  }, [step, currentStep]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  const next = () => { if (step < tourSteps.length - 1) setStep(step + 1); else onComplete(); };
  const prev = () => { if (step > 0) setStep(step - 1); else setStep(-1); };

  // Welcome screen
  if (step === -1) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center animate-in fade-in duration-300">
        <div className="bg-card w-[420px] border border-border shadow-2xl rounded-lg overflow-hidden">
          <div className="bg-primary px-6 py-8 text-center">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-primary-foreground">Welcome to GUC HMS!</h2>
            <p className="text-primary-foreground/80 text-sm mt-2">
              Let us give you a quick tour of the system
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              {[
                { emoji: '🏥', text: 'Navigate modules like OPD, IPD, Pharmacy' },
                { emoji: '📋', text: 'Find patient registration & certificates' },
                { emoji: '🔒', text: 'Set up security with 2FA & audit logs' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={onComplete} className="flex-1 hms-btn-secondary py-2.5 rounded">
                Skip Tour
              </button>
              <button onClick={() => setStep(0)} className="flex-1 hms-btn-primary py-2.5 rounded flex items-center justify-center gap-2">
                Start Tour <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              {tourSteps.length} steps · Takes about 1 minute
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Overlay with spotlight cutout using CSS clip-path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 200 }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="4"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0" y="0" width="100%" height="100%"
          fill="rgba(0,0,0,0.55)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow */}
      {targetRect && (
        <div
          className="absolute border-2 border-primary rounded shadow-[0_0_0_4px_hsl(var(--primary)/0.2)] transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            zIndex: 201,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-card border border-border rounded-lg shadow-2xl pointer-events-auto transition-all duration-300 ease-out"
        style={{ ...tooltipStyle, zIndex: 202 }}
      >
        {/* Arrow */}
        <div
          className="absolute w-4 h-4 bg-card border-border rotate-45"
          style={{
            ...arrowStyle,
            borderTop: arrowDir === 'top' ? '1px solid hsl(var(--border))' : 'none',
            borderLeft: arrowDir === 'left' ? '1px solid hsl(var(--border))' : arrowDir === 'top' ? '1px solid hsl(var(--border))' : 'none',
            borderRight: arrowDir === 'left' ? 'none' : 'none',
            borderBottom: 'none',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {step + 1}
            </div>
            <h3 className="text-sm font-bold text-foreground">{currentStep.title}</h3>
          </div>
          <button onClick={onComplete} className="text-muted-foreground hover:text-foreground p-1">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <p className="px-4 py-2 text-xs text-muted-foreground leading-relaxed">
          {currentStep.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-[10px] text-muted-foreground font-medium">
            {step + 1} of {tourSteps.length}
          </span>

          {/* Progress dots */}
          <div className="flex gap-1">
            {tourSteps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === step ? 'w-4 bg-primary' : i < step ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-1.5">
            {step > 0 && (
              <button onClick={prev} className="hms-btn-secondary px-2.5 py-1 rounded text-[10px] flex items-center gap-0.5">
                <ChevronLeft size={10} /> Back
              </button>
            )}
            <button onClick={next} className="hms-btn-primary px-2.5 py-1 rounded text-[10px] flex items-center gap-0.5">
              {step === tourSteps.length - 1 ? '✅ Done' : <>Next <ChevronRight size={10} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
