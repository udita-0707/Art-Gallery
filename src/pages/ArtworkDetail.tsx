import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ZoomIn, Calendar, Palette, Ruler, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ArtworkCard from '@/components/ArtworkCard';
import { artworks } from '@/data/artworks';

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  
  const artwork = artworks.find(a => a.id === id);
  const relatedArtworks = artworks
    .filter(a => a.id !== id && (a.artist.id === artwork?.artist.id || a.category === artwork?.category))
    .slice(0, 3);

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
              Back to Artworks
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
              className={`relative overflow-hidden rounded-lg bg-muted cursor-pointer transition-all duration-300 ${
                imageZoomed ? 'fixed inset-4 z-50 bg-black/95' : 'aspect-[4/5]'
              }`}
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                className={`w-full h-full object-contain transition-all duration-300 ${
                  imageZoomed ? 'scale-100' : 'object-cover'
                }`}
              />
              
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
              <Card className="p-6 bg-accent/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <p className="text-2xl font-playfair font-bold text-accent">
                      ${artwork.price.toLocaleString()}
                    </p>
                  </div>
                  <Button className="gallery-button-accent">
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
                    to={`/artist/${artwork.artist.id}`}
                    className="text-lg text-accent hover:underline font-medium"
                  >
                    by {artwork.artist.name}
                  </Link>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-red-600' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Badge variant="secondary" className="mb-4 capitalize">
                {artwork.category.replace('-', ' ')}
              </Badge>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Artwork Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Year</p>
                      <p className="text-sm text-muted-foreground">{artwork.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Medium</p>
                      <p className="text-sm text-muted-foreground">{artwork.medium}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Dimensions</p>
                      <p className="text-sm text-muted-foreground">{artwork.dimensions}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-fit">
                      {artwork.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Artist Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-lg font-playfair font-bold text-white">
                      {artwork.artist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-playfair text-lg font-semibold text-foreground mb-1">
                      {artwork.artist.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {artwork.artist.biography}
                    </p>
                    <Link to={`/artist/${artwork.artist.id}`}>
                      <Button variant="outline" size="sm">
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
              {relatedArtworks.map((relatedArtwork) => (
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