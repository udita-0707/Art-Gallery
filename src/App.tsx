import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminArtists from "./pages/admin/AdminArtists";
import AdminExhibitions from "./pages/admin/AdminExhibitions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient();

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLogin = location.pathname === '/admin/login';
  const {signInWithGithub, signOut, user} = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email;

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
          <header className="h-12 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4">
            <SidebarTrigger className="h-8 w-8 p-0" />
            <div className="flex items-center gap-2 text-sm font-medium">
              {user? (
                <div className="flex items-center space-x-4">
                  {user.user_metadata.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-black-300">{displayName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={signInWithGithub}
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
              {/* <LogIn className="h-4 w-4" onClick={signInWithGithub}/> */}
            </div>
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
              <Route path="/admin/artists" element={<AdminArtists />} />
              <Route path="/admin/exhibitions" element={<AdminExhibitions />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
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
