import React, { useState } from 'react';
import { Check, ChevronRight, User, Shield, Building2, Stethoscope, Settings, Rocket } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Welcome to GUC HMS',
    subtitle: 'Hospital Management System',
    content: 'Welcome to the most comprehensive Hospital Management Software. This quick setup wizard will help you get familiar with the system and configure your workspace.',
    tips: ['Multi-branch hospital support', 'Role-based access control', 'Real-time dashboards & analytics'],
  },
  {
    icon: Building2,
    title: 'Select Your Branch',
    subtitle: 'Branch Configuration',
    content: 'You are currently logged into the Main Branch - Noida. You can switch branches anytime from the top navigation bar. Each branch maintains its own patient records, inventory, and billing.',
    tips: ['4 branches configured', 'Inter-branch transfer supported', 'Centralized MIS reporting'],
  },
  {
    icon: Stethoscope,
    title: 'Explore Modules',
    subtitle: 'Available Modules',
    content: 'GUC HMS provides comprehensive modules for every department — OPD, IPD, Pharmacy, Lab, Billing, and more. Navigate through the top bar to access each module.',
    tips: ['OPD & IPD Management', 'Pharmacy & Inventory', 'Lab & Investigations', 'Billing & Insurance'],
  },
  {
    icon: Shield,
    title: 'Security & 2FA',
    subtitle: 'Account Security',
    content: 'We recommend enabling Two-Factor Authentication (2FA) for enhanced security. Go to Settings → Security to enable Google Authenticator or SMS-based 2FA.',
    tips: ['Two-Factor Authentication', 'Session timeout: 30 mins', 'Audit trail for all actions', 'IP-based access control'],
  },
  {
    icon: Settings,
    title: 'Customize Settings',
    subtitle: 'System Preferences',
    content: 'Configure your print templates, SMS/Email notifications, rate lists, and department setup from the Settings module. Admins can manage user roles and permissions.',
    tips: ['Custom print templates', 'Automated SMS alerts', 'Configurable rate lists'],
  },
  {
    icon: Rocket,
    title: 'You\'re All Set!',
    subtitle: 'Start Working',
    content: 'Your workspace is ready. You can access this guide anytime from Settings → Help. For support, contact the IT department or raise a ticket from the Help Desk.',
    tips: ['24/7 Technical support', 'Regular system updates', 'Data backup every 6 hours'],
  },
];

const OnboardingStepper = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center">
      <div className="bg-card w-[700px] border border-border shadow-2xl">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">GUC HMS — Setup Wizard</h2>
            <p className="text-[10px] opacity-80">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <button onClick={onComplete} className="text-[10px] underline opacity-80 hover:opacity-100">Skip All</button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center px-4 py-3 bg-muted border-b border-border overflow-x-auto">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const completed = i < currentStep;
            const active = i === currentStep;
            return (
              <React.Fragment key={i}>
                <div className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-semibold whitespace-nowrap rounded
                  ${completed ? 'bg-green-600 text-white' : active ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
                  {completed ? <Check size={10} /> : <StepIcon size={10} />}
                  <span className="hidden sm:inline">{s.subtitle}</span>
                  <span className="sm:hidden">Step {i + 1}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-muted-foreground mx-1 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
              <Icon size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{step.content}</p>
              <div className="mt-3 grid grid-cols-2 gap-1">
                {step.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-foreground">
                    <Check size={10} className="text-green-600 shrink-0" /> {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="hms-btn-secondary disabled:opacity-40"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-primary' : i < currentStep ? 'bg-green-600' : 'bg-border'}`} />
            ))}
          </div>
          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="hms-btn-primary">
              Next Step →
            </button>
          ) : (
            <button onClick={onComplete} className="hms-btn-success">
              🚀 Start Using HMS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
