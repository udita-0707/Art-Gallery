import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Upload, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtists, getCategories, createArtwork, updateArtwork, getArtworkById } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';

const AdminArtworkForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Form states
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: artists = [], isLoading: isLoadingArtists } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: getArtists,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories,
  });

  const { data: artworkToEdit, isLoading: isLoadingArtwork } = useQuery({
    queryKey: ['artwork', id],
    queryFn: () => getArtworkById(id || ''),
    enabled: isEdit,
  });

  // Populate form if editing
  useEffect(() => {
    if (isEdit && artworkToEdit) {
      setTitle(artworkToEdit.title || '');
      setArtistId(artworkToEdit.artistId || '');
      setCategoryId(artworkToEdit.categoryId || '');
      setYear(artworkToEdit.year?.toString() || '');
      setPrice(artworkToEdit.price?.toString() || '');
      setMedium(artworkToEdit.medium || '');
      setDimensions(artworkToEdit.dimensions || '');
      setDescription(artworkToEdit.description || '');
      setImageUrl(artworkToEdit.imageUrl || artworkToEdit.image || '');
    }
  }, [isEdit, artworkToEdit]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const formMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken() || '';
      if (isEdit && id) {
        return updateArtwork({ id, data, token });
      } else {
        return createArtwork({ data, token });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: isEdit ? 'Artwork updated' : 'Artwork created',
        description: isEdit ? 'Artwork specifications updated successfully.' : 'Artwork cataloged successfully with AI tagging.',
      });
      navigate('/admin/artworks');
    },
    onError: (err: any) => {
      toast({
        title: 'Action failed',
        description: err.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistId || !categoryId) {
      toast({
        title: 'Missing Selection',
        description: 'Please select an artist and category.',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      title,
      description,
      price: Number(price) || 0,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      artistId,
      categoryId,
      medium,
      dimensions,
      year: Number(year) || new Date().getFullYear(),
    };

    formMutation.mutate(payload);
  };

  const getArtistName = (art: any) => {
    const email = art.user?.email || '';
    const prefix = email.split('@')[0];
    return prefix.split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (isEdit && isLoadingArtwork) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/artworks')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Artworks
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEdit ? 'Edit Artwork' : 'Add New Artwork'}</h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Edit and update artwork metadata' : 'Upload and catalog a new artwork'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Config */}
          <Card>
            <CardHeader>
              <CardTitle>Artwork Image URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL Address</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              {imageUrl ? (
                <div className="border border-border rounded-lg overflow-hidden aspect-[4/3] bg-muted flex items-center justify-center">
                  <img src={imageUrl || '/placeholder-artwork.png'} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-artwork.png'; }} />
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter image URL above to generate rendering preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Artwork title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              
              <div>
                <Label htmlFor="artist">Artist Selection</Label>
                {isLoadingArtists ? (
                  <Loader2 className="h-5 w-5 animate-spin mt-2" />
                ) : (
                  <select
                    id="artist"
                    value={artistId}
                    onChange={(e) => setArtistId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    required
                  >
                    <option value="">Choose artist...</option>
                    {artists.map((artist: any) => (
                      <option key={artist.id} value={artist.id}>
                        {getArtistName(artist)} ({artist.user?.email})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" placeholder="2024" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Artwork Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input id="medium" placeholder="Oil on canvas" value={medium} onChange={(e) => setMedium(e.target.value)} />
              </div>
              
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" placeholder="100 x 120 cm" value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                {isLoadingCategories ? (
                  <Loader2 className="h-5 w-5 animate-spin mt-2" />
                ) : (
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    required
                  >
                    <option value="">Choose category...</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the artwork..." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/artworks')}>
            Cancel
          </Button>
          <Button type="submit" disabled={formMutation.isPending}>
            {formMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
            ) : isEdit ? 'Update Artwork' : 'Save Artwork'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminArtworkForm;