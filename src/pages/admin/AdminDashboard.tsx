import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Palette, Users, Calendar, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Artworks', value: '127', icon: Image },
    { title: 'Artists', value: '23', icon: Users },
    { title: 'Active Exhibitions', value: '3', icon: Calendar },
    { title: 'Collections', value: '8', icon: Palette },
  ];

  const quickActions = [
    { title: 'Add New Artwork', href: '/admin/artworks/new', icon: Plus },
    { title: 'Manage Artists', href: '/admin/artists', icon: Users },
    { title: 'Create Exhibition', href: '/admin/exhibitions/new', icon: Calendar },
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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
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

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New artwork added', item: 'Abstract Harmony #3', time: '2 hours ago' },
              { action: 'Exhibition updated', item: 'Modern Masters', time: '1 day ago' },
              { action: 'Artist profile updated', item: 'Sarah Chen', time: '3 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;