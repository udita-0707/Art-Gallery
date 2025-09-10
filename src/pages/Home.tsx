import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ArtworkCard from '@/components/ArtworkCard';
import { featuredArtworks, artists } from '@/data/artworks';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="gallery-container">
          <div className="text-center space-y-6">
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Discover Art That
              <br />
              <span className="exhibition-gradient bg-clip-text text-transparent">
                Moves You
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of contemporary artworks, meet talented artists, 
              and immerse yourself in the world of fine art.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/artworks">
                <Button className="gallery-button-primary px-8 py-3 text-base">
                  Explore Artworks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/exhibitions">
                <Button variant="outline" className="px-8 py-3 text-base">
                  Current Exhibitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-muted/30">
        <div className="gallery-container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Featured Artworks
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked masterpieces from our current collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/artworks">
              <Button variant="outline" className="px-8 py-3">
                View All Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="gallery-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardHeader>
                <Palette className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-2xl font-playfair">120+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Curated Artworks</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-2xl font-playfair">{artists.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Featured Artists</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <CardHeader>
                <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-2xl font-playfair">12</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Exhibitions This Year</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/20">
        <div className="gallery-container text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Join Our Art Community
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay updated with new exhibitions, artist spotlights, and exclusive events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/artists">
                <Button className="gallery-button-accent px-8 py-3">
                  Meet Our Artists
                </Button>
              </Link>
              <Link to="/exhibitions">
                <Button variant="outline" className="px-8 py-3">
                  View Exhibitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;