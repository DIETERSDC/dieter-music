import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Music } from "lucide-react";
import Home from "./pages/Home";
import Studio from "./pages/Studio";
import StudioEnhanced from "./pages/StudioEnhanced";
import StudioProduction from "./pages/StudioProduction";
import Dashboard from "./pages/Dashboard";
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
  
  // Redirect authenticated users to Studio, others to Home
  if (isAuthenticated && typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    if (currentPath === "/" || currentPath === "") {
      window.location.href = "/studio";
      return null;
    }
  }
  
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/studio"} component={StudioProduction} />
      <Route path={"/studio-legacy"} component={StudioEnhanced} />
      <Route path={"/studio-old"} component={Studio} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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
