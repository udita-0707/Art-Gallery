import { 
  LayoutDashboard, 
  Image, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Artworks', url: '/admin/artworks', icon: Image },
  { title: 'Artists', url: '/admin/artists', icon: Users },
  { title: 'Exhibitions', url: '/admin/exhibitions', icon: Calendar },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Placeholder for logout functionality
    navigate('/admin/login');
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-60"}>
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar-accent/50 p-4">
        {state !== "collapsed" && (
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Gallery Admin</h2>
            <p className="text-sm text-sidebar-muted-foreground">Management Panel</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <NavLink 
                       to={item.url} 
                       end={item.url === '/admin'}
                       className={({ isActive }) =>
                         isActive 
                           ? "bg-primary text-primary-foreground font-semibold shadow-sm ring-1 ring-primary/20" 
                           : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                       }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/30 p-4">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full justify-start border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {state !== "collapsed" && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}