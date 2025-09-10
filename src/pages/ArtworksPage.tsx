import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ArtworkCard from '@/components/ArtworkCard';
import { artworks } from '@/data/artworks';
import { ArtCategory, FilterOptions } from '@/types/gallery';

const ArtworksPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  // Update search term from URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  const categories: ArtCategory[] = ['painting', 'sculpture', 'photography', 'digital', 'mixed-media', 'drawing'];

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = !searchTerm || 
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filters.category || artwork.category === filters.category;
    const matchesArtist = !filters.artist || artwork.artist.name === filters.artist;
    
    return matchesSearch && matchesCategory && matchesArtist;
  });

  const uniqueArtists = [...new Set(artworks.map(artwork => artwork.artist.name))];

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="gallery-container">
        {/* Header */}
        <div className="space-y-6 mb-12">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Artwork Collection
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover our curated selection of contemporary and classical artworks
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-1 max-w-md">
              <Input
                placeholder="Search artworks, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>

              {/* View Mode */}
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/20 rounded-lg">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </label>
                <Select 
                  value={filters.category || ''} 
                  onValueChange={(value: ArtCategory) => 
                    setFilters(prev => ({ ...prev, category: value || undefined }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Artist
                </label>
                <Select 
                  value={filters.artist || ''} 
                  onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, artist: value || undefined }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All artists" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All artists</SelectItem>
                    {uniqueArtists.map((artist) => (
                      <SelectItem key={artist} value={artist}>
                        {artist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({})}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Artworks Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
        }>
          {filteredArtworks.map((artwork) => (
            <ArtworkCard 
              key={artwork.id} 
              artwork={artwork}
              size={viewMode === 'grid' ? 'medium' : 'large'}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredArtworks.length === 0 && (
          <div className="text-center py-16">
            <div className="space-y-4">
              <h3 className="font-playfair text-2xl font-semibold text-foreground">
                No artworks found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                }}
              >
                Clear Search & Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;