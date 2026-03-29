import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudioFunctional from "./pages/StudioFunctional";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Marketplace from "./pages/Marketplace";
import MySongs from "./pages/MySongs";
import { useEffect } from "react";

// Router with Sidebar Layout (Suno/Mureka style)
function Routes() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/studio" component={StudioFunctional} />
          <Route path="/my-songs" component={MySongs} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  // Handle direct path access - redirect to hash-based routing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // Redirect common paths to hash-based routes
      const pathRedirects: Record<string, string> = {
        '/studio': '/#/studio',
        '/dashboard': '/#/dashboard',
        '/marketplace': '/#/marketplace',
        '/my-songs': '/#/my-songs',
        '/pricing': '/#/pricing',
      };
      
      if (pathRedirects[path] && !hash) {
        window.location.href = pathRedirects[path];
        return;
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router hook={useHashLocation}>
            <Routes />
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
