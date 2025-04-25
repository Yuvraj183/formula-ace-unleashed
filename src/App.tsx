
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Subject from "./pages/Subject";
import Chapter from "./pages/Chapter";
import AISolver from "./pages/AISolver";
import TodoPage from "./pages/TodoPage";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />
    <Route
      path="/:subjectId"
      element={
        <ProtectedRoute>
          <Subject />
        </ProtectedRoute>
      }
    />
    <Route
      path="/:subjectId/:chapterId"
      element={
        <ProtectedRoute>
          <Chapter />
        </ProtectedRoute>
      }
    />
    <Route
      path="/ai-solver"
      element={
        <ProtectedRoute>
          <AISolver />
        </ProtectedRoute>
      }
    />
    <Route
      path="/todo"
      element={
        <ProtectedRoute>
          <TodoPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
