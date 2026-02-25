import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import OPD from "@/pages/OPD";
import IPD from "@/pages/IPD";
import Queue from "@/pages/Queue";
import Investigations from "@/pages/Investigations";
import DayCare from "@/pages/DayCare";
import Labs from "@/pages/Labs";
import Pharmacy from "@/pages/Pharmacy";
import PatientRegistration from "@/pages/PatientRegistration";
import Staff from "@/pages/Staff";
import Parking from "@/pages/Parking";
import Billing from "@/pages/Billing";
import BirthReg from "@/pages/BirthReg";
import Branches from "@/pages/Branches";
import MIS from "@/pages/MIS";
import Reports from "@/pages/Reports";
import Certificates from "@/pages/Certificates";
import Revisit from "@/pages/Revisit";
import Settings from "@/pages/Settings";
import AuditLogs from "@/pages/AuditLogs";
import TwoFactorSetup from "@/pages/TwoFactorSetup";
import OnboardingStepper from "@/components/OnboardingStepper";
import HiringBanner from "@/components/HiringBanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [wasLoggedOut, setWasLoggedOut] = useState(true);

  useEffect(() => {
    if (user && wasLoggedOut) {
      // User just logged in
      const hasOnboarded = localStorage.getItem(`hms_onboarded_${user.username}`);
      if (!hasOnboarded) {
        setShowOnboarding(true);
      } else {
        setShowBanner(true);
      }
      setWasLoggedOut(false);
    } else if (!user) {
      setWasLoggedOut(true);
      setShowOnboarding(false);
      setShowBanner(false);
    }
  }, [user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (user) {
      localStorage.setItem(`hms_onboarded_${user.username}`, 'true');
    }
    setShowBanner(true);
  };

  if (!user) return <Login />;

  return (
    <>
      {showOnboarding && <OnboardingStepper onComplete={handleOnboardingComplete} />}
      {showBanner && !showOnboarding && <HiringBanner onClose={() => setShowBanner(false)} />}
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/opd" element={<OPD />} />
          <Route path="/ipd" element={<IPD />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/daycare" element={<DayCare />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/birth-reg" element={<BirthReg />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/mis" element={<MIS />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/revisit" element={<Revisit />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/2fa-setup" element={<TwoFactorSetup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
