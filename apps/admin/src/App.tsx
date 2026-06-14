import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminArtworkForm from "./pages/admin/AdminArtworkForm";
import AdminArtists from "./pages/admin/AdminArtists";
import AdminExhibitions from "./pages/admin/AdminExhibitions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { UnauthorizedPage } from "./components/UnauthorizedPage";
import { ThemeProvider } from "./providers/ThemeProvider";

const queryClient = new QueryClient();

const AdminAppContent = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === 'ADMIN';

  if (!isAdmin) {
    return <UnauthorizedPage />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/artworks" element={<AdminArtworks />} />
        <Route path="/admin/artworks/new" element={<AdminArtworkForm />} />
        <Route path="/admin/artworks/edit/:id" element={<AdminArtworkForm />} />
        <Route path="/admin/artists" element={<AdminArtists />} />
        <Route path="/admin/exhibitions" element={<AdminExhibitions />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SignedIn>
            <AdminAppContent />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
