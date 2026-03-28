import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import StudioFunctional from "./pages/StudioFunctional";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import { useEffect } from "react";

// Router - Studio is publicly accessible (no auth required on Vercel)
function Routes() {  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/studio"} component={StudioFunctional} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Handle /studio direct access - redirect to hash-based routing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === "/studio" && !hash) {
        window.location.href = "/#/studio";
        return;
      }
      if (path === "/dashboard" && !hash) {
        window.location.href = "/#/dashboard";
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
