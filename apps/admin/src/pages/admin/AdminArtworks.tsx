import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, ShieldCheck, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtworks, deleteArtwork, moderateArtwork } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminArtworks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: artworks = [], isLoading, error } = useQuery({
    queryKey: ['admin-artworks'],
    queryFn: getArtworks,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken() || '';
      return deleteArtwork({ id, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Artwork deleted successfully' });
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken() || '';
      return moderateArtwork({ id, token });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-artworks'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: updated.isModerated ? 'Artwork Approved' : 'Artwork Pending Moderation',
        description: `Successfully toggled status.`,
      });
    },
    onError: (err: any) => {
      toast({ title: 'Moderation action failed', description: err.message, variant: 'destructive' });
    },
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getArtistEmail = (art: any) => {
    return art.artist?.user?.email || 'Unknown Artist';
  };

  const getArtistName = (art: any) => {
    const email = art.artist?.user?.email || '';
    if (email) {
      const prefix = email.split('@')[0];
      return prefix.split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return 'Unknown Artist';
  };

  const filteredArtworks = artworks.filter((artwork: any) =>
    artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getArtistName(artwork).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getArtistEmail(artwork).toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="relative flex-1 max-w-sm">
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

      {/* Loading & Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          <p>Could not load artworks from server.</p>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No artworks found in database.</p>
        </div>
      ) : (
        /* Artworks Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArtworks.map((artwork: any) => (
            <Card key={artwork.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <div className="aspect-square overflow-hidden bg-muted">
                  <img                     src={artwork.imageUrl || artwork.image || '/placeholder-artwork.png'}
                    alt={artwork.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-artwork.png'; }} />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold line-clamp-1 flex-1">{artwork.title}</h3>
                    <Badge variant={artwork.isModerated ? "secondary" : "destructive"} className="ml-2 shrink-0">
                      {artwork.isModerated ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{getArtistName(artwork)}</p>
                  <p className="text-xs text-muted-foreground/60 line-clamp-1">{getArtistEmail(artwork)}</p>
                  {artwork.price && (
                    <p className="font-medium text-accent">${artwork.price.toLocaleString()}</p>
                  )}
                </CardContent>
              </div>
              <CardContent className="p-4 pt-0">
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/admin/artworks/edit/${artwork.id}`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => moderateMutation.mutate(artwork.id)}
                    disabled={moderateMutation.isPending}
                  >
                    {artwork.isModerated ? (
                      <><ShieldAlert className="mr-2 h-3 w-3 text-orange-500" />Block</>
                    ) : (
                      <><ShieldCheck className="mr-2 h-3 w-3 text-green-500" />Approve</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setDeleteTarget(artwork)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminArtworks;