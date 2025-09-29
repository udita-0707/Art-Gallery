import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for exhibitions
const mockExhibitions = [
  {
    id: 1,
    title: 'Contemporary Visions',
    description: 'A showcase of modern artistic expressions',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    location: 'Main Gallery',
    artworksCount: 25,
    visitorsCount: 1250,
    status: 'Active',
    curator: 'Dr. Sarah Williams',
    featured: true
  },
  {
    id: 2,
    title: 'Digital Renaissance',
    description: 'Exploring digital art in the modern age',
    startDate: '2024-02-01',
    endDate: '2024-04-01',
    location: 'Digital Wing',
    artworksCount: 18,
    visitorsCount: 890,
    status: 'Active',
    curator: 'Marcus Chen',
    featured: false
  },
  {
    id: 3,
    title: 'Sculptures Through Time',
    description: 'A journey through sculptural history',
    startDate: '2023-11-01',
    endDate: '2024-01-01',
    location: 'Sculpture Hall',
    artworksCount: 12,
    visitorsCount: 2100,
    status: 'Completed',
    curator: 'Elena Rodriguez',
    featured: true
  },
  {
    id: 4,
    title: 'Future Landscapes',
    description: 'Upcoming exhibition featuring landscape art',
    startDate: '2024-04-01',
    endDate: '2024-06-01',
    location: 'East Wing',
    artworksCount: 0,
    visitorsCount: 0,
    status: 'Upcoming',
    curator: 'Dr. Sarah Williams',
    featured: false
  },
];

export default function AdminExhibitions() {
  const [exhibitions] = useState(mockExhibitions);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Upcoming':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
      case 'Completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterExhibitions = (status: string) => {
    if (status === 'all') return exhibitions;
    return exhibitions.filter(exhibition => exhibition.status.toLowerCase() === status);
  };

  const totalVisitors = exhibitions.reduce((sum, exhibition) => sum + exhibition.visitorsCount, 0);
  const activeExhibitions = exhibitions.filter(e => e.status === 'Active').length;
  const upcomingExhibitions = exhibitions.filter(e => e.status === 'Upcoming').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exhibitions Management</h1>
          <p className="text-muted-foreground">Organize and manage gallery exhibitions</p>
        </div>
        <Button className="flex items-center gap-2">
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
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Exhibitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeExhibitions}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingExhibitions}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All exhibitions</p>
          </CardContent>
        </Card>
      </div>

      {/* Exhibitions Management */}
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

            <TabsContent value={activeTab} className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exhibition</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Curator</TableHead>
                      <TableHead>Artworks</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterExhibitions(activeTab).map((exhibition) => (
                      <TableRow key={exhibition.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {exhibition.title}
                              {exhibition.featured && (
                                <Badge variant="outline" className="text-xs">Featured</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exhibition.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(exhibition.startDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              to {new Date(exhibition.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {exhibition.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {exhibition.curator}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{exhibition.artworksCount}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{exhibition.visitorsCount.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(exhibition.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}