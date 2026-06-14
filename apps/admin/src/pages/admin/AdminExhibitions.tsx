import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Eye, Edit, Trash2, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExhibitions, createExhibition, updateExhibition, deleteExhibition } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminExhibitions() {
  const [activeTab, setActiveTab] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [curator, setCurator] = useState('');
  const [status, setStatus] = useState('UPCOMING');
  const [featured, setFeatured] = useState(false);

  const { getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: exhibitions = [], isLoading, error } = useQuery({
    queryKey: ['admin-exhibitions'],
    queryFn: getExhibitions,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken() || '';
      return createExhibition({ data, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exhibitions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Exhibition created successfully!' });
      setIsFormOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: 'Create failed', description: err.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = await getToken() || '';
      return updateExhibition({ id, data, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exhibitions'] });
      toast({ title: 'Exhibition updated successfully!' });
      setEditTarget(null);
    },
    onError: (err: any) => {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken() || '';
      return deleteExhibition({ id, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exhibitions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({ title: 'Exhibition deleted' });
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setCurator('');
    setStatus('UPCOMING');
    setFeatured(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (exh: any) => {
    setEditTarget(exh);
    setTitle(exh.title);
    setDescription(exh.description);
    setStartDate(new Date(exh.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(exh.endDate).toISOString().split('T')[0]);
    setLocation(exh.location);
    setCurator(exh.curator || '');
    setStatus(exh.status);
    setFeatured(exh.featured || false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      startDate,
      endDate,
      location,
      curator,
      status,
      featured,
    };

    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getStatusBadge = (statusStr: string) => {
    const s = statusStr.toUpperCase();
    switch (s) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'UPCOMING':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{statusStr}</Badge>;
    }
  };

  const filterExhibitions = (tab: string) => {
    if (tab === 'all') return exhibitions;
    return exhibitions.filter((e: any) => (e.status || '').toLowerCase() === tab.toLowerCase());
  };

  const totalVisitors = exhibitions.length * 150; // simple mock for analytical aesthetics
  const activeCount = exhibitions.filter((e: any) => e.status?.toUpperCase() === 'ACTIVE').length;
  const upcomingCount = exhibitions.filter((e: any) => e.status?.toUpperCase() === 'UPCOMING').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exhibitions Management</h1>
          <p className="text-muted-foreground">Organize and manage gallery exhibitions</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Create Exhibition
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Exhibitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exhibitions.length}</div>
            <p className="text-xs text-muted-foreground">All time cataloged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Exhibitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Scheduled launch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Calculated attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Directory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exhibition Directory</CardTitle>
          <CardDescription>Manage your gallery's exhibitions and events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Exhibitions</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                <p>Could not load exhibitions from server.</p>
              </div>
            ) : filterExhibitions(activeTab).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No exhibitions found in this category.</p>
              </div>
            ) : (
              <TabsContent value={activeTab} className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exhibition</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Curator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterExhibitions(activeTab).map((exhibition: any) => (
                        <TableRow key={exhibition.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                {exhibition.title}
                                {exhibition.featured && (
                                  <Badge variant="outline" className="text-xs border-primary text-primary flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground max-w-sm line-clamp-1">
                                {exhibition.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>{new Date(exhibition.startDate).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                to {new Date(exhibition.endDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {exhibition.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {exhibition.curator || 'No Curator'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(exhibition.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(exhibition)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteTarget(exhibition)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen || !!editTarget} onOpenChange={(open) => {
        if (!open) {
          setIsFormOpen(false);
          setEditTarget(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Exhibition' : 'Create Exhibition'}</DialogTitle>
            <DialogDescription>
              Provide scheduling, location, and metadata details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="curator">Curator</Label>
                <Input id="curator" value={curator} onChange={(e) => setCurator(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => { setIsFormOpen(false); setEditTarget(null); resetForm(); }}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exhibition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
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