import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { artworks } from '@/data/artworks';

const AdminArtworks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArtworks = artworks.filter(artwork =>
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artwork.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Artworks</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize gallery artworks
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Artwork
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artworks or artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artworks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id} className="overflow-hidden">
            <div className="aspect-square overflow-hidden">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold line-clamp-1">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">{artwork.artist.name}</p>
                <p className="text-sm text-muted-foreground">{artwork.year}</p>
                <Badge variant="secondary">{artwork.category}</Badge>
                {artwork.price && (
                  <p className="font-medium">${artwork.price.toLocaleString()}</p>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminArtworks;