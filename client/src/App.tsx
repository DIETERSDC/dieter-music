import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Music } from "lucide-react";
import Home from "./pages/Home";
import StudioFunctional from "./pages/StudioFunctional";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import { useEffect } from "react";

function Router() {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Music className="w-12 h-12 mx-auto text-cyan-500 mb-4 animate-pulse" />
          <p className="text-foreground">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show studio routes, otherwise show home
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path={"/"} component={StudioFunctional} />
        <Route path={"/studio"} component={StudioFunctional} />
        <Route path={"/dashboard"} component={Dashboard} />
        <Route path={"/404"} component={NotFound} />
        <Route component={StudioFunctional} />
      </Switch>
    );
  }

  // Unauthenticated routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Handle /studio 404 by redirecting to hash-based routing
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      // If accessing /studio directly without hash, redirect to /#/studio
      if (path === "/studio" && !hash) {
        window.location.href = "/#/studio";
        return;
      }
      
      // If accessing /dashboard directly without hash, redirect to /#/dashboard
      if (path === "/dashboard" && !hash) {
        window.location.href = "/#/dashboard";
        return;
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
