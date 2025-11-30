'use client';

import { useHistory } from '@/hooks/useHistory';
import { Analytics } from '@/components/sections/Analytics';
import { Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { data, loading, error } = useHistory();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your viewing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-destructive mb-2 text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your viewing habits and trends.</p>
          </div>
          <Analytics data={data} />
        </div>
      </main>
    </div>
  );
}
