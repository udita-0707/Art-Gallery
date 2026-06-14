import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserButton, useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LogIn, Shield } from "lucide-react";
import { Outlet } from "react-router-dom";

export function CustomerLayout() {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background transition-colors duration-300">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 sticky top-0 z-40 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9 p-0" />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  {user?.publicMetadata?.role === 'ADMIN' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open('http://localhost:8081', '_blank')}
                      className="hidden sm:flex items-center gap-2 border-primary/25 text-xs font-semibold hover:bg-muted transition-all"
                    >
                      <Shield className="h-3.5 w-3.5 text-accent" />
                      Admin Console
                    </Button>
                  )}
                  <UserButton />
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSignIn()}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </header>
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
