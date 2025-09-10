import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import Home from "./pages/Home";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistsPage from "./pages/ArtistsPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import Exhibitions from "./pages/Exhibitions";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b border-border bg-background/95 backdrop-blur-sm px-4">
                <SidebarTrigger />
              </header>
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/artworks" element={<ArtworksPage />} />
                  <Route path="/artwork/:id" element={<ArtworkDetail />} />
                  <Route path="/artists" element={<ArtistsPage />} />
                  <Route path="/artist/:id" element={<ArtistProfile />} />
                  <Route path="/exhibitions" element={<Exhibitions />} />
                  <Route path="/favorites" element={<Favorites />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
