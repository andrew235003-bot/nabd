import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Welcome from "./pages/Welcome.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Medical from "./pages/Medical.tsx";
import Home from "./pages/Home.tsx";
import Records from "./pages/Records.tsx";
import BloodBank from "./pages/BloodBank.tsx";
import Lab from "./pages/Lab.tsx";
import Assistant from "./pages/Assistant.tsx";
import FollowUp from "./pages/FollowUp.tsx";
import Scan from "./pages/Scan.tsx";
import Hospital from "./pages/Hospital.tsx";
import Pharmacy from "./pages/Pharmacy.tsx";
import FirstAid from "./pages/FirstAid.tsx";
import MedicalReport from "./pages/MedicalReport.tsx";
import Accessibility from "./pages/Accessibility.tsx";
import Alerts from "./pages/Alerts.tsx";
import Information from "./pages/Information.tsx";
import { VoiceIndicator } from "@/components/VoiceIndicator";
import { useReminderAlarms } from "@/hooks/useReminderAlarms";

const queryClient = new QueryClient();

const App = () => {
  useReminderAlarms();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/home" element={<Home />} />
            <Route path="/records" element={<Records />} />
            <Route path="/blood-bank" element={<BloodBank />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/follow-up" element={<FollowUp />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/first-aid" element={<FirstAid />} />
            <Route path="/medical-report" element={<MedicalReport />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/information" element={<Information />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <VoiceIndicator />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
