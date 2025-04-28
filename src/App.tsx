
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ModelsList from "./pages/ModelsList";
import ModelDetail from "./pages/ModelDetail";
import ModelForm from "./pages/ModelForm";
import StepDetail from "./pages/StepDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/models" element={<Layout><ModelsList /></Layout>} />
          <Route path="/models/create" element={<Layout><ModelForm /></Layout>} />
          <Route path="/models/:id" element={<Layout><ModelDetail /></Layout>} />
          <Route path="/models/:id/edit" element={<Layout><ModelForm /></Layout>} />
          <Route path="/models/:modelId/steps/:stepOrder" element={<Layout><StepDetail /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
