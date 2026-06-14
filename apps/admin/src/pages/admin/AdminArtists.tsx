import { useState } from 'react';
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle, Loader2, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getArtists, deleteArtist, verifyArtist, updateArtist } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function AdminArtists() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editBio, setEditBio] = useState('');

  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Query ──────────────────────────────────────────────────────────────────
  const { data: artists = [], isLoading, error } = useQuery({
    queryKey: ['admin-artists'],
    queryFn: getArtists,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken() || '';
      return deleteArtist({ id, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Artist deleted', description: 'Artist and their artworks have been removed.' });
      setDeleteTarget(null);
    },
    onError: () => {
      toast({ title: 'Delete failed', description: 'Could not delete the artist.', variant: 'destructive' });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken() || '';
      return verifyArtist({ id, token });
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({
        title: updated.isVerified ? 'Artist verified' : 'Verification removed',
        description: updated.isVerified ? 'Artist is now verified on the platform.' : 'Artist verification has been revoked.',
      });
    },
    onError: () => {
      toast({ title: 'Action failed', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, bio }: { id: string; bio: string }) => {
      const token = await getToken() || '';
      return updateArtist({ id, data: { bio }, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast({ title: 'Artist updated', description: 'Bio has been saved.' });
      setEditTarget(null);
    },
    onError: () => {
      toast({ title: 'Update failed', variant: 'destructive' });
    },
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatName = (artist: any) => {
    const email = artist.user?.email || '';
    const prefix = email.split('@')[0];
    return prefix.split(/[._-]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const filteredArtists = artists.filter((a: any) => {
    const name = formatName(a).toLowerCase();
    const bio = (a.bio || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    return name.includes(q) || bio.includes(q);
  });

  const totalArtworks = filteredArtists.reduce((sum: number, a: any) => sum + (a.artworks?.length ?? 0), 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artists Management</h1>
          <p className="text-muted-foreground">Manage gallery artists and their information</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Artists', value: artists.length, sub: 'registered' },
          { label: 'Verified', value: artists.filter((a: any) => a.isVerified).length, sub: 'approved' },
          { label: 'Unverified', value: artists.filter((a: any) => !a.isVerified).length, sub: 'pending review' },
          { label: 'Total Artworks', value: artists.reduce((s: number, a: any) => s + (a.artworks?.length ?? 0), 0), sub: 'across all artists' },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{s.label}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Artists Directory</CardTitle>
          <CardDescription>Search and manage artist profiles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserX className="mx-auto h-8 w-8 mb-2" />
              <p>Could not load artists — ensure the server is running.</p>
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No artists found{searchTerm ? ' matching your search' : ' in the database'}.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artist</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead>Artworks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArtists.map((artist: any) => {
                    const name = formatName(artist);
                    const initials = name.split(' ').map((n: string) => n[0]).join('');
                    return (
                      <TableRow key={artist.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{name}</div>
                              <div className="text-xs text-muted-foreground">{artist.user?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                            {artist.bio || 'No bio provided.'}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{artist.artworks?.length ?? 0}</span>
                        </TableCell>
                        <TableCell>
                          {artist.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                          ) : (
                            <Badge variant="secondary">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="sm" title="View artworks" asChild>
                              <Link to={`/admin/artists`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title={artist.isVerified ? 'Remove verification' : 'Verify artist'}
                              disabled={verifyMutation.isPending}
                              onClick={() => verifyMutation.mutate(artist.id)}
                            >
                              {artist.isVerified
                                ? <XCircle className="h-4 w-4 text-orange-500" />
                                : <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit bio"
                              onClick={() => { setEditTarget(artist); setEditBio(artist.bio || ''); }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Delete artist"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(artist)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Artist</DialogTitle>
            <DialogDescription>
              Update the artist bio for {editTarget ? formatName(editTarget) : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              placeholder="Artist biography..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button
              disabled={updateMutation.isPending}
              onClick={() => updateMutation.mutate({ id: editTarget.id, bio: editBio })}
            >
              {updateMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artist</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deleteTarget ? formatName(deleteTarget) : ''}</strong> and all their artworks.
              This action cannot be undone.
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
}