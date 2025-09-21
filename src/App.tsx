import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { AdminSidebar } from "./components/AdminSidebar";
import Home from "./pages/Home";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistsPage from "./pages/ArtistsPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import Exhibitions from "./pages/Exhibitions";
import Favorites from "./pages/Favorites";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArtworks from "./pages/admin/AdminArtworks";
import AdminArtworkForm from "./pages/admin/AdminArtworkForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLogin = location.pathname === '/admin/login';

  if (isAdminLogin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAdminRoute ? <AdminSidebar /> : <AppSidebar />}
        <main className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border bg-background/95 backdrop-blur-sm px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/artworks" element={<ArtworksPage />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/exhibitions" element={<Exhibitions />} />
              <Route path="/favorites" element={<Favorites />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/artworks" element={<AdminArtworks />} />
              <Route path="/admin/artworks/new" element={<AdminArtworkForm />} />
              <Route path="/admin/artists" element={<div>Admin Artists - Coming Soon</div>} />
              <Route path="/admin/exhibitions" element={<div>Admin Exhibitions - Coming Soon</div>} />
              <Route path="/admin/analytics" element={<div>Admin Analytics - Coming Soon</div>} />
              <Route path="/admin/settings" element={<div>Admin Settings - Coming Soon</div>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
