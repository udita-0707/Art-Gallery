import { Link, useLocation } from 'react-router-dom';
import { Home, Palette, Users, Calendar, Heart, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/artworks', label: 'Artworks', icon: Palette },
  { path: '/artists', label: 'Artists', icon: Users },
  { path: '/exhibitions', label: 'Exhibitions', icon: Calendar },
  { path: '/favorites', label: 'Favorites', icon: Heart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-sm"></div>
          {!isCollapsed && (
            <span className="font-playfair text-xl font-semibold text-foreground">
              Gallery
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Search Section */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Search</SidebarGroupLabel>}
          <SidebarGroupContent>
            {isCollapsed ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-full h-10 justify-center"
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <div className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search artworks..."
                    className="pl-10 h-10"
                  />
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          {!isCollapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}