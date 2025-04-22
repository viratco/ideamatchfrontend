
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/RequireAuth";
import IdeaGenerator from "./pages/IdeaGenerator";
import NotFound from "./pages/NotFound";
import SubscriptionPage from "./pages/SubscriptionPage";
import UserProfile from "./pages/UserProfile";
import SavedIdeas from "./pages/SavedIdeas";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentsPage from "./pages/DocumentsPage";
import BillingPage from "./pages/BillingPage";
import BusinessPlanPage from "./pages/BusinessPlanPage";
import BusinessPlanWaitingPage from "./pages/BusinessPlanWaitingPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/idea-generator" element={<RequireAuth><IdeaGenerator /></RequireAuth>} />
            <Route path="/subscription" element={<RequireAuth><SubscriptionPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
            <Route path="/saved-ideas" element={<RequireAuth><SavedIdeas /></RequireAuth>} />
            <Route path="/analytics" element={<RequireAuth><AnalyticsPage /></RequireAuth>} />
            <Route path="/documents" element={<RequireAuth><DocumentsPage /></RequireAuth>} />
            <Route path="/billing" element={<RequireAuth><BillingPage /></RequireAuth>} />
            <Route path="/business-plan" element={<RequireAuth><BusinessPlanPage /></RequireAuth>} />
            <Route path="/business-plan-waiting" element={<RequireAuth><BusinessPlanWaitingPage /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
