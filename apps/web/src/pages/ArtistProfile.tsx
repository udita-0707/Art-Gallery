import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Instagram, Calendar, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { useQuery } from '@tanstack/react-query';
import { getArtists, getArtworks } from '@/lib/api';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch all artists
  const { data: artists = [], isLoading: isArtistsLoading } = useQuery({
    queryKey: ['artists'],
    queryFn: getArtists,
  });

  // Fetch all artworks
  const { data: artworks = [], isLoading: isArtworksLoading } = useQuery({
    queryKey: ['artworks'],
    queryFn: getArtworks,
  });

  const artist = artists.find((a: any) => a.id === id);
  const artistArtworks = artworks.filter((artwork: any) => artwork.artistId === id);

  const getArtistName = (a: any) => {
    if (a?.user?.email) {
      const prefix = a.user.email.split('@')[0];
      return prefix
        .split(/[._-]/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Featured Creator';
  };

  const isLoading = isArtistsLoading || isArtworksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading portfolio profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-playfair text-2xl font-bold text-foreground mb-4">
            Artist Not Found
          </h1>
          <Link to="/artists">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Artists
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayName = getArtistName(artist);

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="gallery-container">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/artists">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Artist Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Card className="p-8 text-center bg-card border border-border">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner">
                <span className="text-4xl font-playfair font-bold text-white uppercase">
                  {displayName.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              
              <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
                {displayName}
              </h1>
              
              <div className="space-y-2 text-muted-foreground mb-6">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{artist.nationality || 'International'}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Verified Platform Creator</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(artist.website || 'https://google.com', '_blank')}
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Visit Website
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://instagram.com/${displayName.toLowerCase().replace(' ', '.')}`, '_blank')}
                >
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  Follow on Instagram
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Biography */}
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-4">
                  Biography
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {artist.bio || 'This verified contemporary creator explores unique compositions, blending multiple styles to reflect deep modern narratives across our curated exhibition formats.'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center bg-card border border-border">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {artistArtworks.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Artworks Listed
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center bg-card border border-border">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {artist.isVerified ? 'Verified' : 'Active'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Status
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center bg-card border border-border">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {[...new Set(artistArtworks.map(a => a.categoryId))].length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mediums / Categories
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Artworks */}
        <div>
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-8">
            Artworks by {displayName}
          </h2>
          
          {artistArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card border border-border">
              <Sparkles className="h-8 w-8 mx-auto text-muted-foreground mb-3 animate-pulse" />
              <p className="text-muted-foreground font-medium">
                No artworks currently listed for sale by this artist.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;