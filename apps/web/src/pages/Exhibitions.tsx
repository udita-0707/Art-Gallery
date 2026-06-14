import { Calendar, MapPin, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { getExhibitions } from '@/lib/api';

const Exhibitions = () => {
  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: exhibitions = [], isLoading, error } = useQuery({
    queryKey: ['exhibitions'],
    queryFn: getExhibitions,
  });

  const currentExhibitions = exhibitions.filter((e: any) => e.status?.toUpperCase() === 'ACTIVE');
  const upcomingExhibitions = exhibitions.filter((e: any) => e.status?.toUpperCase() === 'UPCOMING');
  const pastExhibitions = exhibitions.filter((e: any) => e.status?.toUpperCase() === 'COMPLETED');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const ExhibitionCard = ({ exhibition }: { exhibition: any }) => (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
      exhibition.featured ? 'ring-2 ring-primary/20' : ''
    }`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <CardTitle className="font-playfair text-xl">{exhibition.title}</CardTitle>
              {exhibition.featured && (
                <Badge variant="secondary" className="text-xs">Featured</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{exhibition.location}</span>
            </div>
          </div>
          <Badge 
            variant={exhibition.status?.toUpperCase() === 'ACTIVE' ? 'default' : 
                     exhibition.status?.toUpperCase() === 'UPCOMING' ? 'secondary' : 'outline'}
            className="capitalize"
          >
            {exhibition.status?.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {exhibition.description}
        </p>
        
        {exhibition.curator && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Curator: {exhibition.curator}
            </span>
          </div>
        )}
        
        <div className="pt-4">
          <Button 
            variant={exhibition.status?.toUpperCase() === 'ACTIVE' ? 'default' : 'outline'}
            className="w-full"
          >
            {exhibition.status?.toUpperCase() === 'ACTIVE' ? 'Visit Exhibition' : 
             exhibition.status?.toUpperCase() === 'UPCOMING' ? 'Learn More' : 'View Archive'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="gallery-container">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exhibitions
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover our carefully curated exhibitions featuring exceptional artworks and talented artists
            </p>
          </div>
        </div>

        {error && (
          <div className="text-center py-12 text-destructive">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p className="text-lg font-semibold">Failed to fetch exhibitions list.</p>
            <p className="text-sm text-muted-foreground">Verify database integration and connection string.</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((s) => (
              <div key={s} className="space-y-6">
                <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(2).fill(null).map((_, i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-4 animate-pulse">
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-16 bg-muted rounded w-full" />
                      <div className="h-10 bg-muted rounded w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !error && (
          <>
            {/* Current Exhibitions */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                  Current Exhibitions
                </h2>
                <Badge variant="default" className="px-3 py-1">
                  {currentExhibitions.length} Active
                </Badge>
              </div>
              
              {currentExhibitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentExhibitions.map((exhibition) => (
                    <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No active exhibitions running at this moment.
                  </p>
                </Card>
              )}
            </section>

            {/* Upcoming Exhibitions */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                  Upcoming Exhibitions
                </h2>
                <Badge variant="secondary" className="px-3 py-1">
                  {upcomingExhibitions.length} Coming Soon
                </Badge>
              </div>
              
              {upcomingExhibitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {upcomingExhibitions.map((exhibition) => (
                    <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No upcoming exhibitions scheduled at this time. Check back soon!
                  </p>
                </Card>
              )}
            </section>

            {/* Past Exhibitions */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground">
                  Past Exhibitions
                </h2>
                <Badge variant="outline" className="px-3 py-1">
                  Archive
                </Badge>
              </div>
              
              {pastExhibitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pastExhibitions.map((exhibition) => (
                    <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No archived exhibitions cataloged.
                  </p>
                </Card>
              )}
            </section>
          </>
        )}

        {/* Newsletter Signup */}
        <section className="bg-muted/20 border border-border rounded-lg p-12 text-center">
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-4">
            Stay Updated on Exhibitions
          </h2>
          <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
            Be the first to know about new exhibitions, artist talks, and exclusive gallery events.
          </p>
          <Button className="gallery-button-accent px-8 py-3">
            Subscribe to Newsletter
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Exhibitions;