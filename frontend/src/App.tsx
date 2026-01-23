import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Activity from "./pages/Activity";
import Projects from "./pages/Projects";
import Marketplace from "./pages/Marketplace";
import Learn from "./pages/Learn";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // avoid unnecessary refetches on window focus
      retry: 1,                    // retry failed requests once
      staleTime: 60000,            // cache data for 1 minute
    },
  },
});

// A simple utility function to read auth state from localStorage (or implement your own)
const isLoggedIn = () => {
  return localStorage.getItem("loggedIn") === "true";
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Signup page appears first at root if user NOT logged in */}
            <Route
              path="/"
              element={
                !isLoggedIn() ? <Signup /> : <Navigate to="/login" replace />
              }
            />
            {/* Login page accessible if signed up */}
            <Route
              path="/login"
              element={
                !isLoggedIn() ? <Login /> : <Navigate to="/index" replace />
              }
            />
            {/* Protected app routes */}
            <Route
              path="/index"
              element={
                isLoggedIn() ? <Index /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/activity"
              element={
                isLoggedIn() ? <Activity /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/projects"
              element={
                isLoggedIn() ? <Projects /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/marketplace"
              element={
                isLoggedIn() ? <Marketplace /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/learn"
              element={
                isLoggedIn() ? <Learn /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn() ? <Settings /> : <Navigate to="/" replace />
              }
            />
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;






// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import Activity from "./pages/Activity";
// import Projects from "./pages/Projects";
// import Marketplace from "./pages/Marketplace";
// import Learn from "./pages/Learn";
// import Settings from "./pages/Settings";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false, // avoid unnecessary refetches on window focus
//       retry: 1,                    // retry failed requests once
//       staleTime: 60000,            // cache data for 1 minute
//     },
//   },
// });

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/activity" element={<Activity />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/marketplace" element={<Marketplace />} />
//           <Route path="/learn" element={<Learn />} />
//           <Route path="/settings" element={<Settings />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;
