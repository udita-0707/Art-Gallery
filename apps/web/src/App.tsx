import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CustomerLayout } from "./layouts/CustomerLayout";
import Home from "./pages/Home";
import ArtworksPage from "./pages/ArtworksPage";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistsPage from "./pages/ArtistsPage";
import ArtworkDetail from "./pages/ArtworkDetail";
import Exhibitions from "./pages/Exhibitions";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from "./providers/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" enableSystem attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/artworks" element={<ArtworksPage />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/exhibitions" element={<Exhibitions />} />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
