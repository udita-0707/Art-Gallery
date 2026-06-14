import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtworks, getFavorites, toggleFavorite } from '@/lib/api';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

const Favorites = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get artworks
  const { data: artworks = [], isLoading: isArtworksLoading } = useQuery({
    queryKey: ['artworks'],
    queryFn: getArtworks,
  });

  // Get favorites
  const { data: favoriteIds = [], isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const token = await getToken();
      return getFavorites(token);
    },
    enabled: !!isSignedIn && !!user?.id
  });

  const favoriteArtworks = artworks.filter((artwork: any) => favoriteIds.includes(artwork.id));

  // Clear all favorites mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken() || '';
      // Sequentially clear all favorites
      for (const id of favoriteIds) {
        await toggleFavorite({ artworkId: id, token });
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(['favorites', user?.id], []);
      toast({
        title: "Cleared collections",
        description: "All favorited artworks have been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Clear action failed",
        description: "There was a problem clearing your favorites. Please try again.",
        variant: "destructive"
      });
    }
  });

  const isLoading = isArtworksLoading || isFavoritesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading your custom collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="gallery-container">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
                My Favorites
              </h1>
              <p className="text-muted-foreground text-lg">
                Your personal curation of inspiring artworks
              </p>
            </div>
            
            {favoriteArtworks.length > 0 && (
              <Button 
                variant="outline" 
                disabled={clearAllMutation.isPending}
                onClick={() => clearAllMutation.mutate()}
                className="flex items-center gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {clearAllMutation.isPending ? 'Clearing...' : 'Clear All'}
              </Button>
            )}
          </div>
        </div>

        {/* Favorites Content */}
        {favoriteArtworks.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                Showing {favoriteArtworks.length} saved masterpiece{favoriteArtworks.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteArtworks.map((artwork) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Card className="p-12 text-center max-w-md bg-card border border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                No favorites yet
              </h3>
              
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Add artworks to your favorites list while browsing to build your customized collection.
              </p>
              
              <Link to="/artworks">
                <Button className="gallery-button-primary px-6">
                  Explore Artworks
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        {favoriteArtworks.length === 0 && (
          <div className="mt-16 bg-muted/20 border border-border/50 rounded-lg p-8">
            <h2 className="font-playfair text-xl font-semibold text-foreground mb-4">
              How to use Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <Heart className="h-4 w-4 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Save Artworks</h3>
                <p>Click the heart icon on any artwork to add it to your favorites</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-accent text-xs font-bold">★</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">Create Collections</h3>
                <p>Build your personal gallery of artworks that inspire you</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-accent text-xs font-bold">↗</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">Easy Access</h3>
                <p>Quickly find and revisit your favorite pieces anytime</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;