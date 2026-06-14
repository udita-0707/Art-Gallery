import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Palette, Users, Calendar, Heart, Search, LogOut, Sparkles, Shield, LogIn } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/artworks', label: 'Artworks', icon: Palette },
  { path: '/artists', label: 'Artists', icon: Users },
  { path: '/exhibitions', label: 'Exhibitions', icon: Calendar },
  { path: '/favorites', label: 'My Collections', icon: Heart },
];

const adminItems = [
  { path: '/admin', label: 'Admin Panel', icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isSignedIn } = useUser();
  const { openSignIn, signOut } = useClerk();

  const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress;

  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === 'collapsed';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/artworks?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="p-6 border-b border-border">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-playfair text-xl font-bold text-foreground">
                Spectrum Art
              </h1>
              <p className="text-sm text-muted-foreground">Art Collection</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {!isCollapsed && (
          <div className="mb-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search artworks, artists..."
                  className="pl-10 h-10 bg-muted/50 border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="h-11 px-3 rounded-lg">
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)} className="h-11 px-3 rounded-lg">
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {isSignedIn && user ? (
          !isCollapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl || ""} />
                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                  {displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 mx-auto" onClick={() => signOut()}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl || ""} />
                <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                  {displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          )
        ) : (
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 mx-auto" onClick={() => openSignIn()}>
            <LogIn className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}