import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
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
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
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
