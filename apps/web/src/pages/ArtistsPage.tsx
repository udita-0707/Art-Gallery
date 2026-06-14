import { Link } from 'react-router-dom';
import { ExternalLink, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/lib/api';

const ArtistsPage = () => {
  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: getArtists,
  });

  const getArtistName = (artist: any) => {
    if (artist.user?.email) {
      const prefix = artist.user.email.split('@')[0];
      return prefix
        .split(/[._-]/)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Featured Artist';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground text-sm">Loading our curation of creators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Failed to load artists</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="gallery-container">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Artists
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Meet the talented creators behind our premium global museum-quality collection
            </p>
          </div>
        </div>

        {/* Artists Grid */}
        {artists.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3 animate-pulse" />
            <p className="text-muted-foreground font-medium">No artists registered yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for new curations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist: any) => {
              const name = getArtistName(artist);
              return (
                <Card key={artist.id} className="overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-card border border-border">
                  <CardHeader className="pb-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/80 to-accent/80 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner relative group-hover:scale-105 transition-transform duration-300">
                      <span className="text-2xl font-playfair font-bold text-white uppercase">
                        {name.split(' ').map((n: string) => n[0]).join('')}
                      </span>
                      {artist.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full border-2 border-card" title="Verified Creator">
                          <Award className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="font-playfair text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {name}
                      </h3>
                      <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mt-1">
                        {artist.artworks?.length || 0} Artworks Listed
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 text-center min-h-[60px]">
                      {artist.bio || 'Contemporary fine artist showcasing a refined selection of digital and traditional art formats.'}
                    </p>

                    <div className="pt-2">
                      <Link to={`/artist/${artist.id}`}>
                        <Button className="w-full gallery-button-primary flex items-center justify-center gap-2">
                          View Profile
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-muted/20 border border-border/50 rounded-lg p-12">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
            Interested in Showcasing Your Work?
          </h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            We're always looking for exceptional artists to join our collection. 
            Submit your portfolio for consideration.
          </p>
          <Button className="gallery-button-accent px-8 py-3">
            Submit Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;