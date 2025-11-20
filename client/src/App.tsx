import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import MapPage from "@/pages/map";
import DashboardWithNav from "@/pages/dashboard-nav";
import UploadWithNav from "@/pages/upload-nav";
import ChatAssistant from "@/components/ChatAssistant";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={MapPage} />
      <Route path="/dashboard" component={DashboardWithNav} />
      <Route path="/upload" component={UploadWithNav} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatAssistant />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
