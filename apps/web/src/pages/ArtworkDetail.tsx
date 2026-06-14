import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ZoomIn, Calendar, Palette, Ruler, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ArtworkCard from '@/components/ArtworkCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtworkById, getArtworks, getFavorites, toggleFavorite } from '@/lib/api';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [imageZoomed, setImageZoomed] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch artwork details
  const { data: artwork, isLoading: isArtworkLoading } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => getArtworkById(id || ''),
    enabled: !!id
  });

  // 2. Fetch all artworks for related list
  const { data: artworks = [], isLoading: isArtworksLoading } = useQuery({
    queryKey: ['artworks'],
    queryFn: getArtworks
  });

  // 3. Fetch favorites to see if this is favorited
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const token = await getToken();
      return getFavorites(token);
    },
    enabled: !!isSignedIn && !!user?.id
  });

  const isFavorite = favorites.includes(id || '');

  // 4. Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken() || '';
      return toggleFavorite({ artworkId: id || '', token });
    },
    onSuccess: (updatedFavorites) => {
      queryClient.setQueryData(['favorites', user?.id], updatedFavorites);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${artwork?.title} has been ${isFavorite ? 'removed from' : 'added to'} your collection.`,
      });
    },
    onError: () => {
      toast({
        title: "Action failed",
        description: "There was a problem syncing your favorite status with the server.",
        variant: "destructive"
      });
    }
  });

  const handleFavoriteClick = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add artworks to your collection.",
      });
      openSignIn();
      return;
    }
    toggleMutation.mutate();
  };

  const getArtistName = (art: any) => {
    if (art?.artist?.user?.email) {
      const prefix = art.artist.user.email.split('@')[0];
      return prefix
        .split(/[._-]/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return art?.artist?.name || 'Featured Creator';
  };

  if (isArtworkLoading || isArtworksLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading artwork specifications...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground mb-4">
            Artwork Not Found
          </h1>
          <Link to="/artworks">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const artistName = getArtistName(artwork);
  const relatedArtworks = artworks
    .filter((a: any) => a.id !== id && (a.artistId === artwork.artistId || a.categoryId === artwork.categoryId))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="gallery-container">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/artworks">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="space-y-4">
            <div 
              className={`relative overflow-hidden rounded-lg bg-card border border-border cursor-pointer transition-all duration-300 ${
                imageZoomed ? 'fixed inset-4 z-50 bg-black/95' : 'aspect-[4/5]'
              }`}
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <img                 src={artwork.imageUrl || artwork.image || '/placeholder-artwork.png'}
                alt={artwork.title}
                className={`w-full h-full object-contain transition-all duration-300 ${
                  imageZoomed ? 'scale-100' : 'object-cover'
                }`}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-artwork.png'; }} />
              
              {!imageZoomed && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Button variant="secondary" size="lg">
                    <ZoomIn className="h-5 w-5 mr-2" />
                    View Full Size
                  </Button>
                </div>
              )}
              
              {imageZoomed && (
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageZoomed(false);
                  }}
                >
                  ×
                </Button>
              )}
            </div>
            
            {artwork.price && (
              <Card className="p-6 bg-accent/5 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Acquisition Price</p>
                    <p className="text-3xl font-playfair font-bold text-accent">
                      ${artwork.price.toLocaleString()}
                    </p>
                  </div>
                  <Button className="gallery-button-accent px-6">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Inquire
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {artwork.title}
                  </h1>
                  <Link 
                    to={`/artist/${artwork.artistId}`}
                    className="text-lg text-accent hover:underline font-medium"
                  >
                    by {artistName}
                  </Link>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={toggleMutation.isPending}
                    onClick={handleFavoriteClick}
                    className="border-border hover:bg-muted"
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-600' : ''} ${toggleMutation.isPending ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Badge variant="secondary" className="mb-4 capitalize">
                {artwork.category?.name || artwork.category || 'Fine Art'}
              </Badge>

              <p className="text-muted-foreground text-lg leading-relaxed mt-2">
                {artwork.description}
              </p>
            </div>

            {/* Specifications */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-playfair">
                  <Palette className="h-5 w-5 text-primary" />
                  Artwork Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Year</p>
                      <p className="text-sm font-medium text-foreground">{artwork.year || new Date(artwork.createdAt).getFullYear() || 2024}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Medium</p>
                      <p className="text-sm font-medium text-foreground">{artwork.medium || 'Oil and canvas'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Dimensions</p>
                      <p className="text-sm font-medium text-foreground">{artwork.dimensions || '100 × 120 cm'}</p>
                    </div>
                  </div>
                  
                  {artwork.aiTags && artwork.aiTags.length > 0 && (
                    <div className="col-span-2 mt-2 pt-2 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">AI Generated Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {artwork.aiTags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs font-medium bg-muted/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Artist Info */}
            <Card className="bg-card border border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-playfair font-bold text-lg uppercase shadow-inner">
                    {artistName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-playfair text-lg font-semibold text-foreground mb-1">
                      {artistName}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {artwork.artist?.bio || 'This verified platform artist curates high-end contemporary masterpieces featured exclusively within the Spectrum Art global showcase.'}
                    </p>
                    <Link to={`/artist/${artwork.artistId}`}>
                      <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                        View Artist Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Artworks */}
        {relatedArtworks.length > 0 && (
          <div>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-8">
              Related Artworks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArtworks.map((relatedArtwork: any) => (
                <ArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkDetail;