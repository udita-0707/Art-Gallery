import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Artwork } from '@/types/gallery';
import { useToast } from '@/hooks/use-toast';

interface ArtworkCardProps {
  artwork: Artwork;
  size?: 'small' | 'medium' | 'large';
  onFavoriteChange?: () => void;
}

const ArtworkCard = ({ artwork, size = 'medium', onFavoriteChange }: ArtworkCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toast } = useToast();

  const sizeClasses = {
    small: 'aspect-[3/4]',
    medium: 'aspect-[4/5]',
    large: 'aspect-[3/4] md:aspect-[4/5]'
  };

  // Check if artwork is favorited on mount
  useEffect(() => {
    const saved = localStorage.getItem('gallery-favorites');
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.includes(artwork.id));
    }
  }, [artwork.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = localStorage.getItem('gallery-favorites');
    const favorites = saved ? JSON.parse(saved) : [];
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter((id: string) => id !== artwork.id);
      localStorage.setItem('gallery-favorites', JSON.stringify(updated));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${artwork.title} has been removed from your collection.`,
      });
      onFavoriteChange?.();
    } else {
      // Add to favorites
      const updated = [...favorites, artwork.id];
      localStorage.setItem('gallery-favorites', JSON.stringify(updated));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${artwork.title} has been added to your collection.`,
      });
      onFavoriteChange?.();
    }
  };

  return (
    <Card className="artwork-card group cursor-pointer">
      <Link to={`/artwork/${artwork.id}`}>
        <div className={`relative ${sizeClasses[size]} overflow-hidden`}>
          {/* Image */}
          <img             src={artwork.image || '/placeholder-artwork.png'}
            alt={artwork.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() = onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-artwork.png'; }}> setImageLoaded(true)}
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
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-900 hover:text-red-600"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-600' : ''}`} />
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
              by {artwork.artist.name}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{artwork.year}</span>
              <span className="capitalize">{artwork.category}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArtworkCard;