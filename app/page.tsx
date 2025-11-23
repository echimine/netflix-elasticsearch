'use client';

import { useHistory } from '@/hooks/useHistory';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/sections/Dashboard';
import { HistoryList } from '@/components/sections/HistoryList';
import { Analytics } from '@/components/sections/Analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, List, Home, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data, loading, error } = useHistory();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your viewing history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard data={data} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <HistoryList data={data} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Analytics data={data} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
