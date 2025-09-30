import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Exhibitions = () => {
  const exhibitions = [
    {
      id: '1',
      title: 'Contemporary Expressions',
      description: 'A showcase of modern artistic movements and contemporary voices shaping the art world today.',
      startDate: '2024-03-15',
      endDate: '2024-06-30',
      venue: 'Main Gallery, Level 1',
      artists: ['Marina Volkov', 'Alex Kim', 'Carlos Rivera'],
      status: 'current',
      featured: true
    },
    {
      id: '2',
      title: 'Timeless Portraits',
      description: 'An exploration of portraiture across different eras and artistic traditions.',
      startDate: '2024-04-01',
      endDate: '2024-07-15',
      venue: 'Portrait Gallery, Level 2',
      artists: ['Isabella Romano'],
      status: 'current',
      featured: false
    },
    {
      id: '3',
      title: 'Form and Function',
      description: 'Sculptural works that challenge our perception of space, material, and purpose.',
      startDate: '2024-05-10',
      endDate: '2024-08-20',
      venue: 'Sculpture Hall',
      artists: ['James Chen'],
      status: 'upcoming',
      featured: true
    },
    {
      id: '4',
      title: 'Impressionist Landscapes',
      description: 'Classic and contemporary landscape paintings inspired by the impressionist movement.',
      startDate: '2024-01-15',
      endDate: '2024-03-10',
      venue: 'East Wing Gallery',
      artists: ['Emma Thompson'],
      status: 'past',
      featured: false
    }
  ];

  const currentExhibitions = exhibitions.filter(e => e.status === 'current');
  const upcomingExhibitions = exhibitions.filter(e => e.status === 'upcoming');
  const pastExhibitions = exhibitions.filter(e => e.status === 'past');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const ExhibitionCard = ({ exhibition }: { exhibition: typeof exhibitions[0] }) => (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${
      exhibition.featured ? 'ring-2 ring-accent/20' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
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
              <span>{exhibition.venue}</span>
            </div>
          </div>
          <Badge 
            variant={exhibition.status === 'current' ? 'default' : 
                   exhibition.status === 'upcoming' ? 'secondary' : 'outline'}
            className="capitalize"
          >
            {exhibition.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {exhibition.description}
        </p>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Featured Artists: {exhibition.artists.join(', ')}
          </span>
        </div>
        
        <div className="pt-4">
          <Button 
            variant={exhibition.status === 'current' ? 'default' : 'outline'}
            className="w-full"
          >
            {exhibition.status === 'current' ? 'Visit Exhibition' : 
             exhibition.status === 'upcoming' ? 'Learn More' : 'View Archive'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pt-8">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
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
              <p className="text-muted-foreground text-lg">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastExhibitions.map((exhibition) => (
              <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-muted/20 rounded-lg p-12 text-center">
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