import { Link } from 'react-router-dom';
import { ExternalLink, Instagram, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { artists } from '@/data/artworks';

const ArtistsPage = () => {
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
              Meet the talented artists behind our exceptional collection
            </p>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <Card key={artist.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-playfair font-bold text-white">
                    {artist.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="font-playfair text-xl font-semibold text-foreground mb-1">
                    {artist.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {artist.nationality}
                    {artist.birthYear && ` • Born ${artist.birthYear}`}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {artist.biography}
                </p>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-2">
                  {artist.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <a 
                        href={artist.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                      </a>
                    </Button>
                  )}
                  
                  {artist.instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <a 
                        href={`https://instagram.com/${artist.instagram.replace('@', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Instagram className="h-3 w-3" />
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>

                <div className="pt-2">
                  <Link to={`/artist/${artist.id}`}>
                    <Button className="w-full gallery-button-primary">
                      View Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-muted/20 rounded-lg p-12">
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