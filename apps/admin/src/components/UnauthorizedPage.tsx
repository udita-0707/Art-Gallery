import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">403 - Forbidden</h1>
          <p className="text-muted-foreground text-sm">
            You do not have the required administrative permissions to access the Spectrum Management Console.
          </p>
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Button 
            className="w-full" 
            onClick={() => window.location.href = 'http://localhost:8082'}
          >
            Return to Gallery Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
