import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Artwork } from '@/types/gallery';
import { useToast } from '@/hooks/use-toast';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, toggleFavorite } from '@/lib/api';

interface ArtworkCardProps {
  artwork: Artwork;
  size?: 'small' | 'medium' | 'large';
  onFavoriteChange?: () => void;
}

const ArtworkCard = ({ artwork, size = 'medium', onFavoriteChange }: ArtworkCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4] md:aspect-[4/5]'
  };

  // Fetch list of favorites from backend
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const token = await getToken();
      return getFavorites(token);
    },
    enabled: !!isSignedIn && !!user?.id
  });

  const isFavorite = favorites.includes(artwork.id);

  // Toggle favorite mutation
  const toggleMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken() || '';
      return toggleFavorite({ artworkId: artwork.id, token });
    },
    onSuccess: (updatedFavorites) => {
      queryClient.setQueryData(['favorites', user?.id], updatedFavorites);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${artwork.title} has been ${isFavorite ? 'removed from' : 'added to'} your collection.`,
      });
      onFavoriteChange?.();
    },
    onError: () => {
      toast({
        title: "Action failed",
        description: "There was a problem syncing your favorite status with the server.",
        variant: "destructive"
      });
    }
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Card className="artwork-card group cursor-pointer border border-border bg-card">
      <Link to={`/artwork/${artwork.id}`}>
        <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
          {/* Image */}
          <img
            src={artwork.imageUrl || artwork.image || '/placeholder-artwork.png'}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-artwork.png'; }}
            loading="lazy"
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={toggleMutation.isPending}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-900 hover:text-red-600"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-600' : ''} ${toggleMutation.isPending ? 'animate-pulse' : ''}`} />
          </Button>

          {/* View Link */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Price Badge */}
          {artwork.price && (
            <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full text-sm font-medium text-gray-900">
              ${artwork.price.toLocaleString()}
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="font-playfair text-lg font-semibold text-foreground line-clamp-1">
              {artwork.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              by {artwork.artist?.user?.email ? 
                artwork.artist.user.email.split('@')[0].split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 
                (artwork.artist?.name || 'Featured Artist')}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{artwork.year || new Date(artwork.createdAt || '').getFullYear() || 2024}</span>
              <span className="capitalize">
                {typeof artwork.category === 'object' ? (artwork.category as any).name : artwork.category}
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArtworkCard;