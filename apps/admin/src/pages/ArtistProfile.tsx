import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Instagram, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { artists, artworks } from '@/data/artworks';

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const artist = artists.find(a => a.id === id);
  const artistArtworks = artworks.filter(artwork => artwork.artist.id === id);

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
            <Card className="p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-playfair font-bold text-white">
                  {artist.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
                {artist.name}
              </h1>
              
              <div className="space-y-2 text-muted-foreground mb-6">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{artist.nationality}</span>
                </div>
                {artist.birthYear && (
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Born {artist.birthYear}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                {artist.website && (
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={artist.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                )}
                
                {artist.instagram && (
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <a 
                      href={`https://instagram.com/${artist.instagram.replace('@', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Instagram className="h-4 w-4" />
                      Follow on Instagram
                    </a>
                  </Button>
                )}
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
                  {artist.biography}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {artistArtworks.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Artworks
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {new Date().getFullYear() - (artist.birthYear || 1990)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Years Active
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 text-center">
                  <CardContent className="p-0">
                    <div className="text-2xl font-playfair font-bold text-accent mb-1">
                      {[...new Set(artistArtworks.map(a => a.category))].length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mediums
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
            Artworks by {artist.name}
          </h2>
          
          {artistArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">
                No artworks available for this artist yet.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;