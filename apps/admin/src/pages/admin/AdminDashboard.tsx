import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Palette, Users, Calendar, Image, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';

const AdminDashboard = () => {
  const { getToken } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const token = await getToken();
      return getAdminStats(token || '');
    },
  });

  const statCards = [
    { title: 'Total Artworks', value: stats?.artworksCount ?? '—', icon: Image, color: 'text-blue-500' },
    { title: 'Artists', value: stats?.artistsCount ?? '—', icon: Users, color: 'text-green-500' },
    { title: 'Exhibitions', value: stats?.exhibitionsCount ?? '—', icon: Calendar, color: 'text-purple-500' },
    { title: 'Pending Moderation', value: stats?.pendingModerationCount ?? '—', icon: AlertCircle, color: 'text-orange-500' },
  ];

  const quickActions = [
    { title: 'Add New Artwork', href: '/admin/artworks/new', icon: Plus },
    { title: 'Manage Artists', href: '/admin/artists', icon: Users },
    { title: 'Manage Exhibitions', href: '/admin/exhibitions', icon: Calendar },
    { title: 'View Analytics', href: '/admin/analytics', icon: Palette },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your gallery content and exhibitions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                asChild
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Link to={action.href}>
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm text-center">{action.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Could not load stats — ensure the server is running and DATABASE_URL is set.
            </p>
          </CardContent>
        </Card>
      )}

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">{stats.artworksCount} Artworks in DB</Badge>
              <Badge variant="secondary">{stats.artistsCount} Verified Profiles</Badge>
              <Badge variant="secondary">{stats.exhibitionsCount} Exhibitions</Badge>
              <Badge variant={stats.pendingModerationCount > 0 ? 'destructive' : 'secondary'}>
                {stats.pendingModerationCount} Pending Review
              </Badge>
              <Badge variant="outline">{stats.usersCount} Total Users</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;