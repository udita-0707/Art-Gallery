import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ArtworkCard from '@/components/ArtworkCard';
import { useQuery } from '@tanstack/react-query';
import { getArtworks } from '@/lib/api';

const ArtworksPage = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Update search term from URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchParams]);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: getArtworks,
  });

  // Helper: Format artist name from email prefix
  const getArtistName = (artwork: any) => {
    const email = artwork.artist?.user?.email || '';
    if (email) {
      const prefix = email.split('@')[0];
      return prefix.split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return 'Unknown Artist';
  };

  // Helper: Get categories from artworks list dynamically
  const categoriesList = [...new Set(artworks.map((art: any) => art.category?.name || 'Uncategorized'))] as string[];
  const uniqueArtists = [...new Set(artworks.map((art: any) => getArtistName(art)))] as string[];

  // Filter artworks
  const filteredArtworks = artworks.filter((artwork: any) => {
    const matchesSearch = !searchTerm || 
      (artwork.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      getArtistName(artwork).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (artwork.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      (artwork.category?.name || '').toLowerCase() === selectedCategory.toLowerCase();

    const matchesArtist = selectedArtist === 'all' || 
      getArtistName(artwork).toLowerCase() === selectedArtist.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesArtist;
  });

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-background text-destructive">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Failed to load artworks collection.</p>
          <p className="text-sm text-muted-foreground">Please check database connectivity or server logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
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
            <div className="flex flex-1 max-w-md w-full relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks, artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
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
                  className="px-2"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-muted/20 border border-border rounded-lg animate-in fade-in duration-200">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Artist
                </label>
                <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                  <SelectTrigger>
                    <SelectValue placeholder="All artists" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All artists</SelectItem>
                    {uniqueArtists.map((artist) => (
                      <SelectItem key={artist} value={artist.toLowerCase()}>
                        {artist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedArtist('all');
                  }}
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
          <p className="text-muted-foreground text-sm">
            {isLoading ? 'Retrieving collection...' : `${filteredArtworks.length} artwork${filteredArtworks.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredArtworks.length === 0 ? (
          /* Empty State */
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
                  setSelectedCategory('all');
                  setSelectedArtist('all');
                }}
              >
                Clear Search & Filters
              </Button>
            </div>
          </div>
        ) : (
          /* Artworks Render */
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
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;