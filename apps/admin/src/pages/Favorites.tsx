import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { artworks } from '@/data/artworks';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  const loadFavorites = () => {
    const saved = localStorage.getItem('gallery-favorites');
    if (saved) {
      setFavoriteIds(JSON.parse(saved));
    } else {
      setFavoriteIds([]);
    }
  };
  
  useEffect(() => {
    loadFavorites();
  }, []);

  const favoriteArtworks = artworks.filter(artwork => favoriteIds.includes(artwork.id));

  const clearAllFavorites = () => {
    setFavoriteIds([]);
    localStorage.removeItem('gallery-favorites');
  };

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
                Your personal collection of beloved artworks
              </p>
            </div>
            
            {favoriteArtworks.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAllFavorites}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Favorites Content */}
        {favoriteArtworks.length > 0 ? (
          <div>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favoriteArtworks.length} artwork{favoriteArtworks.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteArtworks.map((artwork) => (
                <ArtworkCard 
                  key={artwork.id} 
                  artwork={artwork}
                  onFavoriteChange={loadFavorites}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <Card className="p-12 text-center max-w-md">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                No favorites yet
              </h3>
              
              <p className="text-muted-foreground mb-6">
                Start building your personal collection by adding artworks to your favorites
              </p>
              
              <Link to="/artworks">
                <Button className="gallery-button-primary">
                  Explore Artworks
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        {favoriteArtworks.length === 0 && (
          <div className="mt-16 bg-muted/20 rounded-lg p-8">
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