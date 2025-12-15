import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SourceToPay from "./pages/SourceToPay";
import LeadToCash from "./pages/LeadToCash";
import OpportunityDetail from "./pages/OpportunityDetail";
import HireToRetire from "./pages/HireToRetire";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/source-to-pay/*" element={<SourceToPay />} />
          <Route path="/lead-to-cash" element={<LeadToCash />} />
          <Route path="/lead-to-cash/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/lead-to-cash/*" element={<LeadToCash />} />
          <Route path="/hire-to-retire/*" element={<HireToRetire />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
